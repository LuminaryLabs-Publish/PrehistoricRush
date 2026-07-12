# Interaction Audit: Movement, Collision, Pickup and Outcome Admission Map

**Timestamp:** `2026-07-11T22-38-54-04-00`

## Summary

Keyboard input enters the run domain, but the resulting movement, collision, pickup and terminal mutations do not pass through one command admission boundary. Direct host calls can therefore create a terminal state and then continue mutating rewards in the same frame.

## Plan ledger

**Goal:** define command admission from browser input through one committed run-step result.

- [x] Map browser input to domain input.
- [x] Map domain movement and goal mutation.
- [x] Map host collision and pickup calls.
- [x] Define command and result fields.
- [x] Define rejection and idempotency rules.
- [ ] Implement the command surface.

## Current interaction path

```txt
keydown / keyup / button
  -> host input booleans
  -> game.setInput
  -> engine.tick
  -> domain mutates movement and may win
  -> host may set physics transform
  -> host may call game.fail
  -> host may call game.collectShard
  -> renderer and HUD sample mutable state
```

## Current direct mutation surfaces

```txt
game.setInput(patch)
game.start()
game.fail(collision)
game.collectShard(shardId)
PrehistoricRushHost.engine.tick(dt)
PrehistoricRushHost.physics
PrehistoricRushHost.adapter
PrehistoricRushHost.patchController
```

The public host exposes enough mutable owners to bypass any future run-step policy unless access is capability-gated or reduced to clone-safe commands and observations.

## Required command

```txt
RunStepCommand {
  commandId
  runtimeSessionId
  runSessionId
  runId
  expectedRunStepId
  expectedRunRevision
  inputRevision
  worldReadinessRevision
  colliderMembershipRevision
  dt
  input
}
```

## Required admission checks

```txt
session and run are active
command is not duplicate or stale
expected predecessor matches
finite bounded dt
input revision is current
required world readiness is accepted
collider membership is current
no terminal outcome already committed
```

## Required candidate observations

```txt
MovementProposal
CollisionObservation[]
PickupCandidate[]
GoalCandidate
```

These are inputs to arbitration, not direct mutation permissions.

## Required result

```txt
RunStepResult {
  commandId
  runStepId
  predecessorRevision
  outcomeRevision
  accepted
  outcome
  movementResult
  collisionResult
  pickupResult
  goalResult
  transitionResult
  eventBundle
  rejection
  errors
}
```

## Admission policy

```txt
stale command -> reject without mutation
duplicate command -> return prior result
terminal run -> reject movement/reward commands
collision observation -> cannot call fail directly
pickup candidate -> cannot call collectShard directly
goal candidate -> cannot transition directly
only RunStepCommit may mutate run state
```

## Public host direction

Replace raw mutation ownership with:

```txt
submitRunStep(command)
getLastRunStepResult()
getRunObservation()
getCommittedFrameReceipt()
```

Keep raw engine/physics/adapter references behind explicit diagnostics-only capability if they must remain during migration.

## Required fixtures

```txt
stale predecessor rejection
duplicate command idempotency
terminal command rejection
collision candidate cannot mutate directly
pickup candidate cannot mutate directly
raw host mutation denied outside diagnostics capability
result and frame observation parity
```
