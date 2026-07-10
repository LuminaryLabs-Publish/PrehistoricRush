# Presentation Authority Audit: Presentation Journal Host Contract

**Timestamp:** `2026-07-10T09-18-53-04-00`

## Current authority split

```txt
src/runtime-terrain-v6.mjs
  owns live runner state, raptor pose, camera, HUD, render, host state

src/game.js
  owns DSK composition wrapper and secondary presentation pass

PrehistoricRushHost.getState()
  exposes scene, runner, physics, terrain chunk count, renderer label
  does not expose presentation proof
```

## Problem

The repo has presentation domains and a host entrypoint, but no additive journal proving what the presentation consumed or rendered.

`PrehistoricRushHost.getState()` should stay backwards-compatible while gaining a JSON-safe presentation block.

## Proposed host contract

```txt
PrehistoricRushHost.getState().presentation = {
  latestFrame,
  recentFrames,
  eventCounts,
  latestInputResult,
  latestMovementResult,
  latestRunnerMovedEvent,
  latestPoseFrame,
  latestCameraFrame,
  latestHudFrame,
  latestRenderReadback,
  fixtureContract
}
```

## Required source modules

```txt
presentation-events.js
runner-source-state.js
runner-step-delta.js
runner-moved-event.js
input-result-row.js
movement-result-row.js
dino-pose-frame.js
camera-frame-request.js
hud-frame-request.js
render-readback.js
presentation-frame-record.js
presentation-journal.js
host-presentation-snapshot.js
```

## Acceptance rule

The next pass should prove the bridge without changing game feel.
