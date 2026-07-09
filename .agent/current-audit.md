# Current Audit: PrehistoricRush

**Updated:** `2026-07-09T19-29-23-04-00`

## Summary

`PrehistoricRush` is playable, visually coherent, and already wrapped by a useful DSK scaffold. The live runner is still controlled by `src/runtime-terrain-v6.mjs`, while `src/game.js` installs local domain kits and applies a secondary presentation pass.

## Current route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
```

## Current interaction loop

```txt
src/game.js
  -> create event bus, domain host, and tick scheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import runtime-terrain-v6
  -> start secondary presentation pass

runtime-terrain-v6
  -> load Three.js / Rapier / rapier-physics-domain-kit
  -> create shell and Start button
  -> create terrain chunks, raptor rig, rocks, trees, shards, camera, renderer
  -> mutate input flags on keydown/keyup
  -> mutate runner state, terrain, colliders, pickups, score, scene, HUD, and renderer per frame
  -> expose PrehistoricRushHost.getState()
```

## Important source fact

`dino-pose-domain-kit` already listens for `runner.moved` and emits `dino.pose.changed`. The live runner does not emit `runner.moved`; it computes and applies raptor animation directly.

## Main gap

The route needs presentation proof, not visual expansion.

Missing proof layer:

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
ContactResultSnapshot
SceneDispatchResult
RenderReadback
PresentationFrameRecord
PresentationJournalSnapshot
HostPresentationSnapshot
```

## Current host readback

`PrehistoricRushHost.getState()` exposes:

```txt
scene
runner
physics
terrain.chunks
renderer
```

It does not expose:

```txt
presentation.latestFrame
presentation.recentFrames
presentation.eventCounts
presentation.fixtureContract
```

## Latest audits

```txt
.agent/trackers/2026-07-09T19-29-23-04-00/project-breakdown.md
.agent/architecture-audit/2026-07-09T19-29-23-04-00-presentation-host-fixture-refresh-dsk-map.md
.agent/render-audit/2026-07-09T19-29-23-04-00-render-readback-presentation-frame.md
.agent/gameplay-audit/2026-07-09T19-29-23-04-00-runner-moved-event-bridge-loop.md
.agent/presentation-authority-audit/2026-07-09T19-29-23-04-00-host-presentation-fixture-contract.md
.agent/deploy-audit/2026-07-09T19-29-23-04-00-dom-free-presentation-fixture-gate.md
```

## Recommendation

Implement the presentation event bridge and DOM-free fixture before touching movement feel, terrain generation, visual fidelity, renderer extraction, or shared ProtoKit promotion.
