# Jungle Foliage and Atmosphere Runtime Adoption DSK Map

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Status:** `jungle-foliage-atmosphere-runtime-adoption-authority-audited`

## Intent

Bind the new foliage-card catalog and jungle-atmosphere helper into the existing Nexus Engine composition without creating a second vegetation, patch, or renderer authority.

## Current domain map

```txt
Core Assets / Startup
  -> tree packages, atlas images, preparation receipts

Core Vegetation
  -> species, ecology, tree and foliage descriptors
  -> deterministic instance envelopes
  -> Object Bridge descriptors

Prehistoric patch generation
  -> terrain, route exclusion, tree instances, grass, pickups, colliders
  -> main-thread and Worker execution

Tree Fidelity
  -> source objects, captures, packages, LOD/form transitions, exact frames

Three.js host
  -> patch activation, materials, instance batches, lights, fog, render submission

New unadopted modules
  -> prehistoric-foliage-card-recipe-kit
  -> lush-jungle-atmosphere-render-adapter
```

## New source services

### `prehistoric-foliage-card-recipe-kit`

```txt
FOLIAGE_ATLAS_REVISION
FOLIAGE_ATLAS_COLUMNS / FOLIAGE_ATLAS_ROWS
PREHISTORIC_FOLIAGE_CARD_FAMILIES
getPrehistoricFoliageCardFamily(id)
foliageFamilyIdForArchetype(archetype)
createTreeFoliageCardPlacements(archetype, quality)
PREHISTORIC_GROUND_COVER_ARCHETYPES
PREHISTORIC_GROUND_COVER_BY_ID
```

### `lush-jungle-atmosphere-render-adapter`

```txt
scene background assignment
FogExp2 construction
renderer exposure assignment
hemisphere light retuning
directional sun retuning
shadow-map and shadow-camera tuning
fill-light creation
ambient canopy-bounce creation
owned-reference return value
```

## Current authority break

```txt
source modules exist
  -> no accepted JunglePresentationGeneration
  -> no catalog registration result
  -> no patch/Worker adoption result
  -> no atlas/material binding result
  -> no scene mutation ownership
  -> no duplicate-light prevention
  -> no retirement result
  -> no first matching frame acknowledgement
```

## Required parent domain

`prehistoric-rush-jungle-foliage-atmosphere-runtime-adoption-authority-domain`

## DSK placement

```txt
parent authority
├─ foliage-catalog admission
├─ tree-card placement policy
├─ ground-cover ecology projection
├─ main-thread/Worker parity
├─ GPU card batching and atlas material binding
├─ atmosphere scene admission
├─ atmosphere idempotent application
├─ quality and shadow budgeting
├─ resource retirement
└─ frame commit and acknowledgement
```

## Ownership rules

- Core Vegetation remains semantic species and foliage authority.
- The patch controller remains patch lifecycle authority.
- Tree Fidelity remains package/form/frame authority.
- Core Graphics remains renderer-neutral presentation policy authority.
- Three.js remains GPU and scene-mutation provider.
- The new parent domain coordinates generations and results; it does not duplicate those systems.
- Atmosphere application must be apply-once per scene/renderer generation and retire owned lights/resources exactly once.
- Foliage placements must include tree-instance identity, not only archetype and quality identity, before entering global patch payloads.

## Proposed surfaces

```txt
jungle-presentation-generation-kit
foliage-atlas-revision-admission-kit
foliage-card-family-catalog-kit
ground-cover-catalog-kit
foliage-catalog-immutability-validation-kit
tree-card-instance-seed-kit
tree-card-placement-budget-kit
ground-cover-ecology-selection-kit
foliage-main-thread-projection-kit
foliage-worker-projection-kit
foliage-main-worker-parity-kit
foliage-card-instance-batch-kit
foliage-atlas-material-binding-kit
jungle-atmosphere-scene-admission-kit
jungle-atmosphere-idempotent-apply-kit
jungle-atmosphere-quality-budget-kit
jungle-presentation-resource-retirement-kit
jungle-presentation-projection-result-kit
first-jungle-patch-ack-kit
first-jungle-presentation-frame-ack-kit
```

## Boundary

This audit maps adoption. It does not claim the new modules currently participate in production composition or that their visual output has been rendered.
