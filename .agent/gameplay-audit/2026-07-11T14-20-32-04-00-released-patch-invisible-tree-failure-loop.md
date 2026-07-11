# Gameplay Audit: Released Patch Invisible Tree Failure Loop

**Timestamp:** `2026-07-11T14-20-32-04-00`

## Summary

The current gameplay loop can fail a run on a tree that belongs to a released patch and is no longer rendered.

## Plan ledger

**Goal:** make collision-triggered failure depend on current acknowledged hazard membership.

- [x] Reconstruct the failure sequence.
- [x] Identify gameplay admission gap.
- [x] Define expected result.
- [ ] Add deterministic fixture.

## Failure sequence

```txt
run enters Patch A
  -> tree-A rendered
  -> tree-A fixed collider created

run leaves Patch A
  -> patch controller emits release
  -> tree-A render instances disappear
  -> tree-A descriptor leaves view.colliders
  -> live Rapier tree-A remains

later actor overlaps retained tree-A coordinates
  -> Rapier emits actorId dino / colliderId tree-A
  -> host accepts contact
  -> game.fail(tree-impact)
  -> status becomes run-over
```

## Why the fallback does not protect the run

The fallback checks only `view.colliders`, which contains current active patches. It can return false while the stale Rapier path returns true. The host ORs the two sources, so a stale Rapier contact wins.

## Missing gameplay result

```txt
collisionCommandId
runSessionId
streamEpoch
colliderMembershipRevision
actorId
colliderId
patchId
hazardTags
contactPhase
contactSource
admissionStatus
rejectionReason
runFailureResultId
```

## Expected behavior

```txt
released collider contact:
  rejected as stale membership

current non-hazard contact:
  rejected as non-fatal

current hazard contact-enter:
  accepted once

contact-stay after failure:
  no-op with prior result identity
```
