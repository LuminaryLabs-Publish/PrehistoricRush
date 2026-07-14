# Grass Patch Cell Range Lifecycle

**Timestamp:** `2026-07-13T21-38-52-04-00`

## Summary

Grass now uses three patch-owned incremental instance batches with fixed cell capacities. This removes the prior global rebuild path, but overflow and cross-layer activation still lack a shared result.

## Plan ledger

**Goal:** preserve stable grass ranges while making layer capacity, degradation and visible adoption explicit per patch.

- [x] Confirm three grass layers use `updateMode: incremental`.
- [x] Confirm each layer uses a fixed per-cell capacity.
- [x] Confirm activation and release use patch IDs.
- [x] Record overflow and multi-layer atomicity gaps.
- [ ] Add capacity policy and layer-coherence fixtures later.

## Implemented contract

```txt
layer capacities:      3600, 2600, 1300
cell capacities:       72, 72, 52
activation:            replaceCell(patchId, patch.grass[layerIndex])
release:               releaseCell(patchId)
GPU upload:            changed instance ranges only
bounds:                recompute on change
```

## Remaining gaps

```txt
no authored overflow policy per layer
console warning is the only overflow projection
no patch-level result combines all three layer outcomes
no visible-frame receipt confirms all layers changed together
no quality policy defines which blades may be dropped
no fixture stresses capacity across the maximum active patch set
no rollback if one layer flush or GPU upload fails
```

## Required grass result

```txt
GrassPatchCellResult {
  activationId
  patchId
  layerResults[]
  requestedCounts[]
  visibleCounts[]
  overflowCounts[]
  batchRevisions[]
  status: Complete | Degraded | Failed | RolledBack | Stale
}
```

## Completion gate

Grass may degrade under an explicit quality policy, but every layer must report the same patch activation and the visible frame must expose the accepted batch revisions. Silent or console-only overflow is not a terminal result.
