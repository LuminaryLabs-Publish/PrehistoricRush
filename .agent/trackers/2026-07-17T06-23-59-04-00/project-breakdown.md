# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-17T06-23-59-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** runtime-ahead eligible repository  
**Reviewed repository head:** `66addd638608d3815822eed282a8f507a567def4`  
**Reviewed runtime source head:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`  
**Previous central repo-local documentation head:** `dafa3f08261ffac5767c4d75f404a7d477db2466`  
**Status:** `render-host-generation-retirement-authority-audited`

## Summary

The current `LuminaryLabs-Publish` inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. All ten remain represented by central ledger records and root `.agent` state. PrehistoricRush was selected because its current `main` head is 30 commits ahead of the repo-local documentation head recorded by the central ledger.

The runtime delta completes the previously proposed jungle adoption path: semantic foliage and ground-cover registration, deterministic main-thread and Worker patch generation, card-backed tree fidelity packages, a procedural foliage atlas, lush tree-card and ground-cover render layers, atmosphere composition, diagnostics, source fixtures, and a generation-bound visible-frame acknowledgement.

The focused remaining gap is parent render-host retirement. Child LOD and jungle layers dispose, but the base Three.js adapter has no disposal service. Renderer, canvas, base geometries and materials, player resources, base lights, atmosphere mutations, active callbacks, and parent generation settlement remain outside one authoritative retirement result.

## Intent

Make one render-host generation own every base and jungle-specific browser, patch, scene, GPU, atmosphere, callback, and visible-frame resource, then retire that generation exactly once before replacement or recovery.

## Checklist

- [x] Enumerate all 11 current Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Select only PrehistoricRush through runtime-ahead priority.
- [x] Compare central repo-local head `dafa3f0…` with current head `66addd6…`.
- [x] Review the 30-commit, 25-file delta and the final runtime source head.
- [x] Identify the complete interaction loop and active domains.
- [x] Document all 96 implemented kits, adapters, and proof surfaces with services.
- [x] Define one render-host retirement authority and 19 coordinating surfaces.
- [x] Add a new timestamped root `.agent` audit family.
- [ ] Implement complete parent host and atmosphere retirement.
- [ ] Prove repeated construction, restart, remount, WebGL recovery, artifact, and Pages behavior.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
undocumented repositories: 0
selected delta from central repo-local head: 30 commits / 25 files
selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: runtime and repo-local audit state ahead of the central ledger
reviewed repository head: 66addd638608d3815822eed282a8f507a567def4
reviewed runtime source head: 4b2e1842dc6f8e47fe537260e4282518e09537e2
previous central repo-local documentation head: dafa3f08261ffac5767c4d75f404a7d477db2466
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
browser route and host startup
  -> load pinned Nexus Engine, Kits, Three.js and Rapier modules
  -> load player profile and prepared tree-fidelity packages
  -> compose Core runtime, Physics, Simulation, Graphics, Vegetation and product kits
  -> register ten card-backed tree species and six ground-cover species
  -> create deterministic route, patch controller, Worker executor and camera follow
  -> main-thread and Worker generation emit terrain, trees, ecological ground cover,
     grass, pickups and colliders under one catalog/atlas generation
  -> patch activation binds physics, terrain LOD, tree fidelity, lush foliage,
     ground cover, legacy layers and pickup state
  -> Three.js creates the foliage atlas, card batches, ground-cover batches,
     jungle atmosphere, player and camera projection
  -> RAF applies input, ticks engine truth, settles pickups/collision/progress,
     streams patches, updates LOD layers and renders one frame
  -> startup checks tree generation and foliage-atlas revision
  -> host publishes lushVegetationFrameAck and first-frame startup receipt
  -> gameplay continues through jump, route progress, fail, win and restart

retirement today
  -> LOD adapter disposes terrain LOD, tree fidelity, lush foliage,
     ground cover and foliage atlas
  -> base renderer, canvas, legacy/base resources, atmosphere state,
     active memberships and stale callbacks have no parent retirement result
```

