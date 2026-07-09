# PrehistoricRush Gameplay Audit: Runner Event Contact Scene Loop

**Timestamp:** `2026-07-08T21-50-56-04-00`

## Gameplay loop today

```txt
menu scene
  -> Start Rush / Enter / Space
  -> game scene
  -> runner moves forward over procedural terrain
  -> keyboard controls turn, jump, and boost
  -> terrain chunks rebuild around runner
  -> hazards can end run
  -> pickups increment shards
  -> distance target can trigger win
  -> run-over or win scene
  -> retry returns to game/menu flow
```

## Current gameplay authority

`src/runtime-terrain-v6.mjs` is still the gameplay authority for movement, hazards, pickups, terrain sampling, distance goal, scene changes, and most per-frame mutation.

`src/game.js` adds presentation authority after the fact by reading `PrehistoricRushHost.app` and mutating camera, HUD, raptor stride, and render output.

## Current action/input surface

```txt
keyboard left/right
keyboard jump/start/retry
keyboard boost
button Start Rush
button run-again/retry behavior through current shell
scene state: menu / game / run-over / win
```

## Gameplay domains

```txt
scene-transition-authority
runner-motion-policy
runner-source-state-contract
runner-step-delta-contract
runner-moved-event-contract
turn-steering-policy
jump-policy
boost-policy
speed-ramp-policy
distance-score-policy
terrain-height-sampling
terrain-chunk-streaming
kinematic-actor-transform
hazard-contact-detection
pickup-contact-detection
distance-goal-detection
contact-result-contract
scene-dispatch-result-contract
action-frame-contract-later
action-result-contract-later
```

## Gameplay services needed next

```txt
snapshotRunnerSourceState(app)
createRunnerStepDelta(previous, current)
createRunnerMovedEvent(delta)
createContactResultSnapshot({ previous, current, scene, shards, hazards, pickups })
createSceneDispatchResult({ previousScene, nextScene, reason })
appendPresentationJournalEntry(record)
projectHostPresentationSnapshot(journal)
```

## Current gap by gameplay phase

```txt
menu:
  needs scene-dispatch result for start/retry.

game movement:
  needs RunnerSourceState and RunnerStepDelta.

game move event:
  needs RunnerMovedEvent and eventBus runner.moved emission.

pickup:
  needs ContactResultSnapshot with shard reason.

hazard:
  needs ContactResultSnapshot with run-over reason.

win:
  needs SceneDispatchResult with distance-goal reason.

presentation:
  needs DinoPoseFrame, CameraFrameRequest, HudFrameRequest, RenderReadback, and PresentationFrameRecord.
```

## Fixture rows

```txt
01_menu_state_has_no_runner_moved
02_start_scene_dispatch_records_menu_to_game
03_forward_step_creates_runner_source_delta
04_turn_step_records_yaw_delta
05_jump_step_records_jump_delta
06_boost_step_records_speed_delta
07_pickup_step_records_shard_delta
08_hazard_step_records_run_over_contact
09_win_step_records_distance_goal_scene_dispatch
10_runner_moved_event_can_feed_dino_pose_domain
11_presentation_frame_includes_contact_and_scene_fields
12_host_snapshot_exposes_latest_and_recent_records
```

## Do not do next

```txt
- Do not re-balance speed, jump, boost, or terrain generation in the docs pass.
- Do not replace input handling yet.
- Do not promote run-movement-kit before local fixture proof.
- Do not replace scene flow before scene dispatch records exist.
```

## Next gameplay ledge

Add the gameplay source records as pure projection modules first, then wire them additively into the current presentation pass.
