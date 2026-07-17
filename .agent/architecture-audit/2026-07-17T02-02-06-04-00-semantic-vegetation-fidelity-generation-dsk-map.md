# Semantic Vegetation / Fidelity Generation DSK Map

**Timestamp:** `2026-07-17T02-02-06-04-00`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Current DSK graph

```txt
n:object
└─ n:object:vegetation
   ├─ n:object:vegetation:ecology
   ├─ n:object:vegetation:tree
   ├─ n:object:vegetation:foliage
   └─ n:object:vegetation:object-bridge

PrehistoricRush semantic catalog
  -> ten vegetation species descriptors
  -> ten tree structure descriptors
  -> ten foliage descriptors
  -> ten Core Object descriptors

asset preparation runtime
  -> Core Assets
  -> Core Startup when required
  -> Core Object
  -> Object Shape
  -> Core Capture
  -> Object Fidelity
  -> Core Vegetation domain installed afterward
  -> semantic profiles derived but not registered for package builds

game vegetation runtime
  -> independent Core Object/Vegetation engine
  -> host species digest
  -> main-thread placement API

patch Worker vegetation runtime
  -> independent Nexus Engine import
  -> independent Core Object/Vegetation engine
  -> independent catalog
  -> no generation handshake
```

## Current ownership

| Surface | Current owner | Service |
|---|---|---|
| Archetype content | `tree-archetype-catalog.js` | shape, height, palette, ecology and distribution source |
| Species descriptors | Core Vegetation | registry, ecology preferences, deterministic variation and lifecycle |
| Ecology scoring | Vegetation Ecology | suitability and deterministic selection |
| Tree structures | Vegetation Tree | structure, shape recipe, fidelity profile and capture recipe derivation |
| Foliage | Vegetation Foliage | cards, density, wind, translucency, color and texture intent |
| Core Object mapping | Vegetation Object Bridge | species/instance conversion and registration |
| Patch placement | `prehistoric-patch-generator.js` | terrain sampling, route exclusion, spawn budget and emitted matrices |
| Portable fidelity packages | legacy local fidelity profile/provider | mesh/capture forms, package generation and cache values |
| Patch Worker catalog | Worker-local vegetation runtime | independent generation without digest publication |
| Tree rendering | Three tree fidelity layer | package forms, transitions and exact package-frame acknowledgement |

## Boundary failure

The DSK graph now owns semantic species, tree, foliage, ecology, and object descriptors, but Object Fidelity package construction still owns a duplicated local tree profile. There is no parent result that binds the semantic descriptor graph to the package, Worker, patch, cache, and frame generations.

## Required parent domain

`prehistoric-rush-semantic-vegetation-fidelity-generation-authority-domain`

```txt
VegetationGenerationAdmissionCommand
  -> catalog descriptor normalization
  -> semantic profile registration
  -> package generation binding
  -> cache generation binding
  -> main/Worker catalog equality
  -> patch request/result binding
  -> species/package table binding
  -> frame acknowledgement
  -> VegetationGenerationAdmissionResult
```

## Constraints

Do not move terrain sampling, route exclusions, spawn budgets, GPU allocation, physics resolution, or renderer implementation into Core Vegetation. The new authority coordinates revisions and evidence; it does not collapse domain boundaries.
