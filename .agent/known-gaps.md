# PrehistoricRush Known Gaps

**Updated:** `2026-07-09T00-09-22-04-00`

## Highest-priority gaps

```txt
1. src/game.js installs dino, camera, and HUD domain scaffolds, but the live runner still does not emit stable runner movement facts.
2. dino-pose-domain-kit already listens for runner.moved, but runtime-terrain-v6.mjs does not yet emit runner.moved from live state changes.
3. There is no RunnerSourceState record projected from current app.state.
4. There is no RunnerStepDelta record that compares previous runner source state against current runner source state.
5. src/game.js can read PrehistoricRushHost.app, but it does not snapshot RunnerSourceState before applying direct presentation mutations.
6. applyCloseCamera still directly mutates the Three.js camera and does not leave behind a CameraFrameRequest.
7. renderHud still directly writes DOM and does not leave behind a HudFrameRequest.
8. applyReadableStride directly mutates the raptor rig and does not leave behind a DinoPoseFrame or pose consumer readback.
9. Contact checks still mutate scene/shards inline without a ContactResultSnapshot.
10. Scene dispatch still mutates menu/game/run-over/win inline without a SceneDispatchResult.
11. PrehistoricRushHost.getState() lacks a nested presentation snapshot.
12. Render readback is only the string renderer field, not structured frame consumption evidence.
13. Movement authority still lives inside the legacy visual runtime.
14. Jump, boost, turn, hazard, pickup, run-over, retry, and win behavior are not wrapped in stable action/result records.
15. Manifest files exist, but they are not yet the full runtime source of truth.
16. The first missing shared ProtoKit is still run-movement-kit.
17. The source-wire maps now exist, but the actual src/presentation/* files do not exist yet.
18. There is no package.json in the root, so validation must not assume npm scripts exist.
19. The event bus has history, but no bounded host-facing projection for runner/contact/scene/presentation facts.
20. The central ledger can drift behind repo-local .agent state unless each run updates both repos in the same pass.
```

## Architecture gaps

```txt
- Domain runtime scaffold exists, but scheduler ticks are not yet the primary live authority.
- The dino domains are installed before the legacy runtime, but the legacy runtime still owns raptor pose animation.
- The dino pose domain has the correct event consumer shape, but the live route does not feed it.
- Camera and HUD domains are installed, but live camera/HUD presentation still happens through direct app mutation.
- PrehistoricRushComposition.snapshot() exposes scaffold state, but not enough live runner or presentation authority state.
- PrehistoricRushHost.getState() remains the main live debug surface, but it lacks a nested presentation snapshot.
- No stable action/result journal is documented as live.
- No presentation frame journal is documented as live.
- No render-readback snapshot is documented as live.
- No DOM-free replay parity fixture is documented as live.
- No contact-result snapshot is documented as live.
- No scene-dispatch result stream is documented as live.
```

## Gameplay authority gaps

```txt
- Start, retry, run-again, menu, left, right, boost, and jump should become ActionFrame records later.
- Accepted and rejected actions need stable reasons later.
- Jump buffering, coyote timing, and jump consumption need fixture coverage later.
- Turn and movement changes should first emit deterministic RunnerMovedEvent records.
- Boost should first appear in RunnerSourceState and RunnerStepDelta before becoming a full ActionResult journal entry.
- Distance win and run-over should eventually be scene requests/results, not direct scene mutation.
- Hazard and pickup contacts need ContactResult records before scene/score mutation.
- Scene changes need oldScene/newScene/reason/source frame records.
```

## Presentation and runtime gaps

```txt
- RunnerSourceState should be projected from app.state before any presentation mutation.
- RunnerStepDelta should record dx, dz, distanceDelta, yawDelta, speedDelta, jumpDelta, shardDelta, sceneBefore, and sceneAfter.
- RunnerMovedEvent should be projected from the live movement step.
- The existing event bus should receive runner.moved from the live route.
- DinoPoseFrame should be derived from runner movement facts and the existing dino-pose-domain-kit output.
- CameraFrameRequest should be a descriptor, not only a Three.js camera mutation.
- HudFrameRequest should be a descriptor, not only an innerHTML string.
- ContactResultSnapshot should capture hazard and pickup decisions before scene/score mutation.
- SceneDispatchResult should capture menu, game, run-over, win, retry, and run-again transitions before DOM mutation.
- RenderReadback should capture renderer/camera/HUD/dino consumption state without requiring WebGL execution.
- PresentationFrameRecord should journal runner, dino, camera, HUD, contact, scene, render, and fallback reasons.
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
- runner-step-delta-kit is not yet materialized locally.
- runner-moved-event-kit is not yet materialized locally.
- dino-event-bridge-kit is not yet materialized locally.
- dino-pose-frame-kit is not yet materialized locally.
- camera-frame-request-kit is not yet materialized locally.
- hud-frame-request-kit is not yet materialized locally.
- contact-result-snapshot-kit is not yet materialized locally.
- scene-dispatch-result-kit is not yet materialized locally.
- render-readback-kit is not yet materialized locally.
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
.agent/architecture-audit/2026-07-09T00-09-22-04-00-presentation-consumer-catchup-dsk-map.md added
.agent/render-audit/2026-07-09T00-09-22-04-00-host-presentation-readback-map.md added
.agent/gameplay-audit/2026-07-09T00-09-22-04-00-runner-moved-consumer-loop.md added
.agent/presentation-authority-audit/2026-07-09T00-09-22-04-00-host-projection-fixture-gate.md added
.agent/deploy-audit/2026-07-09T00-09-22-04-00-static-fixture-validation-catchup.md added
.agent/trackers/2026-07-09T00-09-22-04-00/project-breakdown.md added
.agent/turn-ledger/2026-07-09T00-09-22-04-00.md added
central repo ledger refreshed
central internal change log added
```

## Current unresolved seam

The primary remaining gap is implementation of the pure `src/presentation/*` files, additive host projection, and DOM-free fixture.

The first useful cut is the consumer bridge from live app state to `runner.moved`, because it activates the existing `dino-pose-domain-kit` instead of creating another parallel animation path.
