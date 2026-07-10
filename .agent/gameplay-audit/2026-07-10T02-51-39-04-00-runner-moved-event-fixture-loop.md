# Gameplay Audit: Runner Moved Event Fixture Loop

**Timestamp:** `2026-07-10T02-51-39-04-00`

## Current gameplay loop

```txt
menu
  -> Start button / Enter / Space
  -> scene = game

game frame
  -> read app.input flags
  -> mutate turn and yaw
  -> approach target speed / boost speed
  -> apply jump impulse if grounded
  -> integrate gravity and jumpY
  -> move x/z by yaw and speed
  -> increase distance
  -> sample terrain height
  -> stream terrain chunks and repopulate instances
  -> update physics actor transform
  -> check Rapier or fallback contacts
  -> set scene = run-over on hit
  -> check shard pickups and mutate collected/shards
  -> set scene = win after distance threshold
  -> apply raptor pose, camera, HUD, and render
```

## Current event gap

`dino-pose-domain-kit` consumes `runner.moved`, but the live gameplay loop does not emit it.

The live gameplay loop should produce a stable event row before pose, camera, HUD, contact, pickup, scene, or render consumers run.

## Required fixture path

```txt
RunnerSourceState
  -> RunnerStepDelta
  -> MovementResultRow
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved", event)
  -> dino-pose-domain-kit consumes event
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> PickupResultSnapshot
  -> SceneDispatchResult
  -> BestDistanceResult
  -> RenderReadback
  -> PresentationFrameRecord
  -> PresentationJournal
  -> HostPresentationSnapshot
```

## Fixture rows to cover

```txt
menu no-run frame
start transition
straight movement
left turn
right turn
boost movement
jump start
falling frame
grounded recovery
rock/tree contact to run-over
shard pickup
win threshold
best distance write
legacy host shape preserved
```

## Gameplay guardrail

Do not retune movement values next.

First prove the existing movement behavior as rows.
