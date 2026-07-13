# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-13T16-41-10-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Runtime revision reviewed:** `66a219fea4bb886fb4fff41c9b31c67ba7e4eaee`  
**Status:** `non-blocking-pause-menu-command-lifecycle-authority-audited`

## Summary

Two commits after the prior documentation head added a renderer-agnostic, non-blocking pause-menu DSK, installed Core Presentation, split preserved gameplay code into runtime modules and added static/in-memory coverage. The semantic menu state is now bounded, but the browser host still independently owns Escape admission, an unbounded attach poll, a perpetual synchronization RAF, overlay DOM, click listeners and immediate navigation.

The open menu intentionally does not stop simulation. That policy is explicit, but no terminal result correlates menu state, accepted input, overlay revision, retained gameplay input, exit request, browser navigation, host retirement or the first matching visible frame.

## Plan ledger

**Goal:** preserve the intentionally non-blocking pause experience while establishing one command and lifecycle authority from input admission through overlay projection, exit settlement and host retirement.

- [x] Enumerate all ten accessible Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm nine eligible ledger and root `.agent` entries.
- [x] Identify PrehistoricRush as locally ahead of central tracking by two commits.
- [x] Inspect the pause-menu DSK, graph integration, browser host, preserved runtime loop, test and package wiring.
- [x] Identify the complete interaction loop and active domains.
- [x] Update the census to 58 kit, adapter and proof surfaces.
- [x] Add this timestamped audit family.
- [x] Change no runtime, renderer, package or deployment source.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement lifecycle ownership and executable browser/build/Pages fixtures later.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9
root .agent entrypoints: 9
new or ledger-missing repositories: 0
root-agent-missing repositories: 0
locally-ahead repositories: PrehistoricRush

current repo head:      66a219fea4bb886fb4fff41c9b31c67ba7e4eaee
prior documented head:  cb32250321dfefb3a0e60379e7961f6f6e03ac0a
new commits:            2
```

## Runtime changes reconciled

```txt
d633029 feat: add non-blocking pause menu domain
66a219f test: follow preserved gameplay runtime modules
```

Changed surfaces:

```txt
package.json
src/domains/prehistoric-rush/pause-menu-domain-kit.js
src/domains/prehistoric-rush/prehistoric-rush-domain-kit.js
src/domains/prehistoric-rush/prehistoric-rush-domain-runtime.js
src/game-runtime.js
src/game.js
tests/pause-menu-authority.mjs
tests/player-pose-authority.mjs
```

## Complete interaction loop

```txt
boot
  -> public entry removes legacy HUD surfaces
  -> public entry imports preserved game runtime
  -> runtime loads pinned Nexus, kits, Three.js and Rapier
  -> graph installs Core domains, Core Presentation and product pause-menu DSK
  -> runtime starts run, patch streaming and unconditional RAF simulation/render loop
  -> public entry polls by RAF until PrehistoricRushHost is available

pause host attach
  -> resolve engine.n.prehistoricRushPauseMenu
  -> disconnect temporary HUD observer
  -> install Escape key listener
  -> start independent perpetual menu synchronization RAF

Escape or menu command
  -> DSK commits open/view/selectedAction/sequence
  -> DSK emits typed semantic event
  -> DOM host reads state and recreates/removes overlay
  -> gameplay input listeners and engine.tick continue unconditionally

Settings
  -> showSettings commits semantic state
  -> host rebuilds overlay with informational message

Exit
  -> requestExit commits selectedAction=exit and emits one event
  -> host immediately assigns location.href
  -> no exit consumer/result, runtime retirement receipt or visible acknowledgement
