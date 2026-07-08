# PrehistoricRush Known Gaps

**Updated:** `2026-07-08T03:01:20-04:00`

## Highest-priority gaps

```txt
1. The root .agent folder was missing even though the central ledger referenced .agent tracker paths.
2. src/game.js installs a dino domain scaffold, but the live runner does not yet feed it real movement events.
3. dino-pose-domain-kit listens for runner.moved, but runtime-terrain-v6.mjs does not currently emit runner.moved.
4. Movement authority still lives in the legacy visual runtime.
5. Scene dispatch is still product-side and direct instead of command/result based.
6. Contact checks still mutate outcome state inline.
7. Manifest files exist but are not yet the full runtime source of truth.
8. The first missing shared ProtoKit is still run-movement-kit.
```

## Architecture gaps

```txt
- Domain runtime scaffold exists, but scheduler ticks are not yet the primary live authority.
- The dino domains are installed before the legacy runtime, but the legacy runtime still owns raptor pose animation.
- `PrehistoricRushComposition.snapshot()` exposes scaffold state, but not enough live runner authority state.
- The host debug surface is still primarily `PrehistoricRushHost.getState()`.
- No stable action/result journal is documented as live.
- No DOM-free replay parity fixture is documented as live.
```

## Gameplay authority gaps

```txt
- Start, retry, run-again, menu, left, right, boost, and jump should become ActionFrame records.
- Accepted and rejected actions need stable reasons.
- Jump buffering / coyote / consumption should be fixture-tested.
- Lane changes should emit deterministic runner step results.
- Boost should produce a stable result journal entry.
- Distance win and run-over should be scene requests, not direct scene mutation.
```

## Render and runtime gaps

```txt
- The renderer should consume descriptors from runner, dino, terrain, sky, camera, and UI domains.
- The raptor visual rig should consume dino form, pose, and material descriptors.
- Terrain streaming should expose chunk decisions as data before render mutation.
- Prop, hazard, and pickup scatter should be descriptor-driven.
- Camera follow should become a camera policy descriptor.
- HUD projection should become a UI/telemetry descriptor.
```

## Kit gaps

```txt
- run-movement-kit does not exist yet as a shared ProtoKit.
- runner-step-result-kit is not yet materialized locally.
- runner-event-journal-kit is not yet materialized locally.
- action-acceptance-matrix-kit is not yet materialized locally.
- scene-dispatch-result-kit is not yet materialized locally.
- dino-domain-bridge-kit is not yet materialized locally.
- contact-result-snapshot-kit is not yet materialized locally.
```

## Central tracking gap fixed in this run

The central repo already had `repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md`, but the publish repo was missing the root `.agent` files needed for future scheduled runs to start from local state.

This run materialized the local `.agent` state and updated the central ledger to stop overclaiming missing local paths.
