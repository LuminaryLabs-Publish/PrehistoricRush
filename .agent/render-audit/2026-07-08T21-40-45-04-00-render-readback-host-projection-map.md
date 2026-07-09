# Render Audit — Render Readback Host Projection Map

**Timestamp:** `2026-07-08T21-40-45-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Current render surface

The visual surface is still owned by `src/runtime-terrain-v6.mjs` and the presentation pass in `src/game.js`.

Current render chain:

```txt
runtime-terrain-v6.mjs setup()
  -> create Three.js scene
  -> create fog, lights, sky sphere, terrain, raptor, rocks, shards, trees
  -> create PerspectiveCamera
  -> create WebGLRenderer
  -> append renderer.domElement
  -> baseline game loop updates player/camera/HUD/render
  -> v.renderer.render(v.scene, v.camera)

src/game.js startPresentationPass()
  -> read globalThis.PrehistoricRushHost.app
  -> applyReadableStride(app)
  -> applyCloseCamera(app, THREE, dt)
  -> renderHud(app)
  -> app.view.renderer.render(app.view.scene, app.view.camera)
```

## Render authority status

```txt
renderer exists: yes
camera exists: yes
scene exists: yes
world mesh generation exists: yes
raptor rig exists: yes
HUD DOM exists: yes
render-readback record exists: no
presentation frame journal exists: no
host presentation snapshot exists: no
DOM-free render fixture exists: no
```

## Render readback required next

The next pass should record render consumption facts without changing WebGL output.

```txt
RenderReadback:
  frame
  scene
  rendererLabel
  rendererPath
  cameraPolicy
  cameraPositionProjected
  cameraLookProjected
  hudPolicy
  hudMetricsProjected
  dinoPosePolicy
  dinoPoseConsumed
  terrainChunkCount
  physicsMode
  visualRoutePreserved
  source
```

## Camera readback

Current camera behavior has two sources:

```txt
runtime-terrain-v6 baseline:
  distance: 12
  height: 4.7
  lookAhead: 15
  lookHeight: 1.55
  followSharpness: 7.5

src/game.js presentation pass:
  distance: 7.2
  height: 3.0
  lookAhead: 10.5
  lookHeight: 1.25
  followSharpness: 8.5
```

The next render audit should not choose a new visual policy. It should document that the presentation pass is the active readability override and capture that as `CameraFrameRequest` and `RenderReadback`.

## HUD readback

Current HUD behavior has two sources:

```txt
runtime-terrain-v6 baseline HUD:
  scene
  distance
  speed
  heading
  shards
  best
  terrain chunks
  Rapier status
  raptor/tree notes

src/game.js readability HUD:
  title
  scene
  progress bar
  distance / target
  speed
  shards
  best
  debug line
  readability note
```

The next pass should preserve the visible HUD and add `HudFrameRequest` beside it.

## Dino pose readback

Current dino pose behavior has two sources:

```txt
runtime-terrain-v6 animateRaptor()
  owns baseline raptor rig mutation

src/game.js applyReadableStride()
  owns stronger readable stride overlay

dino-pose-domain-kit
  owns data descriptor and listens for runner.moved, but does not receive live runner movement yet
```

The next pass should record which source drove the frame and prove the domain consumer path by emitting `runner.moved` into the existing domain kit.

## Do not change yet

```txt
Do not replace Three.js setup.
Do not remove the baseline renderer pass.
Do not remove the readability presentation pass.
Do not retune camera numbers.
Do not retune dino stride numbers.
Do not retune HUD layout.
Do not rewrite terrain generation.
Do not add package.json only for render validation.
```

## Render fixture rows needed

```txt
01_render_readback_reports_renderer_label
02_render_readback_reports_camera_request_source
03_render_readback_reports_hud_request_source
04_render_readback_reports_dino_pose_source
05_render_readback_reports_terrain_chunk_count
06_render_readback_reports_physics_mode
07_render_readback_preserves_visual_route
08_host_projection_exposes_latest_render_readback
09_dom_free_fixture_builds_render_readback_without_webgl
```