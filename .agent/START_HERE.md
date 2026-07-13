# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T03-13-09-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `collision-source-convergence-authority-audited`  
**Retained audits:** `browser-input-core-input-adoption-central-reconciled`, `game-viewport-render-surface-central-reconciled`, `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`, `browser-runtime-lifecycle-authority-audited`

## Summary

PrehistoricRush composes Core Motion and Physics, Rapier, procedural creatures, deterministic patch streaming and Three.js presentation. The current audit isolates collision convergence: streamed tree colliders are evaluated by both Core Physics and a browser fallback sampler, but the sources have no shared collider revision, parity result, disagreement policy or first-visible-failure-frame proof.

## Plan ledger

**Goal:** make streamed collider publication, source evidence, canonical failure resolution and visible outcome presentation one revisioned collision transaction.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` as the oldest eligible documented repository at selection.
- [x] Trace patch colliders, Core Physics synchronization, fallback sampling, observation ordering and resolution.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Add the `03-13-09` tracker and audit family.
- [x] Preserve the concurrent `03-12-30` browser-input/Core Input audit as a retained audit.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime convergence and executable parity fixtures remain future work.

## Current audit family

```txt
.agent/trackers/2026-07-13T03-13-09-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T03-13-09-04-00.md
.agent/architecture-audit/2026-07-13T03-13-09-04-00-collision-source-convergence-dsk-map.md
.agent/render-audit/2026-07-13T03-13-09-04-00-collision-decision-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T03-13-09-04-00-dual-collision-source-resolution-loop.md
.agent/interaction-audit/2026-07-13T03-13-09-04-00-collision-evidence-admission-result-map.md
.agent/collision-system-audit/2026-07-13T03-13-09-04-00-collider-revision-source-parity-contract.md
.agent/deploy-audit/2026-07-13T03-13-09-04-00-collision-source-parity-fixture-gate.md
```

## Current collision loop

```txt
streamed tree descriptors
  -> host view.colliders
  -> Core Physics collider synchronization
  -> Rapier contact observation
  -> independent fallback radial observation
  -> physics-first outcome resolution
  -> run-over state and rendered frame
  -> no source-comparison or visible-frame receipt
```

## Required parent domain

```txt
prehistoric-rush-collision-source-convergence-authority-domain
```

```txt
CollisionEvaluationCommand
  -> bind one run/tick/player candidate/collider-set revision
  -> collect physics and fallback evidence
  -> normalize and compare sources
  -> reject stale evidence or classify agreement/disagreement
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

Documentation only. Runtime, collision behavior, physics, streaming, rendering, package scripts, dependencies and deployment are unchanged. No collision-parity fixture was run.