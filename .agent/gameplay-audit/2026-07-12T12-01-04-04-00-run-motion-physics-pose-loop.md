# Gameplay Audit: Run / Motion / Physics / Pose Loop

**Timestamp:** `2026-07-12T12-01-04-04-00`

## Summary

One run tick now produces both a Core Motion frame and a Core Physics request. The same request data is constructed once, but the physics submission is not linked to the committed Core Motion frame by identity. Presentation then derives another pose directly from run state rather than consuming the motion or articulated result.

## Plan ledger

**Goal:** make one gameplay movement decision produce one traceable motion transaction through physics and visible pose.

- [x] Trace product integration and motion-request construction.
- [x] Trace Core Motion intent/frame writes.
- [x] Trace Core Physics submission.
- [x] Trace outcome resolution and renderer pose derivation.
- [x] Identify duplicate ambient derivation boundaries.
- [ ] Implement linked results and replay fixtures.

## Current loop

```txt
input + TickContext
  -> integrate x/z/yaw/speed/jump
  -> build linearVelocity
  -> build motionRequest
  -> coreMotion.submitIntent()
  -> coreMotion.commitMotionFrame({ requests: [motionRequest] })
  -> corePhysics.submitMotionRequests([motionRequest])
  -> coreSimulation proposals/observations/policy commit
  -> render derives legacy pose from state again
```

## What is correctly advanced

```txt
Core Motion is no longer a capability-only placeholder
movement intent is recorded
motion frames carry tick/frame and request data
Core Physics and Core Motion domains are both composed
articulated motion and dynamics subdomains are installed
player rig adaptation exists
```

## Remaining gameplay gaps

```txt
physics request has no coreMotionFrameId
physics frame has no product motionSourceRevision
articulated solver is not invoked per committed gameplay frame
no explicit choice between kinematic articulation and physical articulation
no articulated-dynamics frame is committed for the player
legacy visual pose is derived after the simulation commit
no run restart retirement of motion/pose histories is proven
no creator/game motion-profile parity result exists
```

## Divergence examples

### Motion history advances while presentation does not consume it

```txt
Core Motion frame commits run mode and desired velocity
  -> renderer ignores frame
  -> renderer creates pose from current state and input
  -> diagnostics show a committed motion frame unrelated to applied bones
```

### Physics and presentation can cite different implicit source times

```txt
physics request built inside engine tick
  -> outcome commits
  -> host reads current input/state after tick
  -> legacy pose is created during render
  -> no shared revision proves both used the same source state
```

### Articulation can appear installed but inactive

```txt
rig registration succeeds
articulated-motion snapshot contains rig
solvePlayerArticulatedPose remains unused
current articulated frame remains null or stale
visible mesh still animates
```

## Required gameplay result

```txt
PrehistoricRushMotionStepResult
  runId
  tickId
  frame
  motionSourceRevision
  intentId
  coreMotionFrameId
  physicsRequestIds
  physicsFrameId
  articulationPolicy
  articulatedFrameId | null
  selectedPoseResultId
  outcomeStepId
```

## Required replay cases

```txt
same input/tick schedule -> same motion, physics and selected-pose fingerprints
run restart -> predecessor intent/frame/pose results cannot apply
legacy policy -> typed fallback result, no articulated claim
articulated policy -> solve result consumed by renderer
physical articulation disabled -> articulated-dynamics state explicitly inactive
physical articulation enabled -> dynamics result links to physics frame
```

## Validation boundary

No gameplay code changed. Existing tests do not execute a full engine tick with motion, physics, articulated solve and renderer consumption.