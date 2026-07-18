# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-18T05-40-17-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** only runtime-ahead eligible repository  
**Prior documentation head:** `a4238e98222f3a3b5f4aaeb52e7f2e747ec1cdab`  
**Reviewed runtime head:** `9462a74d747286d937d5dbfb2b245a2e7ae8371b`  
**Status:** `production-forest-legacy-vegetation-work-retirement-authority-audited`

## Summary

The current Publish inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. All ten have central ledgers and root `.agent` coverage. Nine eligible heads matched their documented heads; PrehistoricRush was 11 commits ahead and was the only selected repository.

The delta adds a production forest presentation layer, clustered vegetation placement, new terrain/forest material identities, six grass variants, procedural bark/root/branch/canopy construction, ground details, frame counters and static source-policy tests. The layer hides legacy grass meshes, but the base patch adapter still constructs and processes the hidden legacy grass batches.

## Intent

Define one generation-owned authority that admits the production forest, retires superseded vegetation work, governs capacity and overflow, preserves required patch/gameplay data, disposes resources and proves the matching visible frame.

## Checklist

- [x] Enumerate all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare eligible repository heads with central documented heads.
- [x] Select and modify only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Reconcile 11 runtime/test commits and ten changed files.
- [x] Identify the complete interaction loop and active domains.
- [x] Document every implemented kit, adapter and proof surface with offered services.
- [x] Expand the implemented census from 97 to 99 surfaces.
- [x] Define one proposed production-forest retirement authority and 20 coordinating surfaces.
- [ ] Implement full retirement, capacity and frame settlement.
- [ ] Execute source, browser, artifact and Pages fixtures.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger missing: 0
root .agent missing: 0
new or undocumented: 0
runtime-ahead: 1
selected: LuminaryLabs-Publish/PrehistoricRush
selection class: only runtime-ahead eligible repository
prior documented head: a4238e98222f3a3b5f4aaeb52e7f2e747ec1cdab
reviewed runtime head: 9462a74d747286d937d5dbfb2b245a2e7ae8371b
ahead by: 11 commits
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Runtime delta reconciled

```txt
package test surface expanded
production forest renderer added
production forest composed into the LOD host
clustered production placement added
terrain and forest cache identities advanced
foliage-family ground-cover orientation refined
branch taper and ground-detail orientation corrected
production forest source-policy tests added
terrain/tree authority fixtures aligned
```

Changed files observed:

```txt
package.json
src/game-runtime-lod.js
src/render/three-ground-cover-layer.js
src/render/three-patch-stream-lod-adapter.js
src/render/three-production-forest-layer.js
src/world/prehistoric-patch-generator.js
tests/production-forest-visuals.mjs
tests/terrain-lod-renderer-authority.mjs
tests/tree-fidelity-assets.mjs
tests/tree-spawn-variation.mjs
```

## Complete interaction loop

```txt
page request
  -> module preflight
  -> required tree-fidelity asset preparation
  -> runtime image hydration
  -> create Nexus Engine game, Rapier provider and player
  -> create seeded world patch controller and Worker/fallback generator

patch generation
  -> sample terrain and route classification
  -> select vegetation through Object Vegetation ecology
  -> create tree, ground-cover, grass, pickup and collider records
  -> attach production density and cache identities

patch activation
  -> terrain LOD host
  -> tree fidelity and lush foliage hosts
  -> ground-cover host
  -> production forest host
  -> base terrain/tree/grass/pickup/collider host

production presentation
  -> derive bark, roots, primary/secondary branches and canopy groups
  -> derive six grass variants and four ground-detail variants
  -> store records by patch
  -> hide matching legacy grass meshes
  -> distance-cull records and rewrite production instance buffers
  -> base adapter still replaces/releases/flushes hidden legacy grass batches
  -> base adapter still advances hidden legacy grass uniforms each frame

frame and gameplay
  -> tick simulation and physics
  -> accept steer, boost and jump input
  -> stream/release patches
  -> collide, collect shards, score, pause and settle outcome
  -> render Three.js frame
  -> publish tree, foliage, production forest and startup receipts
```

## Domains in use

