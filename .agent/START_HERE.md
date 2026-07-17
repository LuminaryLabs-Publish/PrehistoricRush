# START HERE: PrehistoricRush Semantic Vegetation Generation

**Last aligned:** `2026-07-17T02-02-06-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed runtime head:** `55118e0c874697b767db69575687dfa1390958f9`  
**Previous documentation head:** `946290c5af573ee14026cbde80f37c7591d8ed52`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Summary

PrehistoricRush was selected as the newest runtime-ahead eligible repository. Ten runtime/test commits added Nexus Engine Object Vegetation composition, domain-selected species and variation, Worker adoption, semantic tree/foliage descriptors, and vegetation-aware tree asset preparation.

The remaining gap is generation binding. Asset preparation, the game host, and the patch Worker create independent vegetation catalogs. Semantic fidelity profiles are derived but the portable package provider still registers the older local profile. Fidelity package generations omit semantic descriptor hashes, and the Worker does not publish its catalog digest. The frame receipt records catalog and package digests separately without proving a per-species match.

## Intent

Make one semantic vegetation generation authoritative across catalog descriptors, fidelity packages, caches, Worker patches, tree rendering, and first-frame evidence.

## Checklist

- [x] Compare all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible ledgers and root `.agent` states.
- [x] Identify two runtime-ahead repositories.
- [x] Work only on PrehistoricRush.
- [x] Review the ten-commit Object Vegetation delta.
- [x] Document the full interaction loop, domains, 90 active surfaces, and services.
- [x] Add the timestamped tracker and focused audit family.
- [ ] Implement one composite generation and executable fixture matrix.

## Read this pass first

```txt
.agent/trackers/2026-07-17T02-02-06-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-17T02-02-06-04-00.md
.agent/architecture-audit/2026-07-17T02-02-06-04-00-semantic-vegetation-fidelity-generation-dsk-map.md
.agent/render-audit/2026-07-17T02-02-06-04-00-species-package-generation-visible-frame-gap.md
.agent/gameplay-audit/2026-07-17T02-02-06-04-00-domain-selected-tree-fidelity-binding-loop.md
.agent/interaction-audit/2026-07-17T02-02-06-04-00-vegetation-generation-command-result-map.md
.agent/vegetation-system-audit/2026-07-17T02-02-06-04-00-catalog-worker-fidelity-generation-contract.md
.agent/deploy-audit/2026-07-17T02-02-06-04-00-vegetation-generation-source-browser-pages-fixture-gate.md
.agent/central-sync-audit/2026-07-17T02-02-06-04-00-runtime-ahead-vegetation-domain-reconciliation.md
```

## Required parent domain

`prehistoric-rush-semantic-vegetation-fidelity-generation-authority-domain`

## Census

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 27
external/host/capture/render adapters: 17
proof kits and fixtures: 12
active named surfaces: 90
planned generation surfaces: 22
```

## Claim boundary

Documentation only. No current visual defect, semantic profile adoption, Worker catalog equality, composite generation guarantee, cache correctness, species-package convergence, artifact parity, Pages parity, or production readiness is claimed.
