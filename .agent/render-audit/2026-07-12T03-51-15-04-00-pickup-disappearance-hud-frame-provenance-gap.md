# Render Audit: Pickup Disappearance and HUD Frame Provenance Gap

**Timestamp:** `2026-07-12T03-51-15-04-00`

## Summary

A successful shard mutation is followed by an imperative active-content rebuild, then the frame renders and the HUD reads the latest state. No result identity proves that the shard instance removal and HUD count belong to the same committed collection.

## Plan ledger

**Goal:** correlate one accepted shard collection with the exact shard-instance projection, HUD count and first visible frame that present it.

- [x] Trace shard instance construction and refresh.
- [x] Trace render and HUD ordering.
- [x] Record missing projection and frame evidence.
- [ ] Add typed projection results and visible-frame proof.

## Current ordering

```txt
XZ overlap detected
  -> collectShard(id)
  -> collected IDs and shard count mutate
  -> ShardCollected event emits
  -> refreshDynamicContent(latest state)
  -> rebuild all active grass, shards and colliders
  -> renderer.render(scene, camera)
  -> HUD reads latest state
```

## Gaps

```txt
no CollectionResult ID
no shard-set revision
no shard-instance projection result
no HUD projection result
no consumer acknowledgement set
no renderer frame ID tied to collection
no proof the accepted shard is absent from the rendered instance buffer
no proof HUD count and world removal use the same state revision
no recovery journal if rebuild or render fails after gameplay commit
```

The rebuild also calls fixed-collider replacement, so a shard collection causes unrelated consumer work without a transaction or per-consumer result.

## Required frame plan

```txt
CommittedShardCollectionResult
  -> immutable ShardPresentationPlan
  -> shard instance projection result
  -> HUD projection result
  -> world render submission result
  -> required-consumer acknowledgement barrier
  -> first visible ShardCollectionFrameReceipt
```

## Required receipt

```txt
ShardCollectionFrameReceipt {
  runtimeGeneration
  runId
  collectionId
  shardIdentity
  collectionStateRevision
  activeShardSetRevision
  shardProjectionRevision
  hudProjectionRevision
  renderFrameId
  shardAbsent
  displayedShardCount
  consumerAcknowledgements
}
```

## Proof gate

```txt
accepted collection removes exactly one visible shard
HUD increments exactly once
both projections cite the same collection/state revision
late or stale projection cannot acknowledge a newer collection
render failure leaves a recoverable unpresented-result observation
next successful frame can acknowledge the already committed result
```