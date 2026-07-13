# Render Audit: Authoritative Pose Visible-Frame Gap

**Timestamp:** `2026-07-13T06-39-10-04-00`

## Summary

The renderer now consumes `game.getPlayerPose()` after the authoritative engine tick, which removes render-loop pose generation. It still derives the actually visible skeleton by damping from prior Three.js bone state with render `dt`, without publishing the resulting pose or a frame acknowledgement.

## Plan ledger

**Goal:** preserve presentation smoothing while proving which simulation pose produced each visible skeleton frame.

- [x] Confirm render-loop legacy pose generation was removed.
- [x] Confirm target pose is read after `engine.tick(dt)`.
- [x] Trace `applyCreaturePoseDamped()` state mutation.
- [x] Identify missing presentation generation and frame receipt.
- [ ] Add runtime readback and visual fixtures later.

## Current render path

```txt
engine.tick(dt)
  -> PlayerPose replacement
  -> game.getState()
  -> game.getPlayerPose()
  -> applyCreaturePoseDamped(player, pose, dt, 18)
  -> mutate bone positions/quaternions from prior rendered state
  -> renderer.render(scene, camera)
```

## Source-backed gap

`PlayerPose` is the authoritative target, but the visible pose is not a direct copy. `applyCreaturePoseDamped()` computes an alpha from render delta time, interpolates positions and slerps rotations in-place, then updates the skeleton. That presentation state is persistent and renderer-owned.

Missing evidence:

```txt
source PlayerPoseFrame ID
source run/tick/frame/rig revision
presentation-pose generation
applied damping alpha
visible bone-transform snapshot
restart/reset snap or transition result
render submission revision
first visible player-pose frame acknowledgement
```

## Restart boundary

`game.start()` replaces `PlayerPose`, but the existing Three.js skeleton remains allocated. On the next render, damping begins from the predecessor run’s bone state. This may be visually desirable, but it is not classified as an intentional cross-run transition, snap or stale-state rejection.

## Required presentation record

```txt
PresentationPoseFrame {
  id,
  generation,
  runId,
  sourcePlayerPoseFrameId,
  policyRevision,
  deltaTime,
  dampingAlpha,
  discontinuityKind,
  visibleBoneFingerprint
}
```

## Required acknowledgement

```txt
VisiblePlayerPoseFrameAck {
  renderFrameId,
  presentationPoseFrameId,
  sourcePlayerPoseFrameId,
  submittedAt,
  renderer: "three"
}
```

## Validation boundary

Static source inspection confirms resource consumption and damping. No browser capture, bone readback, refresh-rate comparison, restart transition or Pages smoke was run.