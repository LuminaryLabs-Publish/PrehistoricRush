# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-15T20-59-46-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed current repository head:** `bfc51c01a79601686e5fad12ff3240472b3f111c`  
**Reviewed runtime source revision:** `4808f05cff438ff5a9d013cd7ddec5127bbcf213`  
**Status:** `game-audio-event-projection-authority-audited`

## Summary

The full 11-repository Publish inventory was compared with the ten eligible central ledgers and root `.agent` states. `TheCavalryOfRome` remained excluded. No eligible repository was new, ledger-missing, root-agent-missing, undocumented, or runtime-ahead, so PrehistoricRush was selected by the oldest synchronized timestamp.

PrehistoricRush already produces accepted semantic events for run start, shard collection, collision failure, and victory. The browser host projects those outcomes through Three.js and DOM state, but the active boot/runtime path has no owned browser-audio context, cue registry, result-driven projection, ambience lifecycle, preferences, deduplication, spatial projection, voice budget, or audible-result acknowledgement.

## Plan ledger

**Goal:** add one result-driven audio authority that consumes accepted engine events and state without moving gameplay truth into keyboard handlers or render callbacks.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and ten root `.agent` states.
- [x] Confirm zero new, missing, undocumented, root-agent-missing, or runtime-ahead eligible repositories.
- [x] Select only PrehistoricRush by the oldest synchronized central timestamp.
- [x] Trace boot, run input, accepted simulation events, visual projection, pause, and retirement boundaries.
- [x] Preserve all 66 implemented kits, adapters, and proof surfaces.
- [x] Define one parent audio authority and 22 coordinating surfaces.
- [x] Add the timestamped audit family under root `.agent`.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement and execute browser audio, lifecycle, deduplication, artifact, and Pages fixtures.

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
selection rule: oldest synchronized central timestamp
prior central timestamp: 2026-07-15T16-00-32-04-00
next oldest: LuminaryLabs-Publish/HorrorCorridor at 2026-07-15T16-39-06-04-00
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
menu
  -> load selected procedural raptor profile
  -> expose Start Run and Character Creator

game boot
  -> load pinned Nexus Engine, Kits, Three.js, Rapier, and Rapier ProtoKit
  -> install Core and PrehistoricRush domains
  -> create physics, patch streaming, camera, renderer, DOM status, and action button
  -> start the run and RAF loop

active run
  -> keyboard or button submits steer, boost, jump, start, or retry intent
  -> Core Simulation settles movement, collision, pickups, goal, and scene transition
  -> PrehistoricRush publishes RunStarted, ShardCollected, RunFailed, and RunWon events
  -> Three.js and DOM project the accepted state
  -> no semantic audio cue projection or audible acknowledgement occurs

pause and lifecycle
  -> Escape toggles pause state
  -> blur clears movement input
  -> route exit or document retirement can remove visual ownership
  -> no audio context, held loop, ambience, or voice settlement exists
