# Render Audit: Render Readback Presentation Frame

**Timestamp:** `2026-07-09T19-29-23-04-00`

## Render surface

`PrehistoricRush` has a browser visual surface. `src/runtime-terrain-v6.mjs` creates the Three.js scene, terrain chunks, raptor rig, instanced rocks, instanced shards, tree pools, camera, sky, fog, lights, and renderer.

## Current render loop

```txt
requestAnimationFrame(loop)
  -> mutate runner and scene state
  -> terrain.update and populate as needed
  -> set Rapier kinematic actor transform
  -> collision and pickup checks
  -> v.player.position / rotation
  -> animateRaptor(...)
  -> baseline camera lerp and lookAt
  -> baseline HUD innerHTML
  -> v.renderer.render(v.scene, v.camera)

src/game.js startPresentationPass()
  -> styleHud(app.ui)
  -> applyReadableStride(app)
  -> applyCloseCamera(app, THREE, dt)
  -> renderHud(app)
  -> app.view.renderer.render(app.view.scene, app.view.camera)
```

## Render readback gap

The route renders twice per browser frame path once the presentation pass starts, but neither pass produces a serializable record.

Missing rows:

```txt
render pass id
source frame id
runner source state used
camera frame request
HUD frame request
DinoPoseFrame consumed
terrain chunk count
instanced rock/tree/shard counts
contact result snapshot
scene dispatch result
render submitted flag
host projection snapshot
```

## Current host readback

`PrehistoricRushHost.getState()` currently returns:

```txt
scene
runner
physics
terrain.chunks
renderer: "three-terrain-v6-raptor"
```

That is useful, but it does not expose the presentation pass, event bridge, render submission, or consumer parity.

## Next render contract

Add `src/presentation/render-readback.js` and `src/presentation/presentation-frame-record.js` before any visual rewrite.

The first readback should be additive and fixture-readable:

```txt
{
  frame,
  scene,
  runner,
  runnerMovedEvent,
  dinoPoseFrame,
  cameraFrameRequest,
  hudFrameRequest,
  contactResultSnapshot,
  sceneDispatchResult,
  renderReadback,
  hostPresentationSnapshot
}
```

## Deferred

```txt
renderer extraction
post-processing
asset overhaul
terrain material changes
camera feel retune
new raptor rig art
```
