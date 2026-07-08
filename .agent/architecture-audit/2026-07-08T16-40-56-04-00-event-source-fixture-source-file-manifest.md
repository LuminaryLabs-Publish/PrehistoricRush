# PrehistoricRush Event Source Fixture Source File Manifest

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T16-40-56-04-00`

## Selection result

The current accessible `LuminaryLabs-Publish` repo list was compared against `LuminaryLabs-Dev/LuminaryLabs` central repo-ledger state.

No checked non-Cavalry repo was fully new, absent from central tracking, missing sampled root `.agent/START_HERE.md`, or otherwise undocumented.

`TheCavalryOfRome` remains excluded by rule.

`PrehistoricRush` was selected by fallback because its central ledger was the oldest current eligible non-Cavalry review after the 16:10/16:20 ZombieOrchard and 16:19 TheUnmappedHouse catch-ups.

## Repo list comparison

```txt
LuminaryLabs-Publish/IntoTheMeadow       tracked / root .agent present / central update observed 2026-07-08T15-28-13-04-00
LuminaryLabs-Publish/HorrorCorridor      tracked / root .agent present / central update observed 2026-07-08T15-39-43-04-00
LuminaryLabs-Publish/AetherVale          tracked / root .agent present / central update observed 2026-07-08T15-20-41-04-00
LuminaryLabs-Publish/ZombieOrchard       tracked / root .agent present / central update observed 2026-07-08T16-20-00-04-00
LuminaryLabs-Publish/TheUnmappedHouse    tracked / root .agent present / central update observed 2026-07-08T16-19-57-04-00
LuminaryLabs-Publish/MyCozyIsland        tracked / root .agent present / central update observed 2026-07-08T14-58-49-04-00
LuminaryLabs-Publish/TheOpenAbove        tracked / root .agent present / central update observed 2026-07-08T15-11-18-04-00
LuminaryLabs-Publish/PhantomCommand      tracked / root .agent present / central update observed 2026-07-08T15-58-59-04-00
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/PrehistoricRush     selected fallback / previous central update 2026-07-08T14-51-11-04-00
```

## Current route and interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domains
  -> expose PrehistoricRushComposition.snapshot()
  -> import runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> create shell, renderer, scene, terrain, raptor, rocks, shards, trees, and physics bridge
  -> menu waits for Start/Enter/Space
  -> game scene updates keyboard input, turn, yaw, boost, jump, speed, terrain, contacts, pickups, win distance, and run-over state inline
  -> src/game.js presentation pass mutates close camera, readable stride, HUD DOM, and render frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain, and renderer string
```

## DSK/domain breakdown

```txt
runtime/composition domains:
  static-browser-shell
  module-runtime-entry
  event-bus-history
  domain-host-installation
  tick-scheduler-scaffold
  composition-snapshot
  legacy-visual-runtime-bridge

entity domains:
  dino-form-domain
  dino-pose-domain
  dino-material-domain
  dino-domain-bundle

presentation domains:
  camera-domain
  hud-domain
  close-camera-apply-policy
  readable-stride-apply-policy
  HUD-DOM-projection
  presentation-pass-authority

runner domains:
  menu-scene-state
  game-scene-state
  run-over-scene-state
  win-scene-state
  runner-motion-policy
  turn-steering-policy
  jump-policy
  boost-policy
  speed-ramp-policy
  distance-score-policy

world/render domains:
  three-render-runtime
  procedural-terrain-rendering
  terrain-height-sampling
  terrain-chunk-streaming
  procedural-scatter-placement
  collider-descriptor-generation
  pickup-descriptor-generation
  raptor-visual-rig
  raptor-pose-animation
  rapier-physics-runtime
  rapier-runtime-bridge

source/result domains needed next:
  runner-source-state
  runner-moved-event
  dino-pose-event-bridge
  dino-pose-frame
  camera-frame-request
  hud-frame-request
  contact-result-snapshot
  scene-dispatch-result
  presentation-frame-record
  presentation-journal
  host-presentation-snapshot
  render-readback
  DOM-free-fixture-replay
```

## Kit services currently offered

```txt
createEventBus:
  on(type, handler)
  emit(type, payload)
  snapshot()

createDomainHost:
  install(domain)
  get(id)
  tick(dt, context)
  snapshot()

createTickScheduler:
  start()
  stop()
  snapshot()

createDinoPoseDomainKit:
  install(eventBus)
  update({ speed, turn, jump, time })
  getDescriptor()
  snapshot()

createCameraDomainKit:
  install(eventBus)
  getDescriptor()
  snapshot()

createHudDomainKit:
  install(eventBus)
  render(snapshot)
  getDescriptor()
  snapshot()

runtime-terrain-v6 route:
  terrain.update(x, z)
  terrain.sample(x, z)
  populate(app)
  createPhysics()
  setup(THREE, host)
  animateRaptor(...)
  PrehistoricRushHost.getState()
```

## Kits identified

Implemented/source-backed kits:

```txt
domain-runtime-event-bus-kit
domain-runtime-domain-host-kit
domain-runtime-tick-scheduler-kit
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle-kit
camera-domain-kit
hud-domain-kit
rapier-physics-domain-kit
```

Runtime-implied kits:

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
prehistoric-legacy-visual-runtime-kit
prehistoric-raptor-visual-rig-kit
prehistoric-terrain-streaming-kit
prehistoric-contact-check-kit
prehistoric-scene-dispatch-kit
prehistoric-hud-dom-render-kit
prehistoric-close-camera-apply-kit
```

Next-cut source/fixture kits:

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-event-bridge-kit
prehistoric-rush-dino-pose-frame-kit
prehistoric-rush-camera-frame-request-kit
prehistoric-rush-hud-frame-request-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-presentation-frame-record-kit
prehistoric-rush-presentation-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-render-readback-kit
prehistoric-rush-dom-free-presentation-fixture-kit
```

## Source file manifest to implement next

```txt
src/presentation/runner-source-state.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
src/presentation/render-readback.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Stop condition

Stop the next implementation ledge when `PrehistoricRushHost.getState().presentation` returns a bounded fixture-readable snapshot proving runner source state, runner movement events, dino pose events, camera requests, HUD requests, contact results, scene dispatch results, presentation frame records, and render readback without requiring DOM, WebGL, Rapier, browser, or `requestAnimationFrame`.
