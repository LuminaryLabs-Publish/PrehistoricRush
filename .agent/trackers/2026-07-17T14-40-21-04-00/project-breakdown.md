# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-17T14-40-21-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** sole runtime-ahead eligible repository  
**Reviewed pre-audit repository head:** `47788818edec7d49753f942a69ef392a8b092037`  
**Reviewed Nexus Engine revision:** `d41992636de2752f1ad9047b80701e6313f19b87`  
**Status:** `pinned-vegetation-provider-admission-browser-worker-parity-authority-audited`

## Summary

The full current `LuminaryLabs-Publish` inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. All ten have central ledgers and root `.agent` state. PrehistoricRush was the only runtime-ahead repository: commit `47788818` changed `NEXUS_COMMIT` from `c82782d0` to `d4199263`.

The new Nexus Engine revision fixes the Foliage service binding inside `createFoliageDomainKit()`. The previous revision exposed `createPlacementRecipe` through an undefined identifier; the new revision explicitly binds `createPlacementRecipe: createFoliagePlacementRecipe`. PrehistoricRush creates the Object Vegetation domain in both the main browser realm and the patch Worker, so this pin is a startup-critical runtime dependency rather than a cosmetic version change.

## Intent

Establish one provider-admission authority that proves the exact pinned Nexus Engine revision can construct Core Object Vegetation, expose the Foliage placement service, register the complete product catalog, initialize both browser realms, generate a patch, and publish matching ready/frame evidence before gameplay relies on vegetation.

## Checklist

- [x] Enumerate all 11 current Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Compare documented heads to current `main` heads.
- [x] Select only PrehistoricRush because it was one commit runtime-ahead.
- [x] Inspect the product pin change and the corresponding Nexus Engine fix.
- [x] Identify the complete interaction loop and domains.
- [x] Preserve all 97 implemented kits, adapters and proof surfaces with offered services.
- [x] Trace main-thread and Worker use of the same pinned Nexus module.
- [x] Define one provider-admission authority and 20 coordinating surfaces.
- [ ] Add executable pinned-provider fixtures.
- [ ] Prove browser, Worker, artifact and Pages parity.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
undocumented: 0
runtime-ahead: 1
selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: sole runtime-ahead eligible repository
previous documented head: 8cd649cb87fd98442116b2f3eff7496ea4c74e9c
reviewed runtime-ahead head: 47788818edec7d49753f942a69ef392a8b092037
runtime delta: src/shared/runtime-versions.js
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
browser startup
  -> import RUNTIME_URLS.nexus pinned to d4199263
  -> preflight selected public exports
  -> createPrehistoricVegetationRuntime(NexusEngine)
  -> create Core Object domain with Vegetation, Ecology, Tree, Foliage and Object Bridge
  -> register 12 tree species, tree structures, foliage descriptors and object descriptors
  -> register 6 ground-cover species, foliage descriptors and object descriptors
  -> create product generator options and synchronous patch generator

Worker startup
  -> import the same RUNTIME_URLS.nexus
  -> create the same product Vegetation runtime and catalog
  -> publish patch-worker-ready with catalog counts and atlas revision
  -> accept generate-patch requests and transfer patch results

runtime play
  -> main-thread generator or Worker executor produces streamed patches
  -> patch controller admits and activates ready patches
  -> Three.js vegetation, foliage and ground-cover layers render accepted instances
  -> collisions, pickups, score, camera and gameplay continue
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
prehistoric-foliage-card-recipe-kit: atlas revision, eight families, archetype mapping, placements and six ground-cover archetypes
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
planned provider-admission surfaces: 20
```

## Source-backed finding

```txt
product pin update to d4199263: present
Nexus fix binds createPlacementRecipe to createFoliagePlacementRecipe: present
main browser imports RUNTIME_URLS.nexus: present
Worker imports the same RUNTIME_URLS.nexus: present
both realms create Prehistoric Vegetation runtime: present
main preflight verifies exact provider revision: absent
main preflight constructs Foliage service before startup admission: absent
Worker echoes provider revision: absent
host waits for validated worker-ready settlement: absent
realm parity result: absent
source test imports the live pinned Nexus provider: absent
browser provider fixture: absent
artifact and Pages provider fixture: absent
```

The current product-module test verifies local exports and catalog cardinality but never imports the pinned Nexus Engine URL or executes `createPrehistoricVegetationRuntime()` with that provider. The production browser path does execute it. The Worker independently imports and constructs the same domain, but its ready message reports catalog counts and atlas revision rather than the provider revision or a binding digest.

## Required authority

`prehistoric-rush-pinned-vegetation-provider-admission-browser-worker-parity-authority-domain`

```txt
ProviderRevisionAdmissionCommand
  -> bind expected Nexus revision, URL, product revision and realm
  -> import provider and verify exact identity
  -> publish ProviderRevisionAdmissionResult

VegetationProviderProbeCommand
  -> construct Core Object Vegetation
  -> validate Foliage createPlacementRecipe service
  -> register the complete product catalog
  -> publish VegetationProviderProbeResult

WorkerProviderAdmissionCommand
  -> repeat the same probe in the Worker realm
  -> echo provider revision, catalog digest and foliage binding digest
  -> publish WorkerProviderAdmissionResult

ProviderRealmParityCommand
  -> compare main and Worker provider/catalog evidence
  -> reject stale or mismatched generations
  -> publish ProviderRealmParityResult

VegetationStartupCommitCommand
  -> admit streaming only after parity settles
  -> generate and activate one matching patch
  -> publish FirstVegetationRuntimeReadyAck
  -> publish FirstWorkerPatchAck
  -> publish FirstProviderBoundVegetationFrameAck
```

## Planned authority surfaces: 20

```txt
provider-revision-manifest-kit
provider-url-admission-kit
provider-module-identity-kit
core-object-domain-construction-probe-kit
foliage-service-binding-probe-kit
vegetation-catalog-registration-probe-kit
catalog-digest-kit
main-realm-provider-ready-result-kit
worker-realm-provider-ready-result-kit
worker-provider-revision-echo-kit
provider-realm-parity-settlement-kit
stale-provider-result-rejection-kit
startup-failure-classification-kit
provider-fallback-policy-kit
source-provider-import-fixture-kit
browser-main-provider-fixture-kit
browser-worker-provider-fixture-kit
artifact-pages-provider-fixture-kit
first-vegetation-runtime-ready-ack-kit
first-provider-bound-vegetation-frame-ack-kit
```

## Validation boundary

Documentation changed. Runtime JavaScript, provider pins, gameplay, Worker behavior, rendering, tests, package scripts, workflows and deployment were not changed by this audit. Source was inspected. `npm test`, live provider import, browser main-thread construction, Worker parity, artifact and Pages fixtures were not run.

No deployed failure, browser success, Worker parity, artifact parity, Pages parity or production readiness is claimed.