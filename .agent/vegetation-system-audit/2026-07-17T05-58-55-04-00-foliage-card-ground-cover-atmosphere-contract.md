# Foliage Card, Ground Cover and Atmosphere Contract

**Timestamp:** `2026-07-17T05-58-55-04-00`

## Source inventory

### Card families

```txt
broadleaf-spray
palm-frond
fern-frond
needle-spray
ginkgo-fan
hanging-vine
bush-cluster
horsetail-whorl
```

Each family currently provides an atlas cell, alpha cutoff, roughness, translucency, size range and wind defaults.

### Ground-cover archetypes

```txt
fern-floor-clump
cycad-understory-clump
broadleaf-floor-clump
juvenile-palm-clump
hanging-vine-patch
horsetail-marsh-clump
```

Each archetype provides size, crossed-plane count, colors, distribution weight, ecology and variation ranges.

### Atmosphere state

```txt
background
FogExp2 color/density
renderer exposure
hemisphere sky/ground/intensity
sun color/intensity/shadow map/shadow camera/normal bias
one fill directional light
one canopy-bounce ambient light
```

## Contract gaps

```txt
atlas image and material identity: absent
catalog schema/version result: absent
Map export immutability: absent
instance-specific tree-card seed: absent
far/low card-count policy: absent
ground-cover patch adoption: absent
route and slope mask settlement: absent
Worker transfer schema: absent
GPU batch ownership: absent
atmosphere predecessor snapshot: absent
apply-once/idempotency: absent
duplicate-light prevention: absent
quality-aware shadow budget: absent
scene replacement/disposal result: absent
matching-frame acknowledgement: absent
```

## Required catalog contract

```txt
FoliageCatalogGeneration
  atlasRevision
  atlasColumns
  atlasRows
  familyDigest
  groundCoverDigest
  sourceRevision

FoliageFamilyDescriptor
  id
  atlasCell
  material policy
  size bounds
  wind policy

GroundCoverDescriptor
  id
  familyId
  geometry/card policy
  ecology policy
  variation policy
  route/slope/collision policy
```

## Required placement identity

```txt
PatchId
PatchGeneration
SpeciesId
TreeInstanceId or GroundCoverClusterId
LocalCardIndex
QualityTier
CatalogGeneration
SeedStreamRevision
```

The current tree-card recipe derives local placements from archetype, quality and index. That is suitable as an archetype-local recipe, but global patch instances need an outer instance identity before publication.

## Quality budget

```txt
near: authored hero-card count under a hard per-tree and per-patch cap
medium: reduced count under a hard per-patch cap
far: dedicated low-card or impostor policy; never implicit near count
culled: zero cards and released batch membership
```

## Atmosphere lifecycle

```txt
admit scene/renderer generation
  -> snapshot predecessor state
  -> find or create owned lights by stable IDs
  -> apply quality-aware settings
  -> publish atmosphere generation and digest

replace/retire
  -> reject stale commands
  -> remove owned lights exactly once
  -> restore or supersede predecessor state
  -> release references
  -> publish retirement result
```

## Validation matrix

```txt
catalog schema and atlas-cell uniqueness
family lookup determinism
instance-specific placement determinism
near/medium/far budget bounds
ground-cover ecology and route exclusion
main-thread/Worker parity
atlas decode/material binding
apply-twice atmosphere idempotency
scene replacement and renderer disposal
quality-tier shadow allocation
first accepted patch and first accepted frame
source/artifact/Pages digest parity
```

## Boundary

These contracts are not implemented by this documentation pass.
