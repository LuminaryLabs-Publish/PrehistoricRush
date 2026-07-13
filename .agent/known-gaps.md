# PrehistoricRush Known Gaps

**Audit:** `2026-07-12T22-19-11-04-00`  
**Status:** `run-start-restart-central-reconciled`

## Summary

Run start resets selected engine resources and then asks retained host participants to continue. Command admission, key-repeat handling, participant generations, rollback, journaling, and first-frame proof remain missing. Central tracking now reflects the same defect.

## Plan ledger

**Goal:** keep every unresolved start/restart risk explicit until executable proof exists.

### Admission gaps

- [ ] Enter starts a run regardless of current status.
- [ ] `KeyboardEvent.repeat` is not rejected.
- [ ] Domain `start()` has no scene/status/session guard.
- [ ] Direct scene transitions bypass declared exit topology.
- [ ] No command ID, sequence, expected run generation, or duplicate/stale rejection.
- [ ] Boot and public engine capabilities bypass one bounded command path.

### Input gaps

- [ ] Host-local left/right/boost booleans survive start.
- [ ] No input-generation retirement receipt.
- [ ] No focus, editable-target, or held-key policy for restart.
- [ ] The next RAF can immediately reapply predecessor held state.

### Participant gaps

- [ ] Patch controller/cache/queue has no run generation.
- [ ] Pending Worker deliveries have no run generation.
- [ ] Active patch/content maps are retained without a preserve receipt.
- [ ] Physics provider/body/collider reset is not part of start.
- [ ] Instance batches and dynamic content have no successor receipt.
- [ ] Camera follower reset occurs outside an atomic participant barrier.
- [ ] Renderer, HUD, and public observations cite no start result.

### Result and failure gaps

- [ ] `game.start()` returns state rather than a typed result.
- [ ] No preparation, predecessor recheck, or atomic commit phases.
- [ ] No rollback or indeterminate classification.
- [ ] Multiple `RunStarted` events and transitions can be emitted.
- [ ] No bounded start journal or immutable participant manifest.
- [ ] No first visible run-generation frame acknowledgement.

### Test gaps

- [ ] Boot/button/Space/Enter/public parity fixture.
- [ ] Enter-repeat fixture.
- [ ] Active-run Enter fixture.
- [ ] Input retirement fixture.
- [ ] Worker stale-delivery fixture.
- [ ] Patch/controller reset-preserve fixture.
- [ ] Physics origin reset fixture.
- [ ] Start participant failure/rollback fixture.
- [ ] Duplicate command idempotency fixture.
- [ ] First visible frame fixture.
- [ ] Source/build/Pages parity.

## Non-claims

The current code does not prove exactly-once start, status-gated restart, clean input state, cross-participant generation parity, stale Worker rejection, atomic rollback, or generation-correct first-frame presentation.