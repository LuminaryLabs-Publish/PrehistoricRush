# Gameplay Audit: Runner Event Journal Proof Loop

Timestamp: 2026-07-10T07-50-29-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Current gameplay loop

```txt
menu scene
  -> Start button, Enter, or Space starts game
  -> keydown/keyup mutate input flags
  -> frame loop updates speed, turn, yaw, jump, position, distance
  -> terrain streaming and spawn population update
  -> Rapier and fallback contacts can set run-over
  -> pickups increment shards
  -> distance over 3600 sets win
  -> localStorage best distance mutates inline
```

## Proof gap

Gameplay transitions are direct mutations. There are no rows for movement, jump accept/reject, contact, pickup, scene dispatch, or best-distance writes.

## Required gameplay rows

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
MovementResultRow
ContactResultSnapshot
PickupResultSnapshot
SceneDispatchResult
BestDistanceResult
```

## Fixture rows to cover

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
legacy host shape preserved
```

## Next safe ledge

```txt
PrehistoricRush Runner Event Journal Readback Catch-up + DOM-Free Presentation Gate
```
