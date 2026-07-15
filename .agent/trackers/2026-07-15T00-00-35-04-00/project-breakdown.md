# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-15T00-00-35-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Repository head before audit:** `3c24168f2b977bea463c5c4ac3bcb243aa811639`  
**Runtime source revision retained:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `game-feedback-control-surface-admission-authority-audited`

## Summary

PrehistoricRush creates a DOM feedback panel containing run status, progress, shard count, speed, streaming diagnostics, and the primary Jump/Retry/Run Again button. The active page wrapper then removes every `aside` under `#app`, observes future additions, and removes the runtime panel because it is also an `aside`.

The WebGL game and keyboard controls continue, but the status/action surface becomes detached while the render loop keeps updating it. This leaves no visible or semantic run feedback, no pointer/touch jump control, and no visible terminal retry control outside the non-blocking pause overlay.

## Plan ledger

**Goal:** replace selector-based HUD deletion with one explicit feedback-surface policy that preserves the intended low-UI presentation while guaranteeing accessible status, pointer/touch control, terminal actions, and first-frame evidence.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Compare every eligible repository head with its documented head.
- [x] Confirm no new, ledger-missing, root-agent-missing, or runtime-ahead repository.
- [x] Select only PrehistoricRush by the oldest synchronized central timestamp.
- [x] Trace `game.html`, page preflight, the wrapper, runtime shell, feedback updates, pause host, and current tests.
- [x] Preserve the complete 59-surface kit and service inventory.
- [x] Add this timestamped tracker and focused audit family.
- [x] Change no runtime, HTML, gameplay, renderer, package, test, workflow, or deployment source.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement feedback-surface admission and executable browser fixtures later.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
runtime-ahead: 0

last documented timestamps:
  PrehistoricRush   2026-07-14T18-58-04-04-00
  TheLongHaul       2026-07-14T19-39-36-04-00
  MyCozyIsland      2026-07-14T20-05-56-04-00
  IntoTheMeadow     2026-07-14T20-40-50-04-00
  HorrorCorridor    2026-07-14T20-58-46-04-00
  ZombieOrchard     2026-07-14T21-41-41-04-00
  TheUnmappedHouse  2026-07-14T22-01-31-04-00
  TheOpenAbove      2026-07-14T22-39-00-04-00
  AetherVale        2026-07-14T23-00-09-04-00
  PhantomCommand    2026-07-14T23-38-29-04-00

selected: LuminaryLabs-Publish/PrehistoricRush
rule: oldest synchronized eligible repository
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
menu or creator
  -> choose or edit the procedural player profile
  -> persist the normalized profile
  -> navigate to game.html

game route
  -> src/pages/game.js preflights pinned runtime modules
  -> src/game.js removes every existing aside under #app
  -> src/game.js observes #app and removes every newly added aside
  -> game-runtime shell appends WebGL host plus an aside status/action panel
  -> the observer removes the runtime panel
  -> runtime composes Core and product domains and starts run N
  -> wrapper detects the pause-menu domain
  -> wrapper disconnects the observer and removes every remaining aside again
  -> wrapper installs the visible non-blocking pause overlay

active frame
  -> keyboard input drives steer, boost, jump, start, and retry
  -> simulation, physics, streaming, camera, and Three.js render advance
  -> detached status node receives status/progress/diagnostic HTML
  -> detached action button receives Jump/Retry/Run Again text
  -> no accepted visible or semantic feedback result is published
