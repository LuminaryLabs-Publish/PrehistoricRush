# Architecture Audit: Active Content Materialization DSK Map

**Timestamp:** `2026-07-12T07-09-49-04-00`

## Summary

Patch-controller delivery and product-side materialization are separate authorities, but the product host currently mutates all terrain, tree, grass, shard and collider consumers directly. The missing parent domain must convert controller membership changes into one bounded aggregate transaction and one committed active-content revision.

## Plan ledger

**Goal:** define the DSK composition required to coalesce release and activation changes, budget materialization work, preserve cross-consumer parity and acknowledge the visible frame.

- [x] Trace current controller and consumer ownership.
- [x] Identify every materialized consumer.
- [x] Identify missing identities, commands, plans, results and rollback boundaries.
- [x] Define parent domain and candidate kits.
- [ ] Implement and validate the domain.

## Current ownership map

```txt
seeded-world-patch-controller-kit
  owns desired, queued, cached, ready, active and released controller state

src/game.js host adapter
  owns activePatches
  owns terrain slot mapping
  owns tree batch replace/release calls
  owns grass and shard instance rewrites
  owns pickup and collider arrays
  owns physics fixed-collider replacement
  owns render timing and public readback
```

## Missing parent domain

```txt
prehistoric-rush-active-content-materialization-authority-domain
```

## Candidate DSKs

```txt
active-content-set-revision-kit
patch-content-delta-kit
patch-release-delta-kit
patch-activation-delta-kit
materialization-command-kit
materialization-command-id-kit
materialization-coalescing-kit
materialization-work-budget-kit
terrain-slot-plan-kit
tree-batch-delta-plan-kit
grass-instance-delta-plan-kit
shard-instance-delta-plan-kit
collider-set-delta-plan-kit
materialization-prepare-kit
materialization-consumer-result-kit
materialization-commit-kit
materialization-rollback-kit
stale-materialization-plan-rejection-kit
active-content-parity-digest-kit
materialization-observation-kit
materialization-journal-kit
visible-content-frame-ack-kit
release-activation-coalescing-fixture-kit
bounded-materialization-work-fixture-kit
consumer-failure-rollback-fixture-kit
physics-render-content-parity-fixture-kit
browser-stream-materialization-smoke-kit
```

## Domain transaction

```txt
observe controller release and ready sets
  -> bind runtimeGeneration, runId and streamEpoch
  -> create one aggregate PatchContentDelta
  -> calculate next active-content revision
  -> derive per-consumer plans
  -> admit against elapsed-time and work-unit budgets
  -> prepare terrain/tree/grass/shard/collider changes
  -> reject stale plans
  -> commit all required consumers atomically
  -> retire predecessor resources exactly once
  -> return typed consumer and aggregate results
  -> render and acknowledge the committed revision
```

## Consumer plan requirements

### Terrain

```txt
patch ID to slot mapping
slot predecessor and successor
attribute upload plan
bounds update
slot retirement
```

### Trees

```txt
cell releases
cell replacements
batch capacity admission
overflow result
bounds revision
```

### Grass

```txt
patch-local descriptor additions/removals
layer capacities
stable slot or compaction policy
matrix upload range
bounds revision
```

### Shards and pickups

```txt
active descriptor index
collected-ID filter revision
instance additions/removals
pickup evidence set
matrix and bounds update
```

### Colliders

```txt
patch-local fixed-collider additions/removals
collider-set revision
Rapier prepare/commit result
fallback collision parity
```

## Required aggregate result

```txt
MaterializationResult {
  status
  reason
  commandId
  runtimeGeneration
  runId
  streamEpoch
  predecessorContentRevision
  committedContentRevision
  releasedPatchIds
  activatedPatchIds
  deferredPatchIds
  workBudget
  workConsumed
  consumerResults
  parityDigest
  rollbackResult
  visibleFrameId
}
```

## Invariants

```txt
one frame commits at most one aggregate active-content revision
release and activation changes are coalesced before consumer mutation
all required consumers cite the same committed patch-set digest
capacity or consumer failure cannot expose a partial new revision
old runtime/run/stream epochs cannot commit
work budgets are independent of display refresh rate
public diagnostics expose detached observations only
```

No runtime source changed.