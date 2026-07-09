# Render Audit: Presentation Render Readback Host Map

**Timestamp:** `2026-07-09T09-02-44-04-00`

## Current render route

```txt
runtime-terrain-v6 setup()
  -> Three.js scene
  -> PerspectiveCamera
  -> WebGLRenderer
  -> terrain chunks
  -> raptor rig
  -> instanced rocks / shards / five tree pools
  -> baseline loop mutates camera and renders scene
  -> game.js presentation pass mutates close camera, HUD, readable stride
  -> second render(scene, camera)
```

## Current render proof

`PrehistoricRushHost.getState()` exposes only:

```txt
renderer: "three-terrain-v6-raptor"
terrain.chunks: app.view.terrain.chunks.length
```

That is not enough to prove which presentation descriptors were consumed.

## Render domains in use

```txt
three-render-host-domain
terrain-render-domain
raptor-render-adapter-domain
instanced-prop-render-domain
camera-render-domain
hud-dom-render-domain
presentation-pass-domain
render-readback-target-domain
```

## Render services in use

```txt
renderer sizing and pixel ratio setup
scene/fog/light setup
terrain mesh chunk rebuild
raptor rig animation
instanced tree/rock/shard placement
baseline camera follow
baseline HUD HTML projection
presentation close-camera override
presentation readable-stride override
presentation HUD rewrite
second render call
```

## Next readback fields

```txt
presentation.renderReadback.frame
presentation.renderReadback.rendererId
presentation.renderReadback.sceneObjectCount
presentation.renderReadback.cameraPresetId
presentation.renderReadback.cameraPosition
presentation.renderReadback.cameraLookAt
presentation.renderReadback.hudPresetId
presentation.renderReadback.hudRows
presentation.renderReadback.raptorPoseVersion
presentation.renderReadback.terrainChunkCount
presentation.renderReadback.secondRenderApplied
```

## Render rule

Do not extract renderer authority next. First add additive readback records that prove the current presentation pass consumes stable source records without changing the visible frame.
