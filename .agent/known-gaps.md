# PrehistoricRush Known Gaps

**Audit:** `2026-07-14T08-40-38-04-00`  
**Status:** `run-outcome-score-settlement-authority-central-reconciled`

## Summary

Per-tick terminal resolution is implemented, but run-level result settlement, score provenance, retry lineage and visible terminal-frame proof are missing.

## Plan ledger

**Goal:** keep every terminal identity, score, settlement, retry, presentation and validation gap explicit.

### Identity and provenance

- [ ] No immutable `RunOutcomeArtifact`.
- [ ] No terminal result ID or fingerprint.
- [ ] No committed terminal `StepId` receipt.
- [ ] No seed, route, config, profile and body fingerprint bundle.
- [ ] No bounded outcome journal.

### Score

- [ ] No explicit score formula.
- [ ] No score-policy ID or revision.
- [ ] No rounding, clamping, bonus or penalty contract.
- [ ] `RunWon` omits elapsed time and reproducibility inputs.
- [ ] `RunFailed` omits final distance, shards and elapsed summary.

### Settlement

- [ ] Events, RunState, scene transition and HUD are not one atomic result.
- [ ] No duplicate or conflicting terminal-result classification.
- [ ] No late terminal-work rejection after restart.
- [ ] No persistence adapter or durable schema.

### Retry

- [ ] Retry calls `start()` directly.
- [ ] Retry does not cite an accepted predecessor outcome.
- [ ] No typed retry result.
- [ ] No successor lineage.
- [ ] No guarantee that predecessor evidence survives restart.

### Presentation

- [ ] No terminal result summary surface.
- [ ] HUD does not cite result identity or score policy.
- [ ] Render submission does not cite terminal simulation revision.
- [ ] No first visible terminal-frame acknowledgement.

### Tests

- [ ] Existing `npm test` was not run in this audit.
- [ ] No engine event/scene settlement fixture.
- [ ] No retry-lineage fixture.
- [ ] No terminal visible-frame fixture.
- [ ] No built-output or Pages result-parity fixture.

## Retained gaps

Player-profile admission, patch adoption, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run-start/restart and browser-runtime retirement remain separate.