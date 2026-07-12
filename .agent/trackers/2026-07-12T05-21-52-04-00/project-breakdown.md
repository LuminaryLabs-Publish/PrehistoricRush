# Project Breakdown: PrehistoricRush Input Command Admission

**Timestamp:** `2026-07-12T05-21-52-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` installs Nexus Engine input capability, but the active browser game bypasses it with global keyboard listeners, a mutable host-side input object, direct product-domain calls and per-frame copying. Keyboard and button ingress do not share one command policy: Enter restarts even during active gameplay, repeated keydown events are not rejected, and held Space can re-arm jump after the simulation clears the prior jump pulse.

## Plan ledger

**Goal:** define one browser-to-engine input authority that distinguishes edge actions from held controls, enforces phase and run admission, rejects repeat/stale observations and correlates accepted commands with the simulation step and visible frame that consumed them.

- [x] Compare the complete Publish inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central tracking and root `.agent` state.
- [x] Select only `PrehistoricRush` as the oldest eligible central entry.
- [x] Trace keyboard, button, blur, mutable input, product-domain input and RAF consumption.
- [x] Identify the interaction loop, domains, all implemented kits and offered services.
- [x] Confirm Enter bypasses active-run admission.
- [x] Confirm browser key repeat is not classified or rejected.
- [x] Confirm Space mixes edge semantics with repeated browser observations.
- [x] Confirm the installed core input capability is not the active browser ingress owner.
- [x] Define input command, admission, edge/hold, retirement, step and frame contracts.
- [x] Add timestamped architecture and system audits.
- [x] Refresh required root `.agent` files and kit registry.
- [ ] Runtime implementation and executable input fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush    2026-07-12T03-51-15-04-00  selected
TheOpenAbove       2026-07-12T04-00-32-04-00
IntoTheMeadow      2026-07-12T04-11-54-04-00
PhantomCommand     2026-07-12T04-18-44-04-00
HorrorCorridor     2026-07-12T04-28-03-04-00
ZombieOrchard      2026-07-12T04-38-12-04-00
TheUnmappedHouse   2026-07-12T04-44-36-04-00
AetherVale         2026-07-12T04-50-41-04-00
MyCozyIsland       2026-07-12T05-00-19-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` is changed by this Publish-side audit.

## Complete interaction loop

```txt
menu/profile
  -> creator or gameplay page

creator
  -> module admission
  -> draft controls and procedural preview
  -> profile persistence and page transition

game startup
  -> load pinned Nexus Engine, kit, ProtoKit and Three modules
  -> create engine graph, product domain, Worker/fallback generator,
     patch controller, Rapier adapter, camera follow and Three adapter
  -> call game.start()
  -> prime streaming and camera

browser input
  -> button click reads current game status
  -> keydown observes Enter, A/D, arrows, W and Space
  -> keyup clears held browser flags
  -> blur clears held browser flags and product-domain input

RAF
  -> copy host-side steer and boost flags into product InputState
  -> engine.tick(dt)
  -> product system consumes steer/boost/jump
  -> jump pulse is cleared inside the simulation system
  -> streaming, collision, shard collection, render and HUD

terminal/restart
  -> button starts only outside active gameplay
  -> Enter calls start unconditionally
  -> Space starts outside gameplay or submits jump during gameplay
```

## Source-backed input findings

### Split ingress policy

```txt
button during game: jump
button outside game: start
Enter during game: start/reset
Enter outside game: start
Space during game: jump
Space outside game: start
```

The button path checks current status before choosing jump or start. The Enter path does not check status and therefore resets an active run.

### Repeat semantics

```txt
event.repeat inspected: no
start command id: no
jump press sequence: no
jump release requirement: no
accepted edge receipt: no
```

A held Enter can repeatedly call `start()`, incrementing `runId`, replacing run and input resources, re-priming streaming and resetting the camera. A held Space can receive repeated `keydown` observations; because the simulation clears `input.jump` after consumption, a later repeat can re-arm jump without a key release.

### Duplicate input owners

```txt
installed core-input-kit: yes
browser ingress routed through core input API: no
host-side mutable held state: yes
product-domain InputState: yes
per-frame host-to-domain copy: yes
```

No input sample, command, run revision, frame ID or simulation-step receipt connects browser observations to state mutation.

## Domains in use

```txt
page routing and profile lifecycle
creator draft, preview, persistence and transition
runtime source identity, import maps and module loading
Nexus Engine composition and 12 core capabilities
five official NexusEngine-Kits
browser keyboard, button, focus and resize observation
host-side held input state
product-domain input, run, movement, jump and outcome mutation
Worker patch generation, streaming and active membership
terrain, vegetation, shards, colliders and height
Rapier and fallback collision
camera follow and Three rendering
HUD, transitions and public host readback
validation, static deployment and Pages
browser input observation, command admission, edge/hold semantics,
retirement, step consumption and frame proof: missing
```

## Implemented kits and offered services

### Nexus Engine core kits

```txt
core-input-kit: actions, bindings, input state
core-spatial-kit: transforms, spatial queries
core-scene-kit: scene registry, transitions, host descriptor
core-physics-kit: physics provider contract
core-motion-kit: motion capability
core-camera-kit: camera capability
core-animation-kit: animation capability
core-graphics-kit: graphics and frame capability
core-skybox-kit: sky descriptor
core-ui-kit: UI capability and projection
core-diagnostics-kit: diagnostics and readback
core-composition-kit: capability graph and composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit: deterministic seed and random streams
procedural-creature-body-kit: normalized body, geometry, skeleton,
  skinning, collision, poses, snapshots and content hash
