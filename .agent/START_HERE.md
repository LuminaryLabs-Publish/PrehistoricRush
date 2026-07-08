# PrehistoricRush Agent Start

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Last aligned:** `2026-07-08T03:01:20-04:00`

## Purpose

This `.agent/` folder is the repo-local operating memory for scheduled and manual breakdown work on `PrehistoricRush`.

Read this folder before changing implementation code.

## Selection reason

`PrehistoricRush` was selected from the full `LuminaryLabs-Publish` repo list because the central `LuminaryLabs-Dev/LuminaryLabs` ledger already referenced `.agent` tracker paths for this repo, but the actual publish repo was missing a root `.agent/START_HERE.md` and root audit docs when checked in this run.

The current selection rule prefers Publish repos that are new, absent from the ledger, missing root `.agent` state, or recently added but undocumented before falling back to oldest eligible repo selection.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

## Current product read

`PrehistoricRush` is a standalone static browser publish repo for a NexusEngine-powered prehistoric infinite runner.

The current route is:

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> local domain runtime + dino domain scaffold
  -> await import("./runtime-terrain-v6.mjs")
```

The repo is in a mixed state: it has a repo-local dino DSK scaffold, but the visible runner still lives mostly in the legacy `runtime-terrain-v6.mjs` visual/runtime file.

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
.agent/trackers/2026-07-08T03-01-20-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T03-01-20-04-00.md
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

Do not let `runtime-terrain-v6.mjs` remain the permanent source of truth for movement, scene transition, contact, camera, and runner result state.

Extract pure command/result and runner-step authority first, then let the renderer and DOM consume those outputs.

## Current next safe ledge

Materialize the `runner.moved` bridge and action/result fixture gate without changing the public route or visible Three.js/Rapier runner.

Keep `index.html -> src/runtime.mjs -> src/game.js -> runtime-terrain-v6.mjs` working while extracting authority behind the scenes.
