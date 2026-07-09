# Project Breakdown — PrehistoricRush

**Timestamp:** `2026-07-09T18-11-58-04-00`

## Selection

`LuminaryLabs-Publish/PrehistoricRush` was selected after checking the current public `LuminaryLabs-Publish` repository list and excluding `TheCavalryOfRome`.

No checked non-Cavalry repo was new, central-ledger absent, missing sampled root `.agent` state, recently added but undocumented, or otherwise undocumented. `PrehistoricRush` was the oldest eligible documented fallback by central ledger timestamp.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost({ eventBus })
  -> createTickScheduler({ host, eventBus })
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and rapier-physics-domain-kit
  -> shell() creates DOM host, status panel, and Start Rush button
  -> setup() creates Three scene, camera, renderer, terrain, raptor, rocks, shards, and tree pools
  -> state() creates mutable runner state
  -> populate() rebuilds nearby terrain props, colliders, and pickups
  -> keydown/keyup mutate app.input and scene start state
  -> loop(now) mutates movement, jump, terrain, physics, contacts, pickups, scene, and score inline
  -> baseline camera/HUD/raptor/render pass runs
  -> src/game.js presentation pass applies close camera, readable stride, HUD rewrite, and second render
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
```

## Domains in use

```txt
static-browser-shell
runtime-entry
composition-domain-host
event-bus-history
tick-scheduler-scaffold
dino-form-descriptor
dino-pose-descriptor
dino-material-descriptor
camera-descriptor
hud-descriptor
legacy-three-rapier-runtime
rapier-physics-bridge
terrain-height-sampler
terrain-chunk-rebuild
spawn-population
instanced-tree-pools
rock-collider-population
shard-pickup-population
runner-input-state
runner-motion-state
jump-gravity-state
contact-detection
scene-dispatch
score-distance-progress
legacy-camera-consumer
legacy-hud-consumer
legacy-raptor-pose-consumer
presentation-camera-pass
presentation-hud-pass
presentation-stride-pass
host-state-projection
planned-runner-source-state
planned-runner-step-delta
planned-runner-moved-event
planned-pose-readback
planned-camera-frame-request
planned-hud-frame-request
planned-contact-result-snapshot
planned-scene-dispatch-result
planned-render-readback
planned-presentation-frame-record
planned-presentation-journal
planned-host-presentation-snapshot
planned-DOM-free-fixture-gate
central-ledger-sync-domain
```

## Kit services

```txt
createEventBus:
  on / emit / snapshot with recent event history

createDomainHost:
  domain install / lookup / tick / snapshot

createTickScheduler:
  future tick-owned domain update scaffold

dino-form-domain-kit:
  dino form descriptor

dino-pose-domain-kit:
  listens for runner.moved
  emits dino.pose.changed
  returns serializable pose descriptor

dino-material-domain-kit:
  dino material descriptor

camera-domain-kit:
  close third-person camera descriptor

hud-domain-kit:
  readability HUD descriptor and render projection

rapier-physics-domain-kit:
  external Rapier configure / actor registration / step / snapshot bridge

runtime-terrain-v6 inline services:
  terrain chunk creation
  height sampling
  prop population
  collider/pickup refresh
  runner motion
  scene dispatch
  baseline camera/HUD/raptor/render consumers

src/game.js presentation services:
  readable stride rig consumer
  close camera consumer
  HUD rewrite consumer
  composition snapshot
```

## Kits identified

```txt
implemented repo-local:
  domain-runtime/event-bus
  domain-runtime/domain-host
  domain-runtime/tick-scheduler
  dino-form-domain-kit
  dino-pose-domain-kit
  dino-material-domain-kit
  dino-domain-bundle
  camera-domain-kit
  hud-domain-kit

external live:
  rapier-physics-domain-kit

runtime-implied:
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

next-cut proof:
  runner-source-state-kit
  runner-step-delta-kit
  runner-moved-event-kit
  presentation-events-kit
  dino-pose-frame-kit
  camera-frame-request-kit
  hud-frame-request-kit
  contact-result-snapshot-kit
  scene-dispatch-result-kit
  render-readback-kit
  presentation-frame-record-kit
  presentation-journal-kit
  host-presentation-snapshot-kit
  DOM-free-presentation-fixture-kit
```

## Main finding

Do not start next with terrain extraction, renderer extraction, movement rewrite, collision tuning, new art, or ProtoKit promotion.

The durable blocker is presentation event proof: `dino-pose-domain-kit` already consumes `runner.moved`, but the live `runtime-terrain-v6.mjs` loop never emits stable runner movement records, and `src/game.js` mutates camera, HUD, and raptor rig as a presentation overlay without fixture-readable readback.

## Next safe ledge

```txt
PrehistoricRush Presentation Event Bridge Readback + Host Fixture Gate
```

## Validation

Docs-only pass. Runtime source was not changed. No local package script, browser smoke, Pages smoke, or DOM-free fixture was run.
