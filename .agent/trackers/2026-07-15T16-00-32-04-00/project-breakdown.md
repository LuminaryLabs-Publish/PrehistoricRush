# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-15T16-00-32-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed current repository head:** `1e947c398512806e2236d07d9d64fae1cccd6677`  
**Reviewed runtime source revision:** `4808f05cff438ff5a9d013cd7ddec5127bbcf213`  
**Status:** `accessible-gameplay-projection-focus-authority-audited`

## Summary

PrehistoricRush was selected after the full 11-repository Publish inventory was compared with the ten eligible central ledgers and current root `.agent` states. `TheCavalryOfRome` remained excluded. Every eligible repository head matched its documented repo-local head, and PrehistoricRush had the oldest synchronized ledger timestamp.

The active game visually updates run status, distance, shards, speed, terrain and progress every RAF callback, but the status container is an ordinary `div`, the progress bar is visual-only, and terminal state changes are not projected through a stable live region. The pause overlay has an accessible label but no dialog role, initial-focus policy, containment, background inertness or explicit focus restoration.

## Plan ledger

**Goal:** give keyboard and assistive-technology users a stable semantic projection of run state, progress, outcomes and pause-menu focus without moving gameplay truth into the DOM.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and ten root `.agent` states.
- [x] Compare every eligible current head with its recorded repo-local documentation head.
- [x] Confirm zero new, ledger-missing, root-agent-missing, undocumented or runtime-ahead eligible repositories.
- [x] Select only PrehistoricRush by the oldest synchronized central timestamp.
- [x] Trace menu, game boot, keyboard input, visual status, progress, terminal state and pause-overlay projection.
- [x] Preserve all 66 existing source-backed kits, adapters and proof surfaces.
- [x] Define one accessibility authority with 21 coordinating surfaces.
- [x] Add the timestamped tracker and focused audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement and execute keyboard, semantic-tree, live-region, pause-focus, artifact and Pages fixtures.

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
prior central timestamp: 2026-07-15T10-58-45-04-00
next oldest: LuminaryLabs-Publish/HorrorCorridor at 2026-07-15T11-39-04-04-00
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Complete interaction loop

```txt
menu
  -> load the selected procedural raptor profile
  -> expose Start Run and Character Creator links

game boot
  -> load pinned Nexus Engine, kits, Three.js and Rapier
  -> create the engine, physics provider, patch controller, camera and render adapter
  -> create a visual status div and one primary action button
  -> start the run and RAF loop

active run
  -> keyboard or button submits steer, boost, jump, start or retry intent
  -> engine simulation settles movement, physics, pickups, distance and outcome
  -> patch streaming and Three.js render the accepted state
  -> plain DOM status HTML and a visual progress strip are replaced every RAF
  -> no state-bound live announcement or semantic progress result is published

pause
  -> Escape toggles pause state
  -> a labeled section and buttons are appended
  -> no dialog role, initial focus, containment, inert background or restoration result is published
  -> overlay removal disconnects its controls without an explicit focus settlement
```

## Source-backed accessibility finding

```txt
game root accessible name: present
menu navigation links: present
primary game action button: present
run status role=status: absent
stable live region: absent
semantic progressbar role/value: absent
meaningful-change announcement policy: absent
terminal outcome announcement: absent
pause dialog role: absent
aria-modal accepted state: absent
initial pause focus: absent
focus containment: absent
background inertness: absent
focus restoration: absent
AccessibleGameplayProjectionResult: absent
FirstAccessibleGameplayFrameAck: absent
```

The source proves that visual state is updated without these semantic and focus authorities. It does not prove a specific screen-reader symptom because no browser accessibility-tree or assistive-technology fixture was executed.

## Domains in use

```txt
browser document lifecycle, RAF, performance clock, keyboard input, blur, resize, Worker, storage and navigation
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
PrehistoricRush run, route, surface, score, outcome, pause, player composition, pose and terrain IK
semantic gameplay status, progress, outcome announcements, dialog projection and focus lifecycle
patch generation, schema, queue, cache, Worker execution, adoption and release
terrain LOD policy, Three.js scene/material/geometry/instancing and Rapier synchronization
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
prehistoric-patch-generator: terrain fields, trees, grass, pickups and colliders
prehistoric-patch-worker: Worker initialization, request, transfer and result protocol
```

### External, host and renderer adapters: 14

```txt
three-runtime-module: scene, resources and render submission
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling and disposal
three-patch-stream-adapter-kit: terrain, patch-world content, collider, pickup, height, camera and ownership services
terrain-lod-geometry-adapter: topology, per-level indices, skirts, UVs, morph offsets and bounds
three-clay-surface-texture-adapter: deterministic normal and roughness generation, setup and disposal
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
planned accessibility authority surfaces: 21
```

## Required authority

`prehistoric-rush-accessible-gameplay-projection-focus-authority-domain`

```txt
AccessibleGameplayProjectionCommand
  -> bind document, run, committed-frame, outcome, pause and projection revisions
  -> derive one semantic gameplay snapshot from accepted engine state
  -> update status only on meaningful state changes
  -> expose distance progress with role, minimum, maximum and current value
  -> announce start, retry, win and run-over transitions exactly once
  -> open pause through an accepted dialog and focus policy
  -> capture prior focus, focus the authored first action and contain keyboard navigation
  -> make the background non-interactive while the dialog is active
  -> restore an accepted target when the dialog closes or retires
  -> publish AccessibleGameplayProjectionResult
  -> publish FirstAccessibleGameplayFrameAck
```

## Required fixtures

```txt
keyboard-only start, jump, retry and pause completion
accessibility tree exposes named status, progress and pause dialog
rapid RAF updates do not create announcement spam
run-over and win are announced once per accepted transition
pause opens with focus on the authored action
Tab and Shift+Tab remain within the active pause dialog
Escape closes and restores the prior accepted focus target
removed or invalid prior targets use a declared fallback
source, built output and Pages expose the same semantic contract
```

## Boundary

Documentation only. No semantic runtime projection, live announcements, progressbar semantics, pause-focus behavior, accessibility-tree fixture, assistive-technology verification, artifact parity, Pages parity or production readiness is claimed.