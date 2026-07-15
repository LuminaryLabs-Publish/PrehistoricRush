# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-15T05-38-36-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed pre-audit documentation head:** `fb7180ab0d5f11deabde7d62f62d24ad31e5c5b6`  
**Reviewed runtime-ahead head:** `6b61bf3ec04fec09f11d7c4f60b281e3d8cb71b4`  
**Status:** `terrain-lod-patch-render-admission-authority-audited`

## Summary

PrehistoricRush was selected before the oldest-documented fallback because it was five commits ahead of the centrally recorded documentation head. Those commits add a renderer-neutral terrain LOD policy, 64-segment terrain fields, reusable LOD topology with skirts and morph offsets, and generated clay normal/roughness textures.

The active game and Three.js patch adapter were not migrated with the producer. `game-runtime.js` still configures `segments: 30`; the adapter allocates a 31 x 31 terrain mesh, while the patch generator now always emits 65 x 65 terrain fields. During first patch activation the adapter attempts to copy 12,675 color floats into a 2,883-float attribute, which is a deterministic typed-array capacity mismatch. The new LOD geometry and clay texture helpers are also not consumed by the active adapter.

## Plan ledger

**Goal:** reconcile the runtime-ahead terrain work and define one producer-to-renderer admission contract that validates resolution, adopts LOD geometry and material resources atomically, and proves the first matching terrain frame.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare the Publish inventory with ten central ledger entries and root `.agent` states.
- [x] Detect PrehistoricRush five commits ahead of its recorded repo-local documentation head.
- [x] Select only PrehistoricRush under the runtime-ahead priority rule.
- [x] Compare the five new commits and inspect every changed source file.
- [x] Trace patch generation, Worker transfer, streaming adoption, terrain mesh allocation, attribute upload, LOD policy registration, geometry helpers, and clay texture helpers.
- [x] Preserve all prior kits and services and add the three new terrain surfaces.
- [x] Add the timestamped tracker and terrain-specific audit family.
- [x] Change documentation only, target `main`, and create no branch or pull request.
- [ ] Repair the runtime producer/consumer contract and execute terrain fixtures later.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
runtime-ahead repositories: 1
selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: five source commits ahead of recorded documentation head
base: fb7180ab0d5f11deabde7d62f62d24ad31e5c5b6
head: 6b61bf3ec04fec09f11d7c4f60b281e3d8cb71b4
```

## Runtime-ahead changes

```txt
src/world/prehistoric-terrain-lod-policy.js      added
src/render/terrain-lod-geometry.js               added
src/render/three-clay-surface-textures.js        added
src/world/prehistoric-patch-generator.js         modified
src/domains/prehistoric-rush/prehistoric-rush-domain-kit.js modified
```

No active Three.js patch-adapter file, test file, package script, workflow, or deployment file changed in the five-commit range.

## Complete interaction loop

```txt
boot game
  -> cfg.segments remains 30
  -> compose Core domains and prehistoric-rush-terrain-lod-policy-kit
  -> register 64/32/16 LOD policy in Core Graphics
  -> create patch generator

patch generation
  -> generator discards cfg.segments
  -> sourceResolution becomes 64
  -> emit 65 x 65 heights
  -> emit 65 x 65 x 3 colors and normals
  -> Worker or synchronous path transfers the same arrays

patch adoption
  -> seeded patch controller returns ready patch
  -> Three.js adapter activates patch
  -> adapter terrain slot still owns 31 x 31 geometry
  -> set 961 position heights from the first part of the field
  -> copy 12,675 color floats into a 2,883-float attribute
  -> typed-array copy cannot fit
  -> patch activation cannot complete through the current source path

new LOD helpers
  -> topology, skirts, morph offsets and clay textures exist
  -> active adapter imports none of them
  -> no per-patch LOD selection or material binding occurs
