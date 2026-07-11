# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T15-59-12-04-00`

## Summary

Complete route/profile authority first, then transactional patch and collider ownership, then committed-frame observation. Build the run/reset epoch transaction on those typed results so retry can transfer one coherent world rather than resetting only `RunState`.

## Plan ledger

**Goal:** produce a route-safe, profile-bound, patch-consistent, collision-provable, frame-coherent and atomically restartable game without adding parallel owners.

- [ ] Complete P0 route/page/profile authority.
- [ ] Complete P1 patch activation and release transactions.
- [ ] Complete P1a exact collider retirement and collision admission.
- [ ] Complete P2 committed-frame observation and detached host readback.
- [ ] Implement P3 run/stream/collider/Worker/frame epoch reset authority.
- [ ] Complete P4 startup rollback, resource ownership and disposal.
- [ ] Gate deployment on Node, browser and Pages fixtures.

## Ordered implementation queue

```txt
1. Route Manifest + Profile Handoff Authority
2. Patch Activation / Release Commit Authority
3. Exact Collider Replacement + Collision Admission
4. Committed Frame Observation + Host Read Model
5. Run / Stream / Collider / Worker / Frame Epoch Reset Authority
6. Runtime Lifecycle + Ordered Disposal
```

## P3 implementation sequence

### 1. Introduce authority identities

```txt
runtimeSessionId
runSessionId
runEpoch
streamEpoch
colliderEpoch
workerGeneration
frameEpoch
```

Do not infer these identities from route names, numeric `runId`, patch IDs or RAF counters.

### 2. Replace direct `start()` with a command

```txt
ResetRunCommand {
  commandId
  expectedRuntimeSessionId
  expectedPredecessorRunSessionId
  reason: start | retry | run-again
}
```

Return a typed accepted, rejected, duplicate or failed result.

### 3. Build a non-mutating plan

The plan must state:

```txt
new identities
cache preservation policy
active patch reprojection policy
Worker quarantine policy
collider replacement policy
actor reset
game and browser input reset
pickup reprojection
camera reset
frame/read-model reset
rollback steps
```

### 4. Quarantine old asynchronous work

- [ ] Reject Worker responses whose generation or stream epoch is stale.
- [ ] Reject ready/release claims from the predecessor stream.
- [ ] Reject contacts from a predecessor collider epoch.
- [ ] Reject frame receipts from a predecessor frame epoch.
- [ ] Revoke old host mutation capabilities.

### 5. Rebuild run-scoped projections

Even when active patch IDs remain unchanged:

- [ ] Recompute `view.pickups` from the new collected-shard ledger.
- [ ] Recompute shard instance buffers.
- [ ] Recompute collider descriptors and exact Rapier membership.
- [ ] Rebind height, terrain and tree membership to the new stream epoch.
- [ ] Clear external keyboard booleans.
- [ ] Reset actor and camera.
- [ ] Clear terminal collision and frame observations.

### 6. Commit atomically

```txt
prepare every consumer
  -> validate every receipt
  -> commit one authority transfer
  -> publish one ResetRunResult
  -> resume frame admission
  -> commit first visible new-run frame
```

If any required consumer fails, preserve the prior terminal run and dispose staged work.

## Required fixtures

```bash
node scripts/prehistoric-rush-retry-pickup-reset-fixture.mjs
node scripts/prehistoric-rush-stale-worker-epoch-fixture.mjs
node scripts/prehistoric-rush-stale-contact-epoch-fixture.mjs
node scripts/prehistoric-rush-input-reset-fixture.mjs
node scripts/prehistoric-rush-reset-rollback-fixture.mjs
node scripts/prehistoric-rush-reset-idempotency-fixture.mjs
node scripts/prehistoric-rush-first-frame-run-epoch-fixture.mjs
node scripts/prehistoric-rush-browser-retry-parity-smoke.mjs
node scripts/prehistoric-rush-pages-retry-parity-smoke.mjs
```

## Acceptance conditions

```txt
new run has a new runSessionId and epoch family
same deterministic world cache may be reused without reusing mutable membership
all pickups are reprojected from new run state
all external and engine input starts neutral
old Worker/contact/frame evidence is rejected
Rapier and render membership cite the same new epochs
canvas, HUD and host cite the first committed new-run frame
failed reset does not partially replace the terminal run
```

## Do not do next

Do not solve retry by recreating a second engine loop beside the existing one. Do not treat camera `runId` reset as shared run authority. Do not clear immutable patch cache unless policy requires it; rebind mutable consumers instead.
