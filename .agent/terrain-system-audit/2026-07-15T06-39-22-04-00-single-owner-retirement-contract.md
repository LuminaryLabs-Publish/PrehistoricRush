# Terrain System Audit: Single-Owner Retirement Contract

**Timestamp:** `2026-07-15T06-39-22-04-00`

## Summary

The terrain system needs one provider contract spanning allocation, patch upload, LOD state, visible-frame proof, patch release and renderer retirement. Compatibility must be a provider choice, not a second hidden renderer.

## Plan ledger

**Goal:** define the minimum implementation contract for one terrain owner and complete lifecycle retirement.

- [x] Define composition, adoption, frame and retirement boundaries.
- [x] Preserve non-terrain patch services.
- [x] Define failure and stale-work rules.
- [ ] Implement and validate later.

## Contract

```txt
TerrainProviderDescriptor
  id
  generation
  patchSchemaRevision
  policyRevision
  rendererGeneration
  slotCapacity
  capabilities

TerrainPresentationAdoptionResult
  commandId
  patchId
  patchGeneration
  acceptedProviderId
  slotId
  levelId
  transitionRevision
  geometryReceipt
  materialReceipt
  uploadReceipt

TerrainFrameResult
  frameId
  providerGeneration
  acceptedPatchRevisions
  drawReceipt
  visibleFrameAck

TerrainPresentationRetirementReceipt
  patchId
  patchGeneration
  releasedSlotId
  retiredResources
  rejectedLateCommands

TerrainRendererRetirementResult
  providerGeneration
  releasedGeometryCount
  releasedMaterialCount
  releasedTextureCount
  canvasRetired
  listenersRetired
```

## Ownership rules

```txt
one provider owns terrain meshes
one provider owns terrain slot membership
one provider uploads patch terrain arrays
one provider selects and transitions LOD
one provider releases patch terrain
one provider disposes shared terrain resources
patch-world content never hides or mutates terrain meshes
```

## Failure rules

```txt
provider composition failure creates no renderer-visible state
patch preparation failure preserves the accepted predecessor slot
content adoption failure rolls back the candidate according to one atomic policy
late Worker results are rejected by PatchGeneration
release is idempotent and generation-bound
renderer retirement rejects later activation, update and render calls
```

## Migration ledge

Add an optional `terrainProvider` to the base adapter. Use the fixed-grid provider for legacy hosts and the LOD provider for PrehistoricRush. Remove unconditional fixed-grid allocation from the shared content path.