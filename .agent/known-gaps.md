# PrehistoricRush Known Gaps

**Audit:** `2026-07-15T06-39-22-04-00`  
**Status:** `terrain-single-owner-render-retirement-authority-audited`

## Summary

The LOD renderer is active, but it is layered over the complete legacy terrain renderer. Hidden legacy meshes still allocate geometry and receive patch uploads, leaving two terrain owners inside one adapter.

## Plan ledger

**Goal:** keep duplicate allocation, upload, ownership, lifecycle and proof gaps explicit until one terrain presentation authority remains.

### Terrain ownership

- [ ] The base adapter always allocates fixed-grid terrain slots.
- [ ] The LOD wrapper cannot request patch-world services without also creating legacy terrain.
- [ ] The LOD layer and base adapter maintain separate patch-to-terrain maps.
- [ ] The runtime has no typed terrain-strategy capability contract.
- [ ] The test treats `hideLegacyTerrain()` as expected integration rather than proving legacy terrain is absent.

### Allocation and upload

- [ ] `activeRadius: 2` allocates 25 legacy terrain meshes and 25 LOD terrain meshes.
- [ ] Every accepted patch writes terrain positions/colors/normals into both paths.
- [ ] The hidden legacy material and index buffers remain allocated.
- [ ] Scene traversal runs after activation to suppress legacy meshes again.
- [ ] No allocation or upload receipt distinguishes mandatory work from compatibility work.

### Adoption and release

- [ ] Terrain admission and base content adoption remain separate mutable operations.
- [ ] Rollback releases the LOD candidate if base adoption fails, but there is no immutable combined result.
- [ ] Patch release mutates both terrain owners independently.
- [ ] No per-patch retirement receipt proves both owners settled.
- [ ] `lastVisibleFrameAck` lacks patch IDs, patch generations, renderer generation and draw receipts.

### Lifecycle

- [ ] The wrapper `dispose()` retires only the LOD layer.
- [ ] The base adapter exposes no complete disposer for renderer, legacy terrain, instanced resources, listeners or canvas ownership.
- [ ] The host exposes the engine and adapter globally without a retirement path.
- [ ] No restart/dispose fixture checks accumulated meshes, canvases or listeners.

### Tests and deployment

- [ ] The terrain test is primarily geometry assertions and source-regex checks.
- [ ] No controlled Three.js adapter instance counts actual terrain allocations.
- [ ] No browser trace measures duplicate patch uploads or scene objects.
- [ ] No mixed-LOD browser screenshot, GPU resource, built-output or Pages fixture is recorded.

## Retained gaps

Creator profile settlement, feedback surfaces, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart and browser-runtime retirement remain separate.