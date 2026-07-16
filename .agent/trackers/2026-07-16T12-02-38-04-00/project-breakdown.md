# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-16T12-02-38-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** runtime-ahead priority  
**Reviewed pre-audit documentation head:** `e83638abab425dc3c54370ad6c3fab17576c3d13`  
**Reviewed runtime source revision:** `e2ad9fa17f1d05c488ee640a4e5738bbbdd8ca53`  
**Status:** `tree-fidelity-generation-form-transition-authority-audited`

## Summary

PrehistoricRush was the only runtime-ahead eligible repository. Thirteen runtime commits added Core Assets/Core Startup tree packages, cache-backed preparation, live package consumption, near/medium/far rendering, startup frame acknowledgement, provider retirement and source contract checks. The focused remaining gap is exact generation and form-transition authority: patch/cache identity uses only package count, horizon is never selected, package hysteresis and dither crossfade are unused, and the first-frame receipt does not identify the exact bundle, manifest or package revisions.

## Plan ledger

**Goal:** preserve the implemented tree-fidelity pipeline while making package generation, form selection, transitions and visible proof exact and revision-bound.

- [x] Enumerate all 11 current `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Select only runtime-ahead PrehistoricRush.
- [x] Reconcile thirteen runtime commits and nine changed runtime files.
- [x] Identify the complete interaction loop, domains, kits and services.
- [x] Preserve the prior 66 surfaces and document eleven new asset/startup/render/proof surfaces.
- [x] Define one remaining generation/form-transition authority and 20 coordinating surfaces.
- [x] Add the timestamped root `.agent` audit family on `main`.
- [ ] Implement exact package identity, horizon selection, transition state and executable parity fixtures.

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
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Runtime implementation reconciled

```txt
Core Assets and optional Core Startup runtime
five canonical tree archetypes and derived compatibility tuples
five portable package assets plus manifest and bundle
near and medium mesh recipes
far multi-angle and horizon impostor descriptors
Three.js color/opacity object capture
IndexedDB package cache
menu background preload
game required preparation
provider retirement after preparation
live package lookup and renderer admission
near/medium/far dynamic tree-fidelity layer
legacy tree suppression
startup first-frame acknowledgement
source contract coverage
```

## Complete interaction loop

```txt
menu
  -> create asset runtime
  -> register provider, five packages, manifest and bundle
  -> background-request the bundle
  -> warm IndexedDB cache when available
  -> project progress/result
  -> unregister the capture provider

game entry
  -> create asset + startup runtime
  -> launch startup
  -> request the tree bundle as required preparation
  -> load cached packages or capture them
  -> unregister the capture provider
  -> retain package values and startup state
  -> import the main game runtime

game boot
  -> derive treeTypes from canonical archetypes
  -> read five prepared package values
  -> include tree-fidelity package count in vegetation identity
  -> create realtime game, physics, patch controller and renderer
  -> create the tree-fidelity layer when package values exist
  -> suppress legacy tree meshes

normal frame
  -> simulation and patch streaming advance
  -> active patches enter the fidelity layer
  -> projected tree height selects near, medium or far
  -> matching dynamic mesh or billboard instances update
  -> scene renders
  -> first rendered frame reports package count and visible tree count to Core Startup
  -> UI reports near/medium/far counts

remaining gap
  -> exact package versions/digests are not in patch or cache identity
  -> far minimum threshold is not enforced
  -> horizon form is never selected
  -> package hysteresis and dither-crossfade are not applied
  -> startup acknowledgement cannot prove the exact package generation
```

## Main source-backed finding

The current runtime now consumes prepared package values and creates a dedicated `three-tree-fidelity-layer`. This closes the earlier preparation-to-render adoption gap. The remaining contract is weaker than the package schema:

```txt
vegetation cache identity: package count only
patch tree identity: type index, no package digest
render states: near / medium / far only
horizon package form: declared but unused
far minimumProjectedSize: read but not used in classification
change.hysteresis: declared but unused
change.mode dither-crossfade: declared but unused
transition duration: declared but unused
startup receipt: package count + tree count only
functional browser/render parity fixture: absent
```

Per-frame threshold selection has no retained form state. A tree near a threshold can switch forms repeatedly as projected size changes, and all trees below the medium threshold are assigned to far regardless of the package far/horizon ranges. This is a source-backed identity and presentation-coherence gap, not a reproduced visual defect.

## Domains in use

```txt
browser route, modules, DOM, canvas, global lifecycle and RAF
Core Assets registry, providers, dependency graph, requests, progress, cache and receipts
Core Startup launch, required preparation, first-frame presentation and input-ready entry
IndexedDB cache and Three.js object capture
prehistoric tree archetypes, package schema, manifest, bundle and provider lifecycle
menu preload and game startup preparation
PrehistoricRush run, route, surface, outcome, player, pause, pose and terrain IK
seeded patch generation, Worker execution, cache, activation, release and replay
Three.js terrain, tree-fidelity mesh/impostor rendering, camera, instances and creature
Rapier physics, terrain LOD, camera follow, input and diagnostics
tree generation identity, package-to-patch binding, form state, horizon, hysteresis, crossfade and exact-frame proof
tests, Pages deployment, repo-local audit state and central tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 24

