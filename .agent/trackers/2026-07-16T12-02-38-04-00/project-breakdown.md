# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-16T12-02-38-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** runtime-ahead priority  
**Reviewed pre-audit documentation head:** `e83638abab425dc3c54370ad6c3fab17576c3d13`  
**Reviewed runtime head:** `7159a414ff4e103015ca1b634324b9fd89256cf4`  
**Status:** `tree-fidelity-asset-adoption-projection-authority-audited`

## Summary

Six runtime commits added asynchronous tree-fidelity packages, menu preloading, required game-start preparation, an async-asset-enabled Nexus Engine pin and a source contract test. The bundle prepares five archetype packages containing near, medium, far and horizon forms, but the active game runtime never consumes the prepared manifest, package payloads, atlas frames or receipt. It continues to create trees from a separate hard-coded numeric `treeTypes` array and the existing cylinder/icosahedron instanced renderer.

## Plan ledger

**Goal:** make prepared tree-fidelity packages become the accepted source of tree generation and rendering, with one revision-bound adoption result and one visible frame acknowledgement.

- [x] Enumerate all 11 current `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Detect PrehistoricRush as runtime-ahead by six commits.
- [x] Select only PrehistoricRush.
- [x] Review the six runtime commits and six changed files.
- [x] Identify the complete menu, startup, asset, patch and render interaction loop.
- [x] Identify all domains, kits, adapters and offered services.
- [x] Preserve the previous 66-surface inventory and add nine implemented asset/startup surfaces.
- [x] Define one parent adoption/projection authority and 20 coordinating surfaces.
- [x] Add the timestamped root `.agent` audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement package adoption, form selection, lifecycle settlement and executable source/build/Pages parity fixtures.

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
reason: six runtime commits followed documented head e83638ab
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Runtime changes reconciled

```txt
d573eec3 feat(trees): add async fidelity asset packages
09b3dea6 feat(menu): preload tree fidelity assets
e7611dc6 feat(startup): wait for tree fidelity bundle
1d7a6efb chore(runtime): pin async asset-enabled NexusEngine
889441a4 test(trees): cover fidelity asset contract
7159a414 test(trees): run fidelity asset contract
```

Changed files:

```txt
package.json
src/game.js
src/pages/menu.js
src/shared/runtime-versions.js
src/shared/tree-fidelity-assets.js
tests/tree-fidelity-assets.mjs
```

## Complete interaction loop

```txt
menu route
  -> load selected raptor profile
  -> create a separate Core Assets runtime
  -> install IndexedDB cache when available
  -> register tree-fidelity provider, assets and bundle
  -> background-request the bundle
  -> render progress, cached or ready status
  -> retain runtime on globalThis

game route entry
  -> import pinned Nexus Engine and Three.js
  -> create another Core Assets + Core Startup runtime
  -> launch startup
  -> register the same provider, assets and bundle
  -> track the tree bundle as a required preparation
  -> capture five tree archetypes into atlas packages when uncached
  -> store runtime and receipt on globalThis
  -> wait for preparation completion
  -> import game-runtime-lod.js

active game composition
  -> create the normal realtime game engine
  -> define a separate hard-coded treeTypes array
  -> pass treeTypes to patch generation
  -> pass treeTypes to the Three.js patch-stream adapter
  -> create cylinder trunks and icosahedron crowns as instanced meshes
  -> stream patches and update instance matrices
  -> render the legacy tree representation

missing adoption bridge
  -> game-runtime-lod.js does not read PrehistoricRushTreeAssetRuntime
  -> no manifest or package revision is admitted
  -> no near/medium/far/horizon form is selected from the prepared package
  -> no captured atlas is bound to a renderer material
  -> no TreeFidelityAdoptionResult exists
  -> no FirstTreeFidelityBoundFrameAck exists
