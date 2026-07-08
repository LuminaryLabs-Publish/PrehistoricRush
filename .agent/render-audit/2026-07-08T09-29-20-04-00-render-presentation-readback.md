# PrehistoricRush Render Presentation Readback

**Timestamp:** `2026-07-08T09:29:20-04:00`

## Summary

The visual route is currently playable and should remain stable.

The render authority gap is that the renderer receives direct mutations from the legacy runtime and presentation pass instead of consuming fixture-readable presentation descriptors.

## Current render route

```txt
src/runtime-terrain-v6.mjs
  -> imports Three.js CDN
  -> creates WebGLRenderer
  -> creates scene, camera, lights, sky, terrain chunks, instanced rocks, instanced shards, tree pools, and raptor rig
  -> live loop mutates player transform, camera, HUD, scene state, collision state, pickups, and renderer frame
  -> src/game.js starts an additional presentation pass
  -> presentation pass adjusts readable stride, close camera, HUD DOM, and calls renderer.render(scene, camera)
```

## Render surfaces

```txt
canvas / WebGLRenderer
scene fog and lighting
procedural sky sphere
terrain chunk meshes
instanced tree pools
instanced rock hazards
instanced shard pickups
procedural raptor rig
Three.js camera
HUD DOM panel
start / retry button
PrehistoricRushHost.getState()
PrehistoricRushComposition.snapshot()
```

## Current render-owned behavior

```txt
terrain color and height sampling
terrain chunk rebuild trigger
prop / hazard / pickup scatter placement
raptor visual construction
raptor pose animation
camera follow mutation
HUD innerHTML mutation
renderer.render(scene, camera)
```

## Presentation contract target

The renderer should keep the same visible output while the new data layer records:

```txt
RunnerSourceState
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
PresentationFrameRecord
```

The first implementation should record descriptors beside current mutations, not replace the visual output.

## Render readback requirements

```txt
- The host state must expose whether the current frame came from a presentation descriptor.
- The latest camera frame request must be visible without reading Three.js camera internals.
- The latest HUD frame request must be visible without reading DOM innerHTML.
- The latest dino pose frame must be visible without reading raptor mesh rotations.
- Renderer output should remain visually unchanged during the contract layer addition.
```

## What not to extract yet

```txt
- Do not rebuild terrain streaming.
- Do not replace the raptor rig.
- Do not rewrite the renderer host.
- Do not add post-processing.
- Do not replace the current HUD.
- Do not promote camera/HUD/render kits until descriptor fixtures pass.
```

## Next render-safe ledge

```txt
PresentationFrameRecord readback while preserving the current Three.js/Rapier route.
```
