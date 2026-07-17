# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-16T20-01-41-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** oldest synchronized eligible repository  
**Reviewed repository head:** `94fec638a76d6c39034fe993396edf12e95638fb`  
**Status:** `runtime-module-generation-identity-authority-audited`

## Summary

The current `LuminaryLabs-Publish` inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. All ten have central ledger records, root `.agent` state, and current heads matching the documented repo-local heads. No eligible repository was new, ledger-missing, root-agent-missing, undocumented, or runtime-ahead. PrehistoricRush had the oldest synchronized central timestamp and was the only selected project.

The focused finding is a three-generation Nexus Engine module graph. Shared dynamic imports use commit `80146b8…`; `game.html` maps bare `nexusengine` imports to `06375f2…`; `charactercreator.html` maps them to `cf2fe3d…`. Official NexusEngine-Kits import the bare specifier, while the host engine is created from the shared dynamic import. The runtime therefore lacks proof that kit descriptors, object primitives, engine APIs, providers, and rendered frames belong to one generation.

## Goal

Make one canonical runtime manifest and one admitted `RuntimeModuleGeneration` authoritative for every route, official kit, engine composition, asset runtime, Worker, provider, simulation, and visible frame.

## Plan ledger

- [x] Enumerate all 11 current Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Verify ten eligible central ledgers and ten current repo-local heads.
- [x] Confirm zero new, missing-ledger, missing-agent, undocumented, or runtime-ahead repositories.
- [x] Select only PrehistoricRush through the oldest synchronized timestamp.
- [x] Identify the complete interaction loop.
- [x] Identify every active domain.
- [x] Preserve all 81 implemented kits, adapters, and proof surfaces with their offered services.
- [x] Inspect route import maps, shared runtime URLs, game/creator entries, product composition, and official kit source.
- [x] Define one parent runtime-module identity authority and 20 coordinating surfaces.
- [x] Add the timestamped `.agent` audit family on `main`.
- [ ] Implement one generated manifest, admission result, mixed-generation rejection, and matching-frame receipts.
- [ ] Execute source, browser, build, and Pages module-graph fixtures.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
undocumented: 0
runtime-ahead: 0

selected: LuminaryLabs-Publish/PrehistoricRush
selected prior timestamp: 2026-07-16T14-39-29-04-00
next oldest: LuminaryLabs-Publish/TheOpenAbove
next timestamp: 2026-07-16T14-59-39-04-00
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
menu
  -> restore saved player profile
  -> dynamically import shared Nexus Engine 80146b8… and Three.js
  -> create tree asset runtime
  -> request and cache the tree fidelity bundle
  -> retire capture provider after preparation
  -> navigate to creator or game

character creator
  -> document import map binds bare nexusengine to cf2fe3d…
  -> dynamically import shared Nexus Engine 80146b8…
  -> dynamically import official seed and creature kits
  -> those kit modules resolve bare nexusengine through cf2fe3d…
  -> create host engine from 80146b8…
  -> compose core creature/character/motion/camera plus official kits
  -> create object descriptors, preview mesh, camera framing and Three.js frame
  -> persist profile changes and broadcast revisions

game entry
  -> document import map binds bare nexusengine to 06375f2…
  -> preflight shared Nexus Engine 80146b8…, five official kits, Three.js, Rapier and ProtoKit
  -> prepare exact tree packages and runtime atlas images
  -> expose preparation runtime to the game host

game runtime
  -> dynamically import the same shared host runtime and external modules
  -> official kit modules remain linked to the route import-map runtime
  -> create the host engine from 80146b8…
  -> install core domains, official kits and product domains
  -> configure Rapier, player, patch controller, Worker, terrain, trees, grass, pickups and camera
  -> fixed-step simulation and streaming advance
  -> Three.js renders terrain, creature, tree fidelity, grass, pickups, UI and diagnostics
  -> no typed result proves a single runtime generation
```

## Main source-backed finding

```txt
src/shared/runtime-versions.js
  Nexus Engine = 80146b8947e0877e26b851563bd17f5cdfcbf38a

game.html import map
  nexusengine = 06375f213b9fcd96257c0cf6980d65ec7ca2f3d3

charactercreator.html import map
  nexusengine = cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1

NexusEngine-Kits seed-kit
  imports defineDomainServiceKit, seeded random and scoped seed from bare nexusengine

NexusEngine-Kits procedural-creature-body-kit
  imports createObjectDescriptor from bare nexusengine

product composition
  creates the host engine from the shared 80146b8… namespace
  calls official kit factories without a mandatory accepted runtime-generation result
