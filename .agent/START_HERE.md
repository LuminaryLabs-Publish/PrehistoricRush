# START HERE: PrehistoricRush

**Last aligned:** `2026-07-16T12-02-38-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed pre-audit documentation head:** `e83638abab425dc3c54370ad6c3fab17576c3d13`  
**Reviewed runtime source revision:** `7159a414ff4e103015ca1b634324b9fd89256cf4`  
**Status:** `tree-fidelity-asset-adoption-projection-authority-audited`

## Summary

Six new commits added Core Assets/Core Startup tree packages, captured impostor atlases, IndexedDB caching, menu preloading, required game-start preparation and a source contract test. The active game still ignores the preparation receipt and packages, generates patches from a separate hard-coded `treeTypes` array and renders cylinder/icosahedron instances.

## Plan ledger

**Goal:** make the prepared tree-fidelity generation the accepted source for patch tree identity, render-form selection and visible-frame proof.

- [x] Compare all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Select only runtime-ahead PrehistoricRush.
- [x] Review six new commits and six changed files.
- [x] Trace menu preload, game startup, capture, cache, patch generation and tree rendering.
- [x] Preserve the previous 66 surfaces and add nine asset/startup surfaces.
- [x] Define one parent adoption/projection authority with 20 coordinating surfaces.
- [x] Add the `2026-07-16T12-02-38-04-00` audit family on `main`.
- [ ] Implement package adoption and source/build/Pages visible-frame fixtures.

## Main finding

```txt
five portable tree packages: present
near/medium/far/horizon forms: present
captured color/opacity atlas: present
IndexedDB cache: present
menu background preload: present
game required startup preparation: present
source contract test: present

runtime reads preparation receipt: absent
runtime resolves package payloads: absent
patch records bind asset/package IDs: absent
renderer materializes package forms: absent
captured atlas used by gameplay renderer: absent
TreeFidelityAdoptionResult: absent
FirstTreeFidelityBoundFrameAck: absent
```

## Current interaction loop

```txt
menu -> separate asset runtime -> background bundle request -> cache/status
game entry -> separate asset/startup runtime -> required bundle preparation -> global receipt
game runtime -> independent treeTypes -> patch typeIndex -> legacy InstancedMesh trees
```

## Current audit family

```txt
.agent/trackers/2026-07-16T12-02-38-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-16T12-02-38-04-00.md
.agent/architecture-audit/2026-07-16T12-02-38-04-00-tree-fidelity-asset-adoption-dsk-map.md
.agent/render-audit/2026-07-16T12-02-38-04-00-prepared-tree-assets-not-presented-gap.md
.agent/gameplay-audit/2026-07-16T12-02-38-04-00-startup-waits-unused-tree-package-loop.md
.agent/interaction-audit/2026-07-16T12-02-38-04-00-tree-asset-preparation-adoption-command-result-map.md
.agent/tree-system-audit/2026-07-16T12-02-38-04-00-fidelity-bundle-consumption-contract.md
.agent/deploy-audit/2026-07-16T12-02-38-04-00-tree-fidelity-source-build-pages-fixture-gate.md
.agent/central-sync-audit/2026-07-16T12-02-38-04-00-runtime-ahead-tree-fidelity-reconciliation.md
```

## Required authority

`prehistoric-rush-tree-fidelity-asset-adoption-projection-authority-domain`

## Kit census

```txt
Nexus Engine root/subdomain kits: 24
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 22
external/host/capture/render adapters: 16
proof kits: 8
total active named surfaces: 75
planned tree-fidelity adoption surfaces: 20
```

## Next safe ledge

Remove the duplicate authored tree tuple authority, bind the accepted package digest into patch/cache identity, materialize package mesh and impostor forms, retire route-owned asset runtimes and acknowledge the first package-bound frame.

## Claim boundary

Documentation only. No package adoption, atlas rendering, startup improvement, lifecycle correctness, artifact parity, Pages parity or production readiness is claimed.