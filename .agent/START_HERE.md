# PrehistoricRush Agent Start

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Last aligned:** `2026-07-08T08:11:28-04:00`

## Purpose

This `.agent/` folder is the repo-local operating memory for scheduled and manual breakdown work on `PrehistoricRush`.

Read this folder before changing implementation code.

## Selection result

The accessible `LuminaryLabs-Publish` repo list was checked against central tracking in `LuminaryLabs-Dev/LuminaryLabs`.

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, or missing root `.agent/START_HERE.md` state.

`TheUnmappedHouse` has an older visible alignment time, but its own `.agent/START_HERE.md` says the closed central rollup gap should not keep selecting it. `PrehistoricRush` was selected as the oldest eligible fallback follow-up with unresolved runtime/presentation authority work.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

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
  -> PrehistoricRushHost.getState()
```

## First files to read

```txt
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/architecture-audit/domain-service-breakdown.md
.agent/render-audit/render-surface-audit.md
.agent/gameplay-audit/runner-loop-audit.md
.agent/runner-authority-audit/action-result-fixture-gate.md
.agent/presentation-authority-audit/camera-hud-descriptor-fixture-matrix.md
.agent/presentation-authority-audit/presentation-frame-contract-acceptance-ledger.md
.agent/trackers/2026-07-08T08-11-28-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T08-11-28-04-00.md
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

Do not add more visual polish or shared-kit promotion until the current frame can be expressed as stable presentation data.

The current visual route should stay playable while the next implementation adds:

```txt
RunnerSourceState
  -> runner.moved
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
```

## Current next safe ledge

```txt
PrehistoricRush Presentation Frame Contract Acceptance Ledger
```

Preserve the current route, visuals, control feel, `PrehistoricRushComposition.snapshot()`, and `PrehistoricRushHost.getState()` while adding fixture-readable presentation frame contracts.
