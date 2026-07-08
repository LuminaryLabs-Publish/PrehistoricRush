# PrehistoricRush Agent Start

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Last aligned:** `2026-07-08T05:10:47-04:00`

## Purpose

This `.agent/` folder is the repo-local operating memory for scheduled and manual breakdown work on `PrehistoricRush`.

Read this folder before changing implementation code.

## Selection result

The full accessible `LuminaryLabs-Publish` repo list was checked against central tracking in `LuminaryLabs-Dev/LuminaryLabs`.

No checked non-excluded Publish repo was fully new, central-ledger absent, or missing root `.agent/START_HERE.md` state.

`PrehistoricRush` was selected as a follow-up target because it has a valid root `.agent` state and repo-local dino domain scaffold, but its live runner authority still sits mostly inside `src/runtime-terrain-v6.mjs`.

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
  -> await import("./runtime-terrain-v6.mjs")
```

The repo is in a mixed state: `src/game.js` is a thin composition scaffold, while `src/runtime-terrain-v6.mjs` still owns most live runner, renderer, input, contact, scene result, camera, and raptor visual behavior.

## First files to read

```txt
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/architecture-audit/domain-service-breakdown.md
.agent/render-audit/runner-render-audit.md
.agent/gameplay-audit/runner-loop-audit.md
.agent/dino-domain-audit/dino-scaffold-bridge.md
.agent/runner-authority-audit/action-result-fixture-gate.md
.agent/trackers/2026-07-08T05-10-47-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T05-10-47-04-00.md
.agent/kit-registry.json
```

Prior breakdowns:

```txt
.agent/trackers/2026-07-08T03-01-20-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T03-01-20-04-00.md
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
src/domains/dino/dino-form-domain-kit.js
src/domains/dino/dino-pose-domain-kit.js
src/domains/dino/dino-material-domain-kit.js
game-scenes.json
runner-tuning.json
flock-generation.json
kit-composition.json
kit-cutover-inventory.json
RUNNER_RESEARCH.md
.github/workflows/deploy-pages.yml
```

## Main rule

Do not let `runtime-terrain-v6.mjs`, DOM handlers, renderer state, or Rapier frame timing become permanent source-of-truth seams for reusable runner behavior.

Extract pure action/result, runner-step, contact-result, scene-dispatch, and dino-bridge facts first.

## Current next safe ledge

```txt
PrehistoricRush Runner Action/Result Authority + Dino Pose Bridge Fixture Gate
```

Keep the public route working while wrapping current behavior in fixture-readable records.
