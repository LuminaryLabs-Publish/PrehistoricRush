# Gameplay Audit: Runner Moved Replay Freeze

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T03-10-05-04-00`

## Current gameplay loop

```txt
menu scene waits for Start/Enter/Space
  -> game scene accepts left/right/boost/jump flags
  -> yaw updates from turn input
  -> speed eases toward maxSpeed or boostSpeed
  -> jump applies vertical velocity if grounded
  -> gravity reduces vertical velocity
  -> x/z moves from yaw and speed
  -> distance and best update from movement delta
  -> terrain height samples runner y
  -> terrain chunks and scatter rebuild around current chunk
  -> Rapier kinematic actor transform is updated
  -> Rapier step and fallback collider checks decide hit
  -> pickups increment shards and repopulate
  -> distance > 3600 sets win
  -> run-over/win/menu states update HUD button text
```

## Gameplay authority currently inline

```txt
start/retry/run-again behavior
input flags
turn steering
yaw integration
speed ramp
boost target speed
jump start
vertical integration
grounded state
terrain sample
movement delta
distance scoring
best distance localStorage write path
hazard hit detection
pickup collection
run-over scene transition
win scene transition
HUD button text policy
```

## Missing deterministic records

```txt
ActionFrame later
RunnerSourceState now
RunnerStepDelta now
RunnerMovedEvent now
ContactResultSnapshot now
SceneDispatchResult now
PresentationFrameRecord now
```

## First replay freeze

The next cut should not attempt to rewrite all gameplay actions.

Freeze only the frame-to-frame runner movement and presentation chain:

```txt
previous source snapshot
current source snapshot
delta result
movement event decision
movement event payload
dino pose consumer result
camera request
HUD request
contact result
scene result
render readback
host presentation snapshot
```

## Required no-regression facts

```txt
menu scene still does not advance distance
Start button still starts the game
Enter still starts the game
Space still starts or jumps depending on scene
left/right still turns
boost still increases target speed
jump still only starts while grounded
hit still sets run-over
pickup still increments shards
3600m still sets win
legacy getState fields stay present
```

## Fixture rows for gameplay

```txt
01_menu_no_movement_delta
02_game_forward_movement_delta
03_turn_left_delta_records_yaw_change
04_boost_delta_records_speed_target_change
05_jump_delta_records_vertical_start
06_runner_moved_emitted_on_game_movement
07_runner_moved_not_emitted_for_menu_noop
08_hazard_contact_records_run_over_reason
09_pickup_contact_records_shard_reason
10_win_scene_dispatch_records_distance_goal
11_scene_state_is_unchanged_by_projection_layer
12_legacy_input_behavior_preserved
```

## Main finding

The game loop should first become observable, not rewritten.

The existing `dino-pose-domain-kit` is already the ideal first consumer because it proves the event bridge without moving movement ownership yet.
