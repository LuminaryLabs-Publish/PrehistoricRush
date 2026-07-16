# Worker Fault Browser Fixture Gate

**Timestamp:** `2026-07-16T02-03-42-04-00`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

Source checks do not prove module Worker readiness, transport failure settlement, timeout recovery, restart, synchronous fallback, or retirement in the built and deployed browser environment.

## Plan ledger

**Goal:** block production claims until source, artifact, and Pages executions prove bounded Worker failure recovery.

- [x] Identify current source-only evidence.
- [x] Define browser fault-injection fixtures.
- [x] Define artifact and Pages parity requirements.
- [ ] Implement and run the fixtures.

## Required browser fixtures

```txt
normal Worker initialization and ready acknowledgement
slow initialization before first request
Worker constructor failure
module import failure inside Worker
postMessage synchronous failure
structured-clone or transferable failure
Worker error event with pending requests
messageerror with pending requests
request that never responds and times out
late success after timeout
late response from retired Worker generation
bounded restart success
restart-budget exhaustion and synchronous fallback
pagehide and route retirement with pending requests
rapid focus movement during failure and recovery
```

## Required assertions

```txt
no request remains pending beyond its deadline
controller inflight ownership is always released or requeued
stale responses cannot activate patches
restart count is bounded
fallback mode is explicit and observable
Worker listeners, timers and process are retired
active-ring coverage recovers before unsafe player advance
FirstWorkerReadyAck is published
FirstRecoveredPatchAck is published
```

## Artifact and Pages gate

The same fault suite must run against:

```txt
checked-in source
uploaded Pages artifact
public GitHub Pages URL
```

The fixture must record exact Nexus Engine, Kits, ProtoKits, Worker module, runtime and deployment revisions.

## Current validation state

```txt
npm test: not run
Worker readiness fixture: unavailable
Worker crash fixture: unavailable
request timeout fixture: unavailable
restart/fallback fixture: unavailable
retirement fixture: unavailable
artifact smoke: not run
Pages smoke: not run
```

## Boundary

No Worker recovery, artifact parity, deployed parity, or production readiness is claimed.