# PrehistoricRush Presentation Host Fixture Refresh

**Timestamp:** `2026-07-09T19-29-23-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

**Pass type:** documentation-only repo breakdown and central-ledger sync

## Selection result

`PrehistoricRush` was selected as the oldest eligible public non-Cavalry fallback after comparing the current `LuminaryLabs-Publish` public repository list against the central `LuminaryLabs-Dev/LuminaryLabs` ledger and sampled root `.agent` state.

`TheCavalryOfRome` remains excluded by standing rule.

No checked non-Cavalry repo was new, absent from central tracking, missing sampled root `.agent` state, recently added but undocumented, or otherwise undocumented.

## Publish organization repositories observed

```txt
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / newer central tracking
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / newer central tracking
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / newer central tracking
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / newer central tracking
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / newer central tracking
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible documented fallback
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / newer central tracking
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / newer central tracking
```

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js 0.179.1, Rapier 0.15.0, and rapier-physics-domain-kit from CDNs
  -> create DOM shell and Start button
  -> create Three.js scene, fog, camera, renderer, terrain chunks, raptor rig, rocks, trees, shards, lights, and sky
  -> menu waits for Start / Enter / Space
  -> keydown and keyup mutate app.input left/right/boost/jump flags
  -> game loop mutates speed, yaw, jump, distance, terrain chunks, colliders, pickups, scene, score, and local best inline
  -> Rapier kinematic actor receives the current dino transform
  -> contact or collider overlap can move scene to run-over
  -> shard overlap mutates collected set and shards count
  -> distance > 3600 mutates scene to win
  -> runtime-terrain-v6 positions and animates raptor, camera, HUD, and renderer
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, and renders a second frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
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
dino-entity-domain
dino-form-domain
dino-pose-domain
dino-material-domain
camera-preset-domain
hud-preset-domain
legacy-three-rapier-runtime-domain
external-rapier-physics-domain
terrain-streaming-domain
terrain-height-sampling-domain
terrain-chunk-rebuild-domain
spawn-population-domain
instanced-tree-pool-domain
rock-collider-population-domain
shard-pickup-population-domain
runner-input-domain
runner-motion-domain
jump-gravity-domain
runner-contact-domain
pickup-collection-domain
scene-dispatch-domain
score-state-domain
host-readback-domain
presentation-consumer-domain
presentation-event-ledger-domain
presentation-frame-record-domain
presentation-fixture-target-domain
central-ledger-sync-domain
```

## Services the kits offer

```txt
createEventBus
  -> on(type, handler)
  -> emit(type, payload)
  -> snapshot() with listener types, event count, and recent history

createDomainHost
  -> install(domain) with idempotent domain IDs
  -> get(id)
  -> tick(dt, context)
  -> snapshot() with installed domain snapshots

createTickScheduler
  -> start(context)
  -> stop()
  -> snapshot() with running/frame state

createDinoFormDomainKit
  -> dino form descriptor and snapshot

createDinoPoseDomainKit
  -> listens for runner.moved
  -> computes readable pose descriptor
  -> emits dino.pose.changed
  -> exposes getDescriptor() and snapshot()

createDinoMaterialDomainKit
  -> dino material descriptor and snapshot

createCameraDomainKit
  -> close third-person camera preset descriptor
  -> emits camera.preset.ready
  -> exposes getDescriptor() and snapshot()

createHudDomainKit
  -> readability HUD descriptor
  -> progress(distance)
  -> render(metrics) projection rows
  -> emits hud.ready

rapier-physics-domain-kit
  -> external Rapier world bridge
  -> kinematic actor registration
  -> collider/contact stepping
  -> physics snapshot

PrehistoricRushComposition.snapshot
  -> composition/domain/event/scheduler readback

PrehistoricRushHost.getState
  -> current scene, runner state, physics snapshot, terrain count, and renderer label

src/game.js presentation pass
  -> styleHud DOM styling
  -> renderHud DOM projection
  -> applyCloseCamera camera mutation
  -> applyReadableStride raptor rig mutation
  -> secondary render submission
```

## Implemented repo-local kits

```txt
src/domain-runtime/event-bus.js
src/domain-runtime/domain-host.js
src/domain-runtime/tick-scheduler.js
src/domains/dino/dino-form-domain-kit.js
src/domains/dino/dino-pose-domain-kit.js
src/domains/dino/dino-material-domain-kit.js
src/domains/dino/index.js
src/domains/camera/camera-domain-kit.js
src/domains/hud/hud-domain-kit.js
```

## Live external kit

```txt
rapier-physics-domain-kit from LuminaryLabs-Agents/NexusRealtime-ProtoKits@main CDN
```

## Runtime-implied kits

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
prehistoric-legacy-visual-runtime-kit
runner-input-kit
runner-motion-kit
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
render-readback-kit
host-state-projection-kit
central-ledger-readback-kit
```

## Next-cut kits

```txt
presentation-events-kit
runner-source-state-kit
runner-step-delta-kit
runner-moved-event-kit
dino-pose-frame-kit
camera-frame-request-kit
hud-frame-request-kit
contact-result-snapshot-kit
scene-dispatch-result-kit
render-readback-kit
presentation-frame-record-kit
presentation-journal-kit
host-presentation-snapshot-kit
dom-free-presentation-fixture-kit
```

## Main finding

`PrehistoricRush` is playable and already has the right local DSK scaffold, but the live route still bypasses the proof path.

`dino-pose-domain-kit` listens for `runner.moved`, `createEventBus` keeps a recent event history, and `PrehistoricRushComposition.snapshot()` exposes the installed domain state. The live runner in `src/runtime-terrain-v6.mjs` still mutates speed, yaw, jump, distance, terrain, contacts, pickups, scene, score, raptor pose, camera, HUD, and renderer inline. `src/game.js` then applies a second presentation pass without emitting a serializable presentation frame or host journal.

The next cut should add event and readback proof before visual expansion, terrain rewrite, movement rewrite, renderer extraction, or ProtoKit promotion.

## Next safe ledge

```txt
PrehistoricRush Presentation Host Fixture Refresh + DOM-Free Event Bridge Gate
```

## Next source files

```txt
src/presentation/presentation-events.js
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
local checkout: no
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free presentation fixture: not run because fixture files do not exist yet
pushed to main: yes, documentation only
```
