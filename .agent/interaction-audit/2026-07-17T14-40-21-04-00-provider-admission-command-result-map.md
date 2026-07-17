# Provider Admission Command and Result Map

**Timestamp:** `2026-07-17T14-40-21-04-00`

## Commands

```txt
ProviderRevisionAdmissionCommand
  expectedRevision
  providerUrl
  productRevision
  realmId
  startupGeneration

VegetationProviderProbeCommand
  providerGeneration
  requiredExports
  requiredServices
  expectedTreeSpeciesCount
  expectedGroundCoverSpeciesCount
  expectedFoliageAtlasRevision

WorkerProviderAdmissionCommand
  providerGeneration
  workerGeneration
  deadline

ProviderRealmParityCommand
  mainProbeDigest
  workerProbeDigest
  catalogDigest
  providerRevision

VegetationStartupCommitCommand
  providerGeneration
  parityGeneration
  initialPatchRequest
```

## Results

```txt
ProviderRevisionAdmissionResult
  accepted | rejected
  observedRevision
  moduleIdentityDigest
  failureClass

VegetationProviderProbeResult
  coreObjectConstructed
  foliagePlacementServiceAvailable
  treeSpeciesCount
  groundCoverSpeciesCount
  catalogDigest
  failureClass

WorkerProviderAdmissionResult
  accepted | fallback | failed
  workerGeneration
  observedRevision
  catalogDigest
  failureClass

ProviderRealmParityResult
  matched | mismatched | unavailable
  acceptedProviderGeneration
  fallbackMode

FirstVegetationRuntimeReadyAck
FirstWorkerPatchAck
FirstProviderBoundVegetationFrameAck
```

## Settlement rules

- Reject a module whose observed revision does not match the manifest.
- Construct the domain before declaring provider readiness.
- Verify `vegetationFoliage.createPlacementRecipe` is callable.
- Bind Worker results to both worker and provider generations.
- Reject stale ready and patch messages.
- Use synchronous generation only through an explicit fallback result.
- Admit the first visible vegetation frame only after matching provider evidence.

## Current source mapping

```txt
runtime-versions.js: provider manifest and URL
 game-runtime-lod.js: main import, partial preflight, runtime construction and stream admission
 prehistoric-vegetation-domain.js: domain construction and catalog registration
 prehistoric-patch-worker.js: Worker import, runtime construction, ready/error and patch messages
 tests/vegetation-module-imports.mjs: local product-export checks only
```

These command/result surfaces are proposed and unimplemented.