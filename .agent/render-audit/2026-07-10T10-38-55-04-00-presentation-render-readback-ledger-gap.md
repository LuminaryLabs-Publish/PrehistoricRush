# Render Audit: Presentation Render Readback Ledger Gap

Timestamp: 2026-07-10T10-38-55-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Render surface

`PrehistoricRush` has a visual/render surface through `src/runtime-terrain-v6.mjs` and the secondary presentation pass in `src/game.js`.

## Current render path

```txt
runtime-terrain-v6 frame loop
  -> update runner state
  -> update terrain and population
  -> apply raptor pose
  -> apply camera
  -> update HUD
  -> renderer.render(scene, camera)

src/game.js presentation pass
  -> apply readable stride directly
  -> apply close camera directly
  -> rewrite HUD DOM directly
  -> submit a second renderer frame
```

## Gap

There is no render readback row for either render submission. There is also no shared source frame id connecting movement, pose, camera, HUD, and render.

## Required next rows

```txt
source_frame_id
runner_moved_event_id
dino_pose_frame_id
camera_frame_request_id
hud_frame_request_id
primary_render_readback
secondary_render_readback
presentation_frame_record
host_latest_presentation_frame
```

## Not next

- renderer extraction
- visual expansion
- terrain material rewrite
- dino visual retune
- camera feel retune

## Next render-safe ledge

```txt
Render readback rows tied to runner event frame ids
```
