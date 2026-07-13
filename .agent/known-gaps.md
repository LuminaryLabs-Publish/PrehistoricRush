# PrehistoricRush Known Gaps

**Audit:** `2026-07-13T16-41-10-04-00`  
**Status:** `non-blocking-pause-menu-command-lifecycle-authority-central-reconciled`  
**Technical status:** `non-blocking-pause-menu-command-lifecycle-authority-audited`

## Summary

The semantic pause menu is bounded and renderer-agnostic, but input admission, DOM projection, retained gameplay behavior, exit navigation and browser-host cleanup do not share one generation or terminal result.

## Plan ledger

**Goal:** keep every command, projection, gameplay-policy, navigation and lifecycle gap explicit while preserving the intended non-blocking experience.

### Command gaps

- [ ] No command ID or menu generation.
- [ ] No expected semantic sequence or compare-and-commit result.
- [ ] No typed stale, superseded, failed, cancelled or retired outcome.
- [ ] Escape source, click source and programmatic source are not recorded.
- [ ] No bounded command journal or readback.

### Host lifecycle gaps

- [ ] Runtime-readiness polling has no deadline, cancellation or generation.
- [ ] Escape listener has no removal receipt.
- [ ] Synchronization RAF has no cancellation or terminal state.
- [ ] Public pause-host reference has no revocation policy.
- [ ] Replacement can create predecessor callbacks without stale fencing.
- [ ] No complete, partial or failed host-retirement result.

### Presentation gaps

- [ ] Semantic state can return before overlay DOM exists or paints.
- [ ] Overlay nodes and click listeners have no identities.
- [ ] No projection candidate, revision, fingerprint or terminal result.
- [ ] No last-complete-overlay recovery policy.
- [ ] No first matching visible overlay frame acknowledgement.
- [ ] Close/reset does not prove predecessor DOM retirement.

### Non-blocking gameplay gaps

- [ ] Simulation continuation is explicit, but gameplay-input continuation is not.
- [ ] Overlay captures pointer while keyboard gameplay listeners remain active.
- [ ] No authored steering, boost, jump or restart policy while open.
- [ ] Held-input clear/retain behavior on open and close is unspecified.
- [ ] Escape repeat, blur and focus restoration cite no policy revision.

### Exit settlement gaps

- [ ] `exit-requested` has no explicit consumer acknowledgement.
- [ ] `location.href` is assigned immediately after the semantic request.
- [ ] No destination preparation or validation result.
- [ ] No cleanup request for RAF, listeners, Worker, renderer, physics or runtime.
- [ ] No timeout or partial-failure policy.
- [ ] No exactly-once navigation or terminal exit settlement result.

### Test gaps

- [ ] Current tests were not independently executed in this run.
- [ ] No pinned real-runtime pause DSK fixture.
- [ ] No browser host installation/replacement/retirement fixture.
- [ ] No semantic-state/DOM/paint correlation fixture.
- [ ] No gameplay-input-while-open fixture.
- [ ] No exit cleanup, timeout or duplicate-navigation fixture.
- [ ] No built-output or GitHub Pages parity fixture.

## Retained gaps

Atomic player-character composition, terrain sample/target coherence, PlayerPose provenance, collision-source convergence, Core Input adoption, viewport authority, articulated presentation and full browser-runtime retirement remain unresolved independent boundaries.

## Non-claims

The current source proves bounded pause semantics, renderer-neutral descriptors, non-blocking simulation, duplicate exit-event suppression and static host delegation. It does not prove typed command admission, deterministic retained input, visible overlay equivalence, host retirement, exit settlement, independently passing tests or deployed parity.