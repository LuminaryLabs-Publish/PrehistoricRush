# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T06-39-10-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `3d448c4e26e8f68cb99de00564ac8dca42624a8d`  
**Status:** `authoritative-player-pose-publication-central-reconciled`  
**Technical status:** `authoritative-player-pose-implemented-static-proof`  
**Retained audits:** `collision-source-convergence-publication-central-reconciled`, `browser-input-core-input-adoption-central-reconciled`, `game-viewport-render-surface-central-reconciled`, `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`, `browser-runtime-lifecycle-authority-audited`

## Summary

PrehistoricRush now publishes the player’s articulated target pose as simulation-owned state. Initialization, run start and each active tick solve and replace `PlayerPose`; the Three.js renderer reads that resource after `engine.tick(dt)` and no longer generates the legacy pose inside the render loop.

The remaining boundary is pose-frame provenance. The resource retains only the pose body, while the renderer derives a visibly damped skeleton from prior Three.js bone state without source-frame identity, restart generation, readback or first-visible-frame acknowledgement.

## Plan ledger

**Goal:** preserve the implemented ownership correction and define the remaining evidence chain from simulation solve to visible skeleton frame.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only PrehistoricRush because its runtime/test head advanced beyond its documented central state.
- [x] Preserve the complete interaction loop, domains and 46-surface service inventory.
- [x] Add the `2026-07-13T06-39-10-04-00` tracker and audit family.
- [x] Refresh every required root `.agent` file and machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Add pose-frame revisions, presentation generations and executable visible-frame fixtures later.

## Current audit family

```txt
.agent/trackers/2026-07-13T06-39-10-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T06-39-10-04-00.md
.agent/architecture-audit/2026-07-13T06-39-10-04-00-player-pose-frame-provenance-dsk-map.md
.agent/render-audit/2026-07-13T06-39-10-04-00-authoritative-pose-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T06-39-10-04-00-simulation-owned-player-pose-loop.md
.agent/interaction-audit/2026-07-13T06-39-10-04-00-tick-pose-render-admission-map.md
.agent/pose-system-audit/2026-07-13T06-39-10-04-00-pose-frame-revision-damping-contract.md
.agent/deploy-audit/2026-07-13T06-39-10-04-00-player-pose-fixture-gate.md
.agent/central-sync-audit/2026-07-13T06-39-10-04-00-authoritative-player-pose-reconciliation.md
```

## Complete interaction loop

```txt
boot and compose
  -> create procedural body and articulated rig
  -> initialize and solve PlayerPose
  -> start run and replace start pose

active frame
  -> browser input patches InputState
  -> engine.tick(dt)
  -> run candidate and Core Motion frame
  -> procedural pose -> articulated solve
  -> replace PlayerPose
  -> simulation resolution and commit
  -> renderer reads PlayerPose
  -> render-time damping updates Three.js bones
  -> Three.js and HUD render
```

## Required parent domain

```txt
prehistoric-rush-player-pose-frame-provenance-authority-domain
```

```txt
PlayerPoseSolveCommand
  -> bind run/tick/frame/rig/source-state revisions
  -> publish immutable PlayerPoseFrame
  -> renderer admits that frame under a presentation generation
  -> publish PresentationPoseFrame after damping
  -> acknowledge the first matching visible skeleton frame
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        3
total surfaces:                   46
```

## Validation boundary

The source and new static test were inspected through GitHub. No runtime code was changed in this pass. `npm test`, browser pose rendering, built output and Pages were not independently executed because the available execution environment could not resolve `github.com` for a local checkout.