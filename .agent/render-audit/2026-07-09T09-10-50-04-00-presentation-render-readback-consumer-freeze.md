# Render Audit: Presentation Render Readback Consumer Freeze

**Timestamp:** `2026-07-09T09-10-50-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Render surface

The repo has a visual/render surface.

The live route is a browser Three.js scene created by `src/runtime-terrain-v6.mjs`, with a second readability-oriented presentation pass in `src/game.js`.

## Current render loop

```txt
runtime-terrain-v6.mjs
  -> setup(THREE, host)
  -> WebGLRenderer
  -> scene, fog, ambient light, sun
  -> terrain chunk group
  -> procedural raptor group
  -> instanced rocks
  -> instanced shards
  -> five tree instance pools
  -> baseline camera update
  -> baseline HUD innerHTML update
  -> renderer.render(scene, camera)
  -> requestAnimationFrame(loop)

src/game.js
  -> startPresentationPass()
  -> styleHud(app.ui)
  -> applyReadableStride(app)
  -> applyCloseCamera(app, THREE, dt)
  -> renderHud(app)
  -> app.view.renderer.render(app.view.scene, app.view.camera)
  -> requestAnimationFrame(pass)
```

## Current render consumers

```txt
renderer consumes: scene + camera
camera consumes: app.state.x / z / yaw / y / jumpY
raptor consumes: app.state.speed / time / turn / jumpY
HUD consumes: app.scene / app.state / app.physics.getSnapshot() / terrain chunks
terrain consumes: app.state.x / z for chunk updates
instances consume: populate(app) outputs for rocks / trees / shards
host readback consumes: app.scene / app.state / app.physics snapshot / terrain count / renderer label
```

## Missing render proof

```txt
RenderReadback missing.
CameraFrameRequest missing.
HudFrameRequest missing.
DinoPoseFrame missing.
PresentationFrameRecord missing.
PrehistoricRushHost.getState().presentation.latestFrame missing.
No fixture proves that the second render pass preserved the legacy host fields.
No fixture proves that camera/HUD/pose consumers are derived from source records instead of ad hoc mutable state.
```

## Consumer freeze rule

The next implementation must preserve the existing route and render behavior.

Do not remove the baseline render pass.

Do not remove the second presentation render pass until the proof bridge can show exactly what consumed what.

## Required readback rows

```txt
menu_idle_render
first_movement_render
turn_left_render
turn_right_render
boost_render
jump_start_render
jump_recover_render
pickup_render
collision_render
win_render
legacy_renderer_field_unchanged
presentation_latest_frame_present
presentation_render_readback_present
```

## Next render ledge

```txt
Add RenderReadback as evidence, not authority.
```

The first useful render proof is a structured object that records frame number, scene name, camera target/position intent, HUD projection inputs, dino pose projection, terrain chunk count, renderer label, and legacy field preservation.
