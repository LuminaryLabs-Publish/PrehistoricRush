# Project Breakdown: Creature Geometry Identity and Surface Orientation

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T07-08-45-04-00`  
**Branch:** `main`

## Summary

`PrehistoricRush` was selected because its production source pin changed after the latest repo-local and central audits. The new `NexusEngine-Kits` revision contains a corrected triangle winding order for `procedural-creature-body-kit`, so the visible skinned raptor now consumes different index data even though the kit still reports version `0.1.0` and the descriptor `contentHash` still excludes positions, normals, skin data and indices.

The documentation gate is therefore creature geometry identity and render-consumption proof. The existing seeded patch activation transaction remains the highest gameplay-integrity implementation priority.

## Plan ledger

**Goal:** make a procedural creature's exact geometry, orientation, normals, skinning and rendered-frame consumption identifiable and executable-proof-backed without moving Three.js ownership into the renderer-agnostic creature kit.

- [x] Compare the complete accessible `LuminaryLabs-Publish` inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` because a production `NexusEngine-Kits` pin landed after its prior audit.
- [x] Inspect the product pin update and the upstream winding correction.
- [x] Inspect descriptor generation, topology metadata, content hashing, snapshot/load and Three.js binding.
- [x] Identify the full interaction loop, domains, kits and kit services.
- [x] Identify source identity, geometry identity, orientation, normal, binding and rendered-frame proof gaps.
- [x] Add timestamped architecture, render, gameplay, interaction, creature-system and deploy audits.
- [x] Refresh required root `.agent` documents and kit registry.
- [ ] Runtime implementation and executable fixture work remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or ledger-missing eligible repositories: 0
root-undocumented eligible repositories: 0
selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: recent production source-pin change after latest audit
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

The production pin changed in commit `53f8e45ce8b55cf9b4d20048534b77393b8b56e6` from `NexusEngine-Kits@5d3613b140ca33395f180acde014c167addf0ccc` to `NexusEngine-Kits@ae7ebda62f7c264bbde49c939a62e1a04fd60784`.

The meaningful upstream source change is commit `b716fd6bf238c5faa86b10eba3de03b7d3e1c77b`:

```diff
- target.indices.push(a, c, b, b, c, d);
+ target.indices.push(a, b, c, b, d, c);
```

## Product interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> resolve pinned NexusEngine, NexusEngine-Kits, ProtoKits, Three and Rapier modules
  -> install 12 Nexus Engine core kits
  -> install seed, creature, instance-batch, patch-controller and smooth-camera kits
  -> install prehistoric-rush-domain-kit 0.5.0
  -> create the player body descriptor from the product raptor preset
  -> bind descriptor indices, positions, normals, colors, skin indices and weights into Three BufferGeometry
  -> build Bone/Skeleton/SkinnedMesh and default FrontSide MeshStandardMaterial
  -> start run, patch streaming, physics and camera state
  -> browser input advances deterministic run simulation
  -> active patch consumers update terrain, vegetation, pickups, colliders and height sampling
  -> pose descriptor mutates the bound skeleton
  -> smooth-follow camera updates the Three camera transform
  -> Three renders the skinned creature and streamed world
  -> HUD and PrehistoricRushHost publish aggregate state
  -> requestAnimationFrame repeats
```

## Domains in use

```txt
runtime module graph and immutable source pins
Nexus Engine core input, spatial, scene, physics, motion, camera, animation,
graphics, skybox, UI, diagnostics and composition
seed and deterministic random streams
procedural creature recipe normalization
creature geometry positions, normals, colors and triangle indices
creature topology, surface orientation and front-face convention
skeleton, skin indices, skin weights and pose descriptors
creature content identity, snapshot and load validation
Three BufferGeometry, Bone, Skeleton, SkinnedMesh and material binding
creature pose-to-bone projection and render-frame consumption
Rapier collision descriptor and actor binding
instanced render-batch capacity and cell ownership
seeded patch identity, cache, scheduling, generation, delivery and release
product patch generation and Worker execution
patch-content admission and multi-consumer activation authority
terrain, vegetation, pickup, collider and height consumption
run lifecycle, route, movement, jump, score and outcomes
camera target policy, smooth-follow state and Three transform application
browser input, resize, blur, RAF, HUD and host observation
run, stream, camera and resource lifecycle
static Pages deployment and validation
```

## Kits and services

### Nexus Engine core kits

```txt
core-input-kit         action and binding services
core-spatial-kit       transform/query capability
core-scene-kit         scene registry and transition services
core-physics-kit       physics provider contract
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics and frame capability
core-skybox-kit        clear-day sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostics and readback capability
core-composition-kit   composition metadata and capability graph
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  recipe normalization, geometry arrays, triangle indices, normals, colors,
  topology counts, skeleton, skinning, attachments, collision recommendation,
  pose descriptors, record registry, snapshots, load validation and reset

instanced-render-batch-kit
  immutable capacity, cell replacement/release, flush, bounds, overflow,
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
  run/input resources, deterministic simulation, route, surface, score,
  outcomes, creature descriptor/pose access, events, scene transitions and snapshot

drunk-route-generator
  deterministic route samples, nearest query, progress, region classification and snapshot

player-raptor-preset-kit
  product creature recipe and collision configuration

prehistoric-patch-generator
  terrain arrays, tree descriptors, grass matrices, pickups, colliders, bounds and transferables

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
creature-pose-binding-kit
creature-render-frame-correlation-kit
prehistoric-camera-target-policy-kit
three-camera-transform-consumer-kit
camera-light-render-adapter-kit
patch-streaming-hud-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

## Main finding

The source pin now changes visible triangle orientation, but the shared descriptor identity does not prove that change.

```txt
kit version:              remains 0.1.0
contentHash inputs:       normalized recipe + topology counts only
contentHash exclusions:   positions, normals, colors, indices,
                          skin indices and skin weights
snapshot record:          recipe + contentHash + topology counts
product host readback:    id + contentHash + topology counts
```

The Three adapter directly binds descriptor indices and supplied normals, then creates a default FrontSide `MeshStandardMaterial`. Triangle winding therefore affects visibility, lighting and shadow behavior. Yet old and corrected descriptors can share the same version, topology counts and `contentHash`.

## Required invariant chain

```txt
pinned module revision
  -> descriptor schema/version
  -> full geometry payload hash
  -> declared front-face/winding convention
  -> normal-orientation validation
  -> skinning/bone validation
  -> typed Three binding result
  -> pose application revision
  -> rendered-frame acknowledgement
  -> bounded detached observation
```

## Next safe ledge

```txt
PrehistoricRush Creature Geometry Identity Authority
+ Winding / Normal / Skinned Render Fixture Gate
```

This documentation gate does not supersede the P0 seeded patch activation transaction. It prevents future creature geometry fixes from remaining invisible to descriptor identity, snapshots and product validation.

## Validation status

```txt
runtime source changed by this audit: no
package scripts changed: no
dependencies changed: no
branches created: no
pull requests created: no
root package.json: absent
geometry identity fixture: absent / not run
winding and normal fixture: absent / not run
skinned render fixture: absent / not run
browser smoke: not run
Pages smoke: not run
```
