# PrehistoricRush Source File Manifest and Host Projection

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T16-40-56-04-00`

## Authority problem

The repo already has useful local domains, but the live route still bypasses them for the important frame facts.

`dino-pose-domain-kit` listens for `runner.moved` and emits `dino.pose.changed`, but `runtime-terrain-v6.mjs` does not yet emit a stable `runner.moved` event from the movement step.

`camera-domain-kit` exposes a close-third-person camera descriptor, but `applyCloseCamera()` still applies the live camera intent directly.

`hud-domain-kit` exposes a readability HUD descriptor, but `renderHud()` still writes the DOM directly.

`PrehistoricRushHost.getState()` exposes scene, runner, physics, terrain, and renderer string, but it does not expose `presentation`.

## Source file manifest

Add these files first, keeping visual behavior unchanged:

```txt
src/presentation/runner-source-state.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
src/presentation/render-readback.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Required exports

```txt
snapshotRunnerSourceState(app, options?)
createRunnerMovedEvent(previousRunner, nextRunner, frame)
emitRunnerMoved(eventBus, event)
createDinoPoseFrame({ pose, sourceEvent, frame })
createCameraFrameRequest({ cameraDescriptor, runner, frame })
createHudFrameRequest({ hudDescriptor, runner, scene, frame })
createContactResultSnapshot({ previousRunner, nextRunner, physics, hazards, pickups, scene, frame })
createSceneDispatchResult({ previousScene, nextScene, reason, source, frame })
createPresentationFrameRecord(parts)
createPresentationJournal({ limit })
projectHostPresentationSnapshot(journal, latestParts)
createRenderReadback({ app, frame, cameraRequest, hudRequest, dinoPoseFrame })
runPresentationFrameFixture(rows)
```

## Host projection target

`PrehistoricRushHost.getState()` should become additive and compatible:

```js
{
  scene: app.scene,
  runner: app.state,
  physics: app.physics?.getSnapshot?.(),
  terrain: { chunks: app.view.terrain.chunks.length },
  renderer: "three-terrain-v6-raptor",
  presentation: {
    latestFrame,
    recentFrames,
    latestRunnerSource,
    latestRunnerMovedEvent,
    latestDinoPoseFrame,
    latestCameraFrameRequest,
    latestHudFrameRequest,
    latestContactResult,
    latestSceneDispatch,
    latestRenderReadback,
    fixtureStatus
  }
}
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
11_presentation_frame_record_journals_all_subrecords
12_host_get_state_exposes_presentation_snapshot
13_render_readback_reports_current_renderer_camera_hud_dino_paths
14_dom_free_fixture_replays_source_to_presentation_chain
15_renderer_output_unchanged_by_contract_layer
16_legacy_runtime_remains_playable_during_cutover
```

## Acceptance criteria

```txt
- No route change.
- No visual rewrite.
- No new branch.
- No change to index.html.
- No removal of PrehistoricRushComposition.snapshot().
- No removal of existing PrehistoricRushHost.getState() fields.
- DOM-free fixture can exercise source-to-presentation projection.
- Browser route can still use the legacy runtime while host projection is added.
```

## Next safe ledge

```txt
PrehistoricRush Source File Manifest + Host Presentation Projection Fixture Gate
```
