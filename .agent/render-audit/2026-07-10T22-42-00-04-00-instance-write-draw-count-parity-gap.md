# Render Audit: Instance Write and Draw-Count Parity

**Timestamp:** `2026-07-10T22-42-00-04-00`

## Current pools

```txt
tree trunks: 5 pools x 100
tree crowns: 5 pools x 100
roots: 400
grass carpet: 3,600
grass main: 2,600
grass verge: 1,300
rocks: 320
shards: 220
```

## Gaps

- Tree and root `setMatrixAt()` calls are not guarded by immutable capacity.
- Pool counters are later copied directly into `mesh.count`, even when they can exceed allocation.
- Grass increments `grassCounts[layer]` before capacity and LOD checks.
- Grass compares against `layer.mesh.count`, which is the prior generation's active draw count, not allocation capacity.
- LOD-rejected grass candidates still consume indices and inflate the published draw count.
- A later generation can expose stale matrices where the active count exceeds matrices written in that generation.
- No generation-level matrix-write count or stale-slot clear policy exists.

## Required render contract

```txt
immutableCapacity >= admittedCount == successfulMatrixWrites == activeDrawCount
```

Every active slot must be written in the committed generation. Rejected, truncated, or LOD-culled candidates must not consume active indices.

## Required proof rows

```txt
poolId
capacity
requested
admitted
matrixWrites
activeDrawCount
truncated
lodRejected
staleSlotsExposed
instanceMatrixRevision
generationId
```

## Render acceptance

- No `mesh.count` can exceed immutable capacity.
- No draw count can exceed successful writes.
- Repeated generation with the same inputs produces the same matrix fingerprint.
- Sparse generation after dense generation exposes no stale matrices.
- Failed generation leaves the prior committed matrices and draw counts unchanged.

Visual style, geometry, shaders, materials, and densities should remain unchanged during the authority pass.