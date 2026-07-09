# Gameplay Audit: Runner Moved Event Bridge Loop

**Timestamp:** `2026-07-09T19-29-23-04-00`

## Current gameplay loop

```txt
menu scene
  -> Start button / Enter / Space changes scene to game
  -> keydown sets left/right/boost/jump flags
  -> keyup clears left/right/boost flags

game scene
  -> increment time
  -> derive turn from input flags
  -> mutate yaw by turnRate
  -> ease speed toward maxSpeed or boostSpeed
  -> apply jump velocity and gravity
  -> compute dx/dz from yaw and speed
  -> mutate x/z/distance/best
  -> sample terrain height
  -> rebuild terrain chunks and population when needed
  -> update Rapier actor transform
  -> check Rapier contacts or local collider overlap
  -> run-over on contact
  -> collect shard and repopulate
  -> win when distance > 3600
```

## Proof gap

The gameplay loop mutates state directly. It does not create a stable movement result row.

Missing stable facts:

```txt
input sample
previous runner source state
step delta
new runner source state
movement accepted status
collision/contact status
pickup collection status
scene transition status
reason code
runner.moved event payload
```

## Existing DSK consumer

`dino-pose-domain-kit` already has the correct event seam:

```txt
eventBus.on("runner.moved", ({ payload }) => {
  eventBus.emit("dino.pose.changed", update(payload));
});
```

The live runner does not emit `runner.moved`, so the DSK pose domain is not the source of the live raptor pose.

## Next gameplay contract

Add these before changing game feel:

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
```

The fixture should cover at least:

```txt
menu no-run frame
start transition
straight movement
left/right turn movement
boost movement
jump start
jump falling
grounded recovery
tree/rock contact to run-over
shard pickup
win threshold
```

## Deferred

```txt
movement retune
new obstacles
new pickups
terrain generation rewrite
physics-kit promotion
save/load expansion
```
