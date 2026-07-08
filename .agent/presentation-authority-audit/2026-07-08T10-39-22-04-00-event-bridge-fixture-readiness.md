# PrehistoricRush Event Bridge Fixture Readiness

**Timestamp:** `2026-07-08T10:39:22-04:00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

## Purpose

This audit narrows the next implementation from a broad presentation source wire map into a concrete event bridge and fixture gate.

The next change should prove that the live runner can feed the already-installed domain scaffold without changing current visuals.

## Source-backed seam

`src/game.js` installs:

```txt
createEventBus
createDomainHost
createTickScheduler
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
camera-domain-kit
hud-domain-kit
```

`dino-pose-domain-kit` already subscribes to:

```txt
runner.moved
```

and emits:

```txt
dino.pose.changed
```

The live route in `runtime-terrain-v6.mjs` does not yet emit `runner.moved`.

## Current mismatch

```txt
live movement facts exist in app.state
presentation facts are applied through direct mutation
existing event bus is mostly scaffold telemetry
existing dino pose domain can consume runner.moved
host snapshot lacks presentation records
no DOM-free fixture can prove the chain
```

## Target chain

```txt
previous app.state + current app.state
  -> RunnerSourceState
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit update(payload)
  -> eventBus.emit("dino.pose.changed")
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
```

## Record contracts

### RunnerSourceState

```txt
scene
frame
time
dt
x
y
z
jumpY
speed
yaw
turn
distance
shards
grounded
best
terrainChunkCount
rapierEnabled
```

### RunnerMovedEvent

```txt
type: runner.moved
accepted: true | false
reason: moved | menu-paused | missing-host | unchanged-frame
source: RunnerSourceState
movementDelta:
  dx
  dz
  distanceDelta
  yawDelta
  speedDelta
  jumpDelta
```

### DinoPoseFrame

```txt
sourceEventType
poseVersion
phase
speed
turn
jump
hips
chest
head
legs
arms
tail
```

### CameraFrameRequest

```txt
presetVersion
distance
height
lookAhead
lookHeight
followSharpness
sourcePosition
requestPosition
lookTarget
```

### HudFrameRequest

```txt
descriptorVersion
scene
progress
distance
targetDistance
speed
shards
best
debug
```

### PresentationFrameRecord

```txt
frame
scene
runnerSource
runnerMoved
dinoPoseFrame
cameraFrameRequest
hudFrameRequest
fallbacks
at
```

## Fixture rows

```txt
01_menu_scene_no_runner_moved
02_game_scene_runner_moved_emitted
03_runner_moved_updates_dino_pose_domain
04_dino_pose_changed_recorded_as_frame
05_camera_frame_request_uses_camera_domain_descriptor
06_hud_frame_request_uses_hud_domain_descriptor
07_presentation_frame_record_contains_all_subrecords
08_host_snapshot_exposes_presentation_latest_and_recent
09_dom_free_replay_does_not_require_webgl_or_rapier
10_renderer_compatibility_stays_unchanged
```

## Required host addition

Additive only:

```txt
PrehistoricRushHost.getState().presentation = {
  latest,
  recent,
  eventBridge: {
    runnerMovedEmitted,
    dinoPoseChangedObserved,
    frameCount
  }
}
```

Do not remove existing fields:

```txt
scene
runner
physics
terrain
renderer
```

## Stop condition

The next implementation ledge is complete only when a DOM-free fixture can prove the target chain without needing DOM, WebGL, Rapier execution, animation frame timing, or live keyboard events.

## Do not cross yet

```txt
- Do not extract terrain streaming before this bridge exists.
- Do not promote run-movement-kit before RunnerSourceState and RunnerMovedEvent are fixture-stable.
- Do not replace the renderer before camera/HUD frame requests are fixture-stable.
- Do not change game feel during this pass.
```
