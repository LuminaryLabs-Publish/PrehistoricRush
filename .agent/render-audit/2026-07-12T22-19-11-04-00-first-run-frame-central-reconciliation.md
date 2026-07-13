# Render Audit: First Run-Generation Frame Central Reconciliation

**Timestamp:** `2026-07-12T22-19-11-04-00`

## Summary

The Three adapter resets camera state when `state.runId` changes, but the rendered frame is not correlated with one accepted start command or a complete reset/preserve manifest. The HUD and public host independently expose game, simulation, physics, patch, camera, composition, and renderer readback without a `RunStartResult`, participant-generation map, draw result, or first-visible successor-frame receipt.

## Plan ledger

**Goal:** require the first visible frame after Start, Retry, or Run Again to prove which run and participant generations it presents.

- [x] Trace runId use in camera reset.
- [x] Trace retained content and renderer ownership.
- [x] Trace HUD and public readback projection.
- [x] Identify missing frame correlation and acknowledgement.
- [ ] Implement and test later.

## Current render path

```txt
start wrapper
  -> domain increments runId
  -> refresh dynamic content from retained active patches
  -> update retained streaming controller
  -> reset retained camera follower

next RAF
  -> host-local input is submitted
  -> engine tick commits simulation
  -> streaming activates/releases retained content
  -> player pose and camera are applied
  -> Three renderer draws
  -> HUD string is replaced
  -> public host can read independent participant snapshots
```

## Missing evidence

```txt
accepted RunStartResult ID
successor run generation manifest
physics reset/preserve generation
patch/Worker generation
active-content generation
camera reset receipt
render-plan/draw generation
HUD projection generation
first visible successor-frame acknowledgement
```

## Required frame contract

```txt
CommittedRunStartEnvelope
  runStartResultId
  runtimeSessionId
  runGeneration
  participantReceiptIds
  sceneRevision
  simulationRevision
  physicsRevision
  patchGeneration
  workerGeneration
  activeContentRevision
  cameraRevision
  renderRevision

FrameObservation
  frameId
  runStartResultId
  runGeneration
  participantGenerationFingerprint
  drawResult
  hudProjectionResult
  browserPresentationResult

FirstRunGenerationFrameAck
  accepted only when frame and participant fingerprints match the committed start result
```

## Validation boundary

No Three.js, camera, HUD, snapshot, or deployment behavior changed. No browser or Pages frame fixture was run.