```

## Domains in use

```txt
browser document, navigation, module preflight, keyboard, blur, resize, MutationObserver, and RAF lifecycle
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition, and Presentation
product run, route, surface, score, outcome, pause, player composition, pose, and terrain IK
feedback-surface ownership, semantic status, action routing, accessibility, pointer/touch control, and terminal presentation
profile schema, persistence, creator preview, deterministic seed, procedural creature, instancing, patch streaming, Worker, Rapier, and camera follow
Three.js terrain, vegetation, pickups, player, camera, feedback nodes, pause overlay, and terminal presentation
validation, static hosting, build, Pages, and central audit tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings, and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, references, registry, snapshot, and reset
core-character-kit: character registry, bindings, status, snapshot, and reset
core-player-kit: player registry, possession, control, and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping, and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution, and committed frames
core-motion-kit: motion intents, requests, and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve, and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral graphics descriptors
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
procedural-creature-body-kit: geometry, skeleton, skinning, collision, descriptors, and legacy pose
instanced-render-batch-kit: batch registry, stable ranges, cell membership, flush, and diagnostics
seeded-world-patch-controller-kit: focus, desired sets, generation queue, cache, adoption, release, and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta, and snapshots
```

### Product, page, and Worker kits: 16

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose, and ground IK
prehistoric-rush-pause-menu-domain-kit: pause state, commands, events, and snapshot
prehistoric-rush-resolution-policy: movement, collision, pickup, goal, and transition resolution
player-character-composition-kit: body, rig, creature, character, and possession
player-articulation-adapter-kit: legacy-pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: localStorage, revision, BroadcastChannel, and storage events
menu-page-kit: title, selected-profile projection, and navigation
character-creator-page-kit: controls, draft state, reset, external updates, and preview startup
character-preview-transition-kit: morph, crossfade, pose, and resource lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application, and disposal
game-page-entry-kit: dependency preflight, runtime entry, feedback cleanup, and pause host
player-raptor-preset-kit: authored player creature content
drunk-route-generator: deterministic control points, samples, nearest query, classification, and progress
prehistoric-patch-generator: terrain, trees, grass, pickups, and colliders
prehistoric-patch-worker: Worker initialization, request, and result protocol
```

### External and host adapters: 9

```txt
three-runtime-module: scene, resource, and render submission primitives
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling, and disposal
three-patch-stream-adapter-kit: patch presentation, colliders, pickups, height, camera, and ownership
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: debounced profile writes
browser-input-adapter: keyboard, blur, jump, boost, steer, start, and restart projection
creature-camera-render-host-adapters: pose, camera, feedback, and diagnostics projection
```

### Proof kits: 7

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
```

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        7
total implemented surfaces:       59
planned feedback authority:       21
```

## Source-backed findings

```txt
game route preflight: present
runtime WebGL host: present
runtime status/action aside: present
per-frame status and progress projection: present
Jump/Retry/Run Again button: present
selector-based removal of all asides: present
MutationObserver removal of future asides: present
second removal after pause-domain discovery: present
visible non-blocking pause overlay: present
keyboard gameplay controls: present

stable FeedbackSurfaceDescriptor: absent
surface-specific suppression identity: absent
semantic run-status region: absent
pointer/touch gameplay control after suppression: absent
visible terminal result/action after suppression: absent
typed FeedbackSurfaceAdmissionResult: absent
surface revision in public readback: absent
FirstFeedbackSurfaceFrameAck: absent
browser DOM, keyboard, pointer, touch, and Pages fixtures: absent
```

## Main architecture finding

The wrapper deletes UI by element type rather than by an owned presentation identity. `removeLegacyHud()` removes every `aside`, and the observer applies that rule to future descendants. The runtime shell's status/progress/action panel is itself an `aside`, so it is removed even though the runtime retains references and continues updating it.

The current behavior can be an intentional low-UI presentation only if an accepted policy explicitly preserves alternative semantic feedback and action access. No such policy, result, or first-frame acknowledgement exists.

## Required authority

```txt
prehistoric-rush-game-feedback-control-surface-admission-authority-domain
```

```txt
FeedbackSurfaceAdmissionCommand
  -> bind route, run, presentation, viewport, and feedback-policy revisions
  -> resolve stable surface and action descriptor identities
  -> classify each surface as visible, visually hidden, replaced, or retired
  -> reject selector-wide deletion without owned identities
  -> require an accessible status projection for active and terminal states
  -> require keyboard plus pointer/touch access to admitted actions
  -> prepare DOM, input-routing, diagnostics, and public-readback candidates
  -> atomically adopt one feedback generation or preserve the predecessor
  -> publish FeedbackSurfaceAdmissionResult and participant receipts
  -> render the accepted strategy
  -> publish FirstFeedbackSurfaceFrameAck
```

## Validation boundary

This is a documentation-only audit. Source inspection verified the game-route import chain, selector-based `aside` removal, runtime feedback-panel creation, per-frame detached-node updates, keyboard controls, and pause-overlay installation. No runtime, HTML, gameplay, renderer, package, test, workflow, or deployment source changed.

`npm test`, browser DOM attachment checks, keyboard/pointer/touch fixtures, terminal-action fixtures, accessibility-tree checks, built-output inspection, and GitHub Pages proof were not executed.
