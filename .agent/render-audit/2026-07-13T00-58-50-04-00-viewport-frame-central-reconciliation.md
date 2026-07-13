# Render Audit: Viewport Frame Central Reconciliation

**Timestamp:** `2026-07-13T00-58-50-04-00`

## Summary

The renderer still cannot prove which host size, DPR, camera aspect or drawing-buffer allocation produced the visible frame. This file reconciles the existing technical finding with central tracking.

## Plan ledger

**Goal:** keep camera projection, CSS canvas size, drawing-buffer size and the visible frame bound to one viewport revision.

- [x] Re-read camera and renderer construction in `src/game.js`.
- [x] Re-read the resize handler and public readback.
- [x] Preserve the existing render findings.
- [ ] Add typed render-surface application and frame proof later.

## Current render path

```txt
startup
  -> camera aspect from innerWidth / innerHeight
  -> renderer CSS size from innerWidth / innerHeight
  -> renderer DPR sampled once

resize
  -> camera aspect/projection mutated
  -> renderer size mutated
  -> DPR not refreshed
  -> no candidate, revision, rollback or applied receipt

frame
  -> renderer.render(scene, camera)
  -> public readback reports only a renderer label
```

## Missing proof

```txt
actual host CSS box
raw and effective DPR
committed CSS size
drawing-buffer width and height
camera aspect and projection revision
pixel-budget decision
applied-surface receipt
first visible viewport-frame acknowledgement
```

## Required frame envelope

```txt
ViewportFrameEnvelope
  surfaceId
  viewportRevision
  measurementSequence
  cssWidth/cssHeight
  rawDpr/effectiveDpr
  bufferWidth/bufferHeight
  cameraAspect
  qualityRevision
  renderFrameId
  viewportFingerprint
```

## Non-claim

No render-source change, resize correction, DPR convergence or visible-frame proof was implemented in this run.