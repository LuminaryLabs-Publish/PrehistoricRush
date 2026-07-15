# Terrain Patch Admission Command and Result Map

**Timestamp:** `2026-07-15T05-38-36-04-00`

## Summary

Current patch activation is a sequence of direct mutations. It needs one command identity, expected revisions, participant receipts and a typed terminal result.

## Plan ledger

**Goal:** define the command/result boundary from a ready patch to an accepted visible terrain frame.

- [x] Define command identity and prerequisites.
- [x] Define acceptance and rejection results.
- [x] Define participant receipts and frame acknowledgement.
- [ ] Implement later.

## Command

```txt
TerrainPatchRenderAdmissionCommand {
  commandId
  patchId
  patchGeneration
  expectedControllerRevision
  expectedTerrainSchemaRevision
  expectedLodPolicyRevision
  expectedAdapterGeneration
  focusRevision
  rendererGeneration
}
```

## Admission sequence

```txt
validate patch identity and schema
validate field lengths and finite values
select LOD using accepted focus and prior level
acquire matching topology and index buffer
prepare positions, colors, normals, UVs and morph data
prepare clay material resources
stage GPU upload
prepare vegetation, collider and pickup membership
compare expected revisions again
atomically adopt all participants
publish result and visible-frame acknowledgement
```

## Terminal classifications

```txt
accepted
rejected-invalid-schema
rejected-capacity-mismatch
rejected-stale-patch
rejected-stale-policy
rejected-stale-adapter
rejected-resource-failure
rejected-gpu-upload
superseded
retired
```

## Result

```txt
TerrainPatchRenderAdmissionResult {
  commandId
  patchId
  patchGeneration
  terrainSchemaRevision
  lodPolicyRevision
  levelId
  topologyRevision
  materialRevision
  adapterGeneration
  participantReceipts
  status
  reason
}
```

`FirstTerrainLodFrameAck` must cite the accepted result, visible frame revision and renderer generation.

## Boundary

This map proposes product-level coordination; it does not move Three.js execution into Nexus Engine Core.