# Gameplay Audit: Start/Retry World-State Loop

**Timestamp:** `2026-07-11T02-48-17-04-00`

## Goal

Map gameplay behavior across initial start, collision failure, retry and win restart.

## Current loop

```txt
menu/run-over/win input
  -> start()
  -> game.start()
  -> initialRunState with incremented runId and empty collectedShardIds
  -> updateStreaming(state, true)
  -> controller state and adapter state are reused
  -> engine.tick resumes movement
```

## Correctly reset

```txt
position, yaw and movement state
elapsed and distance
jump and grounded state
surface and route progress
shard count and collectedShardIds
lastCollision
input resource
scene transition
```

## Not transactionally reset

```txt
visible shard instances and pickup list
active gameplay/Rapier colliders
actor/contact state
patch activation and release state
pending Worker deliveries
height-source/consumer revision
camera and render-local state
browser key latches outside the game resource
host journals and first-frame proof
```

## Concrete failure mode

```txt
run 1 starts near origin
  -> player collects an origin-area shard
  -> refreshDynamicContent removes it
  -> player fails without changing active patch set
  -> retry resets collectedShardIds
  -> updateStreaming yields no release and no activation
  -> refreshDynamicContent is not called
  -> shard remains visually absent in run 2
```

The same missing transaction prevents exact proof that hazards, physics contacts and height sampling correspond to the new run on its first tick.

## Required gameplay result

```txt
run-start-result:
  accepted
  previousRunSessionId
  runSessionId
  runId
  streamEpoch
  retainedWorldState
  resetConsumers
  rebuiltConsumers
  rejectedStaleResults
  firstCommittedFrameId
```
