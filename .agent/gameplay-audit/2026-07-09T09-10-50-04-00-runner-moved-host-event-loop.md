# Gameplay Audit: Runner Moved Host Event Loop

**Timestamp:** `2026-07-09T09-10-50-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Gameplay loop

```txt
menu scene
  -> Start button / Enter / Space
  -> game scene
  -> keyboard input updates app.input
  -> motion integrates yaw, speed, jump, x/z, distance, terrain y
  -> terrain chunks update around runner
  -> populate(app) refreshes colliders and pickups
  -> Rapier actor transform updates
  -> collision checks can move scene to run-over
  -> pickup overlap increments shards
  -> distance threshold moves scene to win
  -> raptor pose/camera/HUD/render update
```

## Gameplay mechanics

```txt
forward auto-run
left/right steering
boost with W / ArrowUp
jump with Space
procedural terrain streaming
procedural trees, rocks, and shards
Rapier/fallback collision contact check
shard pickup collection
run-over fail scene
3600m win threshold
best distance in localStorage
```

## Current authority

`src/runtime-terrain-v6.mjs` owns all gameplay state mutation.

`src/game.js` currently observes and mutates presentation only after the fact.

## Domain event gap

The implemented `dino-pose-domain-kit` listens for `runner.moved`, but the live gameplay loop does not emit `runner.moved`.

That means the intended gameplay-to-presentation event contract exists in the scaffold but is not connected to the playable route.

## Required source records

```txt
RunnerSourceState:
  scene
  frame
  time
  x
  y
  z
  jumpY
  vy
  grounded
  yaw
  speed
  turn
  distance
  shards
  colliderCount
  pickupCount

RunnerStepDelta:
  previousFrame
  currentFrame
  dx
  dz
  distanceDelta
  yawDelta
  speedDelta
  jumpDelta
  sceneChanged
  shardDelta

RunnerMovedEvent:
  entityId: dino
  position
  heading
  speed
  turn
  grounded
  distance
  delta
```

## Fixture rows required

```txt
menu_idle
first_game_frame
first_movement_frame
turn_left
turn_right
boost
jump_start
jump_recover
pickup_collect
collision_run_over
win_threshold
legacy_host_fields_unchanged
```

## Next safe gameplay change

Add the event bridge as an observer.

Do not move gameplay authority out of `runtime-terrain-v6.mjs` yet.

Do not rewrite motion, collision, pickup, terrain, or scene transition logic until the fixture proves the readback rows.
