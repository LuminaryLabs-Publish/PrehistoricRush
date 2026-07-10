# Architecture Audit: Movement Event Readback DSK Map

**Timestamp:** `2026-07-10T01-31-29-04-00`

## DSK read

`PrehistoricRush` has a repo-local DSK scaffold around the live runner, but the live gameplay path still bypasses the event proof layer.

`src/game.js` installs an event bus, domain host, tick scheduler, dino domains, camera domain, and HUD domain.

`src/runtime-terrain-v6.mjs` still owns live movement, terrain, contact, pickup, score, scene changes, raptor pose, camera, HUD, renderer, and host projection.

## Current route map

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> event bus / domain host / scheduler
  -> dino form / pose / material domains
  -> camera / HUD domains
  -> composition.ready
  -> src/runtime-terrain-v6.mjs
  -> Three.js CDN
  -> Rapier CDN
  -> rapier-physics-domain-kit CDN
  -> shell / HUD / Start button
  -> runner frame loop
  -> presentation pass
  -> PrehistoricRushHost.getState()
```

## Active domains

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
runner-spawn-population
runner-contact
runner-pickup
runner-score
best-distance-storage
raptor-render-adapter
presentation-camera-consumer
presentation-hud-consumer
presentation-raptor-stride-consumer
render-submission
host-state-projection
movement-event-readback-next
presentation-journal-next
dom-free-presentation-fixture-next
central-ledger-sync
```

## Current services

```txt
event-bus: on, emit, snapshot.
domain-host: install, get, tick, snapshot.
tick-scheduler: start, stop, snapshot.
dino-form: raptor form descriptor and snapshot.
dino-pose: runner.moved consumer and dino.pose.changed emitter.
dino-material: material descriptor and snapshot.
camera-domain: close third-person camera descriptor and snapshot.
hud-domain: progress/render descriptor and snapshot.
legacy-runtime: live terrain, input, movement, contacts, pickups, scenes, animation, camera, HUD, render, host state.
rapier-kit: physics world bridge and actor/contact snapshots.
presentation-pass: readable stride, close camera, HUD rewrite, second renderer submission.
host-projection: scene, runner, physics, terrain chunk count, renderer label.
```

## Current kits

```txt
event-bus-kit
domain-host-kit
tick-scheduler-kit
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle-kit
camera-domain-kit
hud-domain-kit
rapier-physics-domain-kit
```

## Runtime-implied kits

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
prehistoric-legacy-visual-runtime-kit
runner-input-kit
runner-motion-kit
runner-turn-yaw-kit
runner-jump-gravity-kit
runner-terrain-stream-kit
runner-spawn-population-kit
runner-contact-kit
runner-pickup-kit
runner-scene-dispatch-kit
runner-score-kit
best-distance-storage-kit
raptor-render-adapter-kit
presentation-camera-consumer-kit
presentation-hud-consumer-kit
presentation-raptor-stride-consumer-kit
render-submission-kit
host-state-projection-kit
central-ledger-readback-kit
```

## Next-cut kits

```txt
presentation-events-kit
runner-source-state-kit
runner-step-delta-kit
runner-moved-event-kit
movement-result-row-kit
dino-pose-frame-kit
camera-frame-request-kit
hud-frame-request-kit
contact-result-snapshot-kit
pickup-result-snapshot-kit
scene-dispatch-result-kit
best-distance-result-kit
render-readback-kit
presentation-frame-record-kit
presentation-journal-kit
host-presentation-snapshot-kit
dom-free-presentation-fixture-kit
```

## Architecture conclusion

Do not begin with visuals, terrain, movement tuning, renderer extraction, new pickups, or ProtoKit promotion.

Begin by making the live runner emit stable movement event and presentation frame records, then expose those records additively through `PrehistoricRushHost.getState().presentation` and prove them with a DOM-free fixture.
