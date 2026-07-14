# PrehistoricRush Next Steps

**Audit:** `2026-07-14T08-40-38-04-00`  
**Authority:** `prehistoric-rush-run-outcome-score-settlement-authority-domain`

## Summary

Keep the existing run domain, resolution policy, Core Scene transitions and renderer. Add only the durable result, score, retry and proof boundary required to make terminal runs authoritative.

## Plan ledger

**Goal:** make every terminal run produce one immutable artifact before a successor run is admitted.

### Phase 1: Result identity

- [ ] Add `RunOutcomeId`, terminal `StepId` and result fingerprint.
- [ ] Bind seed, route, runtime config, profile revision and body content hash.
- [ ] Admit exactly one terminal result per `RunId`.
- [ ] Retain a bounded in-memory result journal.

### Phase 2: Score policy

- [ ] Define an explicit versioned score policy.
- [ ] Derive score from distance, shards, elapsed time, collision and completion.
- [ ] Record rounding, clamping and bonus rules.
- [ ] Include score-policy revision in every result artifact.

### Phase 3: Atomic settlement

- [ ] Add `RunOutcomeSettlementCommand` and typed result classes.
- [ ] Atomically publish result artifact, journal entry, terminal scene and diagnostics.
- [ ] Reject duplicate, conflicting, stale and late terminal work.
- [ ] Preserve collision-over-goal priority.

### Phase 4: Retry lineage

- [ ] Replace direct `start()` retry admission with `RunRetryCommand`.
- [ ] Require accepted predecessor `RunOutcomeId`.
- [ ] Allocate successor `RunId` and lineage.
- [ ] Settle simulation, player, input, pose, camera and streaming reset participants.
- [ ] Preserve predecessor evidence after restart.

### Phase 5: Presentation proof

- [ ] Add a terminal result summary surface.
- [ ] Bind HUD and renderer submissions to `RunOutcomeId`.
- [ ] Publish `FirstVisibleTerminalFrameAck`.
- [ ] Block or classify retry before terminal presentation acknowledgement.

### Phase 6: Fixtures

- [ ] Run existing `npm test`.
- [ ] Add engine-level outcome/event/transition fixtures.
- [ ] Add duplicate and late terminal-work fixtures.
- [ ] Add retry-lineage and predecessor-retention fixtures.
- [ ] Add browser visible-terminal-frame fixtures.
- [ ] Run built-output and Pages parity.