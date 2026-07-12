# Terminal Outcome Audit: Single-Step Outcome Commit Contract

**Timestamp:** `2026-07-11T22-38-54-04-00`

## Summary

Terminal outcome must be selected once from the complete same-step candidate set. The current implementation lets source order decide precedence and allows a reward mutation after failure.

## Plan ledger

**Goal:** define the canonical policy, transaction, result, event and replay contract for continue, fail and win outcomes.

- [x] Define candidate inputs.
- [x] Define precedence-policy requirements.
- [x] Define commit and event atomicity.
- [x] Define idempotency and replay behavior.
- [x] Define frame acknowledgement.
- [ ] Select final product precedence and implement it.

## Outcome candidates

```txt
movement candidate
collision candidates from Rapier and fallback
pickup candidates
route/goal candidate
world-readiness result
collider-membership result
```

## Policy descriptor

```txt
TerminalOutcomePolicy {
  id
  version
  collisionVsGoal
  collisionVsPickup
  goalVsPickup
  failedMovementPolicy
  terminalRewardPolicy
  collisionSourcePolicy
}
```

## Suggested policy values

```txt
collisionVsGoal: collision-first
a collisionVsPickup: collision-first
goalVsPickup: admit-before-goal | suppress-on-goal
failedMovementPolicy: predecessor | contact-pose | proposed
terminalRewardPolicy: explicit accepted set only
collisionSourcePolicy: rapier-primary-with-fallback-diagnostic
```

The product must choose and version these values. The current source order is not a valid policy descriptor.

## Commit contract

```txt
prepare
  -> capture predecessor
  -> compute candidates
  -> decide outcome
  -> construct immutable next run state
  -> construct ordered event bundle
  -> construct transition command

commit
  -> compare expected predecessor revision
  -> install next run state once
  -> publish event bundle once
  -> submit transition once
  -> record RunStepResult

acknowledge
  -> render world and HUD
  -> publish TerminalFrameReceipt
```

## Required outcome result

```txt
TerminalOutcomeResult {
  runStepId
  policyId
  policyVersion
  outcomeRevision
  outcome: continue | fail | win
  reason
  acceptedMovement
  acceptedPickupIds
  rejectedPickupIds
  goalReached
  collisionSource
  transitionId
  eventIds
  committed
}
```

## Event rules

```txt
RunWon and RunFailed are mutually exclusive for one runStepId
ShardCollected events must be part of the accepted event bundle
no event may mutate state independently after terminal commit
event order is deterministic and persisted
repeated publication is idempotent by event ID
```

## Transition rules

```txt
transition ID derives from runId + runStepId + outcomeRevision
only committed terminal result may request win/run-over scene
repeated request returns the original transition result
stale or conflicting terminal transition is rejected
```

## Replay and persistence

A replay record must contain:

```txt
predecessor run revision
RunStepCommand
candidate fingerprints
policy ID/version
TerminalOutcomeResult
event bundle
transition result
terminal frame receipt
```

## Failure handling

```txt
collision query failure -> reject/defer step by policy, do not assume no collision
pickup query failure -> reject rewards, preserve explicit result
goal query failure -> reject terminal commit
transition failure after state commit -> retain committed outcome and retry transition idempotently
frame failure -> preserve committed outcome and retry presentation, never recompute policy
```

## Acceptance conditions

```txt
complete same-step candidate set precedes terminal decision
one terminal outcome per step
no post-terminal direct reward mutation
terminal state, events, transition and frame share outcomeRevision
same command and predecessor replay to the same result
```