```

## Main source-backed finding

The new asset module defines five archetypes and creates portable packages with four forms:

```txt
near: mesh recipe
medium: mesh recipe
far: multi-angle impostor atlas
horizon: single impostor atlas
transition: dither crossfade with hysteresis
```

The game entry waits for the required bundle and publishes its receipt only through `globalThis.PrehistoricRushTreeAssetRuntime`. The imported runtime then declares an independent `treeTypes` array, passes it to both the patch generator and render adapter, and never reads the prepared runtime or receipt.

The active render adapter still constructs:

```txt
trunk: InstancedMesh(CylinderGeometry)
crown: InstancedMesh(IcosahedronGeometry)
color: treeTypes[typeIndex][5]
```

Therefore preparation completion does not prove adoption or visible fidelity. The new contract test proves identifiers, five archetypes, frozen six-field type tuples and the pinned Nexus revision. It does not request a bundle, inspect package payloads, verify atlas output, bind a package to the live renderer or compare a presented frame.

This is a source-backed application and convergence gap. It does not prove that asset generation is broken, and no visual regression was reproduced.

## Domains in use

```txt
browser route, ES module, DOM, canvas, global lifecycle and requestAnimationFrame
Core Assets registry, providers, assets, bundles, requests, progress, caching and receipts
Core Startup launch, required preparation tracking and readiness
IndexedDB cache capability, database/store ownership and cached package retrieval
Three.js offscreen object capture, subject resolution, framing, multi-angle observation and atlas output
prehistoric tree archetypes, package schema, manifest, bundle and provider lifecycle
menu background preloading and game required startup preparation
PrehistoricRush run, route, surface, score, outcome, pause, player, pose and terrain IK
seeded patch generation, cache, activation, release, visible-set replay and Worker execution
Three.js renderer, scene, camera, terrain, instanced vegetation, pickups and procedural creature
Rapier bodies and colliders, terrain LOD, camera follow, browser input and diagnostics
asset preparation identity, package adoption, render-form selection, stale revision rejection, lifecycle retirement and visible-frame proof
tests, static delivery, Pages deployment, repo-local audit state and central tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 24

```txt
core-assets-kit: provider, asset and bundle registration; request scheduling; dependency resolution; progress; cache; receipts; snapshots
core-startup-kit: launch identity, preparation registration, required readiness, progress and startup result
core-input-kit: actions, axes, bindings and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, registry, snapshots and reset
core-character-kit: character registry, bindings, status, snapshots and reset
core-player-kit: player registry, possession, control and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution, events and committed frames
core-motion-kit: motion intents, requests and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral descriptors and terrain LOD policy registration
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
seeded-world-patch-controller-kit: patch identity, active/prefetch rings, cache, generation, ready delivery, activation and release
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page, asset and Worker kits: 22

```txt
prehistoric-rush-domain-kit: run, route, surface, score, accepted outcomes, semantic events, player, pose and ground IK
prehistoric-rush-pause-menu-domain-kit: pause state, commands, events and snapshot
prehistoric-rush-terrain-lod-policy-kit: LOD policy registration, query, snapshot and reset
prehistoric-rush-resolution-policy: movement, collision, pickup, goal, event and transition resolution
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
prehistoric-patch-generator: terrain fields, trees, grass, pickups and colliders
prehistoric-patch-worker: initialization, ready message, request execution, transferable success and per-request error response
tree-fidelity-package-schema-kit: archetype source bounds, collision, four render forms, transition and material descriptors
tree-fidelity-asset-provider-kit: manifest/package load, object construction, capture, progress, portable result and disposal
tree-fidelity-registration-kit: provider, five package assets, manifest dependency graph and bundle registration
tree-fidelity-runtime-composition-kit: isolated Core Assets/Core Startup engine creation and route registration
tree-fidelity-route-preparation-kit: menu background preload, game required preparation, progress projection and receipt publication
```

### External, host, capture and renderer adapters: 16

```txt
three-runtime-module: scene, resources and render submission
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, pending registry, response settlement and disposal
three-patch-stream-adapter-kit: renderer, scene, camera, terrain, content, instances, colliders, pickups and frame submission
terrain-lod-geometry-adapter: topology, indices, skirts, UVs, morph offsets and bounds
three-clay-surface-texture-adapter: deterministic normal/roughness generation, setup and disposal
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: delayed profile writes and timer replacement
browser-input-adapter: keyboard, blur, jump, boost, steer, start and restart projection
creature-camera-render-host-adapters: pose, camera, feedback and diagnostics projection
game-runtime-lod-host-adapter: module loading, engine composition, streaming, input, RAF, resize and visual status
three-patch-stream-lod-adapter: LOD/base composition, activation, suppression, release, partial disposal and frame acknowledgement
three-terrain-lod-layer: allocation, upload, selection, geomorph, material, textures, release and disposal
three-object-capture-provider-adapter: subject resolution, framing, multi-angle color/opacity capture, atlas packing and disposal
browser-indexeddb-asset-cache-adapter: persistent package lookup and write-through cache by asset identity/version
```

### Proof kits: 8

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
terrain-lod-renderer-authority-test-kit
```

