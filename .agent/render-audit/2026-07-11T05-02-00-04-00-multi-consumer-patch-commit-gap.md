# Render Audit: Multi-Consumer Patch Commit Gap

**Timestamp:** `2026-07-11T05-02-00-04-00`

## Summary

A patch becomes controller-active before terrain, tree batches, grass, shards, gameplay colliders, Rapier colliders and height sampling share one committed revision. The renderer can therefore present a partial patch while controller diagnostics report success.

## Current activation order

```txt
activePatches.set(patch.id, patch)
  -> acquire and mutate terrain slot
  -> write terrain heights, colors and normals
  -> recompute terrain bounds
  -> replace every tree trunk/crown cell
  -> flush every tree batch
  -> rebuild all active grass matrices
  -> rebuild all visible shard matrices
  -> replace gameplay collider array
  -> replace Rapier fixed colliders
  -> height sampler observes activePatches
```

## Divergence windows

```txt
activePatches ahead of terrain
terrain ahead of trees
trees ahead of grass and shards
render state ahead of Rapier colliders
height sampling ahead of physical readiness
controller active state ahead of every consumer
```

## Release risk

Release first removes the host patch and hides terrain, then releases tree cells, then flushes batches and rebuilds all dynamic content. A failure after terrain retirement can leave trees, grass, shards or colliders from a patch that is no longer host-active or controller-active.

## Capacity and truncation risks

```txt
terrain slots use first free slot or slot zero fallback
tree batches can report overflow after replacement
three grass layers truncate at fixed capacities
shards truncate at 240
truncated descriptor IDs are not returned
dynamic rebuild has no accepted/rejected result
```

## Required render contract

```txt
PatchRenderPlan
  patchId
  cacheKey
  activationId
  candidateRevision
  terrain slot decision
  tree batch decisions
  grass accepted and rejected IDs
  shard accepted and rejected IDs
  bounds decisions
  expected active patch digest

PatchRenderCommitResult
  status: committed | rejected | rolled-back | faulted
  patchId
  activationId
  renderRevision
  terrainRevision
  treeRevision
  grassRevision
  shardRevision
  rejected IDs
  firstRenderedFrameId
```

## Required rules

- Build all matrix arrays and capacity decisions before mutating live meshes.
- Do not expose a patch through `activePatches` until commit succeeds.
- Do not recompute or flush unrelated batches unless the plan requires it.
- Do not silently truncate without rejected descriptor IDs.
- Publish render revision only after all required GPU-facing state is updated.
- Correlate the first rendered frame with controller and physics acknowledgement.

## Fixture requirements

```txt
malformed terrain array rejects without mutation
tree overflow rejects or returns explicit partial policy
grass and shard overflow return deterministic rejected IDs
injected terrain write failure rolls back all consumers
injected tree flush failure rolls back or faults visibly
release failure retains retriable ownership evidence
controller-active and render-active digests match after every commit
```

No rendering source changed during this audit.