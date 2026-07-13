# Render Audit: Game Render Resource Retirement Gap

**Timestamp:** `2026-07-12T20-10-25-04-00`

## Summary

The game adapter allocates a persistent Three.js render surface and a substantial fixed resource set, but exposes no disposal API. The browser may eventually reclaim a document on navigation, yet the runtime itself cannot prove ordered retirement, exact-once disposal, failure cleanup or safe in-document re-entry.

## Plan ledger

**Goal:** bind every renderer-side allocation to one runtime session and produce explicit retirement receipts before that session is considered stopped.

- [x] Trace renderer and scene construction.
- [x] Count fixed mesh, geometry, material and skeleton allocations.
- [x] Confirm `createThreeAdapter()` returns no disposer.
- [x] Confirm the game does not import `disposeCreatureMesh()`.
- [x] Define render-resource leases and retirement order.
- [ ] Add executable WebGL lifecycle fixtures.

## Source-backed allocation census

```txt
25 terrain meshes with 25 BufferGeometry objects
10 tree InstancedMesh objects with 10 geometry objects
3 grass InstancedMesh objects with 3 geometry objects
1 shard InstancedMesh with 1 geometry object
1 player SkinnedMesh with 1 geometry object

40 mesh/geometry allocations total
12 material objects
1 Skeleton
1 WebGLRenderer
```

Shared and unique material count:

```txt
terrain material: 1
shared trunk material: 1
crown materials: 5
grass ShaderMaterials: 3
shard material: 1
player material: 1
= 12
```

This is a source-level allocation census. It is not a measured GPU-memory or leak claim.

## Missing render authority

```txt
render-resource-set ID and generation
renderer lease
scene resource registry
geometry/material/skeleton leases
exact-once retirement result
partial-construction rollback
context-loss/failure classification
stale render callback rejection
last visible frame acknowledgement
renderer-disposed acknowledgement
```

## Required retirement flow

```txt
close render admission
  -> stop RAF producer
  -> detach public renderer access
  -> remove player and instanced meshes
  -> call disposeCreatureMesh(player)
  -> dispose terrain/tree/grass/shard geometries
  -> dispose all unique materials exactly once
  -> clear scene references
  -> dispose renderer
  -> publish RenderResourceRetirementResult
```

## Proof boundary

A browser page disappearing, a canvas becoming unreachable or `renderer.dispose()` being callable does not prove that every geometry, material, skeleton and callback owned by the runtime retired once and in order.