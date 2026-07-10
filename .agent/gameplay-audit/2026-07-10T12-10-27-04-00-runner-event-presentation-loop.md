# Gameplay Audit: Runner Event Presentation Loop

**Timestamp:** `2026-07-10T12-10-27-04-00`

## Current gameplay loop

```txt
menu scene
  -> Start button / Enter / Space
  -> game scene
  -> key input flags
  -> turn/yaw/speed/jump mutation
  -> terrain height sample
  -> terrain rebuild / spawn population
  -> Rapier actor transform and contact fallback
  -> contact can set run-over
  -> pickup can collect shard and repopulate
  -> distance can set win
  -> best distance writes through localStorage-backed state
  -> render and HUD update
```

## Gameplay proof gap

```txt
start transition has no scene-dispatch row
left/right/boost input has no input result row
jump accepted/rejected has no result row
movement accepted/no-change has no movement result row
terrain refresh has no source frame row
contact/run-over has no ContactResultSnapshot
pickup/shard increment has no PickupResultSnapshot
win threshold has no SceneDispatchResult
best distance write has no BestDistanceResult
```

## Next fixture rows

```txt
menu no-run frame
start transition
straight movement
left turn
right turn
boost movement
jump start
jump rejected while airborne
falling frame
grounded recovery
contact to run-over
shard pickup
win threshold
best distance write
legacy host shape preserved
```

## Recommendation

Keep gameplay feel unchanged. Add proof rows around the existing loop and expose them through `PrehistoricRushHost.getState().presentation` before adding or retuning mechanics.
