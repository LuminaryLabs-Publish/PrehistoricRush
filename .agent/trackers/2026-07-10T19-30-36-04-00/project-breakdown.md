# PrehistoricRush Project Breakdown

**Run:** `2026-07-10T19-30-36-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Goal

Refresh the internal architecture map after the giant-forest and skinned-raptor cutover, identify the current interaction loop, domains, kits, and services, and define the smallest proof gate for deterministic render-population capacity.

## Selection

The accessible `LuminaryLabs-Publish` inventory contains ten repositories. `TheCavalryOfRome` is excluded. All nine eligible repositories are centrally tracked and have root `.agent` state. `PrehistoricRush` was selected because its central ledger remained at `2026-07-10T18-01-03-04-00` while later runtime commit `a94082b1c4805f75a494cf41db0c93b53d19fbd4` replaced the documented runtime shape with a giant-forest, layered-grass, route-field, surface-resistance, and procedural-skinned-dino composition.

This makes the current runtime cutover materially newer than the documented audit state.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> construct route, surface, forest, grass, wind, and dino domain kits
  -> load Three.js, Rapier, and external rapier-physics-domain-kit
  -> create shell, scene, lights, renderer, terrain, instance pools, raptor, and physics bridge
  -> build the 7 x 7 terrain window
  -> populate trees, roots, grass, rocks, shards, colliders, and pickups for the current chunk window
  -> Start Rush enters game with a partial state reset
  -> one RAF advances movement, route classification, surface resistance, jump, terrain streaming, physics, contacts, pickups, and terminal state
  -> the same RAF applies dino pose, camera, wind, HUD, and render
  -> PrehistoricRushHost exposes live objects plus a detached-looking aggregate snapshot
```

## Domains in use

```txt
static browser shell
runtime entry and module loading
Three.js rendering runtime
Rapier runtime and external physics adapter
route control-point generation
Catmull-Rom route sampling
nearest-route lookup and route classification
terrain height field and chunk-window relocation
surface traversal resistance
forest archetype catalog
forest deterministic population
instanced tree trunk and crown pools
instanced root pool
layered grass descriptors
route-aware grass exclusion and scaling
distance-based grass LOD
procedural grass wind
instanced rock population
shard pickup population
procedural skinned dino topology
skeleton construction and skin weighting
raptor procedural pose
keyboard and button input
menu, game, run-over, and win state
session start and partial restart
runner yaw, speed, boost, jump, gravity, and distance
contact and pickup resolution
best-distance persistence
third-person camera
HUD projection
single-frame render submission
host readback
static Pages deployment
central ledger synchronization
```

## Active repo-local kits and services

```txt
route-field-domain-kit
  deterministic control points
  Catmull-Rom sample rebuild
  nearest route lookup
  path / edge / verge / forest classification
  control-point extension
  snapshot

surface-traversal-domain-kit
  region multiplier lookup
  smoothed resistance transition
  state readback
  snapshot

forest-archetype-domain-kit
  five forest archetypes
  indexed archetype lookup
  snapshot

grass-patch-domain-kit
  carpet / main / verge layer descriptors
  route-distance scale policy
  snapshot

grass-wind-domain-kit
  time-based gust update
  direction / strength / speed readback
  snapshot

procedural-dino-body-domain-kit
  skinned topology profile
  bone hierarchy creation
  tube-based single-surface mesh generation
  skin indices and weights
  procedural pose application
  descriptor and snapshot
```

## Live external kit and runtime services

```txt
three@0.179.1
  scene graph, geometry, materials, skinning, instancing, camera, lights, fog, renderer

@dimforge/rapier3d-compat@0.15.0
  physics runtime initialization

rapier-physics-domain-kit from NexusRealtime-ProtoKits@main
  world bridge
  Rapier configuration
  kinematic actor registration
  fixed collider replacement
  actor transform updates
  simulation step and contact rows
```

## Present but inactive legacy kits

The repository still contains the earlier event bus, domain host, tick scheduler, dino form/pose/material bundle, camera, and HUD kits. The new `src/game.js` does not import them. They are implementation inventory, not active runtime authority.

## Main finding

The latest visual cutover conflates immutable instance capacity with mutable active draw count.

```txt
pool allocation capacity
  != current active count
```

Concrete cases:

```txt
roots capacity: 400
maximum requested roots: 7 trees/chunk x 49 chunks x 4 roots = 1,372
no capacity guard exists before root setMatrixAt
roots.count is assigned the requested rootCount

grass mesh.count starts as allocation capacity
populate() later overwrites mesh.count with the active count
next populate() uses mesh.count as the admission limit
layer capacity can therefore ratchet down after a sparse population

tree pools allocate 100 trunks and 100 crowns per archetype
population writes have no explicit capacity guard or overflow result
```

The runtime cannot prove which instances were admitted, rejected, truncated, or stale. `PrehistoricRushHost.getState()` reports domain snapshots but no pool capacities, requested counts, admitted counts, overflow rows, generation ID, or population commit result.

## Next safe ledge

```txt
PrehistoricRush Instance Pool Capacity Authority
+ Deterministic Population Fixture Gate
```

## Plan ledger

- [ ] Give every instance pool immutable `capacity` and mutable `activeCount` fields.
- [ ] Never use `mesh.count` as an allocation-capacity source.
- [ ] Preflight requested tree, root, grass, rock, and shard counts before matrix writes.
- [ ] Return typed admitted, truncated, rejected, and overflow population results.
- [ ] Assign stable generation IDs to each population rebuild.
- [ ] Clear or overwrite all previously active matrix slots deterministically.
- [ ] Bound `InstancedMesh.count` to allocation capacity.
- [ ] Expose pool capacity, requested count, admitted count, rejected count, and reason rows through detached host readback.
- [ ] Add a DOM-free population fixture covering dense, sparse, repeated, and route-edge windows.
- [ ] Add a browser render smoke only after the deterministic fixture exists.

## Validation state

Documentation only. Runtime source, dependencies, routes, and deployment were not changed. No branch or pull request was created. The repo has no root `package.json`; no deterministic population-capacity fixture exists to run.