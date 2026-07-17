# PrehistoricRush Next Steps

**Audit:** `2026-07-17T02-02-06-04-00`  
**Authority:** `prehistoric-rush-semantic-vegetation-fidelity-generation-authority-domain`

## Intent

Convert the new Object Vegetation integration from three independently reconstructed catalogs into one accepted generation shared by asset preparation, Worker patches, caches, rendering, and first-frame proof.

## Checklist

### Phase 1: Canonical semantic generation

- [ ] Create one semantic generation manifest from archetype source, species, tree, foliage, object, and fidelity descriptors.
- [ ] Compute stable descriptor hashes and one composite digest.
- [ ] Publish a complete species-to-tree-to-foliage-to-object-to-package binding table.
- [ ] Treat `typeIndex` as derived optimization metadata only.

### Phase 2: Fidelity adoption

- [ ] Register `vegetationTree.createFidelityProfile()` outputs into Object Fidelity.
- [ ] Remove or mechanically derive the duplicated local `treeFidelityProfile()` path.
- [ ] Add semantic descriptor hashes to portable package generation identity.
- [ ] Add the composite digest to bundle, asset, and IndexedDB cache identity.
- [ ] Retire stale cached generations before package adoption.

### Phase 3: Host and Worker admission

- [ ] Send the expected generation digest in `init-patch-worker`.
- [ ] Return Worker species/tree/foliage/object/catalog digests in `patch-worker-ready`.
- [ ] Reject initialization on any mismatch.
- [ ] Include the generation digest in every patch request and result.
- [ ] Reject stale or mixed patches before activation.

### Phase 4: Runtime and frame binding

- [ ] Resolve each rendered tree through `speciesId -> packageGenerationId`.
- [ ] Validate collider, ground sink, bounds, and visual package against the same generation.
- [ ] Publish `VegetationGenerationAdmissionResult`.
- [ ] Publish `FirstDomainBoundAssetAck` after menu/game asset preparation.
- [ ] Publish `FirstDomainBoundPatchAck` after first accepted patch activation.
- [ ] Publish `FirstDomainBoundTreeFrameAck` after the matching rendered frame.

### Phase 5: Proof

- [ ] Add source descriptor/package binding fixtures.
- [ ] Add main-thread versus Worker deterministic parity fixtures.
- [ ] Add mismatched Worker generation rejection fixtures.
- [ ] Add semantic descriptor change/cache invalidation fixtures.
- [ ] Add browser reload and IndexedDB stale-generation fixtures.
- [ ] Run `npm test`.
- [ ] Run static artifact and GitHub Pages parity smokes.

## Recommended file cut

```txt
src/shared/prehistoric-vegetation-generation.js
src/shared/prehistoric-vegetation-manifest.js
src/shared/prehistoric-vegetation-admission.js
src/shared/species-fidelity-package-bindings.js
src/workers/prehistoric-patch-worker.js
src/shared/prehistoric-tree-fidelity-runtime.js
src/shared/tree-fidelity-assets.js
src/game-runtime-lod.js

tests/vegetation-generation-identity.mjs
tests/vegetation-worker-parity.mjs
tests/vegetation-cache-invalidation.mjs
```

## Compatibility constraints

Preserve current seeds, ecological distribution, route exclusion, tree counts, variation ranges, collider behavior, terrain topology, package forms, transition settings, camera behavior, scoring, and renderer performance while adding generation authority.

## Claim boundary

Do not claim semantic profile adoption, Worker parity, cache correctness, species-package convergence, build parity, Pages parity, or production readiness until the full fixture matrix passes on the final runtime commit.
