# Gameplay Audit — Runner Moved / Contact / Scene Consumer Loop

**Timestamp:** `2026-07-08T21-40-45-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Current gameplay loop

```txt
menu scene
  -> click Start Rush, press Enter, or press Space
  -> app.scene becomes game

game scene
  -> A / ArrowLeft sets input.left
  -> D / ArrowRight sets input.right
  -> W / ArrowUp sets input.boost
  -> Space sets input.jump
  -> state.turn derives from left/right
  -> state.yaw mutates by turnRate
  -> state.speed ramps toward maxSpeed or boostSpeed
  -> jump mutates vy, jumpY, grounded
  -> dx/dz derive from yaw, speed, dt
  -> x/z/distance mutate inline
  -> y samples terrain height
  -> terrain chunks and scatter may repopulate
  -> Rapier actor transform updates
  -> hazard contacts can switch scene to run-over
  -> pickup contacts mutate collected and shards
  -> distance > 3600 switches scene to win
  -> baseline and readability presentation passes apply visuals
```

## Gameplay authority status

```txt
input capture: implemented inline
movement mutation: implemented inline
jump mutation: implemented inline
boost/speed ramp: implemented inline
terrain sampling: implemented inline
hazard contact: implemented inline
pickup contact: implemented inline
scene dispatch: implemented inline
runner source snapshot: missing
runner step delta: missing
runner moved event: missing live emission
contact result snapshot: missing
scene dispatch result: missing
presentation frame record: missing
host presentation projection: missing
DOM-free fixture replay: missing
```

## First consumer seam

The first useful seam is not a new gameplay mechanic.

The first useful seam is:

```txt
live game step
  -> RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved", payload)
  -> dino-pose-domain-kit receives runner.moved
  -> dino-pose-domain-kit emits dino.pose.changed
  -> DinoPoseFrame records consumer output
```

This activates a domain kit that already exists instead of creating a second animation pathway.

## Contact record shape

The next contact snapshot should record:

```txt
ContactResultSnapshot:
  frame
  sceneBefore
  sceneAfter
  hazard:
    checked
    hit
    colliderId
    reason
  pickup:
    checked
    collected
    pickupKey
    shardDelta
  runner:
    x
    z
    jumpY
  source
```

## Scene dispatch record shape

The next scene result should record:

```txt
SceneDispatchResult:
  frame
  before
  after
  reason
  accepted
  source
```

Required reasons:

```txt
start_requested
retry_requested
run_again_requested
hazard_contact
win_distance_reached
no_scene_change
```

## Fixture cases needed

```txt
01_menu_noop_has_no_runner_moved
02_start_changes_menu_to_game
03_game_turn_left_produces_runner_step_delta
04_game_turn_right_produces_runner_step_delta
05_game_boost_updates_source_state_and_delta
06_game_jump_updates_source_state_and_delta
07_runner_moved_feeds_dino_pose_changed
08_hazard_contact_records_run_over_scene_dispatch
09_pickup_contact_records_shard_delta
10_distance_goal_records_win_scene_dispatch
11_contact_snapshot_and_scene_dispatch_join_presentation_frame
12_host_projection_exposes_latest_gameplay_records
```

## Deferred gameplay work

```txt
action-frame contract
action acceptance matrix
action result journal
jump buffer authority
coyote timing authority
movement-kit extraction
terrain collision rewrite
Rapier abstraction rewrite
new obstacles
new pickups
new scene content
```

## Recommendation

Build only records and fixture proof next. Do not alter game feel, movement tuning, camera feel, scene content, or render style while proving the consumer loop.