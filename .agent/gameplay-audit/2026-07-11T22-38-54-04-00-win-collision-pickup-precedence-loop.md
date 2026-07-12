# Gameplay Audit: Win, Collision and Pickup Precedence Loop

**Timestamp:** `2026-07-11T22-38-54-04-00`

## Summary

The run step has three independently mutating outcome paths. Goal completion executes inside the Nexus simulation system, collision failure executes later in the browser host, and pickup rewards execute after collision without rechecking terminal status.

## Plan ledger

**Goal:** document the exact same-step outcome combinations and replace accidental source-order precedence with an explicit policy.

- [x] Trace movement and distance mutation.
- [x] Trace goal completion.
- [x] Trace Rapier and fallback collision.
- [x] Trace pickup mutation after collision.
- [x] Define candidate and committed outcome states.
- [ ] Implement and execute combination fixtures.

## Current step

```txt
1. update movement
2. add distance
3. sample height
4. check goal and possibly commit win
5. stream patches
6. if status still game, run collision
7. if collision, commit fail
8. still inside the same block, scan and collect pickups
9. render final state
```

## Same-step matrix

| Candidates | Current behavior | Problem |
|---|---|---|
| goal only | win | expected but not typed |
| collision only | fail | movement already committed |
| pickup only | collect | expected but not step-scoped |
| goal + collision | win, collision skipped | accidental goal precedence |
| collision + pickup | fail, then pickup may collect | terminal mutation after failure |
| goal + pickup | win, pickup skipped | accidental reward suppression |
| goal + collision + pickup | win, both skipped | no declared policy |

## Event ordering defect

`game.fail()` emits `RunFailed` and requests the run-over transition. The host does not leave the block. `game.collectShard()` has no `status === "game"` admission check, so the same frame can emit:

```txt
RunFailed
ShardCollected
```

The final snapshot can contain `status: run-over` and a shard count not present when the failure event was emitted.

## Movement commit defect

Position, route index, route progress, region, speed, distance and sampled height mutate before collision. Failure does not identify whether that proposed movement is retained, clamped, rolled back to a safe predecessor or projected to contact.

## Required candidate model

```txt
RunStepCandidates {
  movement
  collisions
  pickups
  goal
}
```

## Required decision model

```txt
RunStepDecision {
  policyVersion
  outcome: continue | fail | win
  acceptedMovement
  acceptedPickupIds
  rejectedPickupIds
  terminalReason
  transition
}
```

## Recommended safe default

Until product design chooses otherwise:

```txt
collision has precedence over goal
terminal failure admits no new pickup rewards after collision
accepted movement stops at the last validated pose or declared contact pose
goal is evaluated against the collision-admitted movement result
pickup rewards are evaluated only for the admitted pose and outcome
```

This is a proposed baseline, not a claim that the current game design already selected it.

## Required invariants

```txt
exactly one outcome per step
terminal status changes once
terminal event bundle is immutable
no reward mutation after terminal commit
win requires collision arbitration completion
all rewards cite the committing runStepId
replaying the same step cannot duplicate reward or transition
```

## Required fixtures

```txt
all seven candidate combinations
collision source disagreement
safe-pose retention
terminal event ordering
reward idempotency
transition idempotency
terminal snapshot/frame parity
```
