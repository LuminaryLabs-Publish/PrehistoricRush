# Render Audit: Hidden Legacy Terrain Allocation Gap

**Timestamp:** `2026-07-15T06-39-22-04-00`

## Summary

The LOD terrain is now active, but the fixed-grid terrain renderer is still fully allocated and updated. Visibility suppression removes the duplicate draw, not the duplicate resource and upload path.

## Plan ledger

**Goal:** prove and then remove all hidden legacy terrain work while preserving the accepted LOD frame.

- [x] Count source-defined terrain slot pools.
- [x] Trace activation and release across both pools.
- [x] Inspect the current frame acknowledgement.
- [ ] Execute browser allocation and upload fixtures later.

## Current render path

```txt
create base adapter
  -> allocate 25 legacy BufferGeometry objects
  -> allocate legacy material

create LOD layer
  -> allocate 25 LOD BufferGeometry objects
  -> allocate shared physical clay material
  -> allocate normal and roughness textures

activate patch
  -> write LOD position, normal, color, UV and morph data
  -> write legacy position, normal and color data
  -> hide legacy mesh

render
  -> draw shared scene
  -> LOD terrain visible
  -> legacy terrain invisible but retained
```

## Source-backed counts

```txt
legacy slots: 25
LOD slots: 25
total terrain slots: 50
legacy vertices per slot: 4,225
LOD vertices per slot: 4,485
legacy grid position/color/normal floats per slot: 38,025
legacy grid position/color/normal floats across 25 slots: 950,625
```

The float count excludes legacy indices, material state, object overhead and driver-side resources. It is not a measured GPU-memory result.

## Evidence gap

`lastVisibleFrameAck` is written after the shared renderer returns, but it contains only frame, policy ID, active-patch count and morphing count. It does not identify accepted patch generations, draw submissions, slot ownership, material generation or the absence of legacy terrain work.

## Required proof

```txt
scene contains one terrain mesh pool
terrain allocation count equals configured slot count
one terrain upload receipt per admitted patch
no legacy terrain material or slot map exists
no hideLegacyTerrain traversal occurs
frame ack cites patch, slot, LOD, material and renderer revisions
restart/dispose returns terrain resource count to zero
```