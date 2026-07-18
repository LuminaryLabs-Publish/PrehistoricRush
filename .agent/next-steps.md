# PrehistoricRush Next Steps

**Audit:** `2026-07-18T05-40-17-04-00`  
**Authority:** `prehistoric-rush-production-forest-legacy-vegetation-work-retirement-authority-domain`

## Intent

Keep the new production forest presentation while retiring superseded legacy vegetation work and proving generation, capacity, patch and frame convergence.

## Checklist

### Phase 1: Presentation authority

- [ ] Create `ProductionForestGenerationResult` with renderer, density, atlas, material and patch-generator revisions.
- [ ] Select one authoritative grass/forest presentation path before host construction.
- [ ] Expose the selected authority through the runtime snapshot.

### Phase 2: Retire legacy work

- [ ] Prevent legacy grass meshes and batch controllers from being created when production forest is authoritative.
- [ ] Stop legacy grass `replaceCell`, `releaseCell`, `flush` and per-frame uniform work.
- [ ] Publish `LegacyVegetationRetirementResult` with retired hosts, batches and resources.
- [ ] Preserve gameplay colliders, pickups, terrain and non-superseded patch data.

### Phase 3: Capacity and patch convergence

- [ ] Version bark, canopy, grass and ground-detail capacity policy.
- [ ] Classify overflow by family, patch, reason and accepted degradation.
- [ ] Bind patch cache identity and density policy to production records.
- [ ] Reject stale patch records from earlier production generations.
- [ ] Make disposal settle all atlas clones, materials, geometries, batches and patch records.

### Phase 4: Visible-frame proof

- [ ] Publish `ProductionForestFrameDigest` with generation, active patches, capacities, overflow and retirement state.
- [ ] Publish `FirstProductionForestBoundFrameAck` only after the accepted generation is visible.
- [ ] Include the digest in startup and public host snapshots.

### Phase 5: Executable proof

- [ ] Run `npm test`.
- [ ] Add a layer-construction and patch activate/update/release fixture.
- [ ] Assert zero legacy grass batch work under production authority.
- [ ] Add capacity overflow, stale patch and disposal fixtures.
- [ ] Add browser, built-artifact and GitHub Pages frame-convergence fixtures.

### Retained work

- [ ] Complete startup failure recovery.
- [ ] Complete foliage family/atlas convergence.
- [ ] Complete pinned-provider admission.
- [ ] Resolve pause/menu input and simulation semantics.
- [ ] Implement parent render-host generation retirement.

## Recommended file cut

```txt
src/render/three-patch-stream-adapter.js
src/render/three-patch-stream-lod-adapter.js
src/render/three-production-forest-layer.js
src/game-runtime-lod.js
tests/production-forest-retirement.mjs
tests/browser/production-forest-retirement.html
```

## Compatibility constraints

Preserve route readability, deterministic patch generation, tree and ground-cover selection, player collision, pickups, score, pause, outcome tuning, startup receipts, current production forest appearance and fallback compatibility.