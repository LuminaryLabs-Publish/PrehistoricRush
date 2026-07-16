# Worker Failure Streaming Stall Loop

**Timestamp:** `2026-07-16T02-03-42-04-00`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

The runner continues advancing while patch generation is asynchronous. If a required Worker request remains unresolved, gameplay has no owned policy for slowing, pausing, rerouting, retrying, or switching generation lanes before the player reaches unavailable world content.

## Plan ledger

**Goal:** keep the active run coherent when asynchronous world generation degrades or fails.

- [x] Trace player motion into patch focus and prefetch.
- [x] Trace Worker requests into controller inflight state.
- [x] Confirm gameplay continues independently of Worker health.
- [x] Identify the missing degraded-stream and fallback policy.
- [ ] Execute run-under-fault fixtures.

## Current loop

```txt
player keeps running
  -> controller focus advances
  -> new active/prefetch patches are requested
  -> Worker settles requests normally
  -> patches activate before arrival
```

## Failure loop

```txt
Worker request hangs or Worker crashes
  -> one or more patches remain inflight
  -> duplicate generation is suppressed
  -> runner continues advancing
  -> desired patch readiness can fall behind player motion
  -> no gameplay admission result changes speed, pause or route
  -> no synchronous fallback is activated
```

## Required gameplay policy

```txt
healthy
  -> normal generation and movement

degraded
  -> publish bounded readiness deficit
  -> prioritize active-ring recovery
  -> optionally constrain speed before unsafe coverage

recovering
  -> restart Worker or switch to synchronous generation
  -> reject stale responses
  -> acknowledge first recovered patch

failed
  -> present explicit failure/retry or safe pause
  -> never continue into unowned world state silently
```

## Required results

```txt
PatchCoverageResult
PatchWorkerDegradedResult
PatchWorkerFallbackResult
PatchWorkerRecoveryResult
UnsafeStreamingAdvanceRejected
```

## Boundary

No actual gameplay stall or world-coverage failure was reproduced. The source permits continued movement without a typed Worker-health or patch-readiness admission policy.