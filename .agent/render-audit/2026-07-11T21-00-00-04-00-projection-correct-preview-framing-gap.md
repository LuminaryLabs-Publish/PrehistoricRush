# Render Audit: Projection-Correct Preview Framing Gap

**Timestamp:** `2026-07-11T21-00-00-04-00`

## Summary

The creator camera now follows geometry changes, but the fit is heuristic. It uses a local bind-pose box and one scalar distance multiplier, so it cannot prove that the animated creature remains centered and unclipped across aspect ratios and topology transitions.

## Plan ledger

**Goal:** define a viewport-fit contract that produces measurable screen-space margins and a frame receipt.

- [x] Trace current bounds and camera calculations.
- [x] Identify missing transforms and projection terms.
- [x] Define target bounds and fit algorithm.
- [x] Define frame evidence.
- [ ] Implement and measure the fit.

## Current calculation

```txt
mesh.geometry.computeBoundingBox()
local center and size
  -> multiply by mesh scale
  -> desiredTarget
  -> span = max(sizeX, sizeY * 1.35, sizeZ)
  -> distance = clamp(span * 1.9, 4.4, 11)
  -> damp target and distance
  -> camera.lookAt(target)
```

## Missing render inputs

```txt
viewport width and height in fit formula
horizontal FOV derived from vertical FOV and aspect
current skeleton and posed vertex extents
mesh world rotation and parent transforms
crossfade previous/next union bounds
near-plane and far-plane safety
screen-space padding target
cameraFitRevision
previewFrameId
```

## Failure classes

```txt
portrait viewport
  -> horizontal FOV narrows
  -> long body or tail can clip despite vertical fit

animated pose
  -> tail or limbs move outside bind-pose bounds
  -> camera does not react to visible extent

topology crossfade
  -> getMesh exposes previous mesh until completion
  -> new larger mesh can exceed the framed bounds

rotated asymmetric body
  -> local center is not transformed by complete world matrix
  -> visual center can drift from camera target
```

## Target fit contract

```txt
FitPreviewCameraInput {
  viewportRevision
  viewportWidth
  viewportHeight
  verticalFov
  near
  far
  cameraDirection
  boundsRevision
  worldBounds
  marginX
  marginY
}

FitPreviewCameraResult {
  accepted
  cameraFitRevision
  target
  distance
  horizontalFov
  verticalFov
  expectedMargins
  nearFarSafe
}
```

## Target algorithm

```txt
update skeleton/world matrices
  -> obtain conservative posed world bounds
  -> union both meshes during crossfade
  -> transform bound corners into camera fit basis
  -> calculate required vertical distance
  -> calculate required horizontal distance from aspect-adjusted FOV
  -> choose the larger requirement
  -> add declared margins
  -> verify near/far safety
  -> damp toward admitted target and distance
  -> render
  -> measure/acknowledge visible margins
```

## Evidence

A committed preview frame should carry:

```txt
profileFingerprint
descriptorFingerprint
meshRevision
poseRevision
boundsRevision
viewportRevision
cameraFitRevision
previewFrameId
measuredScreenBounds
marginResult
transitionMode
```

## Required fixtures

```txt
portrait 390 x 844
square 720 x 720
wide 1440 x 720
minimum and maximum body/tail/leg values
running pose extrema
topology crossfade union bounds
resize during active morph
DPR 1 and DPR 2
```

## Acceptance conditions

The creature remains inside declared horizontal and vertical margins for every fixture, and `Ready` is published only from a frame acknowledging the current bounds and viewport revisions.