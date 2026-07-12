# Deploy Audit: Render Surface Fixture Gate

**Timestamp:** `2026-07-12T02-21-55-04-00`

## Required local gates

```txt
surface policy canonicalization
creator container resize
full-window gameplay resize
DPR increase and decrease
physical-pixel budget clamp
zero-area observation policy
stale observation rejection
duplicate resize coalescing
renderer drawing-buffer readback
camera aspect/projection readback
creator/game policy parity
first frame after surface revision
retired-runtime late resize rejection
```

## Required browser matrix

```txt
Chromium desktop at DPR 1
Chromium desktop at DPR 2
browser zoom change
window moved between displays with different scale
narrow and tall viewport
wide viewport
creator preview CSS resize without window resize
gameplay window resize during active run
```

## Required Pages proof

```txt
load menu, creator and gameplay routes
capture committed surface result on creator
capture committed surface result on gameplay
verify actual physical dimensions are within policy
verify next visible frame cites the accepted revision
verify public diagnostics are detached
```

## Current status

```txt
fixtures implemented: no
browser matrix executed: no
Pages smoke executed: no
surface correctness claim: no
```

Static source inspection is not a substitute for physical-buffer and visible-frame proof.