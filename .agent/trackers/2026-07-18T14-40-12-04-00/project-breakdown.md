# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-18T14-40-12-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** only runtime-ahead eligible repository  
**Prior repo-local documentation head:** `b734e087e4d70315285fc3ef29b1788c487945b6`  
**Reviewed runtime head:** `3c8175991939632cc9e4029f4554fbebf360f9f5`  
**Runtime commits reconciled:** `4`  
**Status:** `natural-tree-growth-compute-capture-fidelity-convergence-authority-audited`

## Summary

The current Publish inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. All ten retain central-ledger and root `.agent` coverage. Nine eligible repositories still match their recorded repo-local heads. PrehistoricRush is four runtime commits ahead and is therefore the only selected project.

The new runtime installs Core Compute, creates and validates deterministic near/medium natural-growth plans for every tree archetype, packs branch/foliage/shading buffers and exposes the plans through the tree-fidelity runtime. It also adds a Three.js natural-tree geometry builder that can construct roots, wood segments and foliage cards from a growth plan.

The active fidelity provider still builds its capture subject with `createPrehistoricTreeObject(THREE, archetype)`. It does not consume `runtime.growthPlans`, and it does not import or call `createPrehistoricNaturalTreeObject`. Therefore the new compute growth generation is prepared, versioned and stored, but it is not yet the source geometry used by Object Shape, Core Capture or the emitted near/medium/far/horizon fidelity package.

## Intent

Bind compute-prepared growth plans, natural source geometry, Object Shape, Core Capture and Object Fidelity to one accepted tree-growth generation so the package revision describes the geometry actually captured and rendered.

## Checklist

- [x] Enumerate all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare eligible heads with central repo-local documentation heads.
- [x] Select and modify only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Reconcile four runtime commits after `b734e087e4d70315285fc3ef29b1788c487945b6`.
- [x] Identify the complete interaction loop and domains.
- [x] Document every implemented kit, adapter, provider and proof surface with offered services.
- [x] Expand the implemented census from 99 to 103 named surfaces.
- [x] Trace Core Compute growth-plan preparation into the fidelity-provider boundary.
- [x] Confirm the natural geometry builder is not consumed by the active provider path.
- [x] Define one proposed convergence authority with 20 coordinating surfaces.
- [ ] Bind growth-plan identity to source geometry and captured fidelity packages.
- [ ] Add executable source, deterministic, browser, artifact and Pages proof.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger missing: 0
root .agent missing: 0
new or wholly undocumented: 0
runtime-ahead eligible repositories: 1
selected: LuminaryLabs-Publish/PrehistoricRush
selection class: runtime-ahead reconciliation
prior documented repo-local head: b734e087e4d70315285fc3ef29b1788c487945b6
reviewed runtime head: 3c8175991939632cc9e4029f4554fbebf360f9f5
ahead by: 4
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
PrehistoricRush  3c8175991939632cc9e4029f4554fbebf360f9f5
```

## Complete interaction loop

```txt
page request
  -> preflight required modules
  -> create isolated tree-fidelity asset runtime
  -> install Assets, Startup, Object, Shape, Capture, Fidelity and Vegetation domains
  -> install Core Compute
  -> register prehistoric vegetation catalog

natural-growth preparation
  -> for each of 12 tree archetypes resolve Tree and Foliage descriptors
  -> create four compute buffers, three provider kernels and one graph
  -> register descriptors with Core Compute
  -> execute one near and one medium graph request
  -> create deterministic phyllotaxis/apical-tropism growth plans
  -> validate segments, foliage clusters and crown coverage
  -> pack branch, foliage and shading arrays
  -> expose plans, metrics, validation and revisions on the runtime
  -> rebind asset packages, manifest and bundle to the growth revision

fidelity package load
  -> active Assets provider receives an archetype package request
  -> provider still creates the legacy archetype tree object
  -> flatten legacy object into portable source geometry
  -> register Core Object and Object Shape source
  -> request near/medium Shape forms and far/horizon captures
  -> emit portable fidelity package and hydrate runtime images

