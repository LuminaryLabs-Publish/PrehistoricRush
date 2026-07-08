# PrehistoricRush Fixture Source Wire Map

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T12:09:27-04:00`

## Purpose

Define the next implementation source map for turning the current live runner and presentation pass into fixture-readable records without changing gameplay or visuals.

## Current source seam

```txt
src/game.js
  currently owns: event bus, domain host, scheduler, dino/camera/HUD domain installation, presentation pass
  gap: presentation pass records no source/result objects

src/runtime-terrain-v6.mjs
  currently owns: live app, state, input, movement, terrain, contacts, pickups, scene, baseline camera/HUD/render, host getState
  gap: no event bridge from live runner state into the domain scaffold
```

## Source files to add next

```txt
src/presentation/runner-source-state.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Existing files to modify next

```txt
src/game.js
  import new pure presentation helpers
  record source state before direct mutations
  emit runner.moved through existing event bus when live movement has a real delta
  record dino.pose.changed observations when available
  append PresentationFrameRecord beside existing direct camera/HUD/stride/render mutations
  expose presentation journal through composition or host patch

src/runtime-terrain-v6.mjs
  optional minimal non-breaking hook only if host presentation snapshot cannot be projected from src/game.js alone
  do not rewrite live runner loop during this gate
```

## Required pure records

```txt
RunnerSourceState
RunnerMovedEvent
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
PresentationFrameRecord
PresentationJournalSnapshot
HostPresentationSnapshot
```

## Source map

```txt
PrehistoricRushHost.app.scene
PrehistoricRushHost.app.frame
PrehistoricRushHost.app.state
PrehistoricRushHost.app.input
PrehistoricRushHost.app.view.camera
PrehistoricRushHost.app.view.player.userData
PrehistoricRushHost.app.ui.status
PrehistoricRushComposition.domainHost.get("camera-domain-kit")
PrehistoricRushComposition.domainHost.get("hud-domain-kit")
PrehistoricRushComposition.eventBus
  -> RunnerSourceState
  -> RunnerMovedEvent
  -> runner.moved
  -> dino.pose.changed
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
  -> PresentationJournalSnapshot
  -> PrehistoricRushHost.getState().presentation
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
08_presentation_frame_record_journals_all_subrecords
09_host_get_state_exposes_presentation_snapshot
10_dom_free_fixture_replays_source_to_presentation_chain
11_renderer_output_unchanged_by_contract_layer
12_legacy_runtime_remains_playable_during_cutover
```

## Anti-regression constraints

```txt
Do not remove runtime-terrain-v6.mjs.
Do not remove globalThis.PrehistoricRushHost.
Do not remove globalThis.PrehistoricRushComposition.
Do not change controls.
Do not change the scene flow.
Do not change raptor geometry.
Do not change current camera/HUD/stride visible behavior.
Do not require DOM, WebGL, Rapier, or requestAnimationFrame for the fixture rows.
```

## Completion condition

The gate is complete when the current route can still play while a headless fixture can prove:

```txt
RunnerSourceState -> RunnerMovedEvent -> runner.moved -> dino.pose.changed -> DinoPoseFrame -> CameraFrameRequest -> HudFrameRequest -> PresentationFrameRecord -> host.presentation
```
