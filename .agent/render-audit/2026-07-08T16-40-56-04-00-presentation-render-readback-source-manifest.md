# PrehistoricRush Presentation Render Readback Source Manifest

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T16-40-56-04-00`

## Current render readback

`src/runtime-terrain-v6.mjs` creates and owns the live Three.js route. It builds the scene, fog, camera, renderer, terrain, raptor visual rig, rocks, shards, trees, resize handler, and primary render loop.

`src/game.js` then starts an additional presentation pass that reads `globalThis.PrehistoricRushHost.app`, applies a closer camera, applies readable stride mutations, renders HUD DOM, and calls `renderer.render(scene, camera)` again.

## Current render loop

```txt
runtime-terrain-v6.mjs setup()
  -> create THREE.Scene
  -> create PerspectiveCamera
  -> create WebGLRenderer
  -> create terrain chunks
  -> create procedural raptor rig
  -> create instanced rocks/shards/trees
  -> renderer.render(scene, camera)

src/game.js startPresentationPass()
  -> read PrehistoricRushHost.app
  -> styleHud(app.ui)
  -> applyReadableStride(app)
  -> applyCloseCamera(app, THREE, dt)
  -> renderHud(app)
  -> app.view.renderer.render(app.view.scene, app.view.camera)
```

## Readback gap

The render output is visually direct. It does not yet expose a structured render/presentation record.

Missing current readbacks:

```txt
RenderReadback.rendererId
RenderReadback.sceneName
RenderReadback.frame
RenderReadback.cameraPresetVersion
RenderReadback.cameraPositionIntent
RenderReadback.cameraLookIntent
RenderReadback.hudDescriptorVersion
RenderReadback.hudFields
RenderReadback.dinoPoseVersion
RenderReadback.dinoPoseSource
RenderReadback.presentationPassApplied
RenderReadback.legacyRendererStillActive
```

## Render domains in use

```txt
three-render-runtime
webgl-renderer-setup
scene-fog-lighting
camera-follow-policy
procedural-terrain-rendering
terrain-chunk-rebuild
vertex-color-terrain-material
instanced-rock-rendering
instanced-shard-rendering
instanced-tree-rendering
raptor-visual-rig-rendering
raptor-pose-animation
close-camera-presentation-pass
readable-stride-presentation-pass
HUD-DOM-render-pass
host-render-diagnostics
```

## Render services in use

```txt
setup(THREE, host)
createTerrain(THREE, scene)
terrain.update(x, z)
terrain.sample(x, z)
populate(app)
makeRaptor(THREE)
animateRaptor(raptor, speed, time, turning, jump)
applyReadableStride(app)
applyCloseCamera(app, THREE, dt)
renderHud(app)
renderer.render(scene, camera)
PrehistoricRushHost.getState()
```

## Render kits identified

```txt
current/source-backed:
  camera-domain-kit
  hud-domain-kit
  dino-pose-domain-kit
  rapier-physics-domain-kit

runtime-implied:
  prehistoric-three-render-host-kit
  prehistoric-procedural-terrain-render-kit
  prehistoric-terrain-chunk-stream-kit
  prehistoric-instanced-scatter-render-kit
  prehistoric-raptor-rig-render-kit
  prehistoric-close-camera-apply-kit
  prehistoric-readable-stride-apply-kit
  prehistoric-hud-dom-render-kit

next-cut:
  prehistoric-rush-camera-frame-request-kit
  prehistoric-rush-hud-frame-request-kit
  prehistoric-rush-dino-pose-frame-kit
  prehistoric-rush-presentation-frame-record-kit
  prehistoric-rush-render-readback-kit
  prehistoric-rush-host-presentation-snapshot-kit
```

## Next render proof

Add `src/presentation/render-readback.js` as a pure descriptor projector. It should not change the live renderer, scene graph, camera math, HUD DOM, raptor visuals, terrain, or frame cadence.

Required fixture rows:

```txt
render_readback_reports_renderer_id
render_readback_reports_camera_descriptor_consumed
render_readback_reports_hud_descriptor_consumed
render_readback_reports_dino_pose_frame_consumed
render_readback_reports_legacy_renderer_still_active
render_readback_is_projected_into_host_presentation_snapshot
```
