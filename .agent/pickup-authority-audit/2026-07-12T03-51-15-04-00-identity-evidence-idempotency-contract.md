# Pickup Authority Audit: Identity, Evidence and Idempotency Contract

**Timestamp:** `2026-07-12T03-51-15-04-00`

## Summary

A shard must be identified by more than local patch coordinates, admitted against a committed active-patch revision, collected from authoritative 3D evidence and awarded exactly once per run. The current ID-only boolean API cannot prove any of those conditions.

## Plan ledger

**Goal:** define the canonical shard identity and collection contract consumed by gameplay, events, presentation, diagnostics and replay.

- [x] Define identity and source requirements.
- [x] Define evidence and idempotency requirements.
- [x] Define state, event and projection invariants.
- [ ] Implement the contract and fixtures.

## Canonical identity

```txt
ShardIdentity {
  worldSeed
  generatorVersion
  generatorSettingsFingerprint
  patchId
  patchCacheKey
  localIndex
  descriptorFingerprint
}
```

A stable serialized identity may be hashed, but every component must remain recoverable or verifiable from admitted metadata.

## Active shard index

```txt
ActiveShardIndex {
  runtimeGeneration
  runId
  patchActivationRevision
  activeShardSetRevision
  entries: Map<canonicalIdentity, DeepFrozenShardDescriptor>
}
```

Index changes are produced only by committed patch activation/release results. Presentation may mirror the index but cannot become its authority.

## Spatial evidence

```txt
ShardCollectionEvidence {
  simulationStepId
  sourceFrameId
  playerPosition
  playerCollisionVolume
  shardPosition
  shardCollectionVolume
  horizontalDistance
  verticalDistance
  acceptedPolicyVersion
}
```

The policy must explicitly define whether airborne collection is allowed and the maximum vertical separation.

## Idempotency

```txt
command idempotency:
  same command ID -> same prior result

identity idempotency:
  same shard identity in same run -> at most one award

run reset:
  new run ID -> new collection ledger

stale generation:
  old runtime/run/patch revisions -> rejected without mutation
```

## Atomic gameplay commit

The following values advance together:

```txt
collected shard identity ledger
shard count
run-state revision
ShardCollected event envelope
collection-result journal row
```

A presentation failure does not roll back gameplay state. It produces an unacknowledged presentation result that must be retried and surfaced diagnostically.

## Event envelope

```txt
ShardCollectedEvent {
  collectionId
  commandId
  runtimeGeneration
  runId
  stateRevision
  shardIdentity
  patchId
  activeShardSetRevision
  beforeCount
  afterCount
  spatialEvidenceFingerprint
}
```

## Required invariants

```txt
unknown identity never awards
wrong phase never awards
out-of-range evidence never awards
duplicate command never mutates twice
duplicate identity never awards twice
accepted result always matches state/event journal
presentation consumes immutable committed result
first visible frame proves shard absence and new HUD count
```