# Presentation Authority Audit: Host Presentation Snapshot Readback Contract

**Timestamp:** `2026-07-09T12-00-36-04-00`

## Problem

The live route already has a presentation pass, but it is not auditable.

`src/game.js` reads `PrehistoricRushHost.app`, mutates the raptor rig, mutates the camera, rewrites HUD HTML, and renders another frame. None of those operations leave stable source records that can be replayed or fixture-checked.

## Required additive host shape

Keep existing host fields stable:

```js
PrehistoricRushHost.getState() -> {
  scene,
  runner,
  physics,
  terrain,
  renderer
}
```

Add only:

```js
PrehistoricRushHost.getState().presentation -> {
  version,
  latestFrame,
  journal,
  runnerSource,
  runnerDelta,
  runnerMoved,
  dinoPose,
  cameraRequest,
  hudRequest,
  contact,
  sceneDispatch,
  renderReadback
}
```

## Presentation record boundaries

```txt
RunnerSourceState
  stable app.state projection

RunnerStepDelta
  previous/current comparison

RunnerMovedEvent
  eventBus payload for dino-pose-domain-kit

DinoPoseFrame
  pose output from dino-pose-domain-kit after runner.moved

CameraFrameRequest
  close-camera target and look-at inputs before direct camera mutation

HudFrameRequest
  HUD projection inputs before DOM rewrite

ContactResultSnapshot
  collision/pickup facts observed from app.state/app.physics

SceneDispatchResult
  menu/game/run-over/win transition facts

RenderReadback
  renderer/camera/scene consumption proof

PresentationFrameRecord
  complete frame bundle

PresentationJournalSnapshot
  bounded recent frame list
```

## Contract rules

```txt
1. Additive only.
2. Do not remove or rename existing PrehistoricRushHost.getState fields.
3. Do not change visual behavior while adding readback.
4. Do not own movement, terrain, physics, or renderer behavior from the presentation layer.
5. Use existing eventBus for runner.moved and dino.pose.changed proof.
6. Keep records serializable.
7. Keep journal bounded.
8. Fixture must run without DOM/WebGL.
```

## Next source files

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Why this precedes extraction

Without this proof layer, extracting movement, collision, terrain, render, or ProtoKits would only move the current uncertainty into new files. The first cut must make live state and presentation consumption explicit.
