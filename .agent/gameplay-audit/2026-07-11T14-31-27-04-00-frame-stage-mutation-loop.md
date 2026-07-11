# Gameplay Audit: Frame-Stage Mutation Loop

**Timestamp:** `2026-07-11T14-31-27-04-00`

## Summary

Gameplay mutations occur at several points inside one RAF callback without a shared command, tick or frame receipt. A collision failure or shard collection happens after `engine.tick()` and streaming, while rendering and diagnostics later sample the resulting mutable state.

## Plan ledger

**Goal:** identify every mutation stage that must contribute to one committed-frame result.

- [x] Trace input projection.
- [x] Trace simulation mutation.
- [x] Trace stream mutation.
- [x] Trace physics and collision mutation.
- [x] Trace pickup and outcome mutation.
- [x] Trace presentation consumption.
- [ ] Add typed per-stage receipts.
- [ ] Prove one frame cannot silently mix stages.

## Current mutation order

```txt
1. game.setInput
2. engine.tick(dt)
   - elapsed, yaw, route, region, speed, jump and position mutate
   - win can be committed
3. updateStreaming
   - controller focus, desired sets, release, generation and activation mutate
4. physics actor transform and step
5. collision admission
   - game.fail can commit run-over
6. pickup admission
   - collectShard can mutate score and active pickup projection
7. adapter.render
8. HUD projection
```

## Consequences

```txt
simulation has no explicit receipt
stream updates are not tied to a frame ID
physics contacts are not tied to the simulation tick
collision and pickup mutations occur outside engine.tick
win, fail and pickup events do not share one frame journal
render consumes only the final mutable state
host readback cannot explain which stage changed the state
```

A frame can also reach `win` during `engine.tick()` and still continue through streaming and rendering. The callback has no typed phase policy explaining which later mutations remain admissible after a terminal outcome.

## Required gameplay receipts

```txt
inputReceipt
simulationStepReceipt
streamUpdateReceipt
physicsStepReceipt
collisionAdmissionResult
pickupAdmissionResult
terminalOutcomeResult
presentationStateReceipt
```

Each receipt should contain:

```txt
runtimeSessionId
runSessionId
frameId
sequence
accepted/rejected/no-op
beforeFingerprint
afterFingerprint
events[]
reason
```

## Required invariants

```txt
all gameplay receipts in one frame share frameId
terminal outcome prevents later incompatible mutations
pickup refresh uses the post-collection state for the same frame
physics contacts identify the simulation and collider revisions consumed
render presentation derives after the final admitted gameplay mutation
host record contains the ordered gameplay receipts
```

## Fixture cases

```txt
normal movement frame
jump frame
patch release/activation frame
collision failure frame
shard collection frame
win threshold frame
collision and pickup candidate in same frame
render failure after gameplay mutation
```

No deterministic frame-stage claim is made until these cases produce ordered receipts and committed-frame evidence.