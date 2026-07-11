# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T14-31-27-04-00`

## Summary

Finish route/profile authority first. Then complete transactional patch activation/release and exact collider retirement. After those results are typed, add committed-frame observation so simulation, streaming, physics, gameplay, camera, canvas, HUD and diagnostics share one frame record. Preserve shared epoch and lifecycle work as downstream ownership gates.

## Plan ledger

**Goal:** reach a route-safe, patch-consistent, collision-provable and frame-coherent product without creating parallel runtime owners.

- [ ] Complete P0 route/profile handoff.
- [ ] Complete patch activation and release acknowledgements.
- [ ] Add exact Rapier collider replacement and typed collision admission.
- [ ] Add committed-frame IDs and per-stage receipts.
- [ ] Replace live host aggregation with a detached frame read model.
- [ ] Establish shared runtime/run/stream/collider epochs.
- [ ] Complete startup rollback, disposal and host revocation.
- [ ] Add executable Node, browser and Pages fixtures.

## Phase 0: route and profile authority

- [ ] Add valid `game.html` and `charactercreator.html` hosts.
- [ ] Add a versioned route/page manifest and deployed route checks.
- [ ] Make one committed profile fingerprint the game creature source.
- [ ] Bind profile identity to creature body, collision and frame evidence.
- [ ] Add conflict-safe profile writes and complete creator commits.

## Phase 1: patch activation and release

- [ ] Prepare terrain, trees, grass, pickups, colliders and height changes off to the side.
- [ ] Validate patch ownership and content hashes.
- [ ] Commit all consumers under one patch membership revision.
- [ ] Return typed activation and release results.
- [ ] Wait for every consumer retirement acknowledgement before release completion.

## Phase 1a: collider retirement and collision admission

- [ ] Add authoritative fixed-collider replacement to the pinned Rapier ProtoKit.
- [ ] Remove retired collider instances and fixed bodies from Rapier.
- [ ] Keep serialized and live collider membership identical.
- [ ] Add contact actor, collider, patch, membership and source identity.
- [ ] Reject retired and prior-epoch contacts.
- [ ] Admit at most one terminal failure result per run.
- [ ] Remove the fallback collision authority or prove exact parity.

## Phase 2: committed frame observation

- [ ] Allocate one monotonic `frameId` per admitted RAF candidate.
- [ ] Snapshot input once per frame.
- [ ] Return a simulation-step receipt.
- [ ] Return stream and collider membership receipts.
- [ ] Return a physics-step receipt.
- [ ] Return ordered collision, pickup and terminal outcome receipts.
- [ ] Derive immutable presentation state after gameplay mutation.
- [ ] Return a camera-consumption receipt.
- [ ] Wrap Three rendering in a typed render result.
- [ ] Wrap HUD/button projection in a typed commit result.
- [ ] Publish a committed frame only after render and HUD success.
- [ ] Publish a typed failure result without advancing the committed pointer.

## Phase 2a: host read model

- [ ] Replace raw mutable owner exposure with a detached JSON-safe read model.
- [ ] Expose runtime/run/frame identity and the last committed frame.
- [ ] Expose the last failed frame separately.
- [ ] Bound journals and omit DOM nodes, functions and large geometry arrays.
- [ ] Add host lease and revocation behavior.

## Phase 3: shared epochs and reset

- [ ] Allocate `runtimeSessionId` once per host session.
- [ ] Allocate `runSessionId` on each accepted start/retry.
- [ ] Allocate `streamEpoch` and `colliderEpoch` with the run transaction.
- [ ] Fence Worker responses, contacts and frame receipts by epoch.
- [ ] Reset input, camera, actor, contacts, pickup state and committed frame atomically.

## Phase 4: lifecycle and disposal

- [ ] Add a typed startup transaction and cleanup stack.
- [ ] Retain RAF and listener leases.
- [ ] Quarantine Worker/executor callbacks.
- [ ] Add Three and Rapier resource owners.
- [ ] Revoke host capability before disposal.
- [ ] Return ordered idempotent stop/dispose results.

## Candidate frame kits

```txt
runtime-frame-id-kit
frame-input-snapshot-kit
simulation-step-receipt-kit
stream-consumption-receipt-kit
collider-membership-receipt-kit
physics-step-receipt-kit
gameplay-mutation-receipt-kit
presentation-state-kit
camera-consumption-receipt-kit
render-submit-result-kit
hud-commit-result-kit
committed-frame-record-kit
frame-failure-result-kit
frame-journal-kit
host-frame-read-model-kit
committed-frame-coherence-fixture-kit
```

## Acceptance conditions

```txt
one RAF candidate has one terminal frame result
all receipts share runtime, run and frame identity
render and HUD success are mandatory for commit
failed frame preserves predecessor committed pointer
host cannot mix mutable owner snapshots
retry rejects prior-run frame receipts
frame records are bounded and JSON-safe
```

## Future fixture commands

```bash
node scripts/prehistoric-rush-frame-record-fixture.mjs
node scripts/prehistoric-rush-frame-failure-fixture.mjs
node scripts/prehistoric-rush-host-read-model-fixture.mjs
node scripts/prehistoric-rush-frame-journal-fixture.mjs
node scripts/prehistoric-rush-browser-frame-coherence-smoke.mjs
node scripts/prehistoric-rush-browser-render-failure-smoke.mjs
node scripts/prehistoric-rush-browser-host-interleaving-smoke.mjs
node scripts/prehistoric-rush-pages-frame-coherence-smoke.mjs
```

## Overall order

```txt
1. Route manifest and profile handoff.
2. Atomic patch activation and release.
3. Exact collider replacement and collision admission.
4. Committed frame observation and host read model.
5. Shared runtime/run/stream/collider epochs.
6. Startup rollback, resource ownership and disposal.
7. Node, browser and Pages fixtures.
```

## Do not do next

Do not add a second RAF, simulation, physics, render or diagnostics owner. Do not treat current `PrehistoricRushHost.getState()` output as proof of the visible frame.