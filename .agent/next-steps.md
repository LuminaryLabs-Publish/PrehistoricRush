# PrehistoricRush Next Steps

**Audit:** `2026-07-17T06-23-59-04-00`  
**Authority:** `prehistoric-rush-render-host-generation-retirement-authority-domain`

## Intent

Complete ownership settlement for the integrated and source-gated jungle renderer without restructuring Vegetation, patch generation, fidelity, physics or gameplay.

## Checklist

### Phase 1: Parent admission and latching

- [ ] Add `RenderHostGeneration` identity to the route host.
- [ ] Add an open/retiring/retired frame-admission latch.
- [ ] Store the RAF id and reject stale callbacks.
- [ ] Bind patch controller, Worker, renderer, scene and viewport revisions to the host generation.

### Phase 2: Base host disposal

- [ ] Add `dispose()` to `createThreePatchStreamAdapter()`.
- [ ] Stop new render and patch admissions before disposal.
- [ ] Release active patch memberships, colliders, pickups and instance-batch cells.
- [ ] Dispose base terrain, legacy tree, grass, shard and player render resources.
- [ ] Remove base scene lights and targets.
- [ ] Dispose the WebGL renderer/context and detach its canvas.

### Phase 3: Browser and Worker retirement

- [ ] Remove keydown, keyup, blur and resize listeners.
- [ ] Clear the button handler.
- [ ] Settle pending Worker requests and reject stale results.
- [ ] Terminate the patch Worker exactly once.
- [ ] Retire global host exposure for the predecessor generation.

### Phase 4: Jungle atmosphere retirement

- [ ] Make `applyLushJungleAtmosphere()` return a retirement/restore command.
- [ ] Snapshot predecessor background, fog, exposure, lights and shadow settings.
- [ ] Remove owned fill and canopy-bounce lights exactly once.
- [ ] Restore predecessor state or mark it explicitly superseded.
- [ ] Make repeated application idempotent for one scene/renderer generation.

### Phase 5: Parent settlement

- [ ] Have LOD adapter disposal call child disposal and `base.dispose()`.
- [ ] Publish participant receipts in `RenderHostRetirementResult`.
- [ ] Publish `FirstRetiredRenderHostAck` after stale submission is impossible.
- [ ] Require predecessor settlement before replacement admission.
- [ ] Publish `FirstReplacementRenderHostFrameAck`.

### Phase 6: Executable fixtures

- [x] Add syntax checks for all jungle modules.
- [x] Add foliage-card and ground-cover contract tests.
- [x] Expand tree fidelity, spawn variation and LOD source gates.
- [ ] Run `npm test` on the reviewed revision.
- [ ] Construct, render, retire and reconstruct in one browser session.
- [ ] Assert one canvas, renderer generation and atmosphere light pair.
- [ ] Exercise run restart, route remount and WebGL recovery.
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

Preserve current catalogs, seeds, ecological placement, card LOD/hysteresis, atlas revision, tree fidelity, collision, route, player, camera, score, pause, outcomes, startup frame admission and existing source tests.

## Claim boundary

Do not claim restart/remount/recovery safety until complete parent disposal and repeated-generation browser fixtures pass.