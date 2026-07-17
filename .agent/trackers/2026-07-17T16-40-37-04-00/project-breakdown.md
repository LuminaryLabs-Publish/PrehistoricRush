# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-17T16-40-37-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** runtime-ahead eligible repository  
**Previous documented repository head:** `f5a4748b1b6f897c92930094737565528839fb41`  
**Reviewed runtime head:** `06e2bc0439643e46153b8c7f7f42a4e91a2db5e1`  
**Status:** `foliage-family-closure-atlas-revision-convergence-authority-audited`

## Summary

The current `LuminaryLabs-Publish` installation contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. Existing central tracking and root `.agent` state cover the eligible set. PrehistoricRush was selected because its runtime head is three commits ahead of the last documented repo-local head.

The three-commit delta repairs a referential-integrity defect in tree foliage descriptors. A tree can have one primary foliage family while generated placements also reference secondary families, especially `hanging-vine`. `createPrehistoricTreeFoliageInput()` now collects the primary family plus every family referenced by generated placements, validates each reference, and publishes the complete `cardFamilies` set. The atlas identity advanced from `prehistoric-foliage-cards-v1` to `prehistoric-foliage-cards-v2`, and the source fixture now checks family closure for all 12 tree archetypes.

## Intent

Establish one authority that proves every foliage cluster references a declared card family, the same family closure and atlas revision reach the browser and Worker catalogs, every accepted patch belongs to that revision, and the matching rendered frame contains the family-complete foliage presentation.

## Checklist

- [x] Enumerate all 11 current Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Select and modify only PrehistoricRush.
- [x] Compare the last documented head with current `main`.
- [x] Inspect all three runtime-ahead commits and all three changed files.
- [x] Identify the complete interaction loop and active domains.
- [x] Preserve the complete 97-surface kit and offered-service inventory.
- [x] Document descriptor family closure and atlas revision `v2`.
- [x] Define one convergence authority and 20 coordinating surfaces.
- [ ] Execute `npm test` in a checked-out environment.
- [ ] Add browser, Worker, artifact and Pages convergence fixtures.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger records: present for eligible repositories
root .agent state: present for eligible repositories
selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: runtime-ahead eligible repository
previous documented head: f5a4748b1b6f897c92930094737565528839fb41
reviewed runtime head: 06e2bc0439643e46153b8c7f7f42a4e91a2db5e1
runtime delta: 3 commits / 3 files
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Runtime delta

```txt
a96a0ecd fix(foliage): register all referenced card families
  -> createPrehistoricTreeFoliageInput() enumerates near placements first
  -> unions primary family with every placement.familyId
  -> rejects unknown secondary families
  -> emits self-contained cardFamilies descriptors

ed814f2e chore(foliage): bump atlas catalog revision
  -> prehistoric-foliage-cards-v1 becomes prehistoric-foliage-cards-v2

06e2bc04 test(foliage): validate complete family coverage
  -> checks every cluster family exists in descriptor.cardFamilies
  -> checks broad-canopy includes broadleaf-spray and hanging-vine
  -> checks the v2 atlas identity
```

## Complete interaction loop

```txt
authored tree archetype
  -> foliageFamilyIdForArchetype() chooses the primary family
  -> createTreeFoliageCardPlacements() creates near/medium placements
  -> placement generation may add secondary families such as hanging-vine
  -> createPrehistoricTreeFoliageInput() closes all family references
  -> foliage.register() admits the self-contained descriptor
  -> catalog publishes tree, foliage, ground-cover and object descriptors

browser main realm
  -> imports the pinned Nexus Engine provider
  -> constructs Core Object Vegetation
  -> registers the family-complete product catalog
  -> creates deterministic patch generation and streaming

Worker realm
  -> imports the same provider and product modules
  -> registers the same catalog
  -> reports species counts and foliage atlas revision
  -> generates transferable patches

presentation
  -> procedural atlas creates all eight family tiles at revision v2
  -> lush foliage layer creates near/medium batches for all families
  -> patch activation admits trees and ecological ground cover
  -> render loop selects LOD, writes card instances and submits the frame
  -> lushVegetationFrameAck reports frame, atlas revision and visible counts

play
  -> player runs the route through streamed terrain and vegetation
  -> collisions, pickups, score, pause and outcome continue
```