```

## Source-backed dimensions

```txt
runtime cfg.segments: 30
adapter terrain vertices: (30 + 1)^2 = 961
adapter color/normal floats: 961 x 3 = 2,883
patch sourceResolution: 64
patch terrain vertices: (64 + 1)^2 = 4,225
patch color/normal floats: 4,225 x 3 = 12,675
source floats larger than target: 9,792
```

## Domains in use

```txt
browser lifecycle, input, RAF, Worker, transferables, storage and navigation
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
PrehistoricRush run, route, surface, score, outcome, pause, player composition, pose and terrain IK
terrain source-field generation, patch identity, cache, queue, Worker transfer and adoption
terrain LOD policy, distance selection, hysteresis, skirts, geomorph data and world-space material policy
Three.js terrain geometry, attribute capacity, GPU upload, normal/roughness textures and resource disposal
Rapier colliders, height sampling, vegetation batching, pickups and camera follow
validation, static hosting, Pages and central tracking
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
core-graphics-kit: renderer-neutral descriptors including terrain LOD policy registration
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
prehistoric-rush-terrain-lod-policy-kit: renderer-neutral LOD policy registration, query, snapshot and reset
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

### External, host and renderer adapters: 11

```txt
three-runtime-module: scene, resources and render submission
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling and disposal
three-patch-stream-adapter-kit: patch presentation, colliders, pickups, height, camera and ownership
terrain-lod-geometry-adapter: shared topology, per-level indices, skirts, world UVs, morph offsets and bounds
three-clay-surface-texture-adapter: deterministic normal/roughness generation, Three.js texture setup and disposal
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: delayed profile writes and timer replacement
browser-input-adapter: keyboard, blur, jump, boost, steer, start and restart projection
creature-camera-render-host-adapters: pose, camera, feedback and diagnostics projection
```

### Proof kits: 7

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
```

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits: 5
product/page/Worker kits: 17
external/host/render adapters: 11
proof kits: 7
total source-backed surfaces: 62
new terrain surfaces: 3
```

## Main architecture finding

The terrain producer, LOD policy, renderer topology, material resources and patch-adoption path do not share one versioned schema or admission result. The producer was upgraded to 64-segment fields, while the active adapter remains structurally bound to the legacy 30-segment mesh. Patch membership is published before a validated renderer candidate exists, and the new topology and texture helpers are disconnected from the active path.

## Required authority

```txt
prehistoric-rush-terrain-lod-patch-render-admission-authority-domain
```

```txt
TerrainPatchRenderAdmissionCommand
  -> bind PatchId, PatchGeneration, terrain schema revision,
     LOD policy revision, adapter generation and renderer generation
  -> validate source resolution, array lengths, bounds and material revision
  -> select near, medium or far level from the accepted focus snapshot
  -> build or acquire matching topology and index buffers
  -> bind skirts, morph offsets, world UVs, normal map and roughness map
  -> stage attribute uploads without mutating the accepted predecessor slot
  -> publish TerrainPatchRenderAdmissionResult and resource receipts
  -> atomically adopt patch membership only after GPU preparation succeeds
  -> reject capacity mismatch, stale policy, missing resources and late Worker results
  -> acknowledge FirstTerrainLodFrameAck
```

## Required fixtures

```txt
30-config to 64-source mismatch rejection
64-source near/medium/far topology admission
color and normal capacity checks
Worker and synchronous parity
adjacent mixed-LOD skirt coverage
hysteresis and geomorph transition
normal/roughness texture creation and disposal
failed patch upload preserves predecessor slot
patch release retires geometry, textures and morph state
first matching source, build and Pages terrain frame
```

## Validation boundary

Documentation only. The five runtime commits were inspected and retained unchanged. No runtime repair, browser execution, `npm test`, build, Pages smoke, GPU upload, mixed-LOD visual fixture or performance measurement was performed. The array-size conflict is a direct source contract mismatch; no claim is made that every browser exposes the same error text or that the new LOD design is otherwise visually incorrect.