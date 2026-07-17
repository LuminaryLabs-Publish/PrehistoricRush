# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-17T02-02-06-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** newest runtime-ahead eligible repository  
**Reviewed repository head:** `55118e0c874697b767db69575687dfa1390958f9`  
**Previous repo-local documentation head:** `946290c5af573ee14026cbde80f37c7591d8ed52`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Summary

The current `LuminaryLabs-Publish` inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. All ten have a central ledger and root `.agent` state. Two repositories were runtime-ahead: PrehistoricRush and TheOpenAbove. PrehistoricRush was selected because it had the newest undocumented runtime activity. Only PrehistoricRush was changed during this pass.

PrehistoricRush is ten commits ahead of its previous documentation head. The delta adds Nexus Engine Object Vegetation composition to the main game, patch Worker, menu/game tree-fidelity preparation, ecological species selection, deterministic instance variation, semantic tree/foliage descriptors, and domain-backed tests.

The focused gap is generation binding. Three independent vegetation runtimes are constructed for asset preparation, the game host, and the patch Worker. The asset runtime derives semantic tree fidelity profiles but the package provider still builds packages from the older local profile function. Package generations omit species, tree, foliage, and vegetation-object descriptor hashes. The Worker does not return its catalog digest during initialization. The frame receipt records catalog and package digests separately, but no result proves that each rendered species uses the package generated from the same semantic vegetation generation.

## Intent

Make one admitted semantic vegetation generation authoritative across catalog registration, fidelity package creation, cache identity, Worker generation, patch results, tree rendering, and first-frame acknowledgement.

## Plan ledger

- [x] Enumerate all 11 current Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and ten root `.agent` states.
- [x] Identify two runtime-ahead repositories.
- [x] Select only PrehistoricRush as the newest runtime-ahead repository.
- [x] Compare documentation head `946290c…` with runtime head `55118e0…`.
- [x] Review all ten commits and ten changed files.
- [x] Identify the complete interaction loop and active domains.
- [x] Document all 90 implemented kits, adapters, and proof surfaces with their services.
- [x] Define one semantic vegetation/fidelity generation authority and 22 coordinating surfaces.
- [x] Add a new timestamped root `.agent` audit family.
- [ ] Implement composite generation admission, semantic profile registration, Worker digest handshake, per-species package binding, and matching-frame proof.
- [ ] Execute source, test, browser, build, cache, Worker, and Pages fixtures.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
undocumented repositories: 0
runtime-ahead repositories: 2

selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: newest undocumented runtime activity
selected delta: 10 commits / 10 files / +490 / -165
selected runtime head: 55118e0c874697b767db69575687dfa1390958f9
previous documentation head: 946290c5af573ee14026cbde80f37c7591d8ed52
other runtime-ahead repo: LuminaryLabs-Publish/TheOpenAbove
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
menu
  -> restore saved player profile
  -> import the pinned Nexus Engine and Three.js modules
  -> create the tree-fidelity asset runtime
  -> install the five Object Vegetation kits
  -> register ten species, tree structures, foliage descriptors, and Core Object bridges
  -> derive semantic fidelity profiles
  -> request and cache the tree-fidelity bundle
  -> navigate to creator or game

character creator
  -> load the player profile and official creature/seed kits
  -> compose the procedural creature preview
  -> simulate, render, persist, and broadcast profile revisions

game asset preparation
  -> create another tree-fidelity asset runtime
  -> independently register the vegetation catalog
  -> derive semantic fidelity profiles
  -> load or build portable near/medium/far/horizon packages
  -> hydrate runtime atlas images
  -> expose package generations to the game host

game host startup
  -> import Nexus Engine, five official kits, Three.js, Rapier, and ProtoKits
  -> create a separate Object Vegetation runtime and catalog
  -> compute a host species-only catalog digest
  -> create the gameplay engine, physics provider, patch controller, camera, and renderer
  -> include host catalog digest and package generation digest in patch-cache identity

patch Worker startup
  -> import the pinned Nexus Engine independently
  -> create another Object Vegetation runtime and catalog
  -> report only the vegetation domain path as ready
  -> accept patch requests after initialization

patch generation
  -> sample terrain, route distance, elevation, slope, temperature, moisture, and cluster fields
  -> ask Core Vegetation to select a species deterministically
  -> ask Core Vegetation to create a deterministic instance descriptor
  -> map species metadata typeIndex to tree render buckets
  -> emit trunk/crown matrices, bounds, variation metadata, colliders, grass, and pickups

runtime and rendering
  -> stream and activate generated patches
  -> render tree forms from portable fidelity packages selected through typeIndex
  -> publish an exact package-generation frame acknowledgement
  -> include host vegetationCatalogDigest and treeFidelityGenerationDigest in startup receipt
  -> no composite result proves that selected species, Worker catalog, package profile, cache, and frame share one semantic generation
