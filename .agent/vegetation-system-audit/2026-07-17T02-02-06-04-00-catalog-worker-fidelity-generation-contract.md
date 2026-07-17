# Catalog / Worker / Fidelity Generation Contract

**Timestamp:** `2026-07-17T02-02-06-04-00`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Current catalog composition

Each archetype is converted into:

```txt
VegetationSpeciesDescriptor
TreeStructureDescriptor
FoliageDescriptor
CoreObjectDescriptor
semantic Object Fidelity profile
```

The descriptors expose ecology, deterministic variation, parts, bounds, materials, collision references, fidelity references, foliage cards, wind response, structure, capture policy, and metadata.

## Current generation split

```txt
asset catalog generation
  -> menu/game preparation runtime
  -> semantic profiles derived
  -> local legacy profile registered for package build

game catalog generation
  -> host placement API
  -> species-only digest

Worker catalog generation
  -> Worker placement API
  -> no digest returned

package generation
  -> object/form/build hashes
  -> no semantic descriptor hashes
```

## Required immutable generation

```txt
VegetationGeneration
  id
  digest
  runtimeModuleGeneration
  archetypeSourceRevision
  speciesDescriptors[] { id, contentHash }
  treeStructures[] { id, speciesId, contentHash }
  foliageDescriptors[] { id, speciesId, contentHash }
  objectDescriptors[] { id, speciesId, contentHash }
  fidelityProfiles[] { id, speciesId, contentHash }
  fidelityPackages[] { id, archetypeId, generationId, contentHash }
  speciesPackageBindings[]
  cacheRevision
  workerRevision
```

## Adoption rules

1. Build the catalog once per accepted runtime generation.
2. Register semantic profiles into Object Fidelity before any package request.
3. Remove or mechanically derive the duplicated local fidelity profile.
4. Include semantic descriptor hashes in package generation identity.
5. Include the composite generation in IndexedDB cache keys.
6. Send the expected digest to the Worker during initialization.
7. Require the Worker to return the same digest before requests are admitted.
8. Add the generation digest to every patch result.
9. Resolve render packages by species binding; treat typeIndex as an optimization only.
10. Require a matching generation in asset, patch, and frame acknowledgements.

## Compatibility constraints

Preserve deterministic seeds, current species distribution, tree count, route exclusions, terrain topology, collider dimensions, four fidelity forms, transition settings, camera behavior, and score logic while adding generation authority.
