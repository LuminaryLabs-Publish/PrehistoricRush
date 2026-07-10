# Render Audit: Presentation Render Source Ledger Gap

**Timestamp:** `2026-07-10T12-10-27-04-00`

## Visual surface

`PrehistoricRush` has a browser-rendered Three.js surface.

```txt
runtime-terrain-v6
  -> WebGLRenderer
  -> terrain chunks
  -> raptor rig
  -> instanced rocks
  -> instanced shards
  -> tree pools
  -> HUD DOM
  -> baseline render submission

src/game.js presentation pass
  -> readable raptor stride mutation
  -> close camera mutation
  -> HUD DOM rewrite
  -> secondary render submission
```

## Current render proof gap

```txt
no render-readback row for baseline renderer
no render-readback row for presentation renderer
no source frame id linking movement -> pose -> camera -> HUD -> render
no serialized instanced count summary per frame
no proof that the second render consumed the same runner frame as the HUD and pose
no fixture-safe presentation snapshot in PrehistoricRushHost.getState()
```

## Render-safe next row shape

```txt
RenderReadbackRow {
  frameId
  sourceFrameId
  rendererLabel
  submittedBy
  sceneName
  terrainChunkCount
  rockInstanceCount
  shardInstanceCount
  treeInstanceCounts
  cameraRequestId
  hudFrameId
  poseFrameId
  accepted
  reason
}
```

## Recommendation

Do not extract or replace the renderer next. Add render-consumption rows and host readback first, then fixture-prove that baseline and presentation submissions are tied to stable source frames.
