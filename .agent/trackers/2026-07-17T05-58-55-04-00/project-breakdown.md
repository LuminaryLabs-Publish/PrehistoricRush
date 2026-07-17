# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** runtime-ahead eligible repository  
**Reviewed repository head:** `248586fb4774c9219fb2ce0aaeec2b46bf3b69de`  
**Previous repo-local documentation head:** `e7c5d238d7ba406ecf02b8d91416161f03201147`  
**Status:** `jungle-foliage-atmosphere-runtime-adoption-authority-audited`

## Summary

The current `LuminaryLabs-Publish` inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. All ten remain represented by central ledger records and root `.agent` state. PrehistoricRush was selected because two runtime commits were ahead of its documented head. No other project was changed.

The delta adds a deterministic eight-family foliage-card catalog, tree-card placement recipes, six ground-cover archetypes, and a Three.js jungle-atmosphere helper. The commits add only the two new modules. They do not change any game, Worker, renderer, package, test, or deployment consumer, and `package.json` does not syntax-check or execute either module.

The focused gap is runtime adoption and lifecycle authority. The new foliage and atmosphere capabilities exist as source modules but are not bound to an accepted catalog generation, patch generation, renderer generation, quality policy, disposal path, or matching visible frame.

## Intent

Make one admitted jungle-presentation generation authoritative for foliage-card families, tree-card placements, ground-cover spawning, atmosphere mutation, quality budgets, GPU ownership, retirement, and the exact rendered frame.

## Checklist

- [x] Enumerate all 11 current Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Select only PrehistoricRush through runtime-ahead priority.
- [x] Compare documentation head `e7c5d23…` with runtime head `248586f…`.
- [x] Review two commits and two added files.
- [x] Identify the complete interaction loop and active domains.
- [x] Document all 93 implemented kits, adapters, and proof surfaces with services.
- [x] Define one jungle foliage/atmosphere adoption authority and 20 coordinating surfaces.
- [x] Add a new timestamped root `.agent` audit family.
- [ ] Import and install the new modules in the production host and Worker paths.
- [ ] Prove catalog, patch, GPU, lifecycle, browser, artifact, Pages, and frame convergence.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
undocumented repositories: 0
selected runtime delta: 2 commits / 2 added files / +352 / -0
selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: runtime commits ahead of the documented head
reviewed runtime head: 248586fb4774c9219fb2ce0aaeec2b46bf3b69de
previous documentation head: e7c5d238d7ba406ecf02b8d91416161f03201147
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
current production loop
  -> menu/game imports established product modules
  -> Core Vegetation and tree-fidelity composition register semantic species
  -> Worker-backed patch generation emits terrain, trees, grass, pickups and colliders
  -> runtime activates patches and selects fidelity forms
  -> Three.js renders terrain, vegetation, player, atmosphere and UI
  -> gameplay settles route progress, collision, score, pause, fail, win and restart

new source capability
  -> prehistoric-foliage-card-recipes.js defines atlas identity, eight card families,
     deterministic tree-card placements and six ground-cover archetypes
  -> lush-jungle-atmosphere.js defines background, exponential fog, exposure,
     hemisphere/sun retuning, shadow settings, fill light and canopy bounce
  -> no changed production consumer imports or applies either module
  -> no patch/Worker path publishes card or ground-cover generations
  -> no renderer path owns atmosphere application or disposal
  -> no matching-frame acknowledgement proves visible adoption

required adopted loop
  -> admit one JunglePresentationGeneration
  -> register immutable foliage-card and ground-cover catalogs
  -> derive instance-specific tree-card placements
  -> generate main-thread and Worker patch payloads under explicit budgets
  -> allocate/reuse card atlas materials and instance batches
  -> apply atmosphere once per scene/renderer generation
  -> retire predecessor lights, materials, buffers and catalog generations
  -> publish JunglePresentationProjectionResult
  -> publish FirstJunglePresentationFrameAck
```

## Main source-backed finding

```txt
prehistoric-foliage-card-recipes.js
  atlas revision and 4x2 layout: present
  eight card families: present
  deterministic family lookup and placement recipes: present
  six ground-cover archetypes: present
  production import/adoption change in delta: absent
  atlas texture asset binding: absent
  Worker payload integration: absent
  instance-specific placement generation identity: absent
  far-quality budget policy: absent
  syntax/test coverage in package scripts: absent

lush-jungle-atmosphere.js
  background/fog/exposure mutation: present
  existing hemisphere/sun retuning: present
  new fill and ambient lights: present
  production import/adoption change in delta: absent
  idempotent apply/replace policy: absent
  duplicate-light prevention: absent
  disposal/restore contract: absent
  quality-aware shadow budget: absent
  renderer/scene generation receipt: absent
  syntax/test coverage in package scripts: absent
