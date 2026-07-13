# PrehistoricRush Next Steps

**Audit:** `2026-07-13T13-58-35-04-00`  
**Authority:** `prehistoric-rush-player-character-composition-transition-authority-domain`

## Summary

The semantic Core Creature/Character/Player composition is implemented. Next work should stop mutating those participants and the creator presentation sequentially, introduce typed composition results and prove registry, persistence and visible-preview convergence.

## Plan ledger

**Goal:** add the minimum product orchestration needed for atomic composition without weakening Core domain boundaries.

### Phase 1: Composition identity

- [ ] Add `CompositionAttemptId`, `CompositionGeneration` and accepted `CompositionRevision`.
- [ ] Bind engine generation and profile revision.
- [ ] Capture expected body, rig, creature, character and optional player revisions.
- [ ] Define clone-safe bounded composition readback.

### Phase 2: Detached preparation

- [ ] Build the procedural body candidate without live registry mutation.
- [ ] Build and validate the articulated rig candidate.
- [ ] Build creature and character candidates against those references.
- [ ] Build optional player registration/possession candidate.
- [ ] Evaluate support anchors and local bounds against candidate data.
- [ ] Validate pose compatibility when the rig changes.

### Phase 3: Typed conflict policy

- [ ] Replace exception-message parsing with explicit Duplicate, Replace and Conflict results.
- [ ] Preserve participant revisions on duplicate composition.
- [ ] Reject stale predecessor or profile revisions.
- [ ] Require an explicit replacement policy for changed embodiment data.

### Phase 4: Atomic registry adoption

- [ ] Add participant preparation receipts.
- [ ] Adopt rig, creature, character and player together or none.
- [ ] Preserve the complete predecessor chain on any rejection.
- [ ] Publish `PlayerCharacterCompositionResult` with participant receipts.
- [ ] Journal failures and rollback outcomes.

### Phase 5: Preview preparation and adoption

- [ ] Prepare successor mesh, topology mode and materials before live registry adoption.
- [ ] Prepare support placement and camera framing from the candidate generation.
- [ ] Add explicit transition generation and stale retirement.
- [ ] Correlate `targetRevision` and `appliedRevision` with accepted composition revision.
- [ ] Release predecessor resources only after accepted visual adoption.
- [ ] Publish `FirstComposedCharacterFrameAck`.

### Phase 6: Profile and lifecycle convergence

- [ ] Separate draft revision, durable profile revision and composition revision.
- [ ] Ensure one user edit does not create unclassified duplicate composition attempts.
- [ ] Fence reset, external profile updates and unload against pending generations.
- [ ] Expose honest Saving, Updating, Ready and Failed statuses from terminal results.

### Phase 7: Fixtures

- [ ] Run clean-checkout `npm test`.
- [ ] Execute composition through the pinned real Core runtime.
- [ ] Inject failure after each participant preparation/adoption point.
- [ ] Test duplicate, replacement, conflict and stale results.
- [ ] Test changed-rig pose compatibility/reset.
- [ ] Test support-anchor and bounds extremes.
- [ ] Test rapid creator edits, reset, external updates and unload.
- [ ] Compare registry, persistence and visible frame fingerprints.
- [ ] Run built-output and GitHub Pages smokes.

## Retained priorities

Terrain-foot-target coherence, PlayerPose frame provenance, collision-source convergence, Core Input adoption, viewport authority and browser-runtime retirement remain unresolved. The composition authority must emit revisions that those retained boundaries can cite.

## Completion gate

Do not mark composition complete until duplicate and replacement policy is typed, every participant failure preserves the full predecessor chain, changed rigs resolve pose compatibility explicitly, and the first visible preview frame matches the accepted registry and durable profile revision.