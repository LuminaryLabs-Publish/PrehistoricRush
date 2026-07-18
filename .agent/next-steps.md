# PrehistoricRush Next Steps

**Audit:** `2026-07-18T14-40-12-04-00`  
**Authority:** `prehistoric-rush-natural-tree-growth-compute-capture-fidelity-convergence-authority-domain`

## Intent

Make the accepted natural-growth plan the single source for tree geometry, Shape forms, captures, fidelity packages and presented frames.

## Checklist

### Phase 1: Growth generation identity

- [ ] Create `TreeGrowthGenerationResult` with engine, catalog, compute-provider, archetype, quality and revision identity.
- [ ] Compute a deterministic digest for each accepted near/medium growth plan.
- [ ] Attach descriptor IDs, execution result ID, metrics and validation to the generation result.
- [ ] Reject stale catalog, provider or asset generations.

### Phase 2: Source geometry binding

- [ ] Import `createPrehistoricNaturalTreeObject` into the active fidelity provider.
- [ ] Pass the selected accepted growth plan into `buildTree()`.
- [ ] Replace the legacy source object with the natural growth source object.
- [ ] Publish `NaturalTreeSourceGeometryResult` with plan digest, bounds, triangle count, attributes and resource ownership.
- [ ] Reject source geometry whose archetype or growth-plan identity does not match the request.

### Phase 3: Shape, capture and fidelity convergence

- [ ] Attach the growth-plan digest to Core Object and Object Shape source metadata.
- [ ] Carry the digest into near/medium form metadata.
- [ ] Carry the same digest into far/horizon capture metadata and results.
- [ ] Add the digest to the portable fidelity package generation record.
- [ ] Reject source, capture or package generation mismatches.

### Phase 4: Lifecycle and proof

- [ ] Define ownership and disposal for natural source geometries, shared materials, atlas textures and capture subjects.
- [ ] Publish growth resource retirement receipts after package completion, reset or failure.
- [ ] Publish `TreeGrowthFrameDigest` from the active tree fidelity layer.
- [ ] Publish `FirstGrowthBoundFrameAck` only when the presented form matches the accepted package and plan digest.

### Phase 5: Executable proof

- [ ] Add both new modules to `test:syntax`.
- [ ] Add deterministic growth-plan fixtures for all 12 archetypes and both qualities.
- [ ] Add growth-plan validation, bounds and packed-buffer fixtures.
- [ ] Add natural source portable-geometry fixtures.
- [ ] Add provider source-binding and mismatch-rejection fixtures.
- [ ] Add browser near/medium/far/horizon capture comparison.
- [ ] Add built-artifact and GitHub Pages growth-generation fixtures.
- [ ] Run `npm test`.

### Retained work

- [ ] Complete streamed collision convergence.
- [ ] Retire superseded legacy vegetation work.
- [ ] Complete startup failure recovery.
- [ ] Complete foliage family/atlas convergence.
- [ ] Complete pinned-provider admission.
- [ ] Resolve pause/menu input and simulation semantics.
- [ ] Implement parent render-host generation retirement.

## Recommended file cut

```txt
src/shared/prehistoric-tree-growth-compute.js
src/render/prehistoric-natural-tree-geometry.js
src/shared/prehistoric-tree-fidelity-runtime.js
src/shared/vegetation-tree-fidelity-provider.js
src/shared/tree-fidelity-assets.js
tests/tree-natural-growth-plans.mjs
tests/tree-natural-growth-source-binding.mjs
tests/browser/tree-natural-growth-fidelity.html
package.json
```

## Compatibility constraints

Preserve package IDs, archetype IDs, ecology and placement behavior, current collision dimensions, near/medium/far/horizon selection thresholds, crossfades, startup progress semantics, deterministic seeds, IndexedDB cache invalidation and current gameplay behavior.