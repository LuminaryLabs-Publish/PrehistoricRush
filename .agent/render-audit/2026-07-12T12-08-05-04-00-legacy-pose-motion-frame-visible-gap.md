# Render Audit: Legacy Pose vs Motion Frame Visible Gap

**Timestamp:** `2026-07-12T12-08-05-04-00`

## Summary

The gameplay renderer positions and rotates the raptor from committed run state, then calls `game.createPlayerPose(...)` and applies that legacy pose directly to the Three.js skeleton. It does not consume the Core Motion frame, articulated-motion result or articulated-dynamics state that the same runtime exposes.

The creator preview is further separated: it installs only the seed and procedural-creature kits, then drives its preview from the creature API and transition adapter without Core Motion or articulation.

## Plan ledger

**Goal:** make every visible raptor frame prove which run, motion, physics and pose revisions were applied to its skeleton.

- [x] Trace gameplay mesh creation and bone application.
- [x] Trace creator preview composition and pose generation.
- [x] Confirm the production renderer has no articulated-solve call site.
- [x] Confirm no visible pose receipt exists.
- [ ] Implement pose-source selection and frame acknowledgement.

## Current gameplay frame

```txt
state.x/y/z and state.yaw
  -> player mesh transform

state.speed/elapsed/steer/jump/resistance
  -> game.createPlayerPose()
  -> procedural-creature legacy pose
  -> applyCreaturePose()
  -> Three.js bones
  -> renderer.render(scene, camera)
```

The frame does not carry:

```txt
motionFrameId
physicsFrameId
articulatedFrameId
poseResultId
poseSource
poseRevision
rigGeneration
meshGeneration
boneApplicationReceipt
visibleFrameId
```

## Current creator frame

```txt
profile draft
  -> seed-kit + procedural-creature-body-kit
  -> character preview transition
  -> creature API pose
  -> Three.js preview mesh
```

The creator does not install Core Motion, articulated motion, Core Physics or articulated dynamics. It therefore cannot prove pose-policy parity with gameplay.

## Visible mismatch

```txt
Core Motion snapshot may advance
articulated-motion snapshot may remain empty
articulated-dynamics snapshot may remain empty
legacy pose still animates the visible mesh
```

A diagnostics consumer can see articulation capabilities installed and mistake capability presence for visible consumption.

## Required render contract

```txt
PoseApplicationCommand
  actorId
  runId
  profileRevision
  rigId
  rigGeneration
  meshGeneration
  poseSource
  poseResultId
  poseRevision
  expectedRenderFrame

RendererBoneApplicationResult
  accepted
  appliedBoneCount
  rejectedBoneIds
  poseSource
  poseRevision
  meshGeneration
  renderFrameId

VisiblePoseFrameAck
  renderFrameId
  visibleFrameId
  runRevision
  motionFrameId
  physicsFrameId
  poseResultId
  poseSource
```

## Required fixtures

```txt
articulated result changes visible bones
legacy fallback is explicit in readback
stale rig result cannot alter a recreated mesh
creator and game profile descriptors are comparable
one frame cannot combine a new mesh with an old pose generation
public readback reports consumed pose source, not installed capability
```

## Validation boundary

Documentation-only render audit. No visual output or shader/mesh source changed.