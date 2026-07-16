# Architecture Audit: WebGL Context and GPU Resource Recovery DSK Map

**Timestamp:** `2026-07-16T06-39-16-04-00`  
**Authority:** `prehistoric-rush-webgl-context-gpu-resource-recovery-authority-domain`

## Summary

The existing domains provide deterministic simulation, patch streaming and presentation components, but no parent domain owns renderer-generation replacement after WebGL context loss.

## Plan ledger

**Goal:** map current ownership and the minimum coordinating DSK surfaces required for bounded recovery.

- [x] Map current simulation, patch, renderer and resource owners.
- [x] Keep CPU-authoritative gameplay and patch descriptors unchanged.
- [x] Define a parent recovery command/result boundary.
- [x] Define 21 focused coordination surfaces.
- [ ] Implement the map.

## Current ownership map

```txt
PrehistoricRush domain
  -> run, player, route, score, outcomes and accepted simulation

seeded-world-patch-controller-kit
  -> CPU-authoritative patch identities, cache, active ring and ready descriptors

three-patch-stream-adapter-kit
  -> renderer, scene, camera, base terrain, instances, player, lights and patch presentation

three-terrain-lod-layer
  -> LOD geometry, index buffers, morph targets, material and clay textures

game-runtime-lod-host-adapter
  -> module loading, composition, RAF, resize and render submission

missing parent authority
  -> context generation, loss admission, suspension, retirement, reconstruction,
     retry, fallback, stale-work rejection and recovered-frame proof
```

## Domain boundary

The recovery authority does not own simulation truth, patch generation, collision, scoring or route progression. It owns only whether one render generation can present the already-accepted state and how a failed generation is replaced.

## Command and result map

```txt
RenderLossAdmissionCommand
  -> bind document, canvas, renderer, context, runtime and resource generations
  -> classify loss once and publish RenderLossResult
  -> suspend stale presentation and apply the authored simulation/input policy
  -> retire the lost render generation

RenderRecoveryCommand
  -> bind the accepted loss result and one replacement generation
  -> reconstruct renderer-owned state and the product GPU-resource graph
  -> rebuild terrain LOD buffers, clay textures, instances, creature resources and shadows
  -> replay the current visible patch set from CPU-authoritative descriptors
  -> reject stale or duplicate work from retired generations
  -> enforce a deadline and bounded retry budget
  -> publish RenderRecoveryResult or RenderFallbackResult
  -> present and publish FirstRecoveredFrameAck
```

## Planned surfaces

```txt
render-context-capability-kit
render-context-generation-kit
webgl-context-loss-observer-kit
webgl-context-restoration-observer-kit
render-loss-admission-kit
render-suspension-policy-kit
simulation-during-render-loss-policy-kit
renderer-reconstruction-kit
render-resource-registry-kit
render-resource-retirement-kit
terrain-lod-resource-rehydration-kit
clay-texture-resource-rehydration-kit
instanced-batch-resource-rehydration-kit
creature-resource-rehydration-kit
light-shadow-resource-rehydration-kit
patch-visible-set-replay-kit
render-generation-stale-work-rejection-kit
render-recovery-deadline-kit
render-recovery-retry-budget-kit
render-fallback-policy-kit
first-recovered-frame-ack-kit
```

## Dependency reconstruction order

```txt
1. renderer and canvas context generation
2. output policy, pixel ratio, shadow-map and tone-mapping state
3. scene-global lights and shadow resources
4. shared clay textures and materials
5. terrain LOD geometry, index and morph resources
6. tree, grass and pickup instanced resources
7. procedural creature geometry, skeleton and materials
8. active patch visible-set replay
9. camera and frame submission
10. FirstRecoveredFrameAck
```

## Boundary

Documentation only. No DSK, adapter or engine code was changed.
