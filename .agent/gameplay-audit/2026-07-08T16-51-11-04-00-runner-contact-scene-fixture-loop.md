# PrehistoricRush Runner Contact Scene Fixture Loop

**Timestamp:** `2026-07-08T16-51-11-04-00`

## Gameplay surface

The current playable loop is an infinite runner shell with menu, active run, run-over, win, retry, and return-to-menu behavior.

The next proof should describe the loop without changing it.

## Current gameplay loop

```txt
menu scene
  -> player starts run
  -> game scene begins
  -> input drives turn / jump / boost
  -> runner state updates speed, yaw, position, jumpY, distance, shards, and best distance
  -> terrain chunks stream around player
  -> hazard contact can cause run-over
  -> pickup contact can add shards
  -> distance threshold can cause win
  -> retry or run-again returns to game
  -> menu returns to menu
```

## Current authority gap

The current gameplay loop mutates outcome state directly in `runtime-terrain-v6.mjs`.

That is acceptable while the route is being preserved, but the next implementation needs stable records for the results of runner movement, contact detection, pickup collection, and scene dispatch.

## Needed gameplay contracts

```txt
RunnerSourceState
  -> source frame copied from app.state

RunnerMovedEvent
  -> emitted only when live movement produces meaningful state delta

ContactResultSnapshot
  -> hazard contact result
  -> pickup contact result
  -> no-contact result
  -> reason codes

SceneDispatchResult
  -> menu_to_game
  -> game_to_run_over
  -> game_to_win
  -> run_over_to_game
  -> win_to_game
  -> any_to_menu

PresentationFrameRecord
  -> runner source
  -> movement event
  -> contact result
  -> scene dispatch result
  -> dino pose frame
  -> camera request
  -> HUD request
  -> render readback
```

## Stable reason rows to add next

```txt
accepted_start_run
accepted_retry_run
accepted_run_again
accepted_return_menu
accepted_runner_moved
unchanged_menu_no_runner_move
accepted_jump
rejected_jump_not_ready
accepted_boost
unchanged_boost_not_pressed
accepted_pickup_shard
unchanged_no_pickup_contact
accepted_hazard_run_over
unchanged_no_hazard_contact
accepted_distance_win
unchanged_distance_goal_not_reached
```

## Implementation boundary

Add source records and fixture rows first.

Do not add new enemies, new pickups, new terrain systems, new UI, or new win conditions until the current loop can be replayed as data.
