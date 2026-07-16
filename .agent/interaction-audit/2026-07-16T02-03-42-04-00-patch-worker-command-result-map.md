# Patch Worker Command Result Map

**Timestamp:** `2026-07-16T02-03-42-04-00`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

The current Worker protocol has initialization, request, success, and request-error messages, but the host does not convert Worker readiness, transport failure, timeout, cancellation, replacement, or retirement into typed results.

## Plan ledger

**Goal:** make every Worker interaction terminal, correlated, revision-bound, and safe to retry.

- [x] Map current messages.
- [x] Map missing admission and terminal results.
- [x] Bind request settlement to controller inflight ownership.
- [x] Define stale-generation rejection.
- [ ] Implement the protocol and fixtures.

## Current message map

```txt
host -> Worker
  init-patch-worker { payload }
  generate-patch { requestId, request }

Worker -> host
  patch-worker-ready
  patch-generated { requestId, patch }
  patch-error { requestId, error }
```

## Current omissions

```txt
host does not await patch-worker-ready
ready message has no Worker generation or capability descriptor
request has no deadline or cancellation token
executor has no error/messageerror listener
executor has no timeout
late response has no Worker-generation check
controller has no inflight release/requeue command
host has no restart or fallback command
retirement has no result
```

## Required command/result map

```txt
CreatePatchWorkerCommand
  -> PatchWorkerReadyResult | PatchWorkerStartFailureResult

GeneratePatchCommand
  -> PatchGeneratedResult
  -> PatchRejectedResult
  -> PatchTimeoutResult
  -> PatchCancelledResult
  -> PatchWorkerRetiredResult

RetirePatchWorkerCommand
  -> reject all pending requests
  -> release controller inflight leases
  -> terminate Worker
  -> PatchWorkerRetirementResult

RecoverPatchWorkerCommand
  -> bounded restart
  -> PatchWorkerRecoveryResult
  -> or PatchWorkerFallbackResult
```

## Correlation fields

```txt
documentGeneration
runtimeGeneration
controllerId
controllerRevision
workerGeneration
requestId
patchId
cacheKey
deadline
attempt
resultSequence
```

## Settlement rule

Exactly one terminal result must be published for every admitted request. Any late or duplicate response after terminal settlement must be rejected without changing controller, renderer, or physics state.