# PrehistoricRush Runner Event Journal Readback Breakdown

Timestamp: 2026-07-10T07-50-29-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush
Scope: documentation and repo-local audit refresh only.

## Selection reason

No checked non-Cavalry Publish repo was new, missing from central tracking, missing sampled root `.agent`, recently added but undocumented, or otherwise undocumented. `PrehistoricRush` was the oldest eligible documented fallback after central ledger comparison.

`TheCavalryOfRome` was excluded by standing rule.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> dino-pose-domain-kit subscribes to runner.moved
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

- static-browser-shell
- runtime-entry
- composition-entry
- event-bus
- domain-host
- tick-scheduler
- dino-form
- dino-pose
- dino-material
- camera-domain
- hud-domain
- legacy-visual-runtime
- three-cdn-runtime
- rapier-cdn-runtime
- rapier-physics-domain-kit
- menu-scene
- game-scene
- run-over-scene
- win-scene
- keyboard-input
- runner-motion
- runner-turn-yaw
- runner-jump-gravity
- runner-terrain-stream
- terrain-height-sampling
- runner-spawn-population
- runner-contact
- runner-pickup
- runner-score
- best-distance-storage
- raptor-render-adapter
- presentation-camera-consumer
- presentation-hud-consumer
- presentation-raptor-stride-consumer
- secondary-render-submission
- host-state-projection
- runner-event-proof-next
- movement-result-journal-next
- presentation-frame-journal-next
- host-readback-next
- dom-free-runner-fixture-next
- central-ledger-sync

## Kit services

- `event-bus-kit`: `on`, `emit`, `snapshot`, recent event history.
- `domain-host-kit`: `install`, `get`, `tick`, `snapshot`.
- `tick-scheduler-kit`: scheduler start/stop, host tick bridge, scheduler snapshot.
- `dino-form-domain-kit`: raptor proportions, silhouette descriptor, feature-set descriptor, snapshot.
- `dino-pose-domain-kit`: consumes `runner.moved`, emits `dino.pose.changed`, provides pose update, descriptor, and snapshot.
- `dino-material-domain-kit`: palette descriptor, style descriptor, snapshot.
- `camera-domain-kit`: close third-person camera descriptor and snapshot.
- `hud-domain-kit`: target distance, progress, HUD model render, descriptor, snapshot.
- `rapier-physics-domain-kit`: Rapier world bridge, kinematic actor, contact snapshot.
- Runtime-implied kits own shell, input, motion, terrain stream, spawn population, contacts, pickups, score, best distance, raptor render adapter, presentation consumers, render submission, and host projection.

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
runner-event-source-kit
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
host-event-history-readback-kit
dom-free-runner-event-fixture-kit
package-validation-kit
```

## Main finding

`PrehistoricRush` already has the event bus and domain host shape. The live runner still does not feed it.

`dino-pose-domain-kit` listens for `runner.moved`, but `src/runtime-terrain-v6.mjs` mutates movement, contacts, pickups, scene, raptor pose, camera, HUD, localStorage best distance, and render submission inline.

Do not start next with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

## Next safe ledge

```txt
PrehistoricRush Runner Event Journal Readback Catch-up + DOM-Free Presentation Gate
```

## Validation status

```txt
runtime source changed: no
branch created: no
pull request created: no
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free runner event fixture: not run because proof files do not exist yet
pushed to main: yes
```
