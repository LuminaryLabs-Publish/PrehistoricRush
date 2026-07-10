# Presentation Authority Audit: Host Presentation Journal Contract

**Timestamp:** `2026-07-10T01-31-29-04-00`

## Authority gap

`src/game.js` creates the DSK composition and also applies a second presentation pass.

The pass improves readability, but it mutates rig, camera, HUD, and renderer directly without a source-owned presentation journal.

## Current presentation pass

```txt
startPresentationPass()
  -> reads globalThis.PrehistoricRushHost.app
  -> styleHud(app.ui)
  -> applyReadableStride(app)
  -> applyCloseCamera(app, app.THREE, dt)
  -> renderHud(app)
  -> app.view.renderer.render(app.view.scene, app.view.camera)
```

## Contract needed

```txt
RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> MovementResultRow
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> PickupResultSnapshot
  -> SceneDispatchResult
  -> BestDistanceResult
  -> RenderReadback
  -> PresentationFrameRecord
  -> PresentationJournalSnapshot
  -> HostPresentationSnapshot
```

## Host readback target

Add this additively:

```txt
PrehistoricRushHost.getState()
  -> scene
  -> runner
  -> physics
  -> terrain
  -> renderer
  -> presentation
       -> version
       -> latestFrame
       -> recentFrames
       -> eventCounts
       -> movementRows
       -> renderReadback
       -> fixtureContract
```

## Fixture rows needed

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

## Compatibility rules

```txt
Do not remove existing PrehistoricRushHost fields.
Do not change visible movement feel while adding proof.
Do not delete the current presentation pass until source-owned frame records replace it.
Do not promote to ProtoKit before DOM-free fixture rows exist.
```

## Next safe ledge

```txt
PrehistoricRush Movement Event Readback Catch-up + Host Presentation Fixture Gate
```
