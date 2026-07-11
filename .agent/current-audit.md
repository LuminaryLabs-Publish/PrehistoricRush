# Current Audit: PrehistoricRush

**Updated:** `2026-07-11T05-39-11-04-00`

## Summary

The runtime now installs `camera-smooth-follow-kit` `0.1.0` from pinned `NexusEngine-Kits@5d3613b140ca33395f180acde014c167addf0ccc`, creates one persistent player-camera controller, resets it on initial run/restart/run change, updates it every render frame and applies its position/quaternion to the Three.js camera. This closes the previous immediate rotation-snap defect, but target provenance, transform consumption, frame acknowledgement, public observation and lifecycle ownership remain implicit.

## Plan ledger

**Goal:** Fully catalogue the current game and isolate the missing camera consumption boundary without displacing the higher-priority patch activation transaction.

- [x] Reconcile Publish inventory and central tracking.
- [x] Inspect the current `src/game.js` camera path.
- [x] Inspect `prehistoric-rush-domain-kit` `0.5.0`.
- [x] Inspect pinned `camera-smooth-follow-kit` `0.1.0`.
- [x] Identify interaction loop, domains, kits and services.
- [x] Record deterministic target/update/application gaps.
- [x] Record observation, lifecycle and fixture gaps.
- [ ] Implement camera consumption proof after patch activation P0.
- [ ] Execute Node, browser and Pages validation.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: recent undocumented runtime change before oldest fallback
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Interaction loop

```txt
index.html -> src/runtime.mjs -> src/game.js
  -> load pinned NexusEngine, NexusEngine-Kits, ProtoKits, Three and Rapier
  -> install 12 core kits
  -> install seed, creature, instance-batch, patch-controller and smooth-camera kits
  -> install prehistoric-rush-domain-kit 0.5.0
  -> create patch generator, Worker executor, patch controller and camera controller
  -> start run, prime streaming and reset camera
  -> browser input + engine.tick update run state
  -> patch streaming updates active terrain/height consumers
  -> setCameraTargets derives chase position and route-ahead look point
  -> cameraFollow.reset on run change, otherwise cameraFollow.update
  -> apply position/quaternion to Three PerspectiveCamera
  -> render world, update HUD and expose snapshots
  -> requestAnimationFrame repeats
```

## Domains in use

```txt
runtime module graph and source admission
Nexus Engine core input, spatial, scene, physics, motion, camera, animation,
graphics, skybox, UI, diagnostics and composition
seed and deterministic random streams
procedural creature body, skeleton, skinning, collision and pose
instanced render-batch capacity and cell ownership
seeded patch identity, cache, scheduling, generation, delivery and release
product patch generation and Worker execution
patch-content admission and multi-consumer activation authority
terrain, vegetation, pickup, collider and height consumers
run lifecycle, route, surface, movement, jump, score and outcomes
camera target policy and route-ahead composition
persistent camera SmoothDamp position and look-target state
camera quaternion damping and reset semantics
Three camera transform application and frame rendering
browser input, resize, blur, RAF, HUD and host observation
run/stream/camera session lifecycle
static Pages deployment and validation
```

## Kit inventory and services

### Nexus Engine core kits

```txt
core-input-kit         actions and bindings
core-spatial-kit       transform/query capability
core-scene-kit         scene registry and transitions
core-physics-kit       physics provider contract
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        clear-day sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostics/readback capability
core-composition-kit   composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  body recipes, geometry, topology, skeleton, skinning, attachments,
  collision, poses, content hashes and snapshots

instanced-render-batch-kit
  immutable capacity, cell replace/release, flush, bounds, overflow,
  stats and snapshots

seeded-world-patch-controller-kit 0.1.0
  patch/cache identity, focus, active/retain/prefetch sets, generation queue,
  executor handoff, ready/release delivery, budgets, eviction, stats,
  snapshot/load and reset

camera-smooth-follow-kit 0.1.0
  controller registry, position SmoothDamp, look-target SmoothDamp,
  quaternion rotation damping, reset, teleport reset, delta-time clamp,
  transform access, snapshot/load and service reset
```

