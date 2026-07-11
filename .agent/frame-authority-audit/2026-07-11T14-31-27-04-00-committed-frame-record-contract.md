# Frame Authority Audit: Committed Frame Record Contract

**Timestamp:** `2026-07-11T14-31-27-04-00`

## Summary

A committed frame is the smallest trustworthy public observation of the runner. It must prove that simulation, streaming, physics, gameplay, camera, Three rendering and HUD projection all consumed one correlated state.

## Plan ledger

**Goal:** define a monotonic, immutable and JSON-safe frame contract that can be implemented without creating a second simulation or rendering owner.

- [x] Define frame identity and lifecycle.
- [x] Define required receipts.
- [x] Define success and failure publication rules.
- [x] Define host projection and bounded journal behavior.
- [ ] Implement the frame coordinator and adapters.
- [ ] Add executable fixtures.

## Frame lifecycle

```txt
ALLOCATED
  -> SIMULATED
  -> STREAMED
  -> PHYSICS_STEPPED
  -> GAMEPLAY_APPLIED
  -> PRESENTATION_DERIVED
  -> RENDERED
  -> HUD_COMMITTED
  -> COMMITTED

Any stage may transition to FAILED.
FAILED never advances the committed-frame pointer.
```

## Canonical identity

```txt
runtimeSessionId
runSessionId
streamEpoch
frameId
predecessorFrameId
```

`frameId` is monotonic within one runtime session. A retry advances `runSessionId`; it must not reuse a predecessor run's frame identity.

## Required receipts

```txt
input
simulation
stream
colliderMembership
physics
gameplay[]
presentation
camera
render
hud
```

Every receipt must include the canonical identity, sequence, status, source owner and a bounded fingerprint.

## Commit policy

```txt
commit candidate only when:
  simulation accepted
  stream update completed or typed no-op
  physics completed or typed unavailable policy accepted
  gameplay mutations resolved
  presentation state derived
  camera receipt accepted
  render result accepted
  HUD result accepted
```

## Failure policy

```txt
frameFailureResult:
  canonical identity
  failedStage
  reasonCode
  bounded message
  predecessorCommittedFrameId
  mutationMayHaveOccurred
  owner snapshots required for recovery
```

The current product mutates state before rendering. Until staged simulation exists, `mutationMayHaveOccurred` must be truthful. Diagnostics must distinguish the current mutable owner state from the last committed frame.

## Host read model

```txt
{
  runtimeSessionId,
  runSessionId,
  lifecyclePhase,
  lastCommittedFrame,
  lastFrameFailure,
  versions
}
```

The record must be detached, deeply immutable at publication, bounded and JSON-safe. It must not expose mutable engine, physics, controller, camera or renderer owners.

## Journal policy

```txt
committed frames retained: bounded ring buffer
failed frames retained: bounded ring buffer
large route/geometry arrays: fingerprints and counts only
error stacks: omitted or bounded
owner objects/functions/DOM nodes: prohibited
```

## Acceptance conditions

```txt
one candidate frame has one terminal result
committed frame IDs never decrease or repeat
receipts cannot cross run/session boundaries
render and HUD success are mandatory
host reads cannot observe a partially built candidate
failed frame preserves prior committed pointer
retry creates a new run identity
record round-trips through JSON
```

## Fixture matrix

```txt
first successful frame
steady-state movement frame
stream activation frame
collision failure frame
pickup frame
win frame
render failure
HUD failure
host read during every stage
retry and stale predecessor receipt
JSON serialization and bounded journal
```
