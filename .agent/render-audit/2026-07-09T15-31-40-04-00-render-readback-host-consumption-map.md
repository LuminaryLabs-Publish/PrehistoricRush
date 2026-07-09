# Render Audit: Render Readback Host Consumption Map

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T15-31-40-04-00`

## Render surface

`PrehistoricRush` has a visual/render surface.

The live route uses:

```txt
Three.js CDN
Rapier CDN
rapier-physics-domain-kit CDN
WebGLRenderer
PerspectiveCamera
Fog
DirectionalLight
AmbientLight
terrain chunk meshes
procedural raptor group
instanced rocks
instanced shards
five instanced tree pools
DOM status HUD
```

## Current render loop

```txt
runtime-terrain-v6.mjs loop(now)
  -> mutate runner state
  -> update terrain and instances
  -> update physics actor
  -> check contacts and pickups
  -> position/animate raptor
  -> update baseline camera
  -> write baseline HUD
  -> renderer.render(scene, camera)

src/game.js presentation pass
  -> read PrehistoricRushHost.app
  -> applyReadableStride(app)
  -> applyCloseCamera(app, THREE, dt)
  -> renderHud(app)
  -> renderer.render(scene, camera)
```

## Render gap

The route currently renders twice per frame path when the presentation pass is active. That is acceptable for the current playable shell, but the second pass is a consumer mutation with no proof record.

The missing contract is not a renderer rewrite. It is a readback record that can answer:

```txt
which frame was consumed
which scene was rendered
which camera request was applied
which HUD request was applied
which pose frame was applied
which renderer string/version consumed the frame
whether legacy host fields stayed stable
```

## Render readback contract

```txt
RenderReadback = {
  frame,
  scene,
  rendererId,
  cameraApplied,
  hudApplied,
  poseApplied,
  terrainChunkCount,
  treePoolCount,
  rockInstanceCount,
  shardInstanceCount,
  physicsEnabled,
  timestampMode
}
```

## Render implementation rule

```txt
record before or after direct mutation
never make the proof layer own Three.js
never require DOM for fixture rows
never replace current visible route in the proof pass
preserve PrehistoricRushHost.getState().renderer
add PrehistoricRushHost.getState().presentation.render
```

## Deferred render work

```txt
renderer extraction
draw-call optimization
new materials
new raptor mesh work
new terrain art
post-processing
camera feel retuning
```
