# Simulation Clock Audit: RAF Delta Accumulator Contract

**Timestamp:** `2026-07-15T10-58-45-04-00`

## Summary

The current runtime has a clipped variable-step clock, not a fixed-step accumulator. It converts each RAF callback into one tick of at most 50 ms and permanently loses the remainder.

## Plan ledger

**Goal:** specify bounded deterministic catch-up, residual handling and lifecycle rebasing before changing runtime timing.

- [x] Identify current host and product delta clamps.
- [x] Confirm no accumulator, residual or catch-up loop exists.
- [x] Define active, suspended, resumed and overload states.
- [x] Define fixed-step and residual receipts.
- [ ] Implement the clock authority.
- [ ] Run deterministic schedule fixtures.

## Proposed policy

```txt
fixedStep: 1 / 60 second
maximumCatchUpSteps: declared by quality/runtime policy
maximumAccumulatedTime: declared overload bound
residual: retained below one fixed step
hidden document: suspend or use an explicit background policy
resume: rebase the wall-clock origin once
overload: retain bounded residual or publish discarded-time receipt
render: consume interpolation = residual / fixedStep
```

Exact numeric policy values remain an implementation decision. They must be versioned and published rather than embedded as unrelated literals in the host and product domain.

## Required receipts

```txt
ClockIntervalAdmissionResult
FixedStepBatchResult
ClockOverloadReceipt
ClockSuspensionReceipt
ClockResumeReceipt
ClockDiscardedTimeReceipt
FirstClockAlignedFrameAck
```

## Determinism expectations

```txt
60 FPS, 20 FPS and 10 FPS callback schedules
  -> same ordered fixed-step history for the same admitted input timeline
  -> equivalent run state within declared floating-point tolerance
  -> identical terminal outcome and pickup identities
```

## Boundary

This document does not select final timing constants or claim fixed-step correctness.