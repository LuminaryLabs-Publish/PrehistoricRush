# START HERE: PrehistoricRush

**Last aligned:** `2026-07-10T19-30-36-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Current ledge

```txt
PrehistoricRush Instance Pool Capacity Authority
+ Deterministic Population Fixture Gate
```

## Selection

The accessible `LuminaryLabs-Publish` inventory contains ten repositories. All nine eligible non-Cavalry repositories are tracked and have root `.agent` state. `TheCavalryOfRome` remains excluded.

`PrehistoricRush` was selected because its central and root audit state still described the earlier split-runtime composition, while recent runtime commit `a94082b1c4805f75a494cf41db0c93b53d19fbd4` introduced a new single-file giant-forest, layered-grass, route-field, surface-resistance, and procedural-skinned-dino route. The runtime cutover was therefore materially newer than the documentation.

## Read first

```txt
.agent/trackers/2026-07-10T19-30-36-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-10T19-30-36-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-10T19-30-36-04-00-instance-pool-capacity-authority-dsk-map.md
.agent/render-audit/2026-07-10T19-30-36-04-00-instanced-render-capacity-commit-gap.md
.agent/gameplay-audit/2026-07-10T19-30-36-04-00-population-stream-restart-loop.md
.agent/interaction-audit/2026-07-10T19-30-36-04-00-input-population-generation-map.md
.agent/forest-system-audit/2026-07-10T19-30-36-04-00-tree-root-pool-capacity-contract.md
.agent/grass-system-audit/2026-07-10T19-30-36-04-00-layer-capacity-ratchet-gap.md
.agent/deploy-audit/2026-07-10T19-30-36-04-00-population-capacity-fixture-gate.md
```

## What this repo is now

`PrehistoricRush` is a static browser 3D infinite-runner route. `src/runtime.mjs` imports `src/game.js`, which directly composes route, surface, forest, grass, wind, procedural-dino, Three.js, Rapier, and external physics services. One RAF owns simulation, presentation, and rendering.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> construct active domain kits
  -> load Three.js, Rapier, and external physics kit
  -> create scene, terrain window, instance pools, skinned raptor, and input
  -> populate trees, roots, grass, rocks, shards, colliders, and pickups
  -> Start Rush enters game with a partial reset
  -> one RAF advances movement, terrain streaming, population, contacts, pickups, scene, pose, camera, wind, HUD, and render
  -> PrehistoricRushHost exposes live runtime objects and aggregate state
```

## Active repo-local DSKs

```txt
route-field-domain-kit
surface-traversal-domain-kit
forest-archetype-domain-kit
grass-patch-domain-kit
grass-wind-domain-kit
procedural-dino-body-domain-kit
```

The earlier event-bus, domain-host, scheduler, dino form/pose/material, camera, and HUD kits remain in the repo but are not imported by the current route.

## Main finding

The new population renderer conflates immutable allocation capacity with mutable active draw count.

```txt
roots allocate 400 instances
current 7 x 7 window can request up to 1,372 roots
root writes have no capacity guard

grass mesh.count starts as capacity
populate() overwrites it with active count
next populate() uses that active count as its admission limit
sparse windows can permanently restrict later dense windows

tree pools have no explicit overflow result
host readback has no requested/admitted/rejected pool rows or generation ID
```

## Next safe work

Preserve the current visual cutover while adding:

```txt
immutable pool capacity
mutable active count
typed population request and admission results
stable generation IDs
bounded matrix writes
deterministic overflow policy
render/collider and shard/pickup parity rows
detached pool observations
DOM-free dense/sparse/repeated population fixture
```

## Current validation state

Documentation only. Runtime source, dependencies, routes, and deployment did not change. No branch or pull request was created. The repo has no root `package.json`, and no population-capacity fixture exists to run.