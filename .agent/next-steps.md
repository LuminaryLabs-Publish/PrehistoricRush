# PrehistoricRush Next Steps

**Audit:** `2026-07-15T00-00-35-04-00`  
**Authority:** `prehistoric-rush-game-feedback-control-surface-admission-authority-domain`

## Summary

Keep the existing WebGL game, keyboard controls, pause overlay, and low-UI intent. Replace semantic-tag deletion with stable surface identities and one admitted policy that preserves semantic feedback plus keyboard, pointer, and touch access to required actions.

## Plan ledger

**Goal:** create an explicit, accessible, device-complete feedback strategy without broadening the game UI unnecessarily.

### Phase 1: Surface identity and policy

- [ ] Add stable descriptors for status, progress, diagnostics, active action, and terminal action surfaces.
- [ ] Add `FeedbackPolicyDescriptor` modes for full, minimal, visually hidden, and replacement presentation.
- [ ] Bind policy decisions to route, run, presentation, and viewport revisions.
- [ ] Remove `aside` or other semantic tags as ownership selectors.

### Phase 2: Admission and retirement

- [ ] Add `FeedbackSurfaceAdmissionCommand` and typed result statuses.
- [ ] Retire surfaces only by stable identity and accepted generation.
- [ ] Require a replacement when a retired surface owns mandatory status or action capability.
- [ ] Reject stale, duplicate, selector-wide, and superseded retirement work.
- [ ] Roll back to the predecessor strategy when adoption fails.

### Phase 3: Semantic and action coverage

- [ ] Add one concise semantic status projection for active, run-over, and win states.
- [ ] Preserve keyboard access to Jump, Retry, and Run Again.
- [ ] Provide pointer and touch access to required active and terminal actions.
- [ ] Keep Settings and Exit within the pause presentation contract.
- [ ] Publish typed feedback-action results.

### Phase 4: Presentation and diagnostics

- [ ] Expose policy, generation, connected surfaces, replacements, and device coverage through public readback.
- [ ] Bind feedback projection to accepted run and tick revisions.
- [ ] Stop updating nodes after their accepted retirement.
- [ ] Publish `FirstFeedbackSurfaceFrameAck`.

### Phase 5: Fixtures

- [ ] Add DOM connectedness and MutationObserver retirement fixtures.
- [ ] Add keyboard, pointer, and touch action fixtures.
- [ ] Add active, run-over, and win semantic-status fixtures.
- [ ] Add accessibility-tree and first-frame checks.
- [ ] Run `npm test`.
- [ ] Run source, static artifact, and GitHub Pages feedback-parity checks.