```

## Domains in use

```txt
browser module admission, fatal projection, DOM ownership, resize and RAF
browser keyboard/pointer admission and retained gameplay input
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation and Motion
articulated dynamics and articulated motion
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
Core Presentation parent, output policy, UI scaling and camera framing
product run, route, surface, score, outcomes and player pose
product non-blocking pause-menu state, commands, events and snapshot
procedural creature body, player-character composition and persistence
Rapier, route generation, patch streaming, terrain, vegetation, pickups and collisions
Three.js world, camera, creature, HUD and diagnostics presentation
pause overlay DOM projection, browser navigation and lifecycle retirement
validation, build and GitHub Pages deployment
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, references, registry, snapshot and reset
core-character-kit: active character registry, bindings, status, snapshot and reset
core-player-kit: player registry, possession, control and spawn generations
core-physics-kit: provider-backed bodies, motion requests, stepping and frames
articulated-dynamics-domain-kit: articulated physical constraints and provider integration
core-simulation-kit: proposals, observations, resolution and committed frames
core-motion-kit: motion intents, requests and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral graphics descriptors
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation composition graph and snapshots
core-presentation-output-kit: surface input, viewport policy, render resolution and safe area
core-ui-scale-kit: reference resolution, viewport scale and scale policy
core-camera-framing-kit: subject framing, perspective/orthographic fit and damping
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic random streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision and legacy pose
instanced-render-batch-kit: instance allocation, updates, bounds and snapshots
seeded-world-patch-controller-kit: focus, generation, caching, activation and eviction
camera-smooth-follow-kit: damped follow, reset and snapshots
```

### Product, page and Worker kits: 16

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, character/control, pose and ground IK
prehistoric-rush-pause-menu-domain-kit: state, commands and snapshot
prehistoric-rush-resolution-policy: collisions, pickups, goal and transition resolution
player-character-composition-kit: body, rig, creature, character and optional player possession
player-articulation-adapter-kit: legacy-pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: persistence and revision
menu-page-kit: title/menu entry
character-creator-page-kit: editor interaction and preview
character-preview-transition-kit: morph/crossfade preview lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application and disposal
game-page-entry-kit: HUD removal, runtime import and pause host
player-raptor-preset-kit: player creature content
drunk-route-generator: deterministic route queries
prehistoric-patch-generator: terrain, vegetation, pickup and collider generation
prehistoric-patch-worker: patch Worker protocol
```

### External and host adapters: 9

```txt
three-runtime-module
rapier-physics-domain-kit
rapier-runtime-module
message-worker-executor-adapter-kit
active-content-consumer-adapter
creator-viewport-framing-adapter
creator-persistence-scheduler
browser-input-adapter
creature-camera-render-host-adapters
```

### Proof kits: 6

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
```

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        6
total surfaces:                   58
```

## Source-backed findings

```txt
non-blocking menu descriptor: present
non-blocking overlay descriptor: present
Core UI descriptor registration: present
Core Presentation overlay configuration: present
clone-safe state and snapshot: present
open/close/toggle/settings/exit commands: present
idempotent duplicate exit event: present
simulation ticking while open: intentional and present
Escape delegated to DSK: present
settings click delegated to DSK: present
exit click delegated to DSK: present
menu command ID/generation/result: absent
DOM host generation: absent
attach-poll cancellation: absent
menu sync RAF retirement: absent
keydown listener retirement: absent
accepted overlay frame acknowledgement: absent
explicit gameplay-input policy while overlay captures pointer: absent
exit event consumer/settlement result: absent
navigation preparation or cancellation: absent
runtime/worker/render retirement before navigation: absent
first post-command visible-frame acknowledgement: absent
```

## Required authority

```txt
prehistoric-rush-pause-menu-command-lifecycle-authority-domain
```

```txt
PauseMenuCommand
  -> bind runtime, menu and DOM-host generations
  -> admit Escape or click with a command ID and expected sequence
  -> classify Toggle, Open, Close, ShowSettings or RequestExit
  -> publish Accepted, Duplicate, Stale, Failed, Cancelled or Retired
  -> commit one semantic menu revision
  -> project one matching overlay revision
  -> apply an explicit non-blocking gameplay-input policy
  -> acknowledge the first matching visible overlay frame

RequestExit accepted
  -> prepare browser navigation
  -> retire menu poll, sync RAF and listeners
  -> request runtime/worker/render cleanup receipts
  -> publish ExitSettlementResult
  -> navigate only after mandatory retirement or explicit timeout policy
```

## Validation boundary

The source, pinned Core Presentation implementation, static test and package wiring were inspected through GitHub. The current commit reports no combined status checks. `npm test` could not be executed because the available container had no network path to GitHub, and no browser/build/Pages fixture was run. No runtime behavior was changed by this audit.