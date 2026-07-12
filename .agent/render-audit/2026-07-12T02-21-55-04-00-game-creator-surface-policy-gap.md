# Render Audit: Game and Creator Surface Policy Gap

**Timestamp:** `2026-07-12T02-21-55-04-00`

## Current gameplay path

```txt
new PerspectiveCamera(62, innerWidth / innerHeight, ...)
new WebGLRenderer(...)
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(min(devicePixelRatio, 2))

window resize
  -> camera.aspect = innerWidth / innerHeight
  -> camera.updateProjectionMatrix()
  -> renderer.setSize(innerWidth, innerHeight)
```

The resize handler does not re-sample DPR, read host bounds, apply a physical-pixel budget, return a commit result or identify the first frame rendered through the new values.

## Current creator path

```txt
new WebGLRenderer(...)
renderer.setPixelRatio(min(devicePixelRatio, 2))
ResizeObserver(preview)
  -> width = max(1, preview.clientWidth)
  -> height = max(1, preview.clientHeight)
  -> renderer.setSize(width, height, false)
  -> camera.aspect = width / height
```

The creator tracks its local container but still samples DPR only during construction and produces no surface receipt.

## Gap

```txt
shared policy: absent
surface identity: absent
surface revision: absent
quality tier: absent
physical-pixel budget: absent
DPR-change handling: absent
actual drawing-buffer receipt: absent
camera commit receipt: absent
creator/game parity result: absent
first post-resize frame receipt: absent
```

## Consequence boundary

A browser zoom or display-scale change can alter device scale without a corresponding renderer pixel-ratio commit. Gameplay and creator can also apply different size observations to the same persisted creature. The current code may still render correctly in ordinary fixed-window use, but there is no evidence proving parity, bounded physical resolution or frame correlation.

## Required proof

```txt
creator container resize fixture
game host resize fixture
DPR change fixture
cross-display or browser-zoom fixture
physical drawing-buffer readback
camera aspect readback
creator/game policy parity fixture
first frame after surface revision receipt
```