# Gameplay Audit: Run, Pose and Collision Consumption Loop

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T00-39-25-04-00`

## Current loop

```txt
start run
  -> reset RunState and InputState
  -> transition to game scene
  -> query player body descriptor
  -> register Rapier actor from descriptor collision
  -> construct Three skinned mesh from descriptor

per frame
  -> browser input forwards steer/boost/jump
  -> engine.tick mutates run state
  -> update terrain and streamed population
  -> project run transform to Rapier actor
  -> step physics and inspect contacts
  -> fail on contact or local collider overlap
  -> collect nearby shard
  -> create pose from speed/time/turn/jump/resistance
  -> apply pose to Three skeleton
  -> update camera/light/grass/shards
  -> render and project HUD
```

## Positive ownership change

The product no longer owns reusable body generation. `PLAYER_RAPTOR_PRESET` defines the game-specific creature configuration, while the official procedural creature kit produces the reusable body, skeleton, skinning, collision and pose descriptors.

## Authority gaps

### Pose sequence

The run system produces state, but pose creation happens later in the browser adapter. There is no sequence connecting:

```txt
input state
  -> run-state revision
  -> pose descriptor
  -> applied skeleton revision
  -> rendered frame
```

### Collision sequence

The Rapier actor is registered once from the initial body descriptor. The active host does not retain a collision binding result proving the actor uses the same creature ID/content hash as the Three binding. Contact results are not tied to body revision, run revision or frame ID.

### Dual collision paths

Failure may come from:

```txt
Rapier contact rows
or
manual distance checks against adapter collider rows
```

No typed result states which path admitted the failure, whether both detected it, or whether collision geometry was consistent.

### State and result contracts

```txt
start() returns a copied state row
fail() returns state and silently no-ops outside game
collectShard() returns boolean
pose creation returns a descriptor but consumption returns nothing
Rapier actor registration has no retained result
render submission has no committed-frame result
```

## Required correlation model

```txt
RunCommand
  -> RunResult
  -> runRevision
  -> CreaturePoseRequest
  -> PoseDescriptor
  -> PoseConsumptionRow
  -> CollisionBindingRow
  -> PhysicsStepResult
  -> OutcomeResult
  -> CommittedFrame
```

Every row should retain `runId`, monotonic `sequence`, relevant `frameId`, creature ID and descriptor content hash.

## Required parity proof

```txt
Three binding creatureId == game-domain player creatureId
Three binding contentHash == game-domain descriptor contentHash
Rapier binding creatureId == Three binding creatureId
Rapier collision dimensions == descriptor collision dimensions
pose creatureId == active binding creatureId
pose contentHash/revision == active binding contentHash/revision
outcome collision source is explicit
render frame references applied pose sequence
```

## Next gameplay gate

The creature consumption proof should land before animation tuning, new creature archetypes, combat, new collision shapes or visual polish. Typed run commands and fixed-frame publication remain follow-on work after this migration boundary is observable.