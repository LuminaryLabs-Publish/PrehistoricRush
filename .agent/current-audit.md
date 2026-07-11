# Current Audit: PrehistoricRush

**Updated:** `2026-07-11T00-39-25-04-00`

## Summary

`PrehistoricRush` now consumes the official commit-pinned `procedural-creature-body-kit` from `LuminaryLabs-Dev/NexusEngine-Kits`. The product keeps only `PLAYER_RAPTOR_PRESET`, while the shared kit owns deterministic body geometry, topology, skeleton, skinning, attachments, collision recommendations, pose descriptors, content hashes and snapshots.

The migration removes the prior duplicate generator and is architecturally correct. The remaining gap is end-to-end consumption authority: module identity, descriptor validity, Three binding, per-frame pose application, Rapier collision and lifecycle cleanup are not represented by one correlated result/journal.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: recent undocumented runtime change before oldest fallback
prior central timestamp: 2026-07-10T23-08-11-04-00
latest observed runtime head: 338efb7769e6339eaeb6606152204ce26a0880fe
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Recent runtime sequence:

```txt
bf300b1  add player raptor preset
2d34bf6  consume official creature body kit
18e6c5c  remove local wrapper
8a5d1f3  remove duplicated local generator
d45556b  pin engine, kits and ProtoKits sources
338efb7  map bare nexusengine imports to pinned Nexus Engine
```

## Interaction loop

```txt
index.html
  -> import map resolves bare nexusengine to e8252e5
  -> src/runtime.mjs
  -> src/game.js
  -> import pinned NexusEngine, seed kit, procedural creature kit, ProtoKit, Three and Rapier
  -> createPrehistoricRushKitGraph(NexusEngine, NexusEngineKits)
  -> install 12 core kits + seed-kit + procedural-creature-body-kit + game domain
  -> official kit creates player raptor descriptor from local preset
  -> game domain exposes descriptor and pose services
  -> Three adapter builds geometry, bones, skeleton, material and SkinnedMesh
  -> Rapier adapter registers actor from descriptor collision
  -> start run and populate the 7 x 7 window
  -> browser input forwards steer/boost/jump
  -> engine.tick advances RunState
  -> terrain/population/physics update
  -> create pose descriptor from current run state
  -> apply pose to the Three skeleton
  -> update camera, lighting, grass, shards and render
  -> update HUD and public host snapshot
  -> requestAnimationFrame repeats
```

## Domains in use

```txt
runtime module graph, import map and source admission
Nexus Engine input, spatial, scene, physics, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
seed/random stream
procedural creature recipe, topology, skeleton, skinning, attachments, collision, pose and snapshots
product player raptor configuration
PrehistoricRush run lifecycle, input, route, surface, speed, jump, score, shards and outcomes
deterministic drunk-route generation and nearest/surface queries
browser DOM, input, resize, blur and RAF
Three terrain, vegetation, pickup, creature, camera, light and rendering
Rapier actor, fixed colliders, transforms, stepping and contacts
host diagnostics and static Pages deployment
```

## Kit inventory and services

### Declared Nexus Engine core kits

```txt
core-input-kit         jump/boost/start/retry/steer action contracts
core-spatial-kit       transform and query capability
core-scene-kit         menu/game/run-over/win scenes and transitions
core-physics-kit       physics provider capability
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        clear-day sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostic/readback capability
core-composition-kit   capability composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed/random-stream service

procedural-creature-body-kit 0.1.0
  body recipe normalization
  renderer-agnostic geometry/topology descriptors
  skeleton and skin-weight descriptors
  attachment descriptors
  collision recommendations
  deterministic pose descriptors
  content hashing
  create/get/list/remove and snapshot/load/reset
```

The shared kit explicitly does not own renderer meshes, GPU buffers, active locomotion, AI, game rules or physics resolution.

### Product and route kits

```txt
prehistoric-rush-domain-kit 0.3.0
  run/input resources
  run-start/fail/win/shard events
  run simulation, route, surface, score and outcome services
  player creature descriptor and pose query
  scene-transition requests and snapshot

drunk-route-generator
  deterministic control points and Catmull-Rom samples
  nearest lookup, tangent/progress, region classification and snapshot

player-raptor-preset-kit (source-backed responsibility)
  product seed, theropod topology, proportions, material, animation and collision tuning
```

### External kits/modules and host adapters

```txt
rapier-physics-domain-kit
Three.js 0.179.1
Rapier 0.15.0
static-shell-adapter-kit
browser-input-adapter-kit
rapier-host-adapter-kit
terrain-render-adapter-kit
tree-population-render-kit
layered-grass-render-kit
shard-render-pickup-kit
three-procedural-creature-adapter-kit
creature-pose-consumption-adapter-kit
camera-light-render-adapter-kit
runner-hud-adapter-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

## Source revisions

```txt
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: b107be495e272b67316a8f9e17b85ffd7bbeff64
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
```

The sources are now immutable, but the import map and `src/game.js` constants are separate authorities and no module-graph fingerprint proves they remain aligned.

## Main findings

### 1. Shared-generator ownership is correct

Reusable creature generation moved to NexusEngine-Kits, the local duplicate was removed, and product-specific raptor decisions remain in `src/presets/player-raptor.js`.

### 2. Descriptor consumption is implicit

`createCreatureMesh()` accepts raw descriptor arrays and immediately allocates Three resources. It has no named kit identity, schema preflight, typed prepare result, binding record or rollback path.

### 3. Pose consumption is unobservable

`applyCreaturePose()` silently skips unknown bones, mutates live objects and returns nothing. There is no pose sequence connecting run state to the skeleton and rendered frame.

### 4. Render/physics parity is unproven

The Three mesh and Rapier actor derive from the same initial descriptor, but no retained row proves identical creature ID, content hash and collision dimensions across the game, render and physics consumers.

### 5. Creature lifecycle is absent

Geometry, attributes, bones, skeleton, material and mesh have no explicit owner or idempotent disposal result. The larger RAF/listener/renderer/physics lifecycle also remains undocumented at runtime.

### 6. Host evidence is incomplete

`PrehistoricRushHost` exposes live engine, physics and adapter references. Its body readback includes only ID, content hash and topology, not kit/source version, preset/recipe fingerprint, skeleton/skin checks, binding IDs, pose rows, collision parity or cleanup state.

### 7. Previous findings remain

Most installed core kits still lack consumption evidence, and streamed population still uses mutable active `InstancedMesh.count` values as future admission ceilings.

## Priority order

```txt
P0 pinned module graph and procedural creature descriptor-adapter proof
P1 core-kit declared/installed/consumed/replaced reconciliation
P2 creature and browser adapter lifecycle/disposal
P3 immutable population capacities and atomic generation commit
P4 typed run commands, transitions and outcome journal
P5 committed-frame and JSON-safe host observation
```

## Validation status

Documentation only. No runtime source, dependency, route, rendering, physics or deployment behavior changed. No branch or pull request was created. The repository has no root `package.json`; module, descriptor, adapter, collision and lifecycle fixtures are absent and were not run.