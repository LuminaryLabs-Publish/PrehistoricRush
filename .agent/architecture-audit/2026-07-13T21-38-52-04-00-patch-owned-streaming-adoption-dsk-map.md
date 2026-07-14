# Patch-Owned Streaming Adoption DSK Map

**Timestamp:** `2026-07-13T21-38-52-04-00`  
**Runtime revision:** `ab3c63fed62b70e776ee56c4295f359bc3660274`

## Summary

The refactor establishes correct patch ownership for render and collision content. The missing parent boundary is a transaction that coordinates patch-controller membership with every product and renderer consumer.

## Plan ledger

**Goal:** define the minimum coordinating domain required to make patch activation and release atomic, revisioned, rollback-safe and visibly provable.

- [x] Map current producer, controller and consumer ownership.
- [x] Separate reusable Nexus Engine kit services from product adapter responsibilities.
- [x] Identify the exact cross-domain transaction gap.
- [x] Define commands, results, revisions, receipts and proof gates.
- [ ] Implement the authority without moving renderer or physics objects into the engine core.

## Current DSK composition

```txt
seed-kit
  -> deterministic patch inputs

prehistoric-patch-generator
  -> terrain, trees, grass, pickups and colliders

seeded-world-patch-controller-kit
  -> focus
  -> desired active and prefetch membership
  -> generation queue and Worker execution
  -> cache
  -> ready and release queues
  -> controller snapshots

instanced-render-batch-kit
  -> batch registry
  -> cell membership
  -> stable per-cell ranges
  -> replace/release
  -> changed-range flush
  -> overflow and bounds diagnostics

three-patch-stream-adapter-kit
  -> terrain slots
  -> per-patch tree, grass and shard cells
  -> collider and pickup ownership
  -> Three.js matrix uploads
  -> Core Physics collider publication
  -> height sampling, camera and rendering
```

## Current ownership boundary

```txt
controller owns:
  desired membership
  generated patch cache
  ready/release queues
  active ID set

instanced-batch DSK owns:
  renderer-neutral cell descriptors
  stable slot allocations
  revisions and changed ranges

product adapter owns:
  Three.js resources
  terrain slot assignment
  patch-to-cell orchestration
  GPU uploads
  collider aggregate projection
  pickup projection
  render submission
```

These are appropriate boundaries. The defect is the absence of a coordinating command/result layer across them.

## Required parent domain

```txt
prehistoric-rush-patch-owned-streaming-adoption-authority-domain
```

## Required services

```txt
patch-adoption-command
patch-adoption-generation
controller-membership-revision
patch-content-key
consumer-preparation
capacity-and-overflow-policy
terrain-slot-admission
instance-cell-admission
physics-cell-admission
pickup-view-admission
patch-adoption-result
patch-release-command
patch-release-result
rollback-and-predecessor-restoration
stale-worker-result-rejection
visible-patch-frame-acknowledgement
patch-adoption-journal
```

## Proposed atomic kits

```txt
patch-adoption-command-kit
patch-adoption-generation-kit
patch-membership-revision-kit
patch-consumer-preparation-kit
patch-capacity-policy-kit
patch-terrain-slot-result-kit
patch-instance-cell-result-kit
patch-physics-cell-result-kit
patch-pickup-view-result-kit
patch-activation-result-kit
patch-release-result-kit
patch-rollback-kit
patch-visible-frame-ack-kit
patch-adoption-journal-kit
patch-adoption-fixture-kit
```

## Command contract

```txt
PatchActivationCommand {
  commandId
  runtimeSessionId
  controllerId
  controllerRevision
  adapterGeneration
  patchId
  patchKey
  expectedMembership
  expectedConsumerRevisions
}

PatchActivationResult {
  status: Accepted | Duplicate | Stale | CapacityRejected | Failed | RolledBack | Cancelled | Retired
  activationId
  controllerRevision
  terrainRevision
  treeRevisions
  grassRevisions
  shardRevision
  colliderRevision
  pickupRevision
  overflow
  rollbackReceipt
}
```

## Required transaction

```txt
receive ready candidate without committing active membership
  -> validate desired membership and patch key
  -> reserve terrain slot and stable instance ranges
  -> prepare renderer-neutral instance, collider and pickup candidates
  -> validate capacity and overflow policy
  -> prepare GPU and physics projections
  -> commit controller membership and all mandatory consumers
  -> publish one terminal PatchActivationResult
  -> acknowledge the first visible frame citing the result
  -> otherwise restore predecessor resources and membership
```

## Release transaction

```txt
receive release intent without clearing durable intent
  -> bind accepted activation and current consumer revisions
  -> prepare terrain, cell, collider and pickup retirement
  -> commit controller and consumer retirement together
  -> publish PatchReleaseResult
  -> reject late Worker or render work from retired generations
```

## Non-goals

```txt
do not move Three.js meshes into Nexus Engine
do not move Rapier objects into the patch controller
do not replace stable-range instanced-render-batch-kit
do not merge gameplay simulation with render streaming
do not make every patch operation globally blocking
```

## Completion gate

Do not mark patch-owned streaming complete until controller membership, all mandatory consumers and the first matching visible frame cite one accepted activation or release result, and injected consumer failures restore the predecessor state without orphaned terrain, instances, colliders or pickups.
