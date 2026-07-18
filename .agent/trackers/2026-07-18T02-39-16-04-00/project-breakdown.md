# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-18T02-39-16-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Selection:** oldest synchronized documented eligible repository  
**Reviewed repository head:** `791f273d96a136e15fc15c077913ca377a017b2a`  
**Reviewed runtime source revision:** `06e2bc0439643e46153b8c7f7f42a4e91a2db5e1`  
**Status:** `required-startup-asset-failure-recovery-authority-audited`

## Summary

The current Publish inventory contains 11 repositories. Ten are eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`. Every eligible repository remains centrally tracked, retains root `.agent` state, and has a `main` head matching its documented repo-local head. `PrehistoricRush` had the oldest eligible central audit timestamp, `2026-07-17T16-40-37-04-00`, and was the only repository selected.

The focused audit found two different startup failure paths. `src/pages/game.js` catches required module import failures, writes a terminal error string into the document body, logs the error, and rethrows. The next stage, `src/game.js`, top-level awaits required tree-fidelity bundle preparation and runtime-image hydration. Image failure is recorded in Core Startup and then rethrown, but the page bootstrap has no recovery settlement, retry action, menu-return action, provider/runtime retirement, or recovered-frame acknowledgement. The successful path unregisters the temporary asset provider and publishes the runtime globally; the failed path does not establish equivalent cleanup or a user-operable terminal state.

This does not prove a current production incident. It establishes that required startup failures are observable but not owned as a complete command/result/recovery lifecycle.

## Intent

Define one authority that admits a startup generation, settles required module and asset preparation exactly once, classifies failure, retires partial resources, exposes bounded retry or navigation recovery, and proves the first frame rendered by the accepted recovered generation.

## Checklist

- [x] Enumerate all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare eligible repository heads with central documented heads.
- [x] Select and modify only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Identify the complete interaction loop and active domains.
- [x] Preserve the complete 97-surface implemented kit/service inventory.
- [x] Inspect module preflight, required tree bundle preparation, image hydration, provider retirement and page bootstrap behavior.
- [x] Define one proposed startup failure/recovery authority and 20 coordinating surfaces.
- [ ] Implement failure settlement, retry limits, cleanup and recovered-frame proof.
- [ ] Execute source, browser, artifact and Pages failure fixtures.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger missing: 0
root .agent missing at documented heads: 0
new or undocumented: 0
runtime-ahead against documented heads: 0
all eligible heads matched: yes
selected: LuminaryLabs-Publish/PrehistoricRush
selection class: oldest synchronized documented timestamp
selected prior timestamp: 2026-07-17T16-40-37-04-00
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

```txt
TheLongHaul       1ed59786aa8f8f26f643c9f1e8c4d0a4205181f6
IntoTheMeadow     f48b52b04644ef4b7d08c214e9b421b45a9fd717
HorrorCorridor    0345cedf4359b4e4bc9463d34076eeb8f295f7e4
AetherVale        f5663def0e019ec710e869a416286a80895eb792
ZombieOrchard     3ecb66bbde317a22f3f0d051c014bbe4a9ddf3f5
TheUnmappedHouse  37ac9fef5a546e5e7a47a7c7748ba3423cc28c2c
MyCozyIsland      776fbcc3a258bf3a6f9f038a63be689ee80aefe3
TheOpenAbove      28bed180bac93a326dfa1a31ab54699387698086
PhantomCommand    b1293276a98e9279f3bf02f88d6a4b0d1ce87824
PrehistoricRush   791f273d96a136e15fc15c077913ca377a017b2a
```

## Complete interaction loop

```txt
page request
  -> game.html mounts #app and imports src/pages/game.js

required module preflight
  -> import Nexus Engine, five official kits, Three.js, Rapier and Rapier provider
  -> wait for every import through Promise.allSettled
  -> on failure: replace document body text, log and throw
  -> on success: import src/game.js

required tree startup
  -> render forest preparation progress surface
  -> import the shared Nexus Engine and Three.js revisions
  -> construct Assets, Startup, Object, Shape, Capture, Fidelity and Vegetation runtime
  -> launch one startup generation
  -> track the required tree-fidelity bundle
  -> report bundle progress
  -> register required runtime-image preparation
  -> decode far/horizon atlas images
  -> read alpha bounds and bind runtime images

success settlement
  -> mark runtime-image preparation ready
  -> unregister temporary tree provider
  -> publish PrehistoricRushTreeAssetRuntime
  -> import game-runtime-lod.js
  -> create engine, world streaming, render and gameplay hosts
  -> attach pause-menu presentation
  -> run route, collision, pickup, score and outcome gameplay

failure path
  -> report image preparation failed when hydration throws
  -> rethrow from top-level startup
  -> no admitted retry, menu fallback, partial-runtime retirement or recovered-frame proof
```

## Domains in use

```txt
browser document, import map, ES modules, module cache, DOM, MutationObserver,
keyboard, focus, lifecycle, RAF, fetch, Image, createImageBitmap, OffscreenCanvas,
Canvas2D readback, IndexedDB, storage, Worker, CDN and GitHub Pages

Nexus Engine runtime, Assets, Startup, Input, Object, Shape, Capture, Fidelity,
Vegetation, Ecology, Tree, Foliage, Object Bridge, Scene, Spatial, Creature,
Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics,
UI, Diagnostics, Composition and Presentation

NexusEngine-Kits seed, procedural creature body, instanced render batch,
seeded world patch controller and camera smooth follow

PrehistoricRush startup, character profile, menu, creator, run, route, surface,
resolution, player, pose, terrain IK, pause, terrain streaming, tree fidelity,
foliage cards, ground cover, pickup, score and outcome

