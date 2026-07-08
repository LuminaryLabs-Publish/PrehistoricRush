# PrehistoricRush Known Gaps

**Updated:** `2026-07-08T05:10:47-04:00`

## Highest-priority gaps

```txt
1. src/game.js installs a dino domain scaffold, but the live runner does not yet feed it stable runner movement facts.
2. dino-pose-domain-kit needs a runner.moved or equivalent fact event from the live movement step.
3. Movement authority still lives in the legacy visual runtime.
4. Jump, boost, lane, hazard, pickup, run-over, retry, and win behavior are not yet wrapped in stable action/result records.
5. Contact checks still mutate outcome state inline.
6. Scene dispatch is still product-side and direct instead of command/result based.
7. Manifest files exist but are not yet the full runtime source of truth.
8. The first missing shared ProtoKit is still run-movement-kit.
```

## Architecture gaps

```txt
- Domain runtime scaffold exists, but scheduler ticks are not yet the primary live authority.
- The dino domains are installed before the legacy runtime, but the legacy runtime still owns raptor pose animation.
- PrehistoricRushComposition.snapshot() exposes scaffold state, but not enough live runner authority state.
- PrehistoricRushHost.getState() remains the main live debug surface.
- No stable action/result journal is documented as live.
- No DOM-free replay parity fixture is documented as live.
- No contact-result snapshot is documented as live.
- No scene-dispatch result stream is documented as live.
```

## Gameplay authority gaps

```txt
- Start, retry, run-again, menu, left, right, boost, and jump should become ActionFrame records.
- Accepted and rejected actions need stable reasons.
- Jump buffering, coyote timing, and consumption need fixture coverage.
- Lane changes should emit deterministic RunnerStepResult records.
- Boost should produce a stable ActionResult journal entry.
- Distance win and run-over should be scene requests/results, not direct scene mutation.
- Hazard and pickup contacts need ContactResult records before DOM/HUD mutation.
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
- action-frame-contract-kit is not yet materialized locally.
- action-acceptance-matrix-kit is not yet materialized locally.
- action-result-journal-kit is not yet materialized locally.
- runner-source-state-kit is not yet materialized locally.
- runner-step-result-kit is not yet materialized locally.
- runner-event-journal-kit is not yet materialized locally.
- scene-dispatch-result-kit is not yet materialized locally.
- dino-domain-bridge-kit is not yet materialized locally.
- contact-result-snapshot-kit is not yet materialized locally.
```

## Current unresolved seam

The local `.agent` docs now exist, so the primary remaining gap is not documentation presence.

The primary remaining gap is the authority boundary between the current visual runtime and future testable runner kits.
