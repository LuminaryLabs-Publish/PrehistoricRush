# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-10T22-42-00-04-00`

## Plan ledger

**Goal:** Define a deterministic population transaction so streamed-window generation cannot overflow instance buffers, expose stale matrices, or diverge from collider and pickup authority.

- [x] Compared the full ten-repository Publish inventory against the central ledger.
- [x] Excluded `TheCavalryOfRome`.
- [x] Selected only `PrehistoricRush` as the oldest eligible documented fallback.
- [x] Read the active runtime and current `.agent` state.
- [x] Identified the interaction loop, domains, services, and kits.
- [x] Calculated configured candidate maxima and pool capacities.
- [x] Mapped render, collider, pickup, and physics population writes.
- [x] Defined the population admission and commit boundary.
- [x] Added timestamped architecture, render, gameplay, interaction, population-system, deploy, and ledger records.
- [ ] Runtime implementation remains future work.

## Interaction loop

```txt
boot -> mount -> initial terrain update -> populate
run -> motion -> chunk transition -> populate
pickup -> invalidate populationKey -> populate
populate -> direct matrix writes -> colliders/pickups -> physics replacement -> draw counts
render -> host aggregate snapshot
```

## Domains

```txt
route, terrain, traversal
forest archetypes and tree/root population
grass descriptors, route exclusion, LOD, wind
rock and shard population
collider and pickup projection
Rapier fixed-collider replacement
procedural dino, input, motion, contacts, score, goal
camera, HUD, shadows, render submission
population capacity, admission, generation identity, parity, observation
runtime source contract, deployment, fixture validation, central sync
```

## Active kits

```txt
route-field-domain-kit
surface-traversal-domain-kit
forest-archetype-domain-kit
grass-patch-domain-kit
grass-wind-domain-kit
procedural-dino-body-domain-kit
three@0.179.1
@dimforge/rapier3d-compat@0.15.0
rapier-physics-domain-kit
```

## Main finding

`populate()` has no detached plan or atomic commit. It increments counters and writes live matrices while still discovering candidates. Tree/root writes are unbounded. Grass uses prior `mesh.count` as capacity, increments before LOD, and republishes candidate counts as draw counts. Tree colliders and shard pickups are not proven to match admitted render rows.

## Next safe ledge

```txt
PrehistoricRush Population Admission Transaction
+ Render/Collider/Pickup Parity Fixture Gate
```

## Deferred

Runtime source-contract reconciliation, restart/persistence, dependency admission, lifecycle disposal, and shadow ownership remain behind the population gate.