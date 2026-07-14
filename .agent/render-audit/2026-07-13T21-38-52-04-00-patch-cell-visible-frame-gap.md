# Patch Cell Visible Frame Gap

**Timestamp:** `2026-07-13T21-38-52-04-00`

## Summary

Changed-range uploads reduce GPU work, but no frame receipt proves that terrain, trees, grass and shards from one patch activation became visible together.

## Plan ledger

**Goal:** correlate accepted patch ownership with the exact Three.js resources and first visible frame that present it.

- [x] Trace terrain slot, instance-cell and render submission paths.
- [x] Record existing range and bounds evidence.
- [x] Identify missing patch-to-frame provenance.
- [ ] Add renderer submission and visible-frame receipts later.

## Current render path

```txt
activatePatch
  -> update terrain geometry and bounds
  -> replace tree trunk/crown cells
  -> replace grass cells
  -> replace shard cell
  -> flush changed ranges
  -> set instanceMatrix update ranges
  -> update mesh counts and bounds

render
  -> update player pose
  -> update camera and wind
  -> renderer.render(scene, camera)
```

## Existing evidence

```txt
batch revision
changedRanges
instanceWrites
cellRanges
overflow diagnostics
boundsDirty
activeCount
slotCount
adapter ownership counts
```

## Missing evidence

```txt
PatchActivationId retained by renderer adapter
terrain-slot revision
per-mesh committed batch revision
renderer submission ID
frame number or presentation revision
visible patch fingerprint
first matching frame acknowledgement
partial render commit classification
last complete patch-frame recovery
```

## Failure modes

```txt
terrain updates but a later batch flush throws
trees commit while grass or shards remain predecessor state
GPU write succeeds but physics publication fails
controller reports active while renderer never submits the successor
capacity overflow silently degrades one consumer and only warns
release hides terrain before every instance range is cleared
```

## Required receipt

```txt
PatchVisibleFrameAck {
  activationId
  frameId
  patchId
  patchKey
  terrainRevision
  treeBatchRevisions
  grassBatchRevisions
  shardBatchRevision
  colliderRevision
  visibleFingerprint
  status: Complete | Degraded | Partial | Failed | Stale | Retired
}
```

## Completion gate

A patch is not visibly adopted until one submitted frame cites the accepted activation and all mandatory terrain and instance revisions. Degraded overflow must be explicit, not inferred from console output.
