# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T03-20-58-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `collision-source-convergence-publication-central-reconciled`  
**Technical status:** `collision-source-convergence-authority-audited`  
**Retained audits:** `browser-input-core-input-adoption-central-reconciled`, `game-viewport-render-surface-central-reconciled`, `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`, `browser-runtime-lifecycle-authority-audited`

## Summary

PrehistoricRush composes Core Motion and Physics, Rapier, deterministic patch streaming, procedural creatures and Three.js presentation. The current collision audit is now publication-consistent: streamed tree colliders are evaluated by both Core Physics and a browser fallback sampler, but the sources still lack one collider revision, comparison result, disagreement policy and first-visible-outcome-frame proof.

## Plan ledger

**Goal:** keep repo-local routing, machine state and central tracking aligned while preserving the unresolved collision-convergence contract.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` because its oldest central row lagged its newer repo-local collision audit.
- [x] Preserve the complete interaction loop, domains and 45-surface service inventory.
- [x] Add the `2026-07-13T03-20-58-04-00` reconciliation tracker and audit family.
- [x] Refresh every required root `.agent` file and machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement collision convergence and execute parity fixtures later.

## Current audit family

```txt
.agent/trackers/2026-07-13T03-20-58-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T03-20-58-04-00.md
.agent/architecture-audit/2026-07-13T03-20-58-04-00-collision-convergence-publication-dsk-map.md
.agent/render-audit/2026-07-13T03-20-58-04-00-collision-publication-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T03-20-58-04-00-collision-source-precedence-reconciliation-loop.md
.agent/interaction-audit/2026-07-13T03-20-58-04-00-collider-evidence-decision-publication-map.md
.agent/collision-system-audit/2026-07-13T03-20-58-04-00-collider-revision-comparison-contract.md
.agent/central-sync-audit/2026-07-13T03-20-58-04-00-repo-local-central-publication-contract.md
.agent/deploy-audit/2026-07-13T03-20-58-04-00-collision-convergence-fixture-gate.md
```

## Complete interaction loop

```txt
boot and compose
  -> stream deterministic patches and activate collider descriptors
  -> synchronize active colliders into Core Physics
  -> evaluate Rapier contacts and host fallback radial collisions
  -> resolve physics first, fallback second
  -> commit gameplay outcome
  -> render Three.js and HUD
  -> expose no collider-set comparison or visible-frame receipt
```

## Required parent domain

```txt
prehistoric-rush-collision-source-convergence-authority-domain
```

```txt
CollisionEvaluationCommand
  -> bind one run/tick/candidate/collider revision
  -> collect and normalize physics plus fallback evidence
  -> classify agreement, disagreement, absence and stale evidence
  -> apply explicit canonical-source policy
  -> commit one CollisionDecisionResult
  -> acknowledge the first matching visible outcome frame
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

Documentation only. Runtime, physics, streaming, collision behavior, gameplay, rendering, dependencies and deployment are unchanged. No collision-convergence fixture was run.
