# Pose System Audit: Pose Frame Revision and Damping Contract

**Timestamp:** `2026-07-13T06-39-10-04-00`

## Summary

The authoritative simulation target and the visible presentation pose are now distinct states. This contract keeps that distinction intentional, revisioned and observable.

## Plan ledger

**Goal:** define the minimum contract required before foot IK, pelvis correction or secondary motion is layered onto the new authoritative pose resource.

- [x] Separate simulation target pose from visible damped pose.
- [x] Define identities, terminal results and restart behavior.
- [x] Define public observation and fixture requirements.
- [ ] Implement before adding stateful per-bone post-processing.

## Required identities

```txt
PlayerPoseSessionId
PlayerPoseRunGeneration
PlayerRigRevision
PlayerPoseSolveCommandId
PlayerPoseFrameId
PlayerPoseRevision
PresentationPoseGeneration
PresentationPoseFrameId
VisibleRenderFrameId
```

## PlayerPoseFrame

```txt
PlayerPoseFrame {
  id,
  revision,
  sessionId,
  runId,
  runGeneration,
  tickId,
  frame,
  rigId,
  rigRevision,
  sourceStateFingerprint,
  pose,
  metadata
}
```

The stored resource should retain this envelope rather than only the inner pose.

## PresentationPoseFrame

```txt
PresentationPoseFrame {
  id,
  generation,
  sourcePlayerPoseFrameId,
  sourcePlayerPoseRevision,
  policyRevision,
  deltaTime,
  dampingAlpha,
  discontinuity: None | Snap | Restart | Teleport | RigChange,
  visibleBoneFingerprint
}
```

## Terminal results

```txt
Accepted
Duplicate
StaleRun
StaleTick
StaleRig
MissingSource
InvalidPose
SolveFailed
PresentationRetired
Cancelled
```

Non-accepted results must not replace the resource or mutate successor presentation bones.

## Damping policy

```txt
normal successor pose -> damp under bounded dt
first pose -> snap
run restart -> authored snap or transition result
rig revision change -> mandatory snap/rebuild
large elapsed gap -> authored clamp/snap result
missing source pose -> explicit hold/reject result
```

## Compatibility API policy

`createPlayerPose()` and `solvePlayerArticulatedPose()` may remain for tools and previews, but their outputs must be classified as detached candidates. Only a committed `PlayerPoseFrame` may drive the game renderer.

## Future feature insertion points

```txt
legacy procedural pose
  -> articulated base pose
  -> foot IK targets
  -> pelvis correction
  -> secondary motion
  -> committed PlayerPoseFrame
  -> presentation smoothing
```

Each future stage should preserve source IDs and return a typed result rather than mutating the resource invisibly.

## Fixture matrix

```txt
initial pose frame identity
one pose commit per admitted game tick
clone isolation
run restart generation
rig revision change
missing/failed solve preservation
30/60/120/144 Hz presentation behavior
large-delta clamp or snap
first visible frame correlation
source/build/Pages parity
```

## Completion gate

Do not add stateful foot IK or secondary motion to the live player path until pose frames carry revisions, restart semantics are explicit and presentation provenance is observable.