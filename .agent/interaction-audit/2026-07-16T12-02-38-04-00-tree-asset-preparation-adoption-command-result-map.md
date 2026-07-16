# Interaction Audit: Tree Asset Preparation and Adoption Command Map

**Timestamp:** `2026-07-16T12-02-38-04-00`

## Summary

Current route code performs preparation through direct calls and a global handoff. The missing interaction contract is the explicit command/result boundary that binds a prepared bundle to the game and renderer generations.

## Plan ledger

**Goal:** replace implicit global receipt discovery with typed, generation-bound commands and results.

- [x] Map current calls.
- [x] Map missing results.
- [x] Define stale and failure paths.
- [ ] Implement the command/result map.

## Current map

```txt
menu RAF
  -> create asset runtime
  -> requestBundle(background)
  -> update status text
  -> store runtime globally

game module evaluation
  -> create asset/startup runtime
  -> startup.launch
  -> trackAssetPreparation(required)
  -> update loading DOM
  -> store runtime and receipt globally
  -> dynamic import game runtime

game runtime
  -> no receipt lookup
  -> no asset request/read
  -> no adoption result
```

## Required map

```txt
TreeFidelityPreparationCommand
  inputs:
    routeGeneration
    assetRuntimeGeneration
    bundleId
    expectedManifestRevision
    cachePolicy
    priority
  outputs:
    TreeFidelityPreparationResult
    package IDs and digests
    cache/provider provenance
    completion/failure class

TreeFidelityAdoptionCommand
  inputs:
    preparationResultId
    gameGeneration
    worldGeneratorRevision
    renderGeneration
  outputs:
    TreeFidelityAdoptionResult
    accepted archetype registry
    patch-binding digest
    materialized resource IDs

TreeFidelityProjectionCommand
  inputs:
    adoptionResultId
    frameId
    active patch revision
    camera projection
  outputs:
    form selection snapshot
    transition snapshot
    FirstTreeFidelityBoundFrameAck
```

## Rejections

```txt
unknown bundle or manifest revision
missing package dependency
invalid schema or form descriptor
capture frame count mismatch
stale route/game/render generation
package digest mismatch
patch cache built from another package generation
partial materialization
route retirement during request or adoption
```

## Lifecycle

Menu preload may warm the shared cache, but it must not become the game authority. The game must request or acquire an immutable preparation result, admit it into the current game generation, and retire all route-owned providers and capture resources explicitly.