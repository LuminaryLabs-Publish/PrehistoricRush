# Interaction Audit: Render Recovery Command and Result Map

**Timestamp:** `2026-07-16T06-39-16-04-00`

## Summary

Browser context events currently have no typed path into product state, diagnostics or user-visible recovery.

## Plan ledger

**Goal:** settle each loss and recovery attempt exactly once and reject stale browser callbacks.

- [x] Define browser evidence.
- [x] Define admission commands.
- [x] Define terminal results.
- [x] Define visible-frame acknowledgement.
- [ ] Implement the command path.

## Evidence and commands

```txt
webglcontextlost
  -> RenderLossAdmissionCommand

webglcontextrestored
  -> RenderRecoveryCommand

recovery deadline
  -> RenderRecoveryTimeoutCommand

retry budget exhausted
  -> RenderFallbackCommand

route exit or pagehide
  -> RenderGenerationRetirementCommand
```

## Results

```txt
RenderLossResult:
  accepted | duplicate | stale | retired | unsupported

RenderRecoveryResult:
  recovered | failed | timed-out | stale | retired

RenderFallbackResult:
  degraded-renderer | route-exit | fatal

FirstRecoveredFrameAck:
  exact renderer generation and accepted world/frame revisions
```

## Idempotency

Every result must bind document, canvas, renderer and resource generations. Duplicate context events return the stored result; callbacks from retired generations cannot mutate the active renderer.

## Boundary

No event listener or command implementation was added.
