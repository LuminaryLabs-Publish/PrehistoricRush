# Render Audit: Terminal Event and Frame Correlation Gap

**Timestamp:** `2026-07-11T22-38-54-04-00`

## Summary

The Three.js frame and HUD render the final mutable run state, but no frame receipt proves which movement, collision, pickup, goal or terminal events were admitted. A visible win can be produced without same-step collision evaluation, and a visible run-over frame can include a shard collected after `RunFailed` was emitted.

## Plan ledger

**Goal:** make every terminal frame cite the one committed run-step outcome and ordered event bundle it represents.

- [x] Trace simulation-to-render ordering.
- [x] Trace HUD and button projection.
- [x] Identify missing frame and outcome identities.
- [x] Define terminal-frame inputs and acknowledgement.
- [x] Define failure and stale-frame handling.
- [ ] Implement frame receipts and visual fixtures.

## Current render order

```txt
engine.tick
  -> possible RunWon + win transition
updateStreaming
conditional collision/pickup block
  -> possible RunFailed
  -> possible ShardCollected after RunFailed
adapter.render(final mutable state)
HUD innerHTML from final mutable state
button text from final mutable state
request next RAF
```

## Missing evidence

```txt
runStepId
movementProposalId
collisionQueryId
collision decision
pickup candidate/admission set
goal candidate
outcome policy version
outcomeRevision
ordered event IDs
transition acceptance
world readiness revision
collider membership revision
render frame ID
HUD frame ID
```

## Concrete visible divergence cases

### Win frame without collision evidence

```txt
proposed movement reaches goal and overlaps tree
  -> domain commits win
  -> host skips collision because status != game
  -> renderer displays win state
  -> no frame field reveals collision was never evaluated
```

### Failed frame with post-failure reward

```txt
collision detected
  -> RunFailed emitted
  -> pickup loop continues
  -> ShardCollected emitted
  -> renderer displays run-over with increased shard total
  -> no frame field identifies the event order or reward policy
```

## Required frame input

```txt
CommittedRunFrameInput {
  runtimeSessionId
  runSessionId
  runId
  runStepId
  outcomeRevision
  outcome
  movementResult
  collisionResult
  admittedPickupIds
  rejectedPickupIds
  goalResult
  transitionResult
  worldReadinessRevision
  colliderMembershipRevision
  runStateSnapshot
}
```

## Required frame receipt

```txt
TerminalFrameReceipt {
  frameId
  runStepId
  outcomeRevision
  outcome
  renderedRunStatus
  renderedPosition
  renderedDistance
  renderedShardCount
  renderedTransition
  worldRevision
  colliderRevision
  hudAcknowledged
  sceneAcknowledged
  accepted
  errors
}
```

## Render admission rules

```txt
continue frame requires accepted continue result
win frame requires accepted win result and completed collision/reward arbitration
run-over frame requires accepted fail result and frozen admitted reward set
stale outcomeRevision cannot replace a newer visible frame
HUD and scene must acknowledge the same runStepId
terminal transition overlay cannot precede the committed result
```

## Required fixtures

```txt
win-only frame
a collision-only run-over frame
goal + collision frame follows policy
collision + pickup frame follows policy
RunFailed then unadmitted ShardCollected is rejected
HUD/scene runStepId mismatch
stale terminal frame rejection
first terminal frame screenshot/readback
```

## Current proof boundary

No runtime renderer or HUD behavior was changed. The audit proves source ordering only; browser capture and visual readback were not executed.
