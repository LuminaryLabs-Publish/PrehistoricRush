# Render Audit — Host Presentation Render Readback

**Timestamp:** `2026-07-09T18-11-58-04-00`

## Current render surface

`runtime-terrain-v6.mjs` creates a full-screen Three.js renderer with streamed terrain chunks, instanced rocks, shards, five tree pools, a procedural raptor, sky sphere, fog, lights, and a DOM status panel.

`src/game.js` then runs a presentation pass that applies a closer camera, readable raptor stride, HUD rewrite, and an additional renderer call.

## Current render loop

```txt
runtime-terrain-v6.mjs loop(now)
  -> mutate runner state
  -> update terrain and props
  -> update physics actor and contact state
  -> update raptor transform and animation
  -> update baseline camera and HUD
  -> renderer.render(scene, camera)
  -> requestAnimationFrame(loop)

src/game.js presentation pass
  -> read PrehistoricRushHost.app
  -> applyReadableStride(app)
  -> applyCloseCamera(app)
  -> renderHud(app)
  -> renderer.render(scene, camera)
```

## Missing readback

```txt
camera-frame-request
hud-frame-request
raptor-stride-frame
render-readback
presentation-frame-record
presentation-journal
PrehistoricRushHost.getState().presentation
```

## Rule for next pass

Do not replace or extract the renderer first. Add additive readback around the existing render consumers so fixture rows can prove what camera, HUD, rig, and renderer consumed.
