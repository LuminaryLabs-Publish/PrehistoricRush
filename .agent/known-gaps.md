# PrehistoricRush Known Gaps

**Audit:** `2026-07-14T18-58-04-04-00`  
**Status:** `route-progress-goal-eligibility-authority-central-reconciled`

## Summary

The game calculates authored-route evidence but does not admit it as authoritative progress. Unrestricted movement controls the progress bar and terminal goal.

## Plan ledger

**Goal:** keep every course identity, traversal, completion, presentation and proof gap explicit.

### Course identity

- [ ] No versioned `CourseManifest`.
- [ ] No stable course-goal identity.
- [ ] No stable ordered checkpoint descriptors.
- [ ] No route fingerprint bound to run completion.
- [ ] No versioned direction or lateral-tolerance policy.

### Progress settlement

- [ ] Total movement and accepted course distance are not separated.
- [ ] No monotonic `CourseProgressRevision`.
- [ ] No forward-direction admission.
- [ ] No off-route rejection.
- [ ] No repeated-segment or loop suppression.
- [ ] No skipped-checkpoint rejection.
- [ ] No stale or duplicate progress-result rejection.

### Goal eligibility

- [ ] Goal uses `RunState.distance >= 3600` only.
- [ ] Route index and progress do not gate victory.
- [ ] No terminal checkpoint or finish volume.
- [ ] No typed `CourseGoalEligibilityResult`.
- [ ] No immutable `CourseCompletionResult`.
- [ ] Terminal result does not cite a course-progress revision.

### Presentation

- [ ] HUD progress uses unrestricted movement.
- [ ] Total movement is not labeled separately from course progress.
- [ ] No course-progress presentation descriptor.
- [ ] No finish-frame receipt.
- [ ] No `FirstEligibleFinishFrameAck`.

### Tests and deployment

- [ ] Existing outcome-policy tests accept a caller-supplied goal boolean.
- [ ] `npm test` was not run in this audit.
- [ ] No reverse-route fixture.
- [ ] No start-area circle fixture.
- [ ] No repeated-segment fixture.
- [ ] No off-route distance fixture.
- [ ] No browser finish-frame fixture.
- [ ] No built-output or GitHub Pages course-progress parity fixture.

## Retained gaps

Runtime-provider convergence, run-outcome settlement, player-profile admission, patch adoption, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run-start/restart and browser-runtime retirement remain separate.