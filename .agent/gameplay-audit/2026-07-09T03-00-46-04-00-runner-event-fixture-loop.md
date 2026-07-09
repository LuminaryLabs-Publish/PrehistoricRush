# PrehistoricRush Runner Event Fixture Loop

**Timestamp:** `2026-07-09T03-00-46-04-00`

## Current gameplay loop

```txt
menu scene
  -> Start button / Enter / Space starts game
  -> left/right input changes turn flags
  -> boost input changes speed target
  -> jump input sets jump flag
  -> game loop integrates yaw, speed, jump velocity, position, distance, terrain height, and score
  -> terrain chunks rebuild near runner
  -> colliders and pickups repopulate
  -> physics actor transform updates when Rapier bridge exists
  -> hazard contact sets scene to run-over
  -> pickup contact increments shards
  -> distance over 3600m sets scene to win
  -> HUD/button reflect scene state
```

## Current authority problem

The loop is playable, but command/movement/contact/scene facts are not first-class records.

Important state transitions happen inline:

```txt
input flags mutate directly
movement mutates state directly
contacts mutate scene directly
pickups mutate shards directly
win condition mutates scene directly
HUD reads mutated state after the fact
presentation pass mutates view after the fact
```

## First gameplay proof target

The first source change should not replace gameplay authority.

It should record gameplay facts beside the existing loop:

```txt
RunnerSourceState:
  scene, x, y, z, yaw, speed, turn, jumpY, grounded, distance, shards, best, frame, time

RunnerStepDelta:
  dx, dz, distanceDelta, yawDelta, speedDelta, jumpDelta, shardDelta, sceneBefore, sceneAfter, moved

RunnerMovedEvent:
  eventType, entityId, frame, source, delta, payload for dino-pose-domain-kit

ContactResultSnapshot:
  hazardHit, pickupHit, pickupKey, contactReason, sceneRequest

SceneDispatchResult:
  previousScene, nextScene, reason, accepted
```

## Fixture row matrix

```txt
01_menu_source_state_no_movement
02_start_input_scene_changes_to_game
03_game_frame_source_state_contains_runner_position
04_game_frame_delta_reports_distance_and_yaw
05_game_frame_emits_runner_moved_when_position_changes
06_runner_moved_payload_feeds_dino_pose_domain_inputs
07_no_runner_moved_when_scene_is_menu_and_position_static
08_boost_delta_reports_speed_target_change
09_jump_delta_reports_jump_consumed_then_cleared
10_hazard_contact_records_run_over_request
11_pickup_contact_records_shard_increment
12_distance_goal_records_win_request
13_scene_dispatch_records_menu_game_run_over_win
14_presentation_frame_record_includes_gameplay_subrecords
15_host_presentation_snapshot_reports_recent_gameplay_rows
```

## Action/result deferment

Full action/result authority should remain deferred until this event bridge is proven.

The next action layer can then wrap:

```txt
start
retry
run-again
left-down
left-up
right-down
right-up
boost-down
boost-up
jump
frame-step
contact-hazard
contact-pickup
scene-dispatch
```

## Main gameplay finding

The existing playable runner should be preserved.

The next useful cut is to make the existing movement and scene loop observable through stable records, starting with `runner.moved` because the repo already has a dino pose domain consumer for that event.