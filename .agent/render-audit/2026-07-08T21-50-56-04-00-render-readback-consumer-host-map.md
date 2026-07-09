# PrehistoricRush Render Audit: Render Readback Consumer Host Map

**Timestamp:** `2026-07-08T21-50-56-04-00`

## Render surface summary

`PrehistoricRush` has a visual/render surface.

The current visual route is a live browser render built from `src/runtime-terrain-v6.mjs`, Three.js, Rapier, procedural terrain chunks, procedural raptor geometry, hazards, pickups, HUD DOM, and a second readability presentation pass in `src/game.js`.

## Current render loop

```txt
runtime-terrain-v6 creates DOM shell
  -> loads Three.js
  -> creates scene, camera, renderer, lighting, terrain, props, raptor, hazards, pickups
  -> updates terrain chunks around runner
  -> samples terrain height for runner and props
  -> mutates raptor rig pose
  -> mutates baseline camera/HUD
  -> renders scene
  -> src/game.js presentation pass reads PrehistoricRushHost.app
  -> styleHud/renderHud/applyCloseCamera/applyReadableStride run
  -> renderer renders scene again
```

## Current render authority owners

```txt
runtime-terrain-v6.mjs
  owns: scene creation, renderer creation, terrain geometry, props, hazards, pickups, raptor rig, baseline camera/HUD, animation frame

src/game.js
  owns: close camera readability override, readable stride override, HUD DOM rewrite, second render call

PrehistoricRushHost.getState()
  owns: current public render debug readback, but only as broad scene/runner/physics/terrain/renderer fields
```

## Render readback gap

The host exposes a render-facing snapshot, but it does not yet expose structured evidence of what the renderer consumed.

Needed next readback:

```txt
RenderReadback
  frameId
  scene
  cameraSource
  hudSource
  dinoPoseSource
  terrainChunkCount
  rendererName
  rendererPath
  baselineRenderObserved
  presentationRenderObserved
  fallbackReasons[]
  unsupportedFields[]
```

## Consumer map

```txt
RunnerSourceState
  consumed by: camera request, HUD request, dino pose frame, contact projection

DinoPoseFrame
  consumed by: readable stride compatibility layer now; future raptor visual rig descriptor later

CameraFrameRequest
  consumed by: applyCloseCamera compatibility layer now; future camera consumer later

HudFrameRequest
  consumed by: renderHud compatibility layer now; future HUD renderer later

ContactResultSnapshot
  consumed by: host diagnostics first; future scene mutation adapter later

SceneDispatchResult
  consumed by: host diagnostics first; future scene transition adapter later

RenderReadback
  consumed by: PresentationFrameRecord and PrehistoricRushHost.getState().presentation
```

## Render fixture requirements

```txt
01_render_readback_reports_renderer_string
02_render_readback_reports_camera_request_source
03_render_readback_reports_hud_request_source
04_render_readback_reports_dino_pose_source
05_render_readback_reports_terrain_chunk_count
06_render_readback_reports_baseline_and_presentation_paths
07_render_readback_has_no_required_dom_for_fixture_mode
08_legacy_renderer_output_remains_compatible
```

## Do not change yet

```txt
- Do not replace Three.js renderer.
- Do not remove the second render call yet.
- Do not replace terrain chunk generation.
- Do not replace raptor geometry.
- Do not replace HUD visuals.
- Do not make render readback depend on WebGL for the DOM-free fixture.
```

## Next render ledge

Add a pure `createRenderReadback()` helper and include it in `PresentationFrameRecord`.

Expose it additively under `PrehistoricRushHost.getState().presentation.render` while keeping existing host fields unchanged.
