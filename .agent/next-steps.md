# PrehistoricRush Next Steps

**Audit:** `2026-07-15T05-38-36-04-00`  
**Authority:** `prehistoric-rush-terrain-lod-patch-render-admission-authority-domain`

## Summary

Repair the producer/consumer contract first. Then connect the existing LOD topology and clay texture helpers to the active Three.js adapter without changing patch, physics or gameplay ownership.

## Plan ledger

**Goal:** move from a runtime-breaking terrain field mismatch to validated, atomic and observable LOD patch adoption.

### Phase 1: Schema convergence

- [ ] Add a versioned terrain patch schema with source resolution, array lengths, material revision and bounds.
- [ ] Remove the conflicting legacy `cfg.segments` authority or derive it from the accepted policy.
- [ ] Reject mismatched Worker and synchronous patch results before adapter mutation.
- [ ] Add typed capacity and schema failures.

### Phase 2: Active LOD integration

- [ ] Import `createTerrainLodTopology`, `createTerrainPatchVertexData` and `selectPrehistoricTerrainLodLevel` into the active adapter.
- [ ] Cache shared topology and per-level index buffers.
- [ ] Select near, medium or far LOD from one accepted camera/focus snapshot.
- [ ] Apply hysteresis and geomorph state with explicit patch revisions.
- [ ] Keep skirts active at mixed-resolution boundaries.

### Phase 3: Material integration

- [ ] Create clay normal and roughness resources once per renderer generation.
- [ ] Bind world-space UVs, normal map, roughness map and tuned material values.
- [ ] Dispose textures and geometry deterministically on adapter retirement.
- [ ] Preserve the predecessor resources if candidate creation fails.

### Phase 4: Atomic adoption

- [ ] Stage geometry, attributes, indices, morph data and material before publishing patch membership.
- [ ] Publish `TerrainPatchRenderAdmissionResult` with schema, policy, level and resource receipts.
- [ ] Reject stale Worker results and superseded policy generations.
- [ ] Publish `FirstTerrainLodFrameAck` after the accepted patch is visible.

### Phase 5: Fixtures

- [ ] Add the 30-config/64-source mismatch fixture.
- [ ] Add near, medium and far topology/capacity fixtures.
- [ ] Add Worker/synchronous parity and stale-result fixtures.
- [ ] Add mixed-LOD skirt and geomorph visual fixtures.
- [ ] Add clay texture creation/disposal fixtures.
- [ ] Run `npm test`, browser, built-output and Pages checks.