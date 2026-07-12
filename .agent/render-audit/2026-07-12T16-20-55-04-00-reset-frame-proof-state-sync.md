# Render Audit: Reset Frame Proof State Sync

**Timestamp:** `2026-07-12T16-20-55-04-00`

## Summary

The renderer can display a new product run after camera and content refresh, but no visible-frame result proves that motion, physics, articulation, streaming, content and renderer state all belong to the same committed run generation.

## Plan ledger

**Goal:** require the first visible frame after restart to acknowledge one committed reset result and compatible participant revisions.

- [x] Trace restart through content refresh, camera reset and RAF rendering.
- [x] Identify independently advancing render inputs.
- [x] Preserve the existing mixed-generation render finding.
- [x] Synchronize that finding with central tracking.
- [ ] Add first-visible-run-frame acknowledgement and browser proof.

## Current render path

```txt
game.start()
  -> product run N+1 commits
  -> active content refreshes from current patch state
  -> camera resets
  -> no renderer reset result
  -> next RAF samples motion, physics, content and pose independently
  -> Three.js renders
  -> HUD/public host update
```

## Missing render contract

```txt
resetTransactionId
runGeneration
motionFrameRevision
physicsFrameRevision
articulationRevision
activeContentRevision
cameraRevision
rendererFrameId
RunRestartResult fingerprint
firstVisibleRunFrameAck
```

A visually plausible origin frame is not proof of coordinated reset. The frame must be rejected or marked transitional until all required inputs cite compatible committed revisions.