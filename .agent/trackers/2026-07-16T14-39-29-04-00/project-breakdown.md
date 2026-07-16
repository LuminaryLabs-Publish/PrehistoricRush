# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-16T14-39-29-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** runtime-ahead priority  
**Previous repo-local documentation head:** `36bd09e2f6abc0862dc94955bef55268d0ebf7b6`  
**Reviewed runtime source revision:** `d427de443aea28b256c92a760a8d1c6f6a396efb`  
**Status:** `tree-impostor-elevation-row-continuity-authority-audited`

## Summary

The current `LuminaryLabs-Publish` inventory contains 11 repositories. Ten remain eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`; all ten have central ledger and root `.agent` coverage. PrehistoricRush and TheOpenAbove were both ahead of their documented repo-local heads. PrehistoricRush was selected because its central audit timestamp was older.

Fourteen post-ledger commits complete the prior exact-frame plan and substantially expand tree diversity: ten authored archetypes, deterministic ecological placement, seeded per-tree variation, shared decoded atlases, exact azimuth/elevation frame addressing, adjacent-azimuth blending, UV-rectangle binding, exact-frame receipts, source fixtures, and current patch-cache identity checks are present.

The focused remaining gap is elevation-row continuity. Runtime view resolution chooses the single nearest captured elevation row and blends only between azimuth frames inside that row. Crossing an elevation midpoint can therefore replace the complete frame pair atomically without elevation hysteresis, interpolation, or a continuity result.

## Intent

Preserve exact package generations, ten-species variation, four-form fidelity, exact frame addressing, and adjacent-angle blending while making camera elevation transitions temporally continuous and generation-bound.

## What needs to happen

```txt
camera pose + tree bounds + package frame set
  -> derive azimuth and elevation
  -> resolve lower and upper elevation rows
  -> apply an elevation deadband or interpolation policy
  -> resolve adjacent azimuth frames inside each admitted row
  -> normalize up to four frame weights
  -> bind exact UV rectangles and generation identity
  -> render
  -> publish TreeImpostorViewContinuityResult
  -> publish FirstContinuousImpostorFrameAck
```

## Checklist

- [x] Enumerate all 11 current `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and ten root `.agent` states.
- [x] Identify PrehistoricRush and TheOpenAbove as runtime-ahead.
- [x] Select only PrehistoricRush by the older unmatched central timestamp.
- [x] Compare `36bd09e2..d427de44` and inspect all 14 commits and 12 changed files.
- [x] Identify the complete interaction loop, domains, kits, adapters, proofs, and offered services.
- [x] Reconcile exact frame addressing and ten-species tree variation as implemented.
- [x] Define one elevation-row continuity authority with 18 coordinating surfaces.
- [x] Add the timestamped root `.agent` audit family on `main`.
- [ ] Implement elevation-row continuity and execute browser, artifact, and Pages fixtures.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
undocumented: 0
runtime-ahead: 2

selected: LuminaryLabs-Publish/PrehistoricRush
selected prior central timestamp: 2026-07-16T12-47-00-04-00
selected pre-audit head: d427de443aea28b256c92a760a8d1c6f6a396efb

deferred priority: LuminaryLabs-Publish/TheOpenAbove
deferred prior central timestamp: 2026-07-16T13-39-49-04-00
deferred pre-audit head: ec1b42097c0db27185b256a5a0dddaab15f61153

excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Runtime delta reconciled

```txt
ten stylized prehistoric tree archetypes
species-specific silhouette, palette, height, texture and ecology metadata
seeded moisture/elevation/cluster species selection
seeded yaw, lean, scale, ground sink, hue, value and roughness variation
one stable collision proxy per visible tree
shared far/horizon atlas generation and decoding
opaque-frame crop metadata for both far forms
exact camera azimuth/elevation frame resolution
adjacent-azimuth two-frame blending
per-instance exact UV rectangle binding
per-frame binding digest and exact-frame acknowledgement
updated source fixtures and npm test chain
current NexusEngine pin and streamed-patch cache identity checks
```

## Complete interaction loop

