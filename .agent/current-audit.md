# PrehistoricRush Current Audit

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Reviewed runtime head:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`  
**Status:** `jungle-runtime-integrated-render-host-retirement-authority-audited`

## Summary

The jungle presentation is now integrated. Core Vegetation registers card-backed tree foliage and six ground-cover species; main-thread and Worker patch generation carry ecological ground cover; tree fidelity builds card-backed packages; Three.js creates a procedural foliage atlas, lush foliage and ground-cover layers, atmosphere state, diagnostics, and a foliage-revision-bound frame acknowledgement.

The current gap is retirement. `createThreePatchStreamLodAdapter().dispose()` releases the added terrain/fidelity/foliage/ground-cover/atlas layers, but the base adapter has no disposal service. Base renderer, canvas, scene meshes/materials, grass, shards, player resources, base lights, atmosphere lights, predecessor scene state, and stale render callbacks are not settled through one generation result.

## Intent

Bind every render resource and callback to one host generation and retire it exactly once before restart, remount, route exit, or WebGL recovery.

## Checklist

- [x] Inspect the full Publish inventory and central ledger state.
- [x] Select only PrehistoricRush through runtime-ahead priority.
- [x] Reconcile semantic, patch, Worker, fidelity, GPU, atmosphere, and frame integration.
- [x] Preserve the complete 96-surface inventory.
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

retirement today
  -> child jungle layers dispose
  -> base host and atmosphere ownership remain unsettled
```

## Domains in use

```txt
browser routes, module cache, DOM, input, lifecycle, RAF, storage, IndexedDB, Worker, CDN
Nexus Engine runtime, scene, spatial, creature, character, player, physics, simulation, motion, camera, animation, graphics, UI, diagnostics, composition, presentation
Core Assets, Startup, Object, Shape, Capture, Fidelity, Vegetation, Ecology, Tree, Foliage, Object Bridge
NexusEngine-Kits seed, creature, instance batch, patch streaming, camera follow
PrehistoricRush run, route, player, pose, pause, terrain, patch, tree, grass, foliage cards, ground cover, pickup, outcome
Three.js renderer, canvas, scene, fog, lighting, shadows, materials, atlas, instancing, GPU lifecycle
Rapier, source tests, static delivery, Pages, audit governance
```

## Current gap

```txt
jungle semantic/runtime integration: present
main-thread and Worker ground-cover generation: present
foliage atlas and card layers: present
atmosphere composition: present
lush frame acknowledgement: present

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

Source inspection confirms integration and incomplete retirement. Runtime cleanup and executable fixtures were not changed or run by this audit.