## Domains in use

```txt
browser document, route, import map, ES module cache, DOM, keyboard, pointer,
lifecycle, RAF, storage, IndexedDB, Worker and CDN delivery

Nexus Engine runtime, scene, spatial, creature, character, player, physics,
simulation, motion, camera, animation, graphics, UI, diagnostics,
composition and presentation

Core Assets, Startup, Input, Object, Shape, Capture, Fidelity, Vegetation,
Ecology, Tree, Foliage and Vegetation Object Bridge

NexusEngine-Kits seed, procedural creature, instance batch,
seeded world-patch control and camera smoothing

PrehistoricRush run, route, surface, resolution, player, pose, terrain IK,
pause, patch, tree, grass, foliage cards, ground cover, pickup and outcome

semantic archetype, species, ecology, variation, collision, package, cache,
Worker, patch, atlas, render-host generation and visible-frame proof

Three.js scene, camera, fog, lights, shadows, tone mapping, materials,
textures, instancing, renderer, WebGL context, canvas and render submission

Rapier, source tests, static delivery, GitHub Pages, repo-local audit governance
and central tracking
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
vegetation-foliage-domain-kit: foliage descriptors, card policy, wind response, seasonal color, validation
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
prehistoric-patch-generator: terrain, ecology selection, variation, matrices, scaled collision, grass, ground cover, pickups
prehistoric-patch-worker: engine import, catalog initialization, requests, generation, transferable results
tree-archetype-catalog-kit: ten species, silhouettes, palettes, textures, heights, ecology, weights
tree-fidelity-package-schema-kit: source, collision, four forms, transitions, captures, materials, generation identity
tree-fidelity-asset-provider-kit: object build, capture, package, generation, progress, disposal
tree-fidelity-registration-kit: provider, packages, manifest, bundle
tree-fidelity-runtime-composition-kit: Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation, semantic profiles
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement, receipts
tree-fidelity-runtime-image-hydration-kit: atlas discovery, decode, crop metadata, image binding, typed failures
prehistoric-vegetation-catalog-registration-kit: tree/foliage/ground-cover/object registration and atlas identity
prehistoric-vegetation-runtime-composition-kit: isolated engine, catalog APIs, placement API, snapshots
prehistoric-vegetation-generator-options-kit: tree type, placement, species and atlas option publication
prehistoric-foliage-card-recipe-kit: atlas revision/dimensions, eight families, archetype mapping, deterministic placements, six ground-cover archetypes
```

### External, host, capture and render adapters: 21

```txt
three-runtime-module: scene, GPU resources, materials, textures, renderer and render submission
rapier-physics-domain-kit: Core Physics provider bridge
rapier-runtime-module: Rapier runtime
message-worker-executor-adapter-kit: Worker request correlation and settlement
three-patch-stream-adapter-kit: base terrain, legacy vegetation, grass, shards, player, patch activation and rendering
terrain-lod-geometry-adapter: topology, indices, morph data, skirts
three-clay-surface-texture-adapter: deterministic surface textures
creator-viewport-framing-adapter: creator camera framing
creator-persistence-scheduler: delayed profile writes
browser-input-adapter: keyboard and action projection
creature-camera-render-host-adapters: pose, camera, frame and diagnostics projection
game-runtime-lod-host-adapter: module preflight, runtime composition, generation identity, streaming, RAF, startup receipt, status
three-patch-stream-lod-adapter: terrain/tree/jungle composition, activation, release, frame acknowledgement and child disposal
three-terrain-lod-layer: allocation, selection, morphing, stitching and disposal
three-object-capture-provider-adapter: framing, multi-angle observations, bounds and atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache and identity
three-tree-fidelity-layer: four-form selection, hysteresis, crossfade, exact frame addressing, UV binding, receipts, disposal
lush-jungle-atmosphere-render-adapter: background, fog, exposure, light/shadow tuning, fill/canopy lights and resource references
prehistoric-foliage-atlas-render-kit: procedural 4x2 atlas, family texture views, revision identity and disposal
three-lush-foliage-layer: projected-size LOD, hysteresis, stable admission, crossfade, wind/tint, family batches, patch ownership, disposal
three-ground-cover-layer: ecological instances, species batches, wind/tint, capacity diagnostics, patch release and disposal
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
vegetation-product-and-foliage-module-test-kit: imports, catalogs, clone safety, placement and foliage-card pipeline
```

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 28
external/host/capture/render adapters: 21
proof kits and fixtures: 13
total active named surfaces: 96
planned render-host-retirement surfaces: 19
```

## Main source-backed finding

```txt
implemented
  semantic foliage and ground-cover catalogs
  deterministic main-thread and Worker generation
  card-backed tree fidelity packages
  procedural foliage atlas
  lush foliage and ground-cover layers
  atmosphere composition
  child-layer patch release and disposal
  lushVegetationFrameAck and startup atlas-revision admission
  source syntax/import/placement/foliage fixtures declared in package scripts

