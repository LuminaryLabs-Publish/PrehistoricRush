# Render Audit — Presentation Render Readback Gap

**Timestamp:** `2026-07-09T23-58-41-04-00`

## Current render path

```txt
runtime-terrain-v6 baseline loop
  -> animateRaptor
  -> camera lerp / lookAt
  -> HUD innerHTML
  -> renderer.render(scene, camera)

src/game.js presentation pass
  -> applyReadableStride
  -> applyCloseCamera
  -> renderHud
  -> renderer.render(scene, camera) again
```

## Render readback currently exposed

```txt
PrehistoricRushHost.getState().renderer = "three-terrain-v6-raptor"
PrehistoricRushHost.getState().terrain.chunks = app.view.terrain.chunks.length
```

## Render proof gaps

```txt
No frame id shared between movement, pose, camera, HUD, and render.
No baseline render readback row.
No presentation render readback row.
No serialized raptor pose frame.
No serialized camera request frame.
No serialized HUD projection frame.
No renderer size, pixel ratio, draw count, terrain chunk count, tree/rock/shard instance count row.
No proof that the second presentation render consumed the intended pose/camera/HUD request.
```

## Next proof rows

```txt
baseline_render_submitted
presentation_render_submitted
raptor_pose_frame_created
camera_frame_request_created
hud_frame_request_created
terrain_chunk_count_recorded
tree_rock_shard_instance_counts_recorded
host_presentation_latest_frame_exposed
```

## Non-goals

```txt
Do not add post-processing.
Do not change camera feel.
Do not change raptor scale or stride.
Do not replace the renderer.
Do not tune visuals before render readback rows exist.
```
