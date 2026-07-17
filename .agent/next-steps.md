# PrehistoricRush Next Steps

**Audit:** `2026-07-17T02-50-44-04-00`  
**Authority:** `prehistoric-rush-product-vegetation-runtime-fixture-authority-domain`

## Intent

Extend the new source fixtures across the actual product runtime, production Worker, browser module graph, package binding, and first rendered frame without replacing the fast deterministic unit fixture.

## Checklist

### Phase 1: Actual runtime fixture

- [ ] Load the exact pinned Nexus Engine revision used by the game.
- [ ] Call `createPrehistoricVegetationRuntime()`.
- [ ] Verify ten species, tree structures, foliage descriptors, and object bridges.
- [ ] Call `createPrehistoricVegetationGeneratorOptions()` with the actual runtime.
- [ ] Generate a deterministic patch through the actual placement API.

### Phase 2: Worker parity

- [ ] Initialize `prehistoric-patch-worker.js` with the same source and engine revisions.
- [ ] Generate the same patch on main thread and Worker.
- [ ] Compare species IDs, instance envelopes, matrices, bounds, ground authority, and colliders.
- [ ] Publish a typed `MainWorkerPatchParityResult`.

### Phase 3: Browser and frame proof

- [ ] Load the product import graph through the browser import map.
- [ ] Exercise menu/game tree asset preparation.
- [ ] Activate one semantic tree patch.
- [ ] Resolve one species to a fidelity package and exact captured frame.
- [ ] Publish `FirstProductVegetationPatchAck` and `FirstProductVegetationFrameAck`.

### Phase 4: Release parity

- [ ] Run the fixture against source hosting.
- [ ] Run the fixture against built/static output.
- [ ] Run the fixture from the GitHub Pages subpath.
- [ ] Fail closed on revision, Worker, package, or frame mismatch.

### Phase 5: Retained generation authority

- [ ] Keep the prior semantic vegetation/fidelity generation work active.
- [ ] Register semantic fidelity profiles for package builds.
- [ ] Add Worker catalog generation handshake.
- [ ] Bind species, package, cache, patch, collision, and frame generations.

## Recommended file cut

```txt
tests/vegetation-product-runtime.mjs
tests/vegetation-main-worker-parity.mjs
tests/browser/vegetation-product-frame.html
tests/browser/vegetation-product-frame.mjs
src/shared/prehistoric-vegetation-fixture-manifest.js
```

## Compatibility constraints

Preserve current seeds, ecology, tree counts, variation ranges, colliders, route exclusion, terrain topology, package forms, transition settings, camera, gameplay, and renderer performance. Keep the current test-owned fixture as fast patch-algorithm coverage.

## Claim boundary

Do not claim product-runtime, Worker, browser, artifact, Pages, or frame conformance until the final fixture matrix passes on the exact tested revision.