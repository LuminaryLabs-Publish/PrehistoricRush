# Render Audit: Legacy Pose and Articulated Frame Gap

**Timestamp:** `2026-07-12T22-18-39-04-00`

## Summary

The Three.js player mesh is a skinned procedural creature, but the active render loop applies a legacy procedural pose generated from game-state scalars. It does not consume a committed articulated-motion or articulated-dynamics result, and the rendered frame has no pose revision or fingerprint.

## Plan ledger

**Goal:** make the visible dinosaur skeleton a projection of one admitted pose result rather than an untracked direct mutation.

- [x] Trace mesh and skeleton creation.
- [x] Trace active pose generation and bone application.
- [x] Compare the active path with the installed articulated solve capability.
- [x] Define render receipts and visible-frame proof.
- [ ] Implement and measure later.

## Active render path

```txt
committed RunState
  -> speed/time/turn/jump/resistance scalars
  -> game.createPlayerPose()
  -> proceduralCreatureBody.createPose()
  -> applyCreaturePose()
  -> mutate matching Three.js bones
  -> silently skip unknown bones
  -> renderer.render()
```

## Missing render evidence

```txt
pose frame ID: absent
pose revision: absent
pose fingerprint: absent
source policy: absent
articulated solve result: absent
articulated dynamics frame: absent
bone coverage result: absent
application receipt: absent
first visible pose frame acknowledgement: absent
```

## Required render contract

```txt
CommittedPlayerPose
  -> validate mesh body and skeleton identity
  -> build immutable application plan
  -> reject non-finite transforms before mutation
  -> apply expected bones
  -> record applied and skipped bones
  -> update skeleton
  -> render
  -> publish FirstArticulatedPoseFrameAck
```

## Required frame acknowledgement

```txt
FirstArticulatedPoseFrameAck {
  renderFrameId
  runGeneration
  tickId
  poseRevision
  poseFingerprint
  meshBodyContentHash
  rigId
  appliedBoneCount
}
```

## Proof gaps

- No fixture verifies that the articulated solve result reaches Three.js.
- No fixture verifies that stale pose results are rejected.
- No fixture verifies missing-bone handling.
- No fixture verifies a typed legacy fallback.
- No browser or Pages fixture correlates the pose commit with the visible frame.

## Validation boundary

No renderer, mesh, skeleton, shader, material, camera, or deployment code changed.