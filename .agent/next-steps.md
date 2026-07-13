# PrehistoricRush Next Steps

**Audit:** `2026-07-13T08-39-12-04-00`  
**Authority:** `prehistoric-rush-terrain-foot-target-coherence-authority-domain`

## Summary

The vertical hind-leg IK slice is implemented. Next work should make terrain samples and target frames revisioned, align patch-stream adoption with simulation/rendering, preserve the existing PlayerPose ownership correction and then prove visible terrain/skeleton coherence.

## Plan ledger

**Goal:** add the minimum identity and admission layer needed around the implemented target math without prematurely building full foot planting.

### Phase 1: Terrain sample identity

- [ ] Add `TerrainSamplerGeneration`.
- [ ] Add committed `PatchStreamRevision`.
- [ ] Identify patch ID, generator version, settings hash and terrain content hash.
- [ ] Replace scalar-only trust with `TerrainSampleCommand` and terminal results.
- [ ] Distinguish ExactPatch, Fallback, Missing, Stale and Failed.

### Phase 2: Sample batching

- [ ] Sample root, left foot and right foot under one immutable batch.
- [ ] Bind session, run generation, tick and source pose frame.
- [ ] Define whether fallback is accepted for root and feet.
- [ ] Retain sampled coordinates, heights and optional normals.
- [ ] Add batch fingerprint and clone-safe readback.

### Phase 3: Target-frame commit

- [ ] Add `TerrainFootTargetFrame` with monotonic revision and predecessor ID.
- [ ] Retain rig revision, source pose frame, sample batch and settings revision.
- [ ] Return Accepted, Duplicate, Stale, Invalid, Cancelled or Failed.
- [ ] Preserve the accepted predecessor on non-accepted results.
- [ ] Admit only accepted target frames into articulated solve.

### Phase 4: Patch-stream ordering

- [ ] Choose an explicit policy: stream-before-solve, deferred activation, or typed resample.
- [ ] Fence patch release/activation against the terrain revision used by a visible frame.
- [ ] Retire stale Worker delivery and sampler callbacks.
- [ ] Reset terrain/target generations on run restart and controller reset.

### Phase 5: Pose and render provenance

- [ ] Publish `PlayerPoseFrame` rather than only the solved pose body.
- [ ] Attach target-frame and terrain revisions.
- [ ] Preserve the existing simulation-owned pose path.
- [ ] Publish `PresentationPoseFrame` after damping.
- [ ] Publish a bounded visible terrain/skeleton fingerprint.
- [ ] Acknowledge the first complete matching frame.

### Phase 6: Gameplay expansion after coherence

- [ ] Add explicit stance/swing classification.
- [ ] Add authored maximum vertical correction and reach status.
- [ ] Add contact enter/hold/release results.
- [ ] Add slope normal sampling and optional foot orientation.
- [ ] Add planting only after target/terrain revisions are proven.

### Phase 7: Fixtures

- [ ] Run clean-checkout `npm test`.
- [ ] Add exact versus fallback sample tests.
- [ ] Add patch activation/release boundary tests.
- [ ] Instantiate the composed engine and execute the solve.
- [ ] Prove stale target predecessor preservation.
- [ ] Prove restart generation isolation.
- [ ] Compare visible terrain and skeleton at 30/60/120/144 Hz.
- [ ] Run built-output and GitHub Pages smokes.

## Retained priorities

PlayerPose frame provenance, collision-source convergence, Core Input adoption, viewport authority and browser-runtime retirement remain unresolved. The terrain target authority should compose with those boundaries rather than replacing them.

## Completion gate

Do not mark terrain IK coherence complete until every accepted target cites one sample batch and terrain revision, the solve and PlayerPose cite that target frame, patch activation cannot silently alter the visible ground, and the first matching terrain/skeleton frame is acknowledged.