```txt
menu
  -> create the tree asset runtime
  -> register archetypes, providers, packages, manifest, bundle, and cache
  -> background-request the bundle
  -> project progress and retire the capture provider

game entry
  -> launch Core Startup
  -> require the tree bundle
  -> cache-load or build ten exact-generation packages
  -> decode shared far/horizon atlas images
  -> admit runtime images and publish preparation receipts
  -> import the game

patch generation
  -> sample terrain and route exclusion
  -> derive moisture, elevation, cluster, and distribution scores
  -> select one of ten species deterministically
  -> derive stable per-tree yaw, lean, scale, sink, tint, and roughness metadata
  -> emit trunk, crown, collider, grass, pickup, and terrain records

game boot
  -> validate package generation IDs
  -> bind generation digest into streamed-patch cache identity
  -> create simulation, physics, patch controller, terrain, and tree-fidelity renderer
  -> reject undecoded atlases
  -> suppress legacy tree meshes
  -> create near/medium mesh and far/horizon billboard batches

normal frame
  -> tick simulation and patch streaming
  -> activate and release patches
  -> derive projected tree size
  -> retain near/medium/far/horizon form with hysteresis
  -> dither-crossfade form transitions
  -> derive camera-to-tree azimuth and elevation
  -> select the nearest capture elevation row
  -> blend adjacent azimuth frames inside that row
  -> bind exact UV rectangles
  -> render and publish exact frame-binding digest

remaining gap
  -> elevation rows switch discretely at the nearest-row midpoint
  -> no elevation bracket, blend weight, hysteresis, or continuity state exists
  -> no result distinguishes a stable row from a row transition
  -> tests do not sweep across the elevation boundary
```

## Main source-backed finding

`resolveTreeImpostorBlend()` derives the current view elevation, sorts all captured elevation values by absolute distance, and adopts only the nearest row. It then performs circular interpolation between azimuth frames in that selected row. Form selection state retains LOD transitions, but no state retains the previous capture elevation row or a transition between rows.

```txt
exact frame records: present
camera azimuth: used
camera elevation: used
exact UV rectangles: used
adjacent azimuth blending: present
frame binding digest: present
exact frame acknowledgement: present

lower/upper elevation bracket: absent
elevation interpolation: absent
elevation deadband/hysteresis: absent
prior elevation-row state: absent
row-transition result: absent
FirstContinuousImpostorFrameAck: absent
elevation-boundary rendered fixture: absent
```

This is a source-backed temporal-continuity and proof gap. No visible pop was reproduced in a browser.

## Domains in use

```txt
browser route, module, DOM, canvas, lifecycle, input, and RAF
Core Assets, Core Startup, Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, UI, Diagnostics, Composition, and Presentation
Core Object, Object Shape, Core Capture, and Object Fidelity through the tree runtime composition
NexusEngine-Kits deterministic seeds, procedural creatures, instance batches, streamed patches, and camera smoothing
IndexedDB package cache, runtime image decoding, and Three.js texture admission
PrehistoricRush run, route, surface, outcome, player, pause, pose, terrain IK, physics, and camera
seeded patch generation, Worker execution, cache identity, activation, release, and replay
ten-species ecological tree placement and per-tree variation
near/medium/far/horizon tree fidelity, form hysteresis, dither crossfade, exact frame addressing, and view continuity
Three.js terrain, tree, grass, pickup, creature, camera, and diagnostic presentation
Rapier physics and collision projection
tests, static source proof, GitHub Pages deployment, repo-local audit state, and central tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 24

```txt
core-assets-kit: providers, assets, bundles, dependencies, requests, cache, progress, receipts, values, and release
core-startup-kit: launch, required preparations, progress, first-frame presentation, input-ready entry, and descriptors
core-input-kit: actions, axes, bindings, command state, and snapshots
core-spatial-kit: transforms, hierarchy, and spatial state
core-scene-kit: scene registry, transitions, and active-scene state
core-creature-kit: creature definitions, registry, snapshots, and reset
core-character-kit: character registry, bindings, status, snapshots, and reset
core-player-kit: player registry, possession, control, and spawn generations
core-physics-kit: provider-backed bodies, colliders, stepping, contacts, and frames
articulated-dynamics-domain-kit: articulated constraints and provider integration
core-simulation-kit: proposals, observations, resolution, events, and committed frames
core-motion-kit: motion intents, requests, and committed frames
articulated-motion-domain-kit: rigs, FK, targets, IK, and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral descriptors and terrain LOD policy
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation graph and snapshots
core-presentation-output-kit: viewport, render resolution, and safe area
core-ui-scale-kit: reference resolution and scale policy
core-camera-framing-kit: framing, projection fit, damping, and clipping
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic seeds and named streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision, attachments, and descriptors
instanced-render-batch-kit: stable instance ranges, cells, flush, visibility, release, and diagnostics
seeded-world-patch-controller-kit: patch identity, rings, cache, generation, activation, release, and liveness
camera-smooth-follow-kit: damped follow, reset, bounded delta, and snapshots
```

### Product, page, asset, and Worker kits: 24

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose, and IK
prehistoric-rush-pause-menu-domain-kit: pause commands, state, events, and snapshot
prehistoric-rush-terrain-lod-policy-kit: terrain LOD policy registration and query
prehistoric-rush-resolution-policy: movement, collision, pickups, goals, and transitions
player-character-composition-kit: body, rig, creature, character, and possession
player-articulation-adapter-kit: pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: persistence, revisions, broadcasts, and subscriptions
menu-page-kit: profile projection, navigation, and asset-preload status
character-creator-page-kit: controls, draft, persistence, and preview
character-preview-transition-kit: morph, crossfade, pose, and lifecycle
three-procedural-creature-adapter-kit: creature mesh, pose, materials, and disposal
game-page-entry-kit: dependency preflight, required asset preparation, pause host, and startup receipts
player-raptor-preset-kit: authored creature content
drunk-route-generator: deterministic route generation and progress queries
prehistoric-patch-generator: terrain, ecological tree placement, seeded variation, grass, pickups, and colliders
prehistoric-patch-worker: initialization, requests, generation, and transferable results
tree-archetype-catalog-kit: ten species, silhouette recipes, palettes, textures, heights, ecology, and distribution weights
tree-fidelity-package-schema-kit: source, collision, four forms, transitions, captures, materials, and generation identity
tree-fidelity-asset-provider-kit: object build, capture, portable package, generation identity, progress, and disposal
tree-fidelity-registration-kit: provider, packages, manifest, and bundle
tree-fidelity-runtime-composition-kit: isolated Core Assets, Startup, Object, Shape, Capture, and Fidelity composition
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement, and receipt publication
tree-fidelity-runtime-image-hydration-kit: shared atlas discovery, browser decode, crop metadata, runtimeImage binding, and typed failure propagation
```

