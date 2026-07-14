# PrehistoricRush Next Steps

**Audit:** `2026-07-14T14-01-07-04-00`  
**Authority:** `prehistoric-rush-runtime-provider-revision-convergence-authority-domain`

## Summary

Keep the existing Core, product, stable-kit, ProtoKit, Three.js, Rapier, streaming, and creator structures. Replace the duplicated NexusEngine revision sources with one route provider manifest and make startup reject mixed provider graphs before any gameplay or rendering participant is adopted.

## Plan ledger

**Goal:** make each browser route compose from one immutable and observable provider graph.

### Phase 1: Canonical provider manifest

- [ ] Add one `RouteProviderManifest` containing NexusEngine, stable-kit, ProtoKit, Three.js, and Rapier identities.
- [ ] Derive both direct module URLs and the `nexusengine` import-map entry from that manifest.
- [ ] Remove or replace stale hard-coded provider mappings in `game.html` and `charactercreator.html`.
- [ ] Give the manifest a schema version and immutable revision.

### Phase 2: Dependency receipts

- [ ] Add provider revision markers or receipts for root runtime, stable kits, and ProtoKits.
- [ ] Record whether each kit used imported or injected runtime helpers.
- [ ] Compare every transitive `nexusengine` dependency with the canonical provider revision.
- [ ] Reject unknown, mixed, or incompatible provider identities.

### Phase 3: Atomic route admission

- [ ] Add `RouteProviderAdmissionCommand` and typed result classes.
- [ ] Prepare engine, physics, Worker, renderer, listeners, and route host as candidates.
- [ ] Adopt all participants only after provider and capability probes pass.
- [ ] Dispose all candidates and preserve a DOM fallback on rejection.
- [ ] Reject stale and superseded startup attempts.

### Phase 4: Diagnostics and presentation

- [ ] Expose the resolved `ModuleGraphManifest`, not only configured commit constants.
- [ ] Bind public host state to the accepted provider attempt.
- [ ] Publish `FirstProviderConvergedFrameAck` for game and creator routes.
- [ ] Include route, module-graph, renderer, viewport, and frame identities.

### Phase 5: Fixtures

- [ ] Add a same-revision browser success fixture.
- [ ] Add a split-revision import-map rejection fixture.
- [ ] Assert no run, physics, Worker, or RAF starts before provider acceptance.
- [ ] Run `npm test`.
- [ ] Run source, built-output, and GitHub Pages provider-parity checks.
