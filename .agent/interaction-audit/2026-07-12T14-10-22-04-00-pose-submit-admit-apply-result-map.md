# Interaction Audit: Pose Submit, Admit, Apply and Result Map

**Timestamp:** `2026-07-12T14-10-22-04-00`

## Summary

Pose application is currently a direct function call with ambient mutation and no command/result boundary. This audit defines the interaction contract required between pose producers, rig admission and the Three.js consumer.

## Plan ledger

**Goal:** replace direct pose mutation with one typed command and one observable result.

- [x] Identify all current pose submission paths.
- [x] Identify producer and consumer identities.
- [x] Define admission, apply and result stages.
- [x] Define stale-command rejection.
- [ ] Implement command routing and fixtures.

## Current interaction map

```txt
game.createPlayerPose(state)
  -> applyCreaturePose(mesh, pose)
  -> undefined

creatureApi.createPose(state)
  -> applyCreaturePoseDamped(mesh, pose, dt)
  -> undefined

game.solvePlayerArticulatedPose(state, targets)
  -> articulated result
  -> no renderer consumer
```

## Required command

```txt
PoseApplicationCommand {
  commandId
  runId
  tickId
  poseId
  poseRevision
  schemaVersion
  sourceKind
  mode
  rigId
  skeletonFingerprint
  profileRevision
  meshGeneration
  predecessorPoseRevision?
  transformSpace
  quaternionConvention
  bones
}
```

## Admission results

```txt
accepted
rejected-schema
rejected-transform
rejected-rig
rejected-skeleton
rejected-generation
rejected-predecessor
rejected-bone-policy
accepted-with-explicit-repairs
```

## Application result

```txt
PoseApplicationResult {
  commandId
  resultId
  accepted
  appliedBoneIds
  missingBoneIds
  ignoredBoneIds
  rejectedBoneIds
  repairedBoneIds
  predecessorPoseRevision
  committedPoseRevision
  meshGeneration
  applicationFingerprint
  reasonCodes
}
```

## Required interaction ordering

```txt
producer creates detached pose envelope
  -> command admission validates identity and schema
  -> rig binding validates target generation
  -> application plan classifies every bone
  -> mutation commits atomically or not at all
  -> result publishes before render submission
  -> visible frame cites result ID
```

## Stale work rules

Reject commands when any of these differs from the active target:

```txt
runId
profileRevision
rigId
skeletonFingerprint
meshGeneration
predecessorPoseRevision for partial poses
```

## Public surface

Public diagnostics should expose immutable pose observations and results. They should not expose the mutable Three.js skeleton or raw application function.