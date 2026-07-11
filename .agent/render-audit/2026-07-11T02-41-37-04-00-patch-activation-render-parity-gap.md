# Render Audit: Patch Activation and Consumer Parity

**Timestamp:** `2026-07-11T02-41-37-04-00`

## Summary

Generation has moved away from the render path, but patch activation still performs synchronous live GPU-buffer and scene-state mutations. The render host has no detached preparation, activation revision, rollback or parity result tying terrain slots, tree batches, grass, shards and bounding volumes to the controller-active patch set.

## Plan ledger

**Goal:** Record the exact render-consumption path and define the proof needed before a generated patch can be treated as visibly committed.

- [x] Inspect terrain slot allocation and attribute uploads.
- [x] Inspect tree batch replacement/release and flush.
- [x] Inspect grass and shard rebuilds.
- [x] Inspect bounds updates.
- [x] Inspect render submission and host readback.
- [x] Identify synchronous activation work and partial-commit risks.
- [x] Define render parity evidence.

## Current render path

```txt
ready patch
  -> activePatches.set
  -> acquire one of 25 terrain slots
  -> copy 961 heights into position Y values
  -> copy color and normal typed arrays
  -> mark attributes dirty
  -> update mesh transform and visibility
  -> recompute terrain bounds
  -> replace tree trunk/crown cells
  -> flush every tree type batch
  -> upload active matrices and bounds
  -> rebuild all active grass layer matrices
  -> rebuild all visible shard matrices
  -> recompute grass/shard bounds
  -> render scene
```

## Render resources

```txt
25 reusable terrain geometries
1 shared terrain material
5 tree trunk InstancedMesh pools
5 tree crown InstancedMesh pools
3 grass InstancedMesh pools
1 shard InstancedMesh pool
1 procedural SkinnedMesh player
camera, lights, fog and WebGLRenderer
```

## Capacity facts

```txt
active patch target: 25
terrain slots: 25
tree candidates per patch: 7
maximum active tree descriptors: 175
tree capacity per type and part: 256
grass candidates per patch: 70
maximum active grass candidates: 1750
grass capacities: 3600 / 2600 / 1300
shards per patch: 2
maximum active shards: 50
shard capacity: 240
```

Tree capacity is now explicit and owned by the instance-batch kit. Grass and shard capacities are explicit local values. However, grass truncation uses layer-local `break` behavior and publishes no rejected descriptor IDs or overflow result.

## Main-thread work retained

Worker generation removes route search, terrain noise, classification, descriptor creation and normal generation from the host. Activation still performs:

```txt
terrain typed-array copies and per-vertex Y writes
terrain bounding box/sphere recomputation
all tree batch flushes
all active grass matrix rewrites
all active shard matrix rewrites
all grass/shard bound recomputation
full fixed-collider replacement through Rapier adapter
```

`activationBudget: 1` limits patch activations delivered per frame, but one activation still rebuilds content for every active patch. The architecture therefore reduces generation spikes without proving a bounded activation cost.

## Partial-commit risks

```txt
activePatches is mutated before terrain upload
terrain can commit before tree batch flush
some tree types can commit before a later type fails
grass can truncate without a typed result
shards can truncate without a typed result
render bounds can lag if an update fails
controller snapshot can say active while the visible scene is partial
```

`acquireTerrainSlot()` falls back to slot zero if no free slot exists. Release-before-activation and the 25-slot/25-active policy normally prevent this, but no asserted invariant or rejection result proves it.

## Missing render evidence

```txt
patch activation ID and revision
terrain slot assignment result
terrain array/schema validation
per-tree-type admitted/rejected counts
grass layer admitted/rejected IDs
shard admitted/rejected IDs
bounds update result
consumer-active patch IDs
render-consumption fingerprint
frame ID that first rendered the activation
rollback or repair result
resource lifecycle/disposal state
```

## Required render commit boundary

```txt
prepare
  validate patch arrays and capacities
  reserve terrain slot
  compute all tree/grass/shard writes
  compute expected bounds and counts
  build immutable activation plan

commit
  apply all writes under one activation revision
  publish per-consumer results
  update consumer-active set only after success

render
  record first frame consuming activation revision
  compare consumer-active set with controller-active set
```

## Next safe ledge

```txt
PrehistoricRush Patch Render Commit Authority
+ Controller / Terrain / Instance-Batch Parity Fixture
```
