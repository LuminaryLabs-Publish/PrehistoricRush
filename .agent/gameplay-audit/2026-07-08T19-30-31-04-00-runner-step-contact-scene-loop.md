# PrehistoricRush Runner Step / Contact / Scene Loop Audit

**Timestamp:** `2026-07-08T19-30-31-04-00`

## Scope

Gameplay audit for the current `PrehistoricRush` runner loop.

This is not a gameplay expansion request. It is a proof map for wrapping existing movement, contact, pickup, and scene transitions in fixture-readable records.

## Current gameplay loop

```txt
menu scene
  -> Start Rush button / Enter / Space starts game

game scene
  -> A or ArrowLeft sets input.left
  -> D or ArrowRight sets input.right
  -> W or ArrowUp sets input.boost
  -> Space sets input.jump
  -> yaw/speed/jump/position/distance mutate app.state
  -> terrain sample updates runner ground y
  -> terrain chunk update can repopulate colliders and pickups
  -> Rapier actor transform updates if physics bridge is available
  -> hazard contact or physics contact sets scene = run-over
  -> pickup contact increments shards and repopulates
  -> distance > 3600 sets scene = win

run-over or win scene
  -> button text changes
  -> next start input returns to game behavior through existing start path
```

## Missing gameplay authority records

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
ContactResultSnapshot
SceneDispatchResult
PresentationFrameRecord
```

## RunnerStepDelta target

```txt
RunnerStepDelta {
  version
  frame
  sceneBefore
  sceneAfter
  moved
  dx
  dz
  distanceDelta
  yawDelta
  speedDelta
  jumpYDelta
  groundedBefore
  groundedAfter
  shardDelta
  input: {
    left
    right
    boost
    jump
  }
  reason
}
```

## ContactResultSnapshot target

```txt
ContactResultSnapshot {
  version
  frame
  hazard: {
    checked
    hit
    source
    colliderId
    reason
  }
  pickup: {
    checked
    collected
    key
    shardDelta
    reason
  }
}
```

## SceneDispatchResult target

```txt
SceneDispatchResult {
  version
  frame
  oldScene
  newScene
  changed
  reason
  source
}
```

## Fixture rows

```txt
01_menu_start_dispatches_game_scene
02_menu_no_movement_creates_noop_runner_step_delta
03_left_right_input_changes_turn_delta
04_boost_input_changes_speed_delta
05_jump_input_changes_jump_state_when_grounded
06_game_move_creates_runner_moved_event
07_hazard_contact_creates_run_over_scene_result
08_pickup_contact_creates_shard_delta_without_scene_change
09_distance_goal_creates_win_scene_result
10_host_snapshot_projects_latest_gameplay_records
```

## Stop line

Keep all current gameplay values intact.

Do not tune speed, jump, boost, goal distance, terrain, hazard radius, pickup radius, scene names, or input mapping in the fixture pass.
