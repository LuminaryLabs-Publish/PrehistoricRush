# PrehistoricRush Agent Start

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Last aligned:** `2026-07-08T10:39:22-04:00`

## Purpose

This `.agent/` folder is the repo-local operating memory for scheduled and manual breakdown work on `PrehistoricRush`.

Read this folder before changing implementation code.

## Selection result

The accessible `LuminaryLabs-Publish` repo list was checked against central tracking in `LuminaryLabs-Dev/LuminaryLabs`.

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, or missing sampled root `.agent/START_HERE.md` state.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

`PrehistoricRush` was selected as the fallback follow-up because its prior pass established a presentation source wire map, but the live runner still does not emit fixture-readable `runner.moved`, `dino.pose.changed`, `camera.frame.requested`, or `hud.frame.requested` events from the actual route.

## Current product read

`PrehistoricRush` is a standalone static browser repo for a NexusEngine-powered prehistoric infinite runner.

The current route is:

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> repo-local event bus / domain host / tick scheduler
  -> dino form, pose, and material domains
  -> camera-domain-kit
  -> hud-domain-kit
  -> PrehistoricRushComposition.snapshot()
  -> runtime-terrain-v6.mjs
  -> Three.js + Rapier terrain runner
  -> src/game.js presentation pass
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
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit update
  -> eventBus.emit("dino.pose.changed")
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
  -> DOM-free fixture cases
```

## First files to read

```txt
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/architecture-audit/domain-service-breakdown.md
.agent/architecture-audit/2026-07-08T10-39-22-04-00-dsk-domain-breakdown.md
.agent/render-audit/render-surface-audit.md
.agent/render-audit/2026-07-08T10-39-22-04-00-render-event-readback.md
.agent/gameplay-audit/runner-loop-audit.md
.agent/runner-authority-audit/action-result-fixture-gate.md
.agent/presentation-authority-audit/camera-hud-descriptor-fixture-matrix.md
.agent/presentation-authority-audit/presentation-frame-contract-acceptance-ledger.md
.agent/presentation-authority-audit/2026-07-08T10-39-22-04-00-event-bridge-fixture-readiness.md
.agent/trackers/2026-07-08T10-39-22-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T10-39-22-04-00.md
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
runner-tuning.json
game-scenes.json
kit-composition.json
kit-cutover-inventory.json
```

## Main rule

Do not add more visual polish or shared-kit promotion until the current route can expose stable presentation and runner event records.

The next runtime change should add an additive event bridge and journal:

```txt
source runner state
  -> runner.moved event
  -> dino pose descriptor
  -> camera frame request
  -> HUD frame request
  -> presentation frame journal
  -> host presentation snapshot
```

## Current next safe ledge

```txt
PrehistoricRush Runner Event Bridge + Presentation Frame Fixture Gate
```

Preserve the current route, visuals, control feel, `PrehistoricRushComposition.snapshot()`, and `PrehistoricRushHost.getState()` while adding fixture-readable event bridge records beside the existing direct renderer mutations.
