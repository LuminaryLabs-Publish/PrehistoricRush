# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T03-51-15-04-00`

## Summary

Implement a canonical active-shard index and exactly-once collection transaction after patch activation authority, then correlate each accepted result with shard removal, HUD projection and the first visible frame.

## Plan ledger

**Goal:** prevent unknown, stale, out-of-phase or out-of-range shard IDs from mutating score and make every accepted award observable across gameplay and presentation.

- [ ] Define a versioned shard descriptor and canonical identity.
- [ ] Include world seed, generator version, settings fingerprint, patch identity and local index.
- [ ] Build an immutable active-shard index from committed patch activation/release results.
- [ ] Publish a monotonic active-shard-set revision.
- [ ] Define `ShardCollectionCommand` with command, run, state and patch revisions.
- [ ] Validate active gameplay phase inside the collection authority.
- [ ] Resolve the shard from the authoritative active index.
- [ ] Capture player and shard transforms once.
- [ ] Define explicit horizontal and vertical collection policy.
- [ ] Add command and identity idempotency receipts.
- [ ] Commit collected ledger, count, state revision and event atomically.
- [ ] Replace the boolean API with a typed result and compatibility adapter.
- [ ] Project committed results into shard instances and HUD.
- [ ] Acknowledge the first frame containing shard absence and the new count.
- [ ] Add detached collection observations and a bounded journal.
- [ ] Quarantine raw public-host access behind the existing host gateway plan.
- [ ] Execute deterministic, browser and Pages fixtures.

## Required command

```txt
ShardCollectionCommand {
  commandId
  runtimeGeneration
  runId
  expectedRunRevision
  activeShardSetRevision
  shardIdentity
  sourceFrameId
}
```

## Required result

```txt
ShardCollectionResult {
  status
  reason
  commandId
  collectionId
  runtimeGeneration
  runId
  shardIdentity
  patchId
  descriptorFingerprint
  beforeRevision
  afterRevision
  beforeCount
  afterCount
  spatialEvidence
  idempotentReplay
}
```

## Ordered queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Render Surface Resolution and Frame Correlation
1. Route/Profile Artifact Proof
2. Creator Draft/Commit/Preview Authority
3. Patch Activation and Release Commit Authority
3a. Shard Identity, Collection Commit and Visible Removal Authority
4. Collider Replacement and Admission
5. Run-Step Outcome and Terminal Frame
6. Stream Cadence and Time Budget
7. World Readiness
8. Committed Frame and Read Model
8a. Public Host Gateway
9. Coordinated Reset Epochs
10. Lifecycle and Disposal
```

## Required fixtures

```txt
identity canonicalization and source fingerprint
Worker/fallback shard identity parity
unknown and malformed ID rejection
wrong run and wrong phase rejection
inactive and stale patch rejection
stale active-shard-set rejection
horizontal and vertical distance policy
duplicate command receipt
duplicate identity exactly-once award
stable candidate ordering and per-step budget
state/event/result parity
visible shard removal and HUD parity
run reset and stale generation rejection
public-host bypass rejection
browser and Pages collection smoke
```

Do not create a second pickup scan or visual owner. Adapt the existing patch generator, controller, active-content adapter, product domain, renderer, HUD and host.