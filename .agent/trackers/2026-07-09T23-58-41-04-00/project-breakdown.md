# Project Breakdown — PrehistoricRush

**Timestamp:** `2026-07-09T23-58-41-04-00`

## Selection

`LuminaryLabs-Publish/PrehistoricRush` was selected after comparing the current public `LuminaryLabs-Publish` repository list against `LuminaryLabs-Dev/LuminaryLabs` central ledger state and sampled root `.agent` state.

No checked non-Cavalry repo was new, central-ledger absent, missing sampled root `.agent`, recently added but undocumented, or otherwise undocumented.

`TheCavalryOfRome` remains excluded by rule.

`PrehistoricRush` was the oldest eligible central-ledger fallback after newer refreshes landed for `TheOpenAbove`, `MyCozyIsland`, `TheUnmappedHouse`, `ZombieOrchard`, `PhantomCommand`, `HorrorCorridor`, and `IntoTheMeadow`.

## Publish repos observed

```txt
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central latest 2026-07-09T23-41-15-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central latest 2026-07-09T23-28-35-04-00
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central latest 2026-07-09T23-20-43-04-00
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central latest 2026-07-09T23-02-05-04-00
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central latest 2026-07-09T22-50-53-04-00
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central ledger / central latest 2026-07-09T19-29-23-04-00
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central latest 2026-07-09T22-40-25-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central latest 2026-07-09T23-51-04-04-00
```

## Current product read

`PrehistoricRush` is a static browser infinite runner.

The current route is:

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
```

`src/game.js` installs the repo-local DSK scaffold and then imports the live runtime. `src/runtime-terrain-v6.mjs` owns the playable game loop.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs imports src/game.js
  -> src/game.js creates eventBus, domainHost, and scheduler
  -> installs dino form, dino pose, dino material, camera, and HUD domain kits
  -> emits composition.ready
  -> imports src/runtime-terrain-v6.mjs
  -> runtime loads Three.js, Rapier, and external rapier-physics-domain-kit from CDNs
  -> shell creates DOM host, HUD panel, and Start button
  -> setup creates scene, fog, lights, terrain chunks, raptor rig, rocks, trees, shards, camera, renderer
  -> menu waits for click, Enter, or Space
  -> keydown/keyup mutate app.input
  -> loop mutates speed, turn, yaw, jump, position, distance, terrain chunks, colliders, pickups, score, scene, raptor pose, camera, HUD, and renderer
  -> physics contacts or collider distance move scene to run-over
  -> shard pickup mutates collected set and shards count
  -> distance over 3600 moves scene to win
  -> src/game.js secondary presentation pass mutates stride, close camera, HUD DOM, and submits a second renderer frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain chunks, and renderer string
```

## Domains in use

```txt
static-browser-shell
module-runtime-entry
composition-bootstrap
event-bus-history
domain-host-installation
domain-idempotency
tick-scheduler-scaffold
dino-form-domain
dino-pose-domain
dino-material-domain
camera-preset-domain
hud-preset-domain
legacy-three-rapier-runtime
external-rapier-physics-domain
terrain-streaming
terrain-height-sampling
terrain-chunk-rebuild
spawn-population
instanced-tree-pool
rock-collider-population
shard-pickup-population
runner-input
runner-motion
runner-yaw-turn
jump-gravity
runner-contact
pickup-collection
scene-dispatch
score-state
localstorage-best-distance
raptor-render-adapter
presentation-camera-consumer
presentation-hud-consumer
presentation-stride-consumer
render-submission
host-readback
presentation-event-journal-next
movement-result-fixture-next
central-ledger-sync
```

## Kit services

```txt
createEventBus: on, emit, recent event snapshot
createDomainHost: idempotent install, get, tick, snapshot
createTickScheduler: start, stop, scheduler snapshot
createDinoFormDomainKit: dino form descriptor and snapshot
createDinoPoseDomainKit: runner.moved consumer, dino.pose.changed emitter, pose descriptor, snapshot
createDinoMaterialDomainKit: dino material descriptor and snapshot
createCameraDomainKit: close third-person camera preset descriptor and snapshot
createHudDomainKit: target-distance progress, HUD projection record, descriptor, snapshot
runtime-terrain-v6: shell, scene setup, terrain sampling/rebuild, spawn population, runner motion, contact/pickup checks, raptor animation, baseline camera/HUD/render
rapier-physics-domain-kit: Rapier world bridge, kinematic actor, collider sync, contacts, snapshot
PrehistoricRushComposition: domains/events/scheduler readback
PrehistoricRushHost: live app state readback
```

## Kits identified

Current repo-local kits:

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

External kit:

```txt
rapier-physics-domain-kit
```

Runtime-implied kits:

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
raptor-render-adapter-kit
presentation-camera-consumer-kit
presentation-hud-consumer-kit
presentation-raptor-stride-consumer-kit
render-submission-kit
host-state-projection-kit
```

Next-cut proof kits:

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
render-readback-kit
presentation-frame-record-kit
presentation-journal-kit
host-presentation-snapshot-kit
dom-free-presentation-fixture-kit
central-ledger-sync-kit
```

## Main finding

`PrehistoricRush` should not get visual expansion, terrain rewrite, movement retune, renderer extraction, or ProtoKit promotion next.

The critical blocker is the missing movement event journal. `dino-pose-domain-kit` is already wired to consume `runner.moved`, but the live runner never emits `runner.moved` and never records before/after movement, contact, pickup, scene, pose, camera, HUD, or render rows.

## Next safe ledge

```txt
PrehistoricRush Movement Event Journal + Presentation Fixture Gate
```

## Validation

Documentation-only. Runtime source did not change. No branch or PR was created. No local npm/browser/fixture validation was run.
