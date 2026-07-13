# Architecture Audit: Articulated Pose Presentation DSK Map

**Timestamp:** `2026-07-12T22-18-39-04-00`  
**Parent domain:** `prehistoric-rush-articulated-pose-presentation-authority-domain`

## Summary

The repository already has the required simulation, motion, rig, articulation, dynamics, procedural pose, skeleton, and render participants. What is missing is the coordinating domain that selects one pose source, validates it against the current run/tick/rig, commits a terminal result, and binds it to the visible frame.

## Plan ledger

**Goal:** define a fiction-neutral coordinator without moving internal mechanics out of their existing kits.

- [x] Map simulation, Core Motion, Core Physics, articulated motion, articulated dynamics, procedural creature, and Three.js participants.
- [x] Separate pose coordination from solver and renderer implementation.
- [x] Define candidate kits, commands, results, invariants, and failure handling.
- [x] Define visible-frame provenance.
- [ ] Implement later.

## Ownership boundary

```txt
owns:
  pose command/frame identity
  run/tick/profile/body/rig admission
  pose-source policy
  motion and dynamics input binding
  base-pose and target-set identity
  articulated solve admission
  bone-coverage and finite-transform validation
  fallback classification
  pose commit result
  skeleton application result
  pose journal
  first visible pose frame acknowledgement

does not own:
  gameplay movement rules
  Core Motion implementation
  Rapier stepping
  articulated solver internals
  procedural creature generation
  Three.js skeleton implementation
  camera or scene drawing
```

## Candidate kits

```txt
player-pose-command-id-kit
player-pose-frame-id-kit
player-pose-source-policy-kit
player-pose-run-tick-admission-kit
player-rig-revision-kit
player-base-pose-adapter-kit
player-motion-frame-binding-kit
player-articulated-target-set-kit
player-articulated-solve-kit
player-dynamics-observation-kit
player-pose-bone-coverage-kit
player-pose-fallback-policy-kit
player-pose-candidate-fingerprint-kit
player-pose-commit-result-kit
player-pose-application-plan-kit
three-skeleton-pose-application-result-kit
player-pose-presentation-journal-kit
first-articulated-pose-frame-ack-kit
```

## Required command

```txt
PlayerPoseFrameCommand {
  commandId
  runtimeSessionId
  runGeneration
  tickId
  frame
  playerBodyId
  bodyContentHash
  profileRevision
  rigId
  rigRevision
  expectedPreviousPoseRevision
  sourcePolicy
}
```

## Required terminal result

```txt
PlayerPoseCommitResult {
  status: committed | fallback-committed | rejected | failed
  poseRevision
  poseFingerprint
  sourceKind
  runGeneration
  tickId
  motionFrameId
  physicsFrameId
  articulatedFrameId
  dynamicsFrameId
  rigId
  appliedBoneCount
  skippedBones
  fallbackReason
}
```

## Required transaction

```txt
PlayerPoseFrameCommand
  -> validate session, run, tick, body, profile, rig, and predecessor pose
  -> bind committed game, motion, physics, and optional dynamics observations
  -> create immutable base pose and target set
  -> run articulated solve when policy requires it
  -> validate finite transforms, rig identity, and bone coverage
  -> choose articulated or typed fallback candidate
  -> fingerprint and commit one pose result
  -> apply only the committed candidate to Three.js bones
  -> publish application receipt
  -> render and acknowledge first matching visible frame
```

## Required invariants

```txt
one rendered player frame cites one pose commit
pose revision and tick are monotonic within one run
body, profile, rig, and skeleton identities agree
articulated solve cannot be bypassed silently when policy requires it
fallback is explicit, typed, and journaled
unknown bones cannot disappear without a coverage receipt
failed validation causes zero skeleton mutation
public readback cites the pose actually shown
```

## Validation boundary

Architecture documentation only. No DSK, runtime, solver, physics, render, or deployment implementation changed.