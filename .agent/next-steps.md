# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T02-48-17-04-00`

## Goal

Add one authoritative start/retry transaction that resets run-owned state, explicitly retains or clears world-owned state, fences asynchronous deliveries and proves the first committed frame of the new run.

## Immediate safe ledge

```txt
PrehistoricRush Run Session Reset Authority
+ Retry / Stream Epoch Fixture Gate
```

## Plan ledger

### Phase 0: preserve the existing P0 patch boundary

- [ ] Add a versioned patch-content contract and admission result.
- [ ] Add detached patch activation/release plans.
- [ ] Preflight terrain, tree, grass, shard, collider and height consumers.
- [ ] Commit or roll back all consumers together.
- [ ] Reconcile controller-active and consumer-active sets.

### Phase 1: define run and stream identity

- [ ] Add a monotonic `runSessionId` separate from the existing numeric `runId`.
- [ ] Add a `streamEpoch` for controller/Worker delivery admission.
- [ ] Define the relationship among world seed, generator version, controller ID, stream epoch and run session.
- [ ] Include both identities in start, activation, collision, pickup, render and host evidence.
- [ ] Reject or quarantine stale dynamic deliveries.

### Phase 2: declare retention policy

- [ ] Classify patch payload/cache records as immutable world-owned data.
- [ ] Classify pickup visibility, active colliders, contacts, input, camera and frame journals as run-owned data.
- [ ] Decide whether active terrain/tree bindings are retained or re-committed on retry.
- [ ] Return a typed retained/reset/rebuilt/rejected decision for every owner.
- [ ] Never clear the deterministic cache merely to simulate a reset.

### Phase 3: build the start/reset transaction

- [ ] Prepare the next run state without publishing it.
- [ ] Clear browser input latches and pending jump intent.
- [ ] Reconcile active pickups from the new empty collected-ID set.
- [ ] Rebuild gameplay and Rapier collider projections for the admitted active patch set.
- [ ] Reset actor/contact state.
- [ ] Reset camera interpolation and frame-local presentation state.
- [ ] Commit the new run only after required consumers acknowledge.
- [ ] Roll back to the prior terminal state if preparation fails.

### Phase 4: own Worker and lifecycle state

- [ ] Retain the message executor and Worker as named session resources.
- [ ] Add an explicit inflight ceiling.
- [ ] Tag requests/results with stream epoch.
- [ ] Cancel, reject or quarantine pending results on restart/dispose.
- [ ] Add ordered idempotent `stop`, `dispose` and `restart` operations.
- [ ] Reject post-dispose input, generation, activation and render calls.

### Phase 5: publish evidence

- [ ] Add typed `run-start-result` and `run-reset-result` rows.
- [ ] Record cache retention and dynamic-content reconciliation decisions.
- [ ] Record stale Worker/controller result outcomes.
- [ ] Publish first committed frame with run session, stream epoch, patch revision and physics revision.
- [ ] Remove live engine, adapter, controller and physics owners from public readback.
- [ ] Bound every journal.

### Phase 6: fixture gates

- [ ] Retry after collecting a shard without leaving the current active patch set.
- [ ] Retry after collision while Worker requests are pending.
- [ ] Retry after moving far enough to release patches.
- [ ] Retry repeatedly and prove stable cache size and no duplicate RAF/listeners.
- [ ] Deliver a stale Worker result after a new stream epoch and prove quarantine.
- [ ] Prove first-frame pickup, collider, height and render parity.
- [ ] Prove stop/dispose/restart idempotency.
- [ ] Add deployed browser and Pages smoke.

## Candidate kits

```txt
run-session-authority-kit
run-start-reset-transaction-kit
world-cache-retention-policy-kit
stream-epoch-admission-kit
dynamic-content-reconciliation-kit
physics-contact-reset-kit
camera-frame-reset-kit
stale-worker-result-quarantine-kit
run-session-observation-kit
retry-stream-epoch-fixture-kit
```

Update `prehistoric-rush-domain-kit` and the existing host adapters first. Add a new reusable kit only where no current domain owns the responsibility.

## Required future fixture commands

```bash
node scripts/prehistoric-rush-patch-activation-fixture.mjs
node scripts/prehistoric-rush-retry-reset-fixture.mjs
node scripts/prehistoric-rush-stream-epoch-fixture.mjs
node scripts/prehistoric-rush-dynamic-content-reconciliation-fixture.mjs
node scripts/prehistoric-rush-lifecycle-fixture.mjs
```

## Follow-on order

```txt
1. Patch-content admission and atomic activation.
2. Run-session reset and world-cache retention.
3. Worker/stream epoch and stale-result policy.
4. Stream readiness for height, hazards and pickups.
5. JSON-safe committed-frame observation.
6. Creature and core-kit consumption authority.
7. Typed run commands and transition results.
```

## Do not do next

Do not add trees, grass, shards, creatures or route radius; do not clear all caches as a substitute for a reset contract; do not duplicate the official controller; and do not treat `game.start()` or a changed `runId` as proof that every consumer reset.
