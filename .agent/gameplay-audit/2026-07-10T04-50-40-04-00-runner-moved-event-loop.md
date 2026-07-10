# Gameplay Audit: Runner Moved Event Loop

**Timestamp:** `2026-07-10T04-50-40-04-00`

## Current gameplay loop

```txt
menu scene
  -> Start button, Enter, or Space sets app.scene = game

game frame
  -> mutate time
  -> derive turn from app.input
  -> mutate yaw
  -> ease speed toward max or boost speed
  -> process jump and gravity
  -> compute dx/dz from yaw and speed
  -> mutate x/z/distance/best/y
  -> update terrain and population
  -> set physics actor transform
  -> step physics and detect contacts
  -> direct scene change to run-over on hit
  -> direct pickup collection and shard count mutation
  -> direct scene change to win after distance threshold
  -> mutate raptor/camera/HUD/render
```

## Missing gameplay proof

```txt
no RunnerSourceState row before a frame
no RunnerStepDelta row after input and movement computation
no RunnerMovedEvent emitted to the event bus
no MovementResultRow accepted/rejected/no-change status
no ContactResultSnapshot for rock/tree hit
no PickupResultSnapshot for shard pickup
no SceneDispatchResult for menu/game/run-over/win
no BestDistanceResult for localStorage write intent
no ordered gameplay frame journal
```

## Existing useful seam

`dino-pose-domain-kit` already listens for `runner.moved` and computes a pose descriptor from speed, turn, jump, and time.

The next implementation should feed that seam rather than replacing the live game.

## Fixture rows next

```txt
menu no-run
start transition
straight movement
left turn
right turn
boost movement
jump start
falling
landed recovery
contact run-over
shard pickup
win threshold
best distance write
legacy host shape still present
```
