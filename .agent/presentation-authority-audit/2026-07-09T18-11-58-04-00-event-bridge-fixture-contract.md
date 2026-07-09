# Presentation Authority Audit — Event Bridge Fixture Contract

**Timestamp:** `2026-07-09T18-11-58-04-00`

## Contract goal

Create an additive presentation authority layer that records what the live runner did and what each presentation consumer consumed.

## Required records

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
ContactResultSnapshot
SceneDispatchResult
RenderReadback
PresentationFrameRecord
PresentationJournalSnapshot
HostPresentationSnapshot
```

## Required event bridge

```txt
runner.moved
  -> dino-pose-domain-kit update(payload)
  -> dino.pose.changed
  -> DinoPoseFrame readback
```

## Required fixture rows

```txt
menu_idle
game_first_movement_frame
turn_left
turn_right
boost
jump_start
jump_recover
shard_pickup
collision_run_over
win_threshold
render_readback_unchanged
host_legacy_fields_unchanged
```

## Compatibility rule

`PrehistoricRushHost.getState()` must keep existing top-level fields stable:

```txt
scene
runner
physics
terrain
renderer
```

The next pass may add only an additive field:

```txt
presentation
```
