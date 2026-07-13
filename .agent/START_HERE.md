# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T00-49-53-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `game-viewport-render-surface-authority-audited`  
**Retained audits:** `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`

## Summary

PrehistoricRush composes Core Motion and Physics, articulated motion/dynamics, Rapier, procedural creatures, deterministic patch streaming, Three.js, browser controls, profile persistence and public diagnostics. The current audit isolates the game viewport surface: camera aspect and renderer size use `innerWidth`/`innerHeight`, DPR is sampled only during startup, and resize directly mutates camera and renderer state without measuring the actual host or producing a revisioned visible-frame result.

## Plan ledger

**Goal:** make host measurement, DPR policy, camera projection, drawing-buffer allocation and the first visible resized frame one authoritative presentation transaction.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` through the oldest eligible fallback.
- [x] Trace startup sizing, DPR, resize, camera, renderer, RAF, HUD and public readback.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Add the viewport tracker and architecture/system audit family.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime implementation and executable viewport fixtures remain future work.

## Current audit family

```txt
.agent/trackers/2026-07-13T00-49-53-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T00-49-53-04-00.md
.agent/architecture-audit/2026-07-13T00-49-53-04-00-game-viewport-surface-dsk-map.md
.agent/render-audit/2026-07-13T00-49-53-04-00-camera-dpr-drawing-buffer-frame-gap.md
.agent/gameplay-audit/2026-07-13T00-49-53-04-00-resize-render-loop.md
.agent/interaction-audit/2026-07-13T00-49-53-04-00-viewport-change-admission-map.md
.agent/viewport-audit/2026-07-13T00-49-53-04-00-measure-dpr-commit-frame-contract.md
.agent/deploy-audit/2026-07-13T00-49-53-04-00-viewport-fixture-gate.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
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