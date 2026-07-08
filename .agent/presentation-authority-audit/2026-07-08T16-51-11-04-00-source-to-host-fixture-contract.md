# PrehistoricRush Source To Host Fixture Contract

**Timestamp:** `2026-07-08T16-51-11-04-00`

## Purpose

This audit defines the immediate fixture contract for the next implementation pass.

The current runner should remain visually unchanged while source facts become fixture-readable and host-readable.

## Source-to-host chain

```txt
PrehistoricRushHost.app.state
  -> snapshotRunnerSourceState(app)
  -> createRunnerMovedEvent(previous, next)
  -> eventBus.emit("runner.moved", payload)
  -> dino-pose-domain-kit emits dino.pose.changed
  -> createDinoPoseFrame(event)
  -> createCameraFrameRequest(app, cameraDomain)
  -> createHudFrameRequest(app, hudDomain)
  -> createContactResultSnapshot(app, checks)
  -> createSceneDispatchResult(previousScene, nextScene, reason)
  -> createRenderReadback(app, consumedDescriptors)
  -> createPresentationFrameRecord(parts)
  -> appendPresentationJournalEntry(record)
  -> projectHostPresentationSnapshot(journal)
  -> PrehistoricRushHost.getState().presentation
```

## Required source files

```txt
src/presentation/runner-source-state.js
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

## Fixture rows

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
11_render_readback_reports_current_renderer_camera_hud_dino_paths
12_presentation_frame_record_journals_all_subrecords
13_host_get_state_exposes_presentation_snapshot
14_dom_free_fixture_replays_source_to_presentation_chain
15_renderer_output_unchanged_by_contract_layer
16_legacy_runtime_remains_playable_during_cutover
```

## Host compatibility rule

`PrehistoricRushHost.getState()` must keep current fields.

Add only this nested field at first:

```txt
presentation:
  latestFrame
  recentFrames
  runnerSource
  movement
  dinoPose
  camera
  hud
  contact
  sceneDispatch
  renderReadback
  fixtureStatus
  missingInputs
  fallbackReasons
```

## Fixture acceptance rule

The DOM-free fixture does not need to render the game.

It must prove that current source-like inputs can create the same descriptor chain that the live host will later expose.
