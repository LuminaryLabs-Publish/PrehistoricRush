# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-15T06-39-22-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Prior repo-local documentation head:** `a882bce237ae6a404bb3fecf58b38cdf6b580928`  
**Reviewed runtime-ahead head:** `1a37e9141c9a3afd28db865d1df9b01cdd4cb7d2`  
**Status:** `terrain-single-owner-render-retirement-authority-audited`

## Summary

PrehistoricRush was selected before the oldest-documented fallback because nine commits advanced the repository beyond its last repo-local documentation head. Those commits repaired the prior terrain producer/consumer mismatch by booting a 64/32/16 LOD runtime, binding clay normal and roughness textures, adding LOD patch adapters and adding a terrain authority test.

The active integration still creates the complete legacy terrain renderer through the base patch adapter. The wrapper then creates the LOD terrain layer in the same scene and hides the legacy terrain meshes. Every accepted patch is therefore uploaded through both terrain paths, and release is coordinated across two independent terrain maps.

## Plan ledger

**Goal:** document the repaired LOD runtime and define one safe boundary that removes hidden legacy terrain while preserving all non-terrain patch-world services.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare the Publish inventory with ten central ledger entries and ten root `.agent` states.
- [x] Detect PrehistoricRush nine commits ahead of the last repo-local documentation head.
- [x] Select only PrehistoricRush under the runtime-ahead priority rule.
- [x] Compare the nine new commits and inspect all changed runtime and test files.
- [x] Trace boot, input, simulation, patch generation, terrain adoption, world-content adoption, LOD update, render and release.
- [x] Identify all domains, kits, adapters and offered services.
- [x] Preserve the prior 62-surface inventory and add four new active surfaces.
- [x] Add the timestamped tracker and terrain-ownership audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement the single-owner split and execute allocation, lifecycle, browser and Pages fixtures later.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
runtime-ahead repositories requiring priority: 1
selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: nine commits ahead of repo-local documentation head
base: a882bce237ae6a404bb3fecf58b38cdf6b580928
reviewed head: 1a37e9141c9a3afd28db865d1df9b01cdd4cb7d2
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Runtime-ahead changes

```txt
game.html                                      runtime pin updated
package.json                                   terrain test added
src/game-runtime-lod.js                        added
src/game.js                                    LOD runtime selected
src/render/three-clay-surface-textures.js      texture generation revised
src/render/three-patch-stream-lod-adapter.js   added
src/render/three-terrain-lod-layer.js          added
src/shared/runtime-versions.js                 Nexus revision updated
tests/terrain-lod-renderer-authority.mjs       added
```

## Complete interaction loop

```txt
page boot
  -> game.js imports game-runtime-lod.js
  -> shell creates the render host, status panel and action button
  -> pinned Nexus Engine, kit, Three.js and Rapier modules load
  -> PrehistoricRush kit graph installs Core and product domains
  -> Rapier provider adopts player physics
  -> patch controller, camera follow and LOD adapter are created

terrain adapter construction
  -> base patch adapter creates one shared Three.js scene and renderer
  -> base adapter allocates 25 fixed-grid terrain meshes
  -> base adapter creates vegetation, pickup, player and camera resources
  -> LOD wrapper creates the LOD terrain layer in the same scene
  -> LOD layer allocates 25 skirted terrain meshes and clay textures
  -> wrapper traverses the scene and hides fixed-grid terrain meshes

gameplay
  -> run starts automatically
  -> keyboard projects steer, boost, jump, restart and blur reset
  -> RAF derives bounded delta
  -> engine tick settles gameplay and physics
  -> patch controller updates focus, generation queue, cache and releases

ready patch adoption
  -> LOD layer acquires a slot
  -> LOD layer validates 64-segment fields and uploads position, normal, color and UV data
  -> LOD layer selects near, medium or far and sets index/morph state
  -> base adapter records the patch in activePatches
  -> base adapter uploads the same terrain into a fixed-grid legacy slot
  -> base adapter adopts trees, grass, colliders and pickups
  -> base adapter flushes batches and physics membership
  -> wrapper traverses the scene and hides legacy terrain again

frame presentation
  -> LOD layer updates selection, hysteresis and geomorph
  -> base adapter updates creature, world content, camera and renderer
  -> shared scene renders
  -> wrapper publishes a coarse lastVisibleFrameAck
  -> DOM status publishes run, patch and LOD counts

release
  -> LOD layer releases patch slot and map entry
  -> base adapter releases legacy terrain slot, content batches, colliders and pickups
```

## Source-backed terrain dimensions

```txt
activeRadius: 2
slot count per terrain owner: 25
legacy terrain owners: 1
LOD terrain owners: 1
total terrain mesh slots: 50

legacy source grid: 65 x 65
legacy vertices per slot: 4,225
LOD grid vertices: 4,225
LOD skirt vertices: 260
LOD vertices per slot: 4,485

legacy patch map: terrainByPatch
LOD patch map: byPatch
terrain upload paths per accepted patch: 2
scene traversal suppression path: hideLegacyTerrain()
```

## Domains in use