Three.js presentation, Rapier physics, source tests, static hosting,
Actions/Pages deployment, repo-local audit governance and central tracking
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
vegetation-foliage-domain-kit: foliage descriptors, card families, clusters, placement recipes, wind, seasonal color, validation
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
prehistoric-patch-generator: terrain, ecology, matrices, scaled collision, grass, ground cover, pickups
prehistoric-patch-worker: provider import, catalog initialization, requests, generation, transferable results
 tree-archetype-catalog-kit: species, silhouettes, palettes, textures, heights, ecology and weights
tree-fidelity-package-schema-kit: source, collision, forms, transitions, captures, materials, generation identity
tree-fidelity-asset-provider-kit: object build, capture, package, generation, progress, disposal
tree-fidelity-registration-kit: provider, packages, manifest, bundle
tree-fidelity-runtime-composition-kit: Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation and profiles
tree-fidelity-route-preparation-kit: preload, required preparation, provider retirement and receipts
tree-fidelity-runtime-image-hydration-kit: atlas discovery, decode, crop metadata, image binding and typed failures
prehistoric-vegetation-catalog-registration-kit: tree, foliage, ground-cover and object registration plus atlas identity
prehistoric-vegetation-runtime-composition-kit: isolated engine, catalog APIs, placement API and snapshots
prehistoric-vegetation-generator-options-kit: tree type, placement, species and atlas option publication
prehistoric-foliage-card-recipe-kit: atlas revision, eight families, mapping, placement closure and ground cover
```

### External, host, capture and render adapters: 21

```txt
three-runtime-module: scene, GPU resources, materials, textures, renderer and submission
rapier-physics-domain-kit: Core Physics provider bridge
rapier-runtime-module: Rapier runtime
message-worker-executor-adapter-kit: Worker request correlation and settlement
three-patch-stream-adapter-kit: terrain, vegetation, grass, shards, player, activation and rendering
terrain-lod-geometry-adapter: topology, indices, morph data and skirts
three-clay-surface-texture-adapter: deterministic surface textures
creator-viewport-framing-adapter: creator camera framing
creator-persistence-scheduler: delayed profile writes
browser-input-adapter: keyboard and action projection
creature-camera-render-host-adapters: pose, camera, frame and diagnostics projection
game-runtime-lod-host-adapter: preflight, composition, generation identity, streaming, RAF and startup status
three-patch-stream-lod-adapter: terrain/tree/jungle composition, activation, release, frame acknowledgement and disposal
three-terrain-lod-layer: allocation, selection, morphing, stitching and disposal
three-object-capture-provider-adapter: framing, multi-angle observations, bounds and atlas output
browser-indexeddb-asset-cache-adapter: persistent package cache and identity
three-tree-fidelity-layer: form selection, hysteresis, crossfade, frame addressing, UV binding, receipts and disposal
lush-jungle-atmosphere-render-adapter: background, fog, exposure, lighting and resource references
prehistoric-foliage-atlas-render-kit: procedural atlas, family texture views, revision identity and disposal
three-lush-foliage-layer: projected-size LOD, crossfade, wind/tint, family batches, ownership and disposal
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
proposed startup recovery surfaces: 20
```

## Source-backed finding

```txt
required module preflight: implemented
module failure message projection: implemented
module failure recovery action: absent
required tree bundle preparation: implemented
runtime-image preparation tracking: implemented
image decode/readback failure reporting: implemented
successful temporary-provider unregister: implemented
failed-path provider/runtime retirement result: absent
startup failure classification result: absent
retry policy and retry budget: absent
retry action and menu fallback: absent
recovered startup generation: absent
first recovered game frame acknowledgement: absent
browser failure/retry fixture: absent
artifact and Pages failure/retry fixtures: absent
```

## Required authority

**Proposed, not implemented:**

`prehistoric-rush-required-startup-asset-failure-recovery-authority-domain`

```txt
StartupGenerationAdmissionCommand
  -> bind module, provider, bundle and runtime revisions
  -> StartupGenerationResult

RequiredStartupPreparationCommand
  -> settle module preflight, bundle preparation and image hydration
  -> RequiredStartupPreparationResult

StartupFailureSettlementCommand
  -> classify source, stage, retryability and partial ownership
  -> StartupFailureResult

StartupRecoveryCommand
  -> bounded retry, menu return or terminal stop
  -> retire partial provider/runtime resources
  -> StartupRecoveryResult

StartupProjectionCommitCommand
  -> project progress, failure and recovery state
  -> StartupFrameDigest
  -> FirstRecoveredGameFrameAck
```

### Proposed coordinating surfaces: 20

```txt
startup-generation-manifest-kit
required-module-preflight-result-kit
required-asset-preparation-result-kit
tree-fidelity-bundle-admission-kit
runtime-image-hydration-result-kit
startup-failure-classification-kit
startup-failure-redaction-kit
startup-retry-policy-kit
startup-retry-budget-kit
startup-recovery-command-kit
startup-recovery-settlement-kit
startup-provider-retirement-kit
startup-runtime-retirement-kit
startup-navigation-fallback-kit
startup-status-projection-kit
startup-accessible-error-surface-kit
startup-source-failure-fixture-kit
startup-browser-retry-fixture-kit
startup-artifact-pages-failure-fixture-kit
first-recovered-game-frame-ack-kit
```

## Validation boundary

Source and existing documentation were inspected. A checkout attempt failed because the execution environment could not resolve `github.com`, so package and browser commands were not executed. This audit changes documentation only; runtime JavaScript, tests, package scripts, gameplay, rendering, physics, workflows and deployment are unchanged.

No current startup outage, asset corruption, browser incompatibility, cleanup leak, successful retry, artifact parity, Pages parity or production readiness is claimed.