# PrehistoricRush Presentation Readback Contract

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T12:09:27-04:00`

## Render surface summary

`PrehistoricRush` has two active render/presentation surfaces:

```txt
runtime-terrain-v6.mjs loop
  -> animateRaptor()
  -> baseline camera follow
  -> baseline status innerHTML
  -> baseline renderer.render(scene, camera)

src/game.js presentation pass
  -> applyReadableStride(app)
  -> applyCloseCamera(app, THREE, dt)
  -> renderHud(app)
  -> app.view.renderer.render(app.view.scene, app.view.camera)
```

The second pass improves readability and feel, but it is still not represented as data.

## Current renderer ownership

```txt
Three.js renderer owns:
  - WebGLRenderer creation
  - canvas size and pixel ratio
  - scene fog and lighting
  - terrain meshes
  - instanced rocks, shards, and trees
  - procedural raptor mesh
  - render(scene, camera)

runtime loop owns:
  - baseline camera position
  - baseline camera lookAt
  - baseline HUD innerHTML
  - baseline raptor animation

presentation pass owns:
  - close camera override
  - readable stride override
  - readability HUD override
  - second render frame
```

## Readback gap

The route does not expose a stable presentation record answering:

```txt
what runner state was read?
was movement detected?
was runner.moved emitted?
which dino pose was requested?
which camera descriptor was requested?
which HUD descriptor was requested?
which direct mutations still ran?
which renderer frame came from baseline vs presentation pass?
what fallback reason was used?
```

## Required PresentationFrameRecord

```ts
interface PresentationFrameRecord {
  id: string;
  frame: number;
  scene: string;
  source: RunnerSourceState;
  movement: RunnerMovedEvent | null;
  emitted: {
    runnerMoved: boolean;
    dinoPoseChanged: boolean;
  };
  dino: DinoPoseFrame;
  camera: CameraFrameRequest;
  hud: HudFrameRequest;
  render: {
    baselineRenderObserved: boolean;
    presentationRenderObserved: boolean;
    rendererName: string;
    visualMutationMode: "legacy-direct-plus-readback";
  };
  fallbacks: string[];
}
```

## Render acceptance rows

```txt
01_presentation_frame_records_current_scene
02_presentation_frame_records_runner_position_and_velocity_inputs
03_presentation_frame_records_dino_stride_phase_without_mutating_test_rig
04_presentation_frame_records_close_camera_target_and_look_target
05_presentation_frame_records_hud_status_fields_without_dom_requirement
06_presentation_frame_marks_baseline_and_presentation_render_paths
07_presentation_frame_exposes_fallback_when_host_app_missing
08_presentation_frame_journal_bounds_recent_records
09_host_get_state_projects_latest_presentation_record
10_dom_free_fixture_can_project_render_requests_without_three_renderer
11_browser_route_keeps_current_visual_output
12_renderer_replacement_is_not_required_for_this_gate
```

## Do not replace yet

Do not replace the Three.js renderer, raptor rig, terrain meshes, HUD DOM, or camera mutation before the readback layer exists.

The readback layer must sit beside the current renderer and prove the current frame contract first.

## Next implementation files

```txt
src/presentation/runner-source-state.js
src/presentation/runner-moved-event.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```
