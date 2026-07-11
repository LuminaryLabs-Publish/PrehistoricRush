# Current Audit: PrehistoricRush

**Updated:** `2026-07-11T07-08-45-04-00`

## Summary

The runtime now pins `NexusEngine-Kits@ae7ebda62f7c264bbde49c939a62e1a04fd60784`, which includes the corrected procedural creature tube triangle winding. The product directly binds the descriptor's indices and supplied normals into Three.js with a default FrontSide material, so this source change affects visible culling, lighting and shadows.

The descriptor identity contract does not identify that change. `procedural-creature-body-kit` still reports version `0.1.0`, and `contentHash` hashes only normalized recipe plus topology counts. Geometry arrays, index order, normals, colors, skin data, skeleton transforms, attachments and collision payload are excluded.

## Plan ledger

**Goal:** catalogue the complete current game while isolating the missing creature geometry identity and render-consumption boundary without displacing the P0 patch activation transaction.

- [x] Reconcile the accessible Publish inventory and central tracking.
- [x] Inspect the current product source pin.
- [x] Inspect the upstream winding correction.
- [x] Inspect creature descriptor generation, hashing and snapshots.
- [x] Inspect Three and Rapier consumer paths.
- [x] Identify interaction loop, domains, kits and services.
- [x] Record geometry, orientation, binding, frame and lifecycle gaps.
- [ ] Implement reusable geometry identity and fixtures after P0 patch activation work.
- [ ] Execute Node, browser and Pages validation after implementation.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: recent undocumented runtime change before oldest fallback
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Interaction loop

```txt
index.html -> src/runtime.mjs -> src/game.js
  -> load pinned NexusEngine, NexusEngine-Kits, ProtoKits, Three and Rapier
  -> install 12 core kits
  -> install seed, creature, instance-batch, patch-controller and smooth-camera kits
  -> install prehistoric-rush-domain-kit 0.5.0
  -> create the player body descriptor from player-raptor-preset-kit
  -> register its collision recommendation with Rapier
  -> bind positions, normals, colors, indices, skin indices and skin weights into Three
  -> create Bone/Skeleton/SkinnedMesh with FrontSide MeshStandardMaterial
  -> start run, prime patch streaming and reset camera
  -> browser input + engine.tick advance run state
  -> patch streaming updates active terrain/height consumers
  -> createPlayerPose derives per-frame bone transforms
  -> applyCreaturePose mutates live bones and updates skeleton
  -> smooth-follow controller updates the Three camera
  -> renderer renders the skinned raptor and world
  -> HUD and PrehistoricRushHost expose aggregate snapshots
  -> requestAnimationFrame repeats
```

## Domains in use

```txt
runtime module graph and source admission
Nexus Engine core input, spatial, scene, physics, motion, camera, animation,
graphics, skybox, UI, diagnostics and composition
seed and deterministic random streams
procedural creature recipe normalization and presets
creature geometry positions, normals, colors and triangle indices
creature topology, surface orientation and front-face convention
creature skeleton, skin indices, skin weights and attachments
creature collision recommendation and bounds
creature descriptor identity, snapshots, load and reset
creature pose descriptor generation
Three BufferGeometry, material, bone, skeleton and SkinnedMesh binding
pose-to-bone projection and skinned render consumption
Rapier collision actor binding and contacts
instanced render-batch capacity and cell ownership
seeded patch identity, cache, scheduling, generation, delivery and release
product patch generation and Worker execution
patch-content admission and multi-consumer activation authority
terrain, vegetation, pickup, collider and height consumers
run lifecycle, route, surface, movement, jump, score and outcomes
camera target policy and route-ahead composition
persistent smooth-follow position, look and quaternion state
Three camera transform application and rendering
browser input, resize, blur, RAF, HUD and host observation
run, stream, camera and runtime lifecycle
static Pages deployment and validation
```

## Kit inventory and services

### Nexus Engine core kits

