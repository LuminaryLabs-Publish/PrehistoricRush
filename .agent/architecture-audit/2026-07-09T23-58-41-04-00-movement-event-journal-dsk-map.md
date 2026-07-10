# Architecture Audit — Movement Event Journal DSK Map

**Timestamp:** `2026-07-09T23-58-41-04-00`

## Current architecture

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> domain runtime scaffold
  -> dino/camera/HUD domain kits
  -> src/runtime-terrain-v6.mjs
  -> live Three.js/Rapier runner
```

## Current DSK scaffold

```txt
event-bus-kit:
  on / emit / snapshot / recent event history

domain-host-kit:
  idempotent install / get / tick / snapshot

tick-scheduler-kit:
  host ticking scaffold

dino-pose-domain-kit:
  consumes runner.moved
  emits dino.pose.changed
  owns dino pose descriptor

camera-domain-kit:
  owns close camera preset descriptor

hud-domain-kit:
  owns target distance, progress, and HUD projection record
```

## Live runtime bypass

`runtime-terrain-v6.mjs` still owns all gameplay mutation inline:

```txt
input flags
speed target
turn and yaw
jump velocity and grounded state
position and distance
terrain rebuild
collider population
pickup collection
scene dispatch
best-distance save
raptor pose
camera frame
HUD DOM
renderer submission
```

## Boundary finding

The architectural cut should be an additive journal layer:

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
MovementResultRow
ContactResultSnapshot
PickupResultSnapshot
SceneDispatchResult
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
RenderReadback
PresentationFrameRecord
PresentationJournal
HostPresentationSnapshot
```

## Next DSK flow

```txt
runtime current state
  -> RunnerSourceState
  -> RunnerStepDelta
  -> MovementResultRow
  -> runner.moved event
  -> dino-pose-domain-kit consumes event
  -> DinoPoseFrame record
  -> CameraFrameRequest + HudFrameRequest
  -> RenderReadback
  -> PresentationFrameRecord
  -> PresentationJournal
  -> PrehistoricRushHost.getState().presentation
```

## Non-goals

```txt
Do not retune movement.
Do not replace terrain streaming.
Do not rewrite raptor visuals.
Do not extract renderer first.
Do not promote to shared ProtoKit before fixture rows exist.
```
