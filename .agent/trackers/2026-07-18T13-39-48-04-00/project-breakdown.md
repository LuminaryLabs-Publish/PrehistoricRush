# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-18T13-39-48-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** oldest synchronized documented eligible repository  
**Reviewed prior documentation head:** `8ebddd3d89e02227898fbcd7ce75d7fb56efeaa4`  
**Reviewed runtime source revision:** `9462a74d747286d937d5dbfb2b245a2e7ae8371b`  
**Status:** `streamed-collider-membership-physics-fallback-convergence-authority-audited`

## Summary

The current Publish inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. All ten have central ledgers and root `.agent` coverage, and all ten current heads match their documented repo-local heads. PrehistoricRush is therefore selected by the oldest synchronized documented-selection rule.

The current collision path has two valid observation sources backed by one streamed collider collection:

```txt
patch activation/release
  -> rebuild sorted flattened collider array
  -> corePhysics.syncColliders(full array)

accepted simulation tick
  -> corePhysics.step(tick)
  -> independently scan adapter.view.colliders for fallback collision
  -> resolution policy prefers physics contact, otherwise fallback hit
```

This is functional redundancy, not a confirmed defect. The missing authority is one accepted collider-membership generation that settles provider synchronization, fallback-query indexing, disagreement classification, stale work, retirement and proof.

## Intent

Make streamed collider membership, Core Physics synchronization, fallback collision queries and resolution-policy arbitration consume one versioned generation and publish explicit command/results before a collision can settle a run.

## Checklist

- [x] Enumerate all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare eligible repository heads with central documented heads.
- [x] Select and modify only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Identify the complete interaction loop and active domains.
- [x] Document every implemented kit, adapter and proof surface with offered services.
- [x] Preserve the implemented census at 99 named surfaces.
- [x] Identify the full-membership sync and dual physics/fallback collision path.
- [x] Define one proposed collision-convergence authority and 20 coordinating surfaces.
- [ ] Implement generation-bound membership and observation settlement.
- [ ] Execute source, deterministic, browser, artifact and Pages fixtures.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger missing: 0
root .agent missing: 0
new or undocumented: 0
runtime-ahead: 0
selected: LuminaryLabs-Publish/PrehistoricRush
selection class: oldest synchronized documented eligible repository
reviewed repository head: 8ebddd3d89e02227898fbcd7ce75d7fb56efeaa4
reviewed runtime source revision: 9462a74d747286d937d5dbfb2b245a2e7ae8371b
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Observed eligible heads:

```txt
IntoTheMeadow    2e6745509c9e7771fc7448402da170c2b541c21b
TheLongHaul      2c21dbcd06f823633b2bad3d9977ab1ebe6bcbdd
HorrorCorridor   036d96ab9e470fedf15209d325bcc2d131cbf000
AetherVale       9a360984f9b923c211ab5c237488f799621f9153
ZombieOrchard    8e7212f0ec9961c3289b6a58316cde7a9e7df417
TheUnmappedHouse 7255e27f8867ff39167d3883d071251f99a9bb81
MyCozyIsland     75bc72594ff0eb3b225663bbbd3a63c6e58e5b45
TheOpenAbove     5dc86bc5838a6e4ab8d6431a833b6c88e44ff190
PhantomCommand   dae02ae15f394a0a6ba86d201a6e2eb980889437
PrehistoricRush  8ebddd3d89e02227898fbcd7ce75d7fb56efeaa4
```

## Complete interaction loop

```txt
page request
  -> module preflight and required tree-fidelity preparation
  -> hydrate runtime images
  -> create Nexus Engine, Rapier provider, player and patch controller

patch generation
  -> sample terrain and route
  -> select vegetation species
  -> emit terrain, tree, ground-cover, grass, pickup and tree-collider records

patch membership
  -> activate terrain/tree/foliage/ground-cover/production/base hosts
  -> store colliders by patch
  -> rebuild the complete sorted collider view
  -> submit the complete collider view to Core Physics
  -> repeat complete synchronization after any admitted release

accepted simulation tick
  -> submit kinematic player motion
  -> step Core Physics and publish physics.frame
  -> independently scan the same product collider view for fallback collision
  -> resolve physics contact first, otherwise fallback collision
  -> accept movement/pickups/goal or fail the run

presentation
  -> stream/release patches
  -> update camera, player, terrain and vegetation
  -> render Three.js frame
  -> publish startup and visible-frame receipts
```

