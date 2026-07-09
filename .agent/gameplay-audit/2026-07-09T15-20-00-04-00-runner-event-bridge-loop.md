# Gameplay Audit: Runner Event Bridge Loop

**Timestamp:** `2026-07-09T15-20-00-04-00`

## Current gameplay loop

```txt
menu scene
  -> Start Rush button / Enter / Space
  -> game scene
  -> A/D or ArrowLeft/ArrowRight update turn flags
  -> W/ArrowUp updates boost flag
  -> Space updates jump flag
  -> loop(now) advances speed, yaw, velocity, jump, x/z, distance, best, y height
  -> terrain update/populate refreshes chunks, colliders, pickups, instances
  -> physics actor transform updates
  -> contact result can set scene to run-over
  -> shard pickup increments shards and repopulates
  -> distance > 3600 sets scene to win
  -> baseline/presentation camera, HUD, raptor pose, render pass update
```

## Current problem

Gameplay works, but it is not source-recorded.

The live loop mutates runner state and scene state directly. The DSK scaffold can accept movement facts through `runner.moved`, but the live loop never emits the stable movement event.

## Required event bridge

```txt
previous RunnerSourceState
current RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent payload {
       speed,
       turn,
       jump,
       time
     }
  -> eventBus.emit("runner.moved", payload)
  -> dino-pose-domain-kit update(payload)
  -> dino.pose.changed event
  -> DinoPoseFrame readback
```

## Gameplay records needed

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
ContactResultSnapshot
SceneDispatchResult
PresentationFrameRecord
PresentationJournalSnapshot
HostPresentationSnapshot
```

## Branch coverage needed

```txt
menu_idle
start_to_game
first_forward_movement
turn_left
turn_right
boost
jump_start
jump_recover
shard_pickup
no_contact_continue
collision_run_over
win_threshold
retry_after_run_over
```

## Non-goals

```txt
No new enemies.
No new pickup types.
No new win condition.
No terrain retune.
No input rewrite.
No movement rewrite.
No physics replacement.
```

## Gameplay finding

The runner should keep playing exactly as it does today while a source-owned ledger proves what happened each frame.

Only after the event bridge fixture passes should movement, contact, pickup, or scene dispatch be extracted into reusable kits.
