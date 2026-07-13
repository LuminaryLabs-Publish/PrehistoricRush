# Render Audit: First Run-Generation Frame Gap

**Timestamp:** `2026-07-12T21-51-38-04-00`

## Summary

After start, camera and active content are updated outside a shared commit, then the next RAF renders from whichever participant states are visible. No frame proves that player state, physics, streaming, camera, meshes, HUD, and scene transition all belong to one run generation.

## Plan ledger

**Goal:** make the first frame after Start, Retry, or Run Again cite one accepted start result and complete participant generation set.

- [x] Trace host start into camera/content update and next RAF.
- [x] Identify render and HUD participant gaps.
- [x] Define first-frame evidence and fixtures.
- [ ] Implement later.

## Current flow

```txt
game.start
  -> new RunState/runId
  -> refresh content from retained active patches
  -> update controller and possibly activate patches
  -> reset camera follower
  -> wait for next RAF
  -> local input, engine tick, streaming, pose, camera, render, HUD
```

## Missing evidence

```txt
RunStartResult ID
participant reset/preserve receipts
physics body/collider generation
patch/controller/Worker generation
active-content generation
camera reset generation
render-frame sequence
HUD projection revision
scene-transition revision
first visible run-generation acknowledgement
```

## Required frame flow

```txt
committed RunStartResult
  -> install all participant generations
  -> admit one successor RAF frame
  -> tick/render only from matching run generation
  -> project player, patches, camera, HUD, and scene
  -> publish FirstRunGenerationFrameAck
```

## Required invariants

```txt
no frame presents mixed predecessor/successor participants
player pose and physics body cite the same run generation
patches, pickups, colliders, and batches cite one streaming/content generation
camera reset and render frame cite the accepted start result
HUD status and run state cite the same revision
stale Worker/callback results cannot enter the acknowledged frame
```

## Missing fixtures

- [ ] First frame after initial start.
- [ ] First frame after collision Retry.
- [ ] First frame after win Run Again.
- [ ] Stale Worker delivery before first frame.
- [ ] Held input across first frame.
- [ ] Participant preparation failure.
- [ ] Source/build/Pages parity.

## Validation boundary

Documentation only. No camera, rendering, HUD, physics, streaming, or runtime behavior changed.