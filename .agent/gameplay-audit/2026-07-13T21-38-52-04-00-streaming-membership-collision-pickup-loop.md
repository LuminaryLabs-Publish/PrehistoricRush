# Streaming Membership, Collision and Pickup Loop

**Timestamp:** `2026-07-13T21-38-52-04-00`

## Summary

Patch ownership now prevents pickup collection from rebuilding unrelated grass, trees or colliders. The unresolved gameplay risk is that controller membership, collision membership and pickup visibility can diverge after a partial activation or release.

## Plan ledger

**Goal:** preserve incremental gameplay updates while making patch membership, collision and pickup state settle under one activation or release result.

- [x] Trace activation, release, collision fallback and pickup collection.
- [x] Confirm pickup refresh is patch-targeted.
- [x] Confirm collider synchronization occurs only on patch membership changes.
- [x] Record divergence and rollback gaps.
- [ ] Add fault-injection and gameplay continuity fixtures later.

## Current loop

```txt
frame
  -> engine.tick resolves movement, collision and pickups
  -> accepted pickup IDs identify collected shards
  -> adapter maps IDs to owning patches
  -> only affected shard cells are replaced
  -> streamed focus changes release and activate patches
  -> collider aggregate republishes only when membership changes
```

## Improvements

```txt
pickup collection no longer rebuilds all active content
collider synchronization is not triggered by pickup-only changes
grass and shard ownership is explicit by patch ID
active pickup view is derived from patch ownership and collected IDs
```

## Remaining gameplay gaps

```txt
controller can report patch active before colliders and pickups are published
release intent is cleared before adapter release has a terminal result
partial collider publication has no rollback
active collision sampler reads a flat aggregate without a patch revision
pickup sampler reads adapter view without an activation revision
terrain height sampler can observe activePatches before every consumer commits
no policy defines whether partial activation blocks gameplay admission
no stale Worker result classification after release or restart
```

## Required policy

```txt
Accepted activation:
  terrain, collision, pickups and mandatory visible content are committed

Degraded activation:
  only explicitly optional visual content may overflow
  collision, terrain and pickup invariants remain complete

Rejected activation:
  controller does not expose the patch as active
  predecessor gameplay membership remains authoritative
```

## Completion gate

Movement, terrain height, collision and pickup queries must cite one accepted patch-membership revision. An injected failure in any mandatory consumer must not leave a playable patch with missing collision, stale pickups or unmatched terrain.
