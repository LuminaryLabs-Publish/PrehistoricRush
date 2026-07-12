# Motion System Audit: Core Motion, Articulation and Render Contract

**Timestamp:** `2026-07-12T12-08-05-04-00`

## Summary

The current runtime has all major capability surfaces required for an articulated raptor, but no product contract joins them. Core Motion records intent and frames. Core Physics receives movement requests. Articulated motion owns rigs and solving. Articulated dynamics owns physical joints and motors. The procedural creature kit still owns the pose selected by the renderer.

## Plan ledger

**Goal:** define the contract that turns installed motion capabilities into one authoritative visible articulated result.

- [x] Identify all motion and articulation owners.
- [x] Identify duplicated and disconnected data paths.
- [x] Define identity, admission, fallback, commit and observation rules.
- [x] Define fixture requirements.
- [ ] Implement the contract.

## Current capability graph

```txt
Core Motion
  intent -> motion frame -> kinematic request descriptor

Core Physics
  body/collider state -> motion request -> provider step -> physics frame

Articulated Motion
  rig -> base pose + targets -> solved pose -> articulated frame

Articulated Dynamics
  physical articulation -> joints/motors/ragdoll -> physical frame

Procedural Creature
  creature descriptor -> legacy animation pose

Three Renderer
  pose object -> direct bone transforms -> visible frame
```

## Current disconnects

```txt
Core Motion frame does not authorize the Core Physics request by ID
Core Physics frame does not cite the motion frame
articulated solve is not scheduled by the game loop
articulated dynamics is not reconciled with visible pose
legacy pose bypasses motion and articulation result admission
creator has no comparable motion-domain profile
renderer returns no pose-application receipt
```

## Contract

### Motion source policy

```txt
source = articulated | legacy-fallback | frozen-predecessor
```

The source is selected through an explicit versioned policy. Capability availability alone must not choose the source.

### Articulated solve command

```txt
ArticulatedSolveCommand {
  actorId,
  runId,
  runRevision,
  profileRevision,
  rigId,
  rigGeneration,
  motionFrameId,
  physicsFrameId,
  basePoseRevision,
  targets,
  expectedPoseRevision
}
```

### Articulated solve result

```txt
ArticulatedSolveResult {
  accepted,
  resultId,
  actorId,
  rigId,
  rigGeneration,
  motionFrameId,
  physicsFrameId,
  poseRevision,
  solvedBoneCount,
  rejectedTargets,
  fallbackReason
}
```

### Renderer receipt

```txt
RendererPoseReceipt {
  accepted,
  meshGeneration,
  renderFrameId,
  poseSource,
  poseResultId,
  poseRevision,
  appliedBoneCount,
  rejectedBoneIds
}
```

## Commit barrier

```txt
prepare motion frame
prepare physics request
prepare articulated solve
select pose source
validate run/profile/rig/mesh generations
commit product motion result
apply pose
acknowledge visible frame
```

A failure before product commit preserves the predecessor state. A failure after commit but before visible application must produce a typed frame-pending or presentation-failed result; it must not silently display an unrelated pose.

## Fallback policy

Legacy pose fallback is allowed only when:

```txt
policy explicitly enables it
articulated solve is unavailable or rejected with an allowed reason
fallback uses the same admitted run/profile generation
readback reports legacy-fallback
visible frame receipt cites the fallback result
```

## Required observations

```txt
last motion intent and sequence
last motion frame and request IDs
last physics frame and authorizing motion frame
current rig and generation
last articulated solve result
last selected pose source
last renderer pose receipt
last visible pose-frame acknowledgement
bounded mismatch journal
```

## Required fixtures

```txt
motion-frame/physics-request linkage
articulated solve accepted path
explicit legacy fallback path
solve failure without fallback
stale run/profile/rig/mesh rejection
articulated-dynamics snapshot parity
creator/game pose-profile comparison
renderer bone receipt
first visible pose-frame acknowledgement
browser and Pages parity
```

## Validation boundary

Documentation only. No motion-domain, physics-domain, articulation or renderer implementation changed.