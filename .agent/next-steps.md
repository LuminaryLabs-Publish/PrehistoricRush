# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T17-39-47-04-00`

## Summary

Complete route/profile, patch activation and collider authority first. Then add world-readiness and movement admission so gameplay cannot outrun the patch consumers required by its next movement step. Committed-frame, reset-epoch and lifecycle work should consume that result rather than invent parallel world identities.

## Plan ledger

**Goal:** produce a route-safe, patch-consistent, collision-provable, stream-ready, frame-coherent and atomically restartable game.

- [ ] Complete P0 route/page/profile authority.
- [ ] Complete P1 patch activation and release transactions.
- [ ] Complete P1a exact collider retirement and collision admission.
- [ ] Implement P1b world readiness and movement admission.
- [ ] Complete P2 committed-frame observation and detached host readback.
- [ ] Implement P3 run/stream/collider/Worker/frame epoch reset authority.
- [ ] Complete P4 startup rollback, resource ownership and disposal.
- [ ] Gate deployment on Node, browser and Pages fixtures.

## Ordered implementation queue

```txt
1. Route Manifest + Profile Handoff Authority
2. Patch Activation / Release Commit Authority
3. Exact Collider Replacement + Collision Admission
4. World Readiness + Movement Admission Authority
5. Committed Frame Observation + Host Read Model
6. Run / Stream / Collider / Worker / Frame Epoch Reset Authority
7. Runtime Lifecycle + Ordered Disposal
```

## P1b implementation sequence

### 1. Define the required corridor

```txt
RequiredCorridor {
  runSessionId
  streamEpoch
  origin
  predictedEnd
  routeIndexRange
  patchIds
  safetyHorizonSeconds
  fingerprint
}
```

Keep this smaller and stricter than desired, retained or prefetched membership.

### 2. Add readiness receipts

Each required patch must report:

```txt
patch content identity
controller membership revision
terrain consumer revision
height source revision
collider descriptor revision
Rapier membership revision
pickup consumer revision
render consumer revision
```

### 3. Classify readiness

```txt
READY
DEGRADED_DECLARED
SPEED_CAPPED
DEFERRED
FAILED
```

Silent fallback-height consumption is not an accepted state.

### 4. Move admission before simulation mutation

```txt
input snapshot
  -> corridor prediction
  -> readiness evaluation
  -> movement policy
  -> engine simulation application
  -> physics step
  -> render and HUD
  -> committed frame record
```

### 5. Preserve deterministic runner feel

- [ ] Use a bounded look-ahead horizon.
- [ ] Cap speed before the readiness frontier rather than freezing too late.
- [ ] Keep steering/jump input responsive while forward motion is deferred by policy.
- [ ] Surface detached readiness state in HUD diagnostics.
- [ ] Resume full speed only after consumer commit acknowledgement.

### 6. Reject stale and partial evidence

- [ ] Reject Worker results from another stream epoch.
- [ ] Reject partial patch activation as movement-ready.
- [ ] Reject collider or render receipts for another patch revision.
- [ ] Reject frame commit when world readiness changed during submission.

## Required fixtures

```bash
node scripts/prehistoric-rush-required-corridor-fixture.mjs
node scripts/prehistoric-rush-delayed-patch-movement-fixture.mjs
node scripts/prehistoric-rush-reordered-patch-delivery-fixture.mjs
node scripts/prehistoric-rush-partial-consumer-readiness-fixture.mjs
node scripts/prehistoric-rush-fallback-height-policy-fixture.mjs
node scripts/prehistoric-rush-readiness-speed-cap-fixture.mjs
node scripts/prehistoric-rush-readiness-rollback-fixture.mjs
node scripts/prehistoric-rush-world-frame-parity-fixture.mjs
node scripts/prehistoric-rush-browser-stream-latency-smoke.mjs
node scripts/prehistoric-rush-pages-stream-latency-smoke.mjs
```

## Acceptance conditions

```txt
movement never enters an uncommitted required patch
fallback height is either removed from movement authority or explicitly classified
terrain, collision, pickups and rendering share the admitted patch revision
stream lag results in deterministic cap/defer behavior
no late patch can introduce an invisible-before-visible obstacle contradiction
HUD and host report the same readiness revision as the visible frame
```

## Do not do next

Do not add a second streamer, movement loop, height generator or collision system. Do not equate controller desired membership with readiness. Do not make all retained or prefetched patches blocking requirements; only the bounded required corridor gates movement.
