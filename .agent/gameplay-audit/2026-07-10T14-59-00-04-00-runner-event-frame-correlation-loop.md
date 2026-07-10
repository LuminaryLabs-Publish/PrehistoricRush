# Gameplay audit: runner event frame correlation loop

Timestamp: `2026-07-10T14-59-00-04-00`

## Gameplay loop

```txt
menu
  -> start transition
  -> input flags
  -> speed / yaw / jump / gravity
  -> position delta
  -> terrain sampling and population
  -> physics actor update
  -> contact check
  -> pickup check
  -> win/run-over transition
  -> best-distance update
  -> raptor pose / camera / HUD / render
```

## Current proof gap

The loop mutates state directly. It does not emit typed rows for accepted input, rejected jump, movement delta, contact, pickup, scene transition, or best-distance write.

## Required gameplay rows

```txt
InputResultRow
MovementResultRow
RunnerMovedEvent
ContactResultSnapshot
PickupResultSnapshot
SceneDispatchResult
BestDistanceResult
PresentationFrameRecord
```

## Fixture cases

```txt
menu no-run frame
start transition
straight movement
left/right turn
boost movement
jump accepted
jump rejected while airborne
contact to run-over
shard pickup
win threshold
best-distance write
```

## Next safe ledge

```txt
PrehistoricRush Runner Frame Correlation Source Ledger Refresh + DOM-Free Host Fixture Gate
```