# Content Materialization Audit: Coalescing, Budget and Commit Contract

**Timestamp:** `2026-07-12T07-09-49-04-00`

## Summary

The active-content consumer is a monolithic host adapter with mutation-first semantics. It must become a revisioned transaction that coalesces membership changes, admits bounded work, prepares all required consumers and commits or rolls back as one aggregate.

## Plan ledger

**Goal:** specify the contract needed to replace repeated full-set rebuilds with bounded patch deltas while retaining a safe explicit full-rebuild fallback.

- [x] Identify current full rebuild triggers.
- [x] Quantify source-level work bounds.
- [x] Define coalescing and budget policies.
- [x] Define atomic commit, rollback and proof requirements.
- [ ] Implement the authority and fixtures.

## Current work amplification

```txt
active patches: at most 25
per patch generation maxima:
  trees: 7
  grass: 70
  shards: 2

release commit:
  all tree batches flushed
  all grass descriptors revisited
  all uncollected shards revisited
  all colliders reconstructed and replaced

activation commit:
  same complete work repeated
```

## Coalescing policy

```txt
collect all releases for the step
collect admitted activations for the step
cancel release+activation of the same content identity when valid
sort changes by deterministic patch identity
produce one predecessor and successor patch-set digest
emit one aggregate materialization command
```

## Work-budget policy

Budgets must be declared in both elapsed time and deterministic work units:

```txt
terrain attribute writes
tree instance additions/removals
grass matrix writes
shard matrix writes
collider additions/removals
bounds recomputations
GPU upload ranges
physics collider operations
```

The authority may:

```txt
commit all required work
commit an explicitly supported bounded subset only when gameplay readiness remains valid
defer activation before mutation
use a full-rebuild fallback only when admitted and observed
reject and preserve the predecessor revision
```

## Atomicity policy

```txt
prepare consumer state detached from public readback
validate capacities and required resources
validate runtime/run/stream/content revisions
commit terrain, tree, grass, shard and collider revisions together
publish new active-content revision after every consumer succeeds
roll back prepared changes on failure
retire predecessor resources exactly once
```

## Parity policy

The following must cite one patch-set digest:

```txt
controller acknowledged-active set
terrain slot set
tree batch cell set
grass source patch set
shard and pickup source patch set
Rapier fixed-collider source patch set
fallback collider source patch set
height sampler active patch set
visible frame
public observation
```

## Observation contract

```txt
content revision
predecessor revision
released and activated IDs
deferred IDs
consumer timings and work units
capacity and overflow results
full rebuild fallback use
rollback result
patch-set parity digest
first visible frame ID
```

## Required fixtures

```txt
single activation delta
single release delta
release plus activation coalescing
multiple release coalescing
no-op delta
capacity deferral
full-rebuild fallback admission
consumer prepare failure
consumer commit failure and rollback
stale runtime/run/stream rejection
controller/physics/render parity
first visible frame acknowledgement
long traversal work-budget stability
```

Documentation only. No materialization behavior changed.