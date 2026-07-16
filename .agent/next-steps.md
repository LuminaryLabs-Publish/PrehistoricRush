# PrehistoricRush Next Steps

**Audit:** `2026-07-16T06-39-16-04-00`  
**Authority:** `prehistoric-rush-webgl-context-gpu-resource-recovery-authority-domain`

## Summary

Add one render-generation and resource-rehydration authority around the current Three.js presentation stack.

## Plan ledger

**Goal:** ensure a lost context produces one bounded recovery or fallback result and one coherent replacement frame.

### Phase 1: Context admission

- [ ] Add immutable document, canvas, renderer and resource generation IDs.
- [ ] Observe `webglcontextlost` and `webglcontextrestored`.
- [ ] Publish `RenderLossResult` exactly once per generation.
- [ ] Define presentation, simulation and input policy during loss.
- [ ] Publish render capability and generation diagnostics.

### Phase 2: Resource registry

- [ ] Register renderer output state and shadow resources.
- [ ] Register terrain LOD geometries, indices, morph buffers and materials.
- [ ] Register clay normal and roughness textures.
- [ ] Register tree, grass and pickup instance resources.
- [ ] Register player creature geometry, skeleton and materials.
- [ ] Register camera and active scene bindings.
- [ ] Add complete retirement and leak checks.

### Phase 3: Reconstruction

- [ ] Allocate one replacement renderer generation.
- [ ] Rebuild resources in dependency order.
- [ ] Replay the current active patch set from controller/cache descriptors.
- [ ] Restore the accepted player pose and camera snapshot.
- [ ] Reject work from stale or retired generations.
- [ ] Adopt replacement resources atomically.

### Phase 4: Recovery policy

- [ ] Add a recovery deadline.
- [ ] Add a bounded retry budget.
- [ ] Define fallback behavior when restoration or rehydration fails.
- [ ] Handle a second loss during recovery.
- [ ] Handle route exit and pagehide during recovery.

### Phase 5: Proof

- [ ] Publish `RenderRecoveryResult` or `RenderFallbackResult`.
- [ ] Publish `FirstRecoveredFrameAck`.
- [ ] Include run, simulation, patch, LOD and renderer revisions.
- [ ] Expose loss count, recovery duration, retries and resource counts.

### Phase 6: Fixtures

- [ ] Force loss/restoration with `WEBGL_lose_context`.
- [ ] Test terrain, texture, instances, player and shadow reconstruction.
- [ ] Test timeout, retry exhaustion and fallback.
- [ ] Test stale callback and double-loss rejection.
- [ ] Test route/page lifecycle retirement.
- [ ] Run `npm test`.
- [ ] Run source, staged artifact and Pages parity fixtures.
