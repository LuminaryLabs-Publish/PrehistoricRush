# PrehistoricRush Next Steps

**Audit:** `2026-07-15T06-39-22-04-00`  
**Authority:** `prehistoric-rush-terrain-presentation-single-owner-retirement-authority-domain`

## Summary

Keep the base adapter's patch-world services, but remove its terrain renderer from the LOD runtime. Terrain geometry, materials, patch slots, selection and retirement should belong only to the LOD layer.

## Plan ledger

**Goal:** eliminate hidden legacy terrain work without disturbing vegetation, colliders, pickups, height sampling, camera follow, creature presentation or patch-controller ownership.

### Phase 1: Separate roles

- [ ] Split `createThreePatchStreamAdapter()` into terrain presentation and patch-world-content capabilities.
- [ ] Keep active patch membership, height sampling, trees, grass, shards, colliders, pickups, player, camera and renderer hosting in the content path.
- [ ] Move fixed-grid terrain allocation and `applyTerrainPatch()` behind an optional terrain strategy.
- [ ] Require exactly one terrain strategy per adapter generation.

### Phase 2: Make LOD exclusive

- [ ] Configure `createThreePatchStreamLodAdapter()` with the LOD terrain strategy only.
- [ ] Stop allocating `terrainSlots` and `terrainMaterial` for the LOD runtime.
- [ ] Remove `hideLegacyTerrain()` and scene-traversal suppression.
- [ ] Remove the legacy `terrainByPatch` map from the LOD composition.
- [ ] Upload each accepted terrain patch exactly once.

### Phase 3: Version adoption and retirement

- [ ] Publish `TerrainPresentationAdoptionResult` per patch with policy, slot, LOD and material revisions.
- [ ] Bind patch release to one `TerrainPresentationRetirementReceipt`.
- [ ] Preserve content membership if terrain candidate preparation fails, or reject all participants atomically according to one declared policy.
- [ ] Reject stale Worker results, duplicate patch generations and late release commands.
- [ ] Bind `FirstTerrainOwnerFrameAck` to the exact accepted patch revisions.

### Phase 4: Dispose complete renderer state

- [ ] Add a complete base-adapter `dispose()` contract for renderer, geometry, materials, batches, listeners and canvas ownership.
- [ ] Ensure the LOD wrapper composes and calls every participant disposer.
- [ ] Retire clay textures, shared material and all LOD geometries once.
- [ ] Prove repeated start/stop does not accumulate terrain slots or canvases.

### Phase 5: Fixtures

- [ ] Instantiate the LOD adapter with a controlled Three.js test double and count mesh allocations.
- [ ] Assert 25 terrain meshes, not 50, for `activeRadius: 2`.
- [ ] Assert one position/color/normal upload path per patch.
- [ ] Assert release clears one terrain map and one slot.
- [ ] Assert no scene traversal is required to hide terrain.
- [ ] Run `npm test`.
- [ ] Add browser allocation, mixed-LOD, restart/dispose, built-output and Pages fixtures.