## Domains in use

```txt
Browser/platform:
  document, DOM, ESM, import cache, RAF, keyboard, focus, lifecycle, Worker,
  fetch, Image/createImageBitmap, OffscreenCanvas, Canvas2D, IndexedDB, CDN, Pages

Nexus Engine:
  runtime, Assets, Startup, Input, Object, Shape, Capture, Fidelity, Vegetation,
  Ecology, Tree, Foliage, Object Bridge, Scene, Spatial, Creature, Character,
  Player, Physics, Articulated Dynamics, Simulation, Motion, Articulation,
  Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition, Presentation

Official Kits:
  seed, procedural creature body, instanced render batch,
  seeded world patch controller, camera smooth follow

Product:
  entry, menu, creator, character profile, run, route, surface, player, pose,
  terrain IK, pause, terrain streaming, collider membership, physics observation,
  fallback collision, resolution policy, tree fidelity, foliage atlas/cards,
  ground cover, production forest, density, pickups, score and outcomes

Hosts/proof:
  Three.js, Rapier, Worker/fallback execution, source fixtures, browser proof,
  static hosting, Actions/Pages deployment, repo-local governance and central tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 29

```txt
core-assets-kit: providers, assets, bundles, dependencies, requests, cache, progress, receipts, values, release
core-startup-kit: launches, required preparations, progress, first-frame presentation, input readiness, descriptors
core-input-kit: actions, axes, bindings, command state, snapshots
core-spatial-kit: transforms, hierarchy, spatial state
core-scene-kit: scene registry, transitions, active-scene state
core-creature-kit: creature definitions, registry, snapshots, reset
core-character-kit: character registry, bindings, status, snapshots, reset
core-player-kit: player registry, possession, control, spawn generations
core-physics-kit: provider-backed bodies, colliders, synchronization, stepping, contacts, frames
articulated-dynamics-domain-kit: articulated constraints and provider integration
core-simulation-kit: proposals, observations, resolution, events, committed frames
core-motion-kit: motion intents, requests, committed frames
articulated-motion-domain-kit: rigs, FK, targets, IK, snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral descriptors and terrain LOD policy
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation graph and snapshots
core-presentation-output-kit: viewport, render resolution, safe area
core-ui-scale-kit: reference resolution and scale policy
core-camera-framing-kit: framing, projection fit, damping, clipping
core-vegetation-kit: species/instance registries, deterministic variation, lifecycle, ecology selection, snapshots, reset
vegetation-ecology-domain-kit: suitability scoring and deterministic species selection
vegetation-tree-domain-kit: tree structures, shape recipes, fidelity profiles, capture requests, validation
vegetation-foliage-domain-kit: foliage descriptors, card families, clusters, placement recipes, wind, seasonal color, validation
vegetation-object-bridge-kit: species/instance conversion to Core Object descriptors and registration
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: world seed, named deterministic streams, snapshot, replay
procedural-creature-body-kit: geometry, skeleton, skinning, collision, attachments, object descriptors
instanced-render-batch-kit: stable ranges, cells, flush, visibility, release, diagnostics
seeded-world-patch-controller-kit: patch identity, rings, cache, generation, activation, release, liveness
camera-smooth-follow-kit: damped follow, reset, bounded delta, snapshots
```

### Product, page, asset and Worker kits: 28

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, collision sampler, player articulation and ground-leg IK
prehistoric-rush-pause-menu-domain-kit: menu state, commands, snapshots, UI and overlay descriptors
prehistoric-rush-terrain-lod-policy-kit: terrain LOD registration and query
prehistoric-rush-resolution-policy: movement, physics/fallback collision precedence, pickups, goals and transitions
player-character-composition-kit: body, rig, creature, character and possession
player-articulation-adapter-kit: pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: persistence, revisions, broadcasts and subscriptions
menu-page-kit: profile projection, navigation and asset-preload status
character-creator-page-kit: controls, draft, persistence and preview
character-preview-transition-kit: morph, crossfade, pose and lifecycle
three-procedural-creature-adapter-kit: creature mesh, pose, materials and disposal
game-page-entry-kit: dependency preflight, required asset preparation, pause host and startup receipts
player-raptor-preset-kit: authored creature content
drunk-route-generator: deterministic route generation and progress queries
prehistoric-patch-generator: terrain, ecology, density, matrices, tree colliders, grass, ground cover and pickups
prehistoric-patch-worker: provider import, catalog initialization, generation requests and transferables
tree-archetype-catalog-kit: species, silhouettes, palettes, textures, heights, ecology and weights
tree-fidelity-package-schema-kit: source, collision, forms, transitions, captures, materials and generation identity
tree-fidelity-asset-provider-kit: object build, capture, package, generation, progress and disposal
tree-fidelity-registration-kit: provider, packages, manifest and bundle
tree-fidelity-runtime-composition-kit: Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation and profiles
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement and receipts
tree-fidelity-runtime-image-hydration-kit: atlas discovery, decode, crop metadata, image binding and typed failures
prehistoric-vegetation-catalog-registration-kit: tree, foliage, ground-cover and object registration plus atlas identity
prehistoric-vegetation-runtime-composition-kit: isolated engine, catalog APIs, placement API and snapshots
prehistoric-vegetation-generator-options-kit: tree type, placement, species and atlas option publication
prehistoric-foliage-card-recipe-kit: atlas revision, families, mapping, placement closure and ground cover
```

