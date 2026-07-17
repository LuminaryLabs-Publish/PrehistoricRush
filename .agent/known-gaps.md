# PrehistoricRush Known Gaps

**Audit:** `2026-07-17T05-58-55-04-00`  
**Status:** `jungle-foliage-atmosphere-runtime-adoption-authority-audited`

## Summary

The repository now contains source definitions for foliage-card families, deterministic tree-card recipes, ground-cover archetypes and a lush Three.js atmosphere. The two commits add no production consumer, test wiring, lifecycle authority or matching-frame proof.

## Intent

Keep jungle-presentation adoption explicitly unsupported until the modules enter the actual catalog, patch, Worker, GPU, scene-lifecycle and frame paths.

## Checklist

- [x] Confirm the two-commit delta adds only two source files.
- [x] Confirm `package.json` does not syntax-check or execute them.
- [x] Inventory the new services and their intended ownership boundaries.
- [x] Preserve the complete 93-surface repository census.
- [ ] Implement and prove actual product adoption.

## Source and catalog gaps

```txt
production import/adoption evidence in delta: absent
syntax/import fixture coverage: absent
foliage catalog schema result: absent
atlas texture identity and decode result: absent
catalog immutability result: absent
catalog generation and digest: absent
```

## Placement and Worker gaps

```txt
tree-instance identity in local card recipe: external/unbound
near/medium/far/culled budget authority: absent
ground-cover route-clearance settlement: absent
ground-cover terrain-height settlement: absent
production Worker catalog handshake: absent
main-thread/Worker card parity: absent
main-thread/Worker ground-cover parity: absent
FirstJunglePatchAck: absent
```

## Render and lifecycle gaps

```txt
foliage atlas material binding: absent
card instance-batch ownership: absent
patch-owned card release: absent
atmosphere apply-once generation: absent
duplicate fill/bounce prevention: absent
predecessor background/fog/exposure/light snapshot: absent
quality-aware 3072 shadow budget: absent
scene replacement and disposal result: absent
JunglePresentationProjectionResult: absent
FirstJunglePresentationFrameAck: absent
```

## Source-specific observations

- `createTreeFoliageCardPlacements()` uses medium counts only for the exact `medium` token; every other quality token receives near counts unless an outer policy intervenes.
- Local placement seeds use archetype, quality and index. Global patch publication needs an additional patch/tree-instance identity.
- `PREHISTORIC_GROUND_COVER_BY_ID` is an exported mutable `Map`, even though descriptor objects are frozen.
- `applyLushJungleAtmosphere()` adds new fill and ambient lights on each call and does not expose an idempotent replace or disposal operation.
- Existing scene and renderer values are mutated without a predecessor snapshot or restoration result.

## Deployment gaps

```txt
browser import-map fixture: absent
Worker module fixture: absent
built-output module fixture: absent
Pages-subpath module fixture: absent
source/artifact/Pages presentation parity: absent
```

## Current risk boundary

No current crash or visual regression was reproduced. The risk is that the new modules may remain dead source, or later be adopted without deterministic instance identity, bounded quality policy, idempotent atmosphere application and exact resource retirement.

## Retained gaps

The prior product Vegetation runtime fixture, semantic generation, runtime-module identity, tree elevation/frame addressing, fidelity transitions, WebGL recovery, Worker liveness, audio, accessibility, fixed-step pacing, terrain ownership/LOD, creator settlement, feedback, route progress, provider convergence, outcomes, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, restart and browser lifecycle audits remain active.

## Claim boundary

Do not claim runtime adoption, visible jungle fidelity, GPU lifecycle correctness, browser integrity, artifact parity, Pages parity or production readiness until executable fixtures pass.
