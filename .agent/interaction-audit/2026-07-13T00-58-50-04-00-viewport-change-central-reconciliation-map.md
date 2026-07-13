# Interaction Audit: Viewport Change Central Reconciliation Map

**Timestamp:** `2026-07-13T00-58-50-04-00`

## Summary

Browser resize evidence is admitted implicitly and immediately. There is no command identity, predecessor revision, stale-delivery rejection or terminal result.

## Plan ledger

**Goal:** turn host and DPR changes into explicit commands with typed zero-mutation rejection and one committed result.

- [x] Trace browser resize to camera and renderer mutation.
- [x] Record missing identity, sequence and predecessor evidence.
- [x] Preserve the detailed `00-49-53` interaction audit.
- [ ] Implement command/result admission later.

## Current map

```txt
window resize event
  -> read innerWidth/innerHeight
  -> mutate camera aspect
  -> update projection matrix
  -> mutate renderer size
  -> return undefined
```

## Required map

```txt
HostMeasurementObservation
  -> ViewportChangeCommand
  -> runtime/surface/predecessor admission
  -> finite/positive/duplicate/stale validation
  -> DPR and pixel-budget decision
  -> camera + buffer candidate parity
  -> ViewportSurfaceCommitResult
     or ViewportSurfaceRejectedResult
     or ViewportSurfaceDeferredResult
  -> host application receipt
  -> FirstViewportFrameAck
```

## Required rejection semantics

```txt
invalid measurement -> zero mutation
zero-sized host -> preserve predecessor and defer
stale observation -> zero mutation
same fingerprint -> typed no-op
application failure -> typed rollback/predecessor retention
```

## Non-claim

No event listener, command route or viewport result was implemented.