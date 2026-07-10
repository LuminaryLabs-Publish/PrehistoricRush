# Current Audit: PrehistoricRush

**Updated:** `2026-07-10T01-31-29-04-00`

## Summary

`PrehistoricRush` is playable and has a useful DSK wrapper, but the live runner still bypasses movement event proof.

`src/game.js` installs the repo-local event bus, domain host, scheduler, dino, camera, and HUD kits.

`src/runtime-terrain-v6.mjs` still owns the live runner, terrain, physics bridge, raptor rig, pickups, contacts, scene dispatch, HUD, renderer, and host projection.

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

## Domains in use

```txt
static-browser-shell
runtime-entry
composition-entry
event-bus
domain-host
tick-scheduler
dino-form
dino-pose
dino-material
camera-domain
hud-domain
legacy-visual-runtime
three-cdn-runtime
rapier-cdn-runtime
rapier-physics-domain-kit
menu-scene
game-scene
run-over-scene
win-scene
keyboard-input
runner-motion
runner-turn-yaw
runner-jump-gravity
runner-terrain-stream
runner-spawn-population
runner-contact
runner-pickup
runner-score
best-distance-storage
raptor-render-adapter
presentation-camera-consumer
presentation-hud-consumer
presentation-raptor-stride-consumer
render-submission
host-state-projection
movement-event-readback-next
presentation-journal-next
dom-free-presentation-fixture-next
central-ledger-sync
```

## Important source fact

`dino-pose-domain-kit` already listens for `runner.moved` and emits `dino.pose.changed`.

The live runner does not emit `runner.moved`; it computes and applies raptor animation directly.

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
BestDistanceResult
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
presentation.movementRows
presentation.renderReadback
presentation.fixtureContract
```

## Current ledge

```txt
PrehistoricRush Movement Event Readback Catch-up + Host Presentation Fixture Gate
```
