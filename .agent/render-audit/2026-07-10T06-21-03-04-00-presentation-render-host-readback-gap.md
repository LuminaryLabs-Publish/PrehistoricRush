# Render Audit: Presentation Render Host Readback Gap

**Run:** `2026-07-10T06-21-03-04-00`

## Render surfaces

```txt
runtime-terrain-v6.mjs
  -> setup(THREE, host)
  -> creates scene, fog, camera, renderer, terrain, player, rocks, shards, tree pools
  -> frame loop updates terrain/player/camera/HUD
  -> v.renderer.render(v.scene, v.camera)

src/game.js
  -> startPresentationPass()
  -> reads globalThis.PrehistoricRushHost.app
  -> applies readable stride
  -> applies close camera
  -> rewrites HUD DOM
  -> app.view.renderer.render(app.view.scene, app.view.camera)
```

## Current render finding

There are two render submissions and neither produces a stable readback row.

The baseline runtime render and the secondary presentation pass do not share a source frame ID, movement row ID, pose row ID, camera request ID, HUD request ID, or render readback ID.

## Current host render readback

```txt
PrehistoricRushHost.getState().renderer = "three-terrain-v6-raptor"
```

This confirms the renderer label only. It does not expose:

```txt
latest render frame id
primary render submitted
presentation render submitted
camera source row
HUD source row
raptor pose source row
visible instance counts
terrain chunk count with source frame id
render warnings
fixture contract
```

## Render proof target

```txt
RenderReadback {
  frameId,
  scene,
  rendererLabel,
  sourceMovementRowId,
  poseFrameId,
  cameraFrameRequestId,
  hudFrameRequestId,
  terrainChunkCount,
  rockInstanceCount,
  shardInstanceCount,
  treeInstanceCounts,
  primarySubmissionCount,
  presentationSubmissionCount
}
```

## Next safe render cut

Add readback rows only after source movement rows exist. Do not extract the renderer first.
