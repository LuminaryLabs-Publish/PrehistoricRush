# PrehistoricRush Render Event Readback

**Timestamp:** `2026-07-08T10:39:22-04:00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

## Visual surface

`PrehistoricRush` has a visual/render surface.

Current render authority is split between:

```txt
runtime-terrain-v6.mjs baseline renderer frame
src/game.js presentation pass renderer frame
```

## Current render loop

```txt
runtime-terrain-v6.mjs setup()
  -> create Three.js scene/camera/renderer
  -> create procedural sky sphere
  -> create terrain chunks
  -> create procedural raptor rig
  -> create instanced rocks, shards, and five tree pools
  -> run animation frame loop
  -> update runner state
  -> animate raptor
  -> baseline camera follow
  -> baseline HUD innerHTML
  -> renderer.render(scene, camera)

src/game.js startPresentationPass()
  -> read PrehistoricRushHost.app
  -> style HUD
  -> apply readable stride
  -> apply close camera
  -> render HUD DOM
  -> renderer.render(scene, camera)
```

## Render domains in use

```txt
three-render-runtime
procedural-sky-domain
terrain-height-sampling
terrain-chunk-rendering
instanced-tree-rendering
instanced-rock-rendering
pickup-shard-rendering
raptor-visual-rig
raptor-pose-animation
camera-follow-policy
close-camera-presentation-pass
hud-dom-projection
renderer-frame-authority
```

## Current render services

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
styleHud(ui)
renderer.render(scene, camera)
```

## Render kits identified

```txt
camera-domain-kit
hud-domain-kit
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
rapier-physics-domain-kit
```

Current render-adjacent inline kits still embedded in `runtime-terrain-v6.mjs`:

```txt
procedural-terrain-grid-kit candidate
terrain-height-sampler-kit candidate
terrain-scatter-descriptor-kit candidate
raptor-visual-rig-kit candidate
raptor-animation-adapter-kit candidate
pickup-shard-render-kit candidate
hazard-tree-render-kit candidate
```

## Main render gap

The close camera, HUD readability, and readable stride improvements exist, but they are not yet stable descriptor records.

The immediate render-safe proof should record descriptors beside the current direct mutations:

```txt
RunnerSourceState
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
```

## Non-goals for next pass

```txt
- Do not redesign the raptor.
- Do not replace terrain rendering.
- Do not replace Three.js.
- Do not rewrite the whole renderer.
- Do not promote a shared renderer kit until descriptor records are fixture-proven locally.
```

## Render fixture acceptance

A future fixture should prove:

```txt
1. camera request matches current close camera policy
2. HUD request matches current readability HUD facts
3. dino pose frame matches current readable stride inputs
4. presentation frame record journals all subrecords
5. renderer output behavior remains unchanged while descriptors are added
6. host exposes latest presentation frame without DOM/WebGL dependence
```
