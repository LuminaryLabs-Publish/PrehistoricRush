# Renderer Recovery Audit: GPU Resource Rehydration Contract

**Timestamp:** `2026-07-16T06-39-16-04-00`

## Summary

PrehistoricRush can reconstruct most visible content from CPU-side descriptors, but that reconstruction is not registered or ordered as a recovery graph.

## Plan ledger

**Goal:** rebuild the complete GPU presentation graph from accepted CPU state and prove one coherent frame.

- [x] Inventory renderer-owned resource families.
- [x] Identify authoritative CPU rebuild inputs.
- [x] Define reconstruction order.
- [x] Define stale-generation and rollback rules.
- [ ] Implement the registry and fixture.

## Resource families

```txt
renderer context and output policy
shadow map and light resources
base terrain slots and materials
terrain LOD slot geometries
per-level index attributes
terrain morph target buffers
clay normal and roughness textures
tree trunk and crown geometries/materials/instance buffers
grass geometries/shaders/instance buffers
shard geometry/material/instance buffers
player creature geometry, skeleton, skinning and materials
camera projection and scene bindings
```

## Rebuild inputs

```txt
current terrain LOD policy
seed and texture policy
active patch descriptors from controller/cache
instance-batch snapshots
player creature descriptor and accepted pose
camera-follow snapshot
accepted simulation and physics revisions
viewport and DPR policy
```

## Required transaction

```txt
prepare replacement generation off the stale submission path
  -> allocate renderer and shared resources
  -> allocate LOD and instance resources
  -> replay active patch descriptors
  -> restore player/camera presentation
  -> validate resource counts and policy IDs
  -> atomically adopt replacement generation
  -> dispose/retire predecessor exactly once
  -> render and acknowledge FirstRecoveredFrameAck
```

## Failure handling

A partial rebuild must not become active. Failed generations are retired, their resources disposed, and recovery either retries within budget or publishes a fallback result.

## Boundary

No GPU resources were created, destroyed or restored during this audit.
