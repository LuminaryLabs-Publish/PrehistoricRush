# PrehistoricRush Next Steps

**Audit:** `2026-07-15T16-00-32-04-00`  
**Authority:** `prehistoric-rush-accessible-gameplay-projection-focus-authority-domain`

## Summary

Add one revision-bound accessibility projection layer for gameplay status, distance progress, terminal transitions and pause-dialog focus.

## Plan ledger

**Goal:** make the complete run and pause loop observable and operable through keyboard and assistive technology without announcing high-frequency frame data.

### Phase 1: Semantic snapshot

- [ ] Add `AccessibleGameplayProjectionCommand` and `AccessibleGameplayProjectionResult`.
- [ ] Bind document, game, committed-frame, outcome, pause and projection revisions.
- [ ] Derive one stable semantic snapshot from accepted engine state.
- [ ] Reject stale, duplicate and retired projections.

### Phase 2: Status and progress

- [ ] Preserve stable status and progress DOM identities.
- [ ] Add `role=status` with an authored live/atomic policy.
- [ ] Add semantic progress minimum, maximum, current and value text.
- [ ] Update semantic values without replacing the complete node tree every RAF.
- [ ] Keep speed, patch and LOD diagnostics outside the default announcement stream.

### Phase 3: Outcome announcements

- [ ] Publish one announcement ID for start, retry, run-over and win transitions.
- [ ] Deduplicate repeated snapshots and RAF callbacks.
- [ ] Bind the primary action label and accessible name to the accepted action state.
- [ ] Publish a terminal semantic-frame acknowledgement.

### Phase 4: Pause focus

- [ ] Adopt the pause surface as a labeled modal dialog.
- [ ] Capture the prior accepted focus target before mounting.
- [ ] Focus the authored first action after adoption.
- [ ] Contain Tab and Shift+Tab inside the active dialog.
- [ ] Make background gameplay controls inert while paused.
- [ ] Restore prior focus or an explicit fallback on close.
- [ ] Clear focus and inert leases on pagehide, route exit and runtime retirement.

### Phase 5: Fixtures

- [ ] Run keyboard-only start, jump, pause, settings, exit, retry and run-again fixtures.
- [ ] Capture and compare the accessibility tree.
- [ ] Verify no RAF-frequency announcement spam.
- [ ] Verify one terminal announcement per accepted outcome.
- [ ] Verify pause focus entry, containment, Escape and restoration.
- [ ] Run `npm test`.
- [ ] Run source, built-output and Pages parity fixtures.