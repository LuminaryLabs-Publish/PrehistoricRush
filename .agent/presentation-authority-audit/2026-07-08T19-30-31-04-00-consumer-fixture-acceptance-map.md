# PrehistoricRush Presentation Authority Consumer Fixture Acceptance Map

**Timestamp:** `2026-07-08T19-30-31-04-00`

## Purpose

Define the exact acceptance map for the next source implementation.

The next pass should prove the current presentation chain without changing visible behavior.

## Required source files

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

## Required contracts

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
ContactResultSnapshot
SceneDispatchResult
RenderReadback
PresentationFrameRecord
PresentationJournalSnapshot
HostPresentationSnapshot
```

## Consumer chain

```txt
snapshotRunnerSourceState(app)
  -> createRunnerStepDelta(previous, current)
  -> createRunnerMovedEvent(stepDelta)
  -> emitRunnerMoved(eventBus, runnerMovedEvent)
  -> dino-pose-domain-kit update via runner.moved
  -> read dino.pose.changed event
  -> createDinoPoseFrame(...)
  -> createCameraFrameRequest(...)
  -> createHudFrameRequest(...)
  -> createContactResultSnapshot(...)
  -> createSceneDispatchResult(...)
  -> createRenderReadback(...)
  -> createPresentationFrameRecord(...)
  -> appendPresentationJournalEntry(...)
  -> projectHostPresentationSnapshot(...)
```

## Acceptance rows

```txt
01_runner_source_state_projects_current_app_state
  expected: current runner state fields normalize without DOM/WebGL

02_runner_step_delta_reports_noop_in_menu
  expected: scene=menu produces moved=false and reason=scene-not-game

03_game_scene_runner_source_emits_runner_moved
  expected: movement delta creates runner.moved payload with frame/position/distance/speed/yaw

04_runner_moved_feeds_dino_pose_domain
  expected: existing dino-pose-domain-kit emits dino.pose.changed from runner.moved

05_dino_pose_frame_matches_current_stride_inputs
  expected: pose frame records speed/turn/jump/time/phase and can be compared against visual stride policy

06_camera_frame_request_matches_close_camera_visual_policy
  expected: camera request records close-third-person policy without mutating camera in fixture mode

07_hud_frame_request_matches_readability_hud_descriptor
  expected: HUD request records title, scene label, distance target, speed, shards, and debug rows

08_hazard_contact_result_records_run_over_reason
  expected: hazard contact records run-over reason and source collider/physics path

09_pickup_contact_result_records_shard_reason
  expected: pickup contact records shard increment and pickup key

10_scene_dispatch_result_records_menu_game_run_over_win
  expected: scene changes record oldScene/newScene/reason/source

11_render_readback_reports_current_renderer_camera_hud_dino_paths
  expected: readback records applied/fallback state for renderer, camera, HUD, and dino

12_presentation_frame_record_journals_all_subrecords
  expected: one frame record contains runner, dino, camera, HUD, contact, scene, and render subrecords

13_host_get_state_exposes_presentation_snapshot
  expected: PrehistoricRushHost.getState().presentation is additive and existing fields remain stable

14_dom_free_fixture_replays_source_to_presentation_chain
  expected: fixture rows run without document, canvas, WebGL, Three.js, or Rapier

15_renderer_output_unchanged_by_contract_layer
  expected: visual mutation calls remain behaviorally unchanged by the added record layer

16_legacy_runtime_remains_playable_during_cutover
  expected: menu/game/run-over/win flow still works after contract integration
```

## Output shape for fixture

```json
{
  "ok": true,
  "fixture": "prehistoric-rush-presentation-frame-fixture",
  "rows": [
    {
      "id": "01_runner_source_state_projects_current_app_state",
      "ok": true,
      "reason": "matched"
    }
  ],
  "summary": {
    "passed": 16,
    "failed": 0
  }
}
```

## Stop line

Stop when the fixture passes and `PrehistoricRushHost.getState().presentation` exists additively.

Do not combine this with a movement rewrite, terrain rewrite, renderer extraction, package.json creation, or ProtoKit promotion.
