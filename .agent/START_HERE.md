# START HERE: PrehistoricRush

**Last aligned:** `2026-07-14T08-40-38-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `run-outcome-score-settlement-authority-central-reconciled`  
**Technical status:** `run-outcome-score-settlement-authority-audited`

## Summary

The current audit covers terminal run outcome, score provenance, retry lineage and visible result evidence. Collision, pickup and goal resolution is deterministic, but the accepted terminal decision is not retained as one immutable artifact before retry replaces mutable run state.

## Plan ledger

**Goal:** bind terminal simulation truth, score policy, reproducibility inputs, terminal UI/frame and retry to one durable RunOutcomeArtifact.

- [x] Compare 11 Publish repositories and exclude `TheCavalryOfRome`.
- [x] Confirm 10 eligible ledgers, root `.agent` states and synchronized heads.
- [x] Select only PrehistoricRush by the oldest eligible timestamp.
- [x] Inspect run state, resolution, transitions, HUD, renderer, retry and tests.
- [x] Preserve the full 59-surface inventory.
- [x] Add the `2026-07-14T08-40-38-04-00` audit family.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement settlement and executable proof later.

## Current audit family

```txt
.agent/trackers/2026-07-14T08-40-38-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-14T08-40-38-04-00.md
.agent/architecture-audit/2026-07-14T08-40-38-04-00-run-outcome-score-settlement-dsk-map.md
.agent/render-audit/2026-07-14T08-40-38-04-00-terminal-result-visible-frame-gap.md
.agent/gameplay-audit/2026-07-14T08-40-38-04-00-terminal-outcome-retry-loop.md
.agent/interaction-audit/2026-07-14T08-40-38-04-00-outcome-retry-command-result-map.md
.agent/outcome-system-audit/2026-07-14T08-40-38-04-00-result-score-retry-contract.md
.agent/deploy-audit/2026-07-14T08-40-38-04-00-run-outcome-score-fixture-gate.md
.agent/central-sync-audit/2026-07-14T08-40-38-04-00-run-outcome-score-reconciliation.md
```

## Required authority

```txt
prehistoric-rush-run-outcome-score-settlement-authority-domain
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        7
total surfaces:                   59
```

## Retained audit families

Player-profile admission, patch adoption, pause-menu lifecycle, character composition, terrain IK, PlayerPose provenance, collision convergence, Core Input, viewport, articulation, run-start/restart and browser-runtime retirement remain separate unresolved boundaries.