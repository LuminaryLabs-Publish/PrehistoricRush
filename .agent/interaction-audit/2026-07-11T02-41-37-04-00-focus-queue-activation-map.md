# Interaction Audit: Focus, Queue and Activation Map

**Timestamp:** `2026-07-11T02-41-37-04-00`

## Summary

Player input does not directly request patches. Movement changes the stream focus, which changes desired active and prefetch sets, generation priority, release IDs and ready delivery. This indirect chain has request IDs inside the controller/Worker protocol but no run/session epoch or activation result connecting player movement to the final terrain, collider and rendered state.

## Plan ledger

**Goal:** Map the causal interaction path from player intent to streamed-world mutation and identify the IDs and results needed for deterministic observation and stale-work rejection.

- [x] Map keyboard/button input.
- [x] Map run-state movement.
- [x] Map focus projection.
- [x] Map desired active/prefetch calculation.
- [x] Map generation requests and Worker responses.
- [x] Map release and activation delivery.
- [x] Map render/physics consumption.
- [x] Identify missing correlation fields.

## Causal interaction chain

```txt
keydown / keyup / button
  -> local input booleans or jump pulse
  -> game.setInput
  -> engine.tick
  -> RunState x/z/yaw/speed changes
  -> updateStreaming(state)
  -> controller.setFocus(position, velocity, forward)
  -> center patch coordinate changes
  -> controller.update()
  -> desiredActive and desiredPrefetch sets change
  -> active patches can enter released set
  -> queue priority changes
  -> controller.pump()
  -> generator request or Worker request
  -> patch response
  -> ready queue
  -> takeReadyPatches(maximum=1)
  -> adapter.activatePatch
  -> terrain/tree/grass/shard/collider/physics mutation
  -> render and HUD
```

## IDs currently available

```txt
runId                     game domain
controllerId              patch controller
requestId                 controller sequence
patchId                   x:z
cacheKey                  seed/version/coords/settings hashes
worldSeed                 controller config
generatorVersion          controller config
tree/shard/grass IDs      patch generator
```

## IDs not carried end to end

```txt
streamSessionId
controllerEpoch
workerEpoch
focusRevision
activationId
consumerCommitRevision
physicsColliderRevision
renderFrameId
hostSnapshotRevision
```

## Stale-work cases

### Restart while generation is inflight

`start()` resets the run but reuses the existing controller, Worker and pending executor requests. A late patch from the prior run can still enter the shared cache because requests are keyed by controller sequence and patch identity, not run/session identity. Since the world seed and generator settings are unchanged, content may be reusable, but the lifecycle decision is implicit and cannot distinguish safe cache reuse from stale activation.

### Controller reset or host remount

The controller can reset its maps, but pending Worker promises are owned by the message executor. The runtime does not retain or dispose that executor. A late response has no session epoch admission rule, and the host has no coordinated reset/remount path.

### Focus changes before result delivery

The controller correctly caches a result that is no longer desired and only returns ready patches still desired-active. This prevents most stale activations, but no diagnostic row records the request reason, original focus revision, completion focus revision and final admission decision.

## Missing interaction results

```txt
InputResult
RunStepResult
FocusUpdateResult
PatchGenerationRequest
PatchGenerationResult
PatchReadyAdmissionResult
PatchReleaseResult
PatchActivationResult
PatchConsumerParityResult
FrameConsumptionResult
```

These do not need to become separate heavyweight kits. A bounded stream lifecycle journal can represent them as typed rows with shared IDs.

## Recommended correlation tuple

```txt
runId
streamSessionId
focusRevision
requestId
patchId
cacheKey
activationId
consumerCommitRevision
frameId
```

## Recommended interaction policy

```txt
input and movement remain game-domain owned
focus changes remain controller inputs
cacheable content remains independent of runId
activation requests carry the current streamSessionId
late results may be cached by content identity
late results may not activate unless session and desired-set admission pass
consumer commit publishes one activation result
render/physics readback references the same activation revision
```

## Next safe ledge

```txt
PrehistoricRush Stream Correlation Journal
+ Restart / Late Worker Result Fixture Gate
```
