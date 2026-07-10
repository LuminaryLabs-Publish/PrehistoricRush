# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-10T01-31-29-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

**Mode:** documentation-only repo breakdown

## Selection

`PrehistoricRush` was selected after comparing the current public `LuminaryLabs-Publish` repository list against the central ledger in `LuminaryLabs-Dev/LuminaryLabs`.

No checked non-Cavalry repository was new, missing from the central ledger, missing sampled root `.agent` state, recently added but undocumented, or otherwise undocumented.

`LuminaryLabs-Publish/TheCavalryOfRome` remained excluded.

`PrehistoricRush` was the oldest eligible documented fallback at the start of this pass.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js 0.179.1, Rapier 0.15.0, and rapier-physics-domain-kit from CDN
  -> create shell, HUD panel, Start button, terrain chunks, raptor rig, instanced rocks, instanced shards, tree pools, camera, and renderer
  -> Start button, Enter, or Space transitions menu to game
  -> keydown/keyup mutate app.input flags
  -> frame loop mutates speed, turn, yaw, jump, position, distance, terrain, contacts, pickups, best distance, scene, raptor pose, camera, HUD, and renderer
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, and a second render submission
  -> PrehistoricRushHost.getState() returns scene, runner, physics, terrain chunk count, and renderer label
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

## Kit services

```txt
event-bus-kit: on, emit, snapshot.
domain-host-kit: install, get, tick, snapshot.
tick-scheduler-kit: start, stop, snapshot.
dino-form-domain-kit: descriptor and snapshot for the raptor form.
dino-pose-domain-kit: consumes runner.moved, emits dino.pose.changed, provides pose descriptors.
dino-material-domain-kit: descriptor and snapshot for raptor material.
camera-domain-kit: close third-person camera preset, descriptor, snapshot.
hud-domain-kit: progress, render descriptor, snapshot.
rapier-physics-domain-kit: Rapier world bridge, kinematic actor, contact snapshot.
legacy-runtime kit: terrain, spawn, motion, collision, pickup, score, scene, render, and host state in one live module.
presentation-pass kit: readable stride, close camera, HUD DOM rewrite, second renderer submission.
host-state-projection-kit: exposes current scene, runner, physics, terrain chunks, and renderer label.
central-ledger-sync-kit: records repo-local and central audit state.
```

## Implemented repo-local kits

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

## Live external kits

```txt
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

## Main finding

`PrehistoricRush` should not get visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion next.

The blocker is still movement and presentation proof: `dino-pose-domain-kit` already consumes `runner.moved`, but `runtime-terrain-v6.mjs` mutates runner state and raptor animation inline without emitting stable `RunnerMovedEvent` rows. `src/game.js` then applies a second presentation pass without fixture-readable frame records.

## Next safe ledge

```txt
PrehistoricRush Movement Event Readback Catch-up + Host Presentation Fixture Gate
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free presentation fixture: not run because fixture files do not exist yet
pushed to main: yes, documentation only
```
