# PrehistoricRush Agent Start

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Last aligned:** `2026-07-09T11-46-08-04-00`

## Purpose

This `.agent/` folder is the repo-local operating memory for scheduled and manual breakdown work on `PrehistoricRush`.

Read this folder before changing implementation code.

## Current selection result

The accessible `LuminaryLabs-Publish` repository list was compared against the tracked/documented repo ledger in `LuminaryLabs-Dev/LuminaryLabs` and sampled root `.agent` state.

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

`PrehistoricRush` was selected as the oldest eligible central-ledger fallback. Its central ledger and repo-local docs still pointed at `2026-07-09T09-10-50-04-00`, older than the other checked non-Cavalry repos during this pass.

## Publish repos checked

```txt
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central latest 2026-07-09T10-10-32-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central latest 2026-07-09T11-30-50-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central latest 2026-07-09T09-36-24-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central latest 2026-07-09T10-29-02-04-00
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central-ledger fallback
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central latest 2026-07-09T10-40-00-04-00
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central latest 2026-07-09T09-50-00-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central latest 2026-07-09T11-21-06-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central latest 2026-07-09T11-00-39-04-00
```

## Current product read

`PrehistoricRush` is a standalone static browser infinite runner with a repo-local DSK composition scaffold layered beside a live Three.js/Rapier terrain route.

The game already plays. The next useful work is not new visual content. It is a host-presentation event proof bridge: the live runner should emit fixture-readable movement, dino pose, camera, HUD, contact, scene, render, and host projection records while preserving the current route.

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
.agent/architecture-audit/2026-07-09T11-46-08-04-00-host-presentation-event-ledger-dsk-map.md
.agent/render-audit/2026-07-09T11-46-08-04-00-render-readback-presentation-frame-contract.md
.agent/gameplay-audit/2026-07-09T11-46-08-04-00-runner-moved-dino-pose-loop.md
.agent/presentation-authority-audit/2026-07-09T11-46-08-04-00-host-presentation-snapshot-fixture-contract.md
.agent/deploy-audit/2026-07-09T11-46-08-04-00-dom-free-fixture-command-map.md
.agent/trackers/2026-07-09T11-46-08-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-09T11-46-08-04-00.md
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

## Source files to add next

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

## Main rule

Keep the current static route, visuals, `PrehistoricRushComposition.snapshot()`, `PrehistoricRushHost.getState()` existing fields, camera readability pass, HUD readability pass, and menu/game/run-over/win flow stable.

Do not extract movement, collision, terrain, renderer, or shared ProtoKits until the presentation event bridge fixture proves source state, movement events, dino pose output, camera/HUD descriptors, contacts, scene dispatch, render readback, and host projection.

## Current next safe ledge

```txt
PrehistoricRush Host Presentation Event Ledger + DOM-Free Fixture Gate
```
