# PrehistoricRush Next Steps

**Audit:** `2026-07-16T12-02-38-04-00`  
**Authority:** `prehistoric-rush-tree-fidelity-generation-form-transition-authority-domain`

## Summary

Keep the working asset and renderer path. Add exact revision identity and implement the package’s missing horizon and transition semantics.

## Plan ledger

**Goal:** bind one immutable fidelity generation to deterministic patches and stable four-form presentation.

### Phase 1: Exact generation

- [ ] Publish bundle, manifest, provider and package revisions.
- [ ] Compute package digests and one combined fidelity-generation digest.
- [ ] Validate all five packages belong to one generation.
- [ ] Publish `TreeFidelityGenerationResult`.
- [ ] Reject stale or mixed generations.

### Phase 2: Patch and cache binding

- [ ] Add fidelity-generation digest to generator and vegetation settings identity.
- [ ] Add archetype/package identity to tree records.
- [ ] Invalidate or migrate cached patches from another generation.
- [ ] Preserve deterministic placement, transforms and collision.

### Phase 3: Four-form state

- [ ] Retain accepted form per visible tree.
- [ ] Enforce package near, medium, far and horizon ranges.
- [ ] Use far minimum/maximum thresholds.
- [ ] Materialize the horizon package form.
- [ ] Expose all four form counts.

### Phase 4: Transitions

- [ ] Apply package hysteresis before changing form.
- [ ] Implement dither-crossfade using package duration.
- [ ] Bound concurrent transitions.
- [ ] Handle rapid camera movement and patch release during transition.
- [ ] Reject transition work from stale render generations.

### Phase 5: Receipts and diagnostics

- [ ] Enrich startup receipt with exact generation identity.
- [ ] Publish `TreeFidelityProjectionResult`.
- [ ] Publish `FirstExactTreeFidelityFrameAck`.
- [ ] Expose patch generation, form counts, transitions and stale rejections.

### Phase 6: Proof

- [ ] Add functional package and cache fixtures.
- [ ] Add live near/medium/far/horizon selection fixtures.
- [ ] Add threshold oscillation and crossfade fixtures.
- [ ] Add stale generation and cache invalidation fixtures.
- [ ] Run `npm test`.
- [ ] Run source, staged artifact and Pages parity fixtures.