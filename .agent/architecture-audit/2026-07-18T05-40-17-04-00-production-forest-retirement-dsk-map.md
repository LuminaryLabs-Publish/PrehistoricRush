# Production Forest Retirement DSK Map

**Timestamp:** `2026-07-18T05-40-17-04-00`

## Intent

Separate implemented production presentation from the proposed authority needed to retire superseded vegetation work and prove one accepted generation.

## Implemented DSK/domain flow

```txt
Nexus Object Vegetation / Ecology / Tree / Foliage
  -> Prehistoric vegetation catalog and placement services
  -> prehistoric-patch-generator
  -> seeded-world-patch-controller-kit
  -> Worker or deferred synchronous executor
  -> three-patch-stream-lod-adapter
       -> three-terrain-lod-layer
       -> three-tree-fidelity-layer
       -> three-lush-foliage-layer
       -> three-ground-cover-layer
       -> three-production-forest-layer
       -> three-patch-stream-adapter
  -> Three.js frame and startup receipt
```

## Production forest services

```txt
patch activation and record caching
procedural bark shell, roots, primary and secondary branches
foliage-family canopy groups and wind attributes
six grass atlas variants
four ground-surface detail variants
distance culling
instanced matrix and attribute writes
capacity clipping and overflow counter
patch release
resource disposal
legacy grass visibility suppression
```

## Ownership conflict

```txt
three-production-forest-layer
  owns visible production grass
  hides legacy grass meshes

three-patch-stream-adapter
  still constructs legacy grass meshes and batch controllers
  still replaces/releases legacy grass patch cells
  still flushes legacy grass matrices
  still updates legacy grass shader uniforms each frame
```

The new host therefore owns presentation, but not exclusive work/resource authority.

## Proposed DSK hierarchy

```txt
prehistoric-rush-production-forest-legacy-vegetation-work-retirement-authority-domain
├─ production-forest-generation-manifest-kit
├─ vegetation-presentation-authority-admission-kit
├─ legacy-vegetation-host-discovery-kit
├─ legacy-grass-retirement-command-kit
├─ legacy-grass-retirement-result-kit
├─ patch-membership-work-routing-kit
├─ production-patch-record-cache-kit
├─ production-forest-capacity-policy-kit
├─ production-forest-overflow-settlement-kit
├─ production-forest-cull-budget-kit
├─ production-forest-buffer-write-budget-kit
├─ production-forest-material-revision-kit
├─ production-forest-resource-ownership-kit
├─ production-forest-disposal-settlement-kit
├─ production-forest-frame-digest-kit
├─ first-production-forest-bound-frame-ack-kit
├─ production-forest-source-fixture-kit
├─ legacy-work-retirement-fixture-kit
├─ production-forest-browser-fixture-kit
└─ production-forest-artifact-pages-fixture-kit
```

## Command/result boundary

```txt
ProductionForestGenerationAdmissionCommand
  -> ProductionForestGenerationResult

VegetationPresentationAuthorityCommand
  -> VegetationPresentationAuthorityResult

LegacyVegetationRetirementCommand
  -> LegacyVegetationRetirementResult

ProductionForestCapacitySettlementCommand
  -> ProductionForestCapacityResult

ProductionForestProjectionCommitCommand
  -> ProductionForestFrameDigest
  -> FirstProductionForestBoundFrameAck
```

## Compatibility boundary

Do not remove terrain, tree collision, pickups, patch ownership or required fallback capability. Retire only the render/work surfaces superseded by an admitted production presentation authority.