# PrehistoricRush Contact/Scene Result Splice Map

**Timestamp:** `2026-07-08T14:51:11-04:00`

## Current gameplay loop

```txt
menu scene
  -> start input changes app.scene to game

game scene
  -> input mutates turn, boost, jump
  -> yaw/speed/jump/distance mutate app.state
  -> terrain chunks update around runner
  -> physics transform updates dino actor
  -> hazard contact sets app.scene = run-over
  -> pickup contact increments shards and repopulates scene
  -> distance > 3600 sets app.scene = win

result scene
  -> Space/button/Enter returns to game through start path
```

## Current inline authority

```txt
movement:
  runtime-terrain-v6.mjs loop owns dx/dz, yaw, speed, jump, grounded, distance, and best distance.

hazard contact:
  runtime-terrain-v6.mjs checks Rapier contacts and fallback collider radius hits.
  A hit directly mutates app.scene = "run-over".

pickup contact:
  runtime-terrain-v6.mjs loops current pickups.
  A pickup directly mutates collected, shards, and populate(app).

win condition:
  runtime-terrain-v6.mjs directly mutates app.scene = "win" when distance > 3600.
```

## Missing result layer

```txt
ContactResultSnapshot is missing.
SceneDispatchResult is missing.
Accepted/rejected action reasons are missing.
RunnerMovedEvent is missing.
PresentationFrameRecord is missing.
PrehistoricRushHost.getState().presentation is missing.
```

## Splice points

```txt
Before movement mutation:
  previousSource = snapshotRunnerSourceState(app)

After movement mutation:
  nextSource = snapshotRunnerSourceState(app)
  movedEvent = createRunnerMovedEvent(previousSource, nextSource)
  emit runner.moved when movedEvent.delta.distance > 0

Before hazard mutation:
  hazardResult = createContactResultSnapshot({ type: "hazard", contacts, colliders, runner })

Before pickup mutation:
  pickupResult = createContactResultSnapshot({ type: "pickup", pickups, runner })

Before scene mutation:
  sceneResult = createSceneDispatchResult({ previousScene, nextScene, reason, source })

After frame:
  frameRecord = createPresentationFrameRecord({ source, movedEvent, contactResults, sceneResult })
```

## Result shapes

```txt
RunnerMovedEvent
  type: runner.moved
  accepted: boolean
  previous: { x, y, z, yaw, speed, distance, jumpY, grounded }
  next: { x, y, z, yaw, speed, distance, jumpY, grounded }
  delta: { x, z, distance, yaw, speed }
  reason

ContactResultSnapshot
  accepted: boolean
  kind: hazard | pickup | none
  contactId
  runnerPosition
  candidate
  reason
  mutationAllowed

SceneDispatchResult
  accepted: boolean
  previousScene
  nextScene
  reason
  source
  mutationAllowed
```

## Required reasons

```txt
runner.scene-not-game
runner.no-delta
runner.moved
jump.accepted-grounded
jump.rejected-airborne
boost.accepted-held
turn.accepted-left
turn.accepted-right
contact.none
contact.hazard-rapier
contact.hazard-fallback-collider
contact.pickup-shard
scene.menu-start
scene.run-over-hazard
scene.win-distance-goal
scene.retry
scene.unchanged
```

## Fixture rows

```txt
01_menu_scene_runner_source_does_not_emit_moved_delta
02_game_scene_runner_source_emits_runner_moved
03_jump_grounded_records_accepted_reason
04_jump_airborne_records_rejected_reason
05_hazard_rapier_records_run_over_scene_dispatch
06_hazard_fallback_records_run_over_scene_dispatch
07_pickup_records_shard_contact_result
08_distance_goal_records_win_scene_dispatch
09_no_contact_records_no_mutation_reason
10_scene_dispatch_result_preserves_previous_and_next_scene
```

## Next implementation warning

Do not rebalance speed, terrain, hazards, pickups, jump, boost, or scene flow in the next pass.

Only record the current decisions first.
