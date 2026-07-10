# Gameplay Audit: Session Start, Retry, and Run Again Transaction Loop

Timestamp: `2026-07-10T18-01-03-04-00`

## Declared scene loop

```txt
menu -> game
run-over -> menu or retry -> game
win -> menu or again -> game
```

## Live scene loop

```txt
menu
  -> Start / Enter / Space
  -> app.scene = game

game
  -> contact
  -> app.scene = run-over

game
  -> distance > 3600
  -> app.scene = win

run-over or win
  -> button / Space
  -> app.scene = game
  -> existing state continues
```

## Interaction and state ownership

The same mutable runner state object owns position, yaw, speed, distance, jump state, colliders, pickups, collected keys, time, shards, and best distance. Start/retry/run-again do not create a new session or separate persistent best-distance state from transient run state.

## Missing transaction rows

```txt
SessionStartCommand
SessionStartResult
TerminalResult
SceneTransitionResult
RestartCommand
RestartTransaction
SessionSnapshot
```

## Required reset boundary

Reset for Retry / Run Again:

```txt
x / y / z
yaw / turn
speed
distance
jumpY / vy / grounded
colliders / pickups
collected Set
shards
time
contact and terminal cause
terrain center/population
physics actor transform
input flags
```

Preserve intentionally:

```txt
best distance
runtime dependency admission
renderer/runtime mount
user control preferences if later added
```

## Required invariants

```txt
Start creates session-1 with a deterministic initial fingerprint
run-over records contact cause and source frame
Retry creates session-2 with a fresh transient state
Retry preserves best distance
win records distance-threshold cause and source frame
Run Again creates a new session below the win threshold
menu transitions either follow game-scenes.json or are explicitly unsupported
repeated restart commands are idempotent per command ID
```

## Ordering dependency

Session transactions must share the same source-frame authority used by input, simulation, terminal detection, presentation, and render. A restart cannot safely mutate the same state while two presentation loops are still active without a phase boundary.

## Next ledge

```txt
Runtime admission
  -> one frame owner
  -> typed terminal result
  -> session restart transaction
  -> detached host observation
  -> deterministic fixture
```