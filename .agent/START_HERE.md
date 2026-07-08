# PrehistoricRush Agent Start

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Last aligned:** `2026-07-08T06:51:12-04:00`

## Purpose

This `.agent/` folder is the repo-local operating memory for scheduled and manual breakdown work on `PrehistoricRush`.

Read this folder before changing implementation code.

## Selection result

The accessible `LuminaryLabs-Publish` repo list was checked against central tracking in `LuminaryLabs-Dev/LuminaryLabs`.

No new untracked non-excluded publish repo was selected first.

`PrehistoricRush` was selected as the next fallback follow-up because it has active repo-local DSK scaffolding, and the latest source read showed camera/HUD domains now exist but are not yet the live presentation authority.

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
  -> await import("./runtime-terrain-v6.mjs")
  -> presentation pass reads PrehistoricRushHost.app
```

The repo is in a mixed state:

```txt
src/game.js
  -> has cleaner DSK composition scaffolding
  -> installs dino, camera, and HUD domains
  -> still applies a presentation pass directly

src/runtime-terrain-v6.mjs
  -> still owns live runner, renderer, input, contact, scene result, camera baseline, HUD baseline, and raptor visual behavior
```

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
.agent/presentation-authority-audit/camera-hud-descriptor-fixture-matrix.md
.agent/trackers/2026-07-08T06-51-12-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T06-51-12-04-00.md
.agent/kit-registry.json
```

Prior breakdowns:

```txt
.agent/trackers/2026-07-08T05-10-47-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T05-10-47-04-00.md
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
src/domains/camera/camera-domain-kit.js
src/domains/hud/hud-domain-kit.js
game-scenes.json
runner-tuning.json
flock-generation.json
kit-composition.json
kit-cutover-inventory.json
RUNNER_RESEARCH.md
.github/workflows/deploy-pages.yml
```

## Main rule

Do not let `runtime-terrain-v6.mjs`, DOM handlers, renderer state, camera lerp code, HUD DOM strings, or Rapier frame timing become permanent source-of-truth seams for reusable runner behavior.

Extract fixture-readable facts first.

## Current next safe ledge

```txt
PrehistoricRush Presentation Descriptor Fixture Gate
```

The immediate proof chain is:

```txt
runner source state
  -> runner.moved
  -> dino.pose.changed
  -> camera.frame.requested
  -> hud.frame.requested
  -> host presentation snapshot
```

Keep the public route working while wrapping the current behavior in stable descriptors and journals.