instanced-render-batch-kit: cell replace/release, flush, overflow,
  bounds, statistics and snapshots
seeded-world-patch-controller-kit: identity, focus, membership, cache,
  queue, executor, delivery, budgets, eviction, reset and snapshots
camera-smooth-follow-kit: damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit: run, input, movement, route, surface,
  score, shard mutation, outcomes, events, transitions and snapshots
player-character-schema-kit: defaults, normalization, clamps and merge
player-character-profile-store-kit: load, save, patch, reset, revisions,
  storage synchronization and BroadcastChannel
menu-page-kit: menu shell, profile projection and routes
character-creator-page-kit: controls, draft, save scheduling, reset,
  projection, showcase, resize and RAF
character-preview-transition-kit: descriptor target, morph, crossfade,
  pose damping, revision and disposal
three-procedural-creature-adapter-kit: SkinnedMesh, geometry, materials,
  opacity, poses and disposal
game-page-entry-kit: browser runtime loading
drunk-route-generator: samples, nearest, progress, classification and snapshot
player-raptor-preset-kit: creature recipe and capsule collision
prehistoric-patch-generator: terrain, trees, grass, shards, colliders,
  bounds and transferables
prehistoric-patch-worker: initialization, generation, request/error protocol
  and transferable delivery
```

### External and host adapters

```txt
Three runtime: scene, geometry, materials, instancing, camera, lighting,
  resize and rendering
rapier-physics-domain-kit: world bridge, actor, colliders, step, contacts and reset
Rapier runtime: bodies, colliders, queries and world step
message Worker executor: request correlation and async generation
active-content consumer: patch membership, shard/collider projection and height
creator viewport framing: bounds, target and camera distance
creator persistence scheduler: timer replacement and profile commit
browser input adapter: keyboard/button/blur observation and mutable held flags
creature/camera/render host: creature, collision, pickup scan, camera,
  lighting, HUD and host readback
```

## Required parent domain

```txt
prehistoric-rush-input-command-authority-domain
```

```txt
browser observation
  -> canonical input sample with source, code, phase and repeat evidence
  -> edge/hold classification
  -> runtime/run/state-revision admission
  -> command identity and duplicate handling
  -> one authoritative input state owner
  -> simulation-step consumption result
  -> focus/visibility retirement result
  -> command/state/frame correlation
  -> detached observation and bounded journal
```

## Candidate kits

```txt
input-source-descriptor-kit
input-sample-id-kit
input-sample-observation-kit
input-code-normalization-kit
input-repeat-classification-kit
input-action-policy-kit
input-edge-state-kit
input-hold-state-kit
input-command-kit
input-command-id-kit
input-command-admission-kit
run-start-command-adapter-kit
jump-command-adapter-kit
steer-hold-adapter-kit
boost-hold-adapter-kit
input-command-idempotency-kit
input-focus-retirement-kit
input-visibility-retirement-kit
core-input-browser-adapter-kit
input-step-consumption-result-kit
input-frame-correlation-kit
input-observation-kit
input-journal-kit
active-run-enter-rejection-fixture-kit
key-repeat-start-idempotency-fixture-kit
jump-press-release-fixture-kit
focus-visibility-retirement-fixture-kit
button-keyboard-parity-fixture-kit
browser-input-frame-smoke-kit
```

## Required invariants

```txt
Enter cannot replace an active run unless an explicit restart command is admitted.
One physical press produces at most one edge action.
A held key cannot synthesize new press edges through browser repeat.
Held steer and boost state retires on release, blur, visibility loss, reset and disposal.
Button and keyboard paths use the same semantic command policy.
The installed core input capability is the authoritative engine-facing owner.
Every accepted input command identifies the run and simulation step that consumed it.
Public readback never exposes mutable input owners as unrestricted command surfaces.
```

## Validation boundary

This run changes documentation only. No runtime input behavior, gameplay, renderer, Worker, physics, dependency or deployment file is modified. No browser or Pages input fixture is executed.