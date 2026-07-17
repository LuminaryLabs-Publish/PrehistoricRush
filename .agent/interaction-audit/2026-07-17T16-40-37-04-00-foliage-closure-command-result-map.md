# Foliage Closure Command and Result Map

**Timestamp:** `2026-07-17T16-40-37-04-00`

## Intent

Convert independent source, Worker and renderer facts into one generation-bound admission chain.

## Proposed commands and results

```txt
FoliageFamilyClosureAdmissionCommand
  input:
    archetypeCatalogRevision
    familyCatalogRevision
    placementRecipeRevision
  work:
    enumerate primary and placement-referenced family IDs
    reject unknown IDs
    canonicalize descriptor closure
  result:
    FoliageFamilyClosureResult
    familyCatalogDigest
    descriptorClosureDigest

AtlasRevisionAdmissionCommand
  input:
    foliageAtlasRevision
    familyCatalogDigest
    runtimeGeneration
  work:
    validate atlas cells, family IDs and revision identity
  result:
    AtlasRevisionAdmissionResult

WorkerFoliageCatalogAdmissionCommand
  input:
    expected atlas and closure digests
    workerGeneration
  work:
    construct the Worker catalog
    echo observed revision and digests
  result:
    WorkerFoliageCatalogResult

FoliageRealmParityCommand
  input:
    main and Worker results
  work:
    compare revision, family and descriptor evidence
    reject stale generations
  result:
    FoliageRealmParityResult

FoliageFrameCommitCommand
  input:
    accepted realm parity, patch and renderer generations
  work:
    confirm family-complete atlas adoption in the presented frame
  result:
    FirstFamilyCompleteFoliageFrameAck
```

## Settlement rules

```txt
unknown placement family: reject descriptor registration
main/Worker digest mismatch: reject Worker patch admission
atlas revision mismatch: reject patch or renderer generation
stale Worker ready/result: settle once as stale, never activate
renderer replacement: retire previous atlas generation before acknowledgement
frame acknowledgement: publish only after matching render submission
```

## Existing evidence mapping

```txt
source family closure assertions -> partial FoliageFamilyClosureResult evidence
Worker foliageAtlasRevision -> partial WorkerFoliageCatalogResult evidence
lushVegetationFrameAck revision -> partial frame evidence
canonical digest and cross-realm settlement -> absent
```

## Boundary

All command/result surfaces in this document are proposed. The source repair and `v2` identity are implemented; no runtime command bus or admission behavior was added by this audit.