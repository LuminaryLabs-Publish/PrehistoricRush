# PrehistoricRush Next Steps

**Audit:** `2026-07-17T14-40-21-04-00`  
**Authority:** `prehistoric-rush-pinned-vegetation-provider-admission-browser-worker-parity-authority-domain`

## Intent

Turn the repaired provider pin into an executable startup contract shared by the browser main realm and patch Worker.

## Checklist

### Phase 1: Provider manifest and source probe

- [ ] Publish the expected Nexus commit, URL and product startup generation as a provider manifest.
- [ ] Import the exact provider revision in an executable source fixture.
- [ ] Construct Core Object Vegetation.
- [ ] Assert `engine.n.vegetationFoliage.createPlacementRecipe` is callable.
- [ ] Register the complete product catalog and record its digest.

### Phase 2: Main-realm admission

- [ ] Replace partial export checks with `ProviderRevisionAdmissionResult` and `VegetationProviderProbeResult`.
- [ ] Classify import, revision, construction, binding and catalog failures.
- [ ] Publish `FirstVegetationRuntimeReadyAck` before streaming admission.

### Phase 3: Worker parity

- [ ] Include provider revision, module identity, catalog digest and binding digest in Worker-ready evidence.
- [ ] Add a startup deadline and explicit synchronous-fallback settlement.
- [ ] Reject stale ready and patch messages by worker and provider generation.
- [ ] Publish `ProviderRealmParityResult` before using Worker output.

### Phase 4: Patch and frame proof

- [ ] Bind provider generation to patch requests and results.
- [ ] Generate one matching main-thread and Worker patch and compare deterministic digests.
- [ ] Publish `FirstWorkerPatchAck` and `FirstProviderBoundVegetationFrameAck`.

### Phase 5: Release fixtures

- [ ] Run `npm test`.
- [ ] Add browser main-realm and Worker fixtures.
- [ ] Run built-artifact and GitHub Pages fixtures.
- [ ] Record the resolved provider URL and observed commit to catch CDN cache drift.

### Retained work

- [ ] Resolve pause/menu input and simulation semantics.
- [ ] Implement parent render-host generation retirement.

## Recommended file cut

```txt
src/shared/runtime-versions.js
src/shared/prehistoric-vegetation-domain.js
src/game-runtime-lod.js
src/workers/prehistoric-patch-worker.js
tests/vegetation-module-imports.mjs
tests/pinned-vegetation-provider.mjs
tests/browser/vegetation-provider-parity.html
```

## Compatibility constraints

Preserve the current provider pin, product catalog, deterministic patch schema, world seed behavior, rendering, collision, pickups, score and gameplay tuning.