## Domains in use

```txt
browser document, route, import map, module cache, DOM, keyboard, focus,
lifecycle, RAF, storage, IndexedDB, Worker and CDN delivery

Nexus Engine runtime, scene, spatial, creature, character, player, physics,
simulation, motion, camera, animation, graphics, UI, diagnostics,
composition and presentation

Core Assets, Startup, Input, Object, Shape, Capture, Fidelity, Vegetation,
Ecology, Tree, Foliage and Vegetation Object Bridge

NexusEngine-Kits seed, procedural creature, instance batch,
seeded world-patch control and camera smoothing

PrehistoricRush run, route, surface, resolution, player, pose, terrain IK,
pause, terrain streaming, tree, grass, foliage cards, ground cover,
pickup, score and outcome

Three.js presentation, Rapier physics, source tests, static delivery,
GitHub Pages, repo-local audit governance and central tracking
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
vegetation-foliage-domain-kit: foliage descriptors, card families, clusters, placement recipes, wind response, seasonal color, validation
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
prehistoric-rush-pause-menu-domain-kit: menu state, commands, snapshots, UI and overlay descriptors
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
prehistoric-patch-generator: terrain, ecology selection, variation, matrices, scaled collision, grass, ground cover, pickups
prehistoric-patch-worker: provider import, catalog initialization, requests, generation, transferable results
tree-archetype-catalog-kit: species, silhouettes, palettes, textures, heights, ecology and weights
tree-fidelity-package-schema-kit: source, collision, forms, transitions, captures, materials, generation identity
tree-fidelity-asset-provider-kit: object build, capture, package, generation, progress, disposal
tree-fidelity-registration-kit: provider, packages, manifest, bundle
tree-fidelity-runtime-composition-kit: Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation and semantic profiles
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement, receipts
tree-fidelity-runtime-image-hydration-kit: atlas discovery, decode, crop metadata, image binding and typed failures
prehistoric-vegetation-catalog-registration-kit: tree, foliage, ground-cover and object registration plus atlas identity
prehistoric-vegetation-runtime-composition-kit: isolated engine, catalog APIs, placement API and snapshots
prehistoric-vegetation-generator-options-kit: tree type, placement, species and atlas option publication
prehistoric-foliage-card-recipe-kit: atlas revision, eight families, archetype mapping, complete placement-family closure and six ground-cover archetypes
```

### External, host, capture and render adapters: 21

```txt
three-runtime-module: scene, GPU resources, materials, textures, renderer and render submission
rapier-physics-domain-kit: Core Physics provider bridge
rapier-runtime-module: Rapier runtime
message-worker-executor-adapter-kit: Worker request correlation and settlement
three-patch-stream-adapter-kit: base terrain, legacy vegetation, grass, shards, player, patch activation and rendering
terrain-lod-geometry-adapter: topology, indices, morph data and skirts
three-clay-surface-texture-adapter: deterministic surface textures
creator-viewport-framing-adapter: creator camera framing
creator-persistence-scheduler: delayed profile writes
browser-input-adapter: keyboard and action projection
creature-camera-render-host-adapters: pose, camera, frame and diagnostics projection
game-runtime-lod-host-adapter: module preflight, runtime composition, generation identity, streaming, RAF, startup receipt and status
three-patch-stream-lod-adapter: terrain/tree/jungle composition, activation, release, frame acknowledgement and child disposal
three-terrain-lod-layer: allocation, selection, morphing, stitching and disposal
three-object-capture-provider-adapter: framing, multi-angle observations, bounds and atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache and identity
three-tree-fidelity-layer: four-form selection, hysteresis, crossfade, exact frame addressing, UV binding, receipts and disposal
lush-jungle-atmosphere-render-adapter: background, fog, exposure, light/shadow tuning, fill/canopy lights and resource references
prehistoric-foliage-atlas-render-kit: procedural atlas, family texture views, revision identity and disposal
three-lush-foliage-layer: projected-size LOD, hysteresis, stable admission, crossfade, wind/tint, family batches, ownership and disposal
three-ground-cover-layer: ecological instances, species batches, wind/tint, diagnostics, release and disposal
```

