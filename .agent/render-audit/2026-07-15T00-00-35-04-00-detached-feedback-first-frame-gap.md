# Render Audit: Detached Feedback First-Frame Gap

**Timestamp:** `2026-07-15T00-00-35-04-00`  
**Status:** `game-feedback-control-surface-admission-authority-audited`

## Summary

Three.js continues rendering, but the DOM feedback surface is removed from the document. The frame loop updates detached nodes and publishes no evidence that run state, terminal state, feedback, and controls reached one visible frame.

## Plan ledger

**Goal:** bind WebGL, semantic status, action controls, and terminal feedback to one admitted presentation revision.

- [x] Trace WebGL host creation.
- [x] Trace status/action node creation.
- [x] Trace broad `aside` removal.
- [x] Trace per-frame feedback updates.
- [x] Define visible and semantic frame evidence.
- [ ] Add browser fixtures later.

## Current frame

```txt
engine tick
  -> committed run state
  -> patch streaming update
  -> Three.js render
  -> detached status.innerHTML update
  -> detached action text update
  -> request next frame
```

## Missing evidence

```txt
feedback node connectedness
accepted feedback strategy
run/feedback revision correlation
terminal state/action visibility
semantic status update acknowledgement
pointer/touch action availability
WebGL plus feedback frame receipt
FirstFeedbackSurfaceFrameAck
```

## Required frame receipt

```txt
FirstFeedbackSurfaceFrameAck
  feedbackGeneration
  runId
  tickRevision
  simulationRevision
  renderRevision
  feedbackRevision
  visibleSurfaceIds
  semanticSurfaceId
  actionSurfaceIds
  viewportRevision
  capturedAt
```
