# PrehistoricRush Known Gaps

**Audit:** `2026-07-15T05-38-36-04-00`  
**Status:** `terrain-lod-patch-render-admission-authority-audited`

## Summary

The terrain producer and active renderer use different resolutions, while the new LOD topology and clay material helpers are not connected to patch adoption.

## Plan ledger

**Goal:** keep every schema, geometry, material, lifecycle and proof gap explicit until the active path is repaired and executed.

### Schema and capacity

- [ ] No shared terrain schema revision across generator, Worker, controller and adapter.
- [ ] Runtime config still declares 30 segments while the generator forces 64.
- [ ] No array-length or attribute-capacity admission check.
- [ ] No typed mismatch result before the accepted terrain slot is mutated.
- [ ] Height sampling still derives indices from the legacy config resolution.

### LOD execution

- [ ] Registered LOD policy is not consumed by the active adapter.
- [ ] No accepted focus revision binds a patch to near, medium or far.
- [ ] No active index-buffer swap, hysteresis or geomorph state.
- [ ] No active mixed-resolution skirt policy or boundary receipt.
- [ ] No LOD transition rollback or predecessor preservation.

### Material resources

- [ ] Generated clay normal and roughness textures are not created by the active renderer.
- [ ] World-space UVs from the LOD geometry helper are not bound.
- [ ] Terrain material remains vertex-color-only with roughness `0.94`.
- [ ] No material-generation identity, cache policy or disposal receipt.

### Patch adoption and presentation

- [ ] Patch membership becomes active before renderer preparation is validated.
- [ ] No `TerrainPatchRenderAdmissionResult`.
- [ ] No stale Worker-result rejection bound to policy and adapter generations.
- [ ] No first matching visible terrain-frame acknowledgement.
- [ ] No failed-upload predecessor-slot preservation proof.

### Tests and deployment

- [ ] Existing `npm test` has no terrain LOD integration test.
- [ ] No producer/consumer resolution fixture.
- [ ] No near/medium/far capacity fixture.
- [ ] No mixed-LOD visual, texture lifecycle, built-output or Pages fixture.

## Retained gaps

Creator profile settlement, feedback surfaces, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart and browser-runtime retirement remain separate.