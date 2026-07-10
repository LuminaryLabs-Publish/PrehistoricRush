# Gameplay audit: restart and scene lifecycle loop

Timestamp: `2026-07-10T16-28-47-04-00`

## Declared lifecycle

```txt
menu -> game -> run-over -> menu/retry
game -> win -> menu/run-again
```

## Live lifecycle

```txt
menu
  -> Start / Enter / Space
  -> app.scene = game

game
  -> contact
  -> app.scene = run-over

game
  -> distance > 3600
  -> app.scene = win

run-over or win
  -> button / Space
  -> app.scene = game
  -> existing runner state continues
```

## Restart gap

The live `start()` function changes only the scene string. It does not reset:

```txt
position
distance
speed
yaw
jump state
contact state
pickups
collected Set
terrain population
session time
win threshold
run-over cause
```

Best distance should persist, but session state should not.

## Required transaction

```txt
RestartTransaction
  commandId
  previousSessionId
  nextSessionId
  sourceFrameId
  reason: retry | run_again
  preserved: bestDistance
  reset: runner session fields
  result: accepted | rejected
```

## Acceptance rule

After Retry or Run Again, the first authoritative game frame must begin with a fresh session state and must not immediately re-enter the previous terminal scene unless a new collision or win condition occurs.
