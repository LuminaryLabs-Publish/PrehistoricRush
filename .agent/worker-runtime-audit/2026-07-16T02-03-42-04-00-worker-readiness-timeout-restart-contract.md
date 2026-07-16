# Worker Readiness Timeout Restart Contract

**Timestamp:** `2026-07-16T02-03-42-04-00`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

The patch Worker protocol needs an owned generation, readiness gate, bounded request lifetime, complete failure-channel observation, and deterministic recovery path. The current Worker can report generator exceptions but cannot settle host-observed Worker crashes, hangs, message transport failures, stale replies, or document retirement.

## Plan ledger

**Goal:** guarantee liveness and bounded resource ownership for every patch Worker generation.

- [x] Identify current Worker and executor responsibilities.
- [x] Identify pending-promise and controller-inflight coupling.
- [x] Define readiness, deadline, cancellation, restart, fallback, and retirement rules.
- [x] Define health diagnostics and acknowledgements.
- [ ] Implement the contract.

## Generation contract

Each Worker instance must receive an immutable `workerGeneration`. All commands and responses must include it. The host must reject messages from retired generations.

```txt
created
  -> initializing
  -> ready
  -> degraded
  -> retiring
  -> retired
```

The host may dispatch asynchronous patch work only after a matching `PatchWorkerReadyResult`.

## Request contract

Each admitted request must include:

```txt
workerGeneration
controllerId
requestId
patchId
cacheKey
attempt
deadline
cancellationId
```

Each request must settle exactly once as:

```txt
generated
rejected
timed-out
cancelled
retired
```

## Failure channels

```txt
message patch-error
Worker error event
Worker messageerror event
postMessage synchronous throw
request deadline expiration
explicit cancellation
pagehide or route retirement
Worker generation replacement
```

All failure channels must reject affected pending promises and release or requeue controller inflight ownership.

## Recovery contract

```txt
first failure
  -> retire failed generation
  -> requeue unresolved active-ring requests
  -> create replacement generation
  -> wait for readiness

restart budget exhausted
  -> detach Worker executor
  -> select deferred synchronous generator
  -> publish PatchWorkerFallbackResult

fallback failure
  -> publish terminal streaming failure
  -> pause or constrain gameplay before unsafe world coverage
```

## Retirement contract

```txt
stop new dispatch
reject pending requests as retired
release controller inflight leases
remove listeners
terminate Worker
clear timers and cancellation registrations
publish PatchWorkerRetirementResult
```

## Health snapshot

```txt
workerGeneration
state
readyAt
pendingCount
oldestPendingAgeMs
completedCount
rejectedCount
timeoutCount
restartCount
fallbackActive
lastError
```

## Acknowledgements

`FirstWorkerReadyAck` proves the first admitted Worker generation is ready. `FirstRecoveredPatchAck` proves a patch that was unresolved during failure was regenerated, accepted by the current controller revision, and adopted by presentation and physics.

## Boundary

This contract is documentation only. The active Worker, executor, controller, and host remain unchanged.