# PrehistoricRush Known Gaps

**Audit:** `2026-07-17T02-50-44-04-00`  
**Status:** `product-vegetation-runtime-fixture-authority-audited`

## Summary

The new tests prove local module resolution, catalog cardinality, cloneability, deterministic patch output, Vegetation instance envelopes, variation ranges, collider presence, and species diversity. They do not execute the actual product Vegetation runtime or production browser/Worker path.

## Intent

Keep product-runtime conformance explicitly unsupported until one executable fixture reaches actual domain construction, main-thread and Worker generation, browser loading, package binding, and the first rendered frame.

## Checklist

- [x] Confirm the product import fixture is included in `npm test`.
- [x] Confirm the import fixture checks function types rather than executing constructors.
- [x] Confirm the dense spawn fixture uses a test-owned placement API.
- [x] Confirm generated trees carry the Vegetation instance schema.
- [ ] Execute and prove the actual product runtime path.

## Runtime fixture gaps

```txt
pinned Nexus Engine import fixture: absent
actual createPrehistoricVegetationRuntime execution: absent
actual catalog registration fixture: absent
actual placement API in dense patch test: absent
actual tree-fidelity provider replacement fixture: absent
```

## Worker and patch gaps

```txt
production Worker initialization fixture: absent
main-thread/Worker instance parity: absent
main-thread/Worker collider parity: absent
Worker module URL and revision proof: absent
FirstProductVegetationPatchAck: absent
```

## Browser and render gaps

```txt
browser import-map fixture: absent
CDN module graph fixture: absent
built-output module graph fixture: absent
Pages-subpath module graph fixture: absent
species/package/frame binding fixture: absent
FirstProductVegetationFrameAck: absent
```

## Evidence classification gap

```txt
test-double evidence classification: implicit
product-runtime conformance result: absent
fixture revision manifest: absent
source/artifact/Pages parity result: absent
```

## Current risk boundary

No current product failure was reproduced. The risk is that source tests may remain green when actual Nexus Engine exports, domain installation, Worker imports, browser URL resolution, package hydration, or rendered-frame binding fail.

## Retained gaps

Semantic vegetation generation identity, tree elevation continuity, form transitions, WebGL recovery, Worker liveness, audio, accessibility, fixed-step pacing, terrain ownership and LOD, creator settlement, feedback, route progress, provider convergence, outcomes, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart, and browser lifecycle remain separate audit families.

## Claim boundary

Do not claim product-runtime, Worker, browser, artifact, Pages, or rendered-frame conformance until executable fixtures pass.