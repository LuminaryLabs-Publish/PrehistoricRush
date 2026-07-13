# PrehistoricRush Known Gaps

**Audit:** `2026-07-13T03-12-30-04-00`  
**Status:** `browser-input-core-input-adoption-central-reconciled`

## Summary

The active browser adapter bypasses installed Core Input and has no focus-owned, repeat-safe or generation-bound command path. One-shot actions and held state therefore lack deterministic admission and visible-frame proof.

## Plan ledger

**Goal:** keep every unresolved browser-input and Core Input adoption risk explicit until executable proof exists.

### Ownership gaps

- [ ] Core Input is installed but not used by the active browser adapter.
- [ ] Keyboard listeners are window-global.
- [ ] No game-surface or canvas-focus admission.
- [ ] No editable-target exclusion.
- [ ] No route ownership result.

### Identity and generation gaps

- [ ] No input-session ID or surface ID.
- [ ] No focus or lifecycle generation.
- [ ] No input sample ID, command ID or monotonic sequence.
- [ ] No stale-generation rejection.
- [ ] No duplicate command result.

### Held and edge-action gaps

- [ ] Host-local steer/boost state exists outside Core Input.
- [ ] One-shot jump/start/retry do not use edge-command semantics.
- [ ] No `event.repeat` policy.
- [ ] Enter can restart an active run.
- [ ] Holding Enter can call `start()` repeatedly.
- [ ] Space repeat can re-arm jump after simulation consumption.
- [ ] Button and keyboard paths do not share one typed command result.

### Lifecycle gaps

- [ ] Blur neutralizes values but retires no generation.
- [ ] No `visibilitychange` input fence.
- [ ] No `pagehide` or route-exit input fence.
- [ ] No listener lease or disposal receipt.
- [ ] No typed `InputClearResult`.

### Observation gaps

- [ ] No accepted/rejected/duplicate/stale input result.
- [ ] No product consumer receipt.
- [ ] Public diagnostics omit input session, generation and held state.
- [ ] No rejection counters or bounded input journal.
- [ ] No first visible input-frame acknowledgement.

### Test gaps

- [ ] Focus and editable-target admission.
- [ ] Held action down/up behavior.
- [ ] Enter repeat and mid-run restart rejection.
- [ ] Space repeat and landing behavior.
- [ ] Blur/visibility/page lifecycle generation fences.
- [ ] Button/keyboard parity.
- [ ] Duplicate/stale zero-mutation behavior.
- [ ] Source/build/Pages parity.

## Retained gaps

The viewport authority remains unresolved. Active rendering still bypasses the articulated solve. Run-start participant reset/preserve authority remains non-atomic. Runtime callback, Worker and renderer retirement also remain unresolved.

## Non-claims

The current code does not prove Core Input adoption, focus safety, repeat determinism, one-shot exactly-once behavior, lifecycle generation fencing, stale/duplicate rejection, button/keyboard equivalence, public input provenance or first-visible-frame correlation.