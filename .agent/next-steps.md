# PrehistoricRush Next Steps

**Audit:** `2026-07-17T16-40-37-04-00`  
**Authority:** `prehistoric-rush-foliage-family-closure-atlas-revision-convergence-authority-domain`

## Intent

Turn the implemented descriptor closure and atlas `v2` identity into one executable browser, Worker, patch and frame contract.

## Checklist

### Phase 1: Canonical closure manifest

- [ ] Enumerate referenced family IDs for every tree archetype and every supported LOD form.
- [ ] Canonically sort and digest the eight-family catalog.
- [ ] Digest each descriptor’s family closure and cluster references.
- [ ] Keep registration rejection for every unresolved family.

### Phase 2: Runtime admission

- [ ] Publish `FoliageFamilyClosureResult` during main-realm catalog construction.
- [ ] Publish `AtlasRevisionAdmissionResult` for atlas `prehistoric-foliage-cards-v2`.
- [ ] Bind both results to the current runtime generation.

### Phase 3: Worker and patch parity

- [ ] Include family catalog digest, descriptor digest and atlas revision in Worker-ready evidence.
- [ ] Publish `FoliageRealmParityResult` before Worker patches are admitted.
- [ ] Include atlas/runtime generation on patch requests and results.
- [ ] Reject stale or mismatched Worker and patch results.

### Phase 4: Render proof

- [ ] Admit the renderer atlas against the accepted catalog digest.
- [ ] Extend frame evidence with active family IDs and per-family counts.
- [ ] Publish `FirstFamilyCompleteFoliageFrameAck` after the matching frame submits.

### Phase 5: Release fixtures

- [ ] Run `npm test`.
- [ ] Add near and medium family-closure assertions.
- [ ] Add browser and production Worker fixtures.
- [ ] Add built-artifact and GitHub Pages fixtures.
- [ ] Record resolved revisions, digests, URLs and frame evidence.

### Retained work

- [ ] Complete pinned-provider admission proof.
- [ ] Resolve pause/menu input and simulation semantics.
- [ ] Implement parent render-host generation retirement.

## Recommended file cut

```txt
src/shared/prehistoric-foliage-card-recipes.js
src/shared/prehistoric-vegetation-domain.js
src/workers/prehistoric-patch-worker.js
src/world/prehistoric-patch-generator.js
src/render/three-lush-foliage-layer.js
src/render/three-patch-stream-lod-adapter.js
tests/foliage-card-system.mjs
tests/browser/foliage-family-parity.html
```

## Compatibility constraints

Preserve the eight-family catalog, atlas `v2`, deterministic placement and patch schemas, tree/ground-cover density, route readability, collision, pickups, score and gameplay tuning.