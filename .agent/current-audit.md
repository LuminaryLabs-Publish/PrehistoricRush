# Current Audit: PrehistoricRush

**Updated:** `2026-07-10T16-28-47-04-00`

## Summary

`PrehistoricRush` has a useful event-bus/domain-host layer and a playable Three.js/Rapier runner, but the live route is not actually driven by the repo-local scheduler or domain host.

The runtime currently has three authority surfaces:

```txt
repo-local composition authority
  src/game.js installs kits and exposes snapshots

primary live runtime authority
  src/runtime-terrain-v6.mjs owns gameplay, scene mutation, presentation, storage, and render

secondary presentation authority
  src/game.js runs a second RAF that rewrites stride, camera, HUD, and render
```

## Current route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
```

## Current interaction loop

```txt
boot
  -> createEventBus
  -> createDomainHost
  -> createTickScheduler
  -> install dino form / pose / material / camera / HUD domains
  -> do not call scheduler.start()
  -> import live runtime

live runtime setup
  -> load Three.js / Rapier / external physics kit
  -> create DOM shell, terrain, raptor, trees, rocks, shards, camera, renderer
  -> create mutable runner state
  -> populate terrain and physics colliders
  -> expose Start button and keyboard flags

primary frame
  -> derive dt and increment app.frame
  -> mutate turn, yaw, speed, jump, position, distance, terrain, contacts, pickups, scene, and best
  -> apply raptor pose
  -> apply camera
  -> rewrite HUD
  -> render
  -> request next primary frame

secondary frame
  -> read globalThis.PrehistoricRushHost.app
  -> apply a second raptor pose
  -> apply a second camera target
  -> rewrite HUD again
  -> render again
  -> request next secondary frame
```

## Domains in use

```txt
static-browser-shell
runtime-entry
composition-entry
event-bus
domain-host
tick-scheduler
composition-snapshot
dino-form
dino-pose
dino-material
camera-preset
hud-model
legacy-visual-runtime
three-cdn-runtime
rapier-cdn-runtime
rapier-physics-domain-kit
menu-scene
game-scene
run-over-scene
win-scene
scene-transition-policy
restart-lifecycle
keyboard-input
button-input
runner-motion
runner-turn-yaw
runner-jump-gravity
runner-terrain-stream
terrain-height-sampling
runner-spawn-population
runner-contact
runner-pickup
runner-score
best-distance-storage
raptor-render-adapter
primary-presentation
secondary-presentation
camera-consumer
hud-consumer
pose-consumer
render-submission
frame-authority
render-commit-authority
host-state-projection
runtime-source-contract
scene-manifest-contract
readme-product-contract
dom-free-fixture
central-ledger-sync
```

## Implemented kits and services

```txt
event-bus-kit
  on, emit, wildcard dispatch, bounded recent snapshot

domain-host-kit
  idempotent install, get, tick fan-out, domain snapshot

tick-scheduler-kit
  start, stop, RAF-to-host.tick bridge, running/frame snapshot
  current consumption: created but never started

dino-form-domain-kit
  raptor proportions, silhouette descriptor, feature descriptor, snapshot

dino-pose-domain-kit
  runner.moved subscription, pose calculation, dino.pose.changed emission, descriptor, snapshot
  current consumption: live runner does not emit runner.moved

dino-material-domain-kit
  palette/style descriptor and snapshot

dino-domain-bundle-kit
  form/pose/material exports and bundle construction

camera-domain-kit
  close-third-person preset, descriptor, snapshot

hud-domain-kit
  target-distance policy, progress calculation, HUD model projection, descriptor, snapshot

rapier-physics-domain-kit
  world bridge, kinematic actor registration, fixed colliders, transform updates, stepping, contacts, snapshot
```

## Runtime-implied kits

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
legacy-runner-runtime-kit
runner-input-kit
runner-motion-kit
runner-jump-kit
terrain-stream-kit
spawn-population-kit
contact-resolution-kit
pickup-collection-kit
scene-dispatch-kit
restart-lifecycle-kit
best-distance-storage-kit
raptor-render-adapter-kit
primary-presentation-kit
secondary-presentation-kit
render-submission-kit
host-state-projection-kit
runtime-source-contract-kit
```

## Main finding

The live route has no single frame owner.

`createTickScheduler()` is instantiated but `scheduler.start()` is never called. The live monolith runs its own RAF, and `startPresentationPass()` starts another RAF after the monolith loads. Both presentation paths mutate the same raptor rig, camera, HUD element, and renderer without a shared frame ID or commit policy.

The terminal buttons are also cosmetic lifecycle labels. `start()` only sets `app.scene = "game"`; it does not recreate runner state, clear terminal distance/contact conditions, reset terrain population, or produce a restart result. A run-over retry can collide again immediately, and a win run-again immediately remains over the win threshold.

## Next safe ledge

```txt
PrehistoricRush Single Frame Authority + Restart Transaction Fixture Gate
```
