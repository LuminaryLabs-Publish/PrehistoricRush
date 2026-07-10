# Presentation Authority Audit — Event Journal Host Contract

**Timestamp:** `2026-07-09T23-58-41-04-00`

## Current presentation authority

`src/game.js` owns a secondary presentation pass:

```txt
styleHud(app.ui)
applyReadableStride(app)
applyCloseCamera(app, app.THREE, dt)
renderHud(app)
app.view.renderer.render(app.view.scene, app.view.camera)
```

This improves readability but does not expose source-owned records.

## Current host readback

```txt
PrehistoricRushHost.getState()
  -> scene
  -> runner
  -> physics
  -> terrain.chunks
  -> renderer string
```

## Missing host contract

```txt
presentation.latestFrame
presentation.recentFrames
presentation.eventCounts
presentation.runnerMovedEvents
presentation.dinoPoseFrames
presentation.cameraFrameRequests
presentation.hudFrameRequests
presentation.renderReadback
presentation.fixtureContract
```

## Required compatibility rule

Add `PrehistoricRushHost.getState().presentation` additively.

Do not change the existing shape of:

```txt
scene
runner
physics
terrain
renderer
```

## Recommended journal contract

```txt
{
  latestFrame: PresentationFrameRecord,
  recentFrames: PresentationFrameRecord[],
  eventCounts: Record<string, number>,
  fixtureContract: {
    id: "prehistoric-rush-presentation-fixture-v1",
    rows: string[],
    legacyHostShapePreserved: true
  }
}
```

## Main finding

The presentation pass should become a fixture-readable consumer of movement, pose, camera, HUD, and render records before any visual or camera retune.
