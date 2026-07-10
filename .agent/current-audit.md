# Current Audit: PrehistoricRush

**Updated:** `2026-07-10T18-01-03-04-00`

## Summary

`PrehistoricRush` is playable, but runtime authority is split across composition, live simulation, and secondary presentation. The newest audit adds a source-admission and lifecycle finding: the route cannot prove which external runtime implementation was admitted, why fallback occurred, or whether browser/GPU/physics resources were released.

## Current route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
```

## Interaction loop

```txt
boot
  -> create event bus, domain host, and tick scheduler
  -> install dino form / pose / material / camera / HUD domains
  -> leave scheduler stopped
  -> import live runtime

runtime admission
  -> import Three.js 0.179.1
  -> import Rapier 0.15.0
  -> import rapier-physics-domain-kit from NexusRealtime-ProtoKits@main
  -> convert each import rejection to null
  -> continue without a typed dependency result

mount
  -> replace #app contents
  -> register resize, keydown, and keyup listeners
  -> create renderer, scene, materials, geometries, instanced meshes, terrain, raptor, and physics bridge
  -> populate deterministic terrain objects
  -> expose Start button and mutable input flags

primary frame
  -> increment app.frame
  -> mutate movement, jump, terrain, contacts, pickups, score, and scene
  -> apply pose, camera, HUD, and render

secondary frame
  -> rewrite pose, camera, HUD, and render again

terminal lifecycle
  -> contact selects run-over
  -> distance selects win
  -> Retry / Run Again only set scene back to game
  -> no reset, dispose, or remount transaction
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
external-module-resolution
runtime-dependency-admission
source-provenance
required-capability-policy
degraded-mode-policy
three-cdn-runtime
rapier-cdn-runtime
rapier-physics-domain-kit
menu-scene
game-scene
run-over-scene
win-scene
scene-transition-policy
session-start
restart-lifecycle
mount-lifecycle
dispose-lifecycle
listener-ownership
raf-ownership
graphics-resource-lifetime
physics-resource-lifetime
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
static-pages-deploy
central-ledger-sync
```

## Implemented kits and services

```txt
event-bus-kit
  subscribe, unsubscribe closure, emit, wildcard dispatch, bounded recent snapshot

domain-host-kit
  idempotent install, get, tick fan-out, aggregate domain snapshot

tick-scheduler-kit
  start, stop flag, RAF-to-host tick bridge, frame snapshot
  live status: constructed but not started

dino-form-domain-kit
  raptor proportions, silhouette descriptor, feature descriptor, snapshot

dino-pose-domain-kit
  runner.moved subscription, pose calculation, dino.pose.changed emission, descriptor, snapshot
  live status: no runner.moved event reaches it

dino-material-domain-kit
  palette descriptor, style descriptor, snapshot

dino-domain-bundle-kit
  form/pose/material exports and bundle construction

camera-domain-kit
  close-third-person preset, descriptor, snapshot
  live status: direct presentation constants bypass it

hud-domain-kit
  target distance, progress policy, HUD model projection, descriptor, snapshot
  live status: direct innerHTML bypasses it

rapier-physics-domain-kit
  world bridge, Rapier configuration, kinematic actor, fixed colliders, transform update, step, contacts, snapshot
  source status: fetched from mutable @main URL
```

## Runtime-implied kits

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
external-module-loader-kit
runtime-dependency-admission-kit
source-provenance-kit
degraded-mode-policy-kit
legacy-runner-runtime-kit
runner-input-kit
runner-motion-kit
runner-jump-kit
terrain-stream-kit
spawn-population-kit
contact-resolution-kit
pickup-collection-kit
scene-dispatch-kit
session-start-kit
restart-transaction-kit
mount-lifecycle-kit
dispose-lifecycle-kit
listener-ownership-kit
raf-ownership-kit
graphics-resource-disposal-kit
physics-resource-disposal-kit
best-distance-storage-kit
raptor-render-adapter-kit
primary-presentation-kit
secondary-presentation-kit
render-submission-kit
host-state-projection-kit
runtime-source-contract-kit
runtime-admission-lifecycle-fixture-kit
```

## Main findings

1. The route has no single frame owner: the repo-local scheduler is dormant while two other RAF loops mutate and render the same scene.
2. Start, Retry, and Run Again are scene-string assignments, not session transactions.
3. The external physics kit is loaded from `NexusRealtime-ProtoKits@main`, so runtime behavior can change without a `PrehistoricRush` commit.
4. `load()` catches every dynamic import failure and returns `null`, erasing dependency identity, error class, and fallback reason.
5. Three.js is operationally required, but a failed import is not rejected at admission; `setup(THREE, ...)` fails later with an opaque exception.
6. Rapier and the physics kit are treated as optional in practice, but the host reports only `on` or `fallback`, with no requested source, admitted source, capabilities, or reason.
7. Global resize/keyboard listeners, two RAF loops, event subscriptions, WebGL resources, and physics resources have no common dispose contract.
8. `PrehistoricRushHost` exposes mutable live objects and cannot prove dependency admission, frame ownership, session identity, or disposal state.
9. README and JSON manifests are deployed but remain non-authoritative for live scenes, tuning, engine source, and transitions.

## Next safe ledge

```txt
PrehistoricRush Runtime Dependency Admission + Single-Owner Session Lifecycle Fixture Gate
```

This should extend, not bypass, the existing single-frame and restart plan.