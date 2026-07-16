# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-16T02-03-42-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed current repository head:** `07963fd0ebfea6e9abcd6aa595fc91b5b7cd1389`  
**Reviewed runtime source revision:** `4808f05cff438ff5a9d013cd7ddec5127bbcf213`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

The full 11-repository `LuminaryLabs-Publish` inventory was compared with the ten eligible central ledgers. `TheCavalryOfRome` remained excluded. No eligible repository was new, ledger-missing, root-agent-missing, undocumented, or runtime-ahead, so PrehistoricRush was selected by the oldest synchronized timestamp.

PrehistoricRush delegates streamed patch generation to a module Worker through the pinned `seeded-world-patch-controller-kit`. The Worker publishes a ready message and per-request success or error messages, but the active host does not admit readiness, observe `error` or `messageerror`, enforce request deadlines, cancel pending work, restart a failed Worker, switch a live controller to fallback generation, reject stale Worker generations, or dispose the executor during document retirement. The pinned executor only settles promises when a matching response message arrives. A crash, hang, transport failure, or lost response can therefore leave controller records permanently inflight and stop required patches from being generated.

## Plan ledger

**Goal:** establish one bounded patch-worker request authority that proves readiness, settles every admitted request, recovers from Worker failure, and preserves patch-stream continuity.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare all ten eligible repositories against central ledger state.
- [x] Confirm zero new, ledger-missing, root-agent-missing, undocumented, or runtime-ahead priority repositories.
- [x] Select only PrehistoricRush by the oldest synchronized timestamp.
- [x] Trace Worker creation, initialization, request dispatch, controller inflight ownership, patch activation, fallback generation, and document retirement.
- [x] Preserve the complete 66-surface implemented kit and service inventory.
- [x] Define one parent patch-worker authority and 21 coordinating surfaces.
- [x] Add the timestamped root `.agent` audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement and execute Worker readiness, crash, timeout, restart, fallback, retirement, artifact, and Pages fixtures.

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

PrehistoricRush   2026-07-15T20-59-46-04-00 selected
HorrorCorridor    2026-07-15T21-39-15-04-00
TheOpenAbove      2026-07-15T22-00-36-04-00
ZombieOrchard     2026-07-15T22-40-29-04-00
TheUnmappedHouse  2026-07-15T23-00-03-04-00
PhantomCommand    2026-07-16T00-00-40-04-00
AetherVale        2026-07-16T00-26-16-04-00
TheLongHaul       2026-07-16T00-38-29-04-00
MyCozyIsland      2026-07-16T00-59-16-04-00
IntoTheMeadow     2026-07-16T01-38-56-04-00
TheCavalryOfRome  excluded
```

## Complete interaction loop

```txt
menu
  -> restore and display the selected procedural raptor profile
  -> navigate to game or character creator

game boot
  -> preload pinned Nexus Engine, Kits, Three.js, Rapier and ProtoKit modules
  -> construct engine, physics, patch controller, camera and Three.js adapter
  -> create module Worker
  -> post init-patch-worker
  -> create message-worker executor immediately
  -> generate the center patch synchronously
  -> start RAF

streaming frame
  -> player state updates patch-controller focus
  -> controller computes active, retained and prefetched patch sets
  -> controller queues missing patches
  -> controller pump marks records inflight
  -> executor posts generate-patch messages
  -> Worker returns patch-generated or patch-error
  -> controller settles record and exposes ready patch
  -> Three.js adapter activates at most one ready patch
  -> released patch identities retire render and collider ownership

Worker failure path
  -> Worker crashes, hangs, fails transport or loses a response
  -> executor pending promise has no timeout or error-channel settlement
  -> controller record remains inflight
  -> duplicate enqueue is suppressed by inflight ownership
  -> host still reports Worker mode because the Worker object exists
  -> no restart or synchronous fallback is admitted
  -> required patch may never become ready

retirement
  -> route exit, pagehide or document replacement
  -> no executor.dispose() or worker.terminate() call is owned by the host
  -> pending requests and Worker generation have no typed retirement result
