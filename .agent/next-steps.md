# PrehistoricRush Next Steps

**Audit:** `2026-07-16T14-39-29-04-00`  
**Authority:** `prehistoric-rush-tree-impostor-elevation-row-continuity-authority-domain`

## Summary

Keep the implemented ten-species tree pipeline, exact frame addressing, adjacent-azimuth blending, shared atlas, and exact-frame receipts. Add stateful continuity between captured elevation rows and prove it through rendered sweeps.

## Intent

Prevent abrupt or alternating capture-row selection when the follow camera moves through an elevation midpoint.

## What needs to happen

### Phase 1: Frame-set admission

- [ ] Sort and validate unique captured elevation rows per form.
- [ ] Validate consistent azimuth coverage, frame IDs, UV rectangles, and generation identity.
- [ ] Define explicit edge behavior when only one row or incomplete coverage exists.

### Phase 2: Elevation continuity

- [ ] Resolve lower and upper rows around the current view elevation.
- [ ] Choose and version the deadband/interpolation policy.
- [ ] Retain continuity state by tree, form, package generation, and camera generation.
- [ ] Reject stale row transitions after patch, form, package, or camera retirement.

### Phase 3: Combined frame weighting

- [ ] Resolve circular azimuth neighbors inside each admitted row.
- [ ] Combine elevation and azimuth weights into up to four exact frame bindings.
- [ ] Normalize weights and enforce a predictable per-form instance budget.
- [ ] Compose continuity weights with existing form-transition fade.

### Phase 4: Results and diagnostics

- [ ] Publish `TreeImpostorViewContinuityResult`.
- [ ] Expose admitted rows, exact frame IDs, normalized weights, policy revision, and transition state.
- [ ] Extend binding digests to prove continuity state.
- [ ] Publish `FirstContinuousImpostorFrameAck` after the matching frame renders.

### Phase 5: Proof

- [ ] Add below/at/above midpoint source fixtures.
- [ ] Add slow elevation sweep and midpoint camera-bob fixtures.
- [ ] Add jump, terrain-height, camera-reset, and stale-generation fixtures.
- [ ] Add far/horizon and LOD-crossfade composition fixtures.
- [ ] Run `npm test`.
- [ ] Run browser pixel, built-output, and Pages parity fixtures.

## Recommended file cut

```txt
src/render/tree-impostor-elevation-continuity-domain.js
src/render/tree-impostor-elevation-bracket-kit.js
src/render/tree-impostor-bilinear-frame-weight-kit.js
src/render/tree-impostor-continuity-state-kit.js
src/render/tree-impostor-view-continuity-result-kit.js

tests/tree-fidelity-elevation-continuity.mjs
tests/tree-fidelity-elevation-render-fixture.mjs
```

## Compatibility constraints

Do not change tree generation seeds, species selection, stable tree/collider identity, package generations, atlas content, fidelity thresholds, LOD hysteresis, dither duration, player physics, terrain, camera behavior, or scoring while introducing this presentation authority.

## Do not claim

Do not claim elevation-row continuity, browser visual correctness, artifact parity, Pages parity, or production readiness until the full fixture matrix passes.