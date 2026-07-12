# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T22-38-54-04-00`

## Summary

Finish the existing route, creator, streaming and collider authorities, then make each gameplay step choose one explicit continue, fail or win result before cadence, readiness, committed-frame and public-host work consumes it.

## Plan ledger

**Goal:** replace mutation-by-source-order with one outcome transaction and use its committed result as the source for events, transitions, rendering, HUD and public diagnostics.

- [ ] Complete route and deployed-page artifact proof.
- [ ] Implement creator draft, profile commit and preview-frame authority.
- [ ] Implement patch activation/release and exact collider replacement.
- [ ] Introduce run-step identity and immutable predecessor capture.
- [ ] Stage movement without early win mutation.
- [ ] Collect typed Rapier/fallback collision, pickup and goal candidates.
- [ ] Select and version collision/goal/pickup precedence.
- [ ] Atomically commit movement, rewards, outcome, event bundle and transition.
- [ ] Render a terminal frame carrying `runStepId` and `outcomeRevision`.
- [ ] Continue cadence, readiness, committed-frame and public-host isolation afterward.
- [ ] Complete coordinated reset and ordered disposal last.

## Ordered implementation queue

```txt
1. Route Artifact + Game Profile Handoff Final Proof
2. Character Creator Draft + Commit + Preview Frame Authority
3. Patch Activation / Release Commit Authority
4. Exact Collider Replacement + Collision Admission
5. Run-Step Outcome Arbitration + Terminal Frame Authority
6. Stream Cadence + Time Budget Authority
7. World Readiness + Movement Admission
8. Committed Gameplay Frame + Read Model
8a. Public Host Capability Gateway
9. Run / Stream / Collider / Worker / Frame Epoch Reset
10. Runtime Lifecycle + Ordered Disposal
```

## Outcome implementation sequence

### 1. Create the step command

```txt
RunStepCommand {
  commandId
  runtimeSessionId
  runSessionId
  runId
  expectedRunStepId
  expectedRunRevision
  worldReadinessRevision
  colliderMembershipRevision
  dt
  input
}
```

### 2. Prepare instead of mutating

```txt
capture predecessor
compute movement proposal
compute route/surface/height proposal
prepare actor collision query pose
collect pickup and goal candidates
```

Do not set `win`, emit a terminal event or request a scene transition during proposal.

### 3. Normalize collision evidence

- [ ] Preserve Rapier contact source and collider identity.
- [ ] Preserve fallback overlap source and descriptor identity.
- [ ] Record disagreement instead of reducing both sources immediately to boolean OR.
- [ ] Require the current collider membership revision.

### 4. Select a versioned policy

```txt
TerminalOutcomePolicy {
  collisionVsGoal
  collisionVsPickup
  goalVsPickup
  failedMovementPolicy
  terminalRewardPolicy
  collisionSourcePolicy
}
```

The safe initial proposal is collision-first with no post-collision reward, but product policy must be selected and versioned explicitly.

### 5. Commit once

```txt
RunStepCommit
  -> compare predecessor revision
  -> install accepted movement and rewards
  -> install exactly one continue/fail/win status
  -> publish one ordered event bundle
  -> submit one idempotent transition
  -> retain RunStepResult
```

### 6. Acknowledge presentation

```txt
TerminalFrameReceipt {
  frameId
  runStepId
  outcomeRevision
  renderedStatus
  renderedDistance
  renderedShardCount
  sceneAcknowledged
  hudAcknowledged
}
```

### 7. Route the public host through the result

- [ ] Expose no raw engine, physics, adapter, controller or camera owner.
- [ ] Submit host commands through run-step or existing authoritative owners.
- [ ] Read only the committed frame/read model.
- [ ] Reject stale epochs and duplicate commands idempotently.

## Required fixtures

```bash
node scripts/prehistoric-rush-run-step-goal-only-fixture.mjs
node scripts/prehistoric-rush-run-step-collision-only-fixture.mjs
node scripts/prehistoric-rush-run-step-pickup-only-fixture.mjs
node scripts/prehistoric-rush-run-step-goal-collision-fixture.mjs
node scripts/prehistoric-rush-run-step-collision-pickup-fixture.mjs
node scripts/prehistoric-rush-run-step-goal-pickup-fixture.mjs
node scripts/prehistoric-rush-run-step-goal-collision-pickup-fixture.mjs
node scripts/prehistoric-rush-terminal-event-order-fixture.mjs
node scripts/prehistoric-rush-terminal-frame-parity-fixture.mjs
node scripts/prehistoric-rush-run-step-idempotency-fixture.mjs
```

## Acceptance conditions

```txt
one outcome per runStepId
win cannot skip collision admission accidentally
RunFailed cannot be followed by an unadmitted ShardCollected
movement retention on failure follows explicit policy
Rapier/fallback disagreement remains observable
state, events, transition, HUD and scene share outcomeRevision
duplicate commands do not duplicate reward or transition
public readback comes from the committed result/frame
```

## Do not do next

Do not add a second run-state store, physics world, pickup inventory, command gateway or render loop. Do not encode precedence through source placement. Do not treat a scene transition request or mutable state sample as visible-frame proof.
