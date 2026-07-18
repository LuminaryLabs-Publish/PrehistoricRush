# Hidden Legacy Grass Work Gap

**Timestamp:** `2026-07-18T05-40-17-04-00`

## Summary

The production forest renderer is visually authoritative for grass and forest detail, but legacy grass is suppressed only at mesh visibility. Its batch and frame work remain active.

## Source-backed render path

```txt
createThreePatchStreamAdapter
  -> creates three legacy grass InstancedMesh hosts
  -> creates three instanced-render-batch controllers

createThreeProductionForestLayer
  -> traverses matching legacy meshes
  -> sets visible = false
  -> records productionGrassSuppressed

patch activation/release
  -> base adapter still replaceCell/releaseCell for legacy grass
  -> base adapter still flushes legacy matrices

frame
  -> production layer culls and writes six grass variants
  -> base adapter still updates hidden legacy time/wind uniforms
  -> renderer submits the visible production forest
```

## Implemented production surface

```txt
bark capacity: 9000
canopy capacity per foliage family: 2600
grass capacity per variant: 2800
production grass variants: 6
ground-detail capacity per variant: 900
ground-detail variants: 4
distance culling: present
overflow counter: present
frame counters: present
```

## Missing proof

```txt
exclusive presentation-authority admission
zero legacy batch creation under production mode
zero legacy patch membership work under production mode
zero legacy frame uniform work under production mode
capacity policy revision
overflow classification and accepted degradation
patch/cache generation in frame digest
resource retirement receipt
FirstProductionForestBoundFrameAck
browser frame-cost comparison
```

## Proposed correction

Choose the vegetation presentation policy before constructing the base adapter. Under production authority, omit legacy grass meshes/batches and route patch grass only to the production layer. Preserve a deliberate fallback path rather than creating both paths and hiding one.

## Claim boundary

No frame-time, memory, GPU-cost or visual regression measurement was captured. Duplicate source work is confirmed; material impact is not quantified.