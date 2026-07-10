# Gameplay Audit: Runner Event Result Loop

**Timestamp:** `2026-07-10T01-31-29-04-00`

## Gameplay shape

`PrehistoricRush` is a static browser infinite runner with menu, game, run-over, win, and menu-return style states.

The player starts from menu, steers left/right, boosts, jumps, collects shards, avoids rocks and trees, and wins after the distance threshold.

## Current gameplay loop

```txt
menu scene
  -> Start button / Enter / Space
  -> game scene
  -> keydown/keyup update left/right/boost/jump input flags
  -> speed eases toward max or boost speed
  -> turn updates yaw
  -> jump velocity and gravity update jumpY
  -> x/z/distance update from yaw and speed
  -> terrain sample updates ground y
  -> terrain chunks rebuild as runner moves
  -> objects repopulate every terrain shift or eighth frame
  -> Rapier actor transform updates
  -> collision checks can switch scene to run-over
  -> pickup checks collect shard, increment shards, repopulate
  -> distance > 3600 switches scene to win
  -> best distance writes into runner state and localStorage source
  -> raptor pose, camera, HUD, and render update directly
```

## Gameplay domains

```txt
menu-scene
game-scene
run-over-scene
win-scene
keyboard-input
runner-speed
runner-turn
runner-yaw
runner-jump
runner-gravity
runner-position
runner-distance
runner-terrain-sampling
runner-terrain-stream
runner-contact
runner-pickup
runner-score
best-distance-storage
scene-dispatch
rapier-actor-transform
host-state-projection
movement-event-readback-next
```

## Current gameplay services

```txt
input service: mutates app.input flags from keyboard events.
motion service: mutates speed, turn, yaw, x, z, y, distance, and best.
jump service: mutates vy, jumpY, grounded, and one-shot jump intent.
terrain service: samples and rebuilds nearby terrain chunks.
spawn service: populates trees, rocks, shards, colliders, and pickups.
physics service: sets kinematic actor transform and reads contact snapshot.
contact service: changes scene to run-over when collision conditions hit.
pickup service: marks shard collected, increments shard count, and repopulates.
scene service: switches menu, game, run-over, and win directly.
render service: applies raptor pose, camera, HUD, and render directly.
host service: exposes raw runner state and renderer label.
```

## Missing gameplay proof

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
MovementResultRow
ContactResultSnapshot
PickupResultSnapshot
SceneDispatchResult
BestDistanceResult
PresentationFrameRecord
PresentationJournalSnapshot
```

## Next gameplay-safe work

```txt
capture before/after runner state
compute RunnerStepDelta
emit RunnerMovedEvent for accepted movement frames
record MovementResultRow with status and reason
record contact, pickup, scene, and best-distance result rows
feed dino-pose-domain-kit through runner.moved instead of bypassing it
preserve current movement feel
```

## Deferred work

```txt
movement retune
terrain rewrite
new obstacle economy
new pickup economy
new route structure
visual expansion
ProtoKit promotion
```
