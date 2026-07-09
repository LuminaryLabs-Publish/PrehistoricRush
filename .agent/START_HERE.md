# PrehistoricRush Agent Start

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Last aligned:** `2026-07-09T15-31-40-04-00`

## Purpose

This `.agent/` folder is the repo-local operating memory for scheduled and manual breakdown work on `PrehistoricRush`.

Read this folder before changing implementation code.

## Current selection result

The accessible `LuminaryLabs-Publish` repository list was compared against the tracked/documented repo ledger in `LuminaryLabs-Dev/LuminaryLabs` and sampled root `.agent` state.

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

`PrehistoricRush` was selected as the oldest eligible central-ledger fallback and repo-local pointer repair target. Its central ledger still pointed at `2026-07-09T12-00-36-04-00`, while the repo-local root docs had a partial `2026-07-09T15-20-00-04-00` pointer set that referenced missing timestamped tracker/audit files. This pass normalizes the repo-local `.agent` folder to a complete `2026-07-09T15-31-40-04-00` audit set and syncs the central ledger.

## Publish repos checked

```txt
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central latest 2026-07-09T12-08-46-04-00
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central latest 2026-07-09T12-30-09-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central latest 2026-07-09T14-16-00-04-00
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central latest 2026-07-09T13-18-48-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central latest 2026-07-09T13-38-15-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central latest 2026-07-09T14-28-45-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central latest 2026-07-09T15-09-09-04-00
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central latest 2026-07-09T13-00-37-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central-ledger fallback / central latest 2026-07-09T12-00-36-04-00 / repo-local partial pointer 2026-07-09T15-20-00-04-00 repaired
```

## Current product read

`PrehistoricRush` is a standalone static browser infinite runner with a repo-local DSK composition scaffold layered beside a live Three.js/Rapier terrain route.

The game already plays. The next useful work is not new visual content. It is a presentation event bridge and host readback gate: the live runner should emit fixture-readable movement, dino pose, camera, HUD, contact, scene, render, and host projection records while preserving the current route.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost({ eventBus })
  -> createTickScheduler({ host, eventBus })
  -> install dino form, pose, material, camera, and HUD domain kits
  -> expose globalThis.PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> create DOM shell, Three.js scene, camera, renderer, terrain, raptor, rocks, trees, shards, and Rapier bridge
  -> wait in menu scene until Start / Enter / Space
  -> keyboard input mutates live runner state
  -> movement, yaw, speed, jump, terrain height, chunks, colliders, pickups, scene, and score mutate inline
  -> runtime-terrain-v6 baseline camera/HUD/raptor/render pass runs
  -> src/game.js presentation pass applies close camera, readable stride, HUD rewrite, and second render
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
```

## Target proof loop

```txt
PrehistoricRushHost.app.state + previous frame snapshot
  -> RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit consumes runner.moved
  -> eventBus emits dino.pose.changed
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> RenderReadback
  -> PresentationFrameRecord
  -> PresentationJournalSnapshot
  -> PrehistoricRushHost.getState().presentation
  -> scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## First files to read

```txt
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/architecture-audit/2026-07-09T15-31-40-04-00-presentation-event-bridge-ledger-repair-dsk-map.md
.agent/render-audit/2026-07-09T15-31-40-04-00-render-readback-host-consumption-map.md
.agent/gameplay-audit/2026-07-09T15-31-40-04-00-runner-event-bridge-loop.md
.agent/presentation-authority-audit/2026-07-09T15-31-40-04-00-host-presentation-event-fixture-contract.md
.agent/deploy-audit/2026-07-09T15-31-40-04-00-dom-free-fixture-central-sync-map.md
.agent/trackers/2026-07-09T15-31-40-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-09T15-31-40-04-00.md
.agent/kit-registry.json
```

## Source files to inspect next

```txt
README.md
index.html
src/runtime.mjs
src/game.js
src/runtime-terrain-v6.mjs
src/domain-runtime/event-bus.js
src/domain-runtime/domain-host.js
src/domain-runtime/tick-scheduler.js
src/domains/dino/dino-pose-domain-kit.js
src/domains/camera/camera-domain-kit.js
src/domains/hud/hud-domain-kit.js
```
