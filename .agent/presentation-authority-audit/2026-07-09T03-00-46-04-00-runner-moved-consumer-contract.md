# PrehistoricRush Runner Moved Consumer Contract

**Timestamp:** `2026-07-09T03-00-46-04-00`

## Why this is the next cut

The repo already has an event-shaped consumer in `dino-pose-domain-kit`.

That kit listens for `runner.moved` and emits `dino.pose.changed`.

The live route never emits `runner.moved`, so the installed domain graph is not yet consuming live gameplay facts.

## Contract goal

Create an additive bridge from the live runner state to the existing domain event consumer without changing visible gameplay.

## Source contract

```txt
RunnerSourceState
  version
  frame
  scene
  entityId
  position: { x, y, z }
  yaw
  speed
  turn
  jumpY
  grounded
  distance
  shards
  best
  time
```

## Delta contract

```txt
RunnerStepDelta
  version
  frame
  previousFrame
  moved
  dx
  dz
  distanceDelta
  yawDelta
  speedDelta
  turnDelta
  jumpDelta
  shardDelta
  sceneBefore
  sceneAfter
```

## Event contract

```txt
RunnerMovedEvent
  type: runner.moved
  entityId: dino
  frame
  source: live-runtime-terrain-v6
  payload:
    speed
    turn
    jump
    time
    yaw
    distance
```

The payload must satisfy `createDinoPoseDomainKit().update({ speed, turn, jump, time })`.

## Consumer contract

```txt
runner.moved
  -> dino-pose-domain-kit update(payload)
  -> dino.pose.changed
  -> latest event bus readback
  -> DinoPoseFrame
```

## Host projection contract

`PrehistoricRushHost.getState().presentation` should expose:

```txt
latestRunnerSourceState
latestRunnerStepDelta
latestRunnerMovedEvent
latestDinoPoseFrame
recentEvents
recentFrames
bridgeStatus
```

Existing fields must stay stable:

```txt
scene
runner
physics
terrain
renderer
```

## Fixture rows

```txt
01_runner_source_state_snapshot_is_serializable
02_runner_step_delta_noops_without_previous_state
03_runner_step_delta_detects_position_change
04_runner_moved_event_omitted_when_no_movement
05_runner_moved_event_created_when_distance_delta_positive
06_runner_moved_payload_matches_dino_pose_update_contract
07_event_bus_receives_runner_moved
08_dino_pose_domain_emits_dino_pose_changed
09_dino_pose_frame_reads_pose_event
10_host_projection_contains_bridge_status
11_host_projection_keeps_legacy_fields
12_dom_free_fixture_requires_no_window_document_or_webgl
```

## Implementation boundary

Add pure files first:

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

Then splice into `src/game.js` only additively.

## Anti-goals

```txt
Do not rewrite runtime-terrain-v6.mjs in the same pass.
Do not replace direct movement logic yet.
Do not remove applyReadableStride, applyCloseCamera, or renderHud.
Do not make dino-pose-domain-kit browser-dependent.
Do not add shared ProtoKit promotion before fixture proof.
```