```txt
core-input-kit         actions and bindings
core-spatial-kit       spatial transform/query capability
core-scene-kit         scene registry and transitions
core-physics-kit       physics provider contract
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        clear-day sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostics/readback capability
core-composition-kit   composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  recipe normalization, geometry, topology, skeleton, skinning, attachments,
  collision recommendation, pose descriptors, record registry, hashes,
  snapshots, load validation and reset

instanced-render-batch-kit
  immutable capacity, cell replace/release, flush, bounds, overflow,
  statistics and snapshots

seeded-world-patch-controller-kit 0.1.0
  patch/cache identity, focus, active/retain/prefetch sets, generation queue,
  executor handoff, ready/release delivery, budgets, eviction and snapshots

camera-smooth-follow-kit 0.1.0
  controller registry, position/look SmoothDamp, quaternion damping, reset,
  teleport reset, delta-time clamp, transform access and snapshot/load/reset
```

### Product and local kits

```txt
prehistoric-rush-domain-kit 0.5.0
  run/input resources, simulation, route, surface, score, outcomes,
  creature access, events, scene transitions and snapshot

drunk-route-generator
  deterministic route samples, nearest query, progress,
  region classification and snapshot

player-raptor-preset-kit
  product creature recipe and collision configuration

prehistoric-patch-generator
  terrain arrays, tree descriptors, grass matrices, pickups,
  colliders, bounds and transferables

prehistoric-patch-worker
  initialization, generation, error protocol and transferable delivery
```

### External and host-implied kits

```txt
rapier-physics-domain-kit
three-runtime-module 0.179.1
rapier-runtime-module 0.15.0
module-worker-executor-adapter-kit
terrain-slot-consumer-kit
tree-instance-batch-consumer-kit
grass-patch-consumer-kit
shard-pickup-consumer-kit
patch-collider-consumer-kit
patch-height-sampler-kit
three-procedural-creature-adapter-kit
creature-descriptor-admission-kit
creature-geometry-binding-kit
creature-skeleton-binding-kit
creature-pose-binding-kit
creature-render-frame-correlation-kit
prehistoric-camera-target-policy-kit
three-camera-transform-consumer-kit
camera-light-render-adapter-kit
patch-streaming-hud-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

## Source revisions

```txt
NexusEngine:           e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits:      ae7ebda62f7c264bbde49c939a62e1a04fd60784
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js:              0.179.1
Rapier:                 0.15.0
parent domain:          prehistoric-rush-domain-kit 0.5.0
creature kit:           procedural-creature-body-kit 0.1.0
camera kit:             camera-smooth-follow-kit 0.1.0
renderer:               three-seeded-patch-streaming-smooth-camera-v6
```

## Main findings

### 1. The product consumes corrected triangle winding

The upstream tube index order changed from `a,c,b / b,c,d` to `a,b,c / b,d,c`. The product pin now includes that correction.

### 2. The Three adapter makes winding render-visible

`createCreatureMesh()` binds the descriptor index and normal arrays directly and creates a default FrontSide `MeshStandardMaterial`. The corrected winding therefore changes exterior visibility, lighting and shadow casting.

### 3. Descriptor identity excludes geometry payload

`contentHash` hashes `{ recipe, topology }`, where topology is summary counts only. Old and corrected index payloads can share the same hash.

### 4. Snapshot/load cannot detect the winding change

Snapshots retain recipe, incomplete `contentHash` and topology counts. `loadSnapshot()` recreates and compares only that hash.

### 5. Product binding and frame consumption are result-free

Three geometry creation, skeleton binding, pose application and render submission do not return typed product results or correlate the exact geometry hash and pose revision with a committed frame.

### 6. Public and lifecycle ownership remain incomplete

`PrehistoricRushHost` exposes mutable engine, adapter, patch controller and camera owners. Creature geometry/material/skeleton disposal and stale pose rejection are absent.

### 7. Executable proof is absent

There is no full descriptor hash fixture, winding/normal agreement fixture, Three binding fixture, skinned render frame fixture or deployed creature smoke.

## Priority order

```txt
P0 patch-content admission and acknowledged multi-consumer activation/release
P1 creature geometry identity, winding/normal proof and binding/frame correlation
P2 camera target descriptor and transform/frame consumption proof
P3 run-session reset with stream/camera/resource epochs
P4 Worker stale-result quarantine and ordered lifecycle disposal
P5 core-kit consumption and typed command proof
```

## Validation status

Documentation only. Runtime behavior was not changed by this audit. The repository has no root `package.json`; creature geometry identity and browser render fixtures are absent and were not run.
