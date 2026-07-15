# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-15T10-58-45-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed repository head:** `4808f05cff438ff5a9d013cd7ddec5127bbcf213`  
**Status:** `host-clock-fixed-step-frame-authority-audited`

## Summary

PrehistoricRush was selected by the oldest synchronized eligible-repository rule after the full 11-repository Publish inventory was compared with ten central ledgers and current repo-local documentation heads. `TheCavalryOfRome` remained excluded, and no eligible repository was new, ledger-missing, root-agent-missing, undocumented or runtime-ahead.

The active LOD host converts each RAF interval into one simulation tick and clips that interval to 50 ms. The PrehistoricRush run system clips the tick delta to 50 ms again. Elapsed time, distance, steering, acceleration, gravity, jumping, goal progress and physics proposals therefore lose wall time whenever browser callbacks arrive below 20 FPS.

## Plan ledger

**Goal:** define one host-clock authority that preserves deterministic bounded simulation without silently slowing the run when RAF callbacks are delayed.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare ten eligible repositories with ten central ledger entries.
- [x] Compare every eligible current head with its recorded repo-local documentation head.
- [x] Confirm zero new, ledger-missing, root-agent-missing, undocumented or runtime-ahead eligible repositories.
- [x] Select only PrehistoricRush by the oldest synchronized central timestamp.
- [x] Trace RAF interval admission, input sampling, engine ticking, run-system time consumption, physics proposals, patch streaming and rendering.
- [x] Preserve all 66 existing source-backed surfaces and their offered services.
- [x] Define one host-clock parent authority with 20 coordinating surfaces.
- [x] Add the timestamped tracker and focused audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement and execute fixed-step, suspension, overload, interpolation, artifact and Pages fixtures.

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
prior central timestamp: 2026-07-15T06-39-22-04-00
next oldest: LuminaryLabs-Publish/HorrorCorridor at 2026-07-15T07-00-28-04-00
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
page boot
  -> load pinned Nexus Engine, kits, Three.js and Rapier
  -> install Core and PrehistoricRush domains
  -> create player physics, patch controller, camera follow and LOD adapter
  -> start run, prime center patch and request first RAF

RAF callback
  -> measure now - last
  -> clamp interval to at most 0.05 seconds
  -> sample keyboard state into steer and boost
  -> call engine.tick exactly once

PrehistoricRush simulation
  -> clamp tick.delta to at most 0.05 seconds again
  -> advance elapsed time, yaw, surface response and speed
  -> integrate gravity, jump height, position and distance
  -> publish motion, physics, pickup and goal proposals
  -> settle committed frame and scene transition

host continuation
  -> consume collected pickups
  -> update patch focus, queue, cache, generation and activation once
  -> render world and camera using the same clipped delta
  -> update DOM diagnostics
  -> request the next RAF
```

## Source-backed timing finding

```txt
host delta policy: min(0.05, wall interval)
engine ticks per RAF callback: 1
run-system delta policy: min(0.05, tick.delta)
fixed-step accumulator: absent
residual elapsed time: absent
catch-up step budget: absent
discarded-time receipt: absent
visibility/resume clock rebase result: absent
render interpolation revision: absent
FirstClockAlignedFrameAck: absent
```

Examples:

```txt
10 FPS callback interval: 100 ms
admitted simulation time: 50 ms
silently discarded time: 50 ms
simulation pacing: approximately 0.5x wall time

5 FPS callback interval: 200 ms
admitted simulation time: 50 ms
silently discarded time: 150 ms
simulation pacing: approximately 0.25x wall time
```

The source proves elapsed-time loss. It does not prove an observed device frame rate or a reproduced player-visible defect because no browser timing fixture was executed.

## Domains in use

```txt
browser document lifecycle, RAF, performance clock, input, blur, resize, Worker, storage and navigation
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
PrehistoricRush run, route, surface, score, outcome, pause, player composition, pose and terrain IK
host clock interval admission, fixed-step policy, accumulation, overload, suspension and resume
patch generation, schema, identity, queue, cache, Worker execution, adoption and release
terrain LOD policy, selection, hysteresis, skirts, geomorph and world-space clay materials
Three.js scene, geometry, materials, instancing, camera and render submission
Rapier provider, body and collider synchronization, pickups, collisions and height sampling
validation, static hosting, Pages and central audit tracking
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
core-simulation-kit: proposals, observations, resolution and committed frames
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
seeded-world-patch-controller-kit: focus, desired sets, generation queue, cache, adoption, release and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page and Worker kits: 17

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose and ground IK
prehistoric-rush-pause-menu-domain-kit: pause state, commands, events and snapshot
prehistoric-rush-terrain-lod-policy-kit: LOD policy registration, query, snapshot and reset
prehistoric-rush-resolution-policy: movement, collision, pickup, goal and transition resolution
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
prehistoric-patch-generator: 64-segment terrain fields, trees, grass, pickups and colliders
prehistoric-patch-worker: Worker initialization, request, transfer and result protocol
```

### External, host and renderer adapters: 14

```txt
three-runtime-module: scene, resources and render submission
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling and disposal
three-patch-stream-adapter-kit: terrain and patch-world content, collider, pickup, height, camera and ownership services
terrain-lod-geometry-adapter: topology, per-level indices, skirts, UVs, morph offsets and bounds
three-clay-surface-texture-adapter: deterministic normal and roughness generation, texture setup and disposal
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: delayed profile writes and timer replacement
browser-input-adapter: keyboard, blur, jump, boost, steer, start and restart projection
creature-camera-render-host-adapters: pose, camera, feedback and diagnostics projection
game-runtime-lod-host-adapter: pinned loading, engine composition, Rapier, streaming, input, RAF and diagnostics
three-patch-stream-lod-adapter: LOD/base composition, activation, suppression, release and frame acknowledgement
three-terrain-lod-layer: slot allocation, upload, selection, geomorph, clay material, release and disposal
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
total source-backed surfaces: 66
planned host-clock authority surfaces: 20
```

## Required authority

`prehistoric-rush-host-clock-fixed-step-frame-authority-domain`

```txt
HostClockFrameCommand
  -> bind document, runtime, RAF and clock generations
  -> admit one monotonic wall-clock interval
  -> classify active, suspended, resumed and overload states
  -> accumulate elapsed time without silently discarding it
  -> execute deterministic fixed steps within a bounded catch-up budget
  -> retain residual time or publish an explicit discarded-time receipt
  -> sample input once and bind it to the accepted step batch
  -> advance simulation, physics and patch-stream budgets under declared policies
  -> publish HostClockFrameResult and ClockSnapshot
  -> render the accepted simulation revision with an interpolation descriptor
  -> publish FirstClockAlignedFrameAck
```

## Required fixtures

```txt
100 ms callback interval produces the declared number of fixed steps
200 ms callback interval preserves residual or publishes an overload receipt
elapsed, distance and jump arcs remain within tolerance across 60, 20, 10 and 5 FPS schedules
hidden-document suspension does not produce a catch-up explosion
resume rebases the host clock once
patch generation budgets remain declared under delayed callbacks
rendered state identifies the accepted simulation revision and interpolation fraction
built output and Pages use the same clock policy
```

## Boundary

This audit changes documentation only. It does not claim fixed-step implementation, real-time pacing, overload recovery, interpolation, passing tests, artifact parity, Pages parity or production readiness.