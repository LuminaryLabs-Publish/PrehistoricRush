# Gameplay Audit: Run, Streaming and Physics Loop

**Timestamp:** `2026-07-11T02-41-37-04-00`

## Summary

The run simulation remains deterministic at the game-domain level, while world availability is now asynchronous and budgeted. Gameplay height, hazards and pickups therefore depend on the timing of patch activation, but no gameplay-facing readiness contract records whether the player's current and look-ahead patches are generated, activated and collider-complete.

## Plan ledger

**Goal:** Trace the player-facing loop through streamed patch availability and identify where asynchronous world state can affect movement, collisions and pickup outcomes.

- [x] Trace run state and input.
- [x] Trace height sampling.
- [x] Trace patch focus and readiness.
- [x] Trace collider and pickup rebuilding.
- [x] Trace Rapier and manual collision checks.
- [x] Trace shard collection.
- [x] Identify gameplay readiness gaps.

## Active gameplay loop

```txt
start/retry
  -> reset RunState
  -> update streaming focus
  -> synchronously prime center patch
  -> begin RAF

per frame
  -> browser input becomes steer/boost/jump
  -> engine.tick updates yaw, route region, surface multiplier, speed, jump, x/z/distance
  -> game height uses active patch data or fallback formula
  -> streaming focus follows player position and velocity
  -> controller updates active/prefetch/release sets
  -> generation is pumped
  -> at most one ready patch is activated
  -> player Rapier actor transform is projected
  -> Rapier steps
  -> Rapier contacts and manual tree-distance checks can fail the run
  -> active pickup rows can collect shards
  -> creature pose and render update
```

## Gameplay domains

```txt
run lifecycle: menu, game, run-over, win
route tracking and surface classification
speed, boost, steering and jumping
height projection
streaming focus and world availability
hazard collider projection
pickup admission and collection
Rapier contact outcome
manual collider fallback outcome
score, shards and distance goal
scene transitions and HUD projection
```

## Good changes

```txt
center patch is primed synchronously at run start
active radius is bounded to 2 / 25 patches
retain radius reduces immediate cache churn
prefetch uses current forward direction
activation is limited to one patch per frame
generated patch content is deterministic by seed, coordinates and settings hashes
collected shard IDs suppress re-rendered pickups
```

## Gameplay authority gaps

### Height source changes asynchronously

`game.setHeightSampler()` reads active patch terrain when available and a duplicated fallback formula otherwise. A player's Y value or camera look target can therefore switch source when a patch activates. No result records:

```txt
fallback height
patch height
absolute delta
continuity threshold
activation frame
```

The fallback uses a full-route nearest search while patch generation uses a center hint and bounded search radius, so equivalence is assumed rather than proven.

### Hazard availability changes with patch activation

Tree colliders do not exist in `view.colliders` or Rapier until their patch activates. A player can theoretically approach a desired but not-yet-active patch while using fallback terrain and without that patch's hazards. There is no gameplay admission rule such as:

```txt
current patch must be active
forward safety ring must be collider-complete
movement speed must be capped when readiness falls below threshold
```

### Two collision authorities remain

```txt
Rapier contacts
manual distance against view.colliders
```

Both can fail the run, but no typed outcome identifies the source, patch ID, collider ID, activation revision or physics step.

### Pickup visibility and authority are coupled to active rebuilds

Pickup rows are recreated from active patches after every activation/release and after collection. The system has stable pickup IDs, but no row proves:

```txt
patch active
pickup rendered
pickup gameplay-active
pickup collected
pickup removed from render
```

## Missing gameplay evidence

```txt
run ID and stream session ID
player patch ID and required safety patch IDs
current/forward readiness result
height source and transition delta
hazard/pickup consumer revision
collision outcome source and collider identity
pickup admission/collection/removal rows
streaming stall or degraded-mode decision
```

## Recommended gameplay contract

```txt
StreamReadinessResult
  runId
  streamSessionId
  playerPatchId
  requiredPatchIds
  activePatchIds
  colliderCompletePatchIds
  heightReady
  safeToAdvance
  reason
```

The game domain can consume this result without owning generation or rendering. It should make any slowdown, hold, fallback or failure policy explicit rather than allowing patch timing to silently alter gameplay.

## Next safe ledge

```txt
PrehistoricRush Stream Readiness Authority
+ Height / Hazard / Pickup Fidelity Fixture Gate
```
