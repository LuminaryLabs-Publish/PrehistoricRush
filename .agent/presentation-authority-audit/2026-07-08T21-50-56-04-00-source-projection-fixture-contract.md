# PrehistoricRush Presentation Authority Audit: Source Projection Fixture Contract

**Timestamp:** `2026-07-08T21-50-56-04-00`

## Contract intent

Create a fixture-readable contract between the live legacy runner and the repo-local DSK scaffold.

The first bridge is not a renderer rewrite. The first bridge is a stable source projection from live `app.state` into records that existing and future kits can consume.

## Required source contracts

```txt
RunnerSourceState
  scene
  x
  y
  z
  yaw
  turn
  speed
  distance
  shards
  best
  jumpY
  time
  physicsEnabled
  terrainChunkCount

RunnerStepDelta
  previous
  current
  dx
  dz
  distanceDelta
  yawDelta
  speedDelta
  shardDelta
  jumpDelta
  sceneChanged
  moved

RunnerMovedEvent
  type: runner.moved
  entityId: dino
  frameId
  source
  delta
  movementKind
```

## Required consumer contracts

```txt
DinoPoseFrame
  source: runner.moved | fallback
  stridePhase
  legSwing
  armSwing
  hipLift
  tailTurn
  jumpInfluence

CameraFrameRequest
  source: camera-domain-kit + runner source
  mode: close-third-person
  target
  lookAt
  lerpRate
  reason

HudFrameRequest
  source: hud-domain-kit + runner source
  title
  scene
  progress
  distance
  targetDistance
  shards
  speed
  best
  debugRows

ContactResultSnapshot
  hazards[]
  pickups[]
  accepted[]
  rejected[]
  sceneRequest
  shardDelta

SceneDispatchResult
  previousScene
  nextScene
  reason
  accepted

RenderReadback
  renderer
  cameraConsumed
  hudConsumed
  dinoConsumed
  baselineRenderObserved
  presentationRenderObserved

PresentationFrameRecord
  frameId
  source
  delta
  runnerMovedEvent
  dinoPoseFrame
  cameraFrameRequest
  hudFrameRequest
  contactResultSnapshot
  sceneDispatchResult
  renderReadback
```

## Host contract

`PrehistoricRushHost.getState()` must keep existing fields and add a nested presentation field only.

```txt
PrehistoricRushHost.getState()
  .scene
  .runner
  .physics
  .terrain
  .renderer
  .presentation
    .latest
    .recent
    .fixtureVersion
    .missingInputs[]
    .fallbackReasons[]
```

## DOM-free fixture contract

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
  imports pure src/presentation/* modules
  does not import Three.js
  does not import Rapier
  does not require document/window
  creates menu fixture state
  creates game fixture state
  creates pickup fixture state
  creates hazard fixture state
  creates win fixture state
  checks source -> delta -> event -> frame -> host projection shape
```

## Acceptance rows

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
```

## Implementation cutline

```txt
allowed:
  pure source/projection modules
  additive event emission
  additive host snapshot field
  additive fixture script
  compatibility wrappers around existing visual mutation

not allowed first:
  deleting current runtime fields
  removing current renderer path
  replacing movement physics
  replacing terrain streaming
  replacing raptor rig
  moving to ProtoKits before fixture proof
```

## Next source file order

```txt
1. runner-source-state.js
2. runner-step-delta.js
3. runner-moved-event.js
4. presentation-events.js
5. dino-pose-frame.js
6. camera-frame-request.js
7. hud-frame-request.js
8. contact-result-snapshot.js
9. scene-dispatch-result.js
10. render-readback.js
11. presentation-frame-record.js
12. presentation-journal.js
13. host-presentation-snapshot.js
14. prehistoric-rush-presentation-frame-fixture.mjs
```
