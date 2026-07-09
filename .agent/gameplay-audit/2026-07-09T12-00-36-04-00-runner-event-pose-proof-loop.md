# Gameplay Audit: Runner Event Pose Proof Loop

**Timestamp:** `2026-07-09T12-00-36-04-00`

## Current gameplay loop

```txt
menu
  -> Start / Enter / Space
  -> game
  -> A/D or Left/Right turns
  -> W/Up boosts
  -> Space jumps
  -> terrain streaming follows runner position
  -> trees and rocks become colliders
  -> shard proximity increments shard count
  -> collision switches scene to run-over
  -> distance over 3600m switches scene to win
  -> Retry / Run Again through same Start button path
```

## Current authority location

Most live gameplay authority still lives in `src/runtime-terrain-v6.mjs`:

```txt
input state
speed target
turn rate
yaw integration
jump/gravity integration
distance accumulation
terrain sampling
chunk rebuild triggers
spawn population
collider list
pickup list
scene transitions
score/best persistence
```

The repo-local DSK composition scaffold exists, but gameplay state is not yet emitted as stable events.

## Existing proof hook

`dino-pose-domain-kit` already has the right seam:

```txt
eventBus.on("runner.moved", ...)
  -> update pose
  -> eventBus.emit("dino.pose.changed", pose)
```

The missing link is a live `runner.moved` event emitted from runner state deltas.

## Gameplay proof target

```txt
RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> dino pose update
  -> DinoPoseFrame
  -> camera/HUD/contact/scene/render readback
  -> host presentation snapshot
```

## Fixture rows needed

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
```

## Main risk

A fixture layer that mutates movement would become a second gameplay authority. The next pass must only read, normalize, emit, and record facts from the existing route until parity is proven.

## Acceptance target

The next implementation succeeds when the live route still plays the same, and the fixture can prove that the source state generated expected movement/pose/presentation records without needing WebGL or the DOM.
