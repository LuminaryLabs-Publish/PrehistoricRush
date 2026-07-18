# PrehistoricRush Current Audit

**Timestamp:** `2026-07-18T14-40-12-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Prior repo-local documentation head:** `b734e087e4d70315285fc3ef29b1788c487945b6`  
**Reviewed runtime head:** `3c8175991939632cc9e4029f4554fbebf360f9f5`  
**Status:** `natural-tree-growth-compute-capture-fidelity-convergence-authority-audited`

## Summary

The runtime now installs Core Compute into the isolated tree-fidelity asset runtime. For each of 12 archetypes it creates four buffers, three kernels and one graph, then executes near and medium deterministic natural-growth plans. Plans are validated, packed into branch/foliage/shading arrays and published on `runtime.growthPlans` with `natural-growth-v1` revision metadata.

A new Three.js builder can create roots, wood segments, foliage cards and bounds directly from a growth plan. The active fidelity provider does not use it. `buildTree()` still calls `createPrehistoricTreeObject(THREE, archetype)`, so Object Shape, Core Capture and the final fidelity package remain sourced from the legacy archetype object.

## Intent

Bind growth computation, source geometry, capture and fidelity packaging to one accepted generation and digest.

## Checklist

- [x] Inspect organization and central-ledger selection state.
- [x] Select and modify only PrehistoricRush.
- [x] Reconcile four runtime commits.
- [x] Identify the interaction loop, domains, kits and offered services.
- [x] Document Core Compute and natural-growth services.
- [x] Confirm all 12 archetypes receive near/medium plan preparation.
- [x] Confirm growth revision metadata reaches package descriptors.
- [x] Confirm the natural geometry builder exists.
- [x] Confirm the active provider remains bound to legacy source geometry.
- [x] Expand the implemented census to 103 surfaces.
- [x] Define 20 proposed growth-convergence surfaces.
- [ ] Bind provider source creation to the accepted growth plan.
- [ ] Add source, deterministic, browser, artifact and Pages fixtures.

## Interaction loop

```txt
open route
  -> preflight modules
  -> create isolated tree-fidelity runtime
  -> install Vegetation and Core Compute
  -> register catalog
  -> prepare and validate near/medium growth plans for 12 archetypes
  -> rebind asset versions to growth revision
  -> load tree packages
  -> active provider builds legacy source tree object
  -> Object Shape derives near/medium forms
  -> Core Capture derives far/horizon forms
  -> hydrate images
  -> start game, stream patches and render tree fidelity forms
```

## Domains in use

```txt
browser ESM, DOM, RAF, Worker, Canvas2D, image decode, storage, lifecycle and Pages
Nexus Engine Assets, Startup, Input, Object, Shape, Capture, Fidelity, Compute,
Vegetation, Ecology, Tree, Foliage, Scene, Spatial, Creature, Character, Player,
Physics, Articulated Dynamics, Simulation, Motion, Articulation, Camera, Animation,
Graphics, UI, Diagnostics, Composition and Presentation
NexusEngine-Kits seed, creature body, instanced batches, world patches and camera follow
PrehistoricRush startup, natural growth, tree fidelity, run, route, player, pause,
terrain, streaming, collision, vegetation, pickups, score and outcomes
Three.js, Rapier, source tests, deployment, repo-local governance and central tracking
```

## Implemented boundary

```txt
Core Compute installation: present
natural growth compute provider: present
12 archetype descriptor sets: present
near/medium plan execution: present
plan validation: present
branch/foliage/shading packing: present
runtime.growthPlans publication: present
growth revision asset metadata: present
natural Three.js growth geometry builder: present
legacy fidelity provider and package build: present
```

## Current gap

```txt
active provider growth-plan selection: absent
active provider call to natural geometry builder: absent
growth-plan digest in source geometry: absent
source-plan mismatch rejection: absent
capture-plan digest: absent
fidelity-package growth-plan digest: absent
stale growth generation rejection: absent
growth resource retirement receipt: absent
TreeGrowthFrameDigest: absent
FirstGrowthBoundFrameAck: absent
new-module syntax/import fixture: absent
browser/artifact/Pages growth fixture: absent
```

## Required authority

`prehistoric-rush-natural-tree-growth-compute-capture-fidelity-convergence-authority-domain`

## Retained gaps

Streamed collision convergence, production forest retirement, startup recovery, foliage generation convergence, pinned-provider admission, pause arbitration and parent render-host retirement remain proposed and unimplemented.

## Boundary

This pass changes documentation only. No runtime, test, gameplay, rendering, physics, workflow or deployment file was changed.