unsettled
  base adapter dispose service
  frame-admission retirement latch
  active patch and instance-batch settlement before disposal
  renderer/context disposal
  renderer canvas detachment
  base terrain, legacy tree, grass, shard and player resource disposal
  base light and target removal
  atmosphere-owned light removal and predecessor state restoration
  stale RAF/render/Worker result rejection
  RenderHostRetirementResult
  FirstRetiredRenderHostAck
```

The base adapter creates the renderer, appends its canvas, allocates base terrain, legacy trees, grass, shards, player resources and lights, but its public service object has no `dispose()`. The LOD adapter disposes only its five child systems. The host starts a perpetual RAF and registers window listeners without a route or generation retirement command.

This is a source-backed lifecycle and ownership gap. No leak, duplicate canvas, duplicate light, stale frame, context-recovery failure, or production incident was reproduced.

## Required authority

`prehistoric-rush-render-host-generation-retirement-authority-domain`

```txt
RenderHostGenerationAdmissionCommand
  -> bind route, runtime, engine, patch controller, Worker, renderer,
     canvas, scene, atmosphere, viewport and callback revisions
  -> publish RenderHostGenerationAdmissionResult

RenderHostRetirementCommand
  -> close frame and patch admission
  -> cancel or reject stale RAF and Worker results
  -> release active patch memberships and instance-batch cells
  -> dispose base and child scene/GPU resources
  -> restore or retire predecessor atmosphere/scene state
  -> dispose renderer/context and detach canvas
  -> terminate Worker and remove browser listeners
  -> apply exactly once
  -> publish RenderHostRetirementResult
  -> publish FirstRetiredRenderHostAck

RenderHostReplacementCommand
  -> require successful predecessor settlement or explicit forced retirement
  -> admit one fresh generation
  -> publish FirstReplacementRenderHostFrameAck
```

## Planned authority surfaces: 19

```txt
render-host-generation-kit
render-frame-admission-latch-kit
patch-membership-retirement-kit
worker-generation-retirement-kit
browser-listener-retirement-kit
base-terrain-resource-retirement-kit
legacy-tree-resource-retirement-kit
grass-resource-retirement-kit
pickup-shard-resource-retirement-kit
player-render-resource-retirement-kit
terrain-lod-retirement-kit
tree-fidelity-retirement-kit
lush-foliage-retirement-kit
ground-cover-retirement-kit
foliage-atlas-retirement-kit
jungle-atmosphere-state-restoration-kit
renderer-context-and-canvas-retirement-kit
render-host-retirement-result-kit
first-retired-render-host-ack-kit
```

## Validation boundary

Source inspection and commit comparison were performed. `package.json` now declares syntax and source fixtures covering the jungle modules, but those commands were not executed by this documentation run. Browser construction/retirement, WebGL recovery, built-output smoke and Pages smoke were not executed. Runtime JavaScript, gameplay, rendering, physics, tests, workflows and deployment were not changed by this audit.