# PrehistoricRush Next Steps

**Audit:** `2026-07-15T10-58-45-04-00`  
**Authority:** `prehistoric-rush-host-clock-fixed-step-frame-authority-domain`

## Summary

Replace clipped one-tick-per-RAF timing with a versioned host-clock policy, bounded fixed-step accumulator and clock-aligned render result.

## Plan ledger

**Goal:** keep real-time pacing deterministic across normal, delayed, hidden and resumed browser schedules.

### Phase 1: Own the clock

- [ ] Add `HostClockFrameCommand`, `HostClockFrameResult` and `ClockSnapshot`.
- [ ] Bind document, runtime, RAF and policy generations.
- [ ] Admit monotonic timestamps and reject stale callback generations.
- [ ] Remove independent host and product-domain delta policy literals.

### Phase 2: Fixed-step execution

- [ ] Add a versioned fixed-step interval.
- [ ] Accumulate admitted wall time.
- [ ] Execute a bounded catch-up step batch.
- [ ] Retain sub-step residual time.
- [ ] Publish explicit overload and discarded-time receipts.
- [ ] Bind one sampled input revision to the accepted step batch.

### Phase 3: Lifecycle

- [ ] Define hidden-document suspension policy.
- [ ] Rebase the wall-clock origin exactly once on resume.
- [ ] Prevent a background-duration catch-up explosion.
- [ ] Retire stale RAF callbacks after runtime replacement or route exit.

### Phase 4: Streaming and rendering

- [ ] Give patch generation and activation explicit clock/budget policy inputs.
- [ ] Render the accepted simulation revision.
- [ ] Publish an interpolation descriptor from residual time.
- [ ] Publish `FirstClockAlignedFrameAck`.
- [ ] Preserve the separate terrain single-owner follow-up.

### Phase 5: Fixtures

- [ ] Compare 60, 20, 10 and 5 FPS callback schedules.
- [ ] Inject a 500 ms stall and verify declared overload behavior.
- [ ] Verify jump, distance, elapsed time, pickups and terminal outcome equivalence.
- [ ] Verify hidden/resume rebasing and held-input cleanup.
- [ ] Verify worker and synchronous patch-generation modes.
- [ ] Run `npm test`.
- [ ] Run source, built-output and Pages browser fixtures.