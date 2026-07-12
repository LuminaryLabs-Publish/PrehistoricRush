# Pose System Audit: Schema, Space, Rig and Application Contract

**Timestamp:** `2026-07-12T14-10-22-04-00`

## Summary

The adapter currently infers pose meaning from JavaScript shape. A safe system needs explicit schema, coordinate convention, pose mode, rig binding and application receipts.

## Plan ledger

**Goal:** define the minimum product contract needed to apply procedural or articulated poses deterministically to a Three.js skeleton.

- [x] Define pose envelope fields.
- [x] Define transform admission rules.
- [x] Define rig and bone-set binding.
- [x] Define absolute and partial semantics.
- [x] Define application and visibility results.
- [ ] Implement and validate the contract.

## Pose envelope

```txt
PoseEnvelope {
  poseId
  poseRevision
  schemaVersion
  sourceKind
  mode: absolute | partial
  transformSpace: local-parent
  handedness: right
  quaternionOrder: xyzw
  rigId
  skeletonFingerprint
  profileRevision
  sourceFrameId?
  predecessorPoseRevision?
  bones
}
```

## Bone transform schema

```txt
BoneTransform {
  position?: [x, y, z]
  rotation?: [x, y, z, w]
  scale?: [x, y, z]
  weight?: number
}
```

Object forms may be supported only through an explicit schema version. Silent defaulting is not an admission policy.

## Admission rules

```txt
all numeric components finite
position exactly three components
quaternion exactly four components in declared order
zero-length quaternion rejected or explicitly mapped by policy
normalization reports whether repair occurred
weight clamped or rejected through typed policy
rigId and skeleton fingerprint match target
bone IDs classified against required/optional/unknown sets
partial pose cites active predecessor revision
absolute pose has deterministic omitted-bone handling
```

## Absolute pose semantics

```txt
required supplied bones are applied
required omitted bones restore admitted rest transforms
optional omitted bones restore or preserve according to versioned policy
unknown bones reject or are explicitly ignored and reported
```

## Partial pose semantics

```txt
predecessor pose revision required
only supplied bones change
unsupplied bones inherit from the cited predecessor
merge result receives a new pose revision and fingerprint
```

## Application transaction

```txt
admit envelope
  -> validate target generation
  -> build detached per-bone plan
  -> compute result sets and fingerprint
  -> commit all transforms
  -> update skeleton
  -> publish application result
  -> render frame citing result
```

## Observation and journal

Record bounded immutable entries containing:

```txt
command/result IDs
pose and predecessor revisions
rig/skeleton/mesh generations
source kind and frame
applied/missing/ignored/rejected/repaired counts
reason codes
application fingerprint
renderer and visible-frame IDs
```

## Compatibility policy

Legacy Euler poses should be converted into the same canonical quaternion envelope before application. Articulated poses should not bypass the contract merely because they already contain quaternions.