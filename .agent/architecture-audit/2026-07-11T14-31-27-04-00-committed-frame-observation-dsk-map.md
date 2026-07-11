# Architecture Audit: Committed Frame Observation DSK Map

**Timestamp:** `2026-07-11T14-31-27-04-00`

## Summary

The runtime has multiple valid domain owners, but no composed authority that correlates their accepted results into one committed browser frame. This audit defines that composition without moving simulation, streaming, physics, camera or rendering ownership into a second system.

## Plan ledger

**Goal:** establish a thin frame authority that records what each existing domain contributed and publishes only a fully committed observation.

- [x] Identify current owners.
- [x] Identify missing receipts and identities.
- [x] Define atomic and composite candidate kits.
- [x] Preserve existing domain ownership.
- [ ] Implement the frame record and adapters.
- [ ] Prove cross-domain coherence with fixtures.

## Existing owners

```txt
prehistoric-rush-domain-kit
  run state, input, movement, score, pickups and terminal outcomes

seeded-world-patch-controller-kit
  desired patch membership, cache, queue and ready/release delivery

Three product adapter
  terrain, trees, grass, pickups, creature, camera targets and render call

rapier-physics-domain-kit
  actor transform, fixed colliders, step and contacts

camera-smooth-follow-kit
  camera transform state

browser shell
  RAF scheduling, HUD and button projection

PrehistoricRushHost
  public diagnostics aggregation
```

## Missing composed domain

```txt
PrehistoricRush Committed Frame Observation Domain
```

This domain owns correlation and publication only. It must not own gameplay rules, patch generation, Rapier state, camera math or Three resources.

## Candidate atomic kits

```txt
runtime-frame-id-kit
  monotonic frame identity scoped to runtime and run sessions

frame-input-snapshot-kit
  immutable admitted input used by one simulation step

simulation-step-receipt-kit
  dt, tick identity, before/after run fingerprint and emitted events

stream-consumption-receipt-kit
  ready/released patch IDs, stream epoch and membership revision

collider-membership-receipt-kit
  active collider revision and retirement acknowledgement

physics-step-receipt-kit
  actor transform, physics dt, contact sequence and physics revision

gameplay-mutation-receipt-kit
  collision, pickup and outcome results applied during the frame

presentation-state-kit
  immutable world/HUD data derived after gameplay mutation

camera-consumption-receipt-kit
  camera target, transform and controller revision consumed by rendering

render-submit-result-kit
  renderer submission status, dimensions and render source fingerprint

hud-commit-result-kit
  HUD/button projection status and presentation fingerprint

frame-failure-result-kit
  typed failed stage, error summary and predecessor committed frame
```

## Candidate composite kits

```txt
committed-frame-record-kit
  composes all successful receipts into one immutable record

frame-journal-kit
  bounded committed and failed frame history

host-frame-read-model-kit
  detached JSON-safe public projection of the last committed frame

committed-frame-coherence-fixture-kit
  executes success, render failure, HUD failure and interleaved readback cases
```

## Canonical frame record

```txt
runtimeSessionId
runSessionId
streamEpoch
frameId
requestedAt
acceptedDt
inputFingerprint
simulationReceipt
streamReceipt
colliderReceipt
physicsReceipt
gameplayReceipts[]
presentationFingerprint
cameraReceipt
renderResult
hudResult
committedAt
frameFingerprint
```

## Composition sequence

```txt
RAF adapter begins frame
  -> frame authority allocates frameId
  -> existing game owner ticks and returns receipt
  -> existing stream owner updates and returns receipt
  -> existing physics owner steps and returns receipt
  -> product gameplay adapters return mutation receipts
  -> presentation adapter derives immutable presentation state
  -> existing camera owner returns consumed transform receipt
  -> Three adapter returns render submission result
  -> shell returns HUD commit result
  -> frame authority publishes committed-frame record
  -> host projects detached record
```

## Dependency order

```txt
route/profile authority
  -> patch activation/release authority
  -> fixed collider retirement and collision admission
  -> committed frame observation
  -> shared run/session/stream epochs
  -> lifecycle and disposal
```

Frame observation can be introduced before full rollback support, but it must clearly distinguish `mutated` from `committed`. A failed render must not advance the public committed-frame pointer.

## Acceptance conditions

```txt
one RAF callback allocates at most one frameId
one committed frame references exactly one run and stream epoch
all included receipts share frameId and runSessionId
render and HUD success are required before publication
failed stages create a failure result, not a committed frame
host reads one detached immutable record
host cannot mix current game, stream and camera snapshots
frame journal is bounded and JSON-safe
```
