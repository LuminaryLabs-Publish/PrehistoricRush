# Interaction Audit: Tree Growth Command/Result Map

**Timestamp:** `2026-07-18T14-40-12-04-00`

## Current calls

```txt
createPrehistoricTreeFidelityAssetRuntime()
  -> install Core Vegetation
  -> install Core Compute
  -> registerPrehistoricVegetationCatalog()
  -> preparePrehistoricTreeGrowthPlans()

preparePrehistoricTreeGrowthPlans()
  -> createGrowthComputeDescriptors()
  -> coreCompute.registerBuffer/registerKernel/registerGraph
  -> coreCompute.executeGraph(near)
  -> coreCompute.executeGraph(medium)
  -> validatePrehistoricTreeGrowthPlans()

Assets provider load()
  -> buildTree()
  -> createPrehistoricTreeObject()
  -> Object Shape/Fidelity/Capture
```

## Proposed command/result path

```txt
TreeGrowthGenerationAdmissionCommand
  input: engine revision, catalog revision, provider revision, archetype set
  result: accepted generation id and archetype manifest

TreeGrowthComputeExecutionCommand
  input: generation id, archetype, quality, descriptor ids, seed
  result: validated plan, plan digest, metrics, packed buffers

NaturalTreeSourceGeometryCommand
  input: accepted plan digest, archetype, quality
  result: source object, portable geometry, bounds and resource receipt

TreeGrowthFidelityBindingCommand
  input: source result, Shape profile, Capture request, Fidelity profile
  result: near/medium/far/horizon forms bound to one growth digest

TreeGrowthProjectionCommitCommand
  input: package, hydrated images and presented form
  result: TreeGrowthFrameDigest and FirstGrowthBoundFrameAck
```

## Rejection states

```txt
missing-archetype
missing-tree-descriptor
missing-foliage-descriptor
invalid-compute-graph
provider-unavailable
plan-validation-failed
source-geometry-failed
source-plan-mismatch
capture-plan-mismatch
stale-growth-generation
package-plan-mismatch
presentation-plan-mismatch
```

## Required rule

A successful asset load must return a package whose generation receipt includes the exact accepted growth-plan digest used to construct its source object.