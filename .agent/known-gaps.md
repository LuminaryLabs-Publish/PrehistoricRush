# PrehistoricRush Known Gaps

**Audit:** `2026-07-16T06-39-16-04-00`  
**Status:** `webgl-context-gpu-resource-recovery-authority-audited`

## Summary

The renderer and resources exist, but context loss, generation replacement, complete reconstruction and recovered-frame proof are not owned as one authority.

## Plan ledger

**Goal:** keep recovery gaps explicit until one forced-loss fixture reaches a terminal recovered or fallback result.

### Context lifecycle

- [ ] No `webglcontextlost` listener exists.
- [ ] No `webglcontextrestored` listener exists.
- [ ] No immutable renderer/context generation exists.
- [ ] No typed loss admission result exists.
- [ ] No explicit render suspension exists.
- [ ] Simulation and input behavior during loss are undefined.

### Resource ownership

- [ ] No complete GPU-resource registry exists.
- [ ] Base terrain, LOD terrain and instance resources have no shared recovery graph.
- [ ] Clay textures have no generation-bound reconstruction receipt.
- [ ] Player creature, light and shadow resources have no recovery receipt.
- [ ] The base adapter exposes no complete disposal contract.
- [ ] The host does not call adapter disposal.

### Recovery settlement

- [ ] No dependency-ordered reconstruction transaction exists.
- [ ] No stale-generation rejection exists.
- [ ] No recovery deadline exists.
- [ ] No bounded retry budget exists.
- [ ] No fallback result exists.
- [ ] No second-loss-during-recovery policy exists.
- [ ] No route/page retirement result exists.

### Proof

- [ ] No `RenderLossResult` exists.
- [ ] No `RenderRecoveryResult` exists.
- [ ] No `RenderFallbackResult` exists.
- [ ] No `FirstRecoveredFrameAck` exists.
- [ ] No forced context-loss browser fixture exists.
- [ ] No staged artifact or Pages recovery fixture exists.

## Retained gaps

Worker liveness, game audio, accessibility projection, host-clock pacing, terrain ownership, terrain LOD, creator profile settlement, feedback surfaces, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart and general browser-runtime retirement remain separate retained audit families.
