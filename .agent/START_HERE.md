# START HERE: PrehistoricRush

**Last aligned:** `2026-07-10T16-28-47-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Current ledge

```txt
PrehistoricRush Single Frame Authority + Restart Transaction Fixture Gate
```

## Read first

```txt
.agent/trackers/2026-07-10T16-28-47-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-10T16-28-47-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-10T16-28-47-04-00-runtime-frame-authority-dsk-map.md
.agent/render-audit/2026-07-10T16-28-47-04-00-dual-raf-render-authority-gap.md
.agent/gameplay-audit/2026-07-10T16-28-47-04-00-restart-scene-lifecycle-loop.md
.agent/interaction-audit/2026-07-10T16-28-47-04-00-input-scene-command-authority-map.md
.agent/frame-authority-audit/2026-07-10T16-28-47-04-00-scheduler-live-loop-presentation-pass-contract.md
.agent/source-contract-audit/2026-07-10T16-28-47-04-00-manifest-readme-runtime-drift.md
.agent/deploy-audit/2026-07-10T16-28-47-04-00-single-frame-restart-fixture-gate.md
```

## What this repo is

`PrehistoricRush` is a static browser infinite runner with a repo-local DSK composition layer wrapped around a live Three.js/Rapier terrain runner.

The route is playable, but runtime authority is split across two independent animation loops while the repo-local scheduler remains dormant.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
     -> create event bus, domain host, and tick scheduler
     -> install dino form, pose, material, camera, and HUD kits
     -> scheduler is created but never started
     -> emit composition.ready
     -> import src/runtime-terrain-v6.mjs
  -> runtime-terrain-v6
     -> load Three.js, Rapier, and rapier-physics-domain-kit
     -> create menu shell, terrain, runner, pickups, obstacles, camera, renderer
     -> keyboard/button input mutates app.input or app.scene directly
     -> primary requestAnimationFrame mutates gameplay, presentation, HUD, and renderer
     -> expose PrehistoricRushHost with live mutable app/state references
  -> src/game.js starts a second requestAnimationFrame
     -> directly rewrites raptor stride, camera, HUD, and renderer
```

## Main finding

The next blocker is not visual fidelity. It is frame and lifecycle authority.

```txt
tick scheduler exists but never runs
primary runtime loop owns simulation and first render
secondary presentation loop owns overlapping pose/camera/HUD and second render
no shared source frame or render commit
Retry / Run Again only changes scene back to game
runner state is not reset, so terminal conditions immediately re-trigger
README and scene manifests describe a manifest-driven lifecycle that the live runtime does not consume
```

## Next safe work

Create a single source frame transaction and a restart transaction before changing game feel:

```txt
src/runtime/frame-authority.js
src/runtime/frame-transaction.js
src/runtime/render-commit.js
src/runtime/scene-transition-result.js
src/runtime/restart-transaction.js
src/runtime/runtime-source-manifest.js
src/runtime/host-snapshot.js
scripts/prehistoric-rush-frame-authority-fixture.mjs
```

The migration should preserve current visuals and controls while proving one simulation step, one presentation projection, one render commit, and a real state reset for Retry / Run Again.

## Current validation state

Documentation only. Runtime source did not change. No branch or pull request was created. No package, browser, or DOM-free fixture validation was run because the single-frame authority fixture does not exist yet.
