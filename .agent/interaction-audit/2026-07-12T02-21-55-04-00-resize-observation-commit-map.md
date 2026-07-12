# Interaction Audit: Resize Observation and Surface Commit Map

**Timestamp:** `2026-07-12T02-21-55-04-00`

## Current ingress

```txt
game startup
  -> innerWidth / innerHeight / devicePixelRatio

window resize event
  -> innerWidth / innerHeight
  -> direct camera and renderer mutation

creator startup
  -> devicePixelRatio

creator ResizeObserver
  -> preview.clientWidth / preview.clientHeight
  -> direct camera and renderer mutation
```

## Missing command envelope

```txt
surfaceId
runtimeGeneration
observationId
observationSource
observedCssWidth
observedCssHeight
observedDeviceScale
priorSurfaceRevision
qualityTier
requestedAt
```

## Required admission map

```txt
browser/container observation
  -> create SurfaceResizeCommand
  -> validate generation and surface identity
  -> reject invalid, stale or duplicate observation
  -> apply quality and pixel-budget policy
  -> commit renderer and camera adapters
  -> read back accepted values
  -> publish SurfaceCommitResult
  -> acknowledge first frame using the revision
```

## Rejection reasons

```txt
runtime-retired
unknown-surface
stale-generation
stale-observation
duplicate-observation
invalid-css-size
unsupported-device-scale
pixel-budget-exceeded
renderer-commit-failed
camera-commit-failed
```

## Public interaction rule

Surface changes must not be exposed as mutable renderer or camera ownership through `PrehistoricRushHost`. Public diagnostics should receive detached observations only.