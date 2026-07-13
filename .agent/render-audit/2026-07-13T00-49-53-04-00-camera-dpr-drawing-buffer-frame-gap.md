# Render Audit: Camera, DPR and Drawing-Buffer Frame Gap

**Timestamp:** `2026-07-13T00-49-53-04-00`

## Summary

The active game renderer constructs its camera and drawing buffer from browser globals. DPR is applied once at startup, later resize events update size but not DPR, and no rendered-frame receipt identifies the surface dimensions actually shown.

## Plan ledger

**Goal:** make every visible frame cite one compatible camera projection and WebGL drawing-buffer revision.

- [x] Trace renderer construction.
- [x] Trace camera aspect and projection updates.
- [x] Trace startup DPR selection.
- [x] Trace resize handling and public readback.
- [x] Record missing admission and frame proof.
- [ ] Implement and fixture later.

## Current path

```txt
new PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 900)
new WebGLRenderer(...)
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(min(devicePixelRatio, 2))

window resize
  -> camera.aspect = innerWidth / innerHeight
  -> camera.updateProjectionMatrix()
  -> renderer.setSize(innerWidth, innerHeight)
```

## Gaps

```txt
actual host CSS-box measurement: absent
ResizeObserver ownership: absent
DPR refresh after startup: absent
CSS size / buffer size parity result: absent
positive finite-size admission: absent
zero-size deferral: absent
maximum pixel budget: absent
camera + renderer atomic commit: absent
rollback result: absent
viewport revision in public readback: absent
first visible resized-frame acknowledgement: absent
```

## Visible consequence

A browser zoom, DPR change, monitor transition or embedded-host size change can leave camera, CSS canvas size and drawing-buffer scale without one authoritative revision. Rendering may continue, but diagnostics cannot prove which dimensions or DPR produced the visible frame.

## Required proof

- Resize the host without resizing the window.
- Change DPR while preserving CSS size.
- Enter and leave a zero-size state.
- Deliver rapid stale resize observations out of order.
- Verify camera aspect, canvas CSS size, drawing-buffer size and public readback share one revision.
- Verify the first rendered frame after commit reports the same fingerprint.