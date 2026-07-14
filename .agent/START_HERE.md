# START HERE: PrehistoricRush

**Last aligned:** `2026-07-14T14-01-07-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Repository head before audit:** `0a8e5dff693226ea5ca8d163a1b89fa85fc837dc`  
**Runtime source revision retained:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `runtime-provider-revision-convergence-authority-central-reconciled`  
**Technical status:** `runtime-provider-revision-convergence-authority-audited`

## Summary

The current audit covers browser provider identity and module-graph convergence. Route code directly imports NexusEngine `682c9fa...`, while the game and creator import maps resolve bare `nexusengine` imports inside stable kits and ProtoKits to older revision `cf2fe3d...`.

## Plan ledger

**Goal:** make the game and creator admit one canonical NexusEngine revision across root runtime, kit factories, ProtoKits, diagnostics, and first visible frame.

- [x] Compare all 11 Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm ten eligible ledgers, root `.agent` states, and synchronized heads.
- [x] Select only PrehistoricRush by the oldest eligible timestamp.
- [x] Trace direct runtime imports, import maps, stable-kit imports, ProtoKit imports, composition, diagnostics, and render startup.
- [x] Preserve the complete 59-surface inventory.
- [x] Add the `2026-07-14T14-01-07-04-00` audit family.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement one provider manifest and executable browser proof later.

## Main finding

```txt
direct NexusEngine runtime:
  682c9fa697a36a6bf6262762a6e647ffc3a5e289

HTML bare-specifier nexusengine mapping:
  cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1

verified bare consumers:
  NexusEngine-Kits seed-kit
  NexusEngine-Kits procedural-creature-body-kit
  NexusEngine-ProtoKits protokit-core
```

The runtime can therefore compose one route from factories, helpers, and descriptors associated with two NexusEngine revisions. Current capability checks validate shape, not provider identity or compatibility settlement.

## Current audit family

```txt
.agent/trackers/2026-07-14T14-01-07-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-14T14-01-07-04-00.md
.agent/architecture-audit/2026-07-14T14-01-07-04-00-runtime-provider-revision-convergence-dsk-map.md
.agent/render-audit/2026-07-14T14-01-07-04-00-split-provider-first-frame-gap.md
.agent/gameplay-audit/2026-07-14T14-01-07-04-00-mixed-runtime-composition-loop.md
.agent/interaction-audit/2026-07-14T14-01-07-04-00-route-bootstrap-provider-result-map.md
.agent/runtime-provider-audit/2026-07-14T14-01-07-04-00-import-map-module-graph-contract.md
.agent/deploy-audit/2026-07-14T14-01-07-04-00-provider-revision-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-14T14-01-07-04-00-repo-ledger-provider-revision-reconciliation.md
```

## Required authority

```txt
prehistoric-rush-runtime-provider-revision-convergence-authority-domain
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

Run outcome settlement, player-profile admission, patch adoption, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run-start/restart, and browser-runtime retirement remain separate unresolved boundaries.
