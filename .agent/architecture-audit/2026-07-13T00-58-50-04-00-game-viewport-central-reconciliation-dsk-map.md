# Architecture Audit: Game Viewport Central Reconciliation DSK Map

**Timestamp:** `2026-07-13T00-58-50-04-00`

## Summary

The `00-49-53` technical audit remains authoritative. This reconciliation records the same bounded domain and synchronizes its repo-local and central documentation state.

## Plan ledger

**Goal:** keep viewport ownership separate from gameplay, camera-follow and general graphics ownership while defining the exact coordination boundary.

- [x] Preserve existing Core Camera and Core Graphics ownership.
- [x] Preserve Three.js as the host renderer adapter.
- [x] Preserve gameplay, motion, physics, streaming and articulation ownership.
- [x] Define one product-level viewport authority.
- [ ] Implement the authority and executable fixtures later.

## Domain boundary

```txt
prehistoric-rush-game-viewport-surface-authority-domain
  owns:
    surface identity
    host measurement
    viewport revision
    DPR and pixel-budget policy
    zero-size/stale/duplicate admission
    camera and drawing-buffer candidate agreement
    commit/rollback result
    applied-surface receipt
    first visible viewport-frame acknowledgement

  coordinates:
    Core Camera
    Core Graphics
    Three.js WebGL renderer
    browser host and ResizeObserver
    adaptive quality policy
    public diagnostics

  does not own:
    run simulation
    player movement
    Rapier physics
    patch generation/streaming
    procedural creature articulation
    camera-follow target semantics
```

## Candidate kits

```txt
game-surface-id-kit
viewport-measurement-kit
viewport-revision-kit
device-pixel-ratio-policy-kit
render-pixel-budget-kit
camera-projection-candidate-kit
webgl-drawing-buffer-candidate-kit
viewport-zero-size-deferral-kit
viewport-resize-admission-kit
viewport-surface-commit-result-kit
viewport-surface-rollback-kit
render-quality-surface-policy-kit
viewport-change-listener-lease-kit
viewport-observation-journal-kit
first-viewport-frame-ack-kit
viewport-css-buffer-parity-fixture-kit
dpr-change-fixture-kit
zero-size-restore-fixture-kit
rapid-resize-coalescing-fixture-kit
pages-viewport-smoke-kit
```

## Required transaction

```txt
ViewportChangeCommand
  -> measure actual host
  -> sample DPR and budget policy
  -> prepare camera/buffer candidate
  -> reject or defer invalid evidence
  -> commit one viewport revision
  -> apply during render admission
  -> publish applied receipt
  -> acknowledge first matching visible frame
```

## Reconciliation result

The architecture boundary is documented but not implemented. The detailed kit/service inventory remains in `.agent/trackers/2026-07-13T00-58-50-04-00/project-breakdown.md`.