```txt
Browser/platform:
  document, DOM, ESM, import cache, RAF, keyboard, focus, lifecycle, Worker,
  fetch, Image/createImageBitmap, OffscreenCanvas, Canvas2D, IndexedDB, CDN, Pages

Nexus Engine:
  runtime, Assets, Startup, Input, Object, Shape, Capture, Fidelity, Vegetation,
  Ecology, Tree, Foliage, Object Bridge, Scene, Spatial, Creature, Character,
  Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox,
  UI, Diagnostics, Composition and Presentation

Official Kits:
  seed, procedural creature body, instanced render batch,
  seeded world patch controller and camera smooth follow

Product:
  entry, menu, creator, character profile, run, route, surface, player, pose,
  terrain IK, pause, terrain streaming, tree fidelity, foliage atlas/cards,
  ground cover, production forest, density, patch ownership, pickups, score, outcomes

Hosts/proof:
  Three.js, Rapier, source fixtures, browser proof, static hosting,
  Actions/Pages deployment, repo-local audit governance and central tracking
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
core-physics-kit: provider-backed bodies, colliders, stepping, contacts, frames
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
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose and IK
prehistoric-rush-pause-menu-domain-kit: menu state, commands, snapshots, UI and overlay descriptors
prehistoric-rush-terrain-lod-policy-kit: terrain LOD registration and query
prehistoric-rush-resolution-policy: movement, collision, pickups, goals and transitions
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
prehistoric-patch-generator: terrain, ecology, density, matrices, collision, grass, ground cover and pickups
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
three-patch-stream-adapter-kit: base terrain, trees, legacy grass, shards, player, patch membership and rendering
terrain-lod-geometry-adapter: topology, indices, morph data and skirts
three-clay-surface-texture-adapter: deterministic surface textures
creator-viewport-framing-adapter: creator camera framing
creator-persistence-scheduler: delayed profile writes
browser-input-adapter: keyboard and action projection
creature-camera-render-host-adapters: pose, camera, frame and diagnostics projection
game-runtime-lod-host-adapter: preflight, composition, generation identity, streaming, RAF and startup status
three-patch-stream-lod-adapter: terrain/tree/jungle/production composition, activation, release, frame acknowledgement and disposal
three-terrain-lod-layer: allocation, selection, morphing, stitching and disposal
three-object-capture-provider-adapter: framing, multi-angle observations, bounds and atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache and identity
three-tree-fidelity-layer: form selection, hysteresis, crossfade, frame addressing, UV binding, receipts and disposal
lush-jungle-atmosphere-render-adapter: background, fog, exposure, lighting and resource references
prehistoric-foliage-atlas-render-kit: procedural atlas, family texture views, revision identity and disposal
three-lush-foliage-layer: projected-size LOD, crossfade, wind/tint, family batches, ownership and disposal
three-ground-cover-layer: ecological instances, species batches, orientation, wind/tint, diagnostics, release and disposal
three-production-forest-layer: bark/root/branch/canopy records, six grass variants, ground details, culling, buffer writes, overflow, patch lifecycle, legacy visibility suppression and disposal
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
production-forest-visuals-test-kit: static recipes, branches, bark, canopy, grass, suppression, details, composition and frame-counter markers
```

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 28
external/host/capture/render adapters: 22
proof kits and fixtures: 15
total implemented named surfaces: 99
proposed production forest retirement surfaces: 20
```

## Source-backed finding

```txt
production forest host and patch records: implemented
clustered production placement: implemented
procedural bark/root/branch/canopy: implemented
six grass and four detail variants: implemented
legacy grass visibility suppression: implemented
legacy grass batch construction: still active
legacy grass patch replace/release/flush: still active
legacy grass per-frame uniform update: still active
production counts and overflow counter: implemented
capacity policy admission and overflow settlement: absent
patch generation/cache identity in visible-frame digest: absent
FirstProductionForestBoundFrameAck: absent
real retirement/browser/artifact/Pages fixtures: absent
```

## Required authority

**Proposed, not implemented:**

`prehistoric-rush-production-forest-legacy-vegetation-work-retirement-authority-domain`

```txt
ProductionForestGenerationAdmissionCommand
  -> bind renderer, density, atlas, material, capacity and patch revisions
  -> ProductionForestGenerationResult

VegetationPresentationAuthorityCommand
  -> choose authoritative vegetation hosts before construction
  -> VegetationPresentationAuthorityResult

LegacyVegetationRetirementCommand
  -> retire superseded hosts, batches, membership work and frame work
  -> LegacyVegetationRetirementResult

ProductionForestCapacitySettlementCommand
  -> classify admitted capacity, culling, writes and overflow
  -> ProductionForestCapacityResult

ProductionForestProjectionCommitCommand
  -> ProductionForestFrameDigest
  -> FirstProductionForestBoundFrameAck
```

### Proposed coordinating surfaces: 20

```txt
production-forest-generation-manifest-kit
vegetation-presentation-authority-admission-kit
legacy-vegetation-host-discovery-kit
legacy-grass-retirement-command-kit
legacy-grass-retirement-result-kit
patch-membership-work-routing-kit
production-patch-record-cache-kit
production-forest-capacity-policy-kit
production-forest-overflow-settlement-kit
production-forest-cull-budget-kit
production-forest-buffer-write-budget-kit
production-forest-material-revision-kit
production-forest-resource-ownership-kit
production-forest-disposal-settlement-kit
production-forest-frame-digest-kit
first-production-forest-bound-frame-ack-kit
production-forest-source-fixture-kit
legacy-work-retirement-fixture-kit
production-forest-browser-fixture-kit
production-forest-artifact-pages-fixture-kit
```

## Validation boundary

This audit used GitHub connector source inspection. No checkout, package command, browser fixture, profiler, artifact or Pages-origin smoke was run. The audit changes documentation only; the production forest runtime/test delta existed before this pass.

No performance improvement/regression, resource leak, visual defect, capacity failure, browser parity, artifact parity, Pages parity or production readiness is claimed.