### Product and local kits

```txt
prehistoric-rush-domain-kit 0.5.0
  run/input resources, simulation, route, surface, score, outcomes,
  creature access, events, scene transitions and snapshot

drunk-route-generator
  deterministic route samples, nearest query, progress,
  region classification and snapshot

player-raptor-preset-kit
  product creature configuration

prehistoric-patch-generator
  terrain arrays, tree descriptors, grass matrices, pickups,
  colliders, bounds and transferables

prehistoric-patch-worker
  initialization, generation, error protocol and transferable delivery
```

### External and host-implied kits

```txt
rapier-physics-domain-kit
three-runtime-module 0.179.1
rapier-runtime-module 0.15.0
module-worker-executor-adapter-kit
terrain-slot-consumer-kit
tree-instance-batch-consumer-kit
grass-patch-consumer-kit
shard-pickup-consumer-kit
patch-collider-consumer-kit
patch-height-sampler-kit
three-procedural-creature-adapter-kit
prehistoric-camera-target-policy-kit
three-camera-transform-consumer-kit
camera-light-render-adapter-kit
patch-streaming-hud-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

## Current camera configuration

```txt
controller id: prehistoric-rush-player-camera
positionSmoothTime: 0.22
lookSmoothTime: 0.14
maximumPositionSpeed: 45
maximumLookSpeed: 65
rotationSharpness: 12
maximumDeltaTime: 1/30
teleportThreshold: 24
chase distance: 6.6
chase height: 2.35
look-ahead samples: 12
look height above terrain: 1.15
```

## Source revisions

```txt
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: 5d3613b140ca33395f180acde014c167addf0ccc
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
parent domain: prehistoric-rush-domain-kit 0.5.0
camera kit: camera-smooth-follow-kit 0.1.0
renderer label: three-seeded-patch-streaming-smooth-camera-v6
```

## Main findings

### 1. Persistent smoothing is now correctly shared

The host no longer locally lerps only camera position and immediately calls `lookAt()`. The shared controller now persists position velocity, look velocity and quaternion state across frames.

### 2. Target policy has no immutable descriptor

`setCameraTargets()` mutates two shared arrays from run position/yaw, route index and `sampleHeight()`. It does not publish target ID, run ID, simulation frame, patch/height revision or content fingerprint.

### 3. Transform application has no result

`applyCameraTransform()` writes position and quaternion into the live Three camera and returns nothing. There is no accepted/rejected result, applied controller revision or transform fingerprint.

### 4. Render consumption is unacknowledged

`renderer.render(scene, camera)` does not record which target/controller/application revision was consumed by the frame.

### 5. Public control-plane references remain mutable

`PrehistoricRushHost` exposes `adapter` and `cameraFollow`, allowing external callers to reset, update or load snapshots outside run/session admission.

### 6. Controller lifecycle is unowned

The service can remove controllers, but the product never calls `remove()`. RAF, listeners, renderer and Worker also remain without an ordered teardown owner.

### 7. Integration fixtures are absent

No executable proof covers run restart reset, route-index discontinuity, patch-height changes, frame stalls, teleport threshold, quaternion normalization, deterministic convergence or render-frame correlation.

## Priority order

```txt
P0 patch-content admission and acknowledged multi-consumer activation/release
P1 camera target descriptor and transform/frame consumption proof
P2 run-session reset with stream and camera epochs
P3 Worker inflight/stale-result authority
P4 lifecycle ownership and committed-frame observation
P5 creature, core-kit and typed-command proof
```

## Validation status

Documentation only. Runtime behavior was not changed. Source inspection verified the current pinned graph and camera path. The repository has no root `package.json`; camera integration fixtures and browser/Pages smoke are absent and were not run.
