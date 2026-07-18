# Production Forest Legacy Work Retirement Contract

**Timestamp:** `2026-07-18T05-40-17-04-00`

## Current contract

```txt
production forest is created after the base adapter
production layer discovers legacy grass through scene traversal
matching legacy meshes are hidden
production patches and buffers become visible
legacy grass objects, batches and work remain alive
production dispose re-enables legacy meshes
```

This is a reversible presentation override, not complete work retirement.

## Required retirement contract

### Admission

```txt
select production | legacy | fallback before render-host construction
bind renderer, density, atlas, material, capacity and patch revisions
publish ProductionForestGenerationResult
```

### Retirement

```txt
skip superseded mesh and batch allocation
skip superseded replaceCell/releaseCell/flush work
skip superseded shader-uniform updates
retain only explicitly declared fallback resources
publish LegacyVegetationRetirementResult
```

### Capacity

```txt
admit capacities per bark, canopy family, grass variant and detail variant
classify culling separately from overflow
record requested, admitted and dropped counts
make degradation deterministic
publish ProductionForestCapacityResult
```

### Patch lifecycle

```txt
bind every production record to patch id, cache key and production generation
replace records only with accepted newer generation
reject stale activation or release
settle patch release before disposal
```

### Projection

```txt
publish production generation id
publish active patch digest
publish capacity and overflow result
publish legacy retirement state
publish resource ownership digest
acknowledge first matching visible frame
```

## Disposal requirements

```txt
clear production patch records
dispose bark geometry/material
dispose canopy geometries/materials/family texture clones
dispose grass geometries/materials/variant texture clones and atlas
dispose detail geometries/materials
retire or deliberately restore fallback legacy hosts
publish one disposal settlement
```

## Proof matrix

```txt
source fixture: host construction routing
unit fixture: activate/update/release/dispose
retirement fixture: zero superseded batch/frame work
capacity fixture: deterministic overflow settlement
stale fixture: old patch generation rejected
browser fixture: matching frame digest
artifact/Pages fixture: same authority and counts at deployed origin
```

## Status

Proposed. Existing production forest rendering, counters and disposal are retained as implemented evidence.