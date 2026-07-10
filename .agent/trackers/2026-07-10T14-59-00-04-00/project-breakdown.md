# Project breakdown: PrehistoricRush runner frame correlation source ledger

Timestamp: `2026-07-10T14-59-00-04-00`

## Repository

```txt
LuminaryLabs-Publish/PrehistoricRush
```

## Selection

The current public `LuminaryLabs-Publish` repository page was checked and the accessible private `LuminaryLabs-Publish/AetherVale` repository was verified through GitHub metadata. The central ledger was compared across eligible non-Cavalry repos.

No eligible repo was new, ledger-missing, missing root `.agent` state, recently added, or otherwise undocumented. `TheCavalryOfRome` remained excluded.

`PrehistoricRush` was selected as the oldest eligible fallback after `TheOpenAbove` and `MyCozyIsland` advanced later in the ledger.

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
  -> create shell, HUD panel, Start button, terrain chunks, raptor rig, rocks, shards, trees, camera, and renderer
  -> Start button / Enter / Space transitions menu to game
  -> keydown / keyup mutate app.input flags
  -> frame loop mutates speed, yaw, jump, position, distance, terrain, contacts, pickups, scene, best distance, raptor pose, camera, HUD, and renderer
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, and a second render submission
  -> PrehistoricRushHost.getState() exposes aggregate state only
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
frame-id-source-next
runner-source-event-ledger-next
input-result-journal-next
movement-result-journal-next
presentation-frame-journal-next
host-readback-next
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

Do not start next with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The blocker is runner frame correlation. `dino-pose-domain-kit` already listens for `runner.moved`, but the live frame loop in `runtime-terrain-v6.mjs` never emits stable movement events and does not retain shared frame identity across input, movement, contact, pickup, scene, pose, camera, HUD, render, and host readback.

## Next safe ledge

```txt
PrehistoricRush Runner Frame Correlation Source Ledger Refresh + DOM-Free Host Fixture Gate
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free frame-correlation fixture: not run because proof files do not exist yet
pushed to main: yes
central ledger updated: yes
```