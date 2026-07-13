# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T00-58-50-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `game-viewport-render-surface-central-reconciled`  
**Technical audit:** `game-viewport-render-surface-authority-audited`  
**Retained audits:** `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`

## Summary

PrehistoricRush composes Core Motion and Physics, articulated motion/dynamics, Rapier, procedural creatures, deterministic patch streaming, Three.js, browser controls, profile persistence and public diagnostics. The current documentation isolates the game viewport surface: camera aspect and renderer size use `innerWidth`/`innerHeight`, DPR is sampled only during startup, resize directly mutates camera and renderer state, and no revisioned visible-frame result identifies the surface shown.

## Plan ledger

**Goal:** keep one synchronized record from host measurement and DPR policy through camera/buffer application and the first visible viewport frame.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` because repo-local viewport documentation was newer than central tracking.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Add the `00-58-50` reconciliation family.
- [x] Synchronize root routing, machine state and central tracking.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime implementation and executable viewport fixtures remain future work.

## Current reconciliation family

```txt
.agent/trackers/2026-07-13T00-58-50-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T00-58-50-04-00.md
.agent/architecture-audit/2026-07-13T00-58-50-04-00-game-viewport-central-reconciliation-dsk-map.md
.agent/render-audit/2026-07-13T00-58-50-04-00-viewport-frame-central-reconciliation.md
.agent/gameplay-audit/2026-07-13T00-58-50-04-00-resize-render-loop-central-reconciliation.md
.agent/interaction-audit/2026-07-13T00-58-50-04-00-viewport-change-central-reconciliation-map.md
.agent/viewport-audit/2026-07-13T00-58-50-04-00-central-ledger-reconciliation.md
.agent/deploy-audit/2026-07-13T00-58-50-04-00-viewport-central-sync-gate.md
```

## Technical audit family

```txt
.agent/trackers/2026-07-13T00-49-53-04-00/project-breakdown.md
.agent/architecture-audit/2026-07-13T00-49-53-04-00-game-viewport-surface-dsk-map.md
.agent/render-audit/2026-07-13T00-49-53-04-00-camera-dpr-drawing-buffer-frame-gap.md
.agent/gameplay-audit/2026-07-13T00-49-53-04-00-resize-render-loop.md
.agent/interaction-audit/2026-07-13T00-49-53-04-00-viewport-change-admission-map.md
.agent/viewport-audit/2026-07-13T00-49-53-04-00-measure-dpr-commit-frame-contract.md
.agent/deploy-audit/2026-07-13T00-49-53-04-00-viewport-fixture-gate.md
```

## Current surface loop

```txt
startup
  -> PerspectiveCamera(innerWidth / innerHeight)
  -> renderer.setSize(innerWidth, innerHeight)
  -> renderer.setPixelRatio(min(devicePixelRatio, 2)) once

resize
  -> camera aspect/projection mutation
  -> renderer size mutation
  -> no host measurement, DPR refresh, surface revision or frame acknowledgement
```

## Required parent domain

```txt
prehistoric-rush-game-viewport-surface-authority-domain
```

```txt
ViewportChangeCommand
  -> measure actual host
  -> sample DPR and pixel policy
  -> validate and prepare camera/buffer candidate
  -> commit one viewport revision
  -> apply once during render admission
  -> acknowledge the first matching visible frame
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        2
total surfaces:                   45
```

## Validation boundary

Documentation only. Runtime, simulation, physics, streaming, articulation, renderer behavior, package scripts, dependencies and deployment are unchanged. No viewport fixture was run.