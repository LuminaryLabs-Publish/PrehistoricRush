# PrehistoricRush Agent Start

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Last aligned:** `2026-07-08T16-40-56-04-00`

## Purpose

This `.agent/` folder is the repo-local operating memory for breakdown work on `PrehistoricRush`. Read this folder before changing implementation code.

## Current selection result

The accessible `LuminaryLabs-Publish` repo list was compared against the central `LuminaryLabs-Dev/LuminaryLabs` ledger. No checked non-excluded repo was fully new, absent from central tracking, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

`PrehistoricRush` was selected as the oldest eligible fallback. The current high-value seam is the source-file manifest plus host presentation projection gate: movement, contacts, scene dispatch, camera, HUD, and dino pose are visible, but not yet projected into fixture-readable host records.

## Current route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> event bus / domain host / tick scheduler
  -> dino form, pose, material domains
  -> camera-domain-kit
  -> hud-domain-kit
  -> PrehistoricRushComposition.snapshot()
  -> runtime-terrain-v6.mjs
  -> Three.js + Rapier terrain runner
  -> presentation pass
  -> PrehistoricRushHost.getState()
```

## Current interaction loop

```txt
page load
  -> composition installs dino, camera, and HUD domain scaffold
  -> visual runner loads menu scene
  -> player starts run
  -> keyboard/button input drives turn, jump, and boost behavior
  -> runtime-terrain-v6.mjs mutates movement, terrain, contacts, pickups, scene state, and baseline renderer frame
  -> src/game.js presentation pass mutates close camera, readable stride, HUD DOM, and renderer frame
  -> host exposes runtime snapshots
```

## Target proof loop

```txt
RunnerSourceState
  -> RunnerMovedEvent
  -> runner.moved
  -> dino.pose.changed
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> PresentationFrameRecord
  -> PresentationJournalSnapshot
  -> RenderReadback
  -> PrehistoricRushHost.getState().presentation
  -> DOM-free fixture cases
```

## First files to read

```txt
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/architecture-audit/2026-07-08T16-40-56-04-00-event-source-fixture-source-file-manifest.md
.agent/render-audit/2026-07-08T16-40-56-04-00-presentation-render-readback-source-manifest.md
.agent/gameplay-audit/2026-07-08T16-40-56-04-00-runner-action-contact-scene-contract.md
.agent/presentation-authority-audit/2026-07-08T16-40-56-04-00-source-file-manifest-and-host-projection.md
.agent/trackers/2026-07-08T16-40-56-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T16-40-56-04-00.md
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
src/domains/dino/index.js
src/domains/dino/dino-pose-domain-kit.js
src/domains/camera/camera-domain-kit.js
src/domains/hud/hud-domain-kit.js
```

## Main rule

Keep the visible runner playable and route-stable.

The next implementation should add pure `src/presentation/*` projection modules and a DOM-free fixture first, then wire them additively into `src/game.js` and `runtime-terrain-v6.mjs` without removing current `PrehistoricRushHost.getState()` compatibility.

## Current next safe ledge

```txt
PrehistoricRush Source File Manifest + Host Presentation Projection Fixture Gate
```
