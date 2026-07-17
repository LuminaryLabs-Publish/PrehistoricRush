# Foliage Family Closure and Atlas Revision DSK Map

**Timestamp:** `2026-07-17T16-40-37-04-00`  
**Parent authority:** `prehistoric-rush-foliage-family-closure-atlas-revision-convergence-authority-domain`

## Existing composition

```txt
tree-archetype-catalog-kit
  -> primary foliage family and tree parameters

prehistoric-foliage-card-recipe-kit
  -> eight card families
  -> near/medium deterministic placements
  -> optional secondary families such as hanging-vine
  -> atlas revision prehistoric-foliage-cards-v2

prehistoric-vegetation-catalog-registration-kit
  -> createPrehistoricTreeFoliageInput()
  -> union primary and placement-referenced families
  -> reject unknown references
  -> register species, tree, foliage and object descriptors

browser + Worker runtime composition
  -> construct Object Vegetation
  -> register the same product catalog
  -> generate patches

Three.js foliage presentation
  -> create all eight atlas tiles
  -> allocate near/medium family batches
  -> render accepted cards
  -> publish lushVegetationFrameAck
```

## Current ownership

```txt
family catalog: prehistoric-foliage-card-recipes.js
placement generation: prehistoric-foliage-card-recipes.js
descriptor closure: prehistoric-vegetation-domain.js
catalog registration: prehistoric-vegetation-domain.js
Worker catalog construction: prehistoric-patch-worker.js
atlas construction: prehistoric-foliage-atlas.js
card batching and LOD: three-lush-foliage-layer.js
frame revision acknowledgement: three-patch-stream-lod-adapter.js
source proof: tests/foliage-card-system.mjs
```

## Implemented repair

```txt
primary-only descriptor family list
  -> replaced by primary + all generated placement families
  -> every family is resolved through the canonical catalog
  -> unknown secondary references fail registration
  -> broad-canopy now declares broadleaf-spray and hanging-vine
```

## Remaining gap

The source descriptor is self-contained, but no authority publishes a canonical closure digest and binds it to the main runtime, Worker runtime, patch generation, renderer atlas and visible frame. Atlas revision is reported independently by the Worker and renderer without a shared parity settlement or stale-generation rejection rule.

## Proposed DSK family

```txt
prehistoric-rush-foliage-family-closure-atlas-revision-convergence-authority-domain
├─ foliage-family-reference-manifest-kit
├─ placement-family-enumeration-kit
├─ descriptor-family-closure-kit
├─ missing-family-rejection-kit
├─ foliage-descriptor-digest-kit
├─ atlas-revision-manifest-kit
├─ atlas-revision-propagation-kit
├─ main-catalog-registration-result-kit
├─ worker-catalog-registration-result-kit
├─ worker-family-digest-echo-kit
├─ worker-atlas-revision-echo-kit
├─ main-worker-family-parity-settlement-kit
├─ patch-atlas-revision-binding-kit
├─ renderer-atlas-admission-kit
├─ stale-atlas-result-rejection-kit
├─ source-family-closure-fixture-kit
├─ browser-family-coverage-fixture-kit
├─ worker-family-coverage-fixture-kit
├─ artifact-pages-family-coverage-fixture-kit
└─ first-family-complete-foliage-frame-ack-kit
```

## Command/result flow

```txt
FoliageFamilyClosureAdmissionCommand
  -> FoliageFamilyClosureResult

AtlasRevisionAdmissionCommand
  -> AtlasRevisionAdmissionResult

WorkerFoliageCatalogAdmissionCommand
  -> WorkerFoliageCatalogResult

FoliageRealmParityCommand
  -> FoliageRealmParityResult

FoliageFrameCommitCommand
  -> FirstFamilyCompleteFoliageFrameAck
```

## Compatibility boundary

This audit proposes proof and admission surfaces only. Preserve the eight-family catalog, deterministic placements, atlas `v2`, patch schema, LOD behavior, rendering, collision and gameplay tuning.