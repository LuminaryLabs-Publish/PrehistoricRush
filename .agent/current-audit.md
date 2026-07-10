# Current Audit: PrehistoricRush

**Updated:** `2026-07-10T09-18-53-04-00`

## Summary

`PrehistoricRush` is playable and has a useful repo-local DSK wrapper, but the live runner still bypasses runner-event and host-readback proof.

`src/game.js` installs the event bus, domain host, scheduler, dino, camera, and HUD kits. It also runs a second presentation pass.

`src/runtime-terrain-v6.mjs` still owns the live runner, terrain, physics bridge, raptor rig, pickups, contacts, scene dispatch, HUD, renderer, host projection, and best-distance storage.

## Current route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
```

## Current interaction loop

```txt
src/game.js
  -> create event bus, domain host, and tick scheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> dino-pose-domain-kit subscribes to runner.moved
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import runtime-terrain-v6
  -> start secondary presentation pass

runtime-terrain-v6
  -> load Three.js / Rapier / rapier-physics-domain-kit
  -> create shell and Start button
  -> create terrain chunks, raptor rig, rocks, shards, trees, camera, renderer
  -> mutate input flags on keydown/keyup
  -> mutate runner state, terrain, colliders, pickups, score, scene, HUD, and renderer per frame
  -> expose PrehistoricRushHost.getState()
```

## Domains in use

```txt
static-browser-shell
runtime-entry
composition-entry
event-bus
domain-host
tick-scheduler
dino-form
dino-pose
dino-material
camera-domain
hud-domain
legacy-visual-runtime
three-cdn-runtime
rapier-cdn-runtime
rapier-physics-domain-kit
menu-scene
game-scene
run-over-scene
win-scene
keyboard-input
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
presentation-camera-consumer
presentation-hud-consumer
presentation-raptor-stride-consumer
secondary-render-submission
host-state-projection
runner-event-proof-next
input-result-journal-next
movement-result-journal-next
presentation-frame-journal-next
host-readback-next
dom-free-runner-fixture-next
central-ledger-sync
```

## Kits and services

```txt
event-bus-kit: on, emit, snapshot, recent event history
domain-host-kit: install, get, tick, snapshot
tick-scheduler-kit: start, stop, host.tick bridge, scheduler snapshot
dino-form-domain-kit: raptor proportions, silhouette descriptor, feature-set descriptor, snapshot
dino-pose-domain-kit: runner.moved consumer, dino.pose.changed emitter, pose update, getDescriptor, snapshot
dino-material-domain-kit: palette descriptor, style descriptor, snapshot
dino-domain-bundle-kit: dino form/pose/material exports, bundle helper
camera-domain-kit: close third-person camera preset, getDescriptor, snapshot
hud-domain-kit: target distance, progress, HUD model render, getDescriptor, snapshot
rapier-physics-domain-kit: Rapier world bridge, kinematic actor, contact snapshot
```

## Main finding

The route should not be visually expanded next. The safe ledge is a runner-event and host-readback ledger that proves input, movement, contact, pickup, scene, best-distance, pose, camera, HUD, render, and host snapshot rows without changing game feel.
