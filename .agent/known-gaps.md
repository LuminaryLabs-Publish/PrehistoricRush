# PrehistoricRush Known Gaps

**Updated:** `2026-07-08T09:29:20-04:00`

## Highest-priority gaps

```txt
1. src/game.js installs dino, camera, and HUD domain scaffolds, but the live runner does not yet emit stable runner movement facts.
2. dino-pose-domain-kit already listens for runner.moved, but runtime-terrain-v6.mjs does not yet expose that event as a fixture-readable live result.
3. camera-domain-kit exposes a close-third-person descriptor, but applyCloseCamera still directly mutates the Three.js camera from PrehistoricRushHost.app.
4. hud-domain-kit exposes a readability HUD descriptor and render(snapshot), but renderHud still directly writes DOM from PrehistoricRushHost.app.
5. The live presentation frame is not represented by a stable PresentationFrameRecord.
6. Movement authority still lives in the legacy visual runtime.
7. Jump, boost, lane, hazard, pickup, run-over, retry, and win behavior are not yet wrapped in stable action/result records.
8. Contact checks still mutate outcome state inline.
9. Scene dispatch is still product-side and direct instead of command/result based.
10. Manifest files exist but are not yet the full runtime source of truth.
11. The first missing shared ProtoKit is still run-movement-kit.
12. The implementation now has a written source wire map, but no source files for it exist yet.
```

## Architecture gaps

```txt
- Domain runtime scaffold exists, but scheduler ticks are not yet the primary live authority.
- The dino domains are installed before the legacy runtime, but the legacy runtime still owns raptor pose animation.
- Camera and HUD domains are installed, but live camera/HUD presentation still happens through direct app mutation.
- PrehistoricRushComposition.snapshot() exposes scaffold state, but not enough live runner or presentation authority state.
- PrehistoricRushHost.getState() remains the main live debug surface, but it lacks a nested presentation snapshot.
- No stable action/result journal is documented as live.
- No presentation frame journal is documented as live.
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

## Presentation and runtime gaps

```txt
- RunnerSourceState should be projected from app.state before any presentation mutation.
- RunnerMovedEvent should be projected from the live movement step.
- DinoPoseFrame should be derived from runner movement facts.
- CameraFrameRequest should be a descriptor, not only a Three.js camera mutation.
- HudFrameRequest should be a descriptor, not only an innerHTML string.
- PresentationFrameRecord should journal runner, dino, camera, HUD, and fallback reasons.
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
- presentation-frame-contract-kit is not yet materialized locally.
- host-presentation-snapshot-kit is not yet materialized locally.
- action-frame-contract-kit is not yet materialized locally.
- action-acceptance-matrix-kit is not yet materialized locally.
- action-result-journal-kit is not yet materialized locally.
- runner-source-state-kit is not yet materialized locally.
- runner-moved-event-kit is not yet materialized locally.
- runner-step-result-kit is not yet materialized locally.
- runner-event-journal-kit is not yet materialized locally.
- camera-frame-descriptor-kit is not yet materialized locally.
- hud-frame-descriptor-kit is not yet materialized locally.
- presentation-descriptor-journal-kit is not yet materialized locally.
- scene-dispatch-result-kit is not yet materialized locally.
- dino-domain-bridge-kit is not yet materialized locally.
- contact-result-snapshot-kit is not yet materialized locally.
```

## Documentation gaps fixed by this pass

```txt
.agent/START_HERE.md refreshed
.agent/current-audit.md refreshed
.agent/known-gaps.md refreshed
.agent/next-steps.md refreshed
.agent/validation.md refreshed
.agent/kit-registry.json refreshed
.agent/architecture-audit/2026-07-08T09-29-20-04-00-dsk-domain-breakdown.md added
.agent/render-audit/2026-07-08T09-29-20-04-00-render-presentation-readback.md added
.agent/presentation-authority-audit/2026-07-08T09-29-20-04-00-source-wire-map.md added
.agent/trackers/2026-07-08T09-29-20-04-00/project-breakdown.md added
.agent/turn-ledger/2026-07-08T09-29-20-04-00.md added
central repo ledger refreshed
central internal change log added
```

## Current unresolved seam

The local `.agent` docs now exist, so the primary remaining gap is not documentation presence.

The primary remaining gap is the authority boundary between the current visual runtime and future testable runner/presentation kits.

The next proof should be a presentation source wire map and frame contract fixture, not visual polish.
