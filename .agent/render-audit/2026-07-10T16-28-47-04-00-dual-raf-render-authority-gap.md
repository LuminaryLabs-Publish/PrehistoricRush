# Render audit: dual RAF render authority gap

Timestamp: `2026-07-10T16-28-47-04-00`

## Current render path

```txt
primary RAF in runtime-terrain-v6
  -> mutate simulation
  -> animate raptor
  -> update camera
  -> write HUD
  -> renderer.render

secondary RAF in game.js
  -> read mutable host app
  -> apply readable stride
  -> apply close camera
  -> write HUD
  -> renderer.render
```

## Findings

```txt
two animation clocks
two camera writers
two pose writers
two HUD writers
two render submissions
no shared sourceFrameId
no ordering guarantee
no accepted/skipped render result
no renderer frame statistics
no proof which presentation state reached the display
```

The second pass can run before or after the primary pass for a given display refresh. It can therefore render a camera and pose derived from a different simulation state than the one that produced the primary render.

## Required readback

```txt
sourceFrameId
presentationRevision
cameraRevision
poseRevision
hudRevision
renderRequestId
renderCommitAccepted
renderCommitReason
rendererFrame
drawCalls
triangles
```

## Safe migration

Keep the existing visual formulas, but call them from one ordered presentation phase and accept exactly one render commit per source frame.
