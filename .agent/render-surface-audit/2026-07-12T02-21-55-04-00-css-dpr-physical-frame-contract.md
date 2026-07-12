# Render Surface Audit: CSS, DPR, Physical Buffer and Frame Contract

**Timestamp:** `2026-07-12T02-21-55-04-00`

## Contract

```txt
RenderSurfacePolicy {
  policyVersion
  qualityTier
  minimumCssWidth
  minimumCssHeight
  minimumDeviceScale
  maximumDeviceScale
  maximumPhysicalPixels
  zeroAreaPolicy
}

RenderSurfaceObservation {
  observationId
  surfaceId
  runtimeGeneration
  source
  cssWidth
  cssHeight
  deviceScale
  observedAt
}

SurfaceCommitResult {
  status
  surfaceId
  revision
  policyVersion
  qualityTier
  requestedCssSize
  acceptedCssSize
  requestedPhysicalSize
  actualPhysicalSize
  cameraAspect
  rejectionReason
}

SurfaceFrameAcknowledgement {
  surfaceId
  surfaceRevision
  runId
  frameId
  submittedAt
  presented
}
```

## Policy requirements

```txt
sample CSS size and DPR in the same observation
apply one named policy to creator and gameplay
bound physical pixels before renderer allocation
coalesce repeated observations
reject stale generation and revision data
read back actual drawing-buffer dimensions
commit camera and renderer under one result
publish first-frame acknowledgement after commit
```

## Adapter requirements

### Gameplay

```txt
observe the actual gameplay host
avoid direct global-listener mutation
retain full-window presentation as a policy choice, not an assumption
resample DPR when the environment changes
```

### Creator

```txt
retain container ResizeObserver ownership
route observations through the shared policy
retain local container sizing
publish the same commit/result shape as gameplay
```

## Frame parity

A render-surface revision is incomplete until a frame has been submitted and observed through that revision. A requested size or successful `setSize()` call is not sufficient proof.

## Disposal

The runtime lifecycle owner must revoke observers/listeners and prevent late surface observations from mutating a retired renderer or camera.