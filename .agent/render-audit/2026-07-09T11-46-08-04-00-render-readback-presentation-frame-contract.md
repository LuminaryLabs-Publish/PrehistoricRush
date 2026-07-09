# PrehistoricRush Render Audit: Render Readback Presentation Frame Contract

**Generated:** `2026-07-09T11-46-08-04-00`

## Current render surface

`PrehistoricRush` has a visual/render surface.

```txt
runtime-terrain-v6.mjs
  -> creates Three.js scene/camera/renderer
  -> builds sky, terrain, raptor, rocks, shards, and tree instancing
  -> renders baseline frame inside the live loop
  -> exposes renderer string through PrehistoricRushHost.getState()
```

`src/game.js` then runs a second presentation pass:

```txt
startPresentationPass()
  -> styleHud(app.ui)
  -> applyReadableStride(app)
  -> applyCloseCamera(app, app.THREE, dt)
  -> renderHud(app)
  -> app.view.renderer.render(app.view.scene, app.view.camera)
```

## Render readback gap

The renderer is visible, but proof is weak.

```txt
current: renderer: "three-terrain-v6-raptor"
missing: structured RenderReadback
missing: camera readback after close-camera consumer
missing: HUD request/readback after DOM projection
missing: raptor stride consumer readback
missing: render frame sequence number
missing: frame source hash or source-state fingerprint
```

## Render domain services in use

```txt
Three.js module loading
WebGLRenderer construction
renderer.setSize
renderer.setPixelRatio
scene fog and lighting
terrain geometry rebuild
instanced rocks/shards/trees
procedural raptor mesh and rig animation
baseline renderer.render(scene, camera)
secondary presentation renderer.render(scene, camera)
```

## Render proof contract needed

```txt
RenderReadback {
  frameId
  scene
  rendererLabel
  cameraPosition
  cameraLookTarget
  terrainChunkCount
  runnerPosition
  runnerYaw
  hudMode
  presentationPassApplied
  legacyRendererFieldUnchanged
}
```

## Acceptance rows

```txt
menu_idle: no movement, renderer label stable
game_first_movement_frame: runner source projected, camera request consumed
turn_left: yaw delta visible in camera and dino pose request
turn_right: yaw delta visible in camera and dino pose request
boost: speed delta visible in HUD request
jump_start: jumpY visible in pose/camera/HUD records
collision_run_over: scene dispatch reflected without renderer crash
win_threshold: scene dispatch reflected without renderer crash
```

## Recommendation

Do not extract the Three renderer yet.

Add `src/presentation/render-readback.js` as an additive consumer that records enough evidence from `app.view`, `app.state`, and the presentation pass to prove the live render frame consumed the expected records.
