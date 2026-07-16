# PrehistoricRush Next Steps

**Audit:** `2026-07-16T12-02-38-04-00`  
**Authority:** `prehistoric-rush-tree-fidelity-asset-adoption-projection-authority-domain`

## Summary

Connect the prepared bundle to world generation and rendering before adding more tree fidelity content.

## Plan ledger

**Goal:** produce one accepted tree-fidelity generation that controls patch identity, render forms and visible proof.

### Phase 1: Canonical asset identity

- [ ] Make `PREHISTORIC_TREE_ARCHETYPES` the single authored source.
- [ ] Derive compatibility tuples instead of maintaining an independent game-runtime list.
- [ ] Validate manifest and all five package dependencies.
- [ ] Compute package and generation digests.
- [ ] Publish `TreeFidelityPreparationResult`.

### Phase 2: Runtime adoption

- [ ] Pass the preparation result into `game-runtime-lod.js` explicitly.
- [ ] Remove the implicit `globalThis` handoff as the authority boundary.
- [ ] Publish `TreeFidelityAdoptionCommand` and `TreeFidelityAdoptionResult`.
- [ ] Bind package generation to game, world-generator and render generations.
- [ ] Reject stale, partial and mismatched package sets.

### Phase 3: Patch and cache binding

- [ ] Store `archetypeId`, `packageAssetId` and `packageDigest` in tree records.
- [ ] Add the fidelity digest to generator and vegetation settings identity.
- [ ] Invalidate cached patches produced by another package generation.
- [ ] Preserve deterministic placement and collision semantics.

### Phase 4: Render materialization

- [ ] Materialize near and medium mesh recipes.
- [ ] Materialize far and horizon impostor atlases.
- [ ] Select forms from projected-size thresholds.
- [ ] Apply package hysteresis and dither-crossfade policy.
- [ ] Key GPU resources by package digest and renderer generation.
- [ ] Preserve instance-batch capacity and release semantics.

### Phase 5: Lifecycle

- [ ] Share cache warming without sharing route authority.
- [ ] Cancel outstanding route-owned requests on navigation.
- [ ] Dispose menu and game capture providers and temporary renderers.
- [ ] Retire package-bound GPU resources on route or render-generation exit.
- [ ] Define a typed optional/fallback policy for unavailable capture or cache providers.

### Phase 6: Proof

- [ ] Expand the Node test to validate package schema and dependency graph.
- [ ] Add deterministic provider and cache fixtures.
- [ ] Add a browser preparation/adoption fixture.
- [ ] Force each near/medium/far/horizon form.
- [ ] Test one form transition and stale-generation rejection.
- [ ] Publish `FirstTreeFidelityBoundFrameAck`.
- [ ] Run `npm test`.
- [ ] Run source, staged artifact and Pages parity fixtures.