# Deploy Audit: Viewport Central Sync Gate

**Timestamp:** `2026-07-13T00-58-50-04-00`

## Summary

Static build and GitHub Pages publication do not prove host measurement, DPR convergence, zero-size recovery or camera/canvas/drawing-buffer parity. This run synchronizes that proof boundary only.

## Plan ledger

**Goal:** require the same viewport evidence in source, built output and deployed Pages before promotion.

- [x] Preserve the existing build/deploy boundary.
- [x] Record missing executable browser and Pages fixtures.
- [x] Keep runtime/deployment source unchanged.
- [ ] Add and execute the fixture matrix after implementation.

## Required fixture matrix

```txt
source browser
  host-only resize
  DPR-only transition
  DPR cap and pixel budget
  zero size then restore
  rapid resize coalescing
  stale predecessor rejection
  camera/CSS/buffer parity
  public readback and first-frame ack

built output
  same fixture rows

GitHub Pages
  same fixture rows
  deployed commit identity
```

## Promotion gate

Do not mark the viewport authority implemented until all three surfaces agree on viewport revision, CSS size, drawing-buffer size, effective DPR, camera aspect, quality revision and first visible frame fingerprint.

## Validation

No build, browser smoke, Pages smoke or viewport fixture was run in this documentation-only reconciliation.