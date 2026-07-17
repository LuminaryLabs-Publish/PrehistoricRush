# START HERE: PrehistoricRush Product Vegetation Runtime Fixture

**Last aligned:** `2026-07-17T02-50-44-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed runtime head:** `b87cdad1f1666b089935bb221f7daf9bc4f6a779`  
**Previous documentation head:** `5f5f93c5c8519dd5bf952b160875b8e28f85ed18`  
**Status:** `product-vegetation-runtime-fixture-authority-audited`

## Summary

PrehistoricRush was selected because five test-focused commits were ahead of its documented head. The delta adds product-module import coverage, a fuller Vegetation instance fixture, spawn-schema assertions, and `npm test` wiring.

The remaining gap is executable product-runtime proof. The import fixture checks exported values without invoking the constructors, while the dense spawn fixture uses a test-owned placement implementation instead of the actual pinned Nexus Engine Core Vegetation runtime.

## Intent

Prove the same semantic vegetation contract through actual runtime construction, catalog registration, main-thread and Worker patch generation, collision projection, browser loading, package binding, and the first rendered tree frame.

## Checklist

- [x] Compare all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Work only on PrehistoricRush.
- [x] Review five commits and four changed files.
- [x] Document the interaction loop, domains, 91 active surfaces, and services.
- [x] Add the timestamped tracker and focused audit family.
- [ ] Execute the actual product runtime and browser/Pages fixture matrix.

## Read this pass first

```txt
.agent/trackers/2026-07-17T02-50-44-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-17T02-50-44-04-00.md
.agent/architecture-audit/2026-07-17T02-50-44-04-00-product-vegetation-runtime-fixture-dsk-map.md
.agent/render-audit/2026-07-17T02-50-44-04-00-source-fixture-product-frame-proof-gap.md
.agent/gameplay-audit/2026-07-17T02-50-44-04-00-product-vegetation-runtime-gameplay-loop.md
.agent/interaction-audit/2026-07-17T02-50-44-04-00-product-vegetation-fixture-command-result-map.md
.agent/vegetation-system-audit/2026-07-17T02-50-44-04-00-product-runtime-fixture-contract.md
.agent/deploy-audit/2026-07-17T02-50-44-04-00-product-vegetation-source-browser-pages-fixture-gate.md
.agent/central-sync-audit/2026-07-17T02-50-44-04-00-runtime-ahead-product-fixture-reconciliation.md
```

## Required parent domain

`prehistoric-rush-product-vegetation-runtime-fixture-authority-domain`

## Census

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 27
external/host/capture/render adapters: 17
proof kits and fixtures: 13
active named surfaces: 91
planned fixture surfaces: 18
```

## Claim boundary

Documentation only. No current gameplay defect, actual product-runtime conformance, Worker parity, browser/CDN integrity, artifact parity, Pages parity, or production readiness is claimed.