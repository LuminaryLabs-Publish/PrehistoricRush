# Gameplay Audit: Runner Moved Fixture Loop

**Timestamp:** `2026-07-09T09-02-44-04-00`

## Current gameplay loop

```txt
menu scene
  -> Start / Enter / Space
  -> game scene
  -> app.input left/right/boost/jump flags
  -> yaw/speed/jump/position/distance mutate inline
  -> terrain height sample updates y
  -> terrain chunks rebuild when chunk changes or every 8 frames
  -> colliders and pickups repopulate
  -> Rapier actor transform updates
  -> contacts or static collider overlap set run-over
  -> pickup overlap increments shards
  -> distance > 3600 sets win
```

## Gameplay domains in use

```txt
runner-input-domain
runner-motion-domain
runner-jump-domain
terrain-height-domain
terrain-stream-domain
spawn-collider-domain
physics-contact-domain
pickup-collection-domain
scene-dispatch-domain
score-distance-domain
best-distance-storage-domain
```

## Current gameplay services

```txt
keydown/keyup input capture
start route transition
speed interpolation
turn/yaw integration
jump/gravity integration
forward movement integration
terrain height sampling
terrain chunk population
collider and pickup generation
Rapier actor transform update
contact detection
static obstacle overlap detection
shard pickup detection
scene transition to run-over/win
best distance persistence
```

## Missing proof path

The live gameplay loop mutates state correctly for playability, but it does not emit stable gameplay facts.

The first missing event is:

```txt
runner.moved
```

That event should carry enough data for the dino pose kit and fixture rows:

```txt
speed
turn
jump
time
position
previousPosition
distanceDelta
scene
```

## Fixture rows

```txt
menu_idle -> no runner.moved
first_game_frame -> runner.moved emitted
turn_left -> turn positive/negative row depending current sign convention
turn_right -> opposite turn row
boost -> speed target shifts toward boostSpeed
jump_start -> jump > 0 and grounded false
jump_recover -> grounded true after jump
shard_pickup -> pickup result recorded
collision_run_over -> scene dispatch result records run-over
win_threshold -> scene dispatch result records win
```

## Gameplay rule

Do not move authority out of `runtime-terrain-v6.mjs` yet. First wrap observed source-state and deltas in additive records so fixture proof exists before deeper extraction.
