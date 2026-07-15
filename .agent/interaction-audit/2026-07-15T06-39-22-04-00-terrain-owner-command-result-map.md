# Interaction Audit: Terrain Owner Command and Result Map

**Timestamp:** `2026-07-15T06-39-22-04-00`

## Summary

Terrain ownership is currently implicit in adapter construction. No command declares which renderer owns terrain, and no result rejects a multi-owner composition.

## Plan ledger

**Goal:** turn adapter composition, patch adoption, frame proof and retirement into explicit versioned commands and results.

- [x] Map current implicit calls.
- [x] Define required commands and result identities.
- [ ] Implement command admission later.

## Current implicit calls

```txt
createThreePatchStreamLodAdapter
  -> createThreePatchStreamAdapter
  -> createThreeTerrainLodLayer

activatePatch
  -> terrain.activatePatch
  -> base.activatePatch
  -> hideLegacyTerrain

releasePatches
  -> terrain.releasePatches
  -> base.releasePatches

render
  -> terrain.update
  -> base.render
  -> mutate lastVisibleFrameAck
```

## Required command map

```txt
TerrainPresentationCompositionCommand
  -> TerrainPresentationCompositionResult
     accepted provider ID
     rejected duplicate providers
     renderer and policy generations

TerrainPatchPresentationCommand
  -> TerrainPresentationAdoptionResult
     patch ID and generation
     slot ID
     LOD level and transition revision
     upload and material receipts

TerrainFrameCommand
  -> TerrainFrameResult
     accepted patch revisions
     draw receipt
     first-visible acknowledgement

TerrainPatchRetirementCommand
  -> TerrainPresentationRetirementReceipt
     released slot
     retired patch generation
     rejected late work

TerrainRendererRetirementCommand
  -> TerrainRendererRetirementResult
     geometry, material, texture, canvas and listener receipts
```

## Admission rules

```txt
exactly one terrain provider per renderer generation
no patch upload before provider composition acceptance
no duplicate PatchId/PatchGeneration adoption
no release against a different generation
no visible-frame acknowledgement without accepted draw evidence
no activation or render after renderer retirement
```