# Architecture Audit: Runner Event Host Readback DSK Map

**Timestamp:** `2026-07-10T04-50-40-04-00`

## DSK map

```txt
Browser shell
  -> runtime entry
  -> composition entry
  -> event bus
  -> domain host
  -> dino/camera/HUD domain kits
  -> live terrain runtime
  -> inline runner simulation
  -> inline visual consumers
  -> limited host readback
```

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> dino-pose-domain-kit waits for runner.moved
  -> composition.ready event is emitted
  -> import src/runtime-terrain-v6.mjs
  -> create live Three/Rapier terrain runner
  -> input mutates app.input flags
  -> frame loop mutates app.state, terrain, physics, scene, pose, camera, HUD, renderer
  -> src/game.js presentation pass mutates readable pose, close camera, HUD DOM, and renderer again
  -> PrehistoricRushHost.getState exposes aggregate state only
```

## Domains

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
keyboard-input
runner-motion
runner-turn-yaw
runner-jump-gravity
runner-terrain-stream
terrain-height-sampling
spawn-population
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
host-readback-next
central-ledger-sync
```

## Current services

```txt
event-bus: event subscription, event emission, recent-history snapshot
domain-host: kit installation, domain lookup, tick dispatch, domain snapshot
tick-scheduler: scheduler start/stop/snapshot shape
dino-pose-domain-kit: runner.moved consumer and dino.pose.changed emitter
runtime-terrain-v6: live runner, terrain, physics, contacts, pickups, scenes, pose, camera, HUD, renderer, host state
PrehistoricRushHost: app pointer and aggregate getState readback
```

## Missing services

```txt
runner source-state serialization
runner step delta computation
RunnerMovedEvent creation and emission
movement accepted/rejected/no-change row
contact result snapshot
pickup result snapshot
best-distance result row
scene-dispatch result row
shared frame id across movement, pose, camera, HUD, and render
presentation frame journal
host presentation snapshot
DOM-free runner event fixture
```

## Kit classification

### Implemented repo-local kits

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
```

### External live kit

```txt
rapier-physics-domain-kit from NexusRealtime-ProtoKits CDN
```

### Runtime-implied kits

```txt
prehistoric-static-shell-kit
runner-input-kit
runner-motion-kit
runner-terrain-stream-kit
runner-contact-kit
runner-pickup-kit
runner-scene-dispatch-kit
best-distance-storage-kit
raptor-render-adapter-kit
presentation-camera-consumer-kit
presentation-hud-consumer-kit
render-submission-kit
host-state-projection-kit
```

### Next-cut kits

```txt
runner-event-source-kit
runner-moved-event-kit
movement-result-row-kit
contact-result-snapshot-kit
pickup-result-snapshot-kit
scene-dispatch-result-kit
presentation-frame-record-kit
presentation-journal-kit
host-presentation-snapshot-kit
dom-free-runner-event-fixture-kit
```

## Main architectural blocker

`src/runtime-terrain-v6.mjs` is still the source, command/result, render, and host-readback owner for the live runner.

`src/game.js` adds composition structure but also applies a second presentation consumer pass.

Until the runner emits stable source-backed events and host readback exposes journal rows, the current behavior cannot be proven without opening the browser.
