# START HERE: PrehistoricRush

**Last aligned:** `2026-07-15T05-38-36-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed pre-audit documentation head:** `fb7180ab0d5f11deabde7d62f62d24ad31e5c5b6`  
**Reviewed runtime-ahead head:** `6b61bf3ec04fec09f11d7c4f60b281e3d8cb71b4`  
**Status:** `terrain-lod-patch-render-admission-authority-audited`

## Summary

PrehistoricRush was selected because five new terrain commits were ahead of the documented repository head. The producer now emits 64-segment terrain fields and the product registers a 64/32/16 LOD policy, but the active Three.js adapter still allocates a 30-segment terrain mesh.

The first patch activation attempts to copy 12,675 color and normal floats into attributes sized for 2,883 floats. The new LOD topology, skirt, geomorph and clay texture helpers are present but disconnected from the active render path.

## Plan ledger

**Goal:** make terrain production, LOD selection, geometry capacity, material resources, patch adoption and the first visible terrain frame one validated transaction.

- [x] Compare all 11 Publish repositories and exclude `TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Detect PrehistoricRush five commits ahead of its recorded documentation head.
- [x] Select only PrehistoricRush under the runtime-ahead priority rule.
- [x] Inspect all five changed source files and the unchanged active adapter.
- [x] Preserve the prior inventory and add three terrain surfaces.
- [x] Add the `2026-07-15T05-38-36-04-00` audit family.
- [x] Change documentation only, use `main`, and create no branch or pull request.
- [ ] Implement and execute terrain admission fixtures later.

## Main finding

```txt
runtime cfg.segments: 30
active adapter terrain vertices: 961
active color/normal attribute floats: 2,883
patch generator segments: 64
patch terrain vertices: 4,225
patch color/normal floats: 12,675
capacity mismatch: 9,792 floats
```

## Current audit family

```txt
.agent/trackers/2026-07-15T05-38-36-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-15T05-38-36-04-00.md
.agent/architecture-audit/2026-07-15T05-38-36-04-00-terrain-lod-patch-render-admission-dsk-map.md
.agent/render-audit/2026-07-15T05-38-36-04-00-terrain-attribute-capacity-visible-frame-gap.md
.agent/gameplay-audit/2026-07-15T05-38-36-04-00-streamed-patch-activation-failure-loop.md
.agent/interaction-audit/2026-07-15T05-38-36-04-00-terrain-patch-admission-command-result-map.md
.agent/terrain-system-audit/2026-07-15T05-38-36-04-00-resolution-topology-material-adoption-contract.md
.agent/deploy-audit/2026-07-15T05-38-36-04-00-terrain-lod-integration-fixture-gate.md
.agent/central-sync-audit/2026-07-15T05-38-36-04-00-runtime-ahead-terrain-lod-reconciliation.md
```

## Required authority

`prehistoric-rush-terrain-lod-patch-render-admission-authority-domain`

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits: 5
product/page/Worker kits: 17
external/host/render adapters: 11
proof kits: 7
total source-backed surfaces: 62
```

## Next safe ledge

Make the active adapter consume one versioned terrain schema. Validate source resolution and array lengths, select the accepted LOD, build matching topology, stage attributes and material resources, adopt the patch only after preparation succeeds, and publish `FirstTerrainLodFrameAck`.

## Claim boundary

This audit changes documentation only. It does not claim a runtime repair, successful browser render, correct mixed-LOD stitching, passing tests, artifact parity, Pages parity or production readiness.