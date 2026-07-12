# Interaction Audit: Motion Intent to Articulation Result Map

**Timestamp:** `2026-07-12T12-08-05-04-00`

## Summary

Browser input currently updates product input state directly. The product then derives run state, submits Core Motion intent, commits a motion frame and submits a physics request. No command/result envelope extends through articulated solve and renderer pose application.

## Plan ledger

**Goal:** map every interactive movement input to typed motion, physics, pose and visible-frame results.

- [x] Trace keyboard/button input to product state.
- [x] Trace product state to Core Motion and Core Physics.
- [x] Trace the optional articulated solver API.
- [x] Trace direct renderer pose application.
- [ ] Replace ambient calls with ordered commands and results.

## Current path

```txt
browser key/button state
  -> product input patch
  -> run-state integration
  -> Core Motion intent
  -> Core Motion frame
  -> Core Physics request
  -> simulation outcome
  -> legacy pose creation
  -> direct bone application
```

## Missing commands and results

```txt
MotionIntentCommand
MotionIntentResult
MotionFrameCommitResult
PhysicsMotionAdmissionResult
ArticulatedSolveCommand
ArticulatedSolveResult
LegacyPoseFallbackResult
PoseSourceSelectionResult
RendererPoseApplicationResult
VisiblePoseFrameAck
```

## Admission context

Every command must carry:

```txt
sessionId
runId
runRevision
actorId
inputSequence
profileRevision
rigId
rigGeneration
meshGeneration
expectedMotionRevision
expectedPoseRevision
```

## Rejection cases

```txt
stale browser input sequence
wrong run epoch
profile changed during solve
rig replaced during solve
mesh recreated before pose application
motion frame superseded
physics request not linked to motion frame
unknown pose source
articulated solve failure without allowed fallback
renderer rejects bone set
visible frame does not cite applied pose revision
```

## Result map

```txt
MotionIntentCommand
  -> MotionIntentAccepted | MotionIntentRejected

MotionFrameCommitCommand
  -> MotionFrameCommitted | MotionFrameRejected

PhysicsMotionCommand
  -> PhysicsMotionAccepted | PhysicsMotionRejected

ArticulatedSolveCommand
  -> ArticulatedPoseCommitted | LegacyFallbackCommitted | PoseRejected

RendererPoseApplicationCommand
  -> PoseApplied | PoseApplicationRejected

Visible-frame observation
  -> VisiblePoseFrameAcknowledged | VisiblePoseFrameMismatch
```

## Public readback rule

```txt
installed articulation capability != consumed articulated pose
```

Readback must expose both capability and the last consumed pose source/result. An empty articulated frame with a moving visible mesh must be reported as legacy fallback, not as articulated presentation.

## Validation boundary

Interaction documentation only. No input, command or renderer behavior changed.