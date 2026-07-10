# Render Audit: Presentation Render Event Readback Gap

**Timestamp:** `2026-07-10T04-50-40-04-00`

## Current render surface

`src/runtime-terrain-v6.mjs` owns the main Three.js scene, camera, renderer, terrain chunks, raptor rig, instanced rocks, instanced shards, and tree pools.

`src/game.js` then starts a presentation pass that applies readable stride, close camera, HUD DOM updates, and a second renderer submission.

## Render loop today

```txt
runtime-terrain-v6 frame
  -> update runner state
  -> update terrain/population as needed
  -> update raptor position and animation
  -> update camera position/lookAt
  -> update HUD innerHTML
  -> renderer.render(scene, camera)
  -> requestAnimationFrame(loop)

src/game.js presentation pass
  -> read globalThis.PrehistoricRushHost.app
  -> applyReadableStride(app)
  -> applyCloseCamera(app, THREE, dt)
  -> renderHud(app)
  -> renderer.render(scene, camera)
  -> requestAnimationFrame(pass)
```

## Render readback gaps

```txt
no shared frame id across main frame and presentation pass
no serialized render-readback row
no renderer submission count per frame
no camera-frame request row
no HUD-frame request row
no dino-pose-frame row
no instanced count summary tied to source frame
no proof that presentation pass preserved source movement state
PrehistoricRushHost.getState().renderer is only a label
```

## Next render proof rows

```txt
RenderReadback {
  frameId,
  sourceFrameId,
  rendererLabel,
  submittedBy,
  cameraPosition,
  cameraLookAt,
  visibleTerrainChunks,
  rockInstanceCount,
  shardInstanceCount,
  treeInstanceCounts,
  hudScene,
  hudDistance,
  dinoPoseVersion
}
```

## Do not start here

Do not rewrite the renderer, replace Three.js, retune camera feel, add visual fidelity, or expand terrain art before the render readback rows exist.
