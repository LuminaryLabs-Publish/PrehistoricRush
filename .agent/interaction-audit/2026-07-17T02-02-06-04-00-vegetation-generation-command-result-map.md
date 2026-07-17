# Vegetation Generation Command / Result Map

**Timestamp:** `2026-07-17T02-02-06-04-00`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Proposed command flow

```txt
VegetationGenerationAdmissionCommand
  input
    runtimeModuleGeneration
    archetypeSourceRevision
    speciesDescriptors
    treeStructureDescriptors
    foliageDescriptors
    vegetationObjectDescriptors
    semanticFidelityProfiles
    packageManifest
    cacheRevision
    workerRevision
  output
    VegetationGenerationAdmissionResult
    VegetationGeneration
    generationDigest
    speciesPackageBindings

VegetationWorkerInitCommand
  input
    expectedGenerationDigest
    generatorConfig
    routeRevision
  output
    VegetationWorkerInitResult
    workerCatalogDigest
    workerGenerationDigest
    accepted | rejected

PatchVegetationCommand
  input
    generationDigest
    patchId
    seed
    environment samples
  output
    PatchVegetationResult
    instances with speciesId and descriptor hashes
    patchGenerationDigest

VegetationTreeProjectionCommand
  input
    accepted generation
    patch result
    species/package table
    camera/frame revisions
  output
    TreeProjectionResult
    FirstDomainBoundTreeFrameAck
```

## Rejection rules

```txt
missing descriptor hash -> reject
semantic profile not registered -> reject
package omits vegetation generation -> reject
Worker digest mismatch -> reject before generation
patch digest mismatch -> reject before activation
unknown speciesId -> reject
species/typeIndex/package mismatch -> reject
stale cache generation -> retire and rebuild
stale frame generation -> reject presentation
```

## Existing evidence to retain

- deterministic vegetation selection and variation
- exact tree-fidelity package generation IDs
- patch-controller cache generation
- exact impostor frame acknowledgement
- startup preparation receipts

The new result should compose those receipts rather than replacing them.
