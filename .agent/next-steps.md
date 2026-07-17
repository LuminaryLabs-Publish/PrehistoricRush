# PrehistoricRush Next Steps

**Audit:** `2026-07-17T05-58-55-04-00`  
**Authority:** `prehistoric-rush-jungle-foliage-atmosphere-runtime-adoption-authority-domain`

## Intent

Adopt the new foliage-card, ground-cover and atmosphere modules through the existing Vegetation, patch, Worker, Graphics and Three.js ownership boundaries.

## Checklist

### Phase 1: Source and catalog admission

- [ ] Add both new modules to syntax/import fixtures.
- [ ] Validate atlas revision, dimensions, unique family IDs and unique in-range atlas cells.
- [ ] Validate scalar ranges, cloneability and catalog immutability.
- [ ] Register foliage-card and ground-cover descriptors through existing Core Vegetation composition.
- [ ] Publish one catalog generation and digest.

### Phase 2: Patch and Worker adoption

- [ ] Include patch, species and tree-instance identity in tree-card placement seeds.
- [ ] Add explicit near, medium, far and culled budgets.
- [ ] Apply moisture, elevation, slope, clustering and route-clearance rules to ground cover.
- [ ] Add the accepted catalogs to the production Worker handshake.
- [ ] Compare main-thread and Worker card/ground-cover payloads.
- [ ] Publish `FoliagePatchProjectionResult` and `FirstJunglePatchAck`.

### Phase 3: GPU and atmosphere ownership

- [ ] Bind the 4×2 atlas revision to decoded texture and material generations.
- [ ] Project foliage cards through stable instance batches with patch-owned release.
- [ ] Apply atmosphere once per scene/renderer generation.
- [ ] Reuse or replace owned fill/bounce lights by stable IDs.
- [ ] Snapshot predecessor background, fog, exposure, light and shadow state.
- [ ] Add quality-aware fog and shadow-map budgets.
- [ ] Retire predecessor GPU and scene resources exactly once.

### Phase 4: Frame proof

- [ ] Bind catalog, patch, card batch, atlas material, atmosphere, renderer and viewport revisions.
- [ ] Publish `JunglePresentationProjectionResult`.
- [ ] Publish `FirstJunglePresentationFrameAck` from the exact rendered frame.
- [ ] Prove scene replacement and run restart do not accumulate lights or stale resources.

### Phase 5: Release parity

- [ ] Run source-origin browser fixtures.
- [ ] Run built/static artifact fixtures.
- [ ] Run GitHub Pages subpath fixtures.
- [ ] Fail closed on revision, Worker, atlas, resource or frame mismatch.

### Retained prior fixture work

- [ ] Execute the actual pinned Core Vegetation runtime fixture.
- [ ] Keep the fast test-owned deterministic placement fixture.
- [ ] Prove actual product runtime, Worker, package and frame convergence.

## Recommended file cut

```txt
src/shared/prehistoric-jungle-presentation-domain.js
src/render/three-foliage-card-layer.js
src/render/jungle-atmosphere-controller.js
src/workers/prehistoric-patch-worker.js
tests/foliage-card-catalog.mjs
tests/foliage-main-worker-parity.mjs
tests/jungle-atmosphere-lifecycle.mjs
tests/browser/jungle-presentation-frame.html
```

## Compatibility constraints

Preserve existing seeds, route clearance, terrain topology, tree collisions, grass ownership, package forms, transition policy, player motion, camera, score, pause and outcome behavior. Keep foliage cards and ground cover presentation-only unless a separate collision command explicitly admits them.

## Claim boundary

Do not claim the jungle upgrade is shipped until the production composition, Worker, GPU lifecycle and exact-frame fixture matrix passes on the same revision.
