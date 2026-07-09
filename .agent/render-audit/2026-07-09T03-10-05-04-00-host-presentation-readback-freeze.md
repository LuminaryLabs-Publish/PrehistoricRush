# Render Audit: Host Presentation Readback Freeze

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T03-10-05-04-00`

## Current render path

```txt
runtime-terrain-v6.mjs setup()
  -> creates Three.js scene, camera, renderer, terrain, raptor, rocks, shards, and tree pools
  -> app loop updates runner state and render-facing objects
  -> animateRaptor mutates the raptor rig
  -> baseline camera follow mutates the camera
  -> baseline HUD writes innerHTML
  -> renderer.render(scene, camera)
  -> src/game.js presentation pass starts
  -> applyReadableStride mutates raptor rig again
  -> applyCloseCamera mutates camera again
  -> renderHud writes HUD innerHTML again
  -> renderer.render(scene, camera) again
```

## Render facts to preserve

```txt
The page remains a static browser route.
The live renderer remains Three.js from CDN.
The live physics bridge remains Rapier + rapier-physics-domain-kit.
The current camera readability pass remains visually active.
The current HUD readability pass remains visually active.
The current raptor readability stride remains visually active.
The current double-render behavior is preserved until render readback proves parity.
```

## Render authority gap

The renderer is not yet descriptor-readable.

The current host projection exposes only:

```txt
scene
runner
physics
terrain.chunks
renderer: three-terrain-v6-raptor
```

The missing render proof is a structured `RenderReadback` and nested host projection that records what the frame consumed without requiring WebGL execution.

## Required render readback shape

```txt
RenderReadback
  frame
  scene
  rendererId
  cameraPolicyId
  cameraPositionApprox
  cameraLookAtApprox
  hudPolicyId
  hudFields
  dinoPoseSource
  dinoRigMutationSource
  terrainChunkCount
  physicsSnapshotStatus
  renderPasses
  fallbackReasons
```

## Host projection target

```txt
PrehistoricRushHost.getState().presentation = {
  latestFrame,
  latestRunnerSource,
  latestRunnerDelta,
  latestRunnerMovedEvent,
  latestDinoPoseFrame,
  latestCameraFrameRequest,
  latestHudFrameRequest,
  latestContactResult,
  latestSceneDispatchResult,
  latestRenderReadback,
  recentFrames
}
```

## Render fixture rows

```txt
01_render_readback_reports_renderer_id
02_render_readback_reports_camera_policy
03_render_readback_reports_hud_policy
04_render_readback_reports_dino_pose_source
05_render_readback_reports_terrain_chunk_count
06_render_readback_reports_two_render_passes_until_parity_cutover
07_host_presentation_keeps_legacy_get_state_fields
08_host_presentation_exposes_nested_render_readback
```

## Do not change yet

```txt
Do not remove the second render pass.
Do not replace the renderer.
Do not change camera distance.
Do not change HUD copy or layout.
Do not move terrain rendering into a new renderer module before readback exists.
Do not add visual content to compensate for missing proof.
```
