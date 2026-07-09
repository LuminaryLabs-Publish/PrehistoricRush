# Gameplay Audit: Runner Event Bridge Loop

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T15-31-40-04-00`

## Gameplay surface

`PrehistoricRush` is a static browser infinite runner.

Current scenes:

```txt
menu
game
run-over
win
```

Current controls:

```txt
Enter / Space -> start
A / ArrowLeft -> turn left
D / ArrowRight -> turn right
W / ArrowUp -> boost
Space while game -> jump
```

## Current gameplay loop

```txt
start in menu
  -> player starts game
  -> input mutates app.input
  -> loop applies turn/yaw/speed/boost/jump/gravity
  -> x/z/distance advance
  -> terrain height sampled
  -> chunks rebuild and populate periodically
  -> physics actor transform updates
  -> collision with colliders or Rapier contacts can set run-over
  -> shard pickup increments shards and repopulates
  -> distance over 3600 sets win
  -> HUD reflects scene, distance, speed, heading, shards, best, chunks, and Rapier state
```

## Gameplay domain gaps

```txt
runner movement is not expressed as RunnerStepDelta
turn/boost/jump branches are not fixture rows
contact checks do not produce ContactResultSnapshot
pickup branch does not produce ContactResultSnapshot
win threshold does not produce SceneDispatchResult
run-over transition does not produce SceneDispatchResult
menu-to-game transition does not produce SceneDispatchResult
best distance write is not separated from score result
```

## Event bridge target

```txt
before frame:
  previous RunnerSourceState

after runtime state mutation:
  current RunnerSourceState
  RunnerStepDelta
  RunnerMovedEvent
  ContactResultSnapshot
  SceneDispatchResult

presentation pass:
  DinoPoseFrame
  CameraFrameRequest
  HudFrameRequest
  RenderReadback

host readback:
  PresentationFrameRecord
  PresentationJournalSnapshot
```

## Fixture rows needed

```txt
menu_idle
start_from_enter
start_from_space
first_forward_frame
turn_left
turn_right
boost
jump_start
jump_recover
shard_pickup
collision_run_over
win_threshold
host_legacy_fields_unchanged
presentation_journal_bounded
```

## Gameplay implementation rule

Do not tune feel in the proof pass.

The first implementation should only record and expose facts from the already-playable loop.
