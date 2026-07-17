# Family-Complete Atlas Frame Convergence Gap

**Timestamp:** `2026-07-17T16-40-37-04-00`

## Summary

The renderer builds near and medium batches for all eight canonical foliage families and reports `foliageAtlasRevision` in `lushVegetationFrameAck`. The repaired domain descriptor now also declares every family referenced by its clusters.

## Render loop

```txt
create procedural atlas at revision v2
  -> clone one family texture per atlas cell
  -> allocate near/medium InstancedMesh batches per family
  -> activate streamed patches
  -> select near, medium or absent by projected size
  -> write card matrices, tint, wind and crossfade
  -> render
  -> publish lushVegetationFrameAck
```

## Confirmed

```txt
eight canonical family atlas tiles: present
near and medium batches per family: present
alpha-cutout, depth-writing materials: present
wind/tint/fidelity attributes: present
frame acknowledgement with atlas revision: present
descriptor family closure: present
```

## Gap

```txt
renderer admission against a canonical descriptor digest: absent
patch identity bound to atlas revision: absent
main/Worker family closure parity: absent
stale atlas generation rejection: absent
per-family visible count in frame acknowledgement: absent
browser assertion for broad-canopy hanging-vine visibility: absent
artifact and Pages family-complete frame fixture: absent
FirstFamilyCompleteFoliageFrameAck: absent
```

The existing `lushVegetationFrameAck` proves that a frame used one atlas revision and reports aggregate tree-card counts. It does not prove that every family referenced by accepted descriptors or patches was available and rendered through the same generation.

## Proposed projection contract

```txt
FoliageFrameDigest
  atlasRevision
  familyCatalogDigest
  descriptorClosureDigest
  patchGeneration
  rendererGeneration
  activeFamilyIds
  nearCountByFamily
  mediumCountByFamily
  groundCoverCount
  frameNumber

FoliageFrameCommitCommand
  -> validate accepted catalog, patch and renderer generations
  -> publish FirstFamilyCompleteFoliageFrameAck
```

## Validation boundary

Source inspection only. No screenshot, GPU capture, browser run, artifact run or Pages run was performed, and no current visual defect is claimed.