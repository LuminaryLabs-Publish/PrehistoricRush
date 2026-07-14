# PrehistoricRush Next Steps

**Audit:** `2026-07-14T18-58-04-04-00`  
**Authority:** `prehistoric-rush-route-progress-goal-eligibility-authority-domain`

## Summary

Keep the existing route generator, simulation, collision precedence and renderer. Add a narrow progress authority that converts candidate movement into monotonic authored-course progress and requires the terminal checkpoint before victory.

## Plan ledger

**Goal:** replace movement-only completion with versioned course progress, checkpoint admission and finish-frame proof.

### Phase 1: Course manifest

- [ ] Add `CourseManifest` with schema, course ID, revision, seed and route fingerprint.
- [ ] Generate stable ordered checkpoint IDs from the authored route.
- [ ] Add a terminal `CourseGoalDescriptor` with finish volume and direction.
- [ ] Version lateral, direction and checkpoint-skip policies.

### Phase 2: Progress admission

- [ ] Add `CourseProgressCommand` and typed result statuses.
- [ ] Project displacement onto the current route tangent.
- [ ] Separate total movement telemetry from accepted forward course distance.
- [ ] Reject backward, repeated, skipped and off-route progress.
- [ ] Bind progress to RunId, StepId and manifest revision.

### Phase 3: Goal settlement

- [ ] Add `CourseGoalEligibilityCommand` and typed result.
- [ ] Require the terminal checkpoint or finish volume.
- [ ] Preserve existing collision-over-goal precedence.
- [ ] Publish immutable `CourseCompletionResult`.
- [ ] Reject stale and predecessor-run completion work.

### Phase 4: Presentation and diagnostics

- [ ] Drive the HUD from accepted course progress.
- [ ] Expose total movement separately for diagnostics or scoring.
- [ ] Bind terminal UI to `CourseCompletionRevision`.
- [ ] Publish `FirstEligibleFinishFrameAck`.
- [ ] Expose route, checkpoint, progress and finish identities through the public host.

### Phase 5: Fixtures

- [ ] Add forward-course success coverage.
- [ ] Add reverse, circle, repeated-segment and off-route rejection fixtures.
- [ ] Add checkpoint-skip and wrong-direction finish fixtures.
- [ ] Add collision-at-finish precedence coverage.
- [ ] Run `npm test`.
- [ ] Run source, built-output and GitHub Pages finish-parity checks.