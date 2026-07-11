# Next Steps: PrehistoricRush

**Updated:** `2026-07-10T22-42-00-04-00`

## Immediate safe ledge

```txt
PrehistoricRush Population Admission Transaction
+ Render/Collider/Pickup Parity Fixture Gate
```

## Goal

Make every streamed-window rebuild deterministic, capacity-safe, atomic, and observable. A committed generation must prove that rendered instances, physics colliders, and collectible pickups were derived from the same admitted candidate set.

## Plan ledger

### Phase 0: separate planning from mutation

- [ ] Introduce a pure `buildPopulationPlan({ windowKey, generationId, state, tuning })` path.
- [ ] Generate stable candidate IDs before touching Three.js, physics, or gameplay arrays.
- [ ] Record candidate family, archetype/layer, transform, collider descriptor, pickup descriptor, and rejection reason.
- [ ] Keep route and terrain sampling deterministic for identical inputs.

### Phase 1: establish capacity authority

- [ ] Wrap every instance pool with immutable `capacity` and mutable `activeCount`.
- [ ] Never use `mesh.count` as allocation capacity.
- [ ] Preflight tree, crown, root, grass, rock, and shard writes.
- [ ] Return requested, admitted, truncated, rejected, and overflow counts per pool.
- [ ] Increment admitted/write counters only after capacity and LOD acceptance.
- [ ] Reject any published draw count greater than committed writes or immutable capacity.

### Phase 2: enforce parity

- [ ] Derive tree collider rows only from admitted tree render rows.
- [ ] Derive shard pickup rows only from admitted shard render rows.
- [ ] Require stable source IDs across render, collider, pickup, and physics projections.
- [ ] Assert exact tree-render/collider parity.
- [ ] Assert exact shard-render/pickup parity.
- [ ] Record deliberate render-only families such as grass and rocks explicitly.

### Phase 3: atomic generation commit

- [ ] Prepare matrix arrays and projection rows detached from live pools.
- [ ] Validate counts and IDs before mutation.
- [ ] Commit all pool matrices, active counts, colliders, pickups, and physics rows under one `generationId`.
- [ ] Keep the previous committed generation if planning or validation fails.
- [ ] Produce an accepted/rejected commit result and state fingerprint.

### Phase 4: observation and fixtures

- [ ] Add population readback to `PrehistoricRushHost.getState()`.
- [ ] Expose `windowKey`, `generationId`, capacities, counts, truncations, parity, and fingerprint.
- [ ] Add dense-window, sparse-window, repeated-window, and capacity-overflow fixtures.
- [ ] Prove identical inputs produce identical plans and fingerprints.
- [ ] Prove failed generations do not partially mutate live state.
- [ ] Prove no stale matrices are included in active draw counts.

## Candidate kits

```txt
population-candidate-kit
instance-pool-capacity-kit
population-admission-kit
population-plan-kit
population-parity-kit
population-generation-commit-kit
population-fingerprint-kit
population-observation-kit
population-fixture-kit
```

Update existing forest, grass, shard, physics, and host owners first. Add a new kit only where the responsibility is not already owned.

## Required fixture gate

```bash
node scripts/prehistoric-rush-population-plan-fixture.mjs
node scripts/prehistoric-rush-population-capacity-fixture.mjs
node scripts/prehistoric-rush-population-parity-fixture.mjs
node scripts/prehistoric-rush-population-commit-fixture.mjs
```

After those pass independently, wire them into the repository validation and Pages staging gate.

## Follow-on order

```txt
runtime source-contract reconciliation
restart/result/persistence transaction
immutable dependency admission
mount/dispose/remount lifecycle
camera-relative lighting and shadow ownership
```

## Do not do next

Do not add more vegetation, pickups, colliders, visual systems, configuration files, or pool sizes as a workaround. Do not continue mutating live pools before a complete plan is validated.