```

This is a source-proven module-identity gap. It does not prove a current visible browser defect; descriptor compatibility can hide the split until runtime contracts diverge.

## Domains in use

```txt
browser document, route, import map, ES module cache, DOM, input, lifecycle, RAF and storage
Nexus Engine runtime, spatial, scene, creature, character, player, physics, simulation, motion, camera, animation, graphics, UI, diagnostics, composition and presentation
Core Assets, Startup, Object, Shape, Capture and Fidelity
NexusEngine-Kits seed, procedural creature, instance batch, streamed patch and camera smoothing
PrehistoricRush run, route, surface, player, pose, terrain IK, pause, patch, tree, grass, pickup and outcome
IndexedDB package cache, Worker execution, Three.js, Rapier and ProtoKit provider
source tests, static delivery, Pages, repo-local audit governance and central tracking
runtime manifest, module generation, namespace provenance, route parity and first-frame acknowledgement
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 24

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
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: world seed, named deterministic streams, snapshot and replay
procedural-creature-body-kit: geometry, skeleton, skinning, collision, attachments and object descriptors
instanced-render-batch-kit: stable instance ranges, cells, flush, visibility, release and diagnostics
seeded-world-patch-controller-kit: patch identity, rings, cache, generation, activation, release and liveness
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page, asset and Worker kits: 24

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
prehistoric-patch-generator: terrain, ecological tree placement, seeded variation, grass, pickups and colliders
prehistoric-patch-worker: initialization, requests, generation and transferable results
tree-archetype-catalog-kit: ten species, silhouettes, palettes, textures, heights, ecology and distribution weights
tree-fidelity-package-schema-kit: source, collision, four forms, transitions, captures, materials and generation identity
tree-fidelity-asset-provider-kit: object build, capture, portable package, generation identity, progress and disposal
tree-fidelity-registration-kit: provider, packages, manifest and bundle
tree-fidelity-runtime-composition-kit: isolated Assets, Startup, Object, Shape, Capture and Fidelity composition
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement and receipt publication
tree-fidelity-runtime-image-hydration-kit: atlas discovery, browser decode, crop metadata, runtime-image binding and typed failure propagation
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
game-runtime-lod-host-adapter: composition, generation validation, streaming, RAF, startup receipt and status
three-patch-stream-lod-adapter: terrain/tree fidelity composition, activation, release and disposal
three-terrain-lod-layer: allocation, selection, morphing, stitching and disposal
three-object-capture-provider-adapter: framing, multi-angle observations, opaque bounds and shared atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache and identity
three-tree-fidelity-layer: legacy suppression, four-form retained selection, hysteresis, dither crossfade, exact frame addressing, UV binding, receipts and disposal
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
planned runtime-module identity surfaces: 20
```

## Required authority

`prehistoric-rush-runtime-module-generation-identity-authority-domain`

```txt
RuntimeModuleAdmissionCommand
  -> read the canonical manifest
  -> bind document, route, cache and deployment revisions
  -> normalize host, import-map, kit, provider, Worker and renderer URLs
  -> compute RuntimeModuleGeneration and digest
  -> verify kit-linked Nexus Engine provenance
  -> reject mixed, stale or duplicate generations
  -> publish RuntimeModuleAdmissionResult
  -> permit engine and asset composition
  -> publish FirstSingleRuntimeCreatorFrameAck
  -> publish FirstSingleRuntimeGameFrameAck
```

## Planned authority surfaces

```txt
runtime-module-manifest-kit
document-import-map-inspection-kit
runtime-url-normalization-kit
runtime-commit-identity-kit
runtime-module-generation-digest-kit
kit-linked-runtime-provenance-kit
module-namespace-identity-kit
descriptor-factory-provenance-kit
object-descriptor-provenance-kit
physics-provider-provenance-kit
worker-runtime-provenance-kit
mixed-runtime-generation-rejection-kit
stale-module-generation-retirement-kit
cross-route-runtime-parity-kit
runtime-module-admission-result-kit
first-single-runtime-creator-frame-ack-kit
first-single-runtime-game-frame-ack-kit
runtime-module-source-fixture-kit
runtime-module-browser-fixture-kit
runtime-module-build-pages-parity-fixture-kit
```

## Validation boundary

```txt
full organization inventory compared: yes
central ledgers and current heads checked: yes
route import maps inspected: yes
shared runtime declarations inspected: yes
official kit linkage inspected: yes
product composition inspected: yes
runtime source changed by audit: no
npm test run by audit: no
browser module graph fixture: not run
built-output smoke: not run
Pages smoke: not run
```

No current browser failure, single-generation composition, cache coherence, cross-route parity, artifact parity, Pages parity, or production readiness is claimed.