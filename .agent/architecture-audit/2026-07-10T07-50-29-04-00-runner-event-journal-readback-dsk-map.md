# Architecture Audit: Runner Event Journal Readback DSK Map

Timestamp: 2026-07-10T07-50-29-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Current DSK shape

```txt
src/runtime.mjs
  -> src/game.js
  -> event bus / domain host / tick scheduler
  -> dino form / pose / material domains
  -> camera / HUD domains
  -> composition.ready
  -> src/runtime-terrain-v6.mjs
  -> live runner monolith
  -> PrehistoricRushHost.getState()
```

## Working architecture

- `event-bus-kit` stores listeners and recent event history.
- `domain-host-kit` installs and snapshots domains.
- `tick-scheduler-kit` can bridge per-frame ticking.
- `dino-pose-domain-kit` consumes `runner.moved` and emits `dino.pose.changed`.
- `camera-domain-kit` and `hud-domain-kit` provide descriptors.

## Broken seam

The live runner does not emit `runner.moved`.

`src/runtime-terrain-v6.mjs` remains the source of movement, jump, contact, pickup, scene, score, best-distance storage, raptor pose, camera, HUD, and render mutation.

## Required DSK boundary

```txt
runtime-terrain-v6 current state
  -> RunnerSourceState
  -> RunnerStepDelta
  -> MovementResultRow
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit
  -> presentation journal
  -> PrehistoricRushHost.getState().presentation
  -> DOM-free runner event fixture
```

## Next safe ledge

```txt
PrehistoricRush Runner Event Journal Readback Catch-up + DOM-Free Presentation Gate
```