```

## Source-backed finding

The product domain declares and emits stable semantic events for run start, shard collection, failure, and victory. The runtime host consumes accepted game state, refreshes picked-up content, updates streaming, renders the frame, and replaces DOM status and action text. The active boot list contains Nexus Engine, Kits, Three.js, Rapier, and Rapier ProtoKit modules, but no audio provider.

```txt
AudioContext owner: absent
HTMLAudioElement owner: absent
semantic cue descriptor registry: absent
accepted-event-to-cue projector: absent
user-gesture audio admission: absent
master/category volume preferences: absent
mute state: absent
movement/boost/jump/landing cue lifecycle: absent
surface-aware footstep projection: absent
shard/failure/win cue projection: absent
ambient world loop lifecycle: absent
listener/source transform projection: absent
snapshot and event deduplication: absent
voice pooling and budgets: absent
AudioProjectionResult: absent
FirstAudibleCueAck: absent
FirstAudioVisualConvergenceAck: absent
```

This is a source-backed architecture and evidence gap. No browser was launched and no audible defect was reproduced.

## Domains in use

```txt
browser document lifecycle, user gesture, keyboard, blur, RAF, resize, Worker, storage, and navigation
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition, and Presentation
PrehistoricRush run, route, surface, score, outcome, pause, player composition, pose, and terrain IK
semantic game events, browser audio admission, cue projection, ambience, listener/source transforms, preferences, deduplication, budgets, and audiovisual convergence
patch generation, queue, cache, Worker execution, adoption, and release
terrain LOD, Three.js, Rapier, vegetation, pickups, validation, build, Pages, and central tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings, and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, registry, snapshots, and reset
core-character-kit: character registry, bindings, status, snapshots, and reset
core-player-kit: player registry, possession, control, and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping, and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution, events, and committed frames
core-motion-kit: motion intents, requests, and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve, and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral descriptors and terrain LOD policy registration
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation composition graph and snapshots
core-presentation-output-kit: surface input, viewport policy, render resolution, and safe area
core-ui-scale-kit: reference resolution, viewport scale, and scale policy
core-camera-framing-kit: subject framing, projection fit, damping, and clipping policy
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic world seeds and named random streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision, and descriptors
instanced-render-batch-kit: batch registry, stable ranges, cell membership, flush, and diagnostics
seeded-world-patch-controller-kit: focus, desired sets, generation queue, cache, adoption, release, and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta, and snapshots
```

### Product, page, and Worker kits: 17

```txt
prehistoric-rush-domain-kit: run, route, surface, score, accepted outcomes, semantic events, player, pose, and ground IK
prehistoric-rush-pause-menu-domain-kit: pause state, commands, events, and snapshot
prehistoric-rush-terrain-lod-policy-kit: LOD policy registration, query, snapshot, and reset
prehistoric-rush-resolution-policy: movement, collision, pickup, goal, event, and transition resolution
player-character-composition-kit: body, rig, creature, character, and possession
player-articulation-adapter-kit: legacy pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: localStorage, revisions, broadcasts, save, patch, reset, and subscriptions
menu-page-kit: title, selected-profile projection, and navigation
character-creator-page-kit: controls, draft, debounce, reset, external updates, navigation, and preview
character-preview-transition-kit: morph, crossfade, pose, and resource lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application, and disposal
game-page-entry-kit: dependency preflight, runtime entry, feedback cleanup, and pause host
player-raptor-preset-kit: authored player creature content
drunk-route-generator: deterministic route samples, nearest query, classification, and progress
prehistoric-patch-generator: terrain fields, trees, grass, pickups, and colliders
prehistoric-patch-worker: Worker initialization, request, transfer, and result protocol
```

### External, host, and renderer adapters: 14

```txt
three-runtime-module: scene, resources, and render submission
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling, and disposal
three-patch-stream-adapter-kit: terrain, patch content, colliders, pickups, height, camera, and ownership
terrain-lod-geometry-adapter: topology, indices, skirts, UVs, morph offsets, and bounds
three-clay-surface-texture-adapter: deterministic normal and roughness generation, setup, and disposal
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: delayed profile writes and timer replacement
browser-input-adapter: keyboard, blur, jump, boost, steer, start, and restart projection
creature-camera-render-host-adapters: pose, camera, feedback, and diagnostics projection
game-runtime-lod-host-adapter: pinned loading, engine composition, Rapier, streaming, input, RAF, and diagnostics
three-patch-stream-lod-adapter: LOD/base composition, activation, suppression, release, and frame acknowledgement
three-terrain-lod-layer: slot allocation, upload, selection, geomorph, clay material, release, and disposal
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
planned audio authority surfaces: 22
```

## Required authority

`prehistoric-rush-game-audio-event-projection-authority-domain`

```txt
AudioProjectionAdmissionCommand
  -> bind document, runtime, run, committed-frame, event, camera, and audio-policy revisions
  -> observe browser audio capability and accepted user-gesture unlock
  -> consume accepted semantic events and state, never raw input success assumptions
  -> resolve stable UI, run, movement, surface, pickup, collision, victory, and ambience cue descriptors
  -> suppress repeated event, snapshot, and RAF duplicates
  -> project listener and spatial-source transforms
  -> enforce mute, volume, buses, pooling, priority, and voice budgets
  -> suspend, resume, or retire contexts and loops on pause, blur, visibility, route exit, and runtime replacement
  -> publish AudioProjectionResult
  -> publish FirstAudibleCueAck
  -> publish FirstAudioVisualConvergenceAck
```

## Planned audio surfaces: 22

```txt
browser-audio-capability-kit
audio-user-gesture-admission-kit
audio-context-lifecycle-kit
game-audio-event-identity-kit
audio-cue-descriptor-kit
run-start-cue-kit
movement-loop-audio-kit
boost-cue-kit
jump-cue-kit
landing-cue-kit
surface-footstep-cue-kit
shard-pickup-cue-kit
collision-failure-cue-kit
run-win-cue-kit
world-ambience-loop-kit
listener-pose-projection-kit
spatial-source-projection-kit
audio-preference-kit
cue-deduplication-kit
voice-budget-pool-kit
audio-projection-result-kit
audio-browser-fixture-kit
```

## Required fixtures

```txt
user gesture unlock and rejected pre-unlock playback
run start, jump, landing, boost, shard, collision, and win cues
no cue for rejected or duplicate actions
surface-aware movement cue changes
snapshot and accepted-event deduplication
pause, blur, visibility, route exit, and runtime replacement settlement
master/category volume and mute persistence
bounded voice count under rapid pickups and repeated inputs
listener/source transform correlation with the accepted camera and world frame
FirstAudibleCueAck and FirstAudioVisualConvergenceAck
source, built output, and Pages parity
```

## Boundary

Documentation only. No audio runtime, audible gameplay, browser-unlock reliability, cue correctness, spatial correctness, lifecycle settlement, audiovisual convergence, artifact parity, Pages parity, or production readiness is claimed.