play
  -> create game engine, Rapier provider, player and patch controller
  -> generate and stream terrain, vegetation, pickups and colliders
  -> simulate movement, collision, scoring and outcomes
  -> select tree fidelity forms and render Three.js frames
```

## Domains in use

```txt
Browser/platform:
  document, DOM, ESM, import cache, RAF, keyboard, focus, lifecycle, Worker,
  fetch, Image/createImageBitmap, OffscreenCanvas, Canvas2D, IndexedDB, CDN, Pages

Nexus Engine:
  runtime, Assets, Startup, Input, Object, Shape, Capture, Fidelity, Compute,
  Vegetation, Ecology, Tree, Foliage, Object Bridge, Scene, Spatial, Creature,
  Character, Player, Physics, Articulated Dynamics, Simulation, Motion,
  Articulation, Camera, Animation, Graphics, Skybox, UI, Diagnostics,
  Composition and Presentation

Official Kits:
  seed, procedural creature body, instanced render batch,
  seeded world patch controller and camera smooth follow

Product:
  entry, menu, creator, character profile, run, route, surface, player, pose,
  terrain IK, pause, terrain streaming, collision, tree-fidelity assets,
  deterministic natural tree growth, compute descriptor preparation,
  natural source geometry, foliage atlas/cards, ground cover, production forest,
  density, pickups, score and outcomes

Hosts/proof:
  Three.js, Rapier, Worker/fallback execution, source fixtures, browser proof,
  static hosting, Actions/Pages deployment, repo-local governance and central tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 30

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
core-presentation-output-kit: viewport, render resolution and safe area
core-ui-scale-kit: reference resolution and scale policy
core-camera-framing-kit: framing, projection fit, damping and clipping
core-vegetation-kit: species/instance registries, deterministic variation, lifecycle, selection, snapshots and reset
vegetation-ecology-domain-kit: suitability scoring and deterministic species selection
vegetation-tree-domain-kit: tree registry, canopy composition, natural growth, validation, compute descriptors, Shape/Fidelity/Capture recipes
vegetation-foliage-domain-kit: foliage descriptors, card families, clusters, placement recipes, wind, seasonal color and validation
vegetation-object-bridge-kit: species/instance conversion to Core Object descriptors and registration
core-compute-domain: buffers, kernels, graphs, deterministic execution plans, provider dispatch, snapshots and reset
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: world seed, named deterministic streams, snapshot and replay
procedural-creature-body-kit: geometry, skeleton, skinning, collision, attachments and object descriptors
instanced-render-batch-kit: stable ranges, cells, flush, visibility, release and diagnostics
seeded-world-patch-controller-kit: patch identity, rings, cache, generation, activation, release and liveness
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page, asset and Worker kits: 30

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, collision sampler, articulation and ground-leg IK
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
tree-fidelity-runtime-composition-kit: Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation, Compute and profiles
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement and receipts
tree-fidelity-runtime-image-hydration-kit: atlas discovery, decode, crop metadata, image binding and typed failures
prehistoric-vegetation-catalog-registration-kit: tree, foliage, ground-cover and object registration plus atlas identity
prehistoric-vegetation-runtime-composition-kit: isolated engine, catalog APIs, placement API and snapshots
prehistoric-vegetation-generator-options-kit: tree type, placement, species and atlas option publication
prehistoric-foliage-card-recipe-kit: atlas revision, families, mapping, placement closure and ground cover
prehistoric-tree-growth-compute-provider-kit: deterministic plan execution plus branch, foliage and shading buffer packing
prehistoric-tree-growth-plan-preparation-kit: descriptor registration, near/medium execution, validation, metrics and immutable plan publication
```

### External, host, capture and render adapters: 23

```txt
three-runtime-module: scene, GPU resources, materials, textures, renderer and submission
rapier-physics-domain-kit: Core Physics provider bridge
rapier-runtime-module: Rapier runtime
message-worker-executor-adapter-kit: Worker request correlation and settlement
three-patch-stream-adapter-kit: base terrain, trees, legacy grass, shards, player, collider/pickup membership and rendering
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
three-production-forest-layer: bark/root/branch/canopy records, grass variants, ground details, culling, buffers, overflow and lifecycle
prehistoric-natural-tree-geometry-adapter-kit: growth-plan roots/wood cylinders, bark vertex colors, foliage cards, bounds proxy and capture subject construction
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
Nexus Engine root/subdomain kits:       30
official NexusEngine-Kits:               5
product/page/asset/Worker kits:          30
external/host/capture/render adapters:   23
proof kits and fixtures:                 15
total implemented named surfaces:       103
new implemented surfaces this pass:       4
proposed growth-convergence surfaces:    20
```

## Source-backed natural-growth finding

```txt
tree archetypes: 12
compute buffers registered per archetype: 4
compute kernels registered per archetype: 3
compute graphs registered per archetype: 1
near/medium executions per archetype: 2
source-derived totals: 48 buffers, 36 kernels, 12 graphs and 24 executions

