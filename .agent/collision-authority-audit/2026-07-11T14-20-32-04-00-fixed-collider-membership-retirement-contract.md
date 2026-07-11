# Collision Authority Audit: Fixed Collider Membership and Retirement Contract

**Timestamp:** `2026-07-11T14-20-32-04-00`

## Summary

The pinned Rapier adapter needs an authoritative replacement contract. Updating serialized collider state without removing live Rapier resources is not a valid replacement.

## Plan ledger

**Goal:** define exact membership, removal semantics, results and invariants for fixed colliders.

- [x] Document current add/update behavior.
- [x] Document missing removal behavior.
- [x] Define replacement input and result.
- [x] Define invariants.
- [x] Define integration with patch release.
- [ ] Implement in the ProtoKit and consume from PrehistoricRush.

## Proposed service

```js
replaceFixedColliders({
  membershipRevision,
  colliders,
  reason,
  sessionId,
  runSessionId,
  streamEpoch
})
```

## Required result

```json
{
  "accepted": true,
  "membershipRevision": 42,
  "addedIds": ["tree-2-3-0"],
  "updatedIds": [],
  "retainedIds": ["tree-2-2-1"],
  "removedIds": ["tree-1-3-4"],
  "failedIds": [],
  "liveColliderCount": 2,
  "liveBodyCount": 2
}
```

## Required removal order

```txt
locate fixed collider instance
remove collider from Rapier world
delete runtime.fixedColliders entry
locate fixed body
remove body from Rapier world
delete runtime.fixedBodies entry
remove serialized state entry
record removal result
```

## Invariants

```txt
state collider IDs == runtime fixedCollider IDs
runtime fixedCollider IDs == runtime fixedBody IDs
runtime IDs == committed submitted IDs
every contact collider ID exists in current state
every contact carries current membership revision
removed ID cannot appear in later contact collection
replacement is deterministic and idempotent
repeated identical replacement has zero adds/removes
```

## Patch release integration

```txt
patch release proposal
  -> next collider membership
  -> replaceFixedColliders
  -> verify removed patch collider IDs acknowledged
  -> retire render and other consumer state
  -> commit patchReleaseResult
```

The exact prepare/commit order may stage render and physics together, but release cannot be considered complete before both acknowledge the same membership revision.

## Compatibility

Keep `setFixedColliders()` only as a compatibility wrapper if it delegates to exact replacement. Do not preserve the current append-only runtime semantics behind the same name.
