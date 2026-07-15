# START HERE: PrehistoricRush

**Last aligned:** `2026-07-15T06-39-22-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Prior repo-local documentation head:** `a882bce237ae6a404bb3fecf58b38cdf6b580928`  
**Reviewed runtime-ahead head:** `1a37e9141c9a3afd28db865d1df9b01cdd4cb7d2`  
**Status:** `terrain-single-owner-render-retirement-authority-audited`

## Summary

PrehistoricRush was selected because nine commits advanced the terrain runtime beyond the last documented head. The new runtime now boots the 64/32/16 LOD layer, uses the clay textures, and includes a terrain authority test.

The LOD wrapper still constructs the complete legacy terrain renderer through `createThreePatchStreamAdapter()`. Every active patch is uploaded once to the authoritative LOD mesh and again to a hidden fixed-grid mesh. The runtime therefore owns 25 LOD terrain slots plus 25 hidden legacy terrain slots and maintains two independent patch-to-terrain maps.

## Plan ledger

**Goal:** give terrain presentation one owner while preserving the base adapter's vegetation, collider, pickup, height-sampling, camera and creature services.

- [x] Compare all 11 Publish repositories and exclude `TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Detect PrehistoricRush nine commits ahead of its repo-local documentation head.
- [x] Select only PrehistoricRush under the runtime-ahead priority rule.
- [x] Inspect the new LOD runtime, wrapper, terrain layer, geometry, clay textures and test.
- [x] Trace terrain allocation, activation, hiding, release and frame acknowledgement.
- [x] Preserve the full kit and service inventory and add four new active surfaces.
- [x] Add the `2026-07-15T06-39-22-04-00` audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Split non-terrain patch services from terrain presentation and execute lifecycle fixtures.

## Main finding

```txt
active patch radius: 2
terrain slots per renderer: (2 * 2 + 1)^2 = 25
LOD terrain slots: 25
hidden legacy terrain slots: 25
total terrain mesh slots allocated: 50

legacy vertices per slot: 4,225
LOD vertices per slot including skirts: 4,485
terrain uploads per activated patch: 2
independent terrain patch maps: 2
```

The legacy mesh is hidden after each base activation, but its geometry, material, attributes, slot map and patch upload path remain alive.

## Current audit family

```txt
.agent/trackers/2026-07-15T06-39-22-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-15T06-39-22-04-00.md
.agent/architecture-audit/2026-07-15T06-39-22-04-00-terrain-single-owner-dsk-map.md
.agent/render-audit/2026-07-15T06-39-22-04-00-hidden-legacy-terrain-allocation-gap.md
.agent/gameplay-audit/2026-07-15T06-39-22-04-00-patch-dual-terrain-adoption-loop.md
.agent/interaction-audit/2026-07-15T06-39-22-04-00-terrain-owner-command-result-map.md
.agent/terrain-system-audit/2026-07-15T06-39-22-04-00-single-owner-retirement-contract.md
.agent/deploy-audit/2026-07-15T06-39-22-04-00-terrain-owner-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-15T06-39-22-04-00-runtime-ahead-single-owner-reconciliation.md
```

## Required authority

`prehistoric-rush-terrain-presentation-single-owner-retirement-authority-domain`

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits: 5
product/page/Worker kits: 17
external/host/render adapters: 14
proof kits: 8
total source-backed surfaces: 66
```

## Next safe ledge

Extract the base adapter's non-terrain services into a patch-world-content adapter. Let the LOD layer exclusively allocate, upload, select, render and release terrain. Remove hidden legacy meshes and publish per-patch adoption and retirement receipts before claiming the matching visible frame.

## Claim boundary

This audit changes documentation only. It does not claim reduced allocations, reduced upload work, correct browser rendering, passing tests, artifact parity, Pages parity or production readiness.