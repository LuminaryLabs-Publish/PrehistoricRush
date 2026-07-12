# Gameplay Audit: Motion, Physics, Articulation and Pose Loop

**Timestamp:** `2026-07-12T12-08-05-04-00`

## Summary

One gameplay tick derives a kinematic request from product run state, records that request inside a Core Motion frame, and independently submits the same object to Core Physics. The visible pose is then derived again from run state through the legacy creature pose path. The product has no single result that proves these representations describe the same actor step.

## Plan ledger

**Goal:** make movement, physical body motion, articulated solving and visible gait one admitted gameplay transaction.

- [x] Trace run-state integration.
- [x] Trace Core Motion intent/frame publication.
- [x] Trace Core Physics request submission.
- [x] Trace player rig registration and solver API.
- [x] Trace visible pose derivation.
- [ ] Add one revisioned motion/presentation transaction.

## Current loop

```txt
input steer/boost
  -> product run-state integration
  -> next position, yaw, velocity and grounded mode
  -> Core Motion submitIntent()
  -> Core Motion commitMotionFrame({ requests: [motionRequest] })
  -> Core Physics submitMotionRequests([motionRequest])
  -> simulation outcome commit
  -> renderer derives a new legacy pose from run state
  -> Three.js skeleton application
```

## Gaps

```txt
motion request does not carry motionFrameId
physics frame does not report authorizing motion frame
articulated solve is optional API with no production caller
run-state result does not carry pose source
legacy pose is generated after the tick outside result admission
no rollback or stale rejection spans run/profile/rig/mesh generations
no frame receipt joins simulation, motion, physics, pose and render
```

## Consequences

### Installed but inactive articulation

```txt
articulated rig exists
articulated solver exists
visible gait remains legacy
```

### Divergent histories

```txt
Core Motion frame advances
Core Physics request advances
legacy pose advances from elapsed time
articulated frame may not advance
```

### Creator/game mismatch

```txt
creator profile preview -> procedural creature pose only
gameplay -> Core Motion and Physics installed, but procedural creature pose still selected
```

## Required gameplay result

```txt
PlayerMotionPresentationResult
  runId
  runRevision
  actorId
  motionIntentId
  motionFrameId
  physicsRequestId
  physicsFrameId
  rigId
  poseSource
  poseResultId
  poseRevision
  outcome
  visibleFramePending
```

## Required precedence

```txt
invalid/stale run generation -> reject
invalid profile or rig generation -> reject
Core Motion frame commit failure -> preserve predecessor
Core Physics admission failure -> preserve predecessor
articulated solve accepted -> select articulated pose
articulated solve unavailable and fallback allowed -> typed legacy fallback
fallback not allowed -> reject frame presentation
renderer application failure -> retain previous visible pose and report failure
```

## Required fixtures

```txt
one tick creates one motion frame and one linked physics request
articulated solve result changes visible pose
explicit fallback still produces deterministic legacy pose
stale solve from prior run is rejected
stale solve from prior profile/rig generation is rejected
creator and game declare equivalent profile/pose policy
visible frame cites the committed gameplay result
```

## Validation boundary

No gameplay code or tests changed. Existing adapter tests do not prove this full loop.