# Architecture Audit: PrehistoricRush Render Surface Authority

**Timestamp:** `2026-07-12T02-21-55-04-00`

## Summary

Gameplay and creator currently own separate resize policies. The missing architectural boundary is a composed domain that admits observations, applies one policy, commits renderer and camera state, and correlates the next visible frame.

## Current ownership

```txt
gameplay host
  -> innerWidth / innerHeight
  -> startup DPR sample
  -> Three renderer size
  -> PerspectiveCamera aspect
  -> window resize listener

creator host
  -> preview.clientWidth / clientHeight
  -> startup DPR sample
  -> ResizeObserver
  -> Three renderer size
  -> PerspectiveCamera aspect
```

## Required parent domain

```txt
prehistoric-rush-render-surface-authority-domain
```

## DSK breakdown

```txt
render-surface-policy-kit
  owns quality tier, DPR floor/cap and pixel budget

render-surface-id-kit
  owns stable creator/game surface identity

render-surface-revision-kit
  owns monotonic accepted revision

css-size-observation-kit
  records CSS width, height, source and time

device-scale-observation-kit
  records the DPR sample used by the same command

resize-source-observation-kit
  distinguishes startup, container, window and device-scale ingress

surface-resize-command-kit
  carries runtime generation, surface ID and observed values

surface-resize-admission-kit
  rejects stale, duplicate or invalid commands

surface-resize-plan-kit
  computes requested CSS size, physical size, aspect and policy result

surface-resize-coalescing-kit
  prevents repeated ingress from producing duplicate commits

renderer-buffer-commit-kit
  commits and reads back renderer CSS and drawing-buffer dimensions

camera-projection-commit-kit
  commits aspect/projection and returns accepted values

creator-preview-surface-adapter-kit
  maps preview-container observations into the authority

gameplay-surface-adapter-kit
  maps gameplay-host observations into the authority

surface-commit-result-kit
  returns one atomic detached result

surface-frame-acknowledgement-kit
  binds the next submitted frame to the accepted revision

surface-debug-projection-kit
  exposes detached committed surface state

surface-journal-kit
  retains bounded commands, rejections, commits and frame acknowledgements
```

## Required result

```txt
SurfaceCommitResult {
  surfaceId
  revision
  source
  cssWidth
  cssHeight
  deviceScale
  qualityTier
  requestedPhysicalWidth
  requestedPhysicalHeight
  actualPhysicalWidth
  actualPhysicalHeight
  cameraAspect
  status
  rejectionReason
}
```

## Dependency placement

```txt
runtime module graph admission
  -> render-surface authority
  -> creator/game renderer construction
  -> committed gameplay frame
  -> public host observation
  -> lifecycle disposal
```

## Constraint

Do not create a second renderer, camera or RAF. Adapt the existing creator and gameplay owners through one policy and result contract.