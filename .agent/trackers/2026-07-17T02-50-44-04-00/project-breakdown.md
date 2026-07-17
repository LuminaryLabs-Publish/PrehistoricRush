# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-17T02-50-44-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** runtime-ahead eligible repository  
**Reviewed repository head:** `b87cdad1f1666b089935bb221f7daf9bc4f6a779`  
**Previous repo-local documentation head:** `5f5f93c5c8519dd5bf952b160875b8e28f85ed18`  
**Status:** `product-vegetation-runtime-fixture-authority-audited`

## Summary

The current `LuminaryLabs-Publish` inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. All ten remain represented by central ledger records and root `.agent` state. PrehistoricRush was selected because five test-focused commits were ahead of its documented head. Only PrehistoricRush was changed during this pass.

The delta adds an executable product-module import fixture, expands the deterministic placement fixture to preserve the full Vegetation instance envelope, adds an assertion that generated trees carry `nexus-vegetation-instance/1`, and runs the new import fixture from `npm test`.

The focused remaining gap is runtime-fixture fidelity. The import test proves exports resolve but does not execute the exported runtime constructors. The dense spawn test still uses a test-only placement fixture rather than `createPrehistoricVegetationRuntime()` and the pinned Nexus Engine implementation. The source suite can therefore pass while actual Core Vegetation composition, catalog registration, Worker initialization, or browser CDN integration is broken.

## Intent

Make one executable fixture prove that the checked-in product modules, pinned Nexus Engine runtime, semantic catalog, patch generator, Worker path, collision projection, and browser-loaded frame all consume the same Vegetation contracts.

## Checklist

- [x] Enumerate all 11 current Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Select only PrehistoricRush through runtime-ahead priority.
- [x] Compare documentation head `5f5f93c…` with runtime head `b87cdad…`.
- [x] Review five commits and four changed files.
- [x] Identify the complete interaction loop and active domains.
- [x] Document all 91 implemented kits, adapters, and proof surfaces with services.
- [x] Define one executable product-runtime fixture authority and 18 coordinating surfaces.
- [x] Add a new timestamped root `.agent` audit family.
- [ ] Execute the actual pinned Nexus Engine runtime in a browser fixture.
- [ ] Prove main-thread, Worker, patch, collision, package, and first-frame contract convergence.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
undocumented repositories: 0
selected runtime delta: 5 commits / 4 files / +43 / -3
selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: test-focused runtime activity ahead of the documented head
reviewed runtime head: b87cdad1f1666b089935bb221f7daf9bc4f6a779
previous documentation head: 5f5f93c5c8519dd5bf952b160875b8e28f85ed18
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
menu and game preparation
  -> import product vegetation and tree-fidelity modules
  -> create Assets/Object/Shape/Capture/Fidelity composition
  -> install Core Vegetation domains
  -> register ten species, tree structures, foliage descriptors, and object bridges
  -> derive semantic fidelity profiles
  -> build or load portable tree packages

host startup
  -> import pinned Nexus Engine, Three.js, Rapier, and official kits
  -> create gameplay, vegetation, patch, camera, physics, and rendering services
  -> start Worker-backed deterministic patch generation

patch generation
  -> sample route, terrain, slope, moisture, temperature, and clusters
  -> select species through Vegetation
  -> create a Vegetation instance descriptor
  -> emit tree matrices, semantic metadata, colliders, grass, and pickups

runtime frame
  -> stream and activate patches
  -> resolve tree fidelity form and exact frame
  -> render terrain, trees, grass, pickups, player, and UI
  -> settle run progress, collisions, score, pause, fail, win, and restart

test loop
  -> syntax-check product modules
  -> import product vegetation exports
  -> validate catalog constants are cloneable
  -> generate dense deterministic patches through a test-only placement fixture
  -> validate instance envelopes, variation ranges, collider presence, and species diversity
  -> does not execute actual product Vegetation runtime or browser CDN composition
```

## Main source-backed finding

```txt
vegetation-module-imports.mjs
  product exports resolve: yes
  ten archetypes and tree types resolve: yes
  raw catalogs structuredClone: yes
  createPrehistoricVegetationRuntime() executed: no
  registerPrehistoricVegetationCatalog() executed: no
  tree-fidelity provider replacement executed: no

