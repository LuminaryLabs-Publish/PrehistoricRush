# START HERE: PrehistoricRush Jungle Presentation Adoption

**Last aligned:** `2026-07-17T05-58-55-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed runtime head:** `9eea125435e51ab0c492a071e5a9f70301f52cd6`  
**Previous documentation head:** `e7c5d238d7ba406ecf02b8d91416161f03201147`  
**Status:** `jungle-foliage-atmosphere-runtime-adoption-authority-audited`

## Summary

PrehistoricRush was selected because three runtime commits were ahead of its documented head. The delta adds foliage-card/ground-cover recipes, a jungle-atmosphere helper, and semantic registration of card-backed foliage for ten trees plus six ground-cover species.

The semantic catalog is now adopted by the product vegetation domain, but the patch generator still emits legacy trunks/crowns and grass without consuming ground-cover options or producing card/ground-cover payloads. The atmosphere helper remains outside production composition. No atlas-material, GPU-batch, lifecycle, or matching-frame result exists.

## Intent

Carry the registered semantic catalogs through deterministic patch/Worker projection, bounded quality budgets, GPU material/batch ownership, idempotent atmosphere lifecycle, retirement, and the exact presented frame.

## Checklist

- [x] Compare all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Select only PrehistoricRush through runtime-ahead priority.
- [x] Review three commits and three changed files.
- [x] Document the interaction loop, domains, 93 active surfaces, and services.
- [x] Reconcile the late semantic catalog integration.
- [ ] Project foliage cards and ground cover through production patch/Worker paths.
- [ ] Adopt and retire atmosphere through one scene/renderer generation.
- [ ] Execute source, browser, artifact, and Pages frame fixtures.

## Read this pass first

```txt
.agent/trackers/2026-07-17T05-58-55-04-00/project-breakdown.md
.agent/trackers/2026-07-17T05-58-55-04-00/late-runtime-integration.md
.agent/architecture-audit/2026-07-17T05-58-55-04-00-partial-foliage-catalog-adoption-update.md
.agent/render-audit/2026-07-17T05-58-55-04-00-semantic-foliage-without-patch-frame-update.md
.agent/vegetation-system-audit/2026-07-17T05-58-55-04-00-foliage-card-ground-cover-atmosphere-contract.md
.agent/deploy-audit/2026-07-17T05-58-55-04-00-jungle-presentation-source-build-pages-fixture-gate.md
.agent/central-sync-audit/2026-07-17T05-58-55-04-00-runtime-ahead-jungle-presentation-reconciliation.md
```

The late-runtime addendum supersedes earlier statements that the foliage recipes had no production import.

## Required parent domain

`prehistoric-rush-jungle-foliage-atmosphere-runtime-adoption-authority-domain`

## Census

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 28
external/host/capture/render adapters: 18
proof kits and fixtures: 13
active named surfaces: 93
planned jungle-adoption surfaces: 20
```

## Claim boundary

Semantic catalog registration is present. Patch/Worker projection, visible card and ground-cover rendering, atmosphere adoption, GPU lifecycle correctness, browser integrity, artifact parity, Pages parity, and production readiness are not claimed.
