# PrehistoricRush Known Gaps

**Audit:** `2026-07-16T12-02-38-04-00`  
**Status:** `tree-fidelity-asset-adoption-projection-authority-audited`

## Summary

Tree-fidelity assets are prepared, cached and required, but no authority adopts them into patch generation, renderer resources or a verified visible frame.

## Plan ledger

**Goal:** keep preparation-to-projection gaps explicit until a package-bound frame is proven from source, build and Pages.

### Asset identity

- [ ] The game runtime maintains a duplicate hard-coded `treeTypes` list.
- [ ] No immutable `TreeFidelityGeneration` exists.
- [ ] No package digest is published.
- [ ] No accepted manifest/package validation result exists.
- [ ] The source contract test does not inspect package payloads or dependency completeness.

### Runtime handoff

- [ ] Game startup stores the asset runtime and receipt only on `globalThis`.
- [ ] `game-runtime-lod.js` does not read the receipt.
- [ ] No explicit preparation-result input reaches the game composition.
- [ ] No `TreeFidelityAdoptionCommand` exists.
- [ ] No `TreeFidelityAdoptionResult` exists.
- [ ] Stale and partial package generations are not rejected.

### World generation

- [ ] Patch tree records contain no package asset ID or digest.
- [ ] Generator version does not include the accepted package generation.
- [ ] Vegetation settings identity does not include the package digest.
- [ ] Cached patches are not invalidated by fidelity-package changes.

### Rendering

- [ ] Near and medium package mesh recipes are not materialized.
- [ ] Far and horizon atlas forms are not materialized.
- [ ] Captured color/opacity observations are not used by the game renderer.
- [ ] Projected-size form selection is absent.
- [ ] Package hysteresis and dither crossfade are absent.
- [ ] GPU resources are not keyed by package and renderer generations.
- [ ] No `FirstTreeFidelityBoundFrameAck` exists.

### Lifecycle

- [ ] Menu and game create separate route-owned asset runtimes.
- [ ] No explicit request cancellation exists on route retirement.
- [ ] No route-level provider/capture-renderer disposal result exists.
- [ ] Required preparation has no authored fallback policy.
- [ ] No diagnostics link cache, provider, package, patch and render revisions.

### Proof

- [ ] No browser bundle/provider fixture exists.
- [ ] No IndexedDB miss/hit fixture exists.
- [ ] No live package-adoption fixture exists.
- [ ] No form-selection or transition fixture exists.
- [ ] No staged artifact or Pages parity fixture exists.

## Retained gaps

WebGL recovery, Worker liveness, game audio, accessibility, host-clock pacing, terrain ownership and LOD, creator profile settlement, feedback, route progress, provider convergence, outcome settlement, player-profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart and browser-runtime retirement remain separate retained audit families.