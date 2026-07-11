# Render Audit: Visual and Collider Membership Parity Gap

**Timestamp:** `2026-07-11T14-20-32-04-00`

## Summary

A released patch can disappear from terrain and tree rendering while its Rapier collider remains live. The scene can therefore present a clear path while physics still contains an invisible fatal tree.

## Plan ledger

**Goal:** require one membership revision across visible trees, collider descriptors, live Rapier colliders and terminal-frame evidence.

- [x] Trace tree render release.
- [x] Trace active collider descriptor rebuild.
- [x] Trace Rapier runtime retention.
- [x] Define parity observation.
- [ ] Implement and fixture.

## Current render sequence

```txt
release patch ID
  -> activePatches.delete
  -> terrain mesh hidden
  -> tree batch cells released
  -> tree instance buffers flushed
  -> active collider descriptor list rebuilt
  -> renderer shows no released tree
```

## Physics divergence

```txt
setFixedColliders(smaller list)
  -> serialized state shows smaller list
  -> live Rapier maps retain removed collider
  -> physics can still intersect the removed tree
```

## Missing frame evidence

```txt
patchMembershipRevision
colliderMembershipRevision
active visible tree IDs
active descriptor collider IDs
active Rapier collider IDs
retired collider IDs
contact source and collider ID
runFailureResultId
terminal frame ID
```

## Required parity snapshot

```json
{
  "patchMembershipRevision": 42,
  "colliderMembershipRevision": 42,
  "visibleTreeIds": ["tree-2-3-0"],
  "descriptorColliderIds": ["tree-2-3-0"],
  "rapierColliderIds": ["tree-2-3-0"],
  "retiredColliderIds": ["tree-1-3-4"],
  "parity": true
}
```

## Release blocker

A frame must not be accepted as collision-correct when visible/descriptor/Rapier memberships differ, or when a terminal failure references a collider absent from the committed frame membership.