Additional source contract:

```txt
tree-fidelity-assets-test: identifiers, archetype count, frozen type tuples and pinned Nexus revision
```

```txt
previous implemented surfaces: 66
new implemented asset/startup surfaces: 9
total active named surfaces: 75
planned tree-fidelity adoption surfaces: 20
```

## Required authority

`prehistoric-rush-tree-fidelity-asset-adoption-projection-authority-domain`

```txt
TreeFidelityPreparationCommand
  -> bind route, asset runtime, provider, cache, bundle and request generations
  -> request and validate the manifest and five packages
  -> verify schema, dependencies, frame counts and package digests
  -> publish TreeFidelityPreparationResult

TreeFidelityAdoptionCommand
  -> bind the accepted preparation result to one game and render generation
  -> replace duplicate hard-coded archetype/type authority
  -> bind package IDs to generated patch tree descriptors
  -> resolve near, medium, far and horizon forms from projected size
  -> allocate mesh and impostor resources from accepted packages
  -> apply crossfade and hysteresis policy
  -> reject stale, partial or mismatched package revisions
  -> publish TreeFidelityAdoptionResult

TreeFidelityProjectionCommand
  -> consume only the adopted generation
  -> render one frame containing package-bound tree instances
  -> publish FirstTreeFidelityBoundFrameAck
  -> retire route, capture renderer, cache request and GPU resources deterministically
```

## Planned authority surfaces

```txt
prehistoric-rush-tree-fidelity-asset-adoption-projection-authority-domain
tree-fidelity-preparation-command-kit
tree-fidelity-preparation-result-kit
tree-fidelity-package-validation-kit
tree-fidelity-package-digest-kit
tree-fidelity-manifest-resolution-kit
tree-archetype-single-source-kit
tree-package-patch-binding-kit
tree-render-form-selection-kit
tree-mesh-recipe-materialization-kit
tree-impostor-atlas-materialization-kit
tree-fidelity-transition-policy-kit
tree-fidelity-adoption-command-kit
tree-fidelity-adoption-result-kit
tree-fidelity-render-generation-kit
tree-fidelity-stale-revision-rejection-kit
tree-fidelity-route-retirement-kit
tree-fidelity-diagnostics-kit
first-tree-fidelity-bound-frame-ack-kit
tree-fidelity-source-build-pages-parity-fixture-kit
```

## Validation boundary

```txt
source diff inspected: yes
new asset module inspected: yes
menu preload inspected: yes
game required preparation inspected: yes
active game tree source inspected: yes
active Three.js tree allocation inspected: yes
new source contract test inspected: yes
runtime code changed by this audit: no
npm test run by this audit: no
browser capture/package fixture run: no
visible package adoption fixture run: no
build or Pages smoke run: no
```

No package adoption, atlas rendering, visible fidelity improvement, lifecycle safety, source/build parity, Pages parity or production readiness is claimed.