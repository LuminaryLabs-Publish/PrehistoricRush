# Streaming Authority Audit: Content Revision, Observation and Commit Contract

**Timestamp:** `2026-07-12T11-11-34-04-00`

## Plan ledger

**Goal:** distinguish generated patch delivery from authoritative active content and make content adoption one revisioned transaction.

- [x] Define the authoritative snapshot.
- [x] Define admission and commit rules.
- [x] Define bounded observation requirements.
- [ ] Implement the contract.

## Core rule

A generated or ready patch is not active game content. It becomes authoritative only after the terrain, tree, grass, shard, pickup and collider participants prepare successfully and one content revision commits.

## Active content snapshot

```txt
ActiveContentSnapshot {
  contentRevision,
  predecessorRevision,
  runEpoch,
  streamGeneration,
  commandId,
  activePatchIds,
  activePatchSetDigest,
  terrainSlotIds,
  treeCellIds,
  grassInstanceCounts,
  pickupIds,
  pickupSetDigest,
  colliderIds,
  colliderSetDigest,
  preparedAtTickId,
  committedAtTickId
}
```

The snapshot stores identities, counts and fingerprints. It should not duplicate complete terrain arrays, geometry buffers or instance matrices in diagnostics.

## Admission rules

```txt
release and activation deltas cite predecessor content revision
ready patch result cites stream generation and request identity
stale Worker results are rejected before preparation
all required participants prepare against the same candidate revision
physics collider plan and visible collider plan share one digest
pickup observation reads the admitted pickup snapshot
physics and fallback collision read the admitted collider snapshot
mixed revisions reject the simulation step
```

## Commit rules

```txt
prepare candidate content without publishing it
  -> collect typed terrain/tree/grass/shard/pickup/collider results
  -> reject overflow, missing slot, stale generation or provider failure
  -> commit all participants and increment content revision
  -> otherwise preserve predecessor content and physics state
  -> retire predecessor resources exactly once after successful commit
```

## Observation and journal

A bounded observation should record:

```txt
command ID
predecessor and committed content revisions
run epoch and stream generation
added and removed patch IDs
patch, pickup and collider digests
participant status and rejection reason
simulation step and visible frame receipts
```

The journal must be bounded by count and age and must not retain transferable terrain buffers, full collider descriptor arrays or full instance matrices.
