# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-16T06-39-16-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed pre-audit repository head:** `5a4d179c09ee9fad4e11a44f42671606a4a6254d`  
**Reviewed runtime source revision:** `4808f05cff438ff5a9d013cd7ddec5127bbcf213`  
**Status:** `webgl-context-gpu-resource-recovery-authority-audited`

## Summary

The full current 11-repository `LuminaryLabs-Publish` inventory was compared with the ten eligible central ledgers and synchronized repository heads. `TheCavalryOfRome` remained excluded. No eligible repository was new, ledger-missing, root-agent-missing, undocumented or runtime-ahead, so PrehistoricRush was selected by the oldest synchronized timestamp.

The active game creates one Three.js `WebGLRenderer` and a substantial GPU-resource graph, then submits frames recursively through RAF. The host observes resize, keyboard and blur, but not `webglcontextlost` or `webglcontextrestored`. The product therefore has no explicit render-loss result, render generation, presentation suspension, resource reconstruction registry, stale-generation rejection, bounded recovery policy, fallback result or first recovered frame acknowledgement.

## Plan ledger

**Goal:** make WebGL context loss and GPU-resource reconstruction one bounded authority that can recover the current streamed world without changing simulation or gameplay ownership.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare all ten eligible repositories against central ledger state and current heads.
- [x] Confirm zero new, ledger-missing, root-agent-missing, undocumented or runtime-ahead priority repositories.
- [x] Select only PrehistoricRush by the oldest synchronized timestamp.
- [x] Trace renderer creation, RAF submission, terrain LOD resources, clay textures, instanced resources, creature resources, shadows and disposal.
- [x] Preserve the complete 66-surface kit and service inventory.
- [x] Define one parent WebGL recovery authority and 21 coordinating surfaces.
- [x] Add the timestamped root `.agent` audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement and execute context-loss, restoration, rehydration, fallback, artifact and Pages fixtures.

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

PrehistoricRush   2026-07-16T02-03-42-04-00 selected
HorrorCorridor    2026-07-16T02-40-29-04-00
TheOpenAbove      2026-07-16T03-03-22-04-00
ZombieOrchard     2026-07-16T03-41-28-04-00
TheUnmappedHouse  2026-07-16T04-02-40-04-00
PhantomCommand    2026-07-16T04-27-44-04-00
AetherVale        2026-07-16T04-40-16-04-00
TheLongHaul       2026-07-16T05-01-43-04-00
MyCozyIsland      2026-07-16T05-41-12-04-00
IntoTheMeadow     2026-07-16T05-58-36-04-00
TheCavalryOfRome  excluded
```

## Complete interaction loop

```txt
menu and creator
  -> load or edit the selected procedural raptor profile
  -> enter the game route

game boot
  -> preload pinned Nexus Engine, Kits, Three.js, Rapier and ProtoKit modules
  -> compose engine, physics, patch controller, camera and Three.js presentation
  -> create one WebGLRenderer and one GPU-resource graph
  -> create terrain slots, LOD slots, clay textures, instanced vegetation and pickups
  -> create the player mesh, lights and shadow resources
  -> generate the center patch and start RAF

normal frame
  -> collect browser input
  -> tick simulation and physics
  -> update streamed patch ownership
  -> upload or release terrain, instances, pickups and colliders
  -> update camera, creature pose, LOD morphs and materials
  -> renderer.render(scene, camera)
  -> publish DOM telemetry and schedule the next frame

context-loss path today
  -> no product-owned webglcontextlost result
  -> no explicit presentation suspension or simulation policy
  -> no render-generation retirement
  -> no dependency-ordered GPU-resource reconstruction
  -> no stale-generation rejection
  -> no recovery deadline, retry or fallback policy
  -> no first recovered frame acknowledgement
```

## Source-backed finding

The base Three.js adapter creates the renderer, scene, camera, shadow-casting sun, terrain geometry, instanced vegetation and shards, player creature mesh and active patch registries. The terrain LOD layer adds its own geometry slots, per-level index buffers, morph targets, physical material and deterministic clay textures.

The host continues to call `renderer.render(scene, camera)` every RAF. It installs keyboard, keyup, blur and resize listeners, but no WebGL context-loss or restoration listeners. The LOD wrapper exposes `dispose()`, yet it only disposes the terrain LOD layer; the base adapter has no complete disposal contract and the host does not call adapter disposal.

```txt
WebGLRenderer creation: present
renderer canvas mounted into the game host: present
recursive RAF render submission: present
terrain and LOD geometry buffers: present
normal and roughness textures: present
instanced tree, grass and pickup resources: present
player creature mesh and material resources: present
shadow-map resources: present
ordinary terrain LOD disposal: present

