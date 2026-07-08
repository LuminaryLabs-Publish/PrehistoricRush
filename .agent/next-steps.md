# PrehistoricRush Next Steps

**Updated:** `2026-07-08T14:51:11-04:00`

## Next safe ledge

Build the presentation event host wire map and DOM-free fixture gate without changing the visible route.

```txt
PrehistoricRush Presentation Event Host Wire Map + Fixture Gate
```

Preserve the current game first:

```txt
preserve index.html
preserve src/runtime.mjs
preserve src/game.js route composition
preserve current Three.js/Rapier look and feel
preserve current PrehistoricRushComposition.snapshot()
preserve current PrehistoricRushHost.getState()
preserve current camera distance/HUD readability pass visually
preserve menu -> game -> run-over -> win -> menu scene flow
```

Then add fixture-readable facts around the current behavior:

```txt
snapshot RunnerSourceState from current app.state
create RunnerMovedEvent from the live movement step
emit eventBus runner.moved only when live movement actually occurs
use existing dino-pose-domain-kit runner.moved listener as the first bridge consumer
record dino.pose.changed output as DinoPoseFrame
create CameraFrameRequest from camera-domain-kit descriptor + RunnerSourceState
create HudFrameRequest from hud-domain-kit descriptor + RunnerSourceState
create ContactResultSnapshot from hazard and pickup decisions
create SceneDispatchResult from menu/game/run-over/win transitions
append PresentationFrameRecord
surface presentation records through host diagnostics
add DOM-free smoke fixtures for the event, contact, scene, and presentation chain
```

## Implementation checklist

- [ ] Add `src/presentation/runner-source-state.js` with a pure `snapshotRunnerSourceState(app)` projector.
- [ ] Add `src/presentation/runner-moved-event.js` with a pure movement-event projector.
- [ ] Add `src/presentation/presentation-events.js` with a narrow adapter that can emit `runner.moved` through the existing event bus.
- [ ] Add `src/presentation/dino-pose-frame.js` with a pure `DinoPoseFrame` projector.
- [ ] Add `src/presentation/camera-frame-request.js` with a pure camera request projector.
- [ ] Add `src/presentation/hud-frame-request.js` with a pure HUD request projector.
- [ ] Add `src/presentation/contact-result-snapshot.js` with pure hazard and pickup result projectors.
- [ ] Add `src/presentation/scene-dispatch-result.js` with pure menu/game/run-over/win transition records.
- [ ] Add `src/presentation/presentation-frame-record.js` with a pure record combiner.
- [ ] Add `src/presentation/presentation-journal.js` with a bounded recent-frame journal.
- [ ] Add `src/presentation/host-presentation-snapshot.js` with a host projection helper.
- [ ] Add `src/presentation/render-readback.js` with a minimal render-readback projector for renderer/camera/HUD/dino consumption state.
- [ ] Keep `applyCloseCamera()` visually unchanged while recording camera requests beside it.
- [ ] Keep `renderHud()` visually unchanged while recording HUD requests beside it.
- [ ] Keep `applyReadableStride()` visually unchanged while recording dino pose frames beside it.
- [ ] Keep contact checks visually and behaviorally unchanged while recording contact results beside them.
- [ ] Keep scene changes unchanged while recording scene dispatch results beside them.
- [ ] Expose latest/recent presentation records through `PrehistoricRushHost.getState().presentation`.
- [ ] Add `scripts/prehistoric-rush-presentation-frame-fixture.mjs`.
- [ ] Add fixture rows for source state, menu no-move, game move, dino pose event bridge, camera request, HUD request, contact snapshot, scene dispatch, presentation record, host snapshot, and DOM-free replay.
- [ ] Only after presentation fixture proof, continue action/result, runner movement extraction, manifest authority, and shared-kit promotion.

## DSK extraction order

```txt
1. prehistoric-rush-runner-source-state-kit
2. prehistoric-rush-runner-moved-event-kit
3. prehistoric-rush-dino-event-bridge-kit
4. prehistoric-rush-dino-pose-frame-kit
5. prehistoric-rush-camera-frame-request-kit
6. prehistoric-rush-hud-frame-request-kit
7. prehistoric-rush-contact-result-snapshot-kit
8. prehistoric-rush-scene-dispatch-result-kit
9. prehistoric-rush-presentation-frame-record-kit
10. prehistoric-rush-presentation-journal-kit
11. prehistoric-rush-host-presentation-snapshot-kit
12. prehistoric-rush-render-readback-kit
13. prehistoric-rush-dom-free-presentation-fixture-kit
14. prehistoric-rush-action-frame-contract-kit
15. prehistoric-rush-action-acceptance-matrix-kit
16. prehistoric-rush-action-result-journal-kit
17. prehistoric-rush-runner-step-result-kit
18. prehistoric-rush-runner-event-journal-kit
19. prehistoric-rush-replay-parity-smoke-kit
20. prehistoric-rush-runtime-source-bundle-kit
21. prehistoric-rush-manifest-load-status-kit
22. prehistoric-rush-run-movement-promotion-report-kit
```

## Fixture rows to create first

```txt
01_runner_source_state_projects_current_app_state
02_menu_scene_runner_source_does_not_emit_moved_delta
03_game_scene_runner_source_emits_runner_moved
04_runner_moved_feeds_dino_pose_domain
05_dino_pose_frame_matches_current_stride_inputs
06_camera_frame_request_matches_close_camera_visual_policy
07_hud_frame_request_matches_readability_hud_descriptor
08_hazard_contact_result_records_run_over_reason
09_pickup_contact_result_records_shard_reason
10_scene_dispatch_result_records_menu_game_run_over_win
11_presentation_frame_record_journals_all_subrecords
12_host_get_state_exposes_presentation_snapshot
13_render_readback_reports_current_renderer_camera_hud_dino_paths
14_dom_free_fixture_replays_source_to_presentation_chain
15_renderer_output_unchanged_by_contract_layer
16_legacy_runtime_remains_playable_during_cutover
```

## Do not do next

```txt
- Do not redesign the visible scene before authority extraction.
- Do not replace the whole runtime in one pass.
- Do not move everything into ProtoKits before local proof exists.
- Do not create a generic kit if the behavior is still PrehistoricRush-specific.
- Do not let renderer, DOM, keyboard handlers, camera lerp code, HUD strings, collision checks, scene mutation, or Rapier frame stepping own reusable logic.
- Do not require DOM, WebGL, Rapier, or requestAnimationFrame for the fixture rows.
```

## Validation target after implementation

```txt
python static route smoke if available
browser route smoke
host snapshot check
runner-source-state smoke
runner.moved bridge fixture
dino.pose.changed fixture
DinoPoseFrame fixture
camera.frame.requested fixture
hud.frame.requested fixture
contact-result-snapshot fixture
scene-dispatch-result fixture
PresentationFrameRecord fixture
render-readback fixture
host-presentation-snapshot smoke
action-frame smoke
action-acceptance smoke
action-result-journal smoke
runner-step smoke
hazard contact fixture
pickup contact fixture
run-over scene dispatch fixture
win scene dispatch fixture
manifest drift report fixture
replay parity smoke
```

## Stop condition

Stop the implementation ledge when the same runner source state can produce:

```txt
RunnerSourceState
  -> RunnerMovedEvent
  -> runner.moved event
  -> dino.pose.changed event
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> PresentationFrameRecord
  -> RenderReadback
  -> PrehistoricRushHost.getState().presentation
```

The fixture must not depend on DOM, WebGL, renderer frame timing, Rapier execution, or `requestAnimationFrame`.
