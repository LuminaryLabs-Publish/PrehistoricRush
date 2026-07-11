# START HERE: PrehistoricRush

**Last aligned:** `2026-07-10T22-42-00-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Current implementation gate

```txt
PrehistoricRush Population Admission Transaction
+ Render/Collider/Pickup Parity Fixture Gate
```

The active `populate()` path mixes candidate generation, capacity checks, matrix writes, collider creation, pickup creation, draw-count publication, and physics replacement in one mutation pass. It has no atomic generation result or parity proof.

## Selection

The accessible `LuminaryLabs-Publish` installation contains ten repositories. `TheCavalryOfRome` remains excluded. All nine eligible repositories are tracked and have root `.agent` state.

```txt
PrehistoricRush     selected / prior 2026-07-10T21-00-16-04-00
AetherVale          tracked  / 2026-07-10T21-08-52-04-00
IntoTheMeadow       tracked  / 2026-07-10T21-19-36-04-00
TheOpenAbove        tracked  / 2026-07-10T21-31-01-04-00
HorrorCorridor      tracked  / 2026-07-10T21-39-22-04-00
PhantomCommand      tracked  / 2026-07-10T21-49-26-04-00
ZombieOrchard       tracked  / 2026-07-10T22-11-24-04-00
TheUnmappedHouse    tracked  / 2026-07-10T22-21-17-04-00
MyCozyIsland        tracked  / 2026-07-10T22-29-21-04-00
TheCavalryOfRome    excluded by rule
```

## Active interaction loop

```txt
boot -> local domain kits + Three.js + Rapier + physics adapter
mount -> terrain, instance pools, raptor, input, physics, HUD, camera
populate -> candidate rows -> direct matrix writes -> colliders/pickups -> active counts
run -> movement -> chunk transition -> repopulate -> contacts/pickups -> HUD/render
restart -> partial state reset while the same population and RAF owners continue
readback -> live mutable app objects plus aggregate domain snapshots
```

## Main population finding

```txt
window chunks: 7 x 7 = 49
tree candidates: up to 343
root candidates: up to 1,372
root allocation: 400
grass candidates: up to 3,430
```

Tree and root writes have no capacity preflight. Grass increments its candidate counter before LOD admission, compares against the previous active draw count instead of immutable capacity, and later publishes the candidate count as the draw count. Collider and pickup rows are produced independently from render admission.

## Read first

```txt
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-10T22-42-00-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-10T22-42-00-04-00.md
.agent/architecture-audit/2026-07-10T22-42-00-04-00-population-admission-transaction-dsk-map.md
.agent/render-audit/2026-07-10T22-42-00-04-00-instance-write-draw-count-parity-gap.md
.agent/gameplay-audit/2026-07-10T22-42-00-04-00-population-collider-pickup-generation-loop.md
.agent/interaction-audit/2026-07-10T22-42-00-04-00-chunk-transition-population-admission-map.md
.agent/population-system-audit/2026-07-10T22-42-00-04-00-capacity-generation-commit-contract.md
.agent/deploy-audit/2026-07-10T22-42-00-04-00-population-parity-fixture-gate.md
```

## Safe order

```txt
1. Pure candidate generation.
2. Immutable pool capacities.
3. Typed admission and truncation.
4. Detached matrix/collider/pickup plans.
5. Atomic generation commit.
6. Render/collider and shard/pickup parity proof.
7. Host readback and deterministic fixtures.
8. Runtime source-contract reconciliation.
```

Documentation only. Runtime source, dependencies, routes, rendering, physics, and deployment behavior were not changed.