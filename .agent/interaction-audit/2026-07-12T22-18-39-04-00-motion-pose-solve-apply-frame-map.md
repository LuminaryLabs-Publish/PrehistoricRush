# Interaction Audit: Motion, Pose Solve, Apply, and Frame Map

**Timestamp:** `2026-07-12T22-18-39-04-00`

## Summary

The player interaction chain reaches simulation and motion authority, then exits that chain before presentation. This map defines the command and result surfaces needed to preserve provenance through pose solving and visible application.

## Plan ledger

**Goal:** map every boundary from input to first visible articulated frame.

- [x] Map browser input to RunState.
- [x] Map RunState to motion and physics requests.
- [x] Map existing pose and articulation APIs.
- [x] Define missing command/result edges.
- [ ] Implement later.

## Current map

```txt
browser input
  -> game.setInput
  -> RunState successor
  -> Core Motion intent/frame
  -> Core Physics motion request/frame
  -> Core Simulation commit

render branch
  -> game.createPlayerPose
  -> legacy procedural pose
  -> applyCreaturePose
  -> Three.js skeleton
  -> renderer.render

available but not connected
  -> solvePlayerArticulatedPose
  -> articulatedMotion.solve
  -> articulated motion snapshot
  -> articulated dynamics snapshot
```

## Required map

```txt
PlayerPoseFrameCommand
  -> PoseInputBindingResult
  -> BasePoseResult
  -> ArticulatedTargetSetResult
  -> ArticulatedSolveResult or TypedFallbackResult
  -> PoseValidationResult
  -> PlayerPoseCommitResult
  -> ThreeSkeletonApplicationResult
  -> FirstArticulatedPoseFrameAck
```

## Admission fields

```txt
runtime session
run generation
tick ID and frame
player body ID and content hash
profile revision
rig ID and revision
motion frame ID
physics frame ID
optional dynamics frame ID
expected predecessor pose revision
source policy
```

## Rejection cases

```txt
stale run or tick
body/rig/skeleton mismatch
missing committed motion input
non-finite transform
unknown required bone
solver failure without admitted fallback
pose predecessor mismatch
duplicate command
render application failure
```

## Validation boundary

Documentation only. No browser input, motion, physics, pose, skeleton, or frame behavior changed.