```txt
core-assets-kit: providers, assets, bundles, dependencies, requests, cache, progress, receipts and values
core-startup-kit: launch, required preparations, progress, first-frame presentation, input-ready entry and descriptors
core-input-kit: actions, axes, bindings and snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, registry, snapshots and reset
core-character-kit: character registry, bindings, status, snapshots and reset
core-player-kit: player registry, possession, control and spawn generations
core-physics-kit: provider-backed bodies, colliders, stepping and frames
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
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic seeds and named streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision and descriptors
instanced-render-batch-kit: stable instance ranges, cells, flush and diagnostics
seeded-world-patch-controller-kit: patch identity, rings, cache, generation, activation and release
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page, asset and Worker kits: 22

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose and IK
prehistoric-rush-pause-menu-domain-kit: pause commands, state, events and snapshot
prehistoric-rush-terrain-lod-policy-kit: LOD policy registration and query
prehistoric-rush-resolution-policy: movement, collision, pickups, goals and transitions
player-character-composition-kit: body, rig, creature, character and possession
player-articulation-adapter-kit: pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: persistence, revisions, broadcasts and subscriptions
menu-page-kit: profile projection, navigation and asset-preload status
character-creator-page-kit: controls, draft, persistence and preview
character-preview-transition-kit: morph, crossfade, pose and lifecycle
three-procedural-creature-adapter-kit: creature mesh, pose and disposal
game-page-entry-kit: dependency preflight, required asset preparation and pause host
player-raptor-preset-kit: authored creature content
drunk-route-generator: deterministic route and progress queries
prehistoric-patch-generator: terrain, trees, grass, pickups and colliders
prehistoric-patch-worker: initialization, requests and transferable results
tree-fidelity-package-schema-kit: source, collision, four forms, transitions and materials
tree-fidelity-asset-provider-kit: object build, capture, portable package, progress and disposal
tree-fidelity-registration-kit: provider, packages, manifest and bundle
tree-fidelity-runtime-composition-kit: isolated Core Assets/Core Startup composition
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement and receipt publication
```

### External, host, capture and render adapters: 17

```txt
three-runtime-module: scene, resources and render submission
rapier-physics-domain-kit: Core Physics provider bridge
rapier-runtime-module: Rapier runtime
message-worker-executor-adapter-kit: request correlation and settlement
three-patch-stream-adapter-kit: base terrain, instances, colliders, pickups and rendering
terrain-lod-geometry-adapter: terrain topology and morph data
three-clay-surface-texture-adapter: deterministic surface textures
creator-viewport-framing-adapter: creator camera framing
creator-persistence-scheduler: delayed profile writes
browser-input-adapter: keyboard and action projection
creature-camera-render-host-adapters: pose, camera and diagnostics
game-runtime-lod-host-adapter: composition, streaming, RAF, startup receipt and status
three-patch-stream-lod-adapter: terrain/tree fidelity composition, activation, release and disposal
three-terrain-lod-layer: allocation, selection, morphing and disposal
three-object-capture-provider-adapter: framing, multi-angle observations and atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache
three-tree-fidelity-layer: legacy suppression, near/medium mesh instances, far billboards, form counts and disposal
```

### Proof kits: 9

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
```

```txt
previous implemented surfaces: 66
new asset/startup/render/proof surfaces: 11
total active named surfaces: 77
planned generation/form-transition surfaces: 20
```

## Required authority

`prehistoric-rush-tree-fidelity-generation-form-transition-authority-domain`

```txt
TreeFidelityGenerationAdmissionCommand
  -> bind bundle, manifest, package, provider, cache, game, patch and renderer revisions
  -> compute and validate exact package digests
  -> include the generation digest in patch and vegetation-cache identity
  -> reject stale or mixed package generations
  -> publish TreeFidelityGenerationResult

TreeFidelityFormProjectionCommand
  -> retain per-tree accepted form state
  -> apply near, medium, far and horizon ranges
  -> apply package hysteresis
  -> execute bounded dither-crossfade transitions
  -> publish TreeFidelityProjectionResult
  -> acknowledge the first frame containing the exact generation and form snapshot
```

## Planned authority surfaces

```txt
prehistoric-rush-tree-fidelity-generation-form-transition-authority-domain
tree-fidelity-generation-id-kit
tree-fidelity-bundle-revision-kit
tree-fidelity-package-digest-kit
tree-fidelity-generation-admission-kit
tree-fidelity-generation-result-kit
tree-fidelity-cache-identity-kit
tree-fidelity-patch-binding-kit
tree-fidelity-stale-generation-rejection-kit
tree-fidelity-form-state-kit
tree-fidelity-projected-range-kit
tree-fidelity-horizon-form-kit
tree-fidelity-hysteresis-kit
tree-fidelity-dither-crossfade-kit
tree-fidelity-transition-budget-kit
tree-fidelity-startup-receipt-kit
tree-fidelity-diagnostics-kit
first-exact-tree-fidelity-frame-ack-kit
tree-fidelity-functional-render-fixture-kit
tree-fidelity-source-build-pages-parity-fixture-kit
```

## Validation boundary

```txt
source and commit delta inspected: yes
live package consumption inspected: yes
dynamic fidelity renderer inspected: yes
provider retirement inspected: yes
source contract test inspected: yes
runtime code changed by this audit: no
npm test run by this audit: no
browser form/transition fixture: not run
artifact or Pages smoke: not run
```

No exact generation identity, horizon rendering, hysteresis, crossfade correctness, functional render proof, artifact parity, Pages parity or production readiness is claimed.