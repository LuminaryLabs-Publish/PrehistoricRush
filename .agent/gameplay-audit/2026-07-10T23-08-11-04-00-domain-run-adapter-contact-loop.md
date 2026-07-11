# Gameplay Audit: Domain Run / Adapter Contact Loop

**Timestamp:** `2026-07-10T23-08-11-04-00`

## Active gameplay loop

```txt
start()
  -> replace RunState
  -> replace InputState
  -> emit RunStarted
  -> request core-scene transition to game

browser frame
  -> forward steer/boost into InputState
  -> engine.tick(dt)
  -> PrehistoricRushRunSystem updates yaw, route, surface, speed, jump, position and distance
  -> adapter updates terrain/population when the chunk changes
  -> external Rapier actor receives the game position
  -> external Rapier world steps
  -> adapter adds manual tree-radius collision test
  -> adapter calls game.fail() when hit
  -> adapter tests shard overlap
  -> adapter calls game.collectShard()
  -> adapter renders the resulting state

outcome
  -> distance threshold mutates status to win inside the run system
  -> emit RunWon
  -> request core-scene transition to win
```

## Gameplay ownership

The parent domain owns:

```txt
runId
status
position and yaw
speed and surface multiplier
jump state
elapsed time and distance
route index/progress/region
shard count and collected IDs
last collision
run events
scene-transition requests
```

The host adapter owns:

```txt
terrain height implementation
collision evidence
physics stepping
pickup overlap evidence
population placement
visual pose
camera
HUD
frame order
```

## Transaction gaps

```txt
- engine.tick completes before contact and pickup evidence is resolved
- fail or collect can mutate the same logical frame after the simulation step
- no frame command batch defines the order of simulation, physics, collision, pickup and outcome
- RunWon can be emitted before post-tick collision evidence is checked
- transition request results are not retained
- start/fail/collect return raw state or boolean values
- no command IDs or event sequence IDs exist
- external physics revision is absent from the game snapshot
```

A frame near the goal could theoretically cross the win threshold in the domain system and then encounter host-side collision evidence in the same browser frame. The status check prevents `fail()` from changing a non-game state, so the domain win silently wins the ordering conflict. That is a policy decision encoded accidentally by frame order rather than a typed outcome-resolution rule.

## Restart behavior

`start()` now resets the game-domain RunState and InputState more completely than the previous runtime. The adapter then clears only `view.key` and repopulates. The following remain outside the reset transaction:

```txt
external Rapier actor/world state
adapter time
graphics resources
terrain key and chunk mesh state
browser input booleans
RAF and listeners
scene transition result
host observation revision
```

## Target gameplay transaction

```txt
FrameCommandBatch
  -> RunSimulationResult
  -> PhysicsStepResult
  -> ContactResolutionResult
  -> PickupResolutionResult
  -> OutcomeResolutionResult
  -> SceneTransitionResult
  -> FrameGameplayCommitResult
```

All rows should share:

```txt
runId
frameId
command sequence
before revision
after revision
accepted/rejected status
reason
state fingerprint
```

## Required fixture cases

```txt
start from menu
retry from run-over
run again from win
jump consumption exactly once
boost and steer input projection
tree collision without goal crossing
goal crossing without collision
goal and collision in the same frame
shard overlap already collected
shard overlap and chunk repopulation
physics unavailable fallback policy
```

## Next safe ledge

Composition and adapter consumption must be proven before this frame transaction is implemented. The transaction depends on explicit owners for input, physics, motion, scene, animation, graphics and diagnostics.