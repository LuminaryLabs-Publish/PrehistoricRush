# Current Audit: PrehistoricRush

**Updated:** `2026-07-09T23-58-41-04-00`

## Summary

`PrehistoricRush` is playable and has a useful DSK wrapper, but the live runner still bypasses event proof.

`src/game.js` installs the repo-local event bus, domain host, scheduler, dino, camera, and HUD kits. `src/runtime-terrain-v6.mjs` still owns the live runner, terrain, physics bridge, raptor rig, pickups, contacts, scene dispatch, HUD, and renderer.

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

The route needs movement event proof, not visual expansion.

Missing proof layer:

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
MovementResultRow
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
ContactResultSnapshot
PickupResultSnapshot
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
presentation.runnerMovedEvents
presentation.fixtureContract
```

## Latest audits

```txt
.agent/trackers/2026-07-09T23-58-41-04-00/project-breakdown.md
.agent/architecture-audit/2026-07-09T23-58-41-04-00-movement-event-journal-dsk-map.md
.agent/render-audit/2026-07-09T23-58-41-04-00-presentation-render-readback-gap.md
.agent/gameplay-audit/2026-07-09T23-58-41-04-00-runner-movement-result-loop.md
.agent/presentation-authority-audit/2026-07-09T23-58-41-04-00-event-journal-host-contract.md
.agent/deploy-audit/2026-07-09T23-58-41-04-00-dom-free-movement-fixture-gate.md
```

## Recommendation

Implement the movement event journal and DOM-free presentation fixture before touching movement feel, terrain generation, visual fidelity, renderer extraction, or shared ProtoKit promotion.
