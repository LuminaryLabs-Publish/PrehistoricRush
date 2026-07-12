# Interaction Audit: Patch Delta to Materialization Result Map

**Timestamp:** `2026-07-12T07-09-49-04-00`

## Summary

Controller release and ready-delivery observations currently trigger direct consumer mutation. There is no command envelope, aggregate patch delta or typed result connecting the controller state to terrain, trees, grass, shards, colliders and the visible frame.

## Plan ledger

**Goal:** define the interaction boundary from controller observations through one materialization command and one aggregate result.

- [x] Trace release and activation ingress.
- [x] Map every consumer mutation.
- [x] Define command and result evidence.
- [ ] Implement and execute interaction fixtures.

## Current map

```txt
controller.takeReleasedPatchIds()
  -> raw patch IDs
  -> releasePatches(ids, state)
  -> direct mutation
  -> no result

controller.takeReadyPatches({ maximum: 1 })
  -> patch delivery objects
  -> activatePatch(entry, state)
  -> direct mutation
  -> no result
```

## Required command

```txt
MaterializationCommand {
  commandId
  runtimeGeneration
  runId
  streamEpoch
  controllerId
  predecessorContentRevision
  releasedPatchIds
  activationCandidates
  observedAt
  workBudget
}
```

## Required consumer results

```txt
TerrainMaterializationResult
TreeMaterializationResult
GrassMaterializationResult
ShardMaterializationResult
ColliderMaterializationResult
```

Each result must include:

```txt
status
reason
preparedRevision
committedRevision
addedPatchIds
removedPatchIds
workConsumed
capacityResult
rollbackResult
```

## Required aggregate result

```txt
MaterializationResult {
  status
  reason
  commandId
  predecessorContentRevision
  committedContentRevision
  consumerResults
  patchSetDigest
  deferredPatchIds
  visibleFrameId
}
```

## Admission rules

```txt
reject stale runtime generation
reject stale run or stream epoch
reject predecessor revision mismatch
idempotently replay duplicate command IDs
coalesce release and activation before mutation
defer work that exceeds declared budget
preserve predecessor on required-consumer failure
acknowledge controller claims only after commit
```

Documentation only. No interaction behavior changed.