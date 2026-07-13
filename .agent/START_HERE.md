# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T22-19-11-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `articulated-pose-presentation-authority-audited`  
**Retained reconciliation:** `run-start-restart-central-reconciled`

## Summary

PrehistoricRush composes Core Motion/Physics, articulated motion/dynamics, Rapier, procedural creatures, deterministic patch streaming, Three.js, browser controls, and public diagnostics. The latest technical audit finds that the visible dinosaur bypasses the installed articulated solve path: the renderer creates a legacy procedural pose from RunState scalars and applies it directly to Three.js bones without a pose commit, source policy, bone-coverage result, or visible-frame acknowledgement.

The `22-19-11` run-start reconciliation remains retained and current in central tracking. It documents unconditional Enter restart, key-repeat, and missing participant reset/preserve authority.

## Plan ledger

**Goal:** connect committed simulation and motion through one admitted articulated pose result to the visible player frame while preserving the current run-start reconciliation.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` because its repo-local state was newer than central tracking.
- [x] Trace simulation, Core Motion, Core Physics, rig registration, pose generation, articulated solving, skeleton application, rendering, and public readback.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Add the articulated pose tracker and architecture/system audit family.
- [x] Preserve the `22-19-11` run-start central reconciliation.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime integration and executable pose fixtures remain future work.

## Current audit family

```txt
.agent/trackers/2026-07-12T22-18-39-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T22-18-39-04-00.md
.agent/architecture-audit/2026-07-12T22-18-39-04-00-articulated-pose-presentation-dsk-map.md
.agent/render-audit/2026-07-12T22-18-39-04-00-legacy-pose-articulated-frame-gap.md
.agent/gameplay-audit/2026-07-12T22-18-39-04-00-simulation-motion-render-pose-divergence-loop.md
.agent/interaction-audit/2026-07-12T22-18-39-04-00-motion-pose-solve-apply-frame-map.md
.agent/articulation-audit/2026-07-12T22-18-39-04-00-rig-solve-render-admission-contract.md
.agent/deploy-audit/2026-07-12T22-18-39-04-00-articulated-pose-fixture-gate.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
```

## Visible pose loop

```txt
engine.tick
  -> RunState, Core Motion, Core Physics, and Core Simulation commit
  -> renderer reads RunState scalars
  -> game.createPlayerPose creates legacy procedural pose
  -> applyCreaturePose mutates matching Three.js bones
  -> renderer renders

available but bypassed
  -> articulated rig
  -> solvePlayerArticulatedPose
  -> articulatedMotion.solve
  -> articulated motion and dynamics observations
```

## Required parent domain

```txt
prehistoric-rush-articulated-pose-presentation-authority-domain
```

```txt
PlayerPoseFrameCommand
  -> admit run/tick/body/profile/rig and committed motion/physics inputs
  -> adapt base pose and target set
  -> solve articulation under explicit policy
  -> validate transforms and bone coverage
  -> commit articulated pose or typed fallback
  -> apply only the committed pose
  -> render and acknowledge the first matching visible frame
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

Documentation only. Runtime, simulation, motion, physics, articulation, rendering, package, dependency, and deployment behavior are unchanged. No articulated-pose fixture was run.