vegetation-placement-fixture.mjs
  deterministic species selection: yes
  full nexus-vegetation-instance/1 envelope: yes
  test-owned hash and variation implementation: yes
  actual Core Vegetation implementation: no

 tree-spawn-variation.mjs
  dense deterministic forest: yes
  all ten species: yes
  variation ranges and collider presence: yes
  actual product runtime placement: no
  Worker runtime path: no
  browser/CDN module graph: no
  rendered-frame proof: no
```

This is an executable-proof gap, not evidence of a current gameplay or rendering defect. The new tests materially improve source confidence, but they stop before the production domain composition and browser delivery boundary.

## Domains in use

```txt
browser document, routes, import map, ES module cache, DOM, input, lifecycle, RAF, storage, IndexedDB, Worker, and CDN delivery
Nexus Engine runtime, scene, spatial, creature, character, player, physics, simulation, motion, camera, animation, graphics, UI, diagnostics, composition, and presentation
Core Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation, Ecology, Tree, Foliage, and Vegetation Object Bridge
NexusEngine-Kits seed, procedural creature, instance batch, seeded patch streaming, and camera smoothing
PrehistoricRush run, route, surface, player, pose, terrain IK, pause, patch, tree, grass, pickup, and outcome
semantic archetype, species, tree, foliage, object, ecology, variation, collision, package, cache, Worker, and frame generation
Three.js, Rapier, source fixtures, static delivery, GitHub Pages, repo-local audit governance, and central tracking
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
core-vegetation-kit: species and instance registries, deterministic variation, lifecycle, ecology selection, snapshots, reset
vegetation-ecology-domain-kit: suitability scoring and deterministic species selection
vegetation-tree-domain-kit: tree structures, shape recipes, fidelity profiles, capture requests, validation
vegetation-foliage-domain-kit: foliage descriptors, card policy, wind response, seasonal color, validation
vegetation-object-bridge-kit: species and instance conversion to Core Object descriptors and registration
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: world seed, named deterministic streams, snapshot, replay
procedural-creature-body-kit: geometry, skeleton, skinning, collision, attachments, object descriptors
instanced-render-batch-kit: stable ranges, cells, flush, visibility, release, diagnostics
seeded-world-patch-controller-kit: patch identity, rings, cache, generation, activation, release, liveness
camera-smooth-follow-kit: damped follow, reset, bounded delta, snapshots
```

### Product, page, asset, and Worker kits: 27

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose, IK
prehistoric-rush-pause-menu-domain-kit: pause commands, state, events, snapshots
prehistoric-rush-terrain-lod-policy-kit: terrain LOD registration and query
prehistoric-rush-resolution-policy: movement, collision, pickups, goals, transitions
player-character-composition-kit: body, rig, creature, character, possession
player-articulation-adapter-kit: pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: persistence, revisions, broadcasts, subscriptions
menu-page-kit: profile projection, navigation, asset-preload status
character-creator-page-kit: controls, draft, persistence, preview
character-preview-transition-kit: morph, crossfade, pose, lifecycle
three-procedural-creature-adapter-kit: creature mesh, pose, materials, disposal
game-page-entry-kit: dependency preflight, required asset preparation, pause host, startup receipts
player-raptor-preset-kit: authored creature content
drunk-route-generator: deterministic route generation and progress queries
prehistoric-patch-generator: terrain, Vegetation species selection, instance variation, matrices, scaled collision, grass, pickups
prehistoric-patch-worker: engine import, vegetation initialization, requests, generation, transferable results
tree-archetype-catalog-kit: ten species, silhouettes, palettes, textures, heights, ecology, weights
tree-fidelity-package-schema-kit: source, collision, four forms, transitions, captures, materials, generation identity
tree-fidelity-asset-provider-kit: object build, capture, package, generation, progress, disposal
tree-fidelity-registration-kit: provider, packages, manifest, bundle
tree-fidelity-runtime-composition-kit: Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation, semantic profiles
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement, receipts
tree-fidelity-runtime-image-hydration-kit: atlas discovery, decode, crop metadata, image binding, typed failures
prehistoric-vegetation-catalog-registration-kit: species, tree, foliage, object registration
prehistoric-vegetation-runtime-composition-kit: isolated engine, catalog APIs, placement API, snapshots
prehistoric-vegetation-generator-options-kit: tree type, placement, species option publication
```