```

This is a runtime-adoption and lifecycle gap. It does not prove a current gameplay defect. The new source can be useful, but its presence alone does not change the shipped frame.

## Domains in use

```txt
browser document, routes, import map, ES module cache, DOM, input, lifecycle, RAF, storage, IndexedDB, Worker and CDN delivery
Nexus Engine runtime, scene, spatial, creature, character, player, physics, simulation, motion, camera, animation, graphics, UI, diagnostics, composition and presentation
Core Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation, Ecology, Tree, Foliage and Vegetation Object Bridge
NexusEngine-Kits seed, procedural creature, instance batch, seeded patch streaming and camera smoothing
PrehistoricRush run, route, surface, player, pose, terrain IK, pause, patch, tree, grass, pickup and outcome
semantic archetype, species, tree, foliage, card atlas, ground cover, ecology, variation, collision, package, cache, Worker and frame generation
Three.js scene, lighting, fog, tone mapping, shadows, materials, instancing, GPU resources and render submission
Rapier, source fixtures, static delivery, GitHub Pages, repo-local audit governance and central tracking
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

### Product, page, asset and Worker kits: 28

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
prehistoric-foliage-card-recipe-kit: atlas revision/dimensions, eight family descriptors, family lookup, archetype mapping, deterministic tree-card placement and six ground-cover archetypes
```

### External, host, capture and render adapters: 18

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
lush-jungle-atmosphere-render-adapter: background, exponential fog, tone-map exposure, hemisphere/sun retuning, shadow tuning, fill light, canopy bounce and returned resource references
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
vegetation-product-module-import-test-kit: export resolution, catalog cardinality and structured-clone checks
```

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 28
external/host/capture/render adapters: 18
proof kits and fixtures: 13
total active named surfaces: 93
planned jungle-adoption surfaces: 20
```

## Required authority

`prehistoric-rush-jungle-foliage-atmosphere-runtime-adoption-authority-domain`

```txt
JunglePresentationAdmissionCommand
  -> bind source, engine, catalog, Worker, patch, renderer, scene, quality and viewport revisions
  -> validate foliage atlas identity, family descriptors and ground-cover catalog
  -> publish JunglePresentationAdmissionResult

FoliageCatalogRegistrationCommand
  -> register immutable card-family and ground-cover generations
  -> reject duplicate, stale or mutable catalog evidence
  -> publish FoliageCatalogRegistrationResult

FoliagePatchProjectionCommand
  -> derive instance-specific card and ground-cover placements
  -> enforce near/medium/far budgets and deterministic identity
  -> compare main-thread and Worker payloads
  -> publish FoliagePatchProjectionResult

JungleAtmosphereProjectionCommand
  -> apply once per scene/renderer generation
  -> retain predecessor values and owned resources
  -> prevent duplicate fill/bounce lights
  -> enforce quality-aware shadow and fog policy
  -> publish JungleAtmosphereProjectionResult

JunglePresentationRetirementCommand
  -> retire stale catalogs, buffers, materials, lights and scene mutations exactly once
  -> restore or replace predecessor atmosphere state
  -> publish JunglePresentationRetirementResult

JunglePresentationFrameCommitCommand
  -> bind accepted patch, catalog, atmosphere and GPU generations to one rendered frame
  -> publish JunglePresentationProjectionResult
  -> publish FirstJunglePresentationFrameAck
```

## Proposed coordinating surfaces: 20

```txt
jungle-presentation-generation-kit
foliage-atlas-revision-admission-kit
foliage-card-family-catalog-kit
ground-cover-catalog-kit
foliage-catalog-immutability-validation-kit
tree-card-instance-seed-kit
tree-card-placement-budget-kit
ground-cover-ecology-selection-kit
foliage-main-thread-projection-kit
foliage-worker-projection-kit
foliage-main-worker-parity-kit
foliage-card-instance-batch-kit
foliage-atlas-material-binding-kit
jungle-atmosphere-scene-admission-kit
jungle-atmosphere-idempotent-apply-kit
jungle-atmosphere-quality-budget-kit
jungle-presentation-resource-retirement-kit
jungle-presentation-projection-result-kit
first-jungle-patch-ack-kit
first-jungle-presentation-frame-ack-kit
```

## Required fixtures

```txt
source import and syntax fixture for both new modules
catalog schema, atlas-cell and immutability fixture
deterministic instance-specific tree-card placement fixture
near/medium/far card-budget fixture
ground-cover ecology and route-exclusion fixture
main-thread/Worker foliage payload parity fixture
atmosphere apply-twice idempotency fixture
scene replacement and disposal fixture
quality-tier shadow/fog budget fixture
browser source-origin first visible frame
built/static artifact first visible frame
Pages-subpath first visible frame
catalog/patch/renderer/frame digest convergence
```

## Claim boundary

Documentation only. The two runtime modules were reviewed but not modified, imported, executed, syntax-checked, rendered, packaged, or deployed by this audit. No visible jungle upgrade, runtime adoption, GPU lifecycle correctness, browser parity, artifact parity, Pages parity, or production readiness is claimed.
