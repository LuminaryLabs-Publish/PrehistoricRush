# Gameplay Audit: Retry and Stale Worker Session Loop

**Timestamp:** `2026-07-11T12-39-53-04-00`

## Summary

Retry resets product run state and camera targets, but it reuses the same patch controller, Worker/executor, cache, active consumers, Rapier world, input object, Three adapter and RAF loop. There is no run/stream epoch that prevents earlier asynchronous patch work from affecting the restarted run.

## Plan ledger

**Goal:** define retry as an admitted run transaction rather than three direct method calls.

- [x] Trace retry entry points.
- [x] Trace state retained across retry.
- [x] Record stale asynchronous delivery risk.
- [x] Define run/stream reset proof.
- [ ] Implement after P0 route/profile authority.

## Current retry loop

```txt
button / Enter / Space
  -> start()
  -> game.start()
  -> updateStreaming(game.getState(), true)
       controller.setFocus
       controller.update
       release delivery
       generateSync center
       controller.pump
       ready patch activation
  -> adapter.resetCamera
```

## Retained owners

```txt
runtime session identity: implicit and unchanged
patch controller: retained
patch cache and desired sets: retained
Worker: retained
executor callbacks: retained
Rapier world and actor: retained
fixed collider set: retained until streaming rebuild
Three resources: retained
adapter view.time and shard rotation: retained
browser input object: retained
RAF and listeners: retained
public host references: retained
```

## Stale delivery scenario

```txt
run A queues patch request
  -> player fails
  -> retry starts run B
  -> no stream epoch changes
  -> run A Worker response arrives
  -> executor/controller accepts requestId
  -> ready delivery can activate into run B consumers
```

Even when immutable patch content is reusable, delivery authority must be re-admitted under run B's stream epoch before it changes active terrain, vegetation, pickups, colliders or height sampling.

## Required retry transaction

```txt
RetryCommand
  runtimeSessionId
  expectedRunSessionId
  observedTerminalStatus

admission
  -> allocate next runSessionId
  -> allocate next streamEpoch
  -> retire/fence old queued and inflight deliveries
  -> classify immutable cache retention
  -> reset product input/state
  -> reset Rapier actor/contact state
  -> rebuild dynamic pickup/collider consumers
  -> reset camera and frame-local animation state
  -> commit run B
  -> publish first frame receipt
```

## Required results

```txt
RetryResult
  accepted/rejected/stale/duplicate
  previousRunSessionId
  runSessionId
  streamEpoch
  retainedPatchCount
  retiredRequestCount
  staleResultCount
  physicsResetRevision
  cameraResetRevision
  firstFrameId
```

## Fixture matrix

```txt
retry with no inflight work
retry with queued work
retry with inflight Worker success
retry with inflight Worker error
late response after retry commit
multiple rapid retry commands
retry during STOPPING/DISPOSING
retained cache content re-admitted under new epoch
```
