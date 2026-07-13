# Deploy Audit: Viewport Fixture Gate

**Timestamp:** `2026-07-13T00-49-53-04-00`

## Summary

The current Node test command validates resolution policy and articulation adapters only. It cannot prove browser host measurement, DPR transitions, drawing-buffer allocation, resize ordering or first-visible-frame parity in source, built output or GitHub Pages.

## Plan ledger

**Goal:** prevent viewport behavior from being declared complete without executable browser and deployed-surface proof.

- [x] Inspect current package test coverage.
- [x] Identify source/browser/Pages gaps.
- [x] Define required viewport fixtures and evidence.
- [ ] Add fixtures after runtime implementation.
- [ ] Run source, build and Pages gates after fixtures exist.

## Required fixtures

```txt
host CSS-box measurement
window and host-only resize
DPR-only change
DPR cap and pixel-budget downgrade
zero-size deferral and restore
rapid resize coalescing
stale revision rejection
camera/canvas/buffer parity
public readback parity
first visible viewport frame
source/build/Pages parity
```

## Required evidence

```txt
viewport command and revision
measurement source and sequence
CSS dimensions
raw and effective DPR
drawing-buffer dimensions
camera aspect
quality revision
application result
visible-frame acknowledgement
```

## Current result

```txt
npm test: not run during this documentation audit
browser viewport smoke: unavailable / not run
built-output viewport smoke: unavailable / not run
GitHub Pages viewport smoke: unavailable / not run
runtime source changed: no
deployment changed: no
```

Do not mark the viewport authority implemented until the deployed game exposes one committed surface revision and the first visible frame proves matching camera, CSS and drawing-buffer state.