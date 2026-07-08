# Presentation Frame Contract Acceptance Ledger

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T08:11:28-04:00`

## Purpose

Narrow the next implementation slice for `PrehistoricRush` into a stable frame-contract gate.

The repo should not keep adding visual polish while the live frame is still:

```txt
PrehistoricRushHost.app
  -> direct HUD DOM mutation
  -> direct dino rig mutation
  -> direct Three.js camera mutation
  -> direct renderer.render()
```

The next cut should keep the same visuals but make every presentation decision inspectable as data.

## Current source facts

```txt
README.md
  -> standalone additive game repo for a NexusEngine-powered infinite runner
  -> menu -> game -> run-over -> win -> menu
  -> reusable behavior should move into NexusEngine core kits or ProtoKits after proof

src/game.js
  -> installs event bus, domain host, tick scheduler, dino domains, camera domain, and HUD domain
  -> exposes PrehistoricRushComposition.snapshot()
  -> imports runtime-terrain-v6.mjs
  -> runs startPresentationPass()
  -> reads PrehistoricRushHost.app
  -> directly calls styleHud, applyReadableStride, applyCloseCamera, renderHud, and renderer.render

src/runtime-terrain-v6.mjs
  -> loads Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> owns terrain, scatter, actor state, input, jump, boost, distance, contact, pickups, scene outcomes, baseline camera, baseline HUD, and PrehistoricRushHost.getState()
```

## Required frame contract

```txt
RunnerSourceState
  frame: number
  scene: menu | game | run-over | win
  x: number
  y: number
  z: number
  jumpY: number
  yaw: number
  turn: number
  speed: number
  distance: number
  shards: number
  grounded: boolean
  input: left/right/boost/jump snapshot
  physics: enabled/fallback snapshot
  terrain: chunk count / terrain key

RunnerMovedEvent
  source: RunnerSourceState
  delta: dx/dz/distanceDelta
  accepted: boolean
  reason: moved | paused | scene-not-game | no-delta

DinoPoseFrame
  entityId: dino
  stridePhase: number
  leg rotations
  hip/head/tail offsets
  sourceRunnerFrame: number

CameraFrameRequest
  presetId: close-third-person-v1
  position target
  lookAt target
  lerp alpha
  sourceRunnerFrame: number

HudFrameRequest
  descriptorId: readability-hud-v1
  scene label
  distance text
  speed text
  shard count
  Rapier mode
  progress ratio
  sourceRunnerFrame: number

PresentationFrameRecord
  runnerSourceState
  runnerMovedEvent
  dinoPoseFrame
  cameraFrameRequest
  hudFrameRequest
  applied: boolean
  fallbackReasons: string[]
```

## Acceptance rows

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

## Implementation notes

Keep the route stable.

Do not replace `runtime-terrain-v6.mjs` yet.

Do not promote to ProtoKits yet.

First add local descriptor and fixture proof. Promotion only makes sense after the frame contract works without DOM, Three.js renderer timing, or Rapier frame timing.

## Anti-goals

```txt
- no visual redesign
- no new branches
- no StageKit-style rewrite
- no generic shared kit before local proof
- no removal of PrehistoricRushHost.getState()
- no localStorage, scene, or route behavior changes
```

## Stop condition

Stop the implementation slice when a fixture can prove:

```txt
RunnerSourceState
  -> runner.moved
  -> dino.pose.changed / DinoPoseFrame
  -> camera.frame.requested / CameraFrameRequest
  -> hud.frame.requested / HudFrameRequest
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
```

without needing DOM, canvas, WebGL, or Rapier execution.
