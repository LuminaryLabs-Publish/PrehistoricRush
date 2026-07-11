# Current Audit: PrehistoricRush

**Updated:** `2026-07-10T22-42-00-04-00`

## Summary

`PrehistoricRush` is a static browser 3D runner whose live route is `index.html -> src/runtime.mjs -> src/game.js`. Six repo-local domain kits, Three.js, Rapier, and the external Rapier physics adapter are composed directly by the browser host.

The immediate correctness boundary is population admission. `populate()` currently generates candidates, mutates instance matrices, creates collider and pickup rows, publishes draw counts, and replaces physics colliders without an explicit generation plan or commit result.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: oldest eligible documented fallback
prior selected-repo timestamp: 2026-07-10T21-00-16-04-00
```

## Interaction loop

```txt
boot
  -> import src/game.js
  -> construct route, surface, forest, grass, wind, and dino-body services
  -> load Three.js, Rapier, and rapier-physics-domain-kit

mount
  -> create shell, scene, terrain, pools, player, physics, input, HUD, camera
  -> terrain.update(0, 0)
  -> populate initial window

run
  -> update runner motion and route index
  -> terrain chunk transition invalidates populationKey
  -> populate rebuilds render/collider/pickup state
  -> physics fixed-collider set is replaced
  -> resolve contacts and pickups
  -> update camera, grass wind, HUD, and render

restart
  -> partial runner reset
  -> same RAF, listeners, population pools, collected set, and resource owners continue

readback
  -> PrehistoricRushHost.app exposes mutable live objects
  -> getState returns aggregate runner and domain snapshots
```

## Domains in use

```txt
runtime/platform:
  static shell, module resolution, Three.js, Rapier, physics adapter, Pages deploy

route/terrain/traversal:
  control points, spline samples, nearest query, region classification
  height field, chunk window, surface resistance

population:
  forest archetypes, tree pools, root pool, grass layers, rocks, shards
  candidate generation, route exclusion, LOD, admission, matrix writes
  collider projection, pickup projection, physics collider replacement

character/gameplay:
  procedural dino topology/skeleton/skinning/pose
  keyboard/button input, start/restart, motion, yaw, boost, jump
  contacts, shard collection, travel score, goal and scene state

presentation/observation:
  camera, HUD, shadows, render submission, host snapshots
  population capacity, generation identity, parity, fixtures, central sync
```

## Active kits and services

- `route-field-domain-kit`: deterministic route control points, Catmull-Rom samples, nearest lookup, region classification, extension, snapshot.
- `surface-traversal-domain-kit`: region multipliers, smoothing, state, snapshot.
- `forest-archetype-domain-kit`: five tree archetypes, indexed lookup, snapshot.
- `grass-patch-domain-kit`: carpet/main/verge descriptors, route scale policy, snapshot.
- `grass-wind-domain-kit`: deterministic gust update, wind state, snapshot.
- `procedural-dino-body-domain-kit`: skinned body construction, skeleton, weights, procedural pose, descriptor, snapshot.
- `three@0.179.1`: scene graph, geometry, instancing, skinning, camera, lighting, fog, rendering.
- `@dimforge/rapier3d-compat@0.15.0`: physics runtime.
- `rapier-physics-domain-kit`: world bridge, actor/collider registration, transforms, stepping, contacts.

## Population source facts

```txt
terrain radius: 3
window dimensions: 7 x 7
window chunks: 49

treesPerChunk: 7
maximum tree candidates: 343
per-archetype trunk capacity: 100
per-archetype crown capacity: 100
explicit tree capacity check: none

roots per admitted tree: 4
maximum root candidates: 1,372
root capacity: 400
explicit root capacity check: none

grassPerChunk: 70
maximum grass candidates: 3,430
layer allocations: carpet 3,600 / main 2,600 / verge 1,300
capacity comparison source: layer.mesh.count
counter increment occurs before capacity and LOD admission: yes
published draw count source: candidate counter

rocks maximum candidates: 98 / capacity 320
shards maximum candidates: 98 / capacity 220
```

## Main findings

1. Tree and root writes are not preflighted against immutable allocation capacities.
2. Root demand can exceed allocation by 972 rows under configured maximum density.
3. Grass uses the prior active draw count as the next admission ceiling, not the immutable allocation capacity.
4. Grass counters advance before LOD rejection, so published draw counts can include unwritten or stale matrices.
5. Tree collider rows are appended regardless of render-pool admission; render and collision authority can diverge.
6. Shard pickup rows and shard matrices are produced inline without a shared admission result.
7. `populate()` mutates live pools and gameplay arrays before a generation can be validated or committed.
8. No `generationId`, `windowKey`, population fingerprint, requested/admitted/truncated counts, or parity rows are exposed through `PrehistoricRushHost`.
9. Runtime source-contract drift remains the next separate gate after population correctness.

## Priority order

```txt
P0 population admission transaction and parity fixture
P1 runtime source contract reconciliation and deployed artifact fixture
P2 restart/result/persistence transaction
P3 immutable external dependency admission
P4 mount/dispose/remount lifecycle
P5 camera-relative lighting and shadow ownership
```

## Validation status

Documentation only. Runtime source, dependencies, routes, rendering, physics, and deployment behavior were not changed. No branch or pull request was created.