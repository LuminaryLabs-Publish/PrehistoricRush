# Presentation Authority Audit: Host Presentation Event Fixture Contract

**Timestamp:** `2026-07-09T15-20-00-04-00`

## Authority seam

The current authority seam is between:

```txt
src/runtime-terrain-v6.mjs
  owns live runner state, physics, terrain, contacts, pickups, scene, baseline camera/HUD/render

src/game.js
  owns DSK scaffold, presentation pass, close camera, readable stride, HUD rewrite, second render
```

The next implementation must make that seam observable without moving ownership too early.

## Required additive host state

```txt
PrehistoricRushHost.getState() -> {
  scene,
  runner,
  physics,
  terrain,
  renderer,
  presentation: {
    version,
    frame,
    latestRunnerSourceState,
    latestRunnerStepDelta,
    latestRunnerMovedEvent,
    latestDinoPoseFrame,
    latestCameraFrameRequest,
    latestHudFrameRequest,
    latestContactResultSnapshot,
    latestSceneDispatchResult,
    latestRenderReadback,
    journalSummary
  }
}
```

Existing top-level fields must remain compatible.

## Fixture contract

The fixture should run without:

```txt
DOM
WebGL
Three.js
Rapier
GitHub Pages
browser requestAnimationFrame
```

It should import pure presentation modules and prove serializable records using deterministic input rows.

## Pure module boundary

```txt
src/presentation/presentation-events.js
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
```

## Consumer splice rule

Wire the presentation pass additively:

```txt
read legacy app.state
derive RunnerSourceState
compare to previous RunnerSourceState
create RunnerMovedEvent
emit runner.moved through existing eventBus
record pose/camera/HUD/contact/scene/render facts
append bounded journal row
extend PrehistoricRushHost.getState().presentation
continue existing visual mutations
```

## Main finding

`dino-pose-domain-kit` already has the right consumer shape. The missing piece is the live source event bridge.

The next implementation should make the current runtime legible before extracting any behavior out of it.
