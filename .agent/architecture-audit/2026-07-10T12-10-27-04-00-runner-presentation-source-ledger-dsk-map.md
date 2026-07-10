# Architecture Audit: Runner Presentation Source Ledger DSK Map

**Timestamp:** `2026-07-10T12-10-27-04-00`

## Current DSK chain

```txt
src/game.js
  -> event-bus-kit
  -> domain-host-kit
  -> tick-scheduler-kit
  -> dino-form-domain-kit
  -> dino-pose-domain-kit
  -> dino-material-domain-kit
  -> camera-domain-kit
  -> hud-domain-kit
  -> src/runtime-terrain-v6.mjs
  -> rapier-physics-domain-kit from CDN
```

## Source-of-truth split

```txt
DSK composition source
  event bus, domain install, scheduler snapshot, dino/camera/HUD descriptors

Live runner source
  runtime-terrain-v6 owns input, movement, terrain, spawn, contact, pickup, scenes, score, best-distance, raptor pose, camera, HUD, render

Presentation override source
  game.js owns readable stride, close camera, HUD DOM rewrite, second render submission

Host readback source
  PrehistoricRushHost.getState() returns aggregate scene, runner, physics, terrain count, renderer label
```

## Current architecture risk

The architecture has an event bus, but the live frame loop is not using it as source ledger authority. `dino-pose-domain-kit` subscribes to `runner.moved`, while the actual runner mutates pose directly and never records the source event consumed by that kit.

## Required next DSK layer

```txt
runner-source-state-kit
  captures previous/current runner state without DOM or Three.js

runner-step-delta-kit
  turns input + dt + tuning into deterministic movement deltas

runner-moved-event-kit
  emits stable runner.moved payloads for dino-pose-domain-kit

input-result-row-kit
  records key state, accepted/no-op, and reason

movement-result-row-kit
  records accepted/rejected/no-change movement result

contact-result-snapshot-kit
pickup-result-snapshot-kit
scene-dispatch-result-kit
best-distance-result-kit
  convert inline side effects into readable proof rows

presentation-frame-record-kit
  links source frame id to pose, camera, HUD, and render rows

host-presentation-snapshot-kit
  exposes JSON-safe readback through PrehistoricRushHost.getState().presentation
```

## Architecture recommendation

Add the source ledger and host readback as an additive layer. Do not change camera feel, terrain generation, speed tuning, spawn tuning, or visuals until the DOM-free fixture can prove the current behavior path.
