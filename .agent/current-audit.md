# Current Audit: PrehistoricRush Runtime Session Lifecycle Authority

**Updated:** `2026-07-11T12-39-53-04-00`

## Summary

`PrehistoricRush` constructs one long-lived browser runtime inside `main()`. The function loads pinned modules, creates the Nexus Engine game, Rapier adapter, procedural patch generator, optional Worker, seeded patch controller, smooth camera controller, Three scene/resources, listeners, RAF loop and global host. No object owns the complete startup, retry, stop, failure and disposal lifecycle.

The immediate product priority remains route/profile handoff. This audit establishes the later lifecycle contract so route fixes do not harden an unbounded game host.

## Plan ledger

**Goal:** map every runtime allocation and callback to one session owner, then define startup rollback, retry fencing and ordered idempotent disposal.

- [x] Reconcile the accessible Publish inventory with the central ledger.
- [x] Confirm all eligible repositories have root `.agent` state.
- [x] Avoid concurrent writes in nominal-oldest `IntoTheMeadow`.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Inspect module loading, engine/kit construction and adapters.
- [x] Inspect Worker creation and patch protocol.
- [x] Inspect start/retry, input listeners, RAF and public host exposure.
- [x] Identify domains, kits and offered services.
- [x] Record startup, epoch, resource, callback and disposal gaps.
- [ ] Implement after route/profile authority and patch activation ordering are settled.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledgers: 9/9
root .agent state: 9/9
nominal oldest: IntoTheMeadow
concurrency decision: skipped due same-window documentation commits
selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Runtime construction graph

```txt
main()
  load pinned modules
  createRealtimeGame(...)
  resolve product and official kit APIs
  create Rapier world bridge and dino actor
  create synchronous patch generator
  optionally create module Worker + message executor
  create seeded patch controller
  create smooth camera controller
  create Three adapter
    scene
    camera
    renderer
    lights/shadow resources
    terrain geometries/material
    instanced tree geometry/materials
    grass geometry/shaders
    shard geometry/material
    skinned creature geometry/material/skeleton
  start game
  prime patch streaming
  reset camera
  attach browser callbacks
  expose PrehistoricRushHost
  schedule RAF
```

No startup ledger records which resources were acquired. A failure after partial construction reaches the outer catch and replaces body text, but already-created Worker, renderer, GPU resources, physics resources or listeners have no rollback owner.

## Interaction loops

### Run frame

```txt
RAF callback
  -> compute capped dt
  -> project browser input
  -> engine.tick(dt)
  -> controller setFocus/update/pump
  -> release patches
  -> takeReadyPatches and mutate consumers
  -> step physics and inspect contacts
  -> fail or collect shard
  -> update creature pose/camera/light/grass
  -> renderer.render
  -> update HUD
  -> requestAnimationFrame(loop)
```

### Retry

```txt
button, Enter or Space outside active game
  -> start()
  -> game.start()
  -> updateStreaming(currentState, true)
  -> resetCamera(currentState)
```

Retry reuses the same controller, Worker, executor, active/cached patches, Rapier world, fixed colliders, Three resources, RAF callback, listeners, input object, adapter view time and public host.

### Page/runtime termination

```txt
pagehide / beforeunload / explicit stop / dispose
  -> no handler
  -> no lifecycle result
  -> browser eventually destroys document
```

## Domains in use

```txt
page route and profile lifecycle
module graph loading and pinned dependency identity
Nexus Engine composition and product run state
procedural creature descriptor and render/physics bindings
Rapier actor/fixed collider/contact runtime
seeded patch generator, Worker, executor, controller and cache
terrain/tree/grass/shard/collider/height consumers
run start, retry, movement, score and terminal outcomes
browser input and focus lifecycle
RAF clock and frame scheduling
camera damping and transform application
Three resource ownership and render submission
public host/readback and diagnostics
static validation and Pages deployment
```

## Complete kit inventory and services

### Nexus Engine core