### External, host, capture, and render adapters: 17

```txt
three-runtime-module: scene, GPU resources, materials, textures, and render submission
rapier-physics-domain-kit: Core Physics provider bridge
rapier-runtime-module: Rapier runtime
message-worker-executor-adapter-kit: Worker request correlation and settlement
three-patch-stream-adapter-kit: base terrain, instances, colliders, pickups, and rendering
terrain-lod-geometry-adapter: terrain topology, indices, morph data, and skirts
three-clay-surface-texture-adapter: deterministic surface textures
creator-viewport-framing-adapter: creator camera framing
creator-persistence-scheduler: delayed profile writes
browser-input-adapter: keyboard and action projection
creature-camera-render-host-adapters: pose, camera, frame, and diagnostics projection
game-runtime-lod-host-adapter: composition, generation validation, streaming, RAF, startup receipt, and status
three-patch-stream-lod-adapter: terrain/tree fidelity composition, activation, release, and disposal
three-terrain-lod-layer: allocation, selection, morphing, stitching, and disposal
three-object-capture-provider-adapter: framing, multi-angle observations, opaque bounds, and shared atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache and identity
three-tree-fidelity-layer: legacy suppression, four-form retained selection, hysteresis, dither crossfade, exact azimuth/elevation addressing, adjacent-azimuth blending, exact UV binding, frame receipts, and disposal
```

### Proof kits: 11

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
```

```txt
Nexus Engine root/subdomain kits: 24
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 24
external/host/capture/render adapters: 17
proof kits: 11
total active named surfaces: 81
planned elevation-continuity surfaces: 18
```

## Required authority

`prehistoric-rush-tree-impostor-elevation-row-continuity-authority-domain`

## Planned authority surfaces

```txt
prehistoric-rush-tree-impostor-elevation-row-continuity-authority-domain
tree-impostor-elevation-band-index-kit
tree-impostor-elevation-bracket-resolution-kit
tree-impostor-elevation-deadband-kit
tree-impostor-view-continuity-state-kit
tree-impostor-bilinear-frame-weight-kit
tree-impostor-azimuth-elevation-binding-kit
tree-impostor-frame-weight-normalization-kit
tree-impostor-frame-capacity-budget-kit
tree-impostor-elevation-transition-stale-rejection-kit
tree-impostor-continuity-generation-binding-kit
tree-impostor-view-continuity-result-kit
tree-impostor-continuity-diagnostics-kit
first-continuous-impostor-frame-ack-kit
tree-impostor-elevation-sweep-fixture-kit
tree-impostor-terrain-jump-camera-fixture-kit
tree-impostor-far-horizon-continuity-fixture-kit
tree-impostor-source-build-pages-continuity-parity-fixture-kit
```

## Validation boundary

```txt
full organization inventory compared: yes
central ledgers and root .agent coverage checked: yes
runtime delta inspected: yes
exact frame addressing inspected: yes
ten-species catalog and variation inspected: yes
source tests inspected: yes
runtime source changed by this audit: no
npm test run by this audit: no
browser elevation sweep run: no
built-output smoke run: no
Pages smoke run: no
```

No claim is made for elevation-row interpolation, row-transition visual continuity, browser pixel parity, artifact parity, Pages parity, or production readiness.