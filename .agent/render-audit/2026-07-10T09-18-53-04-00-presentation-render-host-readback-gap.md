# Render Audit: Presentation Render Host Readback Gap

**Timestamp:** `2026-07-10T09-18-53-04-00`

## Render surfaces

```txt
src/runtime-terrain-v6.mjs
  -> creates Three.js renderer
  -> renders terrain, raptor, rocks, shards, trees, sky, lighting
  -> mutates camera per frame
  -> writes HUD DOM per frame
  -> renderer.render(scene, camera)

src/game.js
  -> starts secondary presentation pass
  -> applies readable stride directly
  -> applies close camera directly
  -> rewrites HUD DOM directly
  -> submits another renderer.render(scene, camera)
```

## Render proof currently missing

```txt
no shared source frame id
no RenderReadback row
no PresentationFrameRecord
no render submission count row
no camera request row
no HUD request row
no raptor pose frame row
no serialized instance-count summary per frame
no PrehistoricRushHost.getState().presentation.render block
```

## Why this matters

The visual surface is playable, but two render paths can mutate the same frame without a shared source record. A fixture cannot prove whether runtime pose, presentation pose, camera, HUD, and render submission consumed the same runner frame.

## Next render proof cut

```txt
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
RenderReadback
PresentationFrameRecord
PresentationJournal
HostPresentationSnapshot
```

## Deferred render work

```txt
renderer extraction
new camera feel
new raptor art
new vegetation art
terrain visual rewrite
post-processing
```
