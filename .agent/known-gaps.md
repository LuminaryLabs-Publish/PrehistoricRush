# PrehistoricRush Known Gaps

**Audit:** `2026-07-13T00-49-53-04-00`  
**Status:** `game-viewport-render-surface-authority-audited`

## Summary

The active game surface has no authoritative measurement, DPR, camera, drawing-buffer or visible-frame result. Direct resize mutations can leave presentation state observable only through Three.js internals.

## Plan ledger

**Goal:** keep every unresolved viewport and render-surface risk explicit until executable proof exists.

### Identity and measurement gaps

- [ ] No surface ID, command ID, viewport revision or predecessor check.
- [ ] No actual host CSS-box measurement.
- [ ] No `ResizeObserver` ownership or measurement sequence.
- [ ] No stale or duplicate resize rejection.

### DPR and budget gaps

- [ ] DPR is sampled only at startup.
- [ ] No DPR-change admission.
- [ ] No total drawing-buffer pixel budget.
- [ ] No surface-bound shadow or quality revision.

### Commit gaps

- [ ] Camera and renderer are mutated directly rather than through one prepared candidate.
- [ ] No finite positive-size validation.
- [ ] No zero-size deferral.
- [ ] No rollback or predecessor-retention result.
- [ ] No protection against partial camera/renderer application.

### Observation gaps

- [ ] Public host omits CSS size, buffer size, DPR, aspect and viewport revision.
- [ ] No applied-surface receipt.
- [ ] No first visible viewport-frame acknowledgement.
- [ ] No bounded viewport journal.

### Test gaps

- [ ] Host-only resize.
- [ ] DPR-only change and cap.
- [ ] Zero-size restore.
- [ ] Rapid resize and stale delivery.
- [ ] Pixel-budget downgrade.
- [ ] Camera/canvas/buffer parity.
- [ ] Public readback and visible-frame parity.
- [ ] Source/build/Pages parity.

## Retained gaps

The articulated-pose audit remains unresolved: active rendering still bypasses the articulated solve. The run-start reconciliation also remains unresolved: Enter repeat and participant reset/preserve authority are missing.

## Non-claims

The current code does not prove host measurement correctness, DPR convergence, atomic camera/renderer resize, zero-size safety, stale resize rejection, surface readback or first-visible-frame correlation.