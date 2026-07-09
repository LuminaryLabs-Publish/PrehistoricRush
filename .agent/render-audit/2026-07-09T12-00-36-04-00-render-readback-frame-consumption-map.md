# Render Audit: Render Readback Frame Consumption Map

**Timestamp:** `2026-07-09T12-00-36-04-00`

## Visual/render surface present

`PrehistoricRush` has a visual browser surface through `src/runtime-terrain-v6.mjs`.

```txt
Three.js CDN
  -> WebGLRenderer
  -> Scene + fog + sky sphere + ambient/direct light
  -> terrain grid chunk ring
  -> procedural raptor group
  -> instanced rocks
  -> instanced shards
  -> five tree instance pools
  -> baseline camera/HUD/render frame
  -> secondary presentation render from src/game.js
```

## Current render loop

```txt
runtime-terrain-v6 loop
  -> update runner state
  -> update terrain chunks / spawn population
  -> update raptor transform and animation
  -> update baseline camera
  -> update baseline HUD
  -> renderer.render(scene, camera)

src/game.js presentation pass
  -> style HUD
  -> apply readable stride over raptor rig
  -> apply close camera
  -> rewrite HUD
  -> renderer.render(scene, camera)
```

## Render readback gap

The route renders correctly enough for the next source pass, but render evidence is not structured.

Current host readback only exposes:

```txt
renderer: "three-terrain-v6-raptor"
terrain.chunks: app.view.terrain.chunks.length
```

Missing render facts:

```txt
frame id
time delta
scene name
camera target inputs
camera final position
camera look target
HUD projection inputs
raptor pose source
terrain chunk count
renderer pass count
presentation pass consumed legacy app state
legacy host fields unchanged
```

## Recommended next render proof

Do not extract the renderer yet.

Add source-owned readback records around the existing render consumption:

```txt
CameraFrameRequest
HudFrameRequest
DinoPoseFrame
RenderReadback
PresentationFrameRecord
PresentationJournalSnapshot
```

The render proof should answer:

```txt
which live runner state was consumed
which camera request was produced
which HUD request was produced
which dino pose was produced
which render pass consumed the final camera/scene
whether legacy getState fields stayed unchanged
```

## Do not change next

```txt
terrain material
raptor geometry
tree pools
rock/shard instancing
fog/sky color
renderer setup
camera visible behavior
HUD visible behavior
```

## Next validation gate

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

Fixture readback should be DOM-free for source records, with browser validation reserved for a later visual pass.
