# PrehistoricRush Render Audit - Host Presentation Readback Map

**Timestamp:** `2026-07-09T00-09-22-04-00`

## Current render surface

`PrehistoricRush` has a live visual/render surface.

The active render path is still direct Three.js mutation inside `src/runtime-terrain-v6.mjs`, followed by an additive presentation pass in `src/game.js`.

```txt
runtime-terrain-v6 baseline frame:
  state mutation
  -> player transform
  -> animateRaptor(...)
  -> baseline camera follow
  -> baseline HUD innerHTML
  -> renderer.render(scene, camera)

src/game.js presentation pass:
  styleHud(app.ui)
  -> applyReadableStride(app)
  -> applyCloseCamera(app, THREE, dt)
  -> renderHud(app)
  -> renderer.render(scene, camera)
```

## Current render readback problem

`PrehistoricRushHost.getState()` currently reports:

```txt
scene
runner
physics
terrain.chunks
renderer: "three-terrain-v6-raptor"
```

That is not enough to prove which presentation descriptors were consumed.

The next render audit should become fixture-readable without needing WebGL:

```txt
RenderReadback:
  frame
  scene
  rendererId
  cameraPolicyId
  cameraRequest
  hudPolicyId
  hudRequest
  dinoPosePolicyId
  dinoPoseFrame
  terrainChunkCount
  physicsEnabled
  fallbackReasons[]
```

## Required host projection

Additive target:

```js
globalThis.PrehistoricRushHost.getState().presentation
```

Shape target:

```txt
presentation:
  latestFrameRecord
  recentFrameRecords
  latestRunnerSourceState
  latestRunnerStepDelta
  latestRunnerMovedEvent
  latestDinoPoseFrame
  latestCameraFrameRequest
  latestHudFrameRequest
  latestContactResultSnapshot
  latestSceneDispatchResult
  latestRenderReadback
```

## Fixture rows

```txt
render_readback_reports_renderer_id
render_readback_reports_camera_policy
render_readback_reports_hud_policy
render_readback_reports_dino_pose_policy
render_readback_reports_terrain_chunk_count
render_readback_reports_physics_snapshot_status
host_projection_preserves_existing_get_state_fields
host_projection_adds_nested_presentation_only
```

## Do not change visually in the next cut

```txt
- Keep current Three.js renderer.
- Keep current terrain look.
- Keep current raptor look.
- Keep current close camera readability pass.
- Keep current HUD visual rewrite.
- Keep the second render pass until readback proves the consumer seam.
```

## Next render ledge

```txt
PrehistoricRush Host Presentation Readback + DOM-free Render Consumer Fixture
```
