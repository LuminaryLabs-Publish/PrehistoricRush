# Gameplay Audit: Shard Detection, Collection and Refresh Loop

**Timestamp:** `2026-07-12T03-51-15-04-00`

## Summary

Shard collection is a browser-loop side effect rather than an admitted gameplay command. It reads a mutable view derived from streamed patches, applies an XZ-only overlap test, mutates run state and then rebuilds presentation and collider consumers.

## Plan ledger

**Goal:** document the exact gameplay path and define the evidence required for deterministic, phase-safe and exactly-once shard awards.

- [x] Trace generation through collection and refresh.
- [x] Identify same-frame ordering and mutation boundaries.
- [x] Record run, patch, spatial and idempotency gaps.
- [ ] Route the loop through the shard authority.

## Current gameplay loop

```txt
engine.tick(dt)
  -> movement and possible win transition
  -> state snapshot

updateStreaming(state)
  -> update patch focus
  -> release patches
  -> pump generation
  -> activate ready patches
  -> rebuild active shard projection as membership changes

if status === game
  -> set physics actor
  -> step physics and test fallback hazards
  -> fail run on collision
  -> iterate view.pickups
  -> test hypot(pickup.x - state.x, pickup.z - state.z)
  -> collectShard(pickup.id)
  -> refreshDynamicContent(latest state)
  -> break after first award

render latest state and HUD
```

## Gameplay defects

### Run phase is enforced only by the caller

The browser loop checks `status === "game"`, but `collectShard()` itself does not. The service accepts first-time IDs during menu, run-over or win state when reached through another caller.

### Descriptor validity is not enforced

The API does not resolve the ID against active patch content. Unknown, stale or malformed IDs can increment the count once.

### Same-frame membership is unstable

Patch release and activation occur before detection. The collection loop does not capture a stable active-shard set revision, so evidence is not reproducible from the event or snapshot.

### Collection volume is implicit and two-dimensional

The threshold is `pickup.radius + 0.4` in XZ. Jump height, terrain height, shard Y and vertical tolerance are ignored.

### One pickup per frame is an undocumented policy

The loop breaks after the first accepted pickup. Ordering depends on sorted active patch IDs and descriptor order, but no collection-budget policy or deterministic tie result is published.

### Collection mutates before projection

The run ledger and event commit before shard instances and HUD are refreshed. No typed consumer result reports partial presentation.

## Required gameplay command

```txt
ShardCollectionCommand {
  commandId
  runtimeGeneration
  runId
  expectedRunRevision
  activeShardSetRevision
  shardIdentity
  playerTransform
  sourceFrameId
}
```

## Required gameplay result

```txt
ShardCollectionResult {
  status
  reason
  commandId
  collectionId
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

## Deterministic policy requirements

```txt
explicit maximum collections per simulation step
stable candidate ordering and tie-break
3D collection volume
active descriptor and patch revision proof
phase and run admission inside the authority
exactly-once identity ledger
no mutation after terminal outcome
collection evaluated in the same run-step arbitration as collision and win
```