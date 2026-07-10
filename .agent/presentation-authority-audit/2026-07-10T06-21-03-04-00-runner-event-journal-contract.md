# Presentation Authority Audit: Runner Event Journal Contract

**Run:** `2026-07-10T06-21-03-04-00`

## Authority problem

Presentation authority is split across two places:

```txt
runtime-terrain-v6.mjs
  -> animateRaptor()
  -> camera lerp/lookAt
  -> HUD innerHTML
  -> renderer.render()

src/game.js
  -> applyReadableStride()
  -> applyCloseCamera()
  -> renderHud()
  -> renderer.render()
```

Both paths mutate browser objects directly. Neither path emits serializable presentation rows.

## Current event capability

```txt
event-bus-kit
  -> on(type, handler)
  -> emit(type, payload)
  -> snapshot() with recent events

dino-pose-domain-kit
  -> install(eventBus)
  -> listens for runner.moved
  -> emits dino.pose.changed
```

## Missing contract

```txt
RunnerMovedEvent {
  id,
  frameId,
  scene,
  before,
  after,
  delta,
  input,
  accepted,
  reason,
  time
}

PresentationFrameRecord {
  frameId,
  runnerMovedEventId,
  movementResultRowId,
  dinoPoseFrameId,
  cameraFrameRequestId,
  hudFrameRequestId,
  contactRows,
  pickupRows,
  sceneRows,
  bestDistanceRows,
  renderReadback
}

HostPresentationSnapshot {
  latestFrame,
  recentFrames,
  eventCounts,
  fixtureContract,
  legacyHostPreserved
}
```

## Required compatibility rule

`PrehistoricRushHost.getState()` must keep the existing fields:

```txt
scene
runner
physics
terrain
renderer
```

Add only an additive field:

```txt
presentation
```

## Next authority cut

Make the event journal source-owned and fixture-readable before changing visuals or game feel.
