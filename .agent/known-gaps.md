# PrehistoricRush Known Gaps

**Audit:** `2026-07-15T16-00-32-04-00`  
**Status:** `accessible-gameplay-projection-focus-authority-audited`

## Summary

Accepted run and pause state is visible, but no authority binds it to stable semantic status, progress, terminal announcements or dialog-focus results.

## Plan ledger

**Goal:** keep semantic projection, announcement, focus, lifecycle and proof gaps explicit until one accessibility authority settles them.

### Gameplay semantics

- [ ] No versioned semantic gameplay snapshot exists.
- [ ] The active status container has no `status` role.
- [ ] No authored live-region or atomic-update policy exists.
- [ ] The visual distance bar has no progressbar role or numeric value contract.
- [ ] High-frequency values have no announcement-throttling policy.

### Outcomes and actions

- [ ] Start, retry, run-over and win have no semantic transition IDs.
- [ ] Terminal outcomes have no one-shot announcement result.
- [ ] Repeated RAF snapshots have no announcement deduplication.
- [ ] The primary button label has no revision-bound accessible action snapshot.

### Pause focus

- [ ] The pause overlay has no dialog role.
- [ ] `aria-modal` is not adopted as true for the active pause state.
- [ ] No prior-focus capture result exists.
- [ ] No initial-focus policy exists.
- [ ] No Tab containment exists.
- [ ] Background gameplay controls are not made inert by an owned result.
- [ ] Overlay removal has no explicit focus restoration or fallback policy.
- [ ] Pagehide and route retirement have no focus/inert lease settlement.

### Rendering and proof

- [ ] No semantic frame revision is bound to the visible frame.
- [ ] No `FirstAccessibleGameplayFrameAck` exists.
- [ ] No keyboard-only browser fixture exists.
- [ ] No accessibility-tree or screen-reader fixture exists.
- [ ] No source/build/Pages semantic parity fixture exists.

## Retained gaps

Host-clock pacing, terrain ownership, terrain LOD, creator profile settlement, feedback surfaces, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause command lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart and browser-runtime retirement remain separate.