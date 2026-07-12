# Profile Convergence Audit: Revision, Conflict, Debounce and Navigation Contract

**Timestamp:** `2026-07-12T18-18-59-04-00`

## Summary

The current `revision` is assigned through read-increment-write and is not a concurrency control. Cross-tab delivery is neither monotonic nor duplicate-safe, and the creator debounce timer is not represented as an owned lease that can be rebased, flushed or cancelled under external updates and navigation.

## Plan ledger

**Goal:** define a complete profile convergence contract for concurrent writers, delayed local edits, resets, browser delivery and route changes.

- [x] Classify current revision semantics.
- [x] Classify same-predecessor and delayed-delivery races.
- [x] Define conflict and merge policies.
- [x] Define save-lease lifecycle.
- [x] Define navigation and reset barriers.
- [x] Define observations and fixtures.
- [ ] Implement only after result schemas are frozen.

## Current revision semantics

```txt
revision source: previous localStorage snapshot
allocation: max(previous + 1, input revision)
atomic predecessor verification: absent
writer identity: absent
commit identity: absent
content fingerprint: absent
readback verification: absent
same-revision conflict detection: absent
```

A larger revision proves only that one writer observed some prior number. It does not prove a unique global successor or preserved field set.

## Required conflict classes

```txt
NoConflict
DuplicateCommand
DuplicateDelivery
StalePredecessor
SameRevisionSameFingerprint
SameRevisionDifferentFingerprint
DisjointFieldMergeAvailable
OverlappingFieldConflict
ResetBarrierConflict
UnsupportedSchemaConflict
StorageIndeterminate
```

## Required field-path merge policy

The system must compare changed field paths against the predecessor rather than merge whole nested groups from a stale draft.

```txt
input patch: proportions.bodyScale
remote change: material.skin
result: deterministic disjoint merge may be admitted

input patch: proportions.bodyScale
remote change: proportions.bodyScale
result: overlapping conflict; reject or explicit winner policy

input patch: proportions object captured from stale draft
remote change: proportions.tailLength
result: do not silently replace the complete group
```

## Save lease lifecycle

```txt
Idle
  -> DraftDirty
  -> SaveScheduled
  -> Preparing
  -> Writing
  -> Verifying
  -> Committed

external commit during SaveScheduled/Preparing
  -> RebaseRequired | Conflict

navigation during unresolved lease
  -> FlushRequested
  -> Committed and Navigate
  -> Rejected and Remain
  -> ExplicitUsePredecessor and Navigate

reset
  -> cancel predecessor lease
  -> acquire reset barrier
  -> commit default successor
```

## Terminal save-lease results

```txt
Committed
CommittedMerged
CancelledSuperseded
RejectedConflict
RejectedStale
RejectedNavigation
FailedWrite
FailedReadback
VolatileOnly
```

## Delivery contract

Each logical commit is distributed once conceptually even when several browser mechanisms deliver it.

```txt
key: commitId + fingerprint
accept: revision greater than current and compatible predecessor
ignore: same commit/fingerprint duplicate
reject: lower revision
fault: same revision with different fingerprint
```

BroadcastChannel and storage events are adapters to this contract, not separate authorities.

## Reset contract

`resetPlayerCharacterProfile()` currently saves defaults as a normal update. The replacement must define whether reset is:

```txt
exclusive barrier that rejects predecessor drafts
mergeable edit that changes all resettable fields
new profile epoch that invalidates older events
```

The recommended policy is an exclusive profile-epoch barrier so delayed predecessor timers cannot recreate old customization after reset.

## Navigation contract

```txt
NavigateWithProfileCommand
  destination
  requiredDraftRevision
  requiredCommitId
  timeout/failure policy
```

The UI may display `Saving`, `Saved`, `Conflict`, `Volatile`, or `Failed`; it must not infer durable success from a scheduled timeout.

## Observation schema

```txt
profileId
writerSessionId
commandId
saveLeaseId
commitId
predecessorRevision/fingerprint
successorRevision/fingerprint
changedPaths
conflictPaths
storageResult
channelDeliveryResults
navigationResult
runtimeBindingId
firstVisibleFrameId
```

## Fixture matrix

```txt
same-predecessor two-writer conflict
same-predecessor disjoint merge
same-revision different-fingerprint detection
duplicate BroadcastChannel plus storage delivery
out-of-order cross-writer delivery
remote commit during local debounce
reset during local debounce
navigation before timer fires
write succeeds but readback differs
storage throws
runtime boot from flushed commit
first frame cites runtime binding
```

No existing behavior proves these contracts.