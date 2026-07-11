# Gameplay Audit: Runtime Configuration and Scene Authority Loop

**Timestamp:** `2026-07-10T21-00-16-04-00`

## Current loop

```txt
menu
  -> Start Rush
  -> partial reset
  -> game
  -> movement and travel-distance accumulation
  -> run-over on contact or win at travel distance >= 3600
  -> Retry / Run Again
  -> partial reset
```

## Scene-authority mismatch

`game-scenes.json` declares menu, game, run-over, and win scenes plus named transitions and scene files. The runtime does not load that document. It mutates `state.scene` directly:

```txt
start -> game
contact -> run-over
distance threshold -> win
button -> start or jump
```

The declared `run-over:menu`, `win:menu`, and external scene-file paths are not consumed by the active route.

## Tuning-authority mismatch

The runtime and deployed tuning document disagree:

```txt
base speed       runtime 16    declared 13.5
max speed        runtime 26    declared 24
boost speed      runtime 31    declared 29
turn rate        runtime 2.25  declared 2.45
chunk size       runtime 56    declared 44
chunk segments   runtime 30    declared 20
```

A successful edit to `runner-tuning.json` cannot change the active game.

## Outcome and persistence follow-on

The runtime updates `state.best` in memory but does not write it back to local storage. Restart also preserves speed, jump, time, surface smoothing, shard count, and collected IDs.

Travel distance is the win authority. It increases for all movement, including movement away from or around the route. A future progress service should distinguish:

```txt
travel distance
monotonic route progress
current route index
goal completion
run result
best persisted result
```

## Required fixture rows

```txt
resolved tuning source
resolved scene source
transition request/result
travel distance
route progress
terminal reason
run result
persistence write result
restart result
```

Population capacity remains the current runtime gate. These gameplay rows become reliable after the source contract identifies the values the run actually used.
