# PrehistoricRush Render Readback Consumer Fixture Map

**Timestamp:** `2026-07-08T19-30-31-04-00`

## Scope

`PrehistoricRush` has a live visual/render surface.

This render audit narrows the next proof layer to structured render and presentation readback without changing the current Three.js/Rapier route.

## Current render loop

```txt
runtime-terrain-v6.mjs
  -> setup(THREE, host)
  -> scene/camera/renderer/terrain/player/rocks/shards/trees
  -> requestAnimationFrame(loop)
  -> movement/contact/scene updates
  -> animateRaptor(...)
  -> baseline camera follow
  -> baseline HUD innerHTML
  -> renderer.render(scene, camera)

src/game.js presentation pass
  -> styleHud(app.ui)
  -> applyReadableStride(app)
  -> applyCloseCamera(app, THREE, dt)
  -> renderHud(app)
  -> renderer.render(scene, camera)
```

## Current render authority problem

```txt
- The route renders correctly enough to preserve.
- Two presentation surfaces currently mutate the same frame: runtime-terrain-v6.mjs and src/game.js.
- Camera, HUD, dino pose, and render consumption are not described before mutation.
- PrehistoricRushHost.getState().renderer is a string, not structured readback.
- A DOM-free fixture cannot prove current visual policy yet.
```

## Required RenderReadback shape

```txt
RenderReadback {
  version
  frame
  scene
  renderer: {
    present
    kind
    renderedThisFrame
    source
  }
  camera: {
    requestId
    applied
    positionPolicy
    lookAtPolicy
    reason
  }
  hud: {
    requestId
    applied
    title
    sceneLabel
    progressTarget
    reason
  }
  dino: {
    poseFrameId
    applied
    rigPresent
    stridePolicy
    reason
  }
  fallbacks: string[]
}
```

## Fixture rows

```txt
01_renderer_present_when_app_view_renderer_exists
02_camera_request_applied_by_close_camera_pass
03_hud_request_applied_by_readability_hud_pass
04_dino_pose_frame_applied_by_readable_stride_pass
05_menu_scene_render_readback_records_no_runner_move
06_game_scene_render_readback_records_runner_move
07_missing_renderer_reports_fallback_without_throw
08_host_presentation_snapshot_contains_latest_render_readback
```

## Consumer boundaries

```txt
CameraFrameRequest
  -> applyCloseCamera remains visual mutation
  -> RenderReadback.camera records applied policy

HudFrameRequest
  -> renderHud remains visual mutation
  -> RenderReadback.hud records applied policy

DinoPoseFrame
  -> applyReadableStride remains visual mutation
  -> RenderReadback.dino records applied policy

PresentationFrameRecord
  -> RenderReadback included as subrecord
  -> PrehistoricRushHost.getState().presentation.latest.render included additively
```

## Stop line

Do not change camera values, HUD layout, renderer setup, raptor geometry, terrain colors, or Rapier integration in this pass.

The only source-level render change should be additive readback beside current mutations.
