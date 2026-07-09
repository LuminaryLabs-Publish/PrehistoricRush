# Gameplay Audit: Runner Moved Consumer Loop

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T06-10-35-04-00`

## Current gameplay loop

```txt
menu
  -> Start Rush / Enter / Space
  -> game
  -> A/D or arrows mutate turn flags
  -> W/ArrowUp mutates boost flag
  -> Space mutates jump flag
  -> game loop applies yaw, speed, jump, gravity, dx/dz, distance, terrain height, chunk rebuilds, collider refresh, physics actor transform, contacts, pickups, win threshold
  -> baseline renderer updates raptor/camera/HUD
  -> presentation pass applies closer camera, larger stride, readable HUD
  -> run-over / win / retry loops continue through the same app scene field
```

## Current mechanics

```txt
free forward runner motion
left/right steering
boost speed ramp
jump and gravity
terrain height following
procedural terrain chunk streaming
procedural tree/rock/shard scatter
hazard contact run-over
shard pickup scoring
3600m win target
best distance persistence
menu/game/run-over/win scene flow
```

## Gameplay authority gaps

```txt
input flags are not ActionFrame records yet
movement step has no RunnerStepDelta record
movement step has no RunnerMovedEvent record
jump and boost are not accepted/rejected results yet
hazard hit has no ContactResultSnapshot before scene mutation
pickup has no ContactResultSnapshot before shard mutation
win threshold has no SceneDispatchResult before scene mutation
run-over and retry are not journaled as results
dino pose domain has the correct runner.moved consumer shape, but live movement does not feed it
```

## Consumer loop to implement first

```txt
previous app.state snapshot
  -> current app.state snapshot
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit consumes event
  -> eventBus emits "dino.pose.changed"
  -> DinoPoseFrame readback
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
```

## Fixture rows required

```txt
01_runner_source_state_projects_current_app_state
02_runner_step_delta_reports_noop_in_menu
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
17_event_bus_recent_history_contains_runner_and_pose_events
18_host_projection_keeps_legacy_state_fields_unchanged
19_central_ledger_points_to_latest_repo_local_tracker
```

## Gameplay finding

The next pass should not change controls, speed, hazards, pickups, terrain, or win conditions.

It should record what the current gameplay already does, then expose the event/result chain as stable data.
