# PrehistoricRush Next Steps

**Audit:** `2026-07-13T16-41-10-04-00`  
**Authority:** `prehistoric-rush-pause-menu-command-lifecycle-authority-domain`

## Summary

The semantic pause-menu DSK and Core Presentation descriptors are implemented. Next work should leave those boundaries intact and add the minimum product/browser orchestration required for typed commands, explicit retained-input policy, visible overlay proof and terminal exit cleanup.

## Plan ledger

**Goal:** make every pause interaction deterministic and terminal without converting the non-blocking menu into a simulation pause.

### Phase 1: Command identity

- [ ] Add `PauseMenuCommandId`, `PauseMenuGeneration` and accepted revision.
- [ ] Bind runtime session, run generation, host generation and expected semantic sequence.
- [ ] Classify Escape, Settings, Exit and programmatic commands by source.
- [ ] Return Accepted, Duplicate, Stale, Failed, Cancelled or Retired.
- [ ] Add bounded clone-safe command readback.

### Phase 2: Host lifecycle

- [ ] Allocate one browser pause-host identity and generation.
- [ ] Replace unbounded readiness polling with cancellable admission and a deadline.
- [ ] Install exactly one Escape listener and one synchronization scheduler.
- [ ] Reject callbacks from predecessor or retired host generations.
- [ ] Publish installation and retirement results.

### Phase 3: Overlay projection

- [ ] Prepare overlay DOM from an immutable accepted menu envelope.
- [ ] Return prepared, committed, stale, failed or retired projection results.
- [ ] Track overlay node and listener ownership.
- [ ] Preserve or recover the last complete projection after failure.
- [ ] Publish `FirstPauseOverlayFrameAck` for the matching sequence.

### Phase 4: Non-blocking gameplay-input policy

- [ ] Define whether steer, boost, jump and restart remain admitted while open.
- [ ] Define held-input clear/retain behavior at open and close boundaries.
- [ ] Define Escape repeat, pointer capture, blur and focus-restoration rules.
- [ ] Bind policy revision to menu and run generations.
- [ ] Expose the active policy through diagnostics.

### Phase 5: Exit settlement

- [ ] Consume `exit-requested` through an explicit exit authority.
- [ ] Prepare and validate the navigation destination.
- [ ] Retire attach polling, sync RAF, Escape listener, click listeners and overlay.
- [ ] Request patch Worker, render, physics and runtime cleanup receipts.
- [ ] Add bounded timeout and partial-failure policy.
- [ ] Publish `ExitSettlementResult` and navigate exactly once.

### Phase 6: Fixtures

- [ ] Run clean-checkout `npm test`.
- [ ] Execute the DSK through the pinned real Nexus runtime.
- [ ] Test delayed runtime readiness, replacement and retirement.
- [ ] Test rapid Escape, repeated Escape, settings/exit races and stale commands.
- [ ] Test gameplay input while open, blur and focus restoration.
- [ ] Correlate semantic sequence, DOM fingerprint and visible frame.
- [ ] Test cleanup failures, timeout and duplicate navigation.
- [ ] Run built-output and GitHub Pages parity smokes.

## Retained priorities

Atomic player-character composition, terrain-foot-target coherence, PlayerPose provenance, collision-source convergence, Core Input adoption, viewport authority and browser-runtime retirement remain unresolved. The pause authority should cite their revisions rather than absorb their responsibilities.

## Completion gate

Do not mark the pause-menu lifecycle complete until one browser host generation is proven, every command returns a typed terminal result, retained gameplay input follows an explicit policy, accepted overlay revisions receive visible-frame acknowledgement and exit performs exactly-once settlement with bounded cleanup evidence.