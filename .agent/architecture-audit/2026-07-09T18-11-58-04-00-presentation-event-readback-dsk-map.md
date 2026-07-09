# Architecture Audit — Presentation Event Readback DSK Map

**Timestamp:** `2026-07-09T18-11-58-04-00`

## Current architecture

```txt
index.html
  -> src/runtime.mjs
    -> src/game.js
      -> domain-runtime/event-bus.js
      -> domain-runtime/domain-host.js
      -> domain-runtime/tick-scheduler.js
      -> domains/dino/*
      -> domains/camera/camera-domain-kit.js
      -> domains/hud/hud-domain-kit.js
      -> runtime-terrain-v6.mjs
        -> Three.js CDN
        -> Rapier CDN
        -> rapier-physics-domain-kit CDN
```

## Boundary read

The repo already has a useful DSK scaffold. The live game still runs through `runtime-terrain-v6.mjs`, and `src/game.js` applies presentation consumers after the live runtime.

The next boundary should not extract renderer or physics. It should create source records that prove what the live runtime and presentation pass consumed.

## Source-backed domains

```txt
event-bus-history
composition-domain-host
tick-scheduler-scaffold
dino-form-descriptor
dino-pose-descriptor
dino-material-descriptor
camera-descriptor
hud-descriptor
```

## Live inline domains

```txt
legacy-three-rapier-runtime
terrain-height-sampler
terrain-chunk-rebuild
spawn-population
runner-input-state
runner-motion-state
jump-gravity-state
contact-detection
pickup-consumption
scene-dispatch
score-distance-progress
legacy-camera-consumer
legacy-hud-consumer
legacy-raptor-pose-consumer
presentation-camera-pass
presentation-hud-pass
presentation-stride-pass
host-state-projection
```

## Next DSK map

```txt
runner-source-state-kit
  -> clones serializable runner state from app.state

runner-step-delta-kit
  -> compares previous/current runner source states

runner-moved-event-kit
  -> creates eventBus payload for dino-pose-domain-kit

presentation-events-kit
  -> owns stable event names and payload contracts

dino-pose-frame-kit
  -> records pose readback from dino pose descriptor

camera-frame-request-kit
  -> records close-camera intent before Three.js mutation

hud-frame-request-kit
  -> records HUD projection before DOM mutation

contact-result-snapshot-kit
  -> records hit, pickup, and no-op branches

scene-dispatch-result-kit
  -> records menu/game/run-over/win transitions

render-readback-kit
  -> records frame consumption without becoming renderer authority

presentation-journal-kit
  -> stores bounded proof history

host-presentation-snapshot-kit
  -> adds additive PrehistoricRushHost.getState().presentation

DOM-free-presentation-fixture-kit
  -> validates rows without DOM, WebGL, Three.js, or Rapier
```
