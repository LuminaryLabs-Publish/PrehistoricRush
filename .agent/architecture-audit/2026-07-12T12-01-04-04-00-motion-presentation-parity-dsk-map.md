# Architecture Audit: Motion / Presentation Parity DSK Map

**Timestamp:** `2026-07-12T12-01-04-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Summary

The runtime now composes the Core Motion and Core Physics parent domains, including articulated-motion and articulated-dynamics subdomains. Product movement writes Core Motion intent/frame data and separately sends a raw kinematic request to Core Physics. The visible raptor remains driven by a legacy procedural pose derived directly from run state.

## Plan ledger

**Goal:** preserve domain composition while introducing one product-level authority that selects, correlates and proves the motion result consumed by physics and presentation.

- [x] Identify parent and subdomain ownership.
- [x] Separate movement intent, physical motion, kinematic articulation and renderer-bone ownership.
- [x] Trace the current bypass from run state to legacy visual pose.
- [x] Define the smallest product authority needed for cross-domain parity.
- [x] Avoid placing renderer bone ownership inside Core Motion or Core Physics.
- [ ] Implement and execute the authority.

## Current domain composition

```txt
n:core-motion
  owns movement modes, intent, trajectories and motion frames

n:core-motion:articulation
  owns rig descriptors, articulated poses, IK targets and solved articulated frames
  does not own renderer bones or physics joints

n:core-physics
  owns providers, bodies, colliders, motion requests and physics frames

n:core-physics:articulated-dynamics
  owns physical articulation descriptors, joints, motors, ragdoll blend and dynamics frames
  does not own kinematic rig solving or renderer bones

n:prehistoric-rush
  owns run state, route/surface semantics, product outcome policy, player rig adaptation and product presentation selection
```

This separation is correct. The missing layer is product composition across the four domains and the Three adapter.

## Current source graph

```txt
browser input
  -> PrehistoricRush InputState
  -> runSystem integrates RunState
  -> Core Motion submitIntent
  -> Core Motion commitMotionFrame
  -> Core Physics submitMotionRequests(raw request)
  -> Core Simulation resolves outcome

separate presentation path
  -> game.createPlayerPose(run-state-derived pose state)
  -> procedural-creature-body-kit createPose
  -> Three applyCreaturePose
```

Available but not consumed:

```txt
player articulated rig
solvePlayerArticulatedPose()
articulated-motion current frame
articulated-dynamics current frame
```

## Required composed domain

```txt
prehistoric-rush-motion-presentation-parity-authority-domain
```

### Owns

```txt
product motion source revision
product motion/presentation policy
motion frame -> physics request linkage
articulated solve admission and result selection
legacy pose fallback policy
creator/game motion profile parity
renderer pose-consumption receipt
first visible pose-frame acknowledgement
product observations and journal
```

### Does not own

```txt
Core Motion intent schemas
Core Physics provider/body implementation
articulated IK algorithms
Rapier joint handles
procedural creature geometry or skeleton construction
Three.js bone objects
browser RAF scheduling
```

## Candidate kit composition

```txt
prehistoric-rush-motion-presentation-parity-authority-domain
motion-source-revision-kit
motion-intent-sequence-kit
motion-frame-provenance-kit
physics-motion-request-link-kit
articulated-rig-adoption-kit
articulated-target-plan-kit
articulated-pose-result-kit
presentation-pose-selection-kit
legacy-pose-fallback-policy-kit
creator-motion-profile-kit
game-motion-profile-kit
creator-game-motion-parity-kit
renderer-bone-application-result-kit
motion-presentation-frame-ack-kit
stale-pose-result-rejection-kit
motion-presentation-observation-kit
motion-presentation-journal-kit
game-core-motion-to-render-fixture-kit
articulated-solve-consumption-fixture-kit
creator-game-pose-parity-fixture-kit
physics-motion-frame-parity-fixture-kit
browser-motion-presentation-smoke-kit
pages-motion-presentation-smoke-kit
```

## Required command/result flow

```txt
TickContext + product run state + input
  -> MotionSourceRevision
  -> Core Motion intent command
  -> Core Motion frame result
  -> linked Core Physics request
  -> physics frame result
  -> articulated target plan
  -> articulated pose result or explicit legacy fallback result
  -> renderer bone-application result
  -> visible pose-frame acknowledgement
```

Every result must cite:

```txt
runId
tickId
frame
motionSourceRevision
coreMotionFrameId
physicsRequestId / physicsFrameId
rigId
poseResultId
creature profile revision
renderer frame ID
```

## Admission rules

```txt
reject physics request without authorized Core Motion frame
reject pose result for predecessor run/profile/rig generation
reject renderer application of an unselected pose result
reject public articulated-presentation claim without consumption receipt
allow legacy pose only through explicit policy with typed reason
creator profile and game profile must resolve the same rig/skeleton identity
```

## Migration order

1. Add source and frame identity without changing visual behavior.
2. Link the existing physics request to the Core Motion frame.
3. Add a typed legacy-pose selection result and renderer receipt.
4. Invoke articulated solving with zero targets and prove pose equivalence.
5. Add ground/foot targets and compare against the legacy presentation.
6. Install the same motion profile in the creator or explicitly declare creator preview mode.
7. Add first-visible-frame and Pages proof.
8. Remove ambient legacy bypass only after parity fixtures pass.

## Architecture decision

Do not move Three.js bone application into Core Motion. Core Motion and articulated motion remain renderer-neutral. The product authority selects an articulated or legacy pose result, and the Three adapter reports whether that selected result was applied to the intended creature mesh and visible frame.