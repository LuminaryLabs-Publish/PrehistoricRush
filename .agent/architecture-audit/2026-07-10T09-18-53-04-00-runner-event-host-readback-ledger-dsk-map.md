# Architecture Audit: Runner Event Host Readback Ledger DSK Map

**Timestamp:** `2026-07-10T09-18-53-04-00`

## Current architecture shape

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
     -> event-bus-kit
     -> domain-host-kit
     -> tick-scheduler-kit
     -> dino form / pose / material kits
     -> camera-domain-kit
     -> hud-domain-kit
     -> import src/runtime-terrain-v6.mjs
  -> src/runtime-terrain-v6.mjs
     -> Three.js CDN
     -> Rapier CDN
     -> rapier-physics-domain-kit CDN
     -> live runner frame loop
     -> PrehistoricRushHost.getState()
```

## DSKs present

```txt
event-bus-kit
  services: on, emit, snapshot, recent event history

domain-host-kit
  services: install, get, tick, snapshot

tick-scheduler-kit
  services: start, stop, host.tick bridge, scheduler snapshot

dino-form-domain-kit
  services: raptor proportions, silhouette descriptor, feature-set descriptor, snapshot

dino-pose-domain-kit
  services: runner.moved consumer, dino.pose.changed emitter, pose update, getDescriptor, snapshot

dino-material-domain-kit
  services: palette descriptor, style descriptor, snapshot

dino-domain-bundle-kit
  services: dino form/pose/material exports, bundle helper

camera-domain-kit
  services: close third-person camera preset, getDescriptor, snapshot

hud-domain-kit
  services: target distance, progress, HUD model render, getDescriptor, snapshot

rapier-physics-domain-kit
  services: Rapier world bridge, kinematic actor, contact snapshot
```

## Runtime-owned domains still needing source proof

```txt
keyboard-input
runner-motion
runner-turn-yaw
runner-jump-gravity
runner-terrain-stream
runner-contact
runner-pickup
runner-score
best-distance-storage
scene-dispatch
raptor-render-adapter
presentation-camera-consumer
presentation-hud-consumer
presentation-raptor-stride-consumer
render-submission
host-state-projection
```

## Main seam

`dino-pose-domain-kit` is architecturally ready to consume `runner.moved`, but the live runtime does not emit it.

The next architecture cut should be additive:

```txt
runtime frame state
  -> RunnerSourceState
  -> RunnerStepDelta
  -> InputResultRow
  -> MovementResultRow
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
```

## Do not change first

```txt
visual style
terrain generator
movement tuning
renderer architecture
pickup economy
ProtoKit packaging
```
