# Gameplay Audit: Runner Event Result Ledger Loop

Timestamp: 2026-07-10T10-38-55-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Current gameplay loop

```txt
menu scene
  -> Start button / Enter / Space
  -> game scene
  -> input flags
  -> speed, yaw, boost, jump, gravity
  -> terrain sample and chunk update
  -> physics/contact check
  -> pickup check
  -> win/run-over dispatch
  -> best distance update
  -> raptor pose, camera, HUD, render
```

## Gameplay proof gap

The loop is playable, but accepted/rejected/no-change rows are missing for input, movement, jump, contact, pickup, scene transition, and best-distance writes.

## Required gameplay rows

```txt
menu_no_run_frame
start_transition_result
straight_movement_result
left_turn_result
right_turn_result
boost_movement_result
jump_start_result
jump_rejected_airborne_result
falling_frame_result
grounded_recovery_result
contact_run_over_result
pickup_result
win_threshold_result
best_distance_write_result
```

## Safe implementation shape

Create pure row builders first, then wire the live frame loop to emit rows. Preserve current game feel while adding proof.

## Next safe ledge

```txt
Runner event result ledger + DOM-free fixture rows
```
