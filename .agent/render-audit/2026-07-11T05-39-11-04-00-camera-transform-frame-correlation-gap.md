# Render Audit: Camera Transform / Frame Correlation Gap

**Timestamp:** `2026-07-11T05-39-11-04-00`

## Summary

The Three camera receives the smoothed controller output before every render, but the adapter does not return or retain a consumption result. A camera snapshot therefore proves controller state, not that a particular frame rendered that transform.

## Plan ledger

**Goal:** Define exact proof between target generation, controller output, Three camera mutation and rendered frame.

- [x] Trace target generation.
- [x] Trace reset/update.
- [x] Trace transform application.
- [x] Trace renderer call.
- [x] Identify missing frame evidence.
- [ ] Add typed application and frame rows.

## Current render path

```txt
setCameraTargets(state)
  -> cameraFollow.reset/update(...)
  -> applyCameraTransform(transform)
     -> camera.position.fromArray(...)
     -> camera.quaternion.fromArray(...)
  -> renderer.render(scene, camera)
```

## Verified improvements

```txt
- no immediate render-loop camera.lookAt()
- position and look point both retain velocity state
- rotation is damped from smoothed position/look point
- dt is bounded
- run changes reset instead of interpolating across runs
```

## Missing application proof

`applyCameraTransform()` currently returns nothing. Required result:

```txt
CameraTransformApplicationResult
  status
  runId
  sessionEpoch
  targetSequence
  controllerRevision
  cameraObjectId
  projectionRevision
  appliedPosition
  appliedQuaternion
  transformFingerprint
  reason
```

## Missing frame proof

Required render row:

```txt
CameraFrameConsumptionRow
  frameId
  runId
  simulationSequence
  patchConsumerRevision
  heightSourceRevision
  targetSequence
  controllerRevision
  applicationRevision
  rendererLabel
  timestamp/deltaTime
```

## Failure classifications

```txt
invalid-target
non-finite-transform
non-normalized-quaternion
stale-run
stale-session
camera-disposed
projection-stale
duplicate-application
render-not-acknowledged
```

## Observation requirement

`PrehistoricRushHost.getState()` should expose a bounded detached camera section:

```txt
latestTarget
latestControllerStep
latestApplication
latestFrame
recentRows
parity
```

It should not expose mutable `cameraFollow` or `adapter` references.

## Render fixture gate

Prove one and only one application revision is associated with each rendered frame, including the first frame after initial start, restart, run change, resize and teleport reset.