### External, host, capture and render adapters: 22

```txt
three-runtime-module: scene, GPU resources, materials, textures, renderer and submission
rapier-physics-domain-kit: Core Physics provider bridge
rapier-runtime-module: Rapier runtime
message-worker-executor-adapter-kit: Worker request correlation and settlement
three-patch-stream-adapter-kit: base terrain, trees, legacy grass, shards, player, collider/pickup patch membership and rendering
terrain-lod-geometry-adapter: topology, indices, morph data and skirts
three-clay-surface-texture-adapter: deterministic surface textures
creator-viewport-framing-adapter: creator camera framing
creator-persistence-scheduler: delayed profile writes
browser-input-adapter: keyboard and action projection
creature-camera-render-host-adapters: pose, camera, frame and diagnostics projection
game-runtime-lod-host-adapter: preflight, composition, collider sampling, streaming, RAF and startup status
three-patch-stream-lod-adapter: terrain/tree/jungle/production composition, activation, release, frame acknowledgement and disposal
three-terrain-lod-layer: allocation, selection, morphing, stitching and disposal
three-object-capture-provider-adapter: framing, multi-angle observations, bounds and atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache and identity
three-tree-fidelity-layer: form selection, hysteresis, crossfade, frame addressing, UV binding, receipts and disposal
lush-jungle-atmosphere-render-adapter: background, fog, exposure, lighting and resource references
prehistoric-foliage-atlas-render-kit: procedural atlas, family texture views, revision identity and disposal
three-lush-foliage-layer: projected-size LOD, crossfade, wind/tint, family batches, ownership and disposal
three-ground-cover-layer: ecological instances, species batches, orientation, wind/tint, diagnostics, release and disposal
three-production-forest-layer: bark/root/branch/canopy records, six grass variants, ground details, culling, buffer writes, overflow, patch lifecycle and disposal
```

### Proof kits and fixtures: 15

