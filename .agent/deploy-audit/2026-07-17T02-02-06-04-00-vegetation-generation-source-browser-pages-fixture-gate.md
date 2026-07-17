# Vegetation Generation Source / Browser / Pages Fixture Gate

**Timestamp:** `2026-07-17T02-02-06-04-00`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Required fixture matrix

### Source

- Verify all ten archetypes register one species, tree, foliage, and object descriptor.
- Verify semantic fidelity profiles are registered and used for package builds.
- Verify package generations include semantic descriptor hashes.
- Verify species/package bindings are complete and one-to-one.
- Verify patch cache keys include the composite generation digest.

### Determinism

- Generate the same patch on main thread and Worker with the same seed.
- Compare selected species IDs, variation values, matrices, bounds, colliders, and patch digest.
- Reorder catalog source input and prove stable identity or explicit rejection.
- Change one species/tree/foliage descriptor and prove cache/package invalidation.

### Worker

- Match expected and returned Worker catalog generations.
- Reject mismatched, stale, missing, and duplicate Worker generations.
- Prove generation waits for successful initialization.
- Prove Worker failure settles every request.

### Browser/cache

- Build packages from semantic profiles.
- Reload with IndexedDB cache retained.
- Reject an older cached vegetation generation.
- Navigate menu to game and hard reload game.
- Verify asset, patch, and frame acknowledgements use one digest.

### Build and Pages

- Run `npm test`.
- Smoke the built/static artifact.
- Smoke the deployed Pages origin.
- Compare source, artifact, and deployed generation manifests and first-frame receipts.

## Release claim gate

Do not claim semantic vegetation fidelity adoption, Worker parity, cache correctness, species-package convergence, artifact parity, Pages parity, or production readiness until the full matrix passes on the final commit.

## Current execution

Source and commit deltas were inspected. No executable fixture, package rebuild, Worker mismatch test, IndexedDB migration, browser smoke, artifact smoke, or Pages smoke was run by this documentation pass.
