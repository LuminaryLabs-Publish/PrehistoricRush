# Gameplay Audit — Runner Movement Result Loop

**Timestamp:** `2026-07-09T23-58-41-04-00`

## Current gameplay loop

```txt
if scene === game
  -> time += dt
  -> turn from input.left/input.right
  -> yaw += turn * turnRate * dt
  -> speed eases toward boostSpeed or maxSpeed
  -> Space jump sets vy when grounded
  -> gravity mutates vy
  -> jumpY integrates and clamps to zero
  -> dx/dz from yaw and speed
  -> x/z mutate
  -> distance and best mutate
  -> terrain sample sets y
  -> terrain update or every 8 frames repopulates colliders and pickups
  -> Rapier actor transform updates
  -> Rapier step and manual collider distance test detect hit
  -> hit dispatches scene = run-over
  -> pickup distance mutates collected set and shards
  -> distance > 3600 dispatches scene = win
```

## Missing result rows

```txt
No RunnerSourceState before row.
No RunnerStepDelta row.
No MovementResultRow for accepted movement.
No MovementResultRow for menu/no-run frame.
No JumpResultRow.
No GroundedRecovery row.
No ContactResultSnapshot.
No PickupResultSnapshot.
No SceneDispatchResult.
No BestDistanceWriteResult.
No WinThresholdResult.
```

## Event bridge gap

`dino-pose-domain-kit` is already ready for:

```txt
eventBus.emit("runner.moved", { speed, turn, jump, time })
```

The live runtime does not emit that event. It computes raptor pose and applies render transforms directly.

## Fixture rows needed

```txt
menu_no_run_frame
start_transition_frame
straight_movement_frame
left_turn_frame
right_turn_frame
boost_frame
jump_start_frame
falling_frame
grounded_recovery_frame
contact_run_over_frame
pickup_frame
win_threshold_frame
best_distance_write_frame
legacy_host_shape_preserved
```

## Next safe ledge

```txt
PrehistoricRush Movement Event Journal + Presentation Fixture Gate
```