```txt
package-test-syntax-gate: syntax validation for selected runtime modules
prehistoric-rush-resolution-policy-test-kit: movement/collision/pickup/outcome policy markers
player-articulation-test-kit: articulated player adapter behavior
player-character-composition-test-kit: character composition contract
player-pose-authority-test-kit: pose authority contract
character-creator-authority-test-kit: creator state and persistence contract
pause-menu-authority-test-kit: pause menu state and host contract
patch-owned-streaming-authority-test-kit: patch ownership and release contract
terrain-lod-renderer-authority-test-kit: terrain LOD renderer policy markers
tree-fidelity-assets-test-kit: tree package and generation identity markers
tree-fidelity-frame-addressing-test-kit: atlas frame addressing contract
tree-spawn-variation-test-kit: deterministic tree variation and density markers
vegetation-placement-fixture-test-adapter: placement fixture coverage
vegetation-product-and-foliage-module-test-kit: product catalog and module import coverage
production-forest-visuals-test-kit: static production recipes, composition and frame-counter markers
```

## Census

```txt
Nexus Engine root/subdomain kits:       29
official NexusEngine-Kits:               5
product/page/asset/Worker kits:          28
external/host/capture/render adapters:   22
proof kits and fixtures:                 15
total implemented named surfaces:        99
proposed collision-convergence surfaces: 20
```

## Source-backed finding

```txt
active radius: 2 -> at most 25 active patch positions
candidate trees per patch: 7 -> at most 175 generated tree collider descriptors before route/ecology rejection
patch collider records: implemented
collidersByPatch membership map: implemented
complete ordered collider view rebuild on activation: implemented
complete ordered collider view rebuild on release: implemented
corePhysics.syncColliders(complete view): implemented
provider-side delta/retention result exposed to product: not observed
fallback collision scan over complete product view per accepted game tick: implemented
physics.frame observation per accepted game tick: implemented
resolution precedence: physics contact first, fallback second
physics/fallback agreement or divergence result: absent
collider membership generation digest: absent
stale membership rejection: absent
FirstCollisionBoundFrameAck: absent
executable delta/parity/browser/artifact/Pages fixtures: absent
```

The 25-patch and 175-candidate figures are source-derived limits, not observed runtime counts or performance measurements.

## Required authority

**Proposed, not implemented:**

`prehistoric-rush-streamed-collider-membership-physics-fallback-convergence-authority-domain`

```txt
ColliderMembershipGenerationAdmissionCommand
  -> bind world, patch-controller, generator, physics-provider and fallback-index revisions
  -> ColliderMembershipGenerationResult

PatchColliderDeltaCommand
  -> added, retained, removed and rejected-stale collider records
  -> PatchColliderDeltaResult

PhysicsColliderSynchronizationCommand
  -> provider synchronization and retirement settlement
  -> PhysicsColliderSynchronizationResult

CollisionObservationArbitrationCommand
  -> compare physics and fallback evidence under one membership generation
  -> CollisionObservationArbitrationResult

CollisionProjectionCommitCommand
  -> CollisionFrameDigest
  -> FirstCollisionBoundFrameAck
```

### Proposed coordinating surfaces: 20

```txt
collider-membership-generation-manifest-kit
patch-collider-delta-builder-kit
collider-membership-ordering-kit
collider-membership-version-kit
core-physics-collider-sync-command-kit
core-physics-collider-sync-result-kit
fallback-collision-index-kit
fallback-collision-query-kit
collision-observation-arbitration-kit
collision-observation-divergence-result-kit
stale-collider-generation-rejection-kit
collider-resource-ownership-kit
collider-retirement-settlement-kit
collision-frame-digest-kit
first-collision-bound-frame-ack-kit
collider-membership-source-fixture-kit
collider-delta-sync-fixture-kit
physics-fallback-parity-fixture-kit
collision-browser-fixture-kit
collision-artifact-pages-fixture-kit
```

## Validation boundary

This audit used connector-backed source inspection. No checkout, package command, browser fixture, physics profiler, artifact or Pages-origin smoke was run. No runtime, tests, gameplay, rendering, physics, workflow or deployment file was changed.

No duplicate collision, missed collision, collider leak, performance regression, performance improvement, provider behavior, browser parity, artifact parity, Pages parity or production readiness is claimed.