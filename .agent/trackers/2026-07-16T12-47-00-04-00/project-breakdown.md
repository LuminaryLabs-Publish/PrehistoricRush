# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-16T12-47-00-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** runtime-ahead priority  
**Reviewed pre-audit documentation head:** `4c353057e1aa58d71c917a5aa4c1b4afa4d7e886`  
**Reviewed runtime source revision:** `9c62bc402451aea7588373f760883517281b9a39`  
**Status:** `tree-impostor-view-frame-addressing-authority-audited`

## Summary

PrehistoricRush was the only runtime-ahead eligible repository. Ten post-ledger commits completed exact tree-fidelity generation identity, generation-bound patch/cache identity, Object Shape near/medium meshes, far and horizon impostors, retained four-form state, hysteresis, dither crossfade, required image decoding, decoded-texture admission, source checks, and a Pages test gate. The focused remaining gap is exact impostor view/frame addressing: far capture produces multiple azimuth and elevation frame records, while rendering selects only azimuth and infers one atlas row instead of adopting the exact frame record and rectangle.

## Intent

Keep the implemented fidelity pipeline intact while making each far or horizon billboard prove which generation-bound captured view it renders.

## What needs to happen

```txt
TreeImpostorFrameSelectionCommand
  -> bind package generation, tree, camera and frame-set revisions
  -> derive camera-to-tree azimuth and elevation
  -> resolve one exact far or horizon frame record
  -> validate frame rectangle against the decoded atlas
  -> publish TreeImpostorFrameSelectionResult

TreeImpostorFrameProjectionCommand
  -> bind accepted frame identity to one render batch
  -> apply exact texture repeat and offset
  -> preserve form hysteresis and dither crossfade
  -> reject stale generation or missing-frame work
  -> publish FirstExactImpostorFrameAck
```

## Checklist

- [x] Enumerate all 11 current `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Select only runtime-ahead PrehistoricRush.
- [x] Reconcile ten runtime commits after the previous documentation head.
- [x] Identify the complete interaction loop, domains, kits, adapters, and services.
- [x] Preserve and document 78 active named surfaces.
- [x] Define one remaining view/frame-addressing authority with 18 planned surfaces.
- [x] Add the timestamped root `.agent` audit family on `main`.
- [ ] Implement exact elevation-aware frame selection and executable visual parity fixtures.

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
package schema version 3 with exact generation IDs
Core Object + Object Shape + Core Capture + Object Fidelity composition
near and medium Object Shape geometry
far 8-azimuth × 2-elevation capture descriptors
horizon single-view capture descriptor
generation digest in vegetation patch/cache identity
retained near/medium/far/horizon form state
package hysteresis and dither-crossfade duration
runtime atlas image decoding as required startup preparation
renderer rejection of undecoded atlases
Three.js textures created from decoded runtime images
source checks required before Pages deployment
```

## Complete interaction loop

```txt
menu
  -> create tree asset runtime
  -> register packages, manifest, bundle, providers and cache
  -> background-request bundle
  -> project progress and retire capture provider

game entry
  -> launch Core Startup
  -> request the tree bundle as required preparation
  -> cache-load or build five exact-generation packages
  -> decode far and horizon atlas images
  -> mark image preparation ready
  -> retire capture provider
  -> publish runtime and import the game

game boot
  -> validate five package generation IDs
  -> compute one generation digest
  -> bind digest into vegetation settings identity
  -> create simulation, physics, patch controller and renderer
  -> reject packages without decoded far/horizon images
  -> create near/medium mesh and far/horizon billboard batches

normal frame
  -> tick simulation and patch streaming
  -> admit/release patches
  -> derive projected tree size
  -> retain near/medium/far/horizon form with hysteresis
  -> dither-crossfade form transitions
  -> for far/horizon derive camera azimuth
  -> choose a material index from azimuth count
  -> render
  -> acknowledge startup generation and form counts

remaining gap
  -> camera elevation is not used
  -> far capture elevation records are collapsed to one group
  -> exact captured frame IDs/rectangles are not selected
  -> atlas row is inferred rather than adopted from frame metadata
  -> visible receipt does not identify selected impostor frames
```

## Main source-backed finding

