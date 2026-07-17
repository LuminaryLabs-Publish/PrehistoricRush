# PrehistoricRush Next Steps

**Audit:** `2026-07-16T20-01-41-04-00`  
**Authority:** `prehistoric-rush-runtime-module-generation-identity-authority-domain`

## Goal

Replace route-specific Nexus Engine pins with one generated runtime manifest, reject mixed module generations before composition, and prove that the creator and game present frames from the same accepted runtime identity.

## Plan ledger

### Phase 1: Canonical manifest

- [ ] Add one checked-in manifest containing Nexus Engine, NexusEngine-Kits, ProtoKits, Three.js, and Rapier identities.
- [ ] Generate `RUNTIME_URLS` and every document import map from that manifest.
- [ ] Remove hand-maintained route-specific Nexus Engine commit strings.
- [ ] Compute a stable `RuntimeModuleGeneration` and digest.

### Phase 2: Admission

- [ ] Parse and normalize every requested module URL before import.
- [ ] Require the bare `nexusengine` target to equal the canonical Nexus Engine URL.
- [ ] Import a provenance sentinel from each official kit module.
- [ ] Reject descriptor factories, object primitives, or kit definitions from another runtime generation.
- [ ] Publish `RuntimeModuleAdmissionResult` before `createRealtimeGame()`.

### Phase 3: Composition binding

- [ ] Bind asset preparation, creator preview, game engine, patch Worker, physics provider, and renderer to the accepted generation.
- [ ] Include the generation digest in startup receipts and diagnostic snapshots.
- [ ] Reject stale route imports after navigation, reload, or cache replacement.
- [ ] Retire duplicate runtime generations rather than allowing mixed composition.

### Phase 4: Frame acknowledgement

- [ ] Publish `FirstSingleRuntimeCreatorFrameAck` after the first creator frame using the accepted generation.
- [ ] Publish `FirstSingleRuntimeGameFrameAck` after the first game frame using the accepted generation.
- [ ] Include engine, kit, descriptor, asset, physics, and render namespace identities in each acknowledgement.

### Phase 5: Proof

- [ ] Add a source fixture that compares all route import maps with `runtime-versions.js`.
- [ ] Add a browser fixture that records loaded Nexus Engine URLs and module namespace identities.
- [ ] Add stale-cache and duplicate-generation rejection fixtures.
- [ ] Add creator-to-game navigation and hard-reload parity fixtures.
- [ ] Run `npm test`.
- [ ] Run built-output and GitHub Pages module-graph parity fixtures.

## Recommended file cut

```txt
runtime/runtime-manifest.json
scripts/generate-runtime-bindings.mjs
src/shared/runtime-manifest.js
src/shared/runtime-module-admission.js
src/shared/runtime-module-provenance.js
src/shared/runtime-module-generation-result.js

tests/runtime-module-manifest-parity.mjs
tests/runtime-module-browser-identity.mjs
```

## Compatibility constraints

Do not change gameplay seeds, creature profiles, route generation, physics, terrain LOD, patch identity, tree packages, camera behavior, scoring, or render fidelity while unifying module identity.

## Claim boundary

Do not claim single-generation composition, browser cache coherence, cross-route parity, built-output parity, Pages parity, or production readiness until the complete fixture matrix passes.