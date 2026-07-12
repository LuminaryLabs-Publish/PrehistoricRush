# Streaming Authority Audit: Content Revision / Observation / Commit Contract

**Timestamp:** `2026-07-12T11-21-01-04-00`

## Summary

Patch-controller membership, active materialization, physics colliders, pickup observations and visible rendering need one transaction boundary. Today they advance through separate mutable calls.

## Plan ledger

**Goal:** define an atomic content revision that can be prepared, admitted, observed, committed, rolled back and proven visible.

- [x] Identify transaction participants.
- [x] Define revision identity and digests.
- [x] Define prepare, commit and rollback results.
- [x] Define stale-result and mixed-revision rejection.
- [ ] Implement the authority and failure fixtures.

## Participants

```txt
seeded-world-patch-controller
active patch membership
terrain slots
tree instance cells
grass instances
shard/pickup instances
fallback collider descriptors
core physics collider provider
product pickup and collision samplers
Three renderer
HUD/public readback
```

## Active content snapshot

```txt
ActiveContentSnapshot {
  runEpoch,
  streamGeneration,
  activeContentRevision,
  activePatchIds,
  activePatchDigest,
  colliderDigest,
  pickupDigest,
  terrainRevision,
  treeRevision,
  grassRevision,
  shardRevision
}
```

## Commit protocol

```txt
1. Observe focus and pending controller results.
2. Build one StreamDeltaCommand against the predecessor revision.
3. Reject stale Worker/controller generations.
4. Prepare membership and every materialization participant off to the side.
5. Compute deterministic patch, collider and pickup digests.
6. Prepare the physics collider candidate.
7. Admit the immutable candidate snapshot to the simulation tick.
8. Resolve proposals and observations against that snapshot.
9. Atomically publish participant state and the product outcome.
10. Render and acknowledge the same revision.
```

## Rollback protocol

```txt
participant prepare fails
  -> discard candidate resources
  -> preserve predecessor membership/content/physics
  -> return typed failure

participant commit becomes indeterminate
  -> block new outcome/render admission
  -> reconcile each participant against the journal
  -> restore predecessor or complete candidate deterministically

stale asynchronous result arrives
  -> reject without mutating current membership or resources
```

## Journal row

```txt
ContentParityJournalRow {
  commandId,
  predecessorRevision,
  candidateRevision,
  participantResults,
  outcomeResult,
  commitResult,
  rollbackResult,
  visibleFrameAck
}
```

No participant may publish a new revision independently after admission has started.
