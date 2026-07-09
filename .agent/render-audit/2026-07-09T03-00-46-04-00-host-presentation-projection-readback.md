# PrehistoricRush Host Presentation Projection Readback

**Timestamp:** `2026-07-09T03-00-46-04-00`

## Current render surface

`PrehistoricRush` has a visual/render surface.

The live surface is a static browser route that loads Three.js from CDN and appends one WebGL renderer into the DOM shell.

Current render chain:

```txt
index.html
  -> #app
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
  -> shell()
  -> setup(THREE, ui.host)
  -> WebGLRenderer
  -> terrain chunks
  -> raptor group
  -> instanced rocks
  -> instanced shards
  -> tree pools
  -> baseline runtime render
  -> src/game.js presentation render
```

## Render facts

```txt
Three.js URL: https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js
Renderer: THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" })
Scene fog: Fog(0x7c3a42, 90, 390)
Camera: PerspectiveCamera(64, innerWidth / innerHeight, .1, 900)
Sky: back-side sphere
Terrain: grid chunk meshes with vertex color shading
Raptor: procedural group with tail, feet, claws, plates, arms, head, eyes, and outline shells
Props: instanced trees, rocks, and shards
HUD: DOM panel owned by shell() and rewritten by runtime + presentation pass
```

## Current render concern

`src/game.js` applies a second render each animation frame after mutating camera/HUD/raptor presentation state.

That is intentionally preserving visual readability, but it gives no structured proof that the presentation pass consumed the expected source facts.

## Render-readback target

The next pass should create `RenderReadback` without replacing renderer code.

Required readback fields:

```txt
frame
scene
rendererId
rendererPath
cameraPosition
cameraLookTarget
cameraPolicyId
hudPolicyId
raptorPosePolicyId
terrainChunkCount
instancedTreePools
rockInstanceCount
shardInstanceCount
presentationPassApplied
baselineRenderPreserved
secondRenderPreserved
fallbackReasons[]
```

## Host projection target

`PrehistoricRushHost.getState()` should keep its existing fields and add only:

```txt
presentation: {
  latestFrame,
  latestRunnerSourceState,
  latestRunnerStepDelta,
  latestRunnerMovedEvent,
  latestDinoPoseFrame,
  latestCameraFrameRequest,
  latestHudFrameRequest,
  latestContactResultSnapshot,
  latestSceneDispatchResult,
  latestRenderReadback,
  latestPresentationFrameRecord,
  recentFrames,
  fixtureStatus
}
```

## Render preservation rule

Keep these stable while adding readback:

```txt
current canvas route
current raptor scale and pose readability
current close camera behavior
current HUD readability pass
current terrain and scatter look
current menu/game/run-over/win scenes
current PrehistoricRushHost.getState() existing fields
```

## Next render fixture rows

```txt
render_readback_reports_renderer_string_and_camera_policy
render_readback_reports_hud_policy_without_dom_required
render_readback_reports_dino_pose_consumer_path
render_readback_reports_terrain_chunk_count
render_readback_confirms_second_render_preserved
host_presentation_snapshot_contains_latest_render_readback
```

## Do not do next

```txt
Do not rewrite terrain.
Do not replace the renderer.
Do not remove the second render pass until readback proves parity.
Do not move render behavior into shared kits before the repo-local projection fixture passes.
```