# Product Vegetation Fixture Command and Result Map

**Timestamp:** `2026-07-17T02-50-44-04-00`

## Required command flow

```txt
ProductVegetationFixtureAdmissionCommand
  sourceRevision
  engineRevision
  workerRevision
  browserOriginRevision
  packageRevision
  expectedCatalogCardinality

  -> ProductVegetationFixtureAdmissionResult

ProductVegetationRuntimeConstructionCommand
  -> ProductVegetationRuntimeConstructionResult

SemanticCatalogRegistrationCommand
  -> SemanticCatalogRegistrationResult

ProductPatchFixtureCommand
  -> MainThreadPatchFixtureResult
  -> WorkerPatchFixtureResult
  -> MainWorkerPatchParityResult

ProductVegetationFrameProofCommand
  -> ProductVegetationFrameProofResult
  -> FirstProductVegetationPatchAck
  -> FirstProductVegetationFrameAck
```

## Rejection classes

```txt
missing pinned engine export
Core Object/Vegetation installation failure
catalog cardinality or descriptor mismatch
non-cloneable instance envelope
main-thread/Worker divergence
collider or ground authority divergence
species/package generation mismatch
browser or Pages module-load failure
stale fixture revision
missing rendered-frame acknowledgement
```

## Settlement rule

Local import and test-double results remain valid source evidence, but cannot be promoted to product-runtime conformance without matching construction, patch, Worker, browser, and frame results.