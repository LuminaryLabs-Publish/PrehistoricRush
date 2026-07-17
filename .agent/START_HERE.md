# START HERE: PrehistoricRush Runtime Module Identity

**Last aligned:** `2026-07-16T20-01-41-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed repository head:** `94fec638a76d6c39034fe993396edf12e95638fb`  
**Status:** `runtime-module-generation-identity-authority-audited`

## Summary

PrehistoricRush was selected through the oldest synchronized eligible-repository rule. The complete Publish comparison found 11 repositories, ten eligible after excluding `LuminaryLabs-Publish/TheCavalryOfRome`, ten central ledgers, ten root `.agent` states, and no runtime-ahead repository.

The focused gap is runtime module identity. `runtime-versions.js` dynamically loads Nexus Engine commit `80146b8…`, while `game.html` maps the bare `nexusengine` specifier to `06375f2…` and `charactercreator.html` maps it to `cf2fe3d…`. Official NexusEngine-Kits import that bare specifier, so the game and creator can compose kit descriptors and object primitives from a different Nexus Engine generation than the host engine.

## Goal

Make every route admit one exact Nexus Engine generation before any external kit, descriptor factory, engine composition, asset runtime, simulation, or rendered frame is created.

## Plan ledger

- [x] Compare the full 11-repository Publish inventory.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Verify all ten eligible ledger records and current repository heads.
- [x] Select only PrehistoricRush as the oldest synchronized repository.
- [x] Identify the full menu, creator, game, asset, simulation, streaming, render, and deployment loops.
- [x] Preserve the complete 81-surface kit and service census.
- [x] Confirm three distinct Nexus Engine commit declarations across shared runtime URLs and route import maps.
- [x] Confirm official kit modules import the bare `nexusengine` specifier.
- [x] Define one runtime-module generation authority and 20 coordinating surfaces.
- [x] Add the timestamped tracker and focused audit family.
- [ ] Unify route import maps and dynamic imports under one generated runtime manifest.
- [ ] Execute source, browser, built-output, and Pages module-identity fixtures.

## Read this pass first

```txt
.agent/trackers/2026-07-16T20-01-41-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-16T20-01-41-04-00.md
.agent/architecture-audit/2026-07-16T20-01-41-04-00-runtime-module-generation-dsk-map.md
.agent/render-audit/2026-07-16T20-01-41-04-00-mixed-runtime-visible-frame-gap.md
.agent/gameplay-audit/2026-07-16T20-01-41-04-00-mixed-runtime-composition-loop.md
.agent/interaction-audit/2026-07-16T20-01-41-04-00-runtime-admission-command-result-map.md
.agent/runtime-module-audit/2026-07-16T20-01-41-04-00-route-import-map-runtime-identity-contract.md
.agent/deploy-audit/2026-07-16T20-01-41-04-00-runtime-module-source-build-pages-fixture-gate.md
.agent/central-sync-audit/2026-07-16T20-01-41-04-00-oldest-selection-runtime-module-reconciliation.md
```

## Required parent domain

`prehistoric-rush-runtime-module-generation-identity-authority-domain`

## Census

```txt
Nexus Engine root/subdomain kits: 24
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 24
external/host/capture/render adapters: 17
proof kits: 11
active named surfaces: 81
planned module-identity surfaces: 20
```

## Claim boundary

Documentation only. No single-runtime-generation guarantee, module-cache coherence, cross-route parity, browser proof, built-output parity, Pages parity, or production readiness is claimed.