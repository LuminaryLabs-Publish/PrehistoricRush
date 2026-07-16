# Patch Worker Liveness Recovery DSK Map

**Timestamp:** `2026-07-16T02-03-42-04-00`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

Patch identity and desired-world state are owned by the seeded patch controller, patch content is owned by the product generator, and execution is delegated to a Worker adapter. The missing boundary is a lifecycle authority that guarantees every admitted Worker request settles and that failed Worker generations cannot permanently retain controller inflight ownership.

## Plan ledger

**Goal:** place readiness, request settlement, failure recovery, fallback, and retirement at one explicit domain boundary.

- [x] Preserve the patch controller as patch identity and queue authority.
- [x] Preserve the product generator as content authority.
- [x] Preserve the Worker as an execution adapter.
- [x] Identify unresolved pending promises as the liveness boundary.
- [x] Define command, result, health, fallback, and acknowledgement surfaces.
- [ ] Implement the authority and fixtures.

## Current DSK path

```txt
seeded-world-patch-controller-kit
  -> make deterministic patch request
  -> mark record inflight
  -> message-worker-executor-adapter-kit
  -> prehistoric-patch-worker
  -> patch-generated or patch-error message
  -> settle promise
  -> ready patch
  -> Three.js/Rapier adoption
```

## Failure path

```txt
Worker error, messageerror, hang or lost response
  -> no executor settlement
  -> pending promise remains
  -> controller record remains inflight
  -> enqueue suppresses duplicate work
  -> no restart or fallback transition
  -> no ready patch
```

## Required DSK path

```txt
PatchWorkerAdmissionCommand
  -> patch-worker-request-liveness-recovery-authority-domain
  -> admit Worker generation and ready acknowledgement
  -> dispatch request with identity and deadline
  -> observe response, error, messageerror, cancellation and retirement
  -> PatchWorkerResult
       generated | rejected | timed-out | cancelled | retired
  -> release or requeue controller inflight ownership
  -> bounded restart or synchronous fallback
  -> WorkerHealthSnapshot
  -> FirstWorkerReadyAck
  -> FirstRecoveredPatchAck
```

## Parent authority

`prehistoric-rush-patch-worker-request-liveness-recovery-authority-domain`

## Ownership rules

```txt
patch controller owns patch identity, desired sets, cache and activation
product generator owns deterministic patch content
Worker adapter owns execution only
worker authority owns readiness, deadlines, cancellation, restart and retirement
renderer owns accepted patch GPU resources
physics owns accepted patch colliders
```

## Coordinating surfaces

```txt
Worker generation and capability
ready admission
request identity and pending registry
deadlines, timeout and cancellation
error and messageerror settlement
stale response rejection
controller inflight release and requeue
bounded restart and synchronous fallback
page lifecycle retirement
health snapshots and acknowledgements
fault fixtures
```

## Boundary

A Worker object existing is not proof that the Worker is ready or healthy. A posted request is not complete until a typed terminal result releases the corresponding controller inflight lease.