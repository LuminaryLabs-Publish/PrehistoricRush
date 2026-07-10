# Gameplay Audit: Runner Event Journal Proof Loop

**Timestamp:** `2026-07-10T09-18-53-04-00`

## Current gameplay loop

```txt
menu
  -> Start button / Enter / Space
  -> game
  -> keydown/keyup mutate input flags
  -> frame loop mutates yaw, speed, jump, x/z, distance, y sample, terrain update, spawn population
  -> physics actor transform and optional physics step
  -> contact check may set run-over
  -> shard pickup may mutate collected/shards and repopulate
  -> distance threshold may set win
  -> best distance mutates localStorage-derived value
  -> camera/HUD/render update
```

## Gameplay proof gaps

```txt
start transition has no result row
keyboard input has no accepted/rejected/no-op row
movement has no source delta row
jump accepted vs rejected while airborne has no reason code
contact has no ContactResultSnapshot
pickup has no PickupResultSnapshot
win/run-over scene dispatch has no SceneDispatchResult
best-distance write has no BestDistanceResult
runner.moved is not emitted
```

## Existing useful seam

`dino-pose-domain-kit` consumes `runner.moved` and emits `dino.pose.changed`. This means the next safe cut is not a gameplay rewrite; it is a source event bridge and journal.

## Fixture rows needed

```txt
menu no-run frame
start transition
straight movement
left turn
right turn
boost movement
jump start
jump rejected/no-op while airborne
falling frame
grounded recovery
rock/tree contact to run-over
shard pickup
win threshold
best distance write
host state preserves old shape
presentation frame keeps source frame id
```
