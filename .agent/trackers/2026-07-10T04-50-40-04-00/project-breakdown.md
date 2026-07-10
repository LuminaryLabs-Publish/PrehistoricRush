# Project Breakdown: PrehistoricRush

**Timestamp:** `2026-07-10T04-50-40-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

**Selection:** oldest eligible documented fallback after current Publish-list and central-ledger comparison.

## Selection read

The current public `LuminaryLabs-Publish` list contains 9 repositories.

No checked non-Cavalry repository was new, central-ledger absent, missing sampled root `.agent` state, recently added but undocumented, or otherwise undocumented.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by rule.

`PrehistoricRush` was selected because its central ledger was the oldest eligible non-Cavalry entry at comparison time.

## Public Publish repositories observed

```txt
LuminaryLabs-Publish/PrehistoricRush       selected / prior central latest 2026-07-10T02-51-39-04-00
LuminaryLabs-Publish/IntoTheMeadow         tracked / root .agent present / central latest 2026-07-10T03-01-42-04-00
LuminaryLabs-Publish/HorrorCorridor        tracked / root .agent present / central latest 2026-07-10T03-49-48-04-00
LuminaryLabs-Publish/PhantomCommand        tracked / root .agent present / central latest 2026-07-10T03-59-57-04-00
LuminaryLabs-Publish/ZombieOrchard         tracked / root .agent present / central latest 2026-07-10T04-11-36-04-00
LuminaryLabs-Publish/TheUnmappedHouse      tracked / root .agent present / central latest 2026-07-10T04-22-00-04-00
LuminaryLabs-Publish/MyCozyIsland          tracked / root .agent present / central latest 2026-07-10T04-29-10-04-00
LuminaryLabs-Publish/TheOpenAbove          tracked / root .agent present / central latest 2026-07-10T04-40-52-04-00
LuminaryLabs-Publish/TheCavalryOfRome      excluded by rule
```

## Product read

`PrehistoricRush` is a static browser infinite runner with a repo-local DSK composition wrapper around a live Three.js/Rapier terrain runtime.

The wrapper is useful, but the live runner still bypasses the proof path that would make movement, pose, camera, HUD, and render behavior fixture-readable.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost({ eventBus })
  -> createTickScheduler({ host, eventBus })
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> dino-pose-domain-kit subscribes to runner.moved
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> runtime-terrain-v6 loads Three.js 0.179.1, Rapier 0.15.0, and rapier-physics-domain-kit from CDN
  -> create shell, HUD, Start button, terrain chunks, procedural raptor, instanced rocks, shards, trees, camera, and renderer
  -> Start button, Enter, or Space transitions menu to game
  -> keydown/keyup mutate app.input flags
  -> frame loop mutates speed, turn, yaw, jump, position, distance, terrain, colliders, pickups, best distance, scene, raptor pose, camera, HUD, and renderer
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
movement-result-journal-next
presentation-frame-journal-next
host-readback-next
dom-free-runner-fixture-next
central-ledger-sync
```

## Kit services in use

```txt
event-bus-kit: on, emit, snapshot, recent event history
domain-host-kit: install, get, tick, snapshot
tick-scheduler-kit: start, stop, snapshot
dino-form-domain-kit: descriptor and snapshot for dinosaur body form
dino-pose-domain-kit: consumes runner.moved, emits dino.pose.changed, exposes pose descriptor and snapshot
dino-material-domain-kit: material descriptor and snapshot
camera-domain-kit: close third-person camera preset, descriptor, snapshot
hud-domain-kit: progress/HUD descriptor and snapshot
rapier-physics-domain-kit: Rapier world bridge, kinematic actor, contact snapshot
runtime-terrain-v6 inline services: terrain sampling, streaming, spawn population, collision checks, pickup collection, scene dispatch, best-distance write, raptor pose, camera, HUD, render submission, host getState
```

## Implemented kits

```txt
event-bus-kit                  src/domain-runtime/event-bus.js
domain-host-kit                src/domain-runtime/domain-host.js
tick-scheduler-kit             src/domain-runtime/tick-scheduler.js
dino-form-domain-kit           src/domains/dino/dino-form-domain-kit.js
dino-pose-domain-kit           src/domains/dino/dino-pose-domain-kit.js
dino-material-domain-kit       src/domains/dino/dino-material-domain-kit.js
dino-domain-bundle-kit         src/domains/dino/index.js
camera-domain-kit              src/domains/camera/camera-domain-kit.js
hud-domain-kit                 src/domains/hud/hud-domain-kit.js
rapier-physics-domain-kit      CDN from NexusRealtime-ProtoKits
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

Do not start next with visual expansion, terrain rewrite, movement retune, renderer extraction, new pickups, or ProtoKit promotion.

The blocker is runner event and host presentation readback proof.

`dino-pose-domain-kit` already consumes `runner.moved`, but the live frame loop in `src/runtime-terrain-v6.mjs` never emits stable runner movement records. It mutates movement, contacts, pickups, scene state, raptor pose, camera, HUD, and render submission inline.

`src/game.js` then applies a second presentation pass, which makes the live visual result even harder to fixture-read because pose, camera, HUD, and renderer output are not tied to a shared source frame id.

## Next safe ledge

```txt
PrehistoricRush Runner Event Host Readback Refresh + DOM-Free Fixture Gate
```

## Required next implementation

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

## Fixture rows to prove next

```txt
menu no-run frame
start transition
straight movement
left turn
right turn
boost movement
jump start
falling frame
grounded recovery
rock/tree contact to run-over
shard pickup
win threshold
best distance write
legacy host shape preserved
presentation pass does not erase source frame ids
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
central ledger updated: yes
```
