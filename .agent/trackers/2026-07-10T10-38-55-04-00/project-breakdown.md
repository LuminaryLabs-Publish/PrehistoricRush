# Project Breakdown: PrehistoricRush Presentation Proof Ledger

Timestamp: 2026-07-10T10-38-55-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush
Mode: docs-only audit refresh

## Selection

Selected `LuminaryLabs-Publish/PrehistoricRush` after comparing the current `LuminaryLabs-Publish` repository list with the central ledger in `LuminaryLabs-Dev/LuminaryLabs`.

No checked non-Cavalry repo was new, ledger-missing, missing root `.agent`, recently added, or otherwise undocumented. `PrehistoricRush` was the oldest eligible fallback after `TheOpenAbove` advanced.

`TheCavalryOfRome` remains excluded by standing rule.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> dino-pose-domain-kit subscribes to runner.moved and emits dino.pose.changed
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js 0.179.1, Rapier 0.15.0, and rapier-physics-domain-kit from CDN
  -> create shell, HUD panel, Start button, terrain chunks, raptor rig, instanced rocks, shards, tree pools, camera, and renderer
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

- `event-bus-kit`: `on`, `emit`, `snapshot`, and recent event history.
- `domain-host-kit`: `install`, `get`, `tick`, and domain snapshot.
- `tick-scheduler-kit`: `start`, `stop`, host tick bridge, and scheduler snapshot.
- `dino-form-domain-kit`: raptor proportions, silhouette descriptor, feature-set descriptor, and snapshot.
- `dino-pose-domain-kit`: `runner.moved` consumer, `dino.pose.changed` emitter, pose update, descriptor, and snapshot.
- `dino-material-domain-kit`: palette descriptor, style descriptor, and snapshot.
- `dino-domain-bundle-kit`: dino form/pose/material exports and bundle helper.
- `camera-domain-kit`: close third-person camera preset, descriptor, and snapshot.
- `hud-domain-kit`: target distance, progress, HUD model render, descriptor, and snapshot.
- `rapier-physics-domain-kit`: Rapier world bridge, kinematic actor, and contact snapshot.
- Runtime implied kits: static shell, input, movement, terrain stream, spawn population, contact, pickup, scene dispatch, scoring, best-distance storage, raptor render adapter, presentation consumers, render submission, and host projection.

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

## Runtime implied kits

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
runner-event-source-kit
runner-source-state-kit
runner-step-delta-kit
runner-moved-event-kit
input-result-row-kit
movement-result-row-kit
contact-result-snapshot-kit
pickup-result-snapshot-kit
scene-dispatch-result-kit
best-distance-result-kit
dino-pose-frame-kit
camera-frame-request-kit
hud-frame-request-kit
render-readback-kit
presentation-frame-record-kit
presentation-journal-kit
host-presentation-snapshot-kit
host-event-history-readback-kit
dom-free-runner-event-fixture-kit
package-validation-kit
```

## Main finding

`PrehistoricRush` should not start next with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The blocker is presentation proof:

```txt
dino-pose-domain-kit already listens for runner.moved
runtime-terrain-v6 never emits stable RunnerMovedEvent rows
runtime-terrain-v6 mutates movement, contacts, pickups, scene, raptor pose, camera, HUD, best distance, and render inline
src/game.js adds a second presentation render pass with no shared source frame id
PrehistoricRushHost.getState() lacks presentation, event, input, movement, contact, pickup, scene, best-distance, and render readback rows
```

## Next safe ledge

```txt
PrehistoricRush Presentation Proof Ledger Refresh + DOM-Free Runner Event Gate
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free runner event fixture: not run because proof files do not exist yet
pushed to main: yes
central ledger updated: pending central sync
```
