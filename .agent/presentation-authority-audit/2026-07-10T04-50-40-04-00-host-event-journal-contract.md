# Presentation Authority Audit: Host Event Journal Contract

**Timestamp:** `2026-07-10T04-50-40-04-00`

## Authority problem

Presentation authority is split between the live runtime and the add-on presentation pass.

```txt
runtime-terrain-v6
  -> owns movement source state
  -> owns raptor pose mutation
  -> owns camera mutation
  -> owns HUD mutation
  -> owns renderer submission

src/game.js presentation pass
  -> owns readable stride mutation
  -> owns close camera mutation
  -> owns HUD rewrite
  -> owns second renderer submission
```

## Required contract

Add an additive journal that does not change game feel first.

```txt
RunnerSourceState
  -> RunnerStepDelta
  -> MovementResultRow
  -> RunnerMovedEvent
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> RenderReadback
  -> PresentationFrameRecord
  -> HostPresentationSnapshot
```

## Host readback target

```txt
PrehistoricRushHost.getState().presentation = {
  fixtureContract,
  latestFrame,
  recentFrames,
  eventCounts,
  movementRows,
  contactRows,
  pickupRows,
  sceneRows,
  bestDistanceRows,
  renderReadback
}
```

## Compatibility rule

Preserve existing host fields:

```txt
scene
runner
physics
terrain
renderer
```

The new presentation block must be additive.

## Main finding

The event-bus architecture exists, but it is not the live authority path yet. The next useful work is to prove live runner movement through source-backed event rows and host readback, then wire the visual consumers to those records.
