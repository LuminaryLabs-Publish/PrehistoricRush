# Architecture Audit: Game Viewport and Render Surface DSK Map

**Timestamp:** `2026-07-13T00-49-53-04-00`

## Summary

Viewport ownership currently sits in the browser host as direct camera and Three.js mutations. The product has Core Camera, Graphics, UI, Diagnostics and Composition capabilities, but no domain coordinates host geometry, DPR, render-pixel budgets, camera projection, drawing-buffer allocation and visible-frame proof.

## Plan ledger

**Goal:** define the smallest fiction-neutral authority that can coordinate viewport changes without moving Three.js implementation into Nexus Engine core.

- [x] Separate browser measurement from renderer implementation.
- [x] Preserve Core Camera and Core Graphics as descriptor/capability owners.
- [x] Keep Three.js allocation and submission in the host adapter.
- [x] Define a product-level coordinating parent domain.
- [x] Define candidate kits, contracts and invariants.
- [ ] Implement after API review.

## Current ownership

```txt
browser host
  owns window resize listener
  reads innerWidth / innerHeight / devicePixelRatio
  mutates PerspectiveCamera
  mutates WebGLRenderer

Core Camera / Graphics / UI / Diagnostics
  installed as capabilities
  do not own active viewport admission

Three.js
  owns camera projection and drawing buffer
  exposes no product commit result
```

## Required parent domain

```txt
prehistoric-rush-game-viewport-surface-authority-domain
```

## DSK composition

```txt
game-viewport-surface-authority-domain
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
```

## Domain boundary

```txt
Core Camera
  owns renderer-neutral camera descriptors and capability

Core Graphics
  owns renderer-neutral frame/quality descriptors

Viewport authority
  owns measurement identity, revision, policy, admission and commit result

Three host adapter
  applies admitted camera and drawing-buffer state
  reports application and visible-frame results
```

## Required contract

```txt
ViewportSurfaceCandidate {
  commandId
  surfaceId
  predecessorRevision
  cssWidth
  cssHeight
  devicePixelRatio
  effectivePixelRatio
  bufferWidth
  bufferHeight
  cameraAspect
  qualityRevision
  fingerprint
}

ViewportSurfaceCommitResult {
  accepted
  revision
  candidate
  rejectionReason
  rollbackResult
}
```

## Invariants

- One viewport revision governs camera and renderer state.
- The measured host, not unrelated globals, defines CSS size.
- DPR and pixel budget are explicit inputs.
- Zero-size, stale and duplicate candidates have zero renderer effects.
- First visible frame identifies the committed surface fingerprint.