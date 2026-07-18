# Loading Failure Surface / Recovery Gap

**Timestamp:** `2026-07-18T02-39-16-04-00`

## Implemented presentation

```txt
module preflight failure
  -> replace document.body text
  -> include module label, URL and raw error detail

required tree preparation
  -> fixed full-screen progress surface
  -> progress fill and status label
  -> no explicit failed-state rendering in src/game.js
```

## Finding

A failed module import produces terminal text, while an image-hydration failure reports Core Startup failure and then escapes through top-level await. The loading surface has no admitted failed, retrying, returning or recovered state. There is no frame digest proving that the visible failure belongs to the failed startup generation, and no `FirstRecoveredGameFrameAck` after retry.

The module error text also includes the resolved URL and raw exception detail. That is useful diagnostically, but the product has no explicit public-safe error projection policy.

## Proposed render contract

```txt
StartupProjectionState
  phase: preflight | assets | images | failed | retrying | ready
  generationId
  progress
  publicCode
  publicMessage
  retryAllowed
  retryAttempt
  navigationFallback

StartupFrameDigest
  generationId
  phase
  failureCode
  retryAttempt
  presentedFrame
```

## Required proof

- Force one module rejection and confirm a stable accessible failure surface.
- Force atlas fetch, decode, dimension and Canvas2D readback failures.
- Confirm retry controls are reachable by keyboard and pointer.
- Confirm stale progress from the failed generation cannot overwrite retry state.
- Confirm the first gameplay frame acknowledges the recovered generation.
- Repeat from built artifact and GitHub Pages origins.

## Boundary

No visual defect or current outage was reproduced. The audit documents missing presentation ownership and proof.