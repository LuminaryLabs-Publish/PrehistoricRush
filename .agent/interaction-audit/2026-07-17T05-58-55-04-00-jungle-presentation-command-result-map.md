# Jungle Presentation Command and Result Map

**Timestamp:** `2026-07-17T05-58-55-04-00`

## Command flow

```txt
JunglePresentationAdmissionCommand
  inputs:
    runtime source revision
    Nexus Engine revision
    foliage atlas revision
    foliage catalog digest
    ground-cover catalog digest
    patch/Worker revision
    renderer/scene revision
    quality and viewport revision
  outputs:
    JunglePresentationAdmissionResult
    accepted JunglePresentationGeneration

FoliageCatalogRegistrationCommand
  -> validates family IDs, atlas cells, scalar ranges and immutability
  -> registers card and ground-cover descriptors
  -> FoliageCatalogRegistrationResult

FoliagePatchProjectionCommand
  -> receives patch/species/tree-instance/ecology evidence
  -> derives bounded card and ground-cover placements
  -> compares main-thread and Worker payloads
  -> FoliagePatchProjectionResult
  -> FirstJunglePatchAck

JungleAtmosphereProjectionCommand
  -> receives scene, renderer, quality and predecessor generation
  -> applies background/fog/exposure/light/shadow state exactly once
  -> JungleAtmosphereProjectionResult

JunglePresentationFrameCommitCommand
  -> binds catalog, patch, card batch, atlas material, atmosphere,
     renderer, viewport and frame revisions
  -> JunglePresentationProjectionResult
  -> FirstJunglePresentationFrameAck

JunglePresentationRetirementCommand
  -> removes owned lights and GPU resources
  -> restores or replaces predecessor scene state
  -> rejects stale work
  -> JunglePresentationRetirementResult
```

## Admission rules

- Reject unknown atlas revisions and out-of-range atlas cells.
- Reject mutable or duplicate catalog generations.
- Reject placement evidence without patch and tree-instance identity.
- Reject far-tier requests that resolve to unbounded near-tier counts.
- Reject stale Worker results after patch or catalog retirement.
- Reject atmosphere application to a retired scene or renderer generation.
- Apply atmosphere once per generation; repeated identical commands are idempotent.
- Commit a frame acknowledgement only after the exact accepted GPU and scene state renders.

## Failure classes

```txt
catalog-invalid
atlas-unavailable
material-unavailable
worker-revision-mismatch
patch-retired
placement-budget-exceeded
scene-retired
renderer-retired
atmosphere-duplicate
resource-retirement-failed
frame-not-presented
indeterminate
```

## Diagnostics

```txt
junglePresentationGeneration
foliageCatalogDigest
groundCoverCatalogDigest
patchGeneration
workerGeneration
cardInstanceCountByTier
cardBatchGeneration
atlasMaterialGeneration
atmosphereGeneration
ownedLightCount
rendererGeneration
frameNumber
projectionDigest
lastResult
```

## Boundary

The command/result map is proposed documentation. The current runtime exposes neither these commands nor their typed results.