```txt
core-input-kit         input actions, bindings and state
core-spatial-kit       transforms and spatial queries
core-scene-kit         scene registry and transitions
core-physics-kit       physics capability contract
core-motion-kit        movement capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        sky descriptor
core-ui-kit            UI capability and projection
core-diagnostics-kit   diagnostics/readback
core-composition-kit   capability graph and composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit
  recipe normalization, geometry, topology, skeleton, skinning,
  attachments, collision recommendation, bounds, poses, content hash,
  snapshots, loading and reset

instanced-render-batch-kit
  capacity, cell replace/release, flush, overflow, bounds, stats and snapshots

seeded-world-patch-controller-kit
  identity, cache, focus, active/retain/prefetch sets, queue, executor,
  ready/release delivery, budgets, eviction and snapshots

camera-smooth-follow-kit
  position/look damping, quaternion damping, reset, teleport handling,
  delta clamp, transform access and snapshots
```

### Product and page kits

```txt
prehistoric-rush-domain-kit
  run lifecycle, input, route, surface, score, outcomes, events,
  scene transitions, creature access and snapshot

player-character-schema-kit
  defaults, normalization, clamps, color validation and merge

player-character-profile-store-kit
  load, save, patch, reset, subscription, storage/BroadcastChannel sync and close

menu-page-kit
  menu shell, profile projection and route links

character-creator-page-kit
  draft editing, controls, preview, debounce save, reset and remote projection

game-page-entry-kit
  existing 3D runtime entry

drunk-route-generator
  deterministic route samples, nearest/progress/region queries and snapshot

player-raptor-preset-kit
  static creature recipe and collision configuration

prehistoric-patch-generator
  terrain, trees, grass, pickups, colliders, bounds and transferables

prehistoric-patch-worker
  initialization, generation, error protocol and transferable delivery
```

### External and host services

```txt
rapier-physics-domain-kit
  world bridge, kinematic actor, fixed colliders, transforms, step and contacts

Three.js runtime
  scene graph, geometry, materials, instancing, skinning, camera, lights,
  fog, shadows, renderer and GPU resources

Worker executor adapter
  request correlation and asynchronous patch generation

host consumers
  terrain slots, tree batches, grass, shards, colliders, height sampler,
  creature binding, pose, camera, lighting, shadows, HUD and public readback
```

## Main findings

### 1. Startup is not transactional

Resources are acquired sequentially with no cleanup stack. The outer catch reports an error but cannot reverse partial Worker, Rapier or Three allocation.

### 2. RAF and listeners are unowned

The RAF request ID is not retained. Every frame schedules the next frame unconditionally. Button, keydown, keyup, blur and resize callbacks have no lease records or removal path.

### 3. Retry is not a new shared epoch

`game.start()` changes product run state, but no session/stream/physics/resource epoch is allocated. Pending asynchronous patch responses can still arrive through the reused controller and executor.

### 4. Worker execution is not quarantined

The created Worker is retained only in `workerState`. Neither `worker.terminate()` nor executor disposal is called. The Worker protocol has no cancel, epoch, shutdown or acknowledgement message.

### 5. Three and Rapier resources have no owner

The adapter returns live scene, camera and renderer references but no `dispose()`. Geometry, materials, shaders, skeleton resources, renderer and physics world are not explicitly released.

### 6. The public host cannot be revoked

`PrehistoricRushHost` exposes live engine, physics, adapter, patch controller and camera controller references. There is no host lease, detached read model or post-dispose invalidation.

### 7. Disposal and stale-call behavior are undefined

There is no lifecycle state machine, idempotent stop/dispose result, post-dispose command rejection, bounded journal or proof that old callbacks cannot mutate a later session.

## Required authority boundary

```txt
PrehistoricRush Browser Runtime Session Authority Domain
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

## Required ordering

```txt
1. admit startup command and allocate session ID
2. create cleanup stack
3. acquire resources and register reverse cleanup immediately
4. publish RUNNING only after required owners are ready
5. route retry through run-session transaction with new run/stream epoch
6. fence or cancel prior asynchronous results
7. stop RAF and input admission before resource disposal
8. revoke public host mutation capability
9. release controller/executor/Worker
10. release physics and Three resources
11. remove listeners and globals
12. publish stable idempotent DISPOSED result
```

## Priority order

```txt
P0 Multi-Page Route Admission + Player Profile Handoff Authority
P1 Seeded Patch Activation Commit Authority
P2 Visual Policy Graph Identity + Render-Frame Correlation
P3 Run Session Reset + Shared Epoch Authority
P4 Browser Runtime Session Lifecycle + Worker/Three/Rapier Disposal
```

No runtime code was changed by this audit.
