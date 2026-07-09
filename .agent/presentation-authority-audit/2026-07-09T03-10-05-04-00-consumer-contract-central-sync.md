# Presentation Authority Audit: Consumer Contract Central Sync

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T03-10-05-04-00`

## Authority target

The presentation layer needs to become fixture-readable before any visual or movement extraction.

The first authority seam is:

```txt
live runner state
  -> RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit consumer
  -> dino.pose.changed readback
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> RenderReadback
  -> PresentationFrameRecord
  -> PresentationJournalSnapshot
  -> PrehistoricRushHost.getState().presentation
```

## Why this seam first

`src/game.js` already installs the event bus, domain host, scheduler, dino domains, camera domain, and HUD domain.

`dino-pose-domain-kit` already listens for `runner.moved` and emits `dino.pose.changed`.

The missing piece is the bridge from the live `runtime-terrain-v6.mjs` app state into that existing domain contract.

## Consumer contract

```txt
runner.moved payload:
  frame
  scene
  x
  z
  y
  jumpY
  yaw
  speed
  turn
  distance
  shards
  grounded
  input
  delta
  source

DinoPoseFrame:
  frame
  entityId
  sourceEventId
  phase
  speed
  turn
  jump
  hips
  chest
  head
  legs
  arms
  tail

CameraFrameRequest:
  frame
  policyId
  targetPosition
  lookAt
  lerp
  sourceRunner

HudFrameRequest:
  frame
  policyId
  scene
  distance
  targetDistance
  speed
  shards
  best
  terrainChunkCount
  physicsEnabled

PresentationFrameRecord:
  frame
  source
  delta
  movedEvent
  dinoPose
  camera
  hud
  contact
  sceneDispatch
  render
  hostProjection
```

## Central sync requirement

Each future run must update both:

```txt
LuminaryLabs-Publish/PrehistoricRush/.agent/*
LuminaryLabs-Dev/LuminaryLabs/repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
```

This pass exists because repo-local `.agent` had advanced past the central ledger.

## Implementation guardrails

```txt
Keep existing PrehistoricRushHost.getState() fields.
Add nested presentation data instead of replacing legacy fields.
Keep PrehistoricRushComposition.snapshot() shape.
Keep the direct visual mutation paths until fixture parity exists.
Keep local proof before shared ProtoKit promotion.
```

## Acceptance rows

```txt
01_runner_source_state_uses_live_app_state
02_runner_step_delta_uses_previous_current_pair
03_runner_moved_event_is_emitted_from_game_motion
04_dino_pose_domain_consumes_runner_moved
05_dino_pose_frame_records_event_consumer_output
06_camera_frame_request_is_descriptor_readable
07_hud_frame_request_is_descriptor_readable
08_contact_result_snapshot_records_hazard_and_pickup_decisions
09_scene_dispatch_result_records_menu_game_run_over_win
10_render_readback_records_current_consumers
11_host_projection_is_additive
12_central_ledger_points_to_latest_repo_local_audit
```
