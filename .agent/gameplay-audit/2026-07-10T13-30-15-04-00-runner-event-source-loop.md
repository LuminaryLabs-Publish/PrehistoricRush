# Gameplay Audit: Runner Event Source Loop

**Timestamp:** `2026-07-10T13-30-15-04-00`

## Current gameplay loop

```txt
menu scene
  -> Start button / Enter / Space sets app.scene = game
  -> frame loop reads app.input
  -> mutates turn, yaw, speed, jump, gravity, x/z, distance
  -> samples terrain height
  -> updates terrain chunks and spawn population
  -> steps Rapier bridge
  -> checks colliders and pickups
  -> mutates scene to run-over or win
  -> updates best distance
  -> mutates raptor, camera, HUD, renderer
```

## Gameplay proof gaps

```txt
start transition is direct mutation
left/right/boost/jump inputs have no result rows
jump rejection while airborne has no no-op row
movement has no accepted/no-change/rejected row
contact has no ContactResultSnapshot row
pickup collection has no PickupResultSnapshot row
win/run-over transitions have no SceneDispatchResult row
best-distance localStorage write has no BestDistanceResult row
```

## Existing useful DSK hook

`dino-pose-domain-kit` already subscribes to `runner.moved` and can emit `dino.pose.changed`, but the live runner never sends a stable `runner.moved` payload from the frame loop.

## Next safe gameplay work

Create a DOM-free runner source fixture that proves the frame loop can produce stable rows before any movement feel or content changes.