webglcontextlost listener: absent
webglcontextrestored listener: absent
render-context generation identity: absent
loss admission result: absent
explicit presentation suspension: absent
simulation/input policy during loss: absent
complete GPU-resource registry: absent
dependency-ordered reconstruction: absent
base-adapter disposal: absent
host adapter disposal call: absent
stale recovery work rejection: absent
recovery deadline/retry budget: absent
fallback result: absent
RenderLossResult: absent
RenderRecoveryResult: absent
FirstRecoveredFrameAck: absent
forced context-loss fixture: absent
```

Three.js may internally rebuild some renderer state after browser restoration. The missing product boundary is explicit admission, resource-graph reconstruction, policy, observability and proof. No actual context-loss incident was reproduced.

## Domains in use

```txt
browser document, canvas, WebGL context, context loss/restoration, RAF, resize and page lifecycle
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
PrehistoricRush run, route, surface, score, outcome, pause, player composition, pose and terrain IK
seeded patch identity, active/prefetch rings, generation, cache, activation, release and replay of the visible patch set
Three.js renderer, scene, camera, geometry, materials, textures, shadow maps, instanced meshes and creature resources
terrain LOD topology, slots, index buffers, morph targets, clay normal/roughness textures and visible-frame acknowledgements
Rapier bodies and colliders, browser input, diagnostics, build, Pages deployment and central tracking
render-context generation, loss admission, resource retirement, reconstruction, stale-work rejection, retry, fallback and recovered-frame proof
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
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
seeded-world-patch-controller-kit: patch identity, active/prefetch rings, cache, generation queue, inflight ownership, readiness, activation budget, release and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page and Worker kits: 17

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
prehistoric-patch-worker: initialization, readiness message, request execution, transferable response and request error message
```

### External, host and renderer adapters: 14

```txt
three-runtime-module: scene, resources and render submission
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling, pending promises and explicit disposal
three-patch-stream-adapter-kit: terrain, patch content, colliders, pickups, height, camera and ownership
terrain-lod-geometry-adapter: topology, indices, skirts, UVs, morph offsets and bounds
three-clay-surface-texture-adapter: deterministic normal and roughness generation, setup and disposal
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: delayed profile writes and timer replacement
browser-input-adapter: keyboard, blur, jump, boost, steer, start and restart projection
creature-camera-render-host-adapters: pose, camera, feedback and diagnostics projection
game-runtime-lod-host-adapter: module loading, engine composition, Rapier, Worker creation, streaming, input, RAF, visual status and diagnostics
three-patch-stream-lod-adapter: LOD/base composition, activation, suppression, release and frame acknowledgement
three-terrain-lod-layer: allocation, upload, selection, geomorph, material, release and disposal
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

```txt
total implemented surfaces: 66
planned WebGL recovery surfaces: 21
```

## Required authority

`prehistoric-rush-webgl-context-gpu-resource-recovery-authority-domain`

```txt
RenderLossAdmissionCommand
  -> bind document, canvas, renderer, context, runtime and resource generations
  -> prevent the browser default loss behavior when recovery is admitted
  -> classify loss once and publish RenderLossResult
  -> suspend stale presentation
  -> apply the authored simulation and input policy
  -> retire the lost render generation

RenderRecoveryCommand
  -> bind the accepted loss result and one replacement generation
  -> reconstruct renderer-owned state and the product GPU-resource graph
  -> rebuild terrain LOD buffers, clay textures, instances, creature resources and shadows
  -> replay the current visible patch set from CPU-authoritative descriptors
  -> reject stale or duplicate work from retired generations
  -> enforce a deadline and bounded retry budget
  -> publish RenderRecoveryResult or RenderFallbackResult
  -> present one matching frame
  -> publish FirstRecoveredFrameAck
```

## Planned WebGL recovery authority surfaces: 21

```txt
render-context-capability-kit
render-context-generation-kit
webgl-context-loss-observer-kit
webgl-context-restoration-observer-kit
render-loss-admission-kit
render-suspension-policy-kit
simulation-during-render-loss-policy-kit
renderer-reconstruction-kit
render-resource-registry-kit
render-resource-retirement-kit
terrain-lod-resource-rehydration-kit
clay-texture-resource-rehydration-kit
instanced-batch-resource-rehydration-kit
creature-resource-rehydration-kit
light-shadow-resource-rehydration-kit
patch-visible-set-replay-kit
render-generation-stale-work-rejection-kit
render-recovery-deadline-kit
render-recovery-retry-budget-kit
render-fallback-policy-kit
first-recovered-frame-ack-kit
```

## Repo-local output

Added:

```txt
.agent/trackers/2026-07-16T06-39-16-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-16T06-39-16-04-00.md
.agent/architecture-audit/2026-07-16T06-39-16-04-00-webgl-context-gpu-resource-recovery-dsk-map.md
.agent/render-audit/2026-07-16T06-39-16-04-00-lost-context-visible-world-frame-gap.md
.agent/gameplay-audit/2026-07-16T06-39-16-04-00-render-loss-active-run-loop.md
.agent/interaction-audit/2026-07-16T06-39-16-04-00-render-recovery-command-result-map.md
.agent/renderer-recovery-audit/2026-07-16T06-39-16-04-00-gpu-resource-rehydration-contract.md
.agent/deploy-audit/2026-07-16T06-39-16-04-00-context-loss-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-16T06-39-16-04-00-oldest-selection-renderer-recovery-reconciliation.md
```

Refreshed:

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
```

## Validation boundary

```txt
documentation changed: yes
runtime JavaScript changed: no
HTML CSS shaders or assets changed: no
gameplay simulation input rendering or physics behavior changed: no
packages dependencies tests workflows or deployment changed: no
branch created: no
pull request created: no

npm test: not run
forced WebGL context-loss fixture: not run
context-restoration fixture: not run
GPU-resource rehydration fixture: not run
fallback fixture: not run
built-output smoke: not run
Pages smoke: not run
```

No context-loss recovery, resource rehydration, stale-generation rejection, fallback correctness, first-recovered-frame convergence, artifact parity, Pages parity or production readiness is claimed.