growth plans created and validated: implemented
growth plan branch/foliage/shading packing: implemented
growth revision in asset versions and metadata: implemented
runtime.growthPlans publication: implemented
natural growth Three.js object builder: implemented
active fidelity provider consumption of runtime.growthPlans: not observed
active provider import/call of createPrehistoricNaturalTreeObject: not observed
active capture source: createPrehistoricTreeObject legacy archetype geometry
fidelity package growth-plan digest: absent
first growth-bound capture/render acknowledgement: absent
```

The descriptor and execution totals are source-derived startup work, not measured execution cost. The unconsumed builder finding follows the reviewed import/call path and four-commit diff; it is not a claim that no future or external caller can use the module.

## Required authority

**Proposed, not implemented:**

`prehistoric-rush-natural-tree-growth-compute-capture-fidelity-convergence-authority-domain`

```txt
TreeGrowthGenerationAdmissionCommand
  -> bind engine, vegetation catalog, compute provider, archetype, quality and revision
  -> TreeGrowthGenerationResult

TreeGrowthComputeExecutionCommand
  -> register descriptors, execute graph, validate and digest growth plan
  -> TreeGrowthComputeExecutionResult

NaturalTreeSourceGeometryCommand
  -> select accepted near/medium plan and build portable source geometry
  -> NaturalTreeSourceGeometryResult

TreeGrowthFidelityBindingCommand
  -> bind source geometry, Shape forms, Capture results and fidelity package to one growth generation
  -> TreeGrowthFidelityBindingResult

TreeGrowthProjectionCommitCommand
  -> TreeGrowthFrameDigest
  -> FirstGrowthBoundFrameAck
```

### Proposed coordinating surfaces: 20

```txt
natural-tree-growth-generation-manifest-kit
tree-growth-compute-provider-admission-kit
tree-growth-descriptor-registration-kit
tree-growth-plan-execution-kit
tree-growth-plan-validation-kit
tree-growth-plan-digest-kit
tree-growth-plan-selection-kit
natural-tree-source-object-builder-kit
natural-tree-geometry-portability-kit
growth-plan-fidelity-source-binding-kit
tree-capture-subject-generation-kit
object-shape-source-binding-kit
fidelity-package-growth-revision-kit
stale-growth-generation-rejection-kit
growth-resource-ownership-kit
growth-resource-retirement-kit
tree-growth-frame-digest-kit
first-growth-bound-frame-ack-kit
natural-growth-source-fixture-kit
natural-growth-browser-artifact-pages-fixture-kit
```

## Validation boundary

This pass used connector-backed source inspection. Direct checkout still could not resolve `github.com`. No package command, browser fixture, capture comparison, artifact download or Pages-origin smoke was run. Runtime, tests, gameplay, rendering, physics, workflow and deployment files were not changed by this audit.

No visible tree defect, startup regression, performance cost, memory leak, capture mismatch, browser incompatibility, artifact parity, Pages parity or production readiness is claimed. The confirmed documentation gap is that compute growth plans and a natural geometry builder exist while the active fidelity provider remains bound to legacy source geometry.