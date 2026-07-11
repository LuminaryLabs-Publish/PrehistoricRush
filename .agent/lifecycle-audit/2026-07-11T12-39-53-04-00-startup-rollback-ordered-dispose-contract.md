# Lifecycle Audit: Startup Rollback and Ordered Dispose Contract

**Timestamp:** `2026-07-11T12-39-53-04-00`

## Summary

A runtime session must own every acquisition from the first module-dependent resource through the final global lease. Startup must commit only after required owners are ready, and failure/disposal must execute the same reverse cleanup stack with stable idempotent results.

## Plan ledger

**Goal:** define one lifecycle contract for normal startup, partial failure, retry, stop and disposal.

- [x] Define lifecycle phases.
- [x] Define acquisition and cleanup order.
- [x] Define retry/epoch relationship.
- [x] Define terminal result and idempotency.
- [ ] Implement and fixture-test later.

## Lifecycle phases

```txt
CREATED
STARTING
RUNNING
RESTARTING
STOPPING
DISPOSING
DISPOSED
FAILED
```

## Cleanup stack rule

Immediately after each successful acquisition, push its cleanup operation and identity onto the stack. Never acquire the next subsystem before the prior cleanup is registered.

```txt
module graph validation
engine/product domain
Rapier owner
patch generator
Worker/executor owner
patch controller
camera controller
Three resource owner
listener leases
RAF lease
public host lease
```

## Startup commit

`RUNNING` may be published only when:

```txt
required modules validated
engine composition installed
product domain available
physics actor ready or explicit degraded policy accepted
patch generator/controller ready
camera controller ready
Three renderer/resources ready
callbacks leased
RAF scheduled
host observation lease ready
cleanup stack complete
```

## Startup rollback

On failure:

```txt
reject new commands
cancel RAF if scheduled
remove listeners if attached
revoke host if published
retire controller/executor requests
terminate Worker
release physics
release Three resources/canvas
release engine-owned product resources by contract
publish FAILED with cleanup rows
```

Rollback failures are reported but do not stop later cleanup rows from executing.

## Retry contract

Retry is not full runtime disposal. It is a child run transaction under the same live runtime session:

```txt
runtimeSessionId retained
runSessionId advanced
streamEpoch advanced
old async delivery fenced
immutable cache retained only by policy
input/physics/camera/dynamic content reset
first new frame acknowledged
```

## Terminal disposal order

```txt
1. transition to STOPPING
2. revoke start/retry/input admission
3. cancel RAF and retire callbacks
4. revoke public host command capability
5. retire patch/controller/executor work
6. terminate Worker
7. dispose Rapier actor/colliders/world
8. dispose Three resources and remove canvas
9. close remaining page/profile resources owned by session
10. clear or freeze bounded journals
11. transition to DISPOSED
```

## Idempotent result

```txt
RuntimeDisposeResult
  runtimeSessionId
  accepted
  alreadyDisposed
  phaseBefore
  phaseAfter
  stoppedFrameId
  retiredListenerCount
  retiredWorkerRequestCount
  workerTerminated
  physicsDisposed
  threeDisposed
  canvasRemoved
  hostRevoked
  cleanupRows[]
  failures[]
```

Repeated `dispose()` calls return the same terminal identity and do not reacquire or release resources twice.

## Post-dispose rule

Every command, callback and asynchronous result after `DISPOSED` returns or records a typed `runtime-disposed` rejection. No game tick, patch activation, physics step, render or host mutation is permitted.
