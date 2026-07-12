# Render Audit: Legacy Pose / Articulated Frame Gap

**Timestamp:** `2026-07-12T12-01-04-04-00`

## Summary

The game visibly animates the raptor through `game.createPlayerPose(...)` and `applyCreaturePose(...)`. It does not consume `solvePlayerArticulatedPose()` or the articulated-motion current frame. The creator preview also calls `creatureApi.createPose(...)` directly and does not install Core Motion or articulated motion.

## Plan ledger

**Goal:** make each visible raptor pose cite the selected motion result, rig/profile generation and renderer frame.

- [x] Trace gameplay pose creation and bone application.
- [x] Trace creator preview pose creation and damping.
- [x] Confirm the articulated solver exists but has no render call site.
- [x] Confirm public snapshots can expose motion domains without proving presentation consumption.
- [ ] Add pose selection and renderer receipts.
- [ ] Add browser pixel/bone probes.

## Gameplay frame

```txt
state.speed / state.elapsed / input.steer / jumpHeight / surfaceMultiplier
  -> game.createPlayerPose()
  -> procedural-creature-body-kit createPose()
  -> applyCreaturePose(player, pose)
  -> Three.js renderer.render(scene, camera)
```

Missing from this path:

```txt
Core Motion frame ID
articulated-motion frame ID
rig ID and solve result ID
physics frame ID
selected pose policy
bone-application receipt
visible renderer frame ID
```

## Creator frame

```txt
preview pose state
  -> creatureApi.createPose()
  -> applyCreaturePoseDamped()
  -> renderer.render()
```

The creator imports the pinned Nexus Engine module, but installs only `seed-kit` and `procedural-creature-body-kit`. Repinning the import map does not make Core Motion or articulated motion authoritative for the preview.

## Observable false implication

The game snapshot includes Core Motion and articulated-motion state. A diagnostic consumer may observe:

```txt
Core Motion installed: yes
articulated rig registered: yes
articulated solver available: yes
visible raptor animated: yes
```

and incorrectly infer that the visible pose came from the articulated frame. No renderer receipt currently proves that relationship.

## Required render contract

```txt
PoseSelectionResult
  poseResultId
  sourceKind: articulated | legacy-fallback
  motionSourceRevision
  coreMotionFrameId
  articulatedFrameId | null
  profileRevision
  rigId

RendererBoneApplicationResult
  meshId
  skeletonFingerprint
  poseResultId
  appliedBoneCount
  missingBoneIds
  rejectedBoneIds
  rendererFrameId

MotionPresentationFrameAck
  runId
  tickId
  rendererFrameId
  poseResultId
  coreMotionFrameId
  physicsFrameId
```

## Required proof

```txt
legacy fallback is visible in diagnostics as fallback, not articulated
zero-target articulated solve produces an equivalent accepted pose
foot/ground targets visibly affect the intended legs only
creator and game use the same profile/skeleton fingerprint
stale pose result cannot apply after profile or run replacement
first visible frame cites the exact selected pose result
```

## Validation boundary

No render code changed. No browser, pixel, bone-matrix or deployed Pages probe was executed.