```

## Source-backed finding

The active host creates a Worker, posts `init-patch-worker`, and immediately creates the pinned message executor. It never consumes the Worker's `patch-worker-ready` message. The Worker catches generator exceptions and returns `patch-error`, but there is no Worker-level `error` or `messageerror` handling in the host.

The pinned executor stores each request in a `pending` map and removes it only after a matching `patch-generated` or `patch-error` message. It has no deadline, abort signal, Worker error observer, generation identity, or automatic fallback. Its `dispose()` method would reject pending work and terminate the Worker, but the product host never retains the executor separately or calls `dispose()`.

The patch controller marks a record inflight until the executor promise settles. While inflight, the patch cannot be requeued. A promise that never settles therefore creates a persistent liveness failure for that patch identity.

```txt
patch-worker-ready admission: absent
Worker generation identity: absent
Worker readiness result: absent
error event settlement: absent
messageerror settlement: absent
request deadline: absent
request cancellation: absent
pending-count diagnostics: absent
stale response rejection: absent
crash retirement: absent
bounded restart policy: absent
controller inflight requeue: absent
live switch to synchronous fallback: absent
pagehide/route executor disposal: absent
PatchWorkerResult: absent
FirstWorkerReadyAck: absent
FirstRecoveredPatchAck: absent
```

This is a source-backed liveness and lifecycle risk. No Worker crash, hang, structured-clone failure, or visible missing-patch incident was reproduced during this documentation run.

## Domains in use

```txt
browser document, module, Worker, message, error, messageerror, pagehide, visibility, RAF and navigation lifecycle
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
PrehistoricRush run, route, surface, score, outcome, pause, character composition, pose and terrain IK
seeded patch identity, active ring, prefetch ring, cache, queue, inflight ownership, readiness, activation and release
Worker readiness, request identity, deadlines, cancellation, restart, fallback, stale-response rejection, retirement and diagnostics
terrain LOD, Three.js uploads, Rapier colliders, vegetation, pickups, validation, build, Pages and central tracking
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
planned patch-worker authority surfaces: 21
```

## Required authority

`prehistoric-rush-patch-worker-request-liveness-recovery-authority-domain`

```txt
PatchWorkerAdmissionCommand
  -> bind document, runtime, controller, Worker and request generations
  -> create one Worker generation
  -> admit patch-worker-ready before dispatch eligibility
  -> assign request identity, deadline and cancellation ownership
  -> observe message, error and messageerror channels
  -> settle every request as generated, rejected, timed out, cancelled or retired
  -> reject stale responses from replaced Worker generations
  -> release or requeue controller inflight ownership
  -> apply a bounded restart budget
  -> switch to deferred synchronous generation when recovery is exhausted
  -> dispose pending work on pagehide, route exit and runtime replacement
  -> publish PatchWorkerResult and WorkerHealthSnapshot
  -> publish FirstWorkerReadyAck
  -> publish FirstRecoveredPatchAck
```

## Planned patch-worker authority surfaces: 21

```txt
patch-worker-generation-kit
patch-worker-capability-kit
patch-worker-readiness-admission-kit
patch-worker-request-identity-kit
patch-worker-request-deadline-kit
patch-worker-pending-registry-kit
patch-worker-error-observer-kit
patch-worker-messageerror-observer-kit
patch-worker-timeout-settlement-kit
patch-worker-cancellation-kit
patch-worker-crash-retirement-kit
patch-worker-restart-budget-kit
patch-worker-sync-fallback-kit
patch-worker-stale-response-rejection-kit
patch-controller-inflight-requeue-kit
patch-worker-page-lifecycle-kit
patch-worker-health-snapshot-kit
patch-worker-result-kit
first-worker-ready-ack-kit
first-recovered-patch-ack-kit
patch-worker-fault-fixture-kit
```

## Required fixtures

```txt
Worker ready acknowledgement gates first asynchronous request
Worker generator exception settles one request and permits retry
Worker error event rejects all pending requests
messageerror rejects the affected request generation
request timeout releases controller inflight ownership
late response from retired Worker generation is rejected
bounded restart creates a new Worker generation
restart exhaustion switches controller to synchronous fallback
route exit and pagehide dispose pending work and terminate Worker
rapid focus movement does not reactivate stale patch results
Worker health and pending counts appear in public diagnostics
FirstWorkerReadyAck and FirstRecoveredPatchAck bind accepted revisions
npm test
source, built-output and Pages parity
```

## Boundary

Documentation only. No Worker readiness admission, timeout, cancellation, restart, fallback transition, inflight recovery, retirement, artifact parity, Pages parity or production readiness is claimed.