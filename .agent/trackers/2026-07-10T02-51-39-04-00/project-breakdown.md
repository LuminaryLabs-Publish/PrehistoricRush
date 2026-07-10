# Project Breakdown: PrehistoricRush

**Timestamp:** `2026-07-10T02-51-39-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

**Mode:** documentation-only repo breakdown

## Selection

The current public `LuminaryLabs-Publish` repository page was checked and showed 9 repositories.

`LuminaryLabs-Publish/TheCavalryOfRome` was excluded by rule.

No checked non-Cavalry repository was new, missing from central tracking, missing sampled root `.agent` state, recently added but undocumented, or otherwise undocumented.

`PrehistoricRush` was selected as the oldest eligible documented-selection fallback after central-ledger comparison.

## Source files inspected

```txt
README.md
index.html
src/runtime.mjs
src/game.js
src/runtime-terrain-v6.mjs
src/domain-runtime/event-bus.js
src/domain-runtime/domain-host.js
src/domains/dino/dino-pose-domain-kit.js
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
```

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost({ eventBus })
  -> createTickScheduler({ host, eventBus })
  -> install dino form, dino pose, dino material, camera, and HUD domains
  -> dino-pose-domain-kit subscribes to runner.moved and emits dino.pose.changed
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js 0.179.1, Rapier 0.15.0, and external rapier-physics-domain-kit
  -> create shell, HUD, Start button, terrain chunks, raptor rig, tree pools, rocks, shards, camera, and renderer
  -> keydown/keyup mutate app.input flags
  -> frame loop mutates speed, yaw, jump, position, distance, terrain, colliders, pickups, localStorage best, scene, raptor pose, camera, HUD, and renderer
  -> src/game.js starts a second presentation pass that mutates stride, close camera, HUD DOM, and submits another render
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
runner-moved-event-proof-next
presentation-journal-next
host-journal-readback-next
dom-free-presentation-fixture-next
central-ledger-sync
```

## Kit services

```txt
event-bus service: on, emit, snapshot, recent event history.
domain-host service: install, get, tick, snapshot.
tick-scheduler service: scheduler lifecycle and snapshot.
dino-form service: dino descriptor and snapshot.
dino-pose service: consumes runner.moved, computes pose, emits dino.pose.changed, exposes descriptor and snapshot.
dino-material service: material descriptor and snapshot.
camera-domain service: camera preset descriptor and snapshot.
hud-domain service: progress/render HUD descriptor and snapshot.
legacy runtime service: live runner frame loop, input, terrain, physics bridge, collision, pickups, scene transitions, raptor pose, camera, HUD, render, and host state.
external physics service: Rapier world bridge, kinematic actor transform, contacts, and physics snapshot.
presentation pass service: applies readable stride, close camera, HUD rewrite, and secondary render submission.
host readback service: exposes scene, runner, physics, terrain chunks, and renderer label.
central ledger service: records repo-local docs, selected ledge, findings, validation, and pushed commits.
```

## Implemented kits

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
host-event-history-readback-kit
dom-free-presentation-fixture-kit
package-validation-kit
```

## Main finding

`PrehistoricRush` should not start next with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The repo already has the event-bus/domain-host shape and a `dino-pose-domain-kit` that listens for `runner.moved`.

The live runner still bypasses that proof path. It mutates movement, contacts, pickups, scene state, raptor pose, camera, HUD, and render submission inline, while `PrehistoricRushHost.getState()` lacks presentation journal rows.

## Next safe ledge

```txt
PrehistoricRush Runner Moved Event Host Journal Catch-up + DOM-Free Fixture Gate
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free presentation fixture: not run because proof files do not exist yet
pushed to main: yes, documentation only
```
