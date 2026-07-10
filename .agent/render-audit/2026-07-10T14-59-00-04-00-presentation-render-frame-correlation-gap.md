# Render audit: presentation render frame correlation gap

Timestamp: `2026-07-10T14-59-00-04-00`

## Render surfaces

```txt
runtime-terrain-v6.mjs baseline renderer.render(scene, camera)
src/game.js secondary presentation pass renderer.render(scene, camera)
PrehistoricRushHost.getState().renderer = "three-terrain-v6-raptor"
```

## Current render gap

Both render submissions happen without JSON-safe readback rows. The secondary presentation pass can improve readability, but it also creates another render submission without a `sourceFrameId` that ties it back to movement, pose, camera, and HUD state.

## Needed readback rows

```txt
RenderReadback {
  frameId
  sourceFrameId
  renderPass
  scene
  runnerPosition
  cameraPose
  terrainChunkCount
  treeInstanceCounts
  rockInstanceCount
  shardInstanceCount
  rendererLabel
}
```

## Do not do first

```txt
renderer extraction
shader changes
new terrain material pass
camera feel retune
visual expansion
```

## Next gate

A DOM-free fixture should prove that baseline render and secondary presentation render rows retain shared frame identity.