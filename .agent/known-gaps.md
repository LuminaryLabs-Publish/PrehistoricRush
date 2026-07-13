# PrehistoricRush Known Gaps

**Audit:** `2026-07-12T21-51-38-04-00`

## Summary

Run start currently resets only selected engine resources and then asks retained host participants to catch up. Command admission, key-repeat handling, participant generations, rollback, and first-frame proof are missing.

## Plan ledger

**Goal:** keep every unresolved start/restart risk explicit until executable proof exists.

### Admission gaps

- [ ] Enter starts a run regardless of current status.
- [ ] `KeyboardEvent.repeat` is not rejected.
- [ ] Domain `start()` has no scene/status guard.
- [ ] Direct scene transitions bypass declared exit topology.
- [ ] No command ID, sequence, expected run generation, or duplicate rejection.
- [ ] Public engine capabilities can bypass browser UI policy.

### Input gaps

- [ ] Host-local left/right/boost booleans survive start.
- [ ] No input-generation retirement receipt.
- [ ] No focus or held-key policy for restart.
- [ ] Next RAF can immediately reapply predecessor held state.

### Participant gaps

- [ ] Patch controller/cache/queue has no run generation.
- [ ] Pending Worker deliveries have no run generation.
- [ ] Active patch/content maps are retained without a preserve receipt.
- [ ] Physics provider/body/collider reset is not part of start.
- [ ] Instance batches and dynamic content have no successor receipt.
- [ ] Camera follower reset is outside an atomic participant barrier.
- [ ] HUD/render observations cite no start result.

### Result and failure gaps

- [ ] `game.start()` returns state rather than a typed result.
- [ ] No preparation/commit phases.
- [ ] No rollback or indeterminate classification.
- [ ] Multiple RunStarted events/transitions can be emitted.
- [ ] No bounded start journal.
- [ ] No first visible run-generation frame acknowledgement.

### Test gaps

- [ ] Enter repeat fixture.
- [ ] Active-run Enter fixture.
- [ ] Input retirement fixture.
- [ ] Worker stale-delivery fixture.
- [ ] Patch/controller reset-preserve fixture.
- [ ] Physics origin reset fixture.
- [ ] Start participant failure/rollback fixture.
- [ ] First visible frame fixture.
- [ ] Source/build/Pages parity.

## Non-claims

The current code does not prove exactly-once start, status-gated restart, clean input state, cross-participant reset, stale Worker rejection, atomic rollback, or generation-correct first-frame presentation.