The capture profile requests far views at eight azimuths and two elevations. Package values retain each capture frame, including azimuth and elevation metadata. The renderer filters frames to the first elevation, creates one material per resulting count, sets texture X offset by array index, fixes texture Y offset to one inferred row, and chooses a material using camera azimuth only.

```txt
capture frame set: multi-azimuth and multi-elevation
runtime frame grouping: first elevation only
view vector input: horizontal azimuth only
camera elevation input: unused
frame identity: not retained in tree selection state
texture rectangle: inferred from columns/rows
selected frame receipt: absent
```

This is a source-backed view-resolution and atlas-addressing gap. No incorrect tree view was reproduced in a browser.

## Domains in use

```txt
browser route, module, DOM, canvas, global lifecycle and RAF
Core Assets registry, dependency graph, requests, cache, progress, receipts and values
Core Startup launch, required preparation, first-frame presentation and entry
Core Object, Object Shape, Core Capture and Object Fidelity
IndexedDB caching, image decoding and Three.js decoded-texture admission
PrehistoricRush run, route, surface, outcome, player, pause, pose and terrain IK
seeded patch generation, Worker execution, cache, activation, release and replay
Three.js terrain, four-form tree fidelity, instances, camera and creature rendering
Rapier physics, terrain LOD, camera follow, input and diagnostics
impostor view-vector resolution, capture-frame identity, atlas addressing and exact-frame proof
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

### Product, page, asset and Worker kits: 23

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
tree-fidelity-package-schema-kit: source, collision, four forms, transitions, captures and materials
tree-fidelity-asset-provider-kit: object build, capture, portable package, generation identity, progress and disposal
tree-fidelity-registration-kit: provider, packages, manifest and bundle
tree-fidelity-runtime-composition-kit: isolated Core Assets/Core Startup/Object/Shape/Capture/Fidelity composition
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement and receipt publication
tree-fidelity-runtime-image-hydration-kit: atlas discovery, browser decode, startup progress, runtimeImage binding and failure propagation
```

### External, host, capture and render adapters: 17

```txt
three-runtime-module: scene, GPU resources and render submission
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
game-runtime-lod-host-adapter: composition, generation validation, streaming, RAF, startup receipt and status
three-patch-stream-lod-adapter: terrain/tree fidelity composition, activation, release and disposal
three-terrain-lod-layer: allocation, selection, morphing and disposal
three-object-capture-provider-adapter: framing, multi-angle observations and atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache
three-tree-fidelity-layer: legacy suppression, four-form retained selection, hysteresis, dither crossfade, decoded textures, azimuth batches, counts and disposal
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
Nexus root/subdomain kits: 24
official kits: 5
product/page/asset/Worker kits: 23
external/host/capture/render adapters: 17
proof kits: 9
total active named surfaces: 78
planned view/frame-addressing surfaces: 18
```

## Required authority

`prehistoric-rush-tree-impostor-view-frame-addressing-authority-domain`

## Planned authority surfaces

```txt
prehistoric-rush-tree-impostor-view-frame-addressing-authority-domain
tree-impostor-frame-set-admission-kit
tree-impostor-frame-id-kit
tree-impostor-view-vector-kit
tree-impostor-azimuth-normalization-kit
tree-impostor-elevation-normalization-kit
tree-impostor-frame-nearest-selection-kit
tree-impostor-frame-blend-policy-kit
tree-impostor-atlas-rectangle-kit
tree-impostor-frame-batch-key-kit
tree-impostor-generation-binding-kit
tree-impostor-stale-frame-rejection-kit
tree-impostor-frame-selection-result-kit
tree-impostor-frame-diagnostics-kit
first-exact-impostor-frame-ack-kit
tree-impostor-angle-sweep-fixture-kit
tree-impostor-atlas-address-fixture-kit
tree-impostor-source-build-pages-parity-fixture-kit
```

## Validation boundary

```txt
source and commit delta inspected: yes
generation/transition/image decode inspected: yes
capture frame metadata inspected: yes
renderer frame/material selection inspected: yes
workflow and source test inspected: yes
runtime code changed by this audit: no
npm test run by this audit: no
browser angle/elevation fixture: not run
artifact or Pages smoke: not run
```

No exact multi-elevation frame selection, atlas-addressing correctness, rendered-angle parity, artifact parity, Pages parity, or production readiness is claimed.