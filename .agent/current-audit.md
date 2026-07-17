# PrehistoricRush Current Audit

**Timestamp:** `2026-07-17T06-23-59-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Reviewed repository head:** `3b26af5116d4735564a2da109b36d32ed7b95a0b`  
**Reviewed runtime source head:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`  
**Status:** `render-host-generation-retirement-authority-audited`

## Summary

The jungle presentation is integrated and source-gated. Core Vegetation registers card-backed tree and ground-cover species; main-thread and Worker patch generation carry ecological ground cover; tree fidelity builds card-backed packages; Three.js creates a procedural atlas, lush foliage and ground-cover layers, atmosphere state, diagnostics and a foliage-revision-bound frame acknowledgement. Syntax and deterministic foliage fixtures are wired into `npm test`.

The current gap is parent retirement. `createThreePatchStreamLodAdapter().dispose()` releases terrain LOD, tree fidelity, lush foliage, ground cover and the foliage atlas, but the base adapter has no disposal service. Base renderer, canvas, scene resources, active patch ownership, Worker/listener state, atmosphere mutations and stale callbacks are not settled through one generation result.

## Intent

Bind every render resource, browser participant and callback to one host generation and retire it exactly once before route replacement, remount or WebGL recovery.

## Checklist

- [x] Inspect the full Publish inventory and central ledger state.
- [x] Select only PrehistoricRush through runtime-ahead priority.
- [x] Reconcile semantic, patch, Worker, fidelity, GPU, atmosphere, frame and test integration.
- [x] Preserve the complete 97-surface inventory and offered services.
- [x] Identify the parent render-host retirement boundary.
- [x] Add the `2026-07-17T06-23-59-04-00` tracker and focused audits.
- [ ] Implement parent host disposal, atmosphere restoration and stale-result rejection.
- [ ] Prove repeated construction, restart, recovery, browser, artifact and Pages behavior.

## Interaction loop

```txt
catalog and asset admission
  -> main-thread/Worker deterministic patch generation
  -> ecological tree and ground-cover instances
  -> tree-fidelity packages and captures
  -> foliage atlas, lush card layer, ground-cover layer and atmosphere
  -> projected-size LOD, hysteresis, crossfade, wind and tint
  -> engine tick, stream update and Three.js render
  -> lushVegetationFrameAck and startup generation admission
  -> source syntax and deterministic foliage contract gates

retirement today
  -> child jungle/LOD layers dispose
  -> base host, browser participants and atmosphere ownership remain unsettled
```

## Domains in use

```txt
browser route, import/module cache, DOM, input, lifecycle, RAF, storage, IndexedDB, Worker and CDN
Nexus Engine runtime, scene, spatial, creature, character, player, physics, simulation, motion, camera, animation, graphics, UI, diagnostics, composition and presentation
Core Assets, Startup, Input, Object, Shape, Capture, Fidelity, Vegetation, Ecology, Tree, Foliage and Object Bridge
NexusEngine-Kits seed, procedural creature, instance batch, patch control and camera smoothing
PrehistoricRush run, route, player, pose, pause, terrain, patch, tree, grass, foliage cards, ground cover, pickup and outcome
Three.js renderer, canvas, context, scene, camera, fog, lights, shadows, materials, atlas, instancing and GPU lifecycle
Rapier, source tests, static delivery, Pages and audit governance
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
frame-admission retirement latch: absent
active patch and Worker settlement: absent
browser listener retirement: absent
base renderer/context retirement: absent
canvas host detachment: absent
base geometry/material/player retirement: absent
atmosphere light removal and state restoration: absent
stale frame/result rejection after retirement: absent
RenderHostRetirementResult: absent
FirstRetiredRenderHostAck: absent
```

## Required authority

`prehistoric-rush-render-host-generation-retirement-authority-domain`

## Boundary

Source inspection confirms integration and test wiring. Runtime cleanup and executable browser/deployment fixtures were not changed or run by this audit.