```

## Main source-backed finding

```txt
asset runtime
  createBaseTreeFidelityRuntime() runs first
  createCoreVegetationDomain() is installed afterward
  registerPrehistoricVegetationCatalog() registers semantic descriptors
  vegetationTree.createFidelityProfile() derives semantic profiles
  derived profiles are returned as semanticFidelityProfiles
  derived profiles are not registered into Object Fidelity

package provider
  registerAndBuildTree() still registers local treeFidelityProfile(archetype, sourceShapeId)
  package generation includes object/form/build hashes
  package generation omits vegetation species/tree/foliage/object descriptor hashes

main game runtime
  creates an independent vegetation runtime
  computes vegetationCatalogDigest from species contentHash values only
  binds that digest into patch-controller cache identity

patch Worker
  creates another independent vegetation runtime
  ready message reports vegetationDomain only
  no catalog digest or expected-generation comparison is returned

renderer/startup receipt
  binds exact frame acknowledgement to treeFidelityGenerationDigest
  records vegetationCatalogDigest separately
  does not prove per-species catalog-to-package equality
```

This is a source-backed generation-coherence gap. It does not prove a current visible defect. The three catalogs are built from the same checked-in archetype source today, so deterministic equality can mask the missing contract until species, structure, foliage, profile, package, cache, or Worker revisions diverge.

## Domains in use

```txt
browser documents, routes, import maps, module cache, DOM, input, lifecycle, RAF and storage
Nexus Engine runtime, spatial, scene, creature, character, player, physics, simulation, motion, camera, animation, graphics, UI, diagnostics, composition and presentation
Core Assets, Startup, Object, Shape, Capture and Fidelity
Core Vegetation species/instance/lifecycle, Ecology, Tree, Foliage and Vegetation Object Bridge
NexusEngine-Kits seed, procedural creature, instance batch, seeded patch and camera smoothing
PrehistoricRush run, route, surface, player, pose, terrain IK, pause, patch, tree, grass, pickup and outcome
PrehistoricRush semantic archetype, species, tree structure, foliage, object registration, ecology placement and deterministic variation
IndexedDB package cache, Worker execution, Three.js, Rapier and ProtoKit provider
source tests, static delivery, Pages, repo-local audit governance and central tracking
semantic vegetation manifest, composite generation, Worker handshake, species-package binding and first-frame acknowledgement
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 29

```txt
core-assets-kit: providers, assets, bundles, dependencies, requests, cache, progress, receipts, values and release
core-startup-kit: launches, required preparations, progress, first-frame presentation, input readiness and descriptors
core-input-kit: actions, axes, bindings, command state and snapshots
core-spatial-kit: transforms, hierarchy and spatial state
core-scene-kit: scene registry, transitions and active-scene state
core-creature-kit: creature definitions, registry, snapshots and reset
core-character-kit: character registry, bindings, status, snapshots and reset
core-player-kit: player registry, possession, control and spawn generations
core-physics-kit: provider-backed bodies, colliders, stepping, contacts and frames
articulated-dynamics-domain-kit: articulated constraints and provider integration
core-simulation-kit: proposals, observations, resolution, events and committed frames
core-motion-kit: motion intents, requests and committed frames
articulated-motion-domain-kit: rigs, FK, targets, IK and snapshots
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
core-vegetation-kit: species and instance registries, deterministic variation, lifecycle, ecology scoring/selection, snapshots and reset
vegetation-ecology-domain-kit: renderer-neutral suitability scoring and deterministic species selection
vegetation-tree-domain-kit: tree structures, shape recipes, fidelity profiles, capture requests and validation
vegetation-foliage-domain-kit: foliage descriptors, card policy, wind response, seasonal color and validation
vegetation-object-bridge-kit: species/instance conversion to Core Object descriptors and object registration
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: world seed, named deterministic streams, snapshot and replay
procedural-creature-body-kit: geometry, skeleton, skinning, collision, attachments and object descriptors
instanced-render-batch-kit: stable instance ranges, cells, flush, visibility, release and diagnostics
seeded-world-patch-controller-kit: patch identity, rings, cache, generation, activation, release and liveness
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page, asset and Worker kits: 27

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose and IK
prehistoric-rush-pause-menu-domain-kit: pause commands, state, events and snapshots
prehistoric-rush-terrain-lod-policy-kit: terrain LOD policy registration and query
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
prehistoric-patch-generator: terrain, domain-selected tree placement, deterministic instance variation, grass, pickups and colliders
prehistoric-patch-worker: Nexus Engine import, vegetation runtime initialization, requests, generation and transferable results
tree-archetype-catalog-kit: ten species, silhouettes, palettes, textures, heights, ecology and distribution weights
tree-fidelity-package-schema-kit: source, collision, four forms, transitions, captures, materials and generation identity
tree-fidelity-asset-provider-kit: object build, capture, portable package, generation identity, progress and disposal
tree-fidelity-registration-kit: provider, packages, manifest and bundle
tree-fidelity-runtime-composition-kit: isolated Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation and semantic profile derivation
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement and receipt publication
tree-fidelity-runtime-image-hydration-kit: atlas discovery, browser decode, crop metadata, runtime-image binding and typed failure propagation
prehistoric-vegetation-catalog-registration-kit: species, tree structure, foliage and Core Object registration for all archetypes
prehistoric-vegetation-runtime-composition-kit: isolated Core Object/Vegetation engine, catalog APIs, placement API and snapshots
prehistoric-vegetation-generator-options-kit: tree type, placement and species option publication for main-thread generators
```

