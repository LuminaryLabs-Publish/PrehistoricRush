# Terminal Result Visible-Frame Gap

## Summary

The renderer keeps drawing after run-over or win, while the HUD changes generic status and button text. No render submission cites a terminal result artifact or acknowledges the first frame that visibly represents the accepted outcome.

## Plan ledger

**Goal:** bind terminal simulation truth, result UI and the first visible frame to the same RunOutcomeArtifact.

- [x] Inspect renderer submission and HUD projection.
- [x] Confirm runId drives camera reset, not terminal result identity.
- [x] Confirm no frame ID or result fingerprint is published.
- [ ] Add terminal presentation proof later.

## Current path

```txt
committed simulation transition
  -> cleanup disables control and requests scene transition
  -> RAF reads mutable game state
  -> adapter renders player/world
  -> HUD prints state.status, distance, shards and speed
  -> button becomes Retry or Run Again
```

## Gaps

```txt
no terminal presentation descriptor
no result ID on HUD or renderer submission
no score presentation policy
no terminal overlay or summary
no simulation-step to render-frame receipt
no blank/stale predecessor-frame rejection
no FirstVisibleTerminalFrameAck
no source/build/Pages frame-parity proof
```

## Required receipt

```txt
TerminalPresentationReceipt
  RunOutcomeId
  RunId
  TerminalStepId
  SceneRevision
  HudRevision
  RendererFrameId
  ResultFingerprint
  submittedAt
  visibleAt
```

## Non-claim

The existing renderer can display terminal state, but this audit does not claim that the visible frame is correlated with the exact accepted terminal simulation result.