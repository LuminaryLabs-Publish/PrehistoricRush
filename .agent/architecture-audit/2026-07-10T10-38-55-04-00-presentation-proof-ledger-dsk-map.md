# Architecture Audit: Presentation Proof Ledger DSK Map

Timestamp: 2026-07-10T10-38-55-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Architecture read

The repo has a useful event-bus/domain-host DSK wrapper and dinosaur/camera/HUD domain kits, but the live runner still bypasses the event-proof layer.

## Current route map

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> event bus / domain host / tick scheduler
  -> dino form / pose / material domains
  -> camera / HUD domains
  -> dino-pose-domain-kit listens for runner.moved
  -> src/runtime-terrain-v6.mjs
  -> Three.js CDN
  -> Rapier CDN
  -> rapier-physics-domain-kit CDN
  -> shell / HUD / Start button
  -> runner frame loop
  -> secondary presentation pass
  -> PrehistoricRushHost.getState()
```

## DSK/service families

```txt
event-bus
domain-host
tick-scheduler
dino-form
dino-pose
dino-material
camera-domain
hud-domain
rapier-physics-domain-kit
legacy-visual-runtime
runner-input
runner-motion
runner-turn-yaw
runner-jump-gravity
runner-terrain-stream
runner-spawn-population
runner-contact
runner-pickup
runner-scene-dispatch
runner-score
best-distance-storage
raptor-render-adapter
presentation-camera-consumer
presentation-hud-consumer
presentation-raptor-stride-consumer
render-submission
host-state-projection
```

## Proof gap

The architecture has the right event consumer (`dino-pose-domain-kit`), but not the event producer. The live runner should emit stable source and result rows before visual or movement changes.

## Needed proof architecture

```txt
runner-source-state-kit
runner-step-delta-kit
runner-moved-event-kit
input-result-row-kit
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
dom-free-runner-event-fixture-kit
```

## Boundary rule

Add proof rows additively. Do not rewrite terrain, movement, renderer, pickups, or dino visuals until `runner.moved` and host presentation readback are fixture-proven.