### External, host, capture, and render adapters: 17

```txt
three-runtime-module: scene, GPU resources, materials, textures, render submission
rapier-physics-domain-kit: Core Physics provider bridge
rapier-runtime-module: Rapier runtime
message-worker-executor-adapter-kit: Worker request correlation and settlement
three-patch-stream-adapter-kit: terrain, instances, colliders, pickups, rendering
terrain-lod-geometry-adapter: topology, indices, morph data, skirts
three-clay-surface-texture-adapter: deterministic surface textures
creator-viewport-framing-adapter: creator camera framing
creator-persistence-scheduler: delayed profile writes
browser-input-adapter: keyboard and action projection
creature-camera-render-host-adapters: pose, camera, frame, diagnostics projection
game-runtime-lod-host-adapter: composition, generation identity, streaming, RAF, startup receipt, status
three-patch-stream-lod-adapter: terrain/tree fidelity composition, activation, release, disposal
three-terrain-lod-layer: allocation, selection, morphing, stitching, disposal
three-object-capture-provider-adapter: framing, multi-angle observations, bounds, atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache and identity
three-tree-fidelity-layer: four-form selection, hysteresis, crossfade, exact frame addressing, UV binding, receipts, disposal
```

### Proof kits and fixtures: 13

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
terrain-lod-renderer-authority-test-kit
tree-fidelity-assets-test-kit
tree-fidelity-frame-addressing-test-kit
tree-spawn-variation-test-kit
vegetation-placement-fixture-test-adapter
vegetation-product-module-import-test-kit: export resolution, catalog cardinality, and structured-clone checks
```

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 27
external/host/capture/render adapters: 17
proof kits and fixtures: 13
total active named surfaces: 91
planned executable-fixture surfaces: 18
```

## Required authority

`prehistoric-rush-product-vegetation-runtime-fixture-authority-domain`

```txt
ProductVegetationFixtureAdmissionCommand
  -> bind product source, pinned engine, browser origin, Worker, catalog, patch, collision, package, and renderer revisions
  -> instantiate the actual product runtime
  -> register all ten semantic catalog entries
  -> generate one deterministic main-thread patch and one Worker patch
  -> compare full Vegetation instance envelopes and colliders
  -> load the same graph through the browser/CDN path
  -> render one accepted package-bound tree frame
  -> reject test doubles as production-conformance evidence
  -> publish ProductVegetationFixtureResult
  -> publish FirstProductVegetationPatchAck
  -> publish FirstProductVegetationFrameAck
```

## Planned authority surfaces

```txt
product-vegetation-fixture-manifest-kit
pinned-engine-module-loader-fixture-kit
actual-vegetation-runtime-construction-fixture-kit
semantic-catalog-registration-fixture-kit
product-placement-api-fixture-kit
main-thread-patch-contract-fixture-kit
worker-patch-contract-fixture-kit
main-worker-instance-parity-fixture-kit
instance-envelope-schema-fixture-kit
scaled-collider-parity-fixture-kit
species-package-binding-fixture-kit
browser-cdn-module-graph-fixture-kit
pages-origin-module-graph-fixture-kit
fixture-revision-admission-kit
test-double-evidence-classification-kit
product-vegetation-fixture-result-kit
first-product-vegetation-patch-ack-kit
first-product-vegetation-frame-ack-kit
```

## Validation boundary

Documentation changed. Runtime JavaScript, tests, package scripts, gameplay, rendering, physics, Worker behavior, workflows, and deployment were not changed by this audit. The five-commit test delta and relevant source modules were inspected. `npm test`, actual pinned-engine runtime construction, Worker parity, browser module loading, built-output smoke, and Pages smoke were not run.

No current gameplay defect, actual product-runtime conformance, Worker parity, browser/CDN integrity, artifact parity, Pages parity, or production readiness is claimed.