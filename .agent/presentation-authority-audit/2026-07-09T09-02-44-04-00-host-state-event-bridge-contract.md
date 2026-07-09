# Presentation Authority Audit: Host-State Event Bridge Contract

**Timestamp:** `2026-07-09T09-02-44-04-00`

## Current authority split

```txt
runtime-terrain-v6.mjs owns live gameplay mutation.
game.js owns DSK scaffold plus presentation pass.
dino-pose-domain-kit owns a runner.moved consumer, but no live event reaches it yet.
PrehistoricRushHost owns app and legacy getState readback.
```

## Contract to add next

```txt
RunnerSourceState = stable projection from PrehistoricRushHost.app.state
RunnerStepDelta = current source minus previous source
RunnerMovedEvent = event payload emitted to eventBus
DinoPoseFrame = dino-pose-domain-kit output captured after runner.moved
CameraFrameRequest = close-camera target and lookAt intent
HudFrameRequest = HUD rows and progress intent
ContactResultSnapshot = collision/pickup facts for current frame
SceneDispatchResult = scene transition facts for current frame
RenderReadback = renderer/camera/HUD/pose consumption evidence
PresentationFrameRecord = one bundled proof row
PresentationJournalSnapshot = bounded frame history
HostPresentationSnapshot = additive host projection
```

## Required additive host shape

```txt
PrehistoricRushHost.getState() -> {
  scene,
  runner,
  physics,
  terrain,
  renderer,
  presentation: {
    latestFrame,
    journal,
    runnerSource,
    runnerDelta,
    dinoPose,
    cameraRequest,
    hudRequest,
    contact,
    sceneDispatch,
    renderReadback
  }
}
```

## Non-negotiable compatibility rules

```txt
Do not remove scene.
Do not remove runner.
Do not remove physics.
Do not remove terrain.
Do not remove renderer.
Do not require DOM to construct pure presentation records.
Do not require Rapier to construct pure presentation records.
Do not change visible runner behavior while adding proof.
```

## Main handoff

Add `src/presentation/*` as pure modules first. Then splice observation and event emission into `src/game.js` around the existing presentation pass.

## Fixture gate

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

The fixture should prove event shape and readback shape before any runtime extraction begins.
