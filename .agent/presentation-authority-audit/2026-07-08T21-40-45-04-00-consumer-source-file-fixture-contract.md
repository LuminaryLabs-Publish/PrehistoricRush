# Presentation Authority Audit — Consumer Source File Fixture Contract

**Timestamp:** `2026-07-08T21-40-45-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Authority decision

The next implementation should create a source-file manifest for presentation authority and prove it with fixture rows.

The current live runner is playable. The missing piece is fixture-readable state and event authority.

## Source files to add next

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Required public function map

```txt
runner-source-state.js
  snapshotRunnerSourceState(appOrState)

runner-step-delta.js
  createRunnerStepDelta(previousSourceState, currentSourceState)

runner-moved-event.js
  createRunnerMovedEvent({ source, delta, frame })

presentation-events.js
  emitRunnerMoved(eventBus, runnerMovedEvent)
  collectPresentationEvents(eventBus)

dino-pose-frame.js
  createDinoPoseFrame({ runnerMovedEvent, dinoPoseChangedEvent, fallbackPose })

camera-frame-request.js
  createCameraFrameRequest({ cameraDescriptor, runnerSourceState, dt })

hud-frame-request.js
  createHudFrameRequest({ hudDescriptor, runnerSourceState, terrain, physics })

contact-result-snapshot.js
  createContactResultSnapshot({ frame, runnerSourceState, hazard, pickup, sceneBefore, sceneAfter })

scene-dispatch-result.js
  createSceneDispatchResult({ frame, before, after, reason })

render-readback.js
  createRenderReadback({ frame, renderer, camera, hud, dino, terrain, physics })

presentation-frame-record.js
  createPresentationFrameRecord(parts)

presentation-journal.js
  createPresentationJournal({ limit })
  appendPresentationJournalEntry(journal, record)
  snapshotPresentationJournal(journal)

host-presentation-snapshot.js
  projectHostPresentationSnapshot({ latest, journal, fixtureStatus })
```

## Host projection contract

Add this shape without removing existing fields:

```js
PrehistoricRushHost.getState() -> {
  scene,
  runner,
  physics,
  terrain,
  renderer,
  presentation: {
    version: "presentation-consumer-source-manifest-v1",
    latestFrame,
    latestRunnerSourceState,
    latestRunnerStepDelta,
    latestRunnerMovedEvent,
    latestDinoPoseFrame,
    latestCameraFrameRequest,
    latestHudFrameRequest,
    latestContactResultSnapshot,
    latestSceneDispatchResult,
    latestRenderReadback,
    recentFrameCount,
    fixtureStatus
  }
}
```

## Fixture acceptance rows

```txt
01_runner_source_state_projects_scene_position_speed_jump_distance_shards
02_runner_step_delta_reports_noop_when_previous_matches_current
03_runner_step_delta_reports_move_distance_yaw_speed_and_jump_changes
04_runner_moved_event_has_stable_type_payload_and_frame
05_emit_runner_moved_reaches_dino_pose_domain
06_dino_pose_frame_records_dino_pose_changed_consumer_output
07_camera_frame_request_matches_camera_domain_descriptor
08_hud_frame_request_matches_hud_domain_descriptor
09_contact_result_snapshot_records_hazard_hit_without_requiring_webgl
10_contact_result_snapshot_records_pickup_collection_without_requiring_dom
11_scene_dispatch_result_records_menu_to_game
12_scene_dispatch_result_records_game_to_run_over
13_scene_dispatch_result_records_game_to_win
14_render_readback_reports_renderer_camera_hud_dino_consumers
15_presentation_frame_record_contains_all_subrecords
16_presentation_journal_is_bounded
17_host_projection_preserves_legacy_get_state_fields
18_host_projection_exposes_presentation_snapshot
19_dom_free_fixture_replays_source_to_host_projection
20_visible_route_contract_remains_unchanged
```

## Rejection rules for next implementation

The implementation should be rejected if it:

```txt
removes existing PrehistoricRushHost.getState() fields
requires WebGL for DOM-free fixture rows
requires localStorage for pure source state fixture rows
changes the current route import chain
retunes camera or dino animation while adding records
turns the docs proof into a visual redesign
creates a branch
```

## Why this is the next ledge

`dino-pose-domain-kit` already contains a live consumer contract for `runner.moved`. The fastest way to make the current DSK scaffold meaningful is to feed that contract from live runner state and record the output as data.

Once this fixture passes, movement/action extraction and run-movement-kit promotion can happen with a stable source of truth.