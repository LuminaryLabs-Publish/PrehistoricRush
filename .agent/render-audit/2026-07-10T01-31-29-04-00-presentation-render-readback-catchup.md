# Render Audit: Presentation Render Readback Catch-up

**Timestamp:** `2026-07-10T01-31-29-04-00`

## Render surface

`PrehistoricRush` has a visual/render surface through `src/runtime-terrain-v6.mjs` and Three.js.

The route renders terrain chunks, sky, lights, procedural raptor, instanced trees, instanced rocks, instanced shards, camera, HUD, and scene state.

## Current render loop

```txt
runtime-terrain-v6.mjs
  -> setup creates scene, fog, camera, WebGLRenderer, terrain, player, rocks, shards, trees
  -> loop mutates runner and scene state
  -> player position/rotation and animateRaptor apply directly
  -> camera position/lookAt apply directly
  -> HUD innerHTML writes directly
  -> renderer.render(scene, camera)

src/game.js presentation pass
  -> applyReadableStride mutates rig transforms
  -> applyCloseCamera mutates camera
  -> renderHud rewrites HUD DOM
  -> renderer.render(scene, camera) submits a second render
```

## Render domains

```txt
three-cdn-runtime
webgl-renderer
terrain-grid-render
vertex-color-terrain
procedural-raptor-render
instanced-tree-render
instanced-rock-render
instanced-shard-render
camera-render-consumer
hud-dom-render-consumer
secondary-presentation-render
render-readback-next
```

## Render proof gaps

```txt
no shared frame id between movement, raptor pose, camera, HUD, and render
no RenderReadback row for baseline runtime render
no RenderReadback row for secondary presentation render
no PresentationFrameRecord tying runner movement to pose/camera/HUD/render output
no host presentation snapshot exposing recent render rows
no serialized instanced object count summary per frame
```

## Source of risk

The visual result can change without a source-readable row explaining whether movement, pose, camera, HUD, or render submission changed.

The second presentation pass improves readability, but it is also an untracked consumer layer.

## Next render-safe work

```txt
add PresentationFrameRecord
add RenderReadback
add DinoPoseFrame
add CameraFrameRequest
add HudFrameRequest
add PresentationJournalSnapshot
add PrehistoricRushHost.getState().presentation
add DOM-free presentation fixture rows
```

## Do not do next

```txt
renderer extraction
visual expansion
terrain rewrite
camera retune
new raptor mesh
new obstacle set
new pickup economy
```
