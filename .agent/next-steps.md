# PrehistoricRush Next Steps

**Audit:** `2026-07-17T05-58-55-04-00`  
**Authority:** `prehistoric-rush-render-host-generation-retirement-authority-domain`

## Intent

Complete ownership settlement for the integrated and source-gated jungle renderer without restructuring Vegetation, patch generation, fidelity, or gameplay.

## Checklist

### Phase 1: Base host disposal

- [ ] Add `dispose()` to `createThreePatchStreamAdapter()`.
- [ ] Stop new render and patch admissions before disposal.
- [ ] Release active patch memberships and instance-batch cells.
- [ ] Dispose base terrain, legacy tree, grass, shard, and player render resources.
- [ ] Remove base scene lights and targets.
- [ ] Dispose the WebGL renderer and detach its canvas.

### Phase 2: Jungle atmosphere retirement

- [ ] Make `applyLushJungleAtmosphere()` return a retirement/restore command.
- [ ] Snapshot predecessor background, fog, exposure, lights, and shadow settings.
- [ ] Remove owned fill and canopy-bounce lights exactly once.
- [ ] Restore predecessor state or mark it explicitly superseded.
- [ ] Make repeated application idempotent for one scene/renderer generation.

### Phase 3: Parent generation authority

- [ ] Bind base and child resources to one `RenderHostGeneration`.
- [ ] Have LOD adapter disposal call child disposal and `base.dispose()`.
- [ ] Reject stale RAF, render, patch-activation, and Worker results after retirement.
- [ ] Publish `RenderHostRetirementResult` and `FirstRetiredRenderHostAck`.

### Phase 4: Executable fixtures

- [x] Add syntax checks for all jungle modules.
- [x] Add foliage-card and ground-cover contract tests.
- [x] Expand tree fidelity, spawn variation, and LOD source gates.
- [ ] Run `npm test` on the reviewed revision.
- [ ] Construct, render, dispose, and reconstruct in one browser session.
- [ ] Assert one canvas, renderer generation, and atmosphere light pair.
- [ ] Exercise run restart, route remount, and WebGL recovery.
- [ ] Run built artifact and GitHub Pages origin checks.

## Recommended file cut

```txt
src/render/three-patch-stream-adapter.js
src/render/three-patch-stream-lod-adapter.js
src/render/lush-jungle-atmosphere.js
src/game-runtime-lod.js
tests/render-host-retirement.mjs
tests/browser/render-host-restart.html
```

## Compatibility constraints

Preserve current catalogs, seeds, ecological placement, card LOD/hysteresis, atlas revision, tree fidelity, collision, route, player, camera, score, pause, outcomes, startup frame admission, and existing source tests.

## Claim boundary

Do not claim restart/remount/recovery safety until complete parent disposal and repeated-generation browser fixtures pass.
