# PrehistoricRush Next Steps

**Audit:** `2026-07-12T22-18-39-04-00`  
**Authority:** `prehistoric-rush-articulated-pose-presentation-authority-domain`

## Summary

The next implementation should connect committed RunState, Core Motion, Core Physics, articulated motion, optional articulated dynamics, and Three.js skeleton application through one typed pose commit.

## Plan ledger

**Goal:** make the visible dinosaur pose authoritative, revisioned, failure-aware, and provably tied to the rendered frame.

### Phase 1: Pose identity and admission

- [ ] Add pose command ID, pose frame ID, run generation, tick, and predecessor pose revision.
- [ ] Bind player body/content hash, profile revision, rig ID, and rig revision.
- [ ] Define explicit source policy: articulated, legacy fallback, or physical articulation.

### Phase 2: Input binding

- [ ] Bind committed RunState, Core Motion frame, Physics frame, and optional dynamics frame.
- [ ] Build one immutable base pose and target set.
- [ ] Reject stale, mismatched, duplicate, or non-finite candidates.

### Phase 3: Solve and commit

- [ ] Route active gameplay through `solvePlayerArticulatedPose()` when policy requires it.
- [ ] Validate required bone coverage and transforms.
- [ ] Fingerprint the candidate and commit `PlayerPoseCommitResult`.
- [ ] Publish typed fallback reason when legacy pose is admitted.

### Phase 4: Skeleton application

- [ ] Apply only committed pose candidates.
- [ ] Return applied and skipped bone receipts.
- [ ] Prevent partial skeleton mutation on rejected candidates.
- [ ] Expose the committed pose through `PrehistoricRushHost`.

### Phase 5: First-frame proof

- [ ] Publish `FirstArticulatedPoseFrameAck` with run, tick, pose revision, fingerprint, rig, and mesh identity.
- [ ] Correlate renderer frame, HUD diagnostics, and public readback.

### Phase 6: Fixtures

- [ ] Legacy versus articulated pose parity.
- [ ] Hind-leg IK visibly changes the skeleton.
- [ ] Missing required and optional bones.
- [ ] Non-finite solver output.
- [ ] Solver failure with allowed and forbidden fallback.
- [ ] Stale pose after run restart.
- [ ] Body/profile/rig/skeleton mismatch.
- [ ] Source, build, and Pages first-frame parity.

## Completion gate

Do not mark the authority implemented until the active renderer consumes one admitted pose result, failures and fallback are typed, stale candidates cause zero effects, bone application is receipted, and the first visible frame cites the committed pose.