# START HERE: PrehistoricRush

**Last aligned:** `2026-07-14T18-58-04-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Repository head before audit:** `436aaad739f521f036f14f7f5dd3ab1ff51ecee2`  
**Runtime source revision retained:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `route-progress-goal-eligibility-authority-central-reconciled`  
**Technical status:** `route-progress-goal-eligibility-authority-audited`

## Summary

The current audit covers authored-course progress and finish eligibility. PrehistoricRush computes route index, normalized progress, lateral distance and surface region, but victory uses only cumulative movement distance. Reversing, circling, repeating a segment or leaving the route can therefore advance the win counter.

## Plan ledger

**Goal:** require one versioned course manifest, monotonic accepted route progress, an eligible terminal checkpoint and a matching visible finish frame.

- [x] Compare all 11 Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm ten eligible ledgers, root `.agent` states and synchronized heads.
- [x] Select only PrehistoricRush by the oldest eligible timestamp.
- [x] Trace route generation, movement, goal resolution, HUD, tests and public readback.
- [x] Preserve the complete 59-surface inventory.
- [x] Add the `2026-07-14T18-58-04-04-00` audit family.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement course-progress admission and executable browser proof later.

## Main finding

```txt
routeIndex and routeProgress: computed
lateral route distance and region: computed
cumulative movement: computed
current win predicate: cumulative movement >= 3600
route progress in win predicate: absent
direction and checkpoint admission: absent
finish volume: absent
```

## Current audit family

```txt
.agent/trackers/2026-07-14T18-58-04-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-14T18-58-04-04-00.md
.agent/architecture-audit/2026-07-14T18-58-04-04-00-route-progress-goal-eligibility-dsk-map.md
.agent/render-audit/2026-07-14T18-58-04-04-00-movement-progress-finish-frame-gap.md
.agent/gameplay-audit/2026-07-14T18-58-04-04-00-off-route-distance-win-loop.md
.agent/interaction-audit/2026-07-14T18-58-04-04-00-course-progress-goal-command-result-map.md
.agent/route-progress-audit/2026-07-14T18-58-04-04-00-checkpoint-direction-finish-eligibility-contract.md
.agent/deploy-audit/2026-07-14T18-58-04-04-00-course-progress-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-14T18-58-04-04-00-oldest-selection-route-progress-reconciliation.md
```

## Required authority

```txt
prehistoric-rush-route-progress-goal-eligibility-authority-domain
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        7
total surfaces:                   59
planned route authority surfaces: 22
```

## Retained audit families

Runtime-provider convergence, run-outcome settlement, player-profile admission, patch adoption, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run-start/restart and browser-runtime retirement remain separate unresolved boundaries.