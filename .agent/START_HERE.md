# PrehistoricRush Agent Start

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Last aligned:** `2026-07-08T19-30-31-04-00`

## Purpose

This `.agent/` folder is the repo-local operating memory for scheduled and manual breakdown work on `PrehistoricRush`.

Read this folder before changing implementation code.

## Current selection result

The full accessible `LuminaryLabs-Publish` repository list was compared against tracked repo-ledger state in `LuminaryLabs-Dev/LuminaryLabs` and sampled root `.agent/START_HERE.md` state.

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

`PrehistoricRush` was selected as the oldest eligible fallback after the current sampled alignments were compared. Its previous root `.agent` alignment was `2026-07-08T16-51-11-04-00`, older than the other sampled non-excluded repos, and the unresolved seam remains presentation authority: the game already plays, but source-state, movement, contact, scene, camera, HUD, render, and host presentation records are not yet proven through fixture rows.

## Publish repos checked

```txt
LuminaryLabs-Publish/HorrorCorridor      tracked / root .agent present / sampled alignment 2026-07-08T18-19-43-04-00
LuminaryLabs-Publish/AetherVale          tracked / root .agent present / sampled alignment 2026-07-08T18-58-10-04-00
LuminaryLabs-Publish/TheOpenAbove        tracked / root .agent present / sampled alignment 2026-07-08T17-31-22-04-00
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/PhantomCommand      tracked / root .agent present / sampled alignment 2026-07-08T18-41-41-04-00
LuminaryLabs-Publish/PrehistoricRush     selected / oldest eligible fallback / previous alignment 2026-07-08T16-51-11-04-00
LuminaryLabs-Publish/ZombieOrchard       tracked / root .agent present / sampled alignment 2026-07-08T19-21-15-04-00
LuminaryLabs-Publish/IntoTheMeadow       tracked / root .agent present / sampled alignment 2026-07-08T18-09-21-04-00
LuminaryLabs-Publish/MyCozyIsland        tracked / root .agent present / sampled alignment 2026-07-08T17-09-48-04-00
LuminaryLabs-Publish/TheUnmappedHouse    tracked / root .agent present / sampled alignment 2026-07-08T18-51-55-04-00
```

## Current product read

`PrehistoricRush` is a standalone static browser infinite-runner shell with a repo-local DSK composition scaffold layered beside a live Three.js/Rapier terrain route.

The current route is:

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> event bus / domain host / tick scheduler
  -> dino form, pose, and material domains
  -> camera-domain-kit
  -> hud-domain-kit
  -> PrehistoricRushComposition.snapshot()
  -> src/runtime-terrain-v6.mjs
  -> Three.js + Rapier + rapier-physics-domain-kit CDN imports
  -> terrain runner loop
  -> src/game.js presentation pass
  -> PrehistoricRushHost.getState()
```

## Current interaction loop

```txt
page load
  -> runtime entry imports game composition
  -> composition installs dino, camera, and HUD domain scaffold
  -> legacy visual terrain runner loads
  -> menu scene waits for start input
  -> game scene mutates runner state from keyboard/button input
  -> terrain chunks, props, hazards, pickups, and physics state update
  -> inline collision/contact checks decide run-over, pickup, or win
  -> presentation pass directly applies readable stride, close camera, HUD DOM, and renderer frame
  -> host exposes runtime snapshots
```

## Target proof loop

```txt
runner app state
  -> RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> eventBus runner.moved
  -> dino-pose-domain-kit
  -> dino.pose.changed
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> RenderReadback
  -> PresentationFrameRecord
  -> PresentationJournalSnapshot
  -> PrehistoricRushHost.getState().presentation
  -> DOM-free presentation fixture rows
```

## First files to read

```txt
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/architecture-audit/2026-07-08T19-30-31-04-00-presentation-authority-consumer-dsk-map.md
.agent/render-audit/2026-07-08T19-30-31-04-00-render-readback-consumer-fixture-map.md
.agent/gameplay-audit/2026-07-08T19-30-31-04-00-runner-step-contact-scene-loop.md
.agent/presentation-authority-audit/2026-07-08T19-30-31-04-00-consumer-fixture-acceptance-map.md
.agent/deploy-audit/2026-07-08T19-30-31-04-00-static-fixture-validation-without-package-json.md
.agent/trackers/2026-07-08T19-30-31-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T19-30-31-04-00.md
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

Keep the current static route, current visuals, `PrehistoricRushComposition.snapshot()`, `PrehistoricRushHost.getState()` existing fields, camera readability pass, HUD readability pass, and menu/game/run-over/win flow stable.

Do not extract movement, collision, terrain, renderer, or shared ProtoKits until the presentation authority fixture proves source state, movement events, dino pose output, camera/HUD descriptors, contacts, scene dispatch, render readback, and host projection.

## Current next safe ledge

```txt
PrehistoricRush Presentation Authority Consumer Fixture Gate
```
