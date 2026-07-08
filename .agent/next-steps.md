# PrehistoricRush Next Steps

**Updated:** `2026-07-08T10:39:22-04:00`

## Next safe ledge

Build the runner event bridge and presentation frame fixture gate without changing the visible route.

```txt
PrehistoricRush Runner Event Bridge + Presentation Frame Fixture Gate
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
append PresentationFrameRecord
surface presentation records through host diagnostics
add DOM-free smoke fixtures for the event and presentation chain
```

## Implementation checklist

- [ ] Add `src/presentation/runner-source-state.js` with a pure `snapshotRunnerSourceState(app)` projector.
- [ ] Add `src/presentation/runner-moved-event.js` with a pure movement-event projector.
- [ ] Add `src/presentation/presentation-events.js` with a narrow adapter that can emit `runner.moved` through the existing event bus.
- [ ] Add `src/presentation/dino-pose-frame.js` with a pure `DinoPoseFrame` projector.
- [ ] Add `src/presentation/camera-frame-request.js` with a pure camera request projector.
- [ ] Add `src/presentation/hud-frame-request.js` with a pure HUD request projector.
- [ ] Add `src/presentation/presentation-frame-record.js` with a pure record combiner.
- [ ] Add `src/presentation/presentation-journal.js` with a bounded recent-frame journal.
- [ ] Keep `applyCloseCamera()` visually unchanged while recording camera requests beside it.
- [ ] Keep `renderHud()` visually unchanged while recording HUD requests beside it.
- [ ] Keep `applyReadableStride()` visually unchanged while recording dino pose frames beside it.
- [ ] Expose latest/recent presentation records through `PrehistoricRushHost.getState().presentation`.
- [ ] Add `scripts/prehistoric-rush-presentation-frame-fixture.mjs`.
- [ ] Add fixture rows for source state, menu no-move, game move, dino pose event bridge, camera request, HUD request, presentation record, host snapshot, and DOM-free replay.
- [ ] Only after presentation fixture proof, continue action/result, contact/result, scene-dispatch, and replay extraction.

## DSK extraction order

```txt
1. prehistoric-rush-runner-source-state-kit
2. prehistoric-rush-runner-moved-event-kit
3. prehistoric-rush-dino-event-bridge-kit
4. prehistoric-rush-dino-pose-frame-kit
5. prehistoric-rush-camera-frame-request-kit
6. prehistoric-rush-hud-frame-request-kit
7. prehistoric-rush-presentation-frame-contract-kit
8. prehistoric-rush-presentation-descriptor-journal-kit
9. prehistoric-rush-host-presentation-snapshot-kit
10. prehistoric-rush-dom-free-presentation-fixture-kit
11. prehistoric-rush-action-frame-contract-kit
12. prehistoric-rush-action-acceptance-matrix-kit
13. prehistoric-rush-action-result-journal-kit
14. prehistoric-rush-runner-step-result-kit
15. prehistoric-rush-runner-event-journal-kit
16. prehistoric-rush-contact-result-snapshot-kit
17. prehistoric-rush-scene-dispatch-result-kit
18. prehistoric-rush-replay-parity-smoke-kit
19. prehistoric-rush-runtime-source-bundle-kit
20. prehistoric-rush-manifest-load-status-kit
21. prehistoric-rush-run-movement-promotion-report-kit
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
08_presentation_frame_record_journals_all_subrecords
09_host_get_state_exposes_presentation_snapshot
10_dom_free_fixture_replays_source_to_presentation_chain
11_renderer_output_unchanged_by_contract_layer
12_legacy_runtime_remains_playable_during_cutover
```

## Do not do next

```txt
- Do not redesign the visible scene before authority extraction.
- Do not replace the whole runtime in one pass.
- Do not move everything into ProtoKits before local proof exists.
- Do not create a generic kit if the behavior is still PrehistoricRush-specific.
- Do not let renderer, DOM, keyboard handlers, camera lerp code, HUD strings, or Rapier frame stepping own reusable logic.
```

## Validation target after implementation

```txt
node-based smoke if available
browser route smoke
host snapshot check
runner-source-state smoke
runner.moved bridge fixture
dino.pose.changed fixture
DinoPoseFrame fixture
camera.frame.requested fixture
hud.frame.requested fixture
PresentationFrameRecord fixture
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
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
```

The fixture must not depend on DOM, WebGL, renderer frame timing, or Rapier execution.
