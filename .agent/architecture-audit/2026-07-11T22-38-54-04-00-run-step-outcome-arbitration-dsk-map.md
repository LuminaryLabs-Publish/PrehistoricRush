# Architecture Audit: Run-Step Outcome Arbitration DSK Map

**Timestamp:** `2026-07-11T22-38-54-04-00`

## Summary

Movement, route progress, goal completion, collision, pickups and terminal transitions currently cross the Nexus simulation domain and the browser host without one parent authority. The architecture needs one run-step result instead of sequential mutation by unrelated owners.

## Plan ledger

**Goal:** place outcome arbitration inside the existing product domain while preserving current route, physics, streaming, reward and rendering owners.

- [x] Map the current mutation order.
- [x] Separate proposal, observation, policy and commit responsibilities.
- [x] Define atomic and composite kits.
- [x] Define required identities and revisions.
- [x] Define integration with existing DSKs.
- [ ] Implement the domain and fixtures.

## Current authority split

```txt
prehistoric-rush-domain-kit
  owns movement mutation
  owns distance mutation
  owns immediate goal check
  owns win state/event/transition

browser game host
  owns Rapier transform and step
  owns fallback collision query
  calls fail after domain commit
  scans pickups after fail
  calls collectShard directly
  renders final mutable state
```

## Required parent domain

```txt
n:gameplay:prehistoric-rush:run-step-outcome-authority
```

Suggested implementation identity:

```txt
prehistoric-rush-run-step-outcome-authority-domain
```

## Atomic kit map

```txt
run-step-id-kit
  allocates monotonic run-scoped step IDs

run-step-command-kit
  normalizes input, dt, run/session identity and expected revisions

run-step-predecessor-kit
  captures immutable predecessor run state and accepted world/collider revisions

movement-proposal-kit
  computes proposed yaw, speed, jump, position, distance and surface state
  without publishing terminal status

movement-result-kit
  records predecessor/proposed transforms, distance delta and height evidence

collision-query-plan-kit
  derives the actor pose and collider membership to query

collision-observation-kit
  normalizes Rapier contacts and fallback overlaps into typed observations

collision-source-arbitration-kit
  applies one declared policy when Rapier and fallback disagree

pickup-candidate-kit
  derives overlapping, uncollected rewards from the proposed pose

pickup-admission-kit
  admits rewards according to selected outcome policy

goal-candidate-kit
  classifies whether proposed distance reaches the goal

terminal-outcome-policy-kit
  versions collision/goal/pickup precedence and terminal reward rules

terminal-outcome-arbitration-kit
  selects exactly one continue, fail or win result

run-step-commit-kit
  atomically commits accepted movement, rewards, status and transition state

run-event-bundle-kit
  emits one ordered event bundle tied to the committed step

run-step-result-kit
  returns typed accepted/rejected/failed evidence

terminal-frame-receipt-kit
  links the visible world/HUD frame to runStepId and outcomeRevision

run-step-journal-kit
  retains bounded command, candidate, decision and commit records

run-step-observation-kit
  exposes clone-safe current/last-committed outcome state

outcome-precedence-fixture-kit
  executes collision/goal/pickup combination cases
```

## Composite transaction

```txt
RunStepCommand
  -> validate runSessionId, runId, step predecessor and dt
  -> capture predecessor
  -> prepare MovementProposal
  -> validate world readiness and height source
  -> prepare collision query against accepted collider membership
  -> collect CollisionObservation[]
  -> collect PickupCandidate[]
  -> collect GoalCandidate
  -> apply TerminalOutcomePolicy
  -> prepare RunStepCommit
  -> atomically commit or reject
  -> emit RunEventBundle
  -> publish RunStepResult
  -> require TerminalFrameReceipt
```

## Required identity fields

```txt
runtimeSessionId
runSessionId
runId
runStepId
predecessorStepId
streamEpoch
worldReadinessRevision
colliderMembershipRevision
profileFingerprint
movementProposalId
collisionQueryId
outcomePolicyVersion
outcomeRevision
transitionId
frameId
```

## Precedence must be data

Do not encode precedence through source placement or `if` block order. A versioned policy must answer:

```txt
collision + goal
collision + pickup
goal + pickup
collision + goal + pickup
Rapier contact + fallback miss
Rapier miss + fallback overlap
```

## Integration boundaries

```txt
prehistoric-rush-domain-kit
  remains canonical owner of run state and transitions
  must stop committing win before collision/reward admission

seeded-world-patch-controller-kit
  supplies required patch and readiness identities

rapier-physics-domain-kit
  supplies typed contact observations for the proposed actor pose

active-content adapter
  supplies pickup candidates and fallback collision descriptors

core-scene-kit
  consumes only the committed terminal transition

Three/HUD adapters
  consume committed run-step results and publish frame receipts
```

## Non-goals

```txt
no second run-state store
no duplicate physics world
no duplicate pickup inventory
no new render loop
no hidden precedence in UI code
no rollback by mutating copied live objects after publication
```

## Acceptance conditions

```txt
one committed outcome per runStepId
win cannot skip collision admission accidentally
RunFailed cannot be followed by an unadmitted ShardCollected event
repeated terminal command is idempotent
movement, rewards, status, events and transition share one outcomeRevision
visible terminal frame cites the committed outcome
```
