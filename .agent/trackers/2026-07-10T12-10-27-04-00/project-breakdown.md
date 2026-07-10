# Project Breakdown: PrehistoricRush Runner Presentation Source Ledger

**Timestamp:** `2026-07-10T12-10-27-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Selection

The current public `LuminaryLabs-Publish` list was compared against the central `LuminaryLabs-Dev/LuminaryLabs` repo ledger and sampled root `.agent` state.

No checked non-Cavalry repo was new, ledger-missing, missing root `.agent`, recently added, or otherwise undocumented. `PrehistoricRush` was selected as the oldest eligible documented fallback after the more recent ledger advances.

`TheCavalryOfRome` remained excluded by rule.

## Current product read

`PrehistoricRush` is a static browser infinite runner with a DSK composition wrapper and a live Three.js/Rapier terrain runner.

The game is playable, but source/readback proof is incomplete: runtime movement, contact, pickup, scene, HUD, camera, render, and best-distance decisions are mutated inline rather than captured as event/result rows.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, HUD domains
  -> dino-pose-domain-kit subscribes to runner.moved
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js 0.179.1, Rapier 0.15.0, rapier-physics-domain-kit
  -> create shell, HUD, Start button, terrain chunks, raptor rig, rocks, shards, trees, camera, renderer
  -> Start button / Enter / Space starts game
  -> keydown/keyup mutate app.input flags
  -> frame loop mutates runner, terrain, contact, pickup, scene, HUD, camera, render, best distance
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, second render
  -> PrehistoricRushHost.getState() returns aggregate host state
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
runner-source-ledger-next
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

## Kits

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

## Main finding

`PrehistoricRush` should not start next with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The blocker is runner presentation source proof. `dino-pose-domain-kit` listens for `runner.moved`, but `runtime-terrain-v6` never emits stable runner moved rows and `PrehistoricRushHost.getState()` lacks fixture-readable presentation/input/movement/contact/pickup/scene/best-distance/render ledgers.

## Next safe ledge

```txt
PrehistoricRush Runner Presentation Source Ledger Refresh + DOM-Free Host Fixture Gate
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free runner presentation fixture: not run because proof files do not exist yet
pushed to main: yes
central ledger updated: pending at repo-local write time
```
