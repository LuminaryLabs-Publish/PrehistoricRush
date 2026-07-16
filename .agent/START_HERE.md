# START HERE: PrehistoricRush

**Last aligned:** `2026-07-16T12-47-00-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed pre-audit documentation head:** `4c353057e1aa58d71c917a5aa4c1b4afa4d7e886`  
**Reviewed runtime source revision:** `9c62bc402451aea7588373f760883517281b9a39`  
**Status:** `tree-impostor-view-frame-addressing-authority-audited`

## Summary

PrehistoricRush was selected as the only runtime-ahead eligible repository. Exact tree generation identity, four-form selection, hysteresis, dither crossfade, required atlas decoding, and decoded-image renderer admission are now implemented in source. The focused remaining gap is impostor view addressing: far captures contain multiple elevations, but rendering selects only azimuth and assumes one atlas row instead of resolving an exact frame record.

## Intent

Preserve the working tree-fidelity pipeline while making every far or horizon billboard select one revision-bound atlas frame from camera azimuth and elevation.

## What needs to happen

```txt
camera + tree bounds
  -> derive azimuth and elevation
  -> resolve an exact package frame record
  -> validate atlas rectangle and generation
  -> bind the frame to the billboard batch
  -> render and acknowledge the matching frame
```

## Checklist

- [x] Compare all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Select only runtime-ahead PrehistoricRush.
- [x] Reconcile nine post-ledger runtime commits.
- [x] Trace generation identity, four-form transitions, atlas decoding, texture admission, rendering, tests, and Pages workflow.
- [x] Document all 78 active named surfaces and services.
- [x] Define one impostor view/frame-addressing authority with 18 coordinating surfaces.
- [x] Add the `2026-07-16T12-47-00-04-00` audit family on `main`.
- [ ] Implement exact elevation-aware frame addressing and executable browser/build/Pages fixtures.

## Main finding

```txt
multi-angle far capture: present
multiple far elevations: present
horizon capture: present
required image decoding: present
decoded-image render admission: present
azimuth selection: present

camera elevation selection: absent
exact frame-record selection: absent
frame rectangle adoption: absent
atlas row derived from frame metadata: absent
frame-generation result: absent
FirstExactImpostorFrameAck: absent
functional visual fixture: absent
```

## Current audit family

```txt
.agent/trackers/2026-07-16T12-47-00-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-16T12-47-00-04-00.md
.agent/architecture-audit/2026-07-16T12-47-00-04-00-tree-impostor-view-addressing-dsk-map.md
.agent/render-audit/2026-07-16T12-47-00-04-00-atlas-frame-visible-view-gap.md
.agent/gameplay-audit/2026-07-16T12-47-00-04-00-camera-elevation-impostor-loop.md
.agent/interaction-audit/2026-07-16T12-47-00-04-00-impostor-frame-command-result-map.md
.agent/tree-system-audit/2026-07-16T12-47-00-04-00-impostor-frame-addressing-contract.md
.agent/deploy-audit/2026-07-16T12-47-00-04-00-impostor-angle-fixture-gate.md
.agent/central-sync-audit/2026-07-16T12-47-00-04-00-runtime-ahead-impostor-frame-reconciliation.md
```

## Required authority

`prehistoric-rush-tree-impostor-view-frame-addressing-authority-domain`

## Kit census

```txt
Nexus Engine root/subdomain kits: 24
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 23
external/host/capture/render adapters: 17
proof kits: 9
total active named surfaces: 78
planned view/frame-addressing surfaces: 18
```

## Claim boundary

Documentation only. No elevation-aware frame selection, exact atlas-addressing correctness, artifact parity, Pages parity, or production readiness is claimed.