# PrehistoricRush Current Audit

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Reviewed repository head:** `3b26af5116d4735564a2da109b36d32ed7b95a0b`  
**Status:** `jungle-runtime-integrated-render-host-retirement-authority-audited`

## Summary

The jungle presentation is integrated and source-gated. Core Vegetation registers card-backed tree foliage and six ground-cover species; main-thread and Worker patch generation carry ecological ground cover; tree fidelity builds card-backed packages; Three.js creates a procedural atlas, lush foliage and ground-cover layers, atmosphere state, diagnostics, and a foliage-revision-bound frame acknowledgement. Syntax and foliage contract fixtures are wired into `npm test`.

The current gap is retirement. `createThreePatchStreamLodAdapter().dispose()` releases the added terrain/fidelity/foliage/ground-cover/atlas layers, but the base adapter has no disposal service. Base renderer, canvas, scene meshes/materials, grass, shards, player resources, base lights, atmosphere lights, predecessor scene state, and stale render callbacks are not settled through one generation result.

## Intent

Bind every render resource and callback to one host generation and retire it exactly once before restart, remount, route exit, or WebGL recovery.

## Checklist

- [x] Inspect the full Publish inventory and central ledger state.
- [x] Select only PrehistoricRush through runtime-ahead priority.
- [x] Reconcile semantic, patch, Worker, fidelity, GPU, atmosphere, frame, and test integration.
- [x] Preserve the complete 97-surface inventory.
- [x] Identify the render-host retirement boundary.
- [ ] Implement parent host disposal and atmosphere restoration.
- [ ] Prove repeated construction, restart, recovery, browser, artifact, and Pages behavior.

## Interaction loop

```txt
catalog registration
  -> Worker/main-thread patch generation
  -> ecological ground cover and tree instances
  -> tree-fidelity packages and captures
  -> foliage atlas, lush card layer, ground-cover layer, atmosphere
  -> projected-size LOD, hysteresis, crossfade, wind, tint
  -> lushVegetationFrameAck and startup admission
  -> source syntax and foliage contract gates

retirement today
  -> child jungle layers dispose
  -> base host and atmosphere ownership remain unsettled
```

## Current gap

```txt
jungle semantic/runtime integration: present
main-thread and Worker ground-cover generation: present
foliage atlas and card layers: present
atmosphere composition: present
lush frame acknowledgement: present
new module syntax coverage: present
foliage contract fixture: present

base adapter dispose service: absent
base renderer/context retirement: absent
canvas host detachment: absent
base geometry/material/player retirement: absent
atmosphere light removal/restoration: absent
stale frame rejection after retirement: absent
RenderHostRetirementResult: absent
FirstRetiredRenderHostAck: absent
```

## Required authority

`prehistoric-rush-render-host-generation-retirement-authority-domain`

## Boundary

Source inspection confirms integration and test wiring. Runtime cleanup and executable browser/deployment fixtures were not changed or run by this audit.
