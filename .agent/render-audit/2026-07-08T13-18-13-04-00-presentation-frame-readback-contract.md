# PrehistoricRush Presentation Frame Readback Contract

**Timestamp:** `2026-07-08T13:18:13-04:00`

## Render surface identified

`PrehistoricRush` has a visual/render surface.

The live route uses:

```txt
Three.js CDN module
Rapier compat CDN module
external rapier-physics-domain-kit
runtime-terrain-v6.mjs renderer setup
procedural raptor visual rig
procedural terrain chunks
instanced trees / rocks / shards
HUD DOM panel
src/game.js presentation pass
```

## Current render loop

```txt
runtime-terrain-v6.mjs
  -> setup Three.js scene/camera/renderer
  -> create terrain chunks
  -> create procedural raptor
  -> create instanced trees, rocks, and shards
  -> update runner state
  -> animate raptor
  -> mutate baseline camera
  -> write baseline HUD DOM
  -> render scene

src/game.js presentation pass
  -> read PrehistoricRushHost.app
  -> style HUD
  -> apply readable stride directly to rig
  -> apply close camera directly to Three.js camera
  -> render HUD DOM
  -> render scene again
```

## Current readback gap

The presentation pass changes visible output, but there is no stable readback object proving what was requested, applied, skipped, or superseded.

Missing fields:

```txt
presentation.latest.runnerSource
presentation.latest.runnerMoved
presentation.latest.dinoPoseFrame
presentation.latest.cameraFrameRequest
presentation.latest.hudFrameRequest
presentation.latest.contactResult
presentation.latest.sceneDispatchResult
presentation.latest.renderReason
presentation.recent[]
presentation.fallbacks[]
presentation.fixtureVersion
```

## Camera descriptor seam

`camera-domain-kit` owns the close-camera descriptor:

```txt
version: close-third-person-v1
distance: 7.2
height: 3.0
lookAhead: 10.5
lookHeight: 1.25
followSharpness: 8.5
turnLead: 1.2
```

But `applyCloseCamera()` still mutates the camera directly from `app.state`.

## HUD descriptor seam

`hud-domain-kit` owns the readability HUD descriptor:

```txt
version: readability-hud-v1
targetDistance: 3600
layout: title-progress-metrics-debug
showDebugLine: true
```

But `renderHud()` still writes `innerHTML` directly from `app.state` and physics snapshot.

## Dino pose seam

`dino-pose-domain-kit` can convert runner movement payloads into dino pose descriptors.

But the live runtime does not emit `runner.moved`, and `applyReadableStride()` still mutates the Three.js rig directly.

## Readback contract target

```txt
RunnerSourceState
  -> RunnerMovedEvent
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> PresentationFrameRecord
  -> PresentationJournalSnapshot
  -> PrehistoricRushHost.getState().presentation
```

## Renderer safety rule

Do not remove the existing renderer mutations during the proof pass.

The first implementation must record readback beside current behavior and prove that visible output remains unchanged.
