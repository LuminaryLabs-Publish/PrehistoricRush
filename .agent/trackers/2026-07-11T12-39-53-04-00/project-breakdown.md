# Project Breakdown: PrehistoricRush Runtime Session Lifecycle

**Timestamp:** `2026-07-11T12-39-53-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

This documentation-only pass selected `PrehistoricRush` as the oldest stable eligible Publish repository after detecting same-window documentation writes in nominal-oldest `IntoTheMeadow`. The audit maps browser startup, retry, RAF, listeners, Worker/executor, patch streaming, Rapier, Three resources and public host exposure into one missing runtime-session authority.

## Plan ledger

**Goal:** document one bounded startup-to-disposal contract without changing runtime behavior.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm nine eligible central ledger entries and root `.agent` folders.
- [x] Avoid concurrent writes in `IntoTheMeadow`.
- [x] Select only `PrehistoricRush`.
- [x] Trace startup, retry, frame, streaming, physics, render and host loops.
- [x] Identify all domains.
- [x] Catalogue all kits and their services.
- [x] Define candidate lifecycle kits and fixture gates.
- [x] Update root `.agent` routing and audits.
- [ ] Runtime implementation remains future work.

## Selection comparison

```txt
IntoTheMeadow       nominal oldest / active same-window docs / skipped
PrehistoricRush      selected stable fallback
MyCozyIsland         tracked
TheOpenAbove         tracked
HorrorCorridor       tracked
PhantomCommand       tracked
ZombieOrchard        tracked
TheUnmappedHouse     tracked
AetherVale           tracked
TheCavalryOfRome     excluded by rule
```

## Interaction loop

```txt
main
  -> load pinned module graph
  -> create engine/product domain
  -> create Rapier adapter and actor
  -> create patch generator
  -> create optional Worker and executor
  -> create patch controller and smooth camera
  -> create Three scene/resources
  -> start run and prime world
  -> attach input/resize callbacks
  -> publish global host
  -> start RAF

frame
  -> input projection
  -> engine tick
  -> patch focus/update/release/pump/activate
  -> physics transform/step/contact checks
  -> pickup/failure mutation
  -> creature pose/camera/light/grass updates
  -> Three render
  -> HUD projection
  -> next RAF

retry
  -> game.start
  -> prime existing controller
  -> reset existing camera
  -> no new session/stream epoch

termination
  -> no explicit stop/dispose transaction
```

## Domains in use

```txt
page routing and profile lifecycle
module loading and pinned dependency identity
Nexus Engine composition
product run lifecycle and gameplay
procedural creature generation and binding
Rapier physics runtime
seeded patch generation, Worker execution and controller cache
terrain/tree/grass/shard/collider/height consumers
browser input and focus handling
RAF clock and scheduling
camera damping and transform application
Three scene/resource/render ownership
HUD and public host projection
validation and Pages deployment
```

## Complete kit and service inventory

### Nexus Engine core kits

```txt
core-input-kit: actions, bindings, input state
core-spatial-kit: transforms and spatial queries
core-scene-kit: scene registry and transitions
core-physics-kit: physics capability contract
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
seed-kit: deterministic seed/random streams
procedural-creature-body-kit: recipe, geometry, topology, skeleton, skinning,
  attachments, collision, bounds, poses, content hash, snapshots/load/reset
instanced-render-batch-kit: capacity, replace/release, flush, overflow, bounds,
  stats and snapshots
seeded-world-patch-controller-kit: patch identity/cache/focus/desired sets,
  queue, executor, ready/release delivery, budgets, eviction and snapshots
camera-smooth-follow-kit: position/look/quaternion damping, reset, teleport,
  delta clamp, transform access and snapshots
```

### Product and page kits

```txt
prehistoric-rush-domain-kit: run lifecycle, input, route, surface, score,
  outcomes, events, scene transitions, creature access and snapshot
player-character-schema-kit: defaults, normalization, clamps, colors and merge
player-character-profile-store-kit: load/save/patch/reset/subscribe/sync/close
menu-page-kit: menu shell, profile projection and navigation
character-creator-page-kit: draft, controls, preview, debounce, reset and sync
game-page-entry-kit: 3D runtime entry
drunk-route-generator: route samples, nearest/progress/region queries, snapshot
player-raptor-preset-kit: static recipe and collision config
prehistoric-patch-generator: terrain, trees, grass, pickups, colliders,
  bounds and transferables
prehistoric-patch-worker: init, generation, errors and transferable delivery
```

### External and host kits/services

```txt
rapier-physics-domain-kit: world bridge, actor, fixed colliders, transforms,
  step and contacts
Three.js runtime: scene, geometry, materials, instancing, skinning, camera,
  lights, fog, shadows, renderer and GPU resources
Rapier runtime module: physics runtime
module-worker-executor-adapter-kit: request correlation and async generation
terrain-slot-consumer-kit
tree-instance-batch-consumer-kit
grass-patch-consumer-kit
shard-pickup-consumer-kit
patch-collider-consumer-kit
patch-height-sampler-kit
three-procedural-creature-adapter-kit
creature descriptor/geometry/skeleton/collision/pose binding kits
camera/light/shadow/grass/render/HUD/host kits
```

## Main findings

```txt
startup transaction: absent
cleanup stack: absent
runtime session ID: absent
lifecycle phase: absent
RAF lease: absent
listener leases: absent
retry run/stream epoch: absent
Worker cancel/shutdown/terminate: absent
executor disposal: absent
stale patch response rejection: absent
Three adapter dispose: absent
Rapier terminal dispose/reset result: absent
public host revocation: absent
idempotent stop/dispose result: absent
```

## Candidate lifecycle kits

```txt
runtime-session-id-kit
runtime-lifecycle-state-kit
runtime-startup-command-kit
runtime-startup-transaction-kit
runtime-cleanup-stack-kit
animation-frame-lease-kit
listener-lease-kit
worker-resource-owner-kit
patch-executor-quarantine-kit
stream-epoch-fence-kit
three-resource-owner-kit
rapier-resource-owner-kit
public-host-lease-kit
ordered-runtime-dispose-kit
startup-rollback-kit
lifecycle-result-kit
lifecycle-journal-kit
lifecycle-observation-kit
runtime-lifecycle-fixture-kit
```

## Required proof

```txt
partial startup rollback
single RAF/listener ownership
retry epoch separation
late Worker response rejection
Worker/executor termination
Three/Rapier resource disposal
host revocation
idempotent repeated dispose
post-dispose command rejection
browser pagehide smoke
```

## Validation

```txt
runtime source changed: no
dependencies changed: no
rendering changed: no
physics changed: no
deployment changed: no
branch created: no
pull request created: no
executable lifecycle fixtures: absent / not run
browser smoke: not run
```
