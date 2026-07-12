# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T14-10-22-04-00`

## Plan ledger

**Goal:** preserve current creature animation while replacing ambient transform coercion with an explicit, testable pose contract bound to the intended rig and visible frame.

### Gate 0: preserve current behavior
- [ ] Keep procedural poses as the active production path until articulated consumption is proven.
- [ ] Preserve current creator morph/crossfade behavior.
- [ ] Preserve gameplay movement, collision, outcome and stream ordering.
- [ ] Keep pose admission renderer-side and renderer-neutral upstream.

### Gate 1: define the pose envelope
- [ ] Add `poseId`, `poseRevision`, `schemaVersion` and `sourceKind`.
- [ ] Add `rigId`, `skeletonFingerprint`, `profileRevision` and `meshGeneration`.
- [ ] Declare `mode: absolute | partial`.
- [ ] Declare transform space, handedness, units and quaternion component order.
- [ ] Include predecessor pose revision for partial updates.

### Gate 2: admit transforms
- [ ] Reject non-finite position and rotation components.
- [ ] Version quaternion normalization and zero-length handling.
- [ ] Reject or explicitly repair incomplete quaternion objects.
- [ ] Reject unsupported array lengths and transform representations.
- [ ] Return typed admission warnings and failures.

### Gate 3: bind to the rig
- [ ] Compare pose `rigId` with the mesh rig identity.
- [ ] Compare skeleton and bone-set fingerprints.
- [ ] Define required, optional and ignored bone sets.
- [ ] Reject unknown bones or record them through explicit policy.
- [ ] Prevent earlier profile, rig or mesh generations from applying.

### Gate 4: define full and partial semantics
- [ ] Absolute poses must provide all required bones or restore omissions to rest state.
- [ ] Partial poses must cite a predecessor pose revision.
- [ ] Partial merge must be deterministic and bounded.
- [ ] Restart/profile replacement must clear predecessor pose state.
- [ ] Creator crossfade must declare whether it consumes absolute or partial poses.

### Gate 5: return application results
- [ ] Build a detached pose-application plan before mutating Three.js bones.
- [ ] Return applied, missing, ignored, rejected and repaired bone IDs.
- [ ] Include source pose, rig, mesh and renderer frame identities.
- [ ] Commit no bone changes when admission fails.
- [ ] Project the result through diagnostics without exposing mutable owners.

### Gate 6: integrate articulated presentation
- [ ] Call `solvePlayerArticulatedPose()` from one admitted gameplay presentation path.
- [ ] Select one articulated or typed legacy fallback result.
- [ ] Apply the selected result through the same pose contract.
- [ ] Keep the creator on an explicit preview profile until equivalent proof exists.
- [ ] Preserve the broader motion/presentation parity authority.

### Gate 7: visible-frame proof
- [ ] Publish one visible-pose-frame acknowledgement after render submission.
- [ ] Include run, tick, pose, rig, mesh and renderer revisions.
- [ ] Record the pose-application result ID used by that frame.
- [ ] Reject acknowledgements for stale or failed application results.

### Gate 8: executable proof
- [ ] Add valid Euler and quaternion adapter fixtures.
- [ ] Add malformed, zero and non-finite quaternion fixtures.
- [ ] Add unknown, missing and omitted bone fixtures.
- [ ] Add absolute rest-reset and partial predecessor fixtures.
- [ ] Add wrong-rig and stale-mesh-generation fixtures.
- [ ] Add creator/game adapter parity fixtures.
- [ ] Add articulated-result application fixture.
- [ ] Add browser and deployed Pages visible-frame smokes.

## Candidate kit order

```txt
prehistoric-rush-pose-contract-rig-binding-authority-domain
pose-schema-version-kit
pose-id-revision-kit
pose-source-kind-kit
pose-mode-kit
pose-transform-space-kit
quaternion-convention-kit
pose-rig-binding-kit
skeleton-fingerprint-kit
bone-membership-policy-kit
pose-transform-admission-kit
quaternion-admission-kit
absolute-pose-completeness-kit
partial-pose-predecessor-kit
rest-pose-reconstruction-kit
pose-application-command-kit
pose-application-plan-kit
pose-application-result-kit
stale-pose-rejection-kit
pose-application-observation-kit
pose-application-journal-kit
visible-pose-frame-ack-kit
pose-contract-fixture-kit
browser-pose-contract-smoke-kit
pages-pose-contract-smoke-kit
```

## Validation order

```txt
npm test
fixture:valid-euler-pose
fixture:valid-quaternion-array-pose
fixture:valid-quaternion-object-pose
fixture:malformed-quaternion-rejection
fixture:unknown-bone-policy
fixture:absolute-omitted-bone-restoration
fixture:partial-pose-predecessor
fixture:wrong-rig-rejection
fixture:stale-mesh-generation-rejection
fixture:articulated-result-application
fixture:renderer-pose-application-result
fixture:first-visible-pose-frame
browser creator/game matrix
Pages creator/game smoke
```

Do not remove the legacy pose path until the contract, articulated selection and visible-frame proofs are deterministic and equivalent.