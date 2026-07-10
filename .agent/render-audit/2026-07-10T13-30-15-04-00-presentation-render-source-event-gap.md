# Render Audit: Presentation Render Source Event Gap

**Timestamp:** `2026-07-10T13-30-15-04-00`

## Current render path

```txt
runtime-terrain-v6 loop
  -> mutates raptor rig
  -> mutates camera
  -> writes HUD HTML
  -> renderer.render(scene, camera)

src/game.js presentation pass
  -> mutates readable stride
  -> mutates close camera
  -> rewrites HUD HTML
  -> renderer.render(scene, camera) again
```

## Render surface exists

The repo has a visual/render surface through Three.js WebGL, procedural terrain, instanced rocks/shards/trees, raptor rig, camera, HUD, and a secondary presentation render pass.

## Gaps

```txt
no RenderReadback row
no source frame id on renderer.render submissions
no record linking movement result to raptor pose
no record linking movement result to camera request
no record linking movement result to HUD projection
no record linking frame to instanced rock/shard/tree counts
no distinction between baseline runtime render and presentation-pass render
PrehistoricRushHost.getState() only returns renderer label
```

## Next render-proof ledge

Add `render-readback.js` and `presentation-frame-record.js` so fixtures can prove what the renderer consumed without rewriting the renderer.

## Do not do first

```txt
renderer extraction
new postprocessing
new terrain shader
new raptor art
camera retune
visual expansion
```
