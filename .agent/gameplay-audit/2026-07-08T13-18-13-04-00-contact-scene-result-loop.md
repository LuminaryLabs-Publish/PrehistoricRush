# PrehistoricRush Contact / Scene Result Loop Audit

**Timestamp:** `2026-07-08T13:18:13-04:00`

## Gameplay loop identified

```txt
menu
  -> start input
  -> game
  -> left/right steering
  -> boost input
  -> jump input
  -> runner movement update
  -> terrain height sample
  -> terrain chunk update
  -> physics actor transform
  -> hazard contact check
  -> pickup contact check
  -> distance win check
  -> run-over or win scene
  -> retry / run again
```

## Current gameplay authority

`src/runtime-terrain-v6.mjs` currently owns the gameplay loop inline.

It directly mutates:

```txt
app.scene
app.input
app.state.turn
app.state.yaw
app.state.speed
app.state.vy
app.state.jumpY
app.state.grounded
app.state.x
app.state.z
app.state.distance
app.state.best
app.state.y
app.state.colliders
app.state.pickups
app.state.collected
app.state.shards
```

## Current contact authority

Hazard and pickup contacts are decided directly in the live loop:

```txt
hazard contact
  -> if physics contact or collider distance overlap
  -> app.scene = "run-over"

pickup contact
  -> if pickup distance overlap
  -> collected.add(key)
  -> shards++
  -> populate(app)
```

## Current scene authority

Scene transitions are currently direct mutations:

```txt
start button / Enter / Space from menu
  -> app.scene = "game"

hazard hit
  -> app.scene = "run-over"

distance > 3600
  -> app.scene = "win"

button from result scene
  -> app.scene = "game"
```

## Missing gameplay records

```txt
ActionFrame
ActionAcceptance
RunnerStepResult
RunnerMovedEvent
ContactResultSnapshot
PickupResult
HazardResult
SceneDispatchResult
PresentationFrameRecord
RunResultJournal
```

## Fixture target

```txt
01 menu start accepted
02 menu movement rejected/no-op
03 game left accepted
04 game right accepted
05 game boost accepted
06 game jump accepted when grounded
07 game jump rejected when airborne
08 runner moved emits deterministic delta
09 hazard contact emits run-over scene dispatch
10 pickup contact emits shard transaction
11 distance target emits win scene dispatch
12 retry emits game scene dispatch
```

## Safe implementation note

The first implementation must not change control feel, scene names, target distance, camera behavior, HUD behavior, or collision feel.

It should only add source/result records around the current mutations.
