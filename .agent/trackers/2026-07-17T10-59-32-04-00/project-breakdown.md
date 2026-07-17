# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-17T10-59-32-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** oldest synchronized eligible repository  
**Reviewed repository head:** `0194fc7b3962528cb5233d0180f7b33a30eb5050`  
**Reviewed runtime source revision:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`  
**Status:** `pause-overlay-input-context-simulation-arbitration-authority-audited`

## Summary

The full current Publish inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. Every eligible repository has a central ledger, root `.agent` state and `main` head matching its documented repo-local head. PrehistoricRush had the oldest synchronized ledger timestamp and was the only project selected.

The focused audit found that the interface named “Pause” is intentionally declared non-modal and non-blocking. Its full-screen overlay captures pointer interaction, but global gameplay keyboard listeners remain active and `engine.tick(dt)` continues unconditionally. Opening Settings or Exit can therefore leave steering, boost, jumping, physics, world streaming, collision, scoring and rendering active behind the overlay.

## Intent

Make menu-open behavior explicit and generation-bound: either admit a true pause that neutralizes gameplay input and suspends simulation, or rename and present the surface as a non-pausing menu. The current “Pause” label, full-screen overlay and active gameplay loop must not disagree.

## Checklist

- [x] Enumerate all 11 current Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Verify ten eligible central ledgers and root `.agent` states.
- [x] Verify every eligible repository head matches its documented repo-local head.
- [x] Select only PrehistoricRush through the oldest synchronized timestamp rule.
- [x] Identify the complete interaction loop and active domains.
- [x] Preserve all 97 implemented kits, adapters and proof surfaces with services.
- [x] Inspect pause descriptors, DOM host, active keyboard listeners, frame loop and pause fixture.
- [x] Define one pause/input/simulation arbitration authority and 19 coordinating surfaces.
- [ ] Implement one accepted pause policy and executable browser proof.
- [ ] Retain the previously documented render-host retirement gap as unresolved.

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
selection reason: oldest synchronized central timestamp
selected prior timestamp: 2026-07-17T06-23-59-04-00
next oldest: LuminaryLabs-Publish/PhantomCommand at 2026-07-17T06-38-14-04-00
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
browser and asset startup
  -> prepare tree fidelity packages and runtime images
  -> load pinned Nexus Engine, Kits, Three.js and Rapier
  -> compose gameplay, presentation, Vegetation, physics and product kits
  -> start deterministic route, patch streaming, camera and renderer
  -> RAF reads global keyboard state, ticks engine truth, streams patches and renders

pause interaction
  -> Escape toggles prehistoric-rush-pause-menu-domain-kit
  -> DOM host mounts a full-screen overlay and Settings/Exit controls
  -> overlay captures pointer interaction
  -> descriptor remains modal=false and blocksSimulation=false
  -> global A/D/W/Arrow/Space listeners remain active
  -> engine.tick(dt), physics, route progress, streaming and rendering continue
  -> closing the overlay resumes the same already-advancing run
```

## Domains in use

```txt
browser document, route, import map, ES module cache, DOM, keyboard, focus,
lifecycle, RAF, storage, IndexedDB, Worker and CDN delivery

Nexus Engine runtime, scene, spatial, creature, character, player, physics,
simulation, motion, camera, animation, graphics, UI, diagnostics,
composition and presentation

Core Assets, Startup, Input, Object, Shape, Capture, Fidelity, Vegetation,
Ecology, Tree, Foliage and Vegetation Object Bridge

NexusEngine-Kits seed, procedural creature, instance batch,
seeded world-patch control and camera smoothing

PrehistoricRush run, route, surface, resolution, player, pose, terrain IK,
pause-menu state, UI overlay, input context, terrain, patch, tree, grass,
foliage cards, ground cover, pickup, score and outcome

Three.js scene, camera, fog, lights, shadows, tone mapping, materials,
textures, instancing, renderer, WebGL context, canvas and render submission

Rapier physics, source tests, static delivery, GitHub Pages,
repo-local audit governance and central tracking
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
prehistoric-patch-worker: engine import, catalog initialization, requests, generation, transferable results
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
planned pause-arbitration surfaces: 19
```

## Main source-backed finding

```txt
pause menu label and route: present
full-screen overlay: present
overlay captures pointer: present
menu modal policy: false
menu blocksSimulation policy: false
overlay blocksSimulation policy: false
global gameplay keydown/keyup listeners while open: present
held-input neutralization on open: absent
input-context generation: absent
simulation gate around engine.tick(dt): absent
physics/world-streaming pause settlement: absent
clock rebase on resume: absent
focus capture/restoration receipt: absent
FirstPausedFrameAck: absent
FirstResumedGameplayFrameAck: absent
```

The pause fixture explicitly asserts the non-blocking descriptors and unconditional simulation tick, so this behavior is part of the current source contract rather than an incidental host-only omission.

## Required authority

`prehistoric-rush-pause-overlay-input-context-simulation-arbitration-authority-domain`

```txt
PausePolicyAdmissionCommand
  -> choose true-pause or explicitly non-pausing menu semantics
  -> bind runtime, run, input, menu and frame revisions
  -> publish PausePolicyAdmissionResult

PauseOpenCommand
  -> retire held gameplay input
  -> establish menu input context and focus ownership
  -> suspend admitted simulation participants when policy requires
  -> publish PauseOpenResult
  -> publish FirstPausedFrameAck

PauseInputCommand
  -> admit only menu navigation, close and explicit actions
  -> reject gameplay steering, boost and jump while true pause is active
  -> publish PauseInputResult

PauseCloseCommand
  -> restore focus
  -> rebase the frame clock
  -> resume participants exactly once
  -> publish PauseCloseResult
  -> publish FirstResumedGameplayFrameAck
```

### Proposed coordinating surfaces: 19

```txt
pause-policy-admission-kit
pause-generation-kit
menu-input-context-kit
held-gameplay-input-retirement-kit
pause-focus-lease-kit
pause-focus-restoration-kit
pause-keyboard-routing-kit
pause-pointer-routing-kit
simulation-suspension-kit
physics-suspension-kit
world-streaming-suspension-kit
camera-animation-suspension-kit
frame-clock-rebase-kit
pause-open-result-kit
pause-input-result-kit
pause-close-result-kit
first-paused-frame-ack-kit
first-resumed-gameplay-frame-ack-kit
pause-browser-fixture-kit
```

## Required repo-local output

```txt
.agent/trackers/2026-07-17T10-59-32-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-17T10-59-32-04-00.md
.agent/architecture-audit/2026-07-17T10-59-32-04-00-pause-input-simulation-dsk-map.md
.agent/render-audit/2026-07-17T10-59-32-04-00-pause-overlay-moving-world-frame-gap.md
.agent/gameplay-audit/2026-07-17T10-59-32-04-00-menu-open-active-run-loop.md
.agent/interaction-audit/2026-07-17T10-59-32-04-00-pause-context-command-result-map.md
.agent/pause-system-audit/2026-07-17T10-59-32-04-00-input-simulation-focus-contract.md
.agent/deploy-audit/2026-07-17T10-59-32-04-00-pause-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-17T10-59-32-04-00-oldest-selection-pause-arbitration-reconciliation.md
```

## Validation boundary

This audit changes documentation only. It does not change pause behavior, input routing, simulation, physics, world streaming, rendering, tests or deployment. No player-loss incident was reproduced. True-pause correctness, non-pausing-menu clarity, focus behavior, artifact parity, Pages parity and production readiness remain unproven.
