# Project Breakdown: PrehistoricRush

**Run:** `2026-07-10T06-21-03-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Selection

The current public `LuminaryLabs-Publish` repository list was compared against the central `LuminaryLabs-Dev/LuminaryLabs` repo ledger and sampled root `.agent` state.

No checked non-Cavalry repository was new, absent from the central ledger, missing root `.agent` state, recently added but undocumented, or otherwise undocumented.

`LuminaryLabs-Publish/TheCavalryOfRome` remained excluded.

`PrehistoricRush` was selected by the oldest eligible documented-selection fallback.

## Product read

`PrehistoricRush` is a static browser infinite runner with a live Three.js/Rapier terrain runtime and a repo-local DSK wrapper.

The repo already has an event bus, domain host, scheduler, and dino/camera/HUD domain kits. The live runner still bypasses the event-proof path and performs movement, scene, presentation, rendering, and host projection inline.

## Current interaction loop

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
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, and submits a second render frame
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
movement-result-journal-next
presentation-frame-journal-next
host-readback-next
dom-free-runner-fixture-next
central-ledger-sync
```

## Implemented repo-local kits and services

```txt
event-bus-kit
  path: src/domain-runtime/event-bus.js
  services: on, emit, snapshot, recent event history

domain-host-kit
  path: src/domain-runtime/domain-host.js
  services: install, get, tick, snapshot

tick-scheduler-kit
  path: src/domain-runtime/tick-scheduler.js
  services: start, stop, host.tick bridge, scheduler snapshot

dino-form-domain-kit
  path: src/domains/dino/dino-form-domain-kit.js
  services: raptor proportions, silhouette, feature-set descriptor, snapshot

dino-pose-domain-kit
  path: src/domains/dino/dino-pose-domain-kit.js
  services: runner.moved consumer, dino.pose.changed emitter, pose update, getDescriptor, snapshot

dino-material-domain-kit
  path: src/domains/dino/dino-material-domain-kit.js
  services: palette descriptor, style descriptor, snapshot

dino-domain-bundle-kit
  path: src/domains/dino/index.js
  services: dino form / pose / material exports and bundle helper

camera-domain-kit
  path: src/domains/camera/camera-domain-kit.js
  services: close third-person camera preset, descriptor, snapshot

hud-domain-kit
  path: src/domains/hud/hud-domain-kit.js
  services: target distance, progress, HUD model render, descriptor, snapshot
```

## Live external kit

```txt
rapier-physics-domain-kit
  source: LuminaryLabs-Agents/NexusRealtime-ProtoKits@main CDN
  services: Rapier world bridge, kinematic actor registration, transform sync, physics snapshot, contact snapshot
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

Do not start next with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The blocker is runner event and host presentation proof.

`dino-pose-domain-kit` already listens for `runner.moved`, but the live runner never emits stable `RunnerMovedEvent` records. `runtime-terrain-v6.mjs` still mutates movement, contacts, pickups, scene state, raptor pose, camera, HUD, localStorage best distance, and render submission inline.

`src/game.js` also runs a secondary presentation pass that mutates readable stride, close camera, HUD DOM, and render submission without source frame IDs or fixture-readable rows.

## Next safe ledge

```txt
PrehistoricRush Runner Event Host Fixture Refresh + DOM-Free Presentation Gate
```

## Next implementation files

```txt
src/presentation/presentation-events.js
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/movement-result-row.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/pickup-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/best-distance-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-runner-event-fixture.mjs
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
```
