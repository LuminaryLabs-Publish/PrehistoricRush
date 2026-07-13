# PrehistoricRush Known Gaps

**Audit:** `2026-07-13T08-39-12-04-00`  
**Status:** `terrain-aware-hind-leg-ik-central-reconciled`  
**Technical status:** `terrain-aware-hind-leg-ik-implemented-static-proof`

## Summary

Terrain-aware hind-leg targets are now part of the authoritative solve, but terrain sampling, target publication, patch streaming and visible presentation do not share one revisioned frame contract.

## Plan ledger

**Goal:** keep every unresolved terrain-sample, target, pose, streaming, presentation and proof gap explicit while preserving the implemented vertical IK path.

### Terrain sample gaps

- [ ] Height sampler has no identity or generation.
- [ ] Active patch membership has no committed revision exposed to the game domain.
- [ ] Scalar return does not distinguish exact patch from fallback.
- [ ] No patch ID, generator version, settings hash or terrain content hash is retained.
- [ ] Root and two foot samples have no common batch identity.
- [ ] Missing, stale, cancelled and failed samples are not typed.
- [ ] Terrain normals are generated but not sampled for foot targets.

### Foot-target gaps

- [ ] No immutable `TerrainFootTargetFrame`.
- [ ] No target revision, predecessor ID or commit result.
- [ ] No target settings revision.
- [ ] No stale or duplicate target rejection.
- [ ] No maximum vertical correction or reach/clamp product result.
- [ ] No explicit stance/swing/contact lifecycle.
- [ ] No cross-frame planting or target smoothing.

### Streaming-order gaps

- [ ] IK samples terrain during `engine.tick(dt)` before `updateStreaming(state)`.
- [ ] Patch activation/release can change visible terrain before rendering the same browser frame.
- [ ] No stream-before-solve, deferred-activation or resample policy is authored.
- [ ] Late Worker delivery is not generation-fenced against target frames.
- [ ] Controller reset and sampler replacement do not publish retirement results.

### Pose and publication gaps

- [ ] `PlayerPose` stores only the solved pose body.
- [ ] No target-frame or terrain revision is attached to the pose.
- [ ] Articulated solve failure/stale results are not retained by the product domain.
- [ ] Public snapshots do not expose bounded sample/target status.
- [ ] Compatibility solve APIs remain available outside authoritative publication.

### Presentation gaps

- [ ] Render-time damping has no presentation generation.
- [ ] Visible terrain has no patch/content fingerprint.
- [ ] Visible bone transforms have no bounded fingerprint.
- [ ] No terrain/skeleton coherent frame result exists.
- [ ] No first matching visible frame acknowledgement exists.

### Test gaps

- [ ] New target and authority tests were not independently executed in this run.
- [ ] No composed-engine execution of terrain target generation.
- [ ] No exact-versus-fallback fixture.
- [ ] No patch activation/release boundary fixture.
- [ ] No stale sample or target predecessor-preservation fixture.
- [ ] No restart generation fixture.
- [ ] No slope or unreachable-target fixture.
- [ ] No browser, built-output or Pages terrain/skeleton correlation fixture.

## Retained gaps

Pose-frame provenance still lacks a complete simulation-to-visible identity chain. Collision-source convergence, Core Input adoption, viewport authority and browser-runtime retirement remain unresolved independent boundaries.

## Non-claims

The current code proves source-backed vertical terrain IK and deterministic target math. It does not prove patch-stream coherence, planted-foot stability, slope alignment, target-frame atomicity, visible terrain/skeleton equivalence, runtime test passage or deployed parity.