### Proof kits and fixtures: 14

```txt
package-test-syntax-gate
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
vegetation-product-and-foliage-module-test-kit
```

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 28
external/host/capture/render adapters: 21
proof kits and fixtures: 14
total implemented named surfaces: 97
planned foliage convergence surfaces: 20
```

## Source-backed finding

```txt
primary family selection: present
secondary placement families: present
complete descriptor family closure: implemented
unknown secondary family rejection: implemented
atlas revision v2: implemented
all 12 archetypes covered by source assertion: implemented
broad-canopy broadleaf + hanging-vine assertion: implemented
Worker ready atlas revision echo: present
render frame atlas revision acknowledgement: present
canonical family-closure digest: absent
main/Worker family digest parity: absent
atlas revision bound to patch request/result: absent
stale atlas-generation rejection: absent
family-complete browser-frame fixture: absent
artifact and Pages family-coverage fixtures: absent
```

The current Three.js foliage layer creates batches from the global eight-family catalog and generates placements directly from the shared recipe module. The repaired Object Vegetation descriptor is therefore most important for Nexus domain registration and future descriptor-driven consumers. It does not by itself prove that browser, Worker, patch and rendered-frame evidence all belong to one family-complete atlas generation.

## Required authority

`prehistoric-rush-foliage-family-closure-atlas-revision-convergence-authority-domain`

```txt
FoliageFamilyClosureAdmissionCommand
  -> enumerate every placement family per archetype
  -> validate descriptor closure
  -> publish FoliageFamilyClosureResult

AtlasRevisionAdmissionCommand
  -> bind family digest, atlas revision and runtime generation
  -> publish AtlasRevisionAdmissionResult

WorkerFoliageCatalogAdmissionCommand
  -> construct the same catalog in the Worker
  -> echo family and atlas digests
  -> publish WorkerFoliageCatalogResult

FoliageRealmParityCommand
  -> compare main and Worker closure evidence
  -> reject stale or mismatched results
  -> publish FoliageRealmParityResult

FoliageFrameCommitCommand
  -> bind accepted patches and renderer atlas generation
  -> publish FirstFamilyCompleteFoliageFrameAck
```

### Proposed coordinating surfaces: 20

```txt
foliage-family-reference-manifest-kit
placement-family-enumeration-kit
descriptor-family-closure-kit
missing-family-rejection-kit
foliage-descriptor-digest-kit
atlas-revision-manifest-kit
atlas-revision-propagation-kit
main-catalog-registration-result-kit
worker-catalog-registration-result-kit
worker-family-digest-echo-kit
worker-atlas-revision-echo-kit
main-worker-family-parity-settlement-kit
patch-atlas-revision-binding-kit
renderer-atlas-admission-kit
stale-atlas-result-rejection-kit
source-family-closure-fixture-kit
browser-family-coverage-fixture-kit
worker-family-coverage-fixture-kit
artifact-pages-family-coverage-fixture-kit
first-family-complete-foliage-frame-ack-kit
```

## Validation boundary

Source and commit history were inspected. A public clone attempt failed because the execution environment could not resolve `github.com`, so `npm test` and browser fixtures were not executed. This audit changed documentation only. Runtime JavaScript, tests, package scripts, gameplay, rendering, physics, workflows and deployment were not modified by this audit.

No current missing-foliage incident, browser failure, Worker divergence, patch mismatch, artifact failure, Pages failure or production readiness is claimed.