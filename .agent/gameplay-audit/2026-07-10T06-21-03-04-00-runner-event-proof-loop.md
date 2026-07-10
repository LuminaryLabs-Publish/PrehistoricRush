# Gameplay Audit: Runner Event Proof Loop

**Run:** `2026-07-10T06-21-03-04-00`

## Current gameplay loop

```txt
menu scene
  -> Start button, Enter, or Space sets app.scene = "game"

game scene frame
  -> mutate time
  -> derive turn from keyboard flags
  -> mutate yaw
  -> ease speed toward boost or max speed
  -> consume jump input if grounded
  -> apply gravity
  -> integrate jumpY
  -> integrate x/z movement
  -> increase distance
  -> update best distance
  -> sample terrain height
  -> rebuild/populate terrain
  -> push dino transform into Rapier actor
  -> inspect Rapier/local contacts
  -> set run-over on hit
  -> inspect pickups and mutate shards/collected
  -> set win past 3600m
  -> mutate raptor pose, camera, HUD, render
```

## Gameplay proof gap

Gameplay works, but the run loop does not record action/result rows.

Missing rows:

```txt
start transition result
keyboard input snapshot
runner source state
runner step delta
movement accepted row
jump accepted/rejected row
grounding result row
terrain rebuild row
contact result snapshot
pickup result snapshot
scene dispatch result
best-distance write result
win threshold result
run-over threshold result
```

## Event mismatch

The source DSK has an event consumer:

```txt
dino-pose-domain-kit listens for runner.moved
```

The gameplay loop never emits:

```txt
runner.moved
```

That means the domain pose proof and the visual pose are disconnected.

## Fixture cases

```txt
menu no-run frame
start transition
straight movement
left turn
right turn
boost movement
jump start
falling frame
grounded recovery
rock/tree contact to run-over
shard pickup
win threshold
best-distance write
legacy host shape preserved
presentation pass does not erase source frame ids
```

## Next gameplay ledge

```txt
PrehistoricRush Runner Event Host Fixture Refresh + DOM-Free Presentation Gate
```
