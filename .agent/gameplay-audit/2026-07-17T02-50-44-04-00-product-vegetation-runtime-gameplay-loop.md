# Product Vegetation Runtime Gameplay Loop

**Timestamp:** `2026-07-17T02-50-44-04-00`

## Interaction loop

```txt
start run
  -> prepare tree fidelity assets
  -> construct gameplay and Vegetation runtime
  -> initialize patch Worker
  -> stream route-adjacent patches
  -> select ecological species
  -> create deterministic Vegetation instance
  -> emit visible tree and collision proxy
  -> activate patch
  -> player traverses, jumps, collides, collects, fails, wins, or restarts
```

## Current source proof

The dense spawn fixture validates deterministic output, ten-species coverage, variation ranges, one collider per visible tree, the Vegetation instance schema, and ground-sink/collision separation.

## Remaining gameplay proof gap

The fixture injects a test-owned placement implementation. It does not prove that the actual Core Vegetation runtime supplies the same species, variation, lifecycle, metadata, and collision inputs during a real run.

## Required gameplay fixture

```txt
actual product runtime
  -> actual ecological selection
  -> actual instance descriptor
  -> main-thread patch
  -> Worker patch
  -> equal semantic and collision result
  -> accepted streamed patch
  -> player traversal through the patch
  -> FirstProductVegetationPatchAck
```

## Boundary

No tree-placement, collision, traversal, scoring, or outcome defect was reproduced.