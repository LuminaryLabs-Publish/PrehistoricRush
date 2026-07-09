# Render Audit: Render Readback Host Consumption Map

**Timestamp:** `2026-07-09T15-20-00-04-00`

## Current render surface

`src/runtime-terrain-v6.mjs` creates the live Three.js scene, camera, WebGL renderer, sky, terrain chunks, procedural raptor, rocks, shard instances, and five tree pools.

The baseline loop renders once through `v.renderer.render(v.scene, v.camera)`. `src/game.js` then runs a presentation pass that mutates camera, raptor rig, HUD DOM, and renders a second time.

## Current render loop

```txt
setup(THREE, host)
  -> scene
  -> fog
  -> perspective camera
  -> WebGLRenderer
  -> terrain chunks
  -> procedural raptor
  -> rocks InstancedMesh
  -> shards InstancedMesh
  -> five tree InstancedMesh pools
  -> resize handler

loop(now)
  -> move runner
  -> update terrain/population
  -> set raptor transform
  -> animateRaptor()
  -> baseline camera position/lookAt
  -> baseline HUD innerHTML
  -> renderer.render(scene, camera)

startPresentationPass()
  -> applyReadableStride()
  -> applyCloseCamera()
  -> renderHud()
  -> renderer.render(scene, camera)
```

## Missing render proof

```txt
No RenderReadback record exists.
No CameraFrameRequest record exists.
No HudFrameRequest record exists.
No DinoPoseFrame record exists.
No presentation frame sequence number exists.
No explicit baseline-render vs presentation-render consumption split exists.
No host field proves the second render preserved the expected legacy state.
No fixture can check render consumption without DOM/WebGL.
```

## Required next render readback

```txt
RenderReadback {
  frame,
  scene,
  rendererId,
  baselineRenderer: "three-terrain-v6-raptor",
  presentationPassApplied,
  cameraRequestId,
  hudRequestId,
  dinoPoseFrameId,
  terrainChunkCount,
  treePoolCount,
  rockInstanceCount,
  shardInstanceCount,
  legacyHostFieldsStable
}
```

## Fixture acceptance

```txt
menu_idle produces render readback without requiring WebGL.
game_first_movement_frame produces render readback with movement delta.
turn_left and turn_right preserve camera request shape.
boost preserves speed and HUD request shape.
jump_start and jump_recover preserve dino pose frame shape.
collision_run_over preserves scene dispatch result and render readback.
win_threshold preserves scene dispatch result and render readback.
host_legacy_fields_unchanged proves additive presentation snapshot only.
```

## Render decision

Do not remove the second render pass yet.

First, record it. Then use fixture evidence to decide whether the baseline render, presentation render, or both should remain.
