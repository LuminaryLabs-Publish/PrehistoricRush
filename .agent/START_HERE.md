# START HERE: PrehistoricRush

**Last aligned:** `2026-07-10T18-01-03-04-00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Current ledge

```txt
PrehistoricRush Runtime Dependency Admission + Single-Owner Session Lifecycle Fixture Gate
```

## Selection

The complete accessible `LuminaryLabs-Publish` installation contains ten repositories. All nine eligible non-Cavalry repositories are tracked and have root `.agent` state. `TheCavalryOfRome` remains excluded. `PrehistoricRush` was selected as the oldest eligible central-ledger entry at `2026-07-10T16-28-47-04-00`.

## Read first

```txt
.agent/trackers/2026-07-10T18-01-03-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-10T18-01-03-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-10T18-01-03-04-00-runtime-admission-lifecycle-dsk-map.md
.agent/render-audit/2026-07-10T18-01-03-04-00-render-resource-lifetime-observation-gap.md
.agent/gameplay-audit/2026-07-10T18-01-03-04-00-session-start-retry-run-again-transaction-loop.md
.agent/interaction-audit/2026-07-10T18-01-03-04-00-input-listener-command-lifetime-map.md
.agent/external-kit-audit/2026-07-10T18-01-03-04-00-cdn-module-admission-provenance-contract.md
.agent/lifecycle-audit/2026-07-10T18-01-03-04-00-mount-dispose-remount-ownership-contract.md
.agent/deploy-audit/2026-07-10T18-01-03-04-00-runtime-admission-lifecycle-fixture-gate.md
```

## What this repo is

`PrehistoricRush` is a static browser infinite runner with a repo-local DSK composition layer around a live Three.js/Rapier terrain runner. It provides free-yaw raptor movement, jump and boost input, deterministic terrain placement, instanced obstacles and pickups, best-distance persistence, and a GitHub Pages route.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
     -> event bus / domain host / dormant tick scheduler
     -> install dino form, pose, material, camera, and HUD kits
     -> import live runtime
  -> runtime-terrain-v6 loads Three.js, Rapier, and physics ProtoKit from CDNs
     -> import errors are converted to null
     -> Three.js is still required immediately by setup
     -> Rapier or ProtoKit failure silently degrades to fallback contact logic
  -> shell, terrain, raptor, input listeners, physics, renderer, and host are created
  -> Start changes scene to game
  -> primary RAF mutates simulation, scene, presentation, HUD, and render
  -> secondary RAF rewrites pose, camera, HUD, and render
  -> Retry / Run Again only change scene to game
  -> mutable PrehistoricRushHost readback
```

## Main finding

The existing single-frame and restart gap is now joined by a runtime admission and lifetime gap:

```txt
Three.js and Rapier are semver-pinned CDN modules
rapier-physics-domain-kit is loaded from legacy NexusRealtime-ProtoKits@main
same repo commit can therefore resolve different physics-kit source
load() suppresses module errors and returns null
Three.js failure becomes a later setup exception instead of a typed admission result
Rapier/ProtoKit failure becomes an unclassified fallback
no source URL, resolved revision, capability, fallback reason, or fingerprint reaches GameHost
resize/keyboard listeners, both RAF loops, renderer resources, physics resources, and event subscriptions have no dispose owner
remount or re-import can duplicate work and leak browser/GPU state
```

## Next safe work

Preserve the current look and controls while establishing:

```txt
RuntimeDependencyRequest / RuntimeDependencyResult
pinned immutable physics-kit source
explicit required / optional / fallback policy
single source-frame owner
SessionStartResult / RestartTransaction
mount, dispose, and remount lifecycle
listener, RAF, renderer, geometry, material, physics, and subscription ownership
JSON-safe host admission/lifecycle snapshot
DOM-free admission and lifecycle fixture
```

## Current validation state

Documentation only. Runtime source, dependencies, routes, and deployment did not change. No branch or pull request was created. The repo has no root `package.json`, and no runtime-admission or lifecycle fixture exists to run.