# PrehistoricRush Gameplay Audit: Runner Moved Dino Pose Loop

**Generated:** `2026-07-09T11-46-08-04-00`

## Current gameplay loop

```txt
menu
  -> Start / Enter / Space begins game
  -> keyboard sets left/right/boost/jump booleans
  -> runner updates yaw, speed, jump, x/z, distance, terrain height
  -> terrain stream/population refreshes around runner
  -> Rapier kinematic actor transform is updated
  -> collision checks can switch scene to run-over
  -> pickups can increment shards
  -> distance threshold can switch scene to win
  -> raptor/camera/HUD/render update
```

## Gameplay domains in use

```txt
runner-input-domain
runner-motion-domain
jump-domain
speed-ramp-domain
terrain-follow-domain
terrain-streaming-domain
spawn-population-domain
physics-actor-domain
contact-domain
pickup-domain
score-distance-domain
scene-dispatch-domain
dino-pose-consumer-domain
camera-follow-domain
hud-telemetry-domain
render-frame-domain
host-readback-domain
```

## Gameplay services

```txt
start game from menu
set input booleans from keyboard
integrate runner yaw / speed / distance
apply jump and gravity
sample terrain height
stream chunks around runner
populate colliders / pickups / trees / rocks / shards
sync Rapier kinematic actor
check physics contacts
check fallback collider contacts
collect shard pickup
set run-over scene
set win scene
animate raptor rig
update camera
write HUD
render frame
read host state
```

## Main gameplay finding

The game has enough interaction and readability for the current vertical slice.

The missing gameplay proof is a stable event trail.

```txt
actual live mutation: app.state changes directly
needed proof: RunnerSourceState -> RunnerStepDelta -> RunnerMovedEvent -> DinoPoseFrame
```

## Runner moved contract

```txt
RunnerMovedEvent {
  event: "runner.moved"
  frame
  scene
  previous: RunnerSourceState
  current: RunnerSourceState
  delta: RunnerStepDelta
  reason: "input" | "terrain" | "jump" | "boost" | "scene-idle"
}
```

## Dino pose loop acceptance

```txt
1. runner source state is captured before presentation mutation.
2. step delta records dx, dz, distanceDelta, yawDelta, speedDelta, jumpDelta, and scene.
3. eventBus emits runner.moved when movement or relevant pose input changes.
4. dino-pose-domain-kit consumes runner.moved.
5. eventBus snapshot includes both runner.moved and dino.pose.changed.
6. PresentationFrameRecord captures both records in one frame.
```

## Do not expand gameplay yet

Do not add enemies, new levels, obstacles, power-ups, new camera modes, or more pickups until the gameplay event trail is fixture-readable.
