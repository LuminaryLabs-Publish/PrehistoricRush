# PrehistoricRush Gameplay Audit - RunnerMoved Consumer Loop

**Timestamp:** `2026-07-09T00-09-22-04-00`

## Current gameplay loop

```txt
menu scene
  -> Start button, Enter, or Space starts game
  -> game scene samples keyboard input
  -> left/right mutate turn and yaw
  -> boost changes speed target
  -> jump applies vertical velocity when grounded
  -> position, distance, best distance, and terrain height mutate inline
  -> terrain rebuild and scatter repopulate as the runner moves
  -> Rapier actor transform updates
  -> collision or collider proximity can switch scene to run-over
  -> shard pickup increments shards and repopulates pickups
  -> distance over 3600 switches scene to win
  -> renderer and HUD update
```

## Current gameplay authority problem

The live route has playable behavior, but there are no stable gameplay records for the first consumer bridge.

Current missing records:

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
ContactResultSnapshot
SceneDispatchResult
PresentationFrameRecord
```

## First gameplay bridge

The first gameplay bridge should be `runner.moved`.

Reason:

```txt
src/domains/dino/dino-pose-domain-kit.js already listens for runner.moved
runner.moved can be derived from app.state deltas without changing player controls
runner.moved activates an existing consumer instead of creating another parallel animation path
runner.moved gives a narrow fixture row before full action/result extraction
```

## RunnerMoved event target

```txt
RunnerMovedEvent:
  type: runner.moved
  runnerId: dino
  frame
  scene
  sourceState
  delta:
    dx
    dz
    distanceDelta
    yawDelta
    speedDelta
    jumpDelta
    shardDelta
  poseInput:
    speed
    turn
    jump
    time
  emitted: boolean
  reason: moved | menu_noop | scene_not_game | no_position_delta
```

## Gameplay fixture rows

```txt
01_menu_frame_does_not_emit_runner_moved
02_game_frame_with_position_delta_emits_runner_moved
03_runner_moved_payload_matches_live_state_delta
04_runner_moved_payload_updates_dino_pose_domain
05_dino_pose_changed_event_is_readable_after_runner_moved
06_pickup_contact_result_records_shard_increment
07_hazard_contact_result_records_run_over_reason
08_scene_dispatch_result_records_game_to_run_over
09_scene_dispatch_result_records_game_to_win
10_presentation_frame_record_includes_gameplay_subrecords
```

## What stays blocked

```txt
full ActionFrame extraction
full ActionResult journal
movement runtime rewrite
terrain extraction
collider extraction
shared run-movement-kit promotion
renderer replacement
```

Those should wait until the runner movement consumer fixture proves the seam.
