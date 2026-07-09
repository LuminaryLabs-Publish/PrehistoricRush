# Presentation Authority Audit: Host Projection Fixture Freeze

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T06-10-35-04-00`

## Authority problem

The game is playable, but presentation authority is not yet fixture-readable.

Current state:

```txt
src/game.js can access PrehistoricRushHost.app
src/game.js can mutate HUD, raptor stride, camera, and renderer frame
src/game.js does not snapshot the live runner source before mutation
src/game.js does not emit runner.moved
src/game.js does not read back dino.pose.changed
src/game.js does not append a presentation journal
src/game.js does not expose PrehistoricRushHost.getState().presentation
```

## Existing consumer opportunity

`dino-pose-domain-kit` already listens for `runner.moved` and emits `dino.pose.changed`.

That means the first useful authority cut is not another raptor animation path.

The first useful cut is a bridge that emits the existing event shape from live runner state and proves the existing domain consumes it.

## Required source contract

```txt
RunnerSourceState:
  scene
  frame
  time
  x
  y
  z
  jumpY
  grounded
  yaw
  turn
  speed
  distance
  shards
  input

RunnerStepDelta:
  previous
  current
  dx
  dz
  distanceDelta
  yawDelta
  speedDelta
  jumpDelta
  shardDelta
  sceneChanged

RunnerMovedEvent:
  type: runner.moved
  payload: { speed, turn, jump, time, x, y, z, yaw, distance }
  reason

DinoPoseFrame:
  sourceEvent
  poseEvent
  descriptor

PresentationFrameRecord:
  runnerSource
  runnerDelta
  runnerMovedEvent
  dinoPoseFrame
  cameraFrameRequest
  hudFrameRequest
  contactResultSnapshot
  sceneDispatchResult
  renderReadback
```

## Host projection contract

```txt
PrehistoricRushHost.getState().presentation.latestFrame
PrehistoricRushHost.getState().presentation.recentFrames
PrehistoricRushHost.getState().presentation.eventBus
PrehistoricRushHost.getState().presentation.fixtureRows
PrehistoricRushHost.getState().presentation.warnings
```

## Freeze rule

Keep all existing top-level host fields intact:

```txt
scene
runner
physics
terrain
renderer
```

Add presentation diagnostics only as a nested additive field.

## Source files to add next

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Finding

The next source pass should be additive and diagnostic-first.

It should not replace `runtime-terrain-v6.mjs` yet. It should prove source-to-consumer behavior around the existing route.
