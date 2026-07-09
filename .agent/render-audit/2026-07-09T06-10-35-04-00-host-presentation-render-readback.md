# Render Audit: Host Presentation Render Readback

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T06-10-35-04-00`

## Current render surface

The repo has a visual/render surface.

Current live render path:

```txt
runtime-terrain-v6.mjs
  -> setup(THREE, ui.host)
  -> create scene/camera/renderer/terrain/raptor/rocks/shards/tree instances
  -> animation loop mutates terrain, runner, raptor pose, camera, HUD DOM, and renderer
  -> renderer.render(scene, camera)
  -> src/game.js presentation pass applies readable stride, close camera, HUD rewrite
  -> renderer.render(scene, camera) again
```

## Render domains currently implied

```txt
three-render-runtime
procedural-terrain-rendering
terrain-height-sampling
terrain-chunk-streaming
procedural-scatter-placement
raptor-visual-rig
raptor-pose-animation
camera-follow-policy
hud-telemetry-projection
presentation-pass-authority
render-readback-contract
host-presentation-snapshot
```

## Current render services

```txt
setup(THREE, host)
createTerrain(THREE, scene)
terrain.update(x, z)
terrain.sample(x, z)
makeRaptor(THREE)
animateRaptor(player, speed, time, turn, jump)
styleHud(ui)
renderHud(app)
applyCloseCamera(app, THREE, dt)
applyReadableStride(app)
renderer.render(scene, camera)
PrehistoricRushHost.getState()
```

## Render-readback gap

`PrehistoricRushHost.getState()` currently exposes only a string renderer marker plus scene, runner, physics, and terrain counts.

Missing proof rows:

```txt
camera request readback
HUD request readback
dino pose consumer readback
renderer frame readback
render parity reason
second render pass preservation marker
legacy host state preservation marker
```

## Required additive render projection

```txt
PrehistoricRushHost.getState().presentation = {
  latestFrame,
  recentFrames,
  latestRunnerSource,
  latestRunnerDelta,
  latestRunnerMovedEvent,
  latestDinoPoseFrame,
  latestCameraFrameRequest,
  latestHudFrameRequest,
  latestContactResult,
  latestSceneDispatchResult,
  latestRenderReadback,
  warnings
}
```

## Render finding

Do not extract the renderer next.

First add `render-readback.js`, `presentation-frame-record.js`, `presentation-journal.js`, and `host-presentation-snapshot.js` so the existing renderer path can prove what it consumed while the visible scene stays unchanged.
