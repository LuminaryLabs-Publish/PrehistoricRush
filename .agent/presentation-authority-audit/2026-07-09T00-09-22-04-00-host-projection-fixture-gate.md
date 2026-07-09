# PrehistoricRush Presentation Authority Audit - Host Projection Fixture Gate

**Timestamp:** `2026-07-09T00-09-22-04-00`

## Authority target

The next cut should make presentation authority inspectable without changing the visible game.

Current live presentation authority is split:

```txt
runtime-terrain-v6.mjs:
  baseline camera
  baseline HUD
  baseline raptor animation
  baseline render

src/game.js:
  readable stride override
  close camera override
  DSK HUD override
  second render
```

The missing authority layer is a pure record layer that sits beside those mutations.

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

## Required public diagnostic splice

Add only an additive nested field:

```txt
PrehistoricRushHost.getState().presentation
```

Do not remove or rename existing fields:

```txt
scene
runner
physics
terrain
renderer
```

## Fixture contract

```txt
source_state:
  projects scene, x, y, z, jumpY, yaw, speed, distance, best, shards, grounded, turn, time

step_delta:
  compares previous/current source state
  reports no-op in menu
  reports movement in game

runner_moved:
  emitted only when the game frame moved
  carries pose-ready payload
  is consumed by dino-pose-domain-kit

dino_pose_frame:
  reads dino.pose.changed
  records latest pose version, phase, speed, turn, jump, legs, arms, tail

camera_frame_request:
  records close camera policy inputs without changing visuals

hud_frame_request:
  records HUD projection inputs without changing DOM output

contact_result_snapshot:
  records hazard and pickup outcomes

scene_dispatch_result:
  records scene changes with before/after/reason

render_readback:
  records renderer/camera/HUD/dino consumption fields

presentation_frame_record:
  combines all records for one frame

host_presentation_snapshot:
  exposes latest and bounded recent records
```

## Acceptance rows

```txt
01_runner_source_state_projects_live_app_state
02_runner_step_delta_handles_menu_noop
03_runner_step_delta_handles_game_movement
04_runner_moved_event_payload_is_pose_ready
05_runner_moved_emission_updates_dino_pose_domain
06_dino_pose_frame_reads_changed_event
07_camera_frame_request_matches_close_camera_policy
08_hud_frame_request_matches_readability_hud_policy
09_contact_result_snapshot_records_hazard_and_pickup_paths
10_scene_dispatch_result_records_menu_game_run_over_win
11_render_readback_records_consumed_presentation_paths
12_presentation_journal_is_bounded
13_host_get_state_presentation_is_additive
14_dom_free_fixture_runs_without_canvas_or_webgl
15_visible_route_is_unchanged_by_record_layer
```

## Main restriction

Do not move this to shared ProtoKits until the local fixture has stable rows and a reusable API candidate.
