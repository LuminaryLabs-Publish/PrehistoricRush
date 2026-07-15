# Terrain Attribute Capacity and Visible-Frame Gap

**Timestamp:** `2026-07-15T05-38-36-04-00`

## Summary

The active terrain slot is allocated for 961 vertices, but each ready patch now carries 4,225 vertices. The color and normal uploads cannot fit, and no render candidate or first-frame result isolates the failure.

## Plan ledger

**Goal:** prevent partial slot mutation and make terrain visibility cite one accepted patch, LOD and resource generation.

- [x] Compare geometry and field dimensions.
- [x] Trace the attribute upload order.
- [x] Identify disconnected topology and texture helpers.
- [x] Define visible-frame evidence.
- [ ] Execute browser and pixel fixtures later.

## Current render path

```txt
acquire terrain slot
  -> mutate position heights for 961 vertices
  -> copy 12,675 color floats into 2,883-float target
  -> copy 12,675 normal floats into 2,883-float target
  -> mark attributes dirty
  -> publish mesh position and visibility
```

The upload is not staged. Position data can be partially changed before the oversized color copy rejects. No candidate resource generation or rollback receipt protects the predecessor slot.

## Missing evidence

```txt
validated TerrainPatchSchema
selected LOD revision
matching geometry capacity
accepted index buffer
skirt and morph binding
normal/roughness resource generation
GPU upload receipt
atomic patch adoption result
first visible terrain frame acknowledgement
```

## Required frame result

```txt
TerrainFrameResult {
  patchId
  patchGeneration
  terrainSchemaRevision
  lodPolicyRevision
  levelId
  topologyRevision
  materialRevision
  rendererGeneration
  uploadReceipts
  visibleFrameRevision
  status
}
```

## Boundary

No screenshot or browser render was executed. The capacity conflict is derived directly from source dimensions and typed-array upload calls.