# Render Audit: Mixed-Generation First Run Frame Gap

**Timestamp:** `2026-07-12T16-11-48-04-00`

## Summary

A restart resets the camera immediately and renders the new product run on the next RAF, but no render receipt proves that motion, physics, articulation, patch content, colliders, camera and renderer state all belong to the same new run generation.

## Plan ledger

**Goal:** require the first visible frame after restart to cite one committed reset transaction and compatible participant revisions.

- [x] Trace product restart to camera reset and next RAF.
- [x] Trace active-content rebuild and patch update.
- [x] Trace renderer submission and public host readback.
- [x] Identify missing frame identities and parity checks.
- [ ] Implement visible reset-frame acknowledgement.

## Current render ordering

```txt
restart event
  -> game.start()
  -> rebuild active grass/shards/pickups/colliders
  -> update patch focus and activate within budget
  -> reset camera follow

next RAF
  -> engine.tick(dt)
  -> stream update
  -> apply creature pose
  -> update camera and lighting
  -> renderer.render(scene, camera)
  -> update HUD
  -> request next RAF
```

## Missing frame contract

```txt
resetTransactionId
runId and runGeneration
simulationFrameId
motionFrameId
physicsFrameId
articulatedMotionFrameId
articulatedDynamicsFrameId
activeContentRevision
colliderSetRevision
cameraRevision
poseApplicationResultId
rendererFrameId
visibleFrameId
```

## Concrete gap

The camera can visibly jump to the new origin while Core Motion history, the current physics frame, patch-controller work and public diagnostics still retain predecessor-run provenance. The renderer receives state values, not an admitted `RunFramePlan`, and returns no result.

## Required result

```txt
VisibleRunFrameAck
  visibleFrameId
  resetTransactionId
  runId
  runGeneration
  participantRevisions
  contentDigest
  colliderDigest
  cameraRevision
  rendererRevision
  submittedAt
  visibleAt
```

A frame must be rejected from reset-completion proof when any required participant cites a predecessor generation.

## Validation gap

No current test restarts during gameplay, captures the first frame, reads physics/motion/stream state and verifies one shared run generation.