### External, host, capture and render adapters: 17

```txt
three-runtime-module: scene, GPU resources, materials, textures and render submission
rapier-physics-domain-kit: Core Physics provider bridge
rapier-runtime-module: Rapier runtime
message-worker-executor-adapter-kit: Worker request correlation and settlement
three-patch-stream-adapter-kit: base terrain, instances, colliders, pickups and rendering
terrain-lod-geometry-adapter: terrain topology, indices, morph data and skirts
three-clay-surface-texture-adapter: deterministic surface textures
creator-viewport-framing-adapter: creator camera framing
creator-persistence-scheduler: delayed profile writes
browser-input-adapter: keyboard and action projection
creature-camera-render-host-adapters: pose, camera, frame and diagnostics projection
game-runtime-lod-host-adapter: composition, vegetation generation identity, streaming, RAF, startup receipt and status
three-patch-stream-lod-adapter: terrain/tree fidelity composition, activation, release and disposal
three-terrain-lod-layer: allocation, selection, morphing, stitching and disposal
three-object-capture-provider-adapter: framing, multi-angle observations, opaque bounds and shared atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache and identity
three-tree-fidelity-layer: legacy suppression, four-form retained selection, hysteresis, dither crossfade, exact frame addressing, UV binding, receipts and disposal
```

### Proof kits and fixtures: 12

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
terrain-lod-renderer-authority-test-kit: now supplies domain-backed placement to patch generation
 tree-fidelity-assets-test-kit
 tree-fidelity-frame-addressing-test-kit
 tree-spawn-variation-test-kit: now validates domain-backed species and variation metadata
vegetation-placement-fixture-test-adapter: offline deterministic species selection and instance variation fixture
```

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 27
external/host/capture/render adapters: 17
proof kits and fixtures: 12
total active named surfaces: 90
planned semantic-generation surfaces: 22
```

## Required authority

`prehistoric-rush-semantic-vegetation-fidelity-generation-authority-domain`

```txt
VegetationGenerationAdmissionCommand
  -> bind runtime, archetype source, species, tree, foliage, object, profile, package, cache, Worker and renderer revisions
  -> compute one VegetationGeneration and digest
  -> register the semantic tree fidelity profiles used by Object Fidelity
  -> include semantic descriptor hashes in package generation and cache identity
  -> require the Worker to return and match its catalog generation
  -> bind patch requests and results to the accepted generation
  -> map each speciesId to one matching fidelity package generation
  -> reject stale, mixed, typeIndex-only or duplicate generations
  -> publish VegetationGenerationAdmissionResult
  -> publish FirstDomainBoundAssetAck
  -> publish FirstDomainBoundPatchAck
  -> publish FirstDomainBoundTreeFrameAck
```

## Planned authority surfaces

```txt
semantic-vegetation-generation-manifest-kit
archetype-source-revision-kit
vegetation-species-hash-kit
vegetation-tree-structure-hash-kit
vegetation-foliage-hash-kit
vegetation-object-binding-hash-kit
semantic-fidelity-profile-registration-kit
fidelity-package-vegetation-binding-kit
fidelity-cache-generation-key-kit
main-thread-catalog-admission-kit
worker-catalog-handshake-kit
worker-generation-rejection-kit
patch-request-generation-binding-kit
patch-result-generation-receipt-kit
species-package-binding-table-kit
type-index-species-validation-kit
stale-vegetation-cache-retirement-kit
vegetation-generation-admission-result-kit
first-domain-bound-menu-asset-ack-kit
first-domain-bound-game-asset-ack-kit
first-domain-bound-patch-ack-kit
first-domain-bound-tree-frame-ack-kit
```

## Validation boundary

Documentation changed. Runtime JavaScript, tree packages, cache keys, Worker protocol, gameplay, rendering, dependencies, tests, workflows, and deployment were not changed by this audit. Source files and the ten-commit delta were inspected. `npm test`, browser fixtures, Worker mismatch fixtures, IndexedDB cache migration, built-output smoke, and Pages smoke were not run.

No current visual defect, semantic profile adoption, composite generation guarantee, Worker catalog equality, cache invalidation correctness, species-package convergence, artifact parity, Pages parity, or production readiness is claimed.
