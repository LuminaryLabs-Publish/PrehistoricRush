# PrehistoricRush Known Gaps

**Audit:** `2026-07-15T10-58-45-04-00`  
**Status:** `host-clock-fixed-step-frame-authority-audited`

## Summary

The browser host and product run system both cap admitted delta at 50 ms, while no accumulator retains the remainder. Simulation pacing can therefore fall behind wall time whenever callbacks arrive below 20 FPS.

## Plan ledger

**Goal:** keep timing, lifecycle, overload, streaming and render-evidence gaps explicit until one host-clock authority settles them.

### Clock admission

- [ ] No monotonic clock revision or callback generation is published.
- [ ] The host clips wall intervals to 50 ms.
- [ ] The product run system independently clips tick delta to 50 ms.
- [ ] No accumulator or residual-time state exists.
- [ ] No fixed-step batch identity exists.

### Overload and lifecycle

- [ ] No catch-up step budget is declared.
- [ ] No overload classification exists.
- [ ] No discarded-time receipt exists.
- [ ] Hidden-document behavior has no clock suspension result.
- [ ] Resume has no one-time clock rebase result.
- [ ] Late RAF callbacks are not bound to a runtime generation.

### Gameplay and streaming

- [ ] Elapsed time, movement, jump, distance and goal progress depend on clipped time.
- [ ] Patch-controller updates and generation/activation budgets are callback-count driven.
- [ ] No schedule-equivalence fixture compares normal and delayed callbacks.
- [ ] No terminal-outcome fixture proves pacing equivalence.

### Rendering and proof

- [ ] Rendering receives clipped delta without an interpolation descriptor.
- [ ] The public host snapshot omits clock revision, residual and overload state.
- [ ] No `FirstClockAlignedFrameAck` binds clock, simulation and renderer revisions.
- [ ] No source/build/Pages clock-policy parity fixture exists.

## Retained gaps

Terrain single-owner retirement, creator profile settlement, feedback surfaces, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart and browser-runtime retirement remain separate.