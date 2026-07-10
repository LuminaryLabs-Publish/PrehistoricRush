# Project Breakdown: PrehistoricRush

**Timestamp:** `2026-07-10T09-18-53-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Selection

Selected as the oldest eligible non-Cavalry documented fallback after comparing the public `LuminaryLabs-Publish` repo list with the central ledger.

No checked non-Cavalry repo was new, central-ledger absent, missing sampled root `.agent`, recently added but undocumented, or otherwise undocumented.

## Current product

`PrehistoricRush` is a static browser infinite runner with a repo-local DSK wrapper around a live Three.js/Rapier terrain runner.

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
  -> frame loop mutates speed, yaw, jump, position, distance, terrain, contacts, pickups, best distance, scene, raptor pose, camera, HUD, and renderer
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

## Main finding

Do not start with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The blocker is runner event and host presentation readback. `dino-pose-domain-kit` already listens for `runner.moved`, but `src/runtime-terrain-v6.mjs` never emits stable runner event records and still mutates movement, contacts, pickups, scene, best distance, raptor pose, camera, HUD, and render submission inline.

## Next safe ledge

```txt
PrehistoricRush Runner Event Host Readback Ledger Refresh + DOM-Free Presentation Gate
```

## Validation

Docs-only pass. Runtime source was not changed. No branch or PR was created. No package/browser/fixture validation was run because the DOM-free fixture and root package validation do not exist yet.
