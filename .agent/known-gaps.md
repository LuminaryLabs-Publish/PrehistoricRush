# PrehistoricRush Known Gaps

**Updated:** `2026-07-08T14:51:11-04:00`

## Highest-priority gaps

```txt
1. src/game.js installs dino, camera, and HUD domain scaffolds, but the live runner does not yet emit stable runner movement facts.
2. dino-pose-domain-kit already listens for runner.moved, but runtime-terrain-v6.mjs does not yet expose that event as a fixture-readable live result.
3. src/game.js can read PrehistoricRushHost.app, but it does not snapshot RunnerSourceState before applying direct presentation mutations.
4. camera-domain-kit exposes a close-third-person descriptor, but applyCloseCamera still directly mutates the Three.js camera from PrehistoricRushHost.app.
5. hud-domain-kit exposes a readability HUD descriptor and render(snapshot), but renderHud still directly writes DOM from PrehistoricRushHost.app.
6. DinoPoseFrame, CameraFrameRequest, HudFrameRequest, ContactResultSnapshot, SceneDispatchResult, and PresentationFrameRecord are documented but not implemented.
7. PrehistoricRushHost.getState() lacks a nested presentation snapshot.
8. Movement authority still lives in the legacy visual runtime.
9. Jump, boost, turn, hazard, pickup, run-over, retry, and win behavior are not yet wrapped in stable action/result records.
10. Contact checks still mutate outcome state inline.
11. Scene dispatch is still product-side and direct instead of command/result based.
12. Manifest files exist but are not yet the full runtime source of truth.
13. The first missing shared ProtoKit is still run-movement-kit.
14. The source-wire maps now exist, but the actual src/presentation/* files do not exist yet.
15. There is no package.json in the root, so validation must not assume npm scripts exist.
16. The event bus has history, but no bounded host-facing projection for runner/contact/scene/presentation facts.
17. PrehistoricRushComposition.snapshot() reports installed domain state, but not live runner/presentation wire parity.
18. PrehistoricRushHost.getState() reports renderer as a string, but not a structured render/presentation readback.
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
- Start, retry, run-again, menu, left, right, boost, and jump should become ActionFrame records later.
- Accepted and rejected actions need stable reasons later.
- Jump buffering, coyote timing, and consumption need fixture coverage later.
- Turn and movement changes should first emit deterministic RunnerMovedEvent records.
- Boost should first appear in RunnerSourceState before becoming a full ActionResult journal entry.
- Distance win and run-over should eventually be scene requests/results, not direct scene mutation.
- Hazard and pickup contacts need ContactResult records before DOM/HUD mutation.
- Scene changes need oldScene/newScene/reason/source frame records.
```

## Presentation and runtime gaps

```txt
- RunnerSourceState should be projected from app.state before any presentation mutation.
- RunnerMovedEvent should be projected from the live movement step.
- The existing event bus should receive runner.moved from the live route.
- DinoPoseFrame should be derived from runner movement facts and the existing dino-pose-domain-kit output.
- CameraFrameRequest should be a descriptor, not only a Three.js camera mutation.
- HudFrameRequest should be a descriptor, not only an innerHTML string.
- ContactResultSnapshot should capture hazard and pickup decisions before scene/score mutation.
- SceneDispatchResult should capture menu, game, run-over, win, retry, and run-again transitions before DOM mutation.
- PresentationFrameRecord should journal runner, dino, camera, HUD, contact, scene, and fallback reasons.
- PresentationJournalSnapshot should be bounded and readable from diagnostics.
- The renderer should consume descriptors from runner, dino, terrain, sky, camera, and UI domains later.
- The raptor visual rig should consume dino form, pose, and material descriptors later.
- Terrain streaming should expose chunk decisions as data before render mutation later.
- Prop, hazard, and pickup scatter should be descriptor-driven later.
```

## Kit gaps

```txt
- run-movement-kit does not exist yet as a shared ProtoKit.
- runner-source-state-kit is not yet materialized locally.
- runner-moved-event-kit is not yet materialized locally.
- dino-event-bridge-kit is not yet materialized locally.
- dino-pose-frame-kit is not yet materialized locally.
- camera-frame-request-kit is not yet materialized locally.
- hud-frame-request-kit is not yet materialized locally.
- contact-result-snapshot-kit is not yet materialized locally.
- scene-dispatch-result-kit is not yet materialized locally.
- presentation-frame-record-kit is not yet materialized locally.
- presentation-journal-kit is not yet materialized locally.
- host-presentation-snapshot-kit is not yet materialized locally.
- dom-free-presentation-fixture-kit is not yet materialized locally.
- action-frame-contract-kit is not yet materialized locally.
- action-acceptance-matrix-kit is not yet materialized locally.
- action-result-journal-kit is not yet materialized locally.
- runner-step-result-kit is not yet materialized locally.
- runner-event-journal-kit is not yet materialized locally.
```

## Documentation gaps fixed by this pass

```txt
.agent/START_HERE.md refreshed
.agent/current-audit.md refreshed
.agent/known-gaps.md refreshed
.agent/next-steps.md refreshed
.agent/validation.md refreshed
.agent/kit-registry.json refreshed
.agent/architecture-audit/2026-07-08T14-51-11-04-00-presentation-event-host-dsk-map.md added
.agent/render-audit/2026-07-08T14-51-11-04-00-camera-hud-render-readback-wire-map.md added
.agent/gameplay-audit/2026-07-08T14-51-11-04-00-contact-scene-result-splice-map.md added
.agent/presentation-authority-audit/2026-07-08T14-51-11-04-00-event-host-wire-map.md added
.agent/trackers/2026-07-08T14-51-11-04-00/project-breakdown.md added
.agent/turn-ledger/2026-07-08T14-51-11-04-00.md added
central repo ledger refreshed
central internal change log added
```

## Current unresolved seam

The local `.agent` docs now identify the implementation cutline. The primary remaining gap is implementation.

The next proof should materialize the presentation source files, add contact/scene result projections, wire the existing event bus to the live route, and add the DOM-free fixture before adding visual polish or shared-kit promotion.
