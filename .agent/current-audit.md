# PrehistoricRush Current Audit

**Timestamp:** `2026-07-16T02-03-42-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

The active runtime delegates patch generation to a module Worker and the pinned message executor. The host does not wait for the Worker's ready message, observe Worker-level failures, bound request duration, cancel pending work, restart a failed Worker, switch a live controller to fallback generation, reject stale Worker generations, or dispose the executor during document retirement.

## Plan ledger

**Goal:** make asynchronous patch generation readiness and settlement explicit, bounded, recoverable and observable.

- [x] Inspect Worker creation and initialization.
- [x] Inspect Worker request and response protocol.
- [x] Inspect pinned executor pending-promise behavior.
- [x] Inspect controller queue, inflight and ready-state transitions.
- [x] Inspect active streaming, fallback and retirement paths.
- [x] Define the patch-worker authority and fixture boundary.
- [ ] Implement and execute the authority.

## Current interaction loop

```txt
controller queue
  -> record becomes inflight
  -> executor posts generate-patch
  -> Worker generates patch
  -> matching response settles promise
  -> controller publishes ready patch
  -> renderer and physics adopt patch
```

## Failure interaction loop

```txt
Worker crash, hang, messageerror or lost response
  -> no executor terminal result
  -> controller record remains inflight
  -> requeue is suppressed
  -> host keeps Worker mode
  -> no restart or synchronous fallback
```

## Domains in use

```txt
browser Worker, message, error, messageerror, page lifecycle and RAF
Core simulation, physics, graphics, presentation and diagnostics
PrehistoricRush run, route, terrain, patch streaming and terrain LOD
seeded patch identity, cache, queue, inflight, readiness, activation and release
Worker generation, readiness, deadlines, cancellation, restart, fallback, retirement and health
Three.js, Rapier, validation, Pages and central tracking
```

## Current gaps

```txt
Worker generation identity: absent
patch-worker-ready admission: absent
Worker error observer: absent
Worker messageerror observer: absent
request deadline and timeout: absent
request cancellation: absent
pending request diagnostics: absent
stale Worker response rejection: absent
controller inflight release/requeue result: absent
bounded Worker restart: absent
live synchronous fallback transition: absent
pagehide/route disposal: absent
PatchWorkerResult: absent
WorkerHealthSnapshot: absent
FirstWorkerReadyAck: absent
FirstRecoveredPatchAck: absent
```

## Required authority

`prehistoric-rush-patch-worker-request-liveness-recovery-authority-domain`

## Boundary

Documentation only. Runtime source, Worker protocol, gameplay, rendering, tests and deployment remain unchanged.