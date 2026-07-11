# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T02-41-37-04-00`

## Summary

Preserve the official seeded patch controller, stable instance-batch kit and deterministic generator. Implement the missing product boundary that validates generated content, coordinates Worker/session lifecycle and commits all render, gameplay, height and physics consumers under one activation revision.

## Plan ledger

**Goal:** Make patch streaming atomic, bounded, gameplay-safe and observable while keeping existing domain ownership intact.

### Phase 0: preserve ownership

- [ ] Keep patch identity, cache, desired sets, priority, ready delivery and eviction in `seeded-world-patch-controller-kit`.
- [ ] Keep tree cell capacity/replacement/release in `instanced-render-batch-kit`.
- [ ] Keep terrain/vegetation/pickup/collider content in the product patch generator.
- [ ] Keep Three and Rapier object ownership in product adapters.
- [ ] Do not create duplicate controller, cache, prefetch or batch kits.

### Phase 1: version and validate patch content

- [ ] Add a product `patchSchemaVersion` and generator-content version.
- [ ] Validate patch ID, coordinates, cache key and generator version.
- [ ] Validate terrain array types, exact lengths and finite values.
- [ ] Validate tree/grass matrices and stable unique IDs.
- [ ] Validate pickup/collider IDs, dimensions and patch bounds.
- [ ] Compute a stable patch-content fingerprint.
- [ ] Return typed accepted/rejected generation-admission results.

### Phase 2: own Worker and stream sessions

- [ ] Create a `streamSessionId` for boot/remount lifecycle.
- [ ] Retain Worker ready state and wait for initialization acknowledgement.
- [ ] Carry session/worker epoch through generation requests and results.
- [ ] Define when a late result may enter cache and when it must not activate.
- [ ] Add an explicit maximum inflight request count.
- [ ] Retain the message executor and its `dispose()` operation.
- [ ] Make reset/dispose terminal and idempotent.
- [ ] Reject post-dispose generation and activation requests.

### Phase 3: build detached activation plans

- [ ] Claim a ready patch without treating it as consumer-active.
- [ ] Reserve a terrain slot before any live mutation.
- [ ] Preflight tree batch capacities and IDs.
- [ ] Preflight grass layer and shard capacities with admitted/rejected IDs.
- [ ] Build gameplay and Rapier collider plans from the same patch set.
- [ ] Build a height-source transition plan.
- [ ] Compute one immutable activation-plan fingerprint.
- [ ] Reject the plan before mutation if any required invariant fails.

### Phase 4: commit every consumer atomically

- [ ] Commit terrain attributes, transform, visibility and bounds.
- [ ] Commit tree cell replacements and batch flushes.
- [ ] Commit grass and shard matrices/counts/bounds.
- [ ] Commit gameplay collider and pickup rows.
- [ ] Commit Rapier fixed colliders.
- [ ] Commit patch height-source state.
- [ ] Publish one activation result with per-consumer rows.
- [ ] Update consumer-active patch IDs only after success.
- [ ] Roll back or repair all consumers on failure.
- [ ] Add an equivalent typed release transaction.

### Phase 5: make gameplay readiness explicit

- [ ] Publish player patch and forward safety-ring readiness.
- [ ] Distinguish generated, controller-ready and consumer-active states.
- [ ] Record fallback versus committed-patch height source.
- [ ] Record fallback-to-patch height delta and continuity decision.
- [ ] Define deterministic slow/hold/fallback behavior when required patches are not collider-complete.
- [ ] Correlate collision and pickup outcomes with patch and activation IDs.

### Phase 6: observe and prove parity

- [ ] Publish controller-active and consumer-active sets separately.
- [ ] Publish per-consumer counts, capacities, rejected IDs and revisions.
- [ ] Publish Worker ready/pending/error/lifecycle state.
- [ ] Add a bounded stream lifecycle journal.
- [ ] Add one patch-streaming parity fingerprint.
- [ ] Remove or demote live mutable owners from public host readback.
- [ ] Ensure all public snapshots are structured-clone safe.

### Phase 7: fixture gates

- [ ] Add deterministic generator and neighboring-edge fixtures.
- [ ] Add invalid payload rejection fixtures.
- [ ] Add controller focus/prefetch/retain/cache/eviction fixtures.
- [ ] Add Worker ready, out-of-order, late-result and disposal fixtures.
- [ ] Add activation success, capacity rejection and rollback fixtures.
- [ ] Add controller/render/gameplay/Rapier parity fixtures.
- [ ] Add height continuity and stream-readiness fixtures.
- [ ] Add restart/remount/dispose lifecycle fixtures.
- [ ] Add browser smoke across repeated patch boundaries.

## Candidate kits

```txt
prehistoric-patch-content-contract-kit
patch-worker-session-kit
patch-generation-admission-result-kit
patch-activation-plan-kit
patch-consumer-transaction-kit
patch-height-source-transition-kit
patch-consumer-parity-kit
patch-streaming-lifecycle-journal-kit
patch-streaming-host-observation-kit
patch-streaming-fixture-kit
```

Use existing parent domains and adapters first. Promote a new kit only when the responsibility is coherent, reusable and not already owned upstream.

## Required future fixture commands

```bash
node scripts/prehistoric-rush-module-graph-fixture.mjs
node scripts/prehistoric-rush-patch-generator-fixture.mjs
node scripts/prehistoric-rush-patch-controller-fixture.mjs
node scripts/prehistoric-rush-patch-worker-fixture.mjs
node scripts/prehistoric-rush-patch-activation-fixture.mjs
node scripts/prehistoric-rush-patch-parity-fixture.mjs
node scripts/prehistoric-rush-stream-readiness-fixture.mjs
node scripts/prehistoric-rush-stream-lifecycle-fixture.mjs
```

## Follow-on order

```txt
1. procedural creature descriptor/render/physics consumption authority
2. core-kit declared/installed/consumed/replaced reconciliation
3. typed run commands, transitions and outcome journal
4. committed-frame and browser-host lifecycle authority
5. visual fidelity and larger world content only after proof gates
```

## Do not do next

Do not increase the active radius, generation budget or population density; add more tree/grass/shard types; replace the official controller; or claim the Worker removed all frame hitch risk before activation cost, parity and lifecycle are executable and observable.
