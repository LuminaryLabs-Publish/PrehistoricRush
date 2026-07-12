# Render Audit: Quaternion Pose to Visible Bone Gap

**Timestamp:** `2026-07-12T14-10-22-04-00`

## Summary

The Three.js adapter can now apply quaternion rotations directly or through damped slerp. The render path still cannot prove that the quaternion is valid for the target rig, that all required bones were handled, or that a submitted pose produced the visible frame.

## Plan ledger

**Goal:** make visible creature animation report exactly which admitted pose changed which bones on which mesh generation.

- [x] Trace direct and damped pose application.
- [x] Trace game and creator render submission.
- [x] Identify silent coercion and omission behavior.
- [x] Define renderer receipts and visible-frame proof.
- [ ] Implement browser fixtures.

## Current render path

```txt
pose object
  -> lookup mesh.userData.boneById
  -> for each supplied bone
  -> coerce position array/object
  -> decode quaternion array/object or use Euler fallback
  -> mutate Three.js bone
  -> update skeleton
  -> return undefined
  -> render scene
```

## Visible-truth gaps

```txt
no pose schema or revision in adapter input
no rig/skeleton comparison
no transform-space declaration
no full/partial mode
unknown bone skipped without result
omitted bone preserved without result
no before/after bone fingerprint
no application result ID
no renderer frame ID linkage
no first-visible-frame acknowledgement
```

## Failure examples

### Stale omitted transform

A prior pose rotates the tail. The next pose omits the tail. The tail remains rotated because the adapter touches only supplied entries. The renderer cannot say whether that is intended partial blending or stale state.

### Wrong rig partial match

A pose from another skeleton contains several matching bone names. Those transforms apply while nonmatching bones are ignored. The frame can look partly plausible while violating rig provenance.

### Silent quaternion repair

A quaternion object missing fields receives default components before normalization. The renderer emits no warning, rejection or repair record.

## Required renderer contract

```txt
admitted PoseApplicationPlan
  -> verify target mesh generation
  -> stage all bone transforms
  -> compute applied/missing/unknown sets
  -> commit atomically
  -> return PoseApplicationResult
  -> submit render frame citing result ID
  -> acknowledge first visible frame
```

## Required result fields

```txt
poseId
poseRevision
rigId
skeletonFingerprint
meshGeneration
applicationFingerprint
appliedBoneIds
missingBoneIds
ignoredBoneIds
rejectedBoneIds
repairedBoneIds
rendererFrameId
visibleFrameId
```

## Proof gate

No visible-bone correctness claim is valid until a browser fixture observes the target mesh after application and correlates it with a typed result and rendered frame.