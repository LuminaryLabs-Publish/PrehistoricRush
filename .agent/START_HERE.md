# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T12-39-53-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` is a multi-page browser product with a menu, character creator, shared profile store and the existing Nexus Engine 3D runner. Route/profile handoff remains P0, but the current game host also has no runtime-session owner: `main()` allocates the engine, patch controller, Worker, Rapier adapter, Three renderer, resources, listeners, RAF loop and public host without one startup transaction or terminal disposal path.

Retry calls `game.start()`, primes streaming and resets the camera, but it does not allocate a new shared session/stream epoch, cancel pending Worker work, clear controller delivery, reset physics contacts, clear every input latch or retire old callbacks. Page exit and startup failure also have no ordered rollback.

## Plan ledger

**Goal:** preserve route/profile authority as P0 while documenting the exact runtime lifecycle needed to make start, retry, page exit and failure bounded, epoch-fenced and disposable.

- [x] Compare the complete accessible `LuminaryLabs-Publish` inventory with central tracking.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` state.
- [x] Detect same-window documentation writes on nominal-oldest `IntoTheMeadow`.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` as the oldest stable fallback.
- [x] Inspect `src/game.js`, Worker creation, retry, streaming, listeners, RAF, public host and patch worker protocol.
- [x] Identify the interaction loop, domains, kits and services.
- [x] Add timestamped lifecycle, architecture, render, gameplay, interaction and deployment audits.
- [x] Change documentation only and push directly to `main`.
- [ ] Implement route/profile authority before lifecycle implementation changes.
- [ ] Add lifecycle fixtures before claiming restart or teardown safety.

## Selection result

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
nominal oldest: IntoTheMeadow
nominal oldest status: active same-window documentation writes
selected stable fallback: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is changed in the Publish organization during this pass.

## Current runtime loop

```txt
page module import
  -> main()
  -> load pinned Nexus Engine, Kits, ProtoKits, Three and Rapier
  -> create engine and product domain
  -> create Rapier adapter and actor
  -> create patch generator and optional module Worker
  -> create seeded patch controller
  -> create smooth camera controller
  -> create Three scene, renderer, geometry, materials and resources
  -> game.start()
  -> prime patch streaming
  -> reset camera
  -> attach button, keydown, keyup, blur and resize callbacks
  -> requestAnimationFrame(loop)

loop
  -> project browser input into game
  -> engine.tick(dt)
  -> update patch controller
  -> release and activate world patches
  -> step Rapier and inspect contacts
  -> apply pickups/failure
  -> update creature pose, camera, lighting and grass
  -> renderer.render(scene, camera)
  -> update HUD
  -> requestAnimationFrame(loop)

retry
  -> game.start()
  -> updateStreaming(..., true)
  -> resetCamera(...)
  -> existing Worker/controller/physics/resources/listeners/RAF remain live
```

## Main findings

```txt
runtime session ID: absent
lifecycle state machine: absent
startup transaction and rollback: absent
retained RAF request ID: absent
listener lease/removal records: absent
pagehide/unload disposal: absent
Worker termination: absent
executor disposal retention: absent
stream epoch fence for prior-run results: absent
Rapier terminal disposal: absent
Three geometry/material/renderer disposal: absent
public host lease/revocation: absent
idempotent stop/dispose result: absent
post-dispose command rejection: absent
```

`createWorkerExecutor()` returns both executor and Worker, but neither is disposed. The Worker protocol supports only initialization and generation. The RAF loop always schedules another frame, all listeners are anonymous, and `PrehistoricRushHost` exposes live mutable owners.

## Domains in use

```txt
multi-page route hosting and profile projection
player-character schema, persistence and cross-context synchronization
Nexus Engine core composition and product run domain
procedural creature generation, skinning, pose and collision descriptors
Rapier actor, fixed colliders, transforms, step and contacts
seeded patch generation, Worker execution, cache and activation
terrain, trees, grass, pickups, colliders and height sampling
run start/retry, movement, jump, score and outcomes
input callbacks, RAF scheduling and browser lifecycle
camera target policy and smooth follow
Three scene/resources, lighting, shadows, rendering and HUD
public host/readback, validation and Pages deployment
```

## Kits and services

Current source-backed inventory remains:

```txt
12 Nexus Engine core kits
5 official NexusEngine-Kits
prehistoric-rush-domain-kit
player-character schema/profile/menu/creator/game-page kits
drunk-route-generator
player-raptor-preset-kit
prehistoric-patch-generator
prehistoric-patch-worker
rapier-physics-domain-kit
Three and Rapier runtime modules
Worker executor adapter
terrain/tree/grass/pickup/collider/height consumers
creature descriptor/geometry/skeleton/collision/pose adapters
camera/light/shadow/grass/render/HUD/host services
```

New lifecycle candidate kits:

```txt
runtime-session-id-kit
runtime-lifecycle-state-kit
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
lifecycle-journal-kit
lifecycle-observation-kit
runtime-lifecycle-fixture-kit
```

## Priority order

```txt
P0 Multi-Page Route Admission + Player Profile Handoff Authority
P1 Seeded Patch Activation Commit Authority
P2 Visual Policy Graph Identity + Render-Frame Correlation
P3 Run Session Reset + Shared Epoch Authority
P4 Browser Runtime Session Lifecycle + Worker/Three/Rapier Disposal
```

P3 and P4 should share one session identity and cleanup stack. Do not create separate run, Worker and renderer lifecycle systems.

## Read this pass first

```txt
.agent/trackers/2026-07-11T12-39-53-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T12-39-53-04-00.md
.agent/architecture-audit/2026-07-11T12-39-53-04-00-runtime-session-lifecycle-dsk-map.md
.agent/render-audit/2026-07-11T12-39-53-04-00-resource-frame-disposal-gap.md
.agent/gameplay-audit/2026-07-11T12-39-53-04-00-retry-stale-worker-session-loop.md
.agent/interaction-audit/2026-07-11T12-39-53-04-00-listener-raf-host-lease-map.md
.agent/lifecycle-audit/2026-07-11T12-39-53-04-00-startup-rollback-ordered-dispose-contract.md
.agent/deploy-audit/2026-07-11T12-39-53-04-00-runtime-lifecycle-fixture-gate.md
```

## Do not start next with

- visual polish before route/profile P0
- a second runtime loop or parallel lifecycle owner
- `location.reload()` as teardown proof
- terminating only the Worker while leaving executor callbacks and resources live
- claiming retry isolation without a new run/stream epoch and stale-result fixture
