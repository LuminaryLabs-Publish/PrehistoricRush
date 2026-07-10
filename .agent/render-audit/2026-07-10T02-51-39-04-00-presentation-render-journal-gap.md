# Render Audit: Presentation Render Journal Gap

**Timestamp:** `2026-07-10T02-51-39-04-00`

## Render surface

`PrehistoricRush` has a visual/render surface.

`runtime-terrain-v6.mjs` owns the main Three.js renderer, terrain chunks, sky, fog, lights, raptor rig, rocks, shards, trees, camera, and frame submission.

`src/game.js` also starts a presentation pass that can submit a second render after mutating camera, HUD, and readable stride.

## Current render loop

```txt
runtime-terrain-v6 setup
  -> create scene
  -> create fog
  -> create camera
  -> create WebGLRenderer
  -> create sky
  -> create lights
  -> create terrain chunks
  -> create player raptor
  -> create instanced rocks / shards / tree pools

frame loop
  -> mutate runner state
  -> update terrain / populate instances
  -> set raptor position and rotation
  -> animate raptor
  -> update camera
  -> update HUD
  -> renderer.render(scene, camera)

presentation pass
  -> apply readable stride
  -> apply close camera
  -> rewrite HUD DOM
  -> renderer.render(scene, camera)
```

## Current readback

`PrehistoricRushHost.getState()` exposes:

```txt
scene
runner
physics
terrain.chunks
renderer: three-terrain-v6-raptor
```

It does not expose:

```txt
latest render frame id
main render submission row
presentation render submission row
camera frame request
HUD frame request
raptor pose frame
instanced tree/rock/shard counts
renderer info counters
presentation journal rows
```

## Render proof gap

Render work should not be extracted next.

The next render-related work is readback:

```txt
RenderReadback
PresentationFrameRecord
PresentationJournalSnapshot
HostPresentationSnapshot
```

## Required future rows

```txt
main_render_submitted
presentation_render_submitted
camera_frame_requested
hud_frame_requested
raptor_pose_frame_applied
instanced_counts_snapshot
host_render_readback_emitted
fixture_render_row_validated
```

## Guardrail

Do not retune camera, terrain, fog, lighting, raptor art, trees, or renderer structure before the render and presentation journal can explain each submitted frame.