```txt
browser shell, module loading, input, RAF, resize, blur, Worker, storage and navigation
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
PrehistoricRush run, route, surface, score, outcome, pause, player composition, pose and terrain IK
patch schema, deterministic generation, Worker execution, queue, cache, desired set, adoption and release
terrain LOD policy, Core Graphics selection, hysteresis, index buffers, skirts, geomorph and bounds
world-space clay texture generation, normal map, roughness map, anisotropy and disposal
legacy fixed-grid terrain geometry, material, slot allocation, upload, hiding and release
Three.js scene, renderer, lights, fog, instancing, camera, creature and frame submission
Rapier provider, body/collider synchronization, collision sampling and height sampling
vegetation batching, pickups, shards, HUD status and diagnostics
validation, static hosting, Pages and central audit tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, registry, snapshots and reset
core-character-kit: character registry, bindings, status, snapshots and reset
core-player-kit: player registry, possession, control and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution and committed frames
core-motion-kit: motion intents, requests and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral descriptors and terrain LOD policy registration
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation composition graph and snapshots
core-presentation-output-kit: surface input, viewport policy, render resolution and safe area
core-ui-scale-kit: reference resolution, viewport scale and scale policy
core-camera-framing-kit: subject framing, projection fit, damping and clipping policy
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic world seeds and named random streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision and descriptors
instanced-render-batch-kit: batch registry, stable ranges, cell membership, flush and diagnostics
seeded-world-patch-controller-kit: focus, desired sets, generation queue, cache, adoption, release and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page and Worker kits: 17

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose and ground IK
prehistoric-rush-pause-menu-domain-kit: pause state, commands, events and snapshot
prehistoric-rush-terrain-lod-policy-kit: LOD policy registration, query, snapshot and reset
prehistoric-rush-resolution-policy: movement, collision, pickup, goal and transition resolution
player-character-composition-kit: body, rig, creature, character and possession
player-articulation-adapter-kit: legacy pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: localStorage, revisions, broadcasts, save, patch, reset and subscriptions
menu-page-kit: title, selected-profile projection and navigation
character-creator-page-kit: controls, draft, debounce, reset, external updates, navigation and preview
character-preview-transition-kit: morph, crossfade, pose and resource lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application and disposal
game-page-entry-kit: dependency preflight, runtime entry, feedback cleanup and pause host
player-raptor-preset-kit: authored player creature content
drunk-route-generator: deterministic route samples, nearest query, classification and progress
prehistoric-patch-generator: 64-segment terrain fields, trees, grass, pickups and colliders
prehistoric-patch-worker: Worker initialization, request, transfer and result protocol
```

### External, host and renderer adapters: 14

```txt
three-runtime-module: scene, resources and render submission
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling and disposal
three-patch-stream-adapter-kit: legacy terrain plus world-content, collider, pickup, height, camera and ownership services
terrain-lod-geometry-adapter: topology, per-level indices, skirts, world UVs, morph offsets and bounds
three-clay-surface-texture-adapter: deterministic normal/roughness generation, texture setup and disposal
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: delayed profile writes and timer replacement
browser-input-adapter: keyboard, blur, jump, boost, steer, start and restart projection
creature-camera-render-host-adapters: pose, camera, feedback and diagnostics projection
game-runtime-lod-host-adapter: pinned loading, engine composition, Rapier setup, streaming, input, RAF and public diagnostics
three-patch-stream-lod-adapter: LOD/base composition, ordered activation, legacy suppression, release and frame acknowledgement
three-terrain-lod-layer: LOD slot allocation, patch upload, selection, geomorph, clay material, release and disposal
```

### Proof kits: 8

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
terrain-lod-renderer-authority-test-kit
```

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits: 5
product/page/Worker kits: 17
external/host/render adapters: 14
proof kits: 8
total source-backed surfaces: 66
new active surfaces: 4
```

## Main architecture finding

The LOD layer is the intended authoritative terrain renderer, but it is composed by wrapping a base adapter that cannot separate terrain presentation from patch-world services. Compatibility is implemented by hiding legacy meshes, not by retiring the legacy terrain owner. This leaves duplicate geometry allocation, duplicate patch uploads, two terrain slot maps and split release semantics.

## Required authority

`prehistoric-rush-terrain-presentation-single-owner-retirement-authority-domain`

```txt
TerrainPresentationCompositionCommand
  -> bind adapter, renderer, terrain policy and patch schema generations
  -> select exactly one terrain presentation provider
  -> compose vegetation, collision, pickup, height and camera services independently
  -> reject zero-owner and multi-owner terrain compositions
  -> publish TerrainPresentationCompositionResult

TerrainPatchPresentationCommand
  -> bind PatchId, PatchGeneration, schema, LOD policy and renderer generation
  -> prepare one terrain slot, one upload set and one material binding
  -> select LOD and transition state
  -> atomically adopt the single terrain owner with content membership
  -> publish TerrainPresentationAdoptionResult
  -> acknowledge FirstTerrainOwnerFrameAck with accepted patch revisions

TerrainPatchRetirementCommand
  -> bind the accepted adoption result
  -> release one terrain slot and one terrain map entry
  -> retire late Worker and render work
  -> publish TerrainPresentationRetirementReceipt

TerrainRendererRetirementCommand
  -> dispose geometry, indices, materials, textures, renderer ownership and canvas/listener resources once
  -> reject late activation and frame commands
```

## Required fixtures

```txt
LOD adapter allocates 25 terrain meshes, not 50
one terrain patch map exists
one position/color/normal upload occurs per patch
no hideLegacyTerrain scene traversal exists
vegetation, colliders, pickups, height and camera remain active
failed terrain candidate preserves accepted content according to declared policy
release produces one terrain retirement receipt
restart/dispose leaves no extra meshes, canvases or listeners
near/medium/far and geomorph remain correct
first matching source, build and Pages terrain frame
```

## Validation boundary

Documentation only. The nine runtime commits were inspected and retained unchanged. `npm test`, controlled Three.js instantiation, browser execution, allocation tracing, GPU upload measurement, mixed-LOD visual checks, restart/disposal proof, built-output smoke and Pages smoke were not executed.