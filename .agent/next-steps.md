# PrehistoricRush Next Steps

**Audit:** `2026-07-17T05-58-55-04-00`  
**Authority:** `prehistoric-rush-jungle-foliage-atmosphere-runtime-adoption-authority-domain`

## Intent

Carry the now-registered card-backed tree and ground-cover catalogs through patch generation, Worker parity, GPU projection, atmosphere lifecycle, and exact-frame proof.

## Checklist

### Phase 1: Validate completed semantic registration

- [x] Import foliage recipes into the product vegetation domain.
- [x] Register card-backed foliage for ten tree species.
- [x] Register six ground-cover species, foliage descriptors, and object bridges.
- [x] Publish ground-cover catalogs and atlas revision through generator options.
- [ ] Add both new modules and expanded catalogs to syntax/import fixtures.
- [ ] Execute `createPrehistoricVegetationRuntime()` and assert all registrations.

### Phase 2: Patch and Worker projection

- [ ] Extend `prehistoric-patch-generator.js` to consume `groundCoverSpecies` and `groundCoverArchetypes`.
- [ ] Emit patch-owned foliage-card and ground-cover instance payloads.
- [ ] Include patch, species, tree-instance, and local-card identity in deterministic seeds.
- [ ] Add explicit near, medium, far, and culled budgets.
- [ ] Apply moisture, elevation, slope, clustering, terrain-height, and route-clearance policy.
- [ ] Carry the same catalog generation through the production Worker handshake.
- [ ] Publish `FoliagePatchProjectionResult`, parity result, and `FirstJunglePatchAck`.

### Phase 3: GPU and atmosphere ownership

- [ ] Bind the 4×2 atlas revision to decoded texture and material generations.
- [ ] Project cards and ground cover through stable patch-owned instance batches.
- [ ] Apply atmosphere once per scene/renderer generation.
- [ ] Reuse or replace owned fill/bounce lights by stable IDs.
- [ ] Snapshot predecessor background, fog, exposure, light, and shadow state.
- [ ] Add quality-aware fog and shadow-map budgets.
- [ ] Retire predecessor GPU and scene resources exactly once.

### Phase 4: Frame proof

- [ ] Bind catalog, patch, Worker, card batch, atlas material, atmosphere, renderer, and viewport revisions.
- [ ] Publish `JunglePresentationProjectionResult`.
- [ ] Publish `FirstJunglePresentationFrameAck` from the exact rendered frame.
- [ ] Prove scene replacement and run restart do not accumulate lights or stale resources.

### Phase 5: Release parity

- [ ] Run source-origin browser fixtures.
- [ ] Run built/static artifact fixtures.
- [ ] Run GitHub Pages subpath fixtures.
- [ ] Fail closed on catalog, Worker, atlas, resource, or frame mismatch.

## Recommended file cut

```txt
src/world/prehistoric-patch-generator.js
src/workers/prehistoric-patch-worker.js
src/render/three-foliage-card-layer.js
src/render/jungle-atmosphere-controller.js
tests/vegetation-product-runtime.mjs
tests/foliage-main-worker-parity.mjs
tests/jungle-atmosphere-lifecycle.mjs
tests/browser/jungle-presentation-frame.html
```

## Compatibility constraints

Preserve existing seeds, route clearance, terrain topology, tree collisions, grass ownership, package forms, transitions, player motion, camera, score, pause, and outcomes. Keep cards and ground cover presentation-only unless a separate collision command explicitly admits them.

## Claim boundary

Do not claim the jungle upgrade is visible or shipped until production patch/Worker projection, GPU lifecycle, atmosphere ownership, and exact-frame fixtures pass on the same revision.
