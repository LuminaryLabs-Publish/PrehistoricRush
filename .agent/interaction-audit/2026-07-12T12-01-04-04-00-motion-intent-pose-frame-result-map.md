# Interaction Audit: Motion Intent / Pose / Frame Result Map

**Timestamp:** `2026-07-12T12-01-04-04-00`

## Summary

Browser input, product run state, Core Motion, Core Physics, articulated motion and rendering currently exchange data through direct calls and ambient snapshots. They do not exchange one typed interaction result that survives from input admission through the visible pose frame.

## Plan ledger

**Goal:** define explicit command/result boundaries for every participant in the player-motion interaction.

- [x] Map browser input to product state.
- [x] Map product state to motion and physics calls.
- [x] Map available articulation APIs to renderer consumption.
- [x] Identify missing IDs, revisions and rejection paths.
- [ ] Implement typed admission and result projection.

## Current command map

```txt
keydown/keyup/blur
  -> ambient browser input object
  -> game.setInput(patch)

engine.tick
  -> runSystem mutates proposed run state
  -> coreMotion.submitIntent(intent)
  -> coreMotion.commitMotionFrame(frame)
  -> corePhysics.submitMotionRequests(requests)
  -> coreSimulation commits outcome

render
  -> game.createPlayerPose(poseState)
  -> applyCreaturePose(mesh, pose)
  -> renderer.render(scene, camera)
```

## Missing command identities

```txt
browser input command ID
input sequence / held-state revision
product motion source revision
physics authorization reference
articulated solve command ID
pose selection command ID
renderer bone-application command ID
visible pose-frame receipt ID
```

## Missing typed outcomes

```txt
input admission result
motion step result
physics request linkage result
articulated solve result selected for presentation
legacy fallback result
renderer bone-application result
first visible motion-frame acknowledgement
```

## Proposed interaction envelope

```txt
PlayerMotionCommand
  commandId
  runId
  observedTickId
  inputRevision
  steer
  boost
  jumpEdge

MotionStepResult
  commandId
  motionSourceRevision
  intentId
  coreMotionFrameId
  physicsRequestIds
  status

PoseSelectionResult
  motionSourceRevision
  policy
  articulatedFrameId | null
  poseResultId
  fallbackReason | null

RendererPoseResult
  poseResultId
  meshId
  rendererFrameId
  status

MotionVisibleFrameAck
  runId
  tickId
  coreMotionFrameId
  physicsFrameId
  poseResultId
  rendererFrameId
```

## Rejection rules

```txt
reject duplicate input command ID
reject input observed against retired run generation
reject physics request not authorized by selected Core Motion frame
reject articulated result for a different rig/profile generation
reject stale pose after creator profile change or run restart
reject renderer acknowledgement for an unselected pose
```

## Public read model

The public host should project a detached result such as:

```txt
motionPresentation
  currentRunId
  latestInputRevision
  latestCoreMotionFrameId
  latestPhysicsFrameId
  latestArticulatedFrameId
  selectedPoseResultId
  selectedPoseKind
  latestRendererFrameId
  parityStatus
```

It should not require consumers to infer parity by comparing independent mutable owners.

## Validation boundary

No interaction behavior changed. No duplicate, stale, cross-run or first-visible-frame fixture exists yet.