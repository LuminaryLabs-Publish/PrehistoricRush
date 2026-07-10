# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-10T13-30-15-04-00`

## Selection

`PrehistoricRush` was selected from the public `LuminaryLabs-Publish` repo list after excluding `TheCavalryOfRome`.

No checked non-Cavalry repo was new, missing from the central ledger, missing sampled root `.agent` state, recently added, or otherwise undocumented. `PrehistoricRush` was the oldest eligible documented fallback.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form / dino pose / dino material / camera / HUD kits
  -> dino-pose-domain-kit subscribes to runner.moved
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js 0.179.1, Rapier 0.15.0, and rapier-physics-domain-kit from CDN
  -> create shell, Start button, HUD, terrain chunks, raptor rig, rocks, shards, trees, camera, renderer
  -> Start / Enter / Space starts game scene
  -> keydown / keyup mutate app.input flags
  -> frame loop mutates runner speed, yaw, jump, position, distance, terrain, contacts, pickups, scene, best distance, raptor pose, camera, HUD, and render
  -> src/game.js presentation pass mutates stride, camera, HUD DOM, and performs a second render
  -> PrehistoricRushHost.getState() returns aggregate scene, runner, physics, terrain, renderer label
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
runner-source-event-ledger-next
runner-event-proof-next
input-result-journal-next
movement-result-journal-next
contact-result-journal-next
pickup-result-journal-next
scene-dispatch-journal-next
best-distance-journal-next
presentation-frame-journal-next
host-readback-next
dom-free-runner-fixture-next
central-ledger-sync
```

## Kit services

- `event-bus-kit`: `on`, `emit`, `snapshot`, recent event history.
- `domain-host-kit`: `install`, `get`, `tick`, and installed-domain snapshots.
- `tick-scheduler-kit`: `start`, `stop`, host tick bridge, scheduler snapshot.
- `dino-form-domain-kit`: raptor proportions, silhouette descriptor, feature-set descriptor, snapshot.
- `dino-pose-domain-kit`: `runner.moved` consumer, `dino.pose.changed` emitter, pose update, descriptor, snapshot.
- `dino-material-domain-kit`: palette descriptor, style descriptor, snapshot.
- `camera-domain-kit`: close third-person camera preset, descriptor, snapshot.
- `hud-domain-kit`: target distance, progress, HUD model render, descriptor, snapshot.
- `rapier-physics-domain-kit`: Rapier world bridge, kinematic actor, contact snapshot.
- Runtime implied kits: static shell, runtime entry, legacy visual runtime, runner input/motion/turn/jump/terrain/spawn/contact/pickup/scene/score, best-distance storage, raptor render adapter, presentation camera/HUD/stride consumers, render submission, host state projection.

## All kits

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
runner-event-source-kit planned
runner-source-state-kit planned
runner-step-delta-kit planned
runner-moved-event-kit planned
input-result-row-kit planned
movement-result-row-kit planned
contact-result-snapshot-kit planned
pickup-result-snapshot-kit planned
scene-dispatch-result-kit planned
best-distance-result-kit planned
dino-pose-frame-kit planned
camera-frame-request-kit planned
hud-frame-request-kit planned
render-readback-kit planned
presentation-frame-record-kit planned
presentation-journal-kit planned
host-presentation-snapshot-kit planned
host-event-history-readback-kit planned
dom-free-runner-source-event-fixture-kit planned
package-validation-kit planned
```

## Main finding

`PrehistoricRush` should not start next with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The blocker is runner source event readback. `dino-pose-domain-kit` listens for `runner.moved`, but `src/runtime-terrain-v6.mjs` never emits stable `RunnerMovedEvent` records and still mutates movement, contacts, pickups, scene state, raptor pose, camera, HUD, best distance, and rendering inline.

## Next safe ledge

```txt
PrehistoricRush Runner Source Event Readback Ledger Refresh + DOM-Free Host Fixture Gate
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free runner source event fixture: not run because proof files do not exist yet
pushed to main: yes
```
