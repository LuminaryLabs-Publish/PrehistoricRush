# Architecture Audit: Runner Event Host Fixture DSK Map

**Run:** `2026-07-10T06-21-03-04-00`

## Current DSK shape

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
     -> event-bus-kit
     -> domain-host-kit
     -> tick-scheduler-kit
     -> dino-form-domain-kit
     -> dino-pose-domain-kit
     -> dino-material-domain-kit
     -> camera-domain-kit
     -> hud-domain-kit
     -> composition.ready event
     -> src/runtime-terrain-v6.mjs
        -> Three.js CDN
        -> Rapier CDN
        -> rapier-physics-domain-kit CDN
        -> live runner frame loop
        -> PrehistoricRushHost.getState()
```

## Domain boundaries

```txt
event-bus
  owns: event registration, event emission, recent event history
  gap: live runner emits no runner.moved records

domain-host
  owns: domain installation, lookup, tick fan-out, installed snapshots
  gap: scheduler is created but live runner owns its own requestAnimationFrame loop

dino domains
  owns: form, pose, material descriptors
  gap: live pose consumer is not fed by live runner movement

camera domain
  owns: close third-person preset descriptor
  gap: runtime and presentation pass mutate camera directly

hud domain
  owns: target distance and HUD model rendering helper
  gap: runtime and presentation pass mutate DOM directly

legacy visual runtime
  owns: terrain, runner motion, contacts, pickups, score, localStorage, scene dispatch, raptor rig, camera, HUD, render, host state
  gap: no source-owned frame rows
```

## DSK blocker

The repo has a promising source-side DSK shell, but the live runtime has not crossed the proof seam.

`dino-pose-domain-kit` subscribes to `runner.moved`; `runtime-terrain-v6.mjs` computes runner movement and raptor animation inline without emitting that event.

## Required source facts

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
MovementResultRow
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
ContactResultSnapshot
PickupResultSnapshot
SceneDispatchResult
BestDistanceResult
RenderReadback
PresentationFrameRecord
PresentationJournalSnapshot
HostPresentationSnapshot
```

## Target architecture

```txt
runtime frame inputs
  -> RunnerSourceState
  -> RunnerStepDelta
  -> MovementResultRow
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit consumes event
  -> presentation frame rows are recorded
  -> PrehistoricRushHost.getState().presentation exposes serializable readback
  -> DOM-free fixture proves rows and legacy host compatibility
```

## Do not start first

```txt
visual expansion
terrain rewrite
movement retune
renderer extraction
new pickups
ProtoKit promotion
```
