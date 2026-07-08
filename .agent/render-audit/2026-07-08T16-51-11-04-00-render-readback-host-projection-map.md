# PrehistoricRush Render Readback Host Projection Map

**Timestamp:** `2026-07-08T16-51-11-04-00`

## Render surface

`PrehistoricRush` has a visual/render surface.

The current route renders through the legacy `runtime-terrain-v6.mjs` Three.js/Rapier route and then receives a readability presentation pass from `src/game.js`.

## Current render loop

```txt
runtime-terrain-v6.mjs
  -> imports Three.js from CDN
  -> imports Rapier from CDN
  -> imports rapier-physics-domain-kit from CDN
  -> creates DOM shell
  -> creates Three.js scene / camera / renderer
  -> creates procedural terrain chunks
  -> creates raptor visual rig
  -> creates scatter, hazards, pickups, and props
  -> updates state, terrain, contacts, pickup, and scene outcome
  -> baseline renderer frame

src/game.js presentation pass
  -> reads globalThis.PrehistoricRushHost.app
  -> styleHud(app.ui)
  -> applyReadableStride(app)
  -> applyCloseCamera(app, app.THREE, dt)
  -> renderHud(app)
  -> app.view.renderer.render(app.view.scene, app.view.camera)
```

## Render authority problem

The visible output is not the issue.

The issue is that render and presentation consumption is not yet visible as source records.

Current host readback can report broad runtime facts, but it cannot answer:

```txt
which runner source facts fed this frame?
which dino pose descriptor was consumed?
which camera frame request was consumed?
which HUD frame request was consumed?
which contact / scene result triggered the frame?
which renderer path ran?
which fallback path ran?
which DOM elements were touched?
which legacy fields were preserved?
```

## Required RenderReadback contract

```txt
RenderReadback
  id
  frame
  scene
  runnerSourceStateId
  dinoPoseFrameId
  cameraFrameRequestId
  hudFrameRequestId
  contactResultSnapshotId
  sceneDispatchResultId
  rendererPath
  cameraPath
  hudPath
  dinoPath
  terrainPath
  physicsPath
  usedLegacyRuntime
  usedPresentationPass
  missingInputs[]
  fallbackReasons[]
  legacyCompatibility
```

## First additive readback rows

```txt
render_readback_reports_legacy_three_renderer_path
render_readback_reports_rapier_or_fallback_physics_path
render_readback_reports_current_camera_mutation_path
render_readback_reports_current_hud_dom_path
render_readback_reports_current_dino_stride_path
render_readback_links_runner_source_state
render_readback_links_camera_frame_request
render_readback_links_hud_frame_request
render_readback_links_dino_pose_frame
render_readback_records_missing_contact_snapshot_before_cutover
render_readback_records_missing_scene_dispatch_result_before_cutover
host_projection_keeps_existing_getState_fields
host_projection_adds_presentation_without_breaking_legacy
```

## Do not change visually yet

Do not replace the camera, HUD, dino rig, terrain, or renderer in the next implementation.

Add RenderReadback beside the current behavior first, then prove the readback with a DOM-free fixture and a browser smoke check.
