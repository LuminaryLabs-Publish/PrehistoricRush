# Architecture Audit: Natural Tree Growth Compute/Capture DSK Map

**Timestamp:** `2026-07-18T14-40-12-04-00`

## Implemented domain chain

```txt
n:assets
  -> tree-fidelity package, manifest and bundle identity

n:compute
  -> core-compute-domain
  -> buffers, kernels, graphs, provider dispatch, snapshots and reset

n:object:vegetation
  -> species and catalog ownership
  -> n:object:vegetation:tree
       -> tree registry
       -> natural-growth plan creation
       -> growth validation
       -> growth compute descriptors
       -> Shape/Fidelity/Capture recipes
  -> n:object:vegetation:foliage
       -> card families, cluster descriptors and wind/shading intent

product preparation
  -> prehistoric-tree-growth-compute-provider-kit
  -> prehistoric-tree-growth-plan-preparation-kit
  -> immutable near/medium growthPlans publication

render/capture preparation
  -> prehistoric-natural-tree-geometry-adapter-kit
  -> roots, wood cylinders, bark vertex colors, foliage cards and bounds proxy

active fidelity path
  -> tree-fidelity-asset-provider-kit
  -> legacy createPrehistoricTreeObject source subject
  -> n:object:shape
  -> n:capture
  -> n:object:fidelity
  -> portable tree-fidelity package
```

## Service ownership

| Owner | Services |
|---|---|
| `core-compute-domain` | buffer/kernel/graph registration, execution plans, provider lifecycle, dispatch, execution results, snapshots, reset |
| `vegetation-tree-domain-kit` | natural growth, validation, growth compute descriptor creation, tree Shape/Fidelity/Capture recipes |
| `prehistoric-tree-growth-compute-provider-kit` | deterministic plan creation and branch/foliage/shading output packing |
| `prehistoric-tree-growth-plan-preparation-kit` | per-archetype descriptor registration, near/medium execution, validation, metrics and publication |
| `prehistoric-natural-tree-geometry-adapter-kit` | growth-plan-driven Three.js source object creation |
| `tree-fidelity-asset-provider-kit` | Core Object registration, portable Shape source, Object Fidelity build, captures and package output |

## Boundary mismatch

```txt
accepted growth plan generation
  -> runtime.growthPlans[archetype].near/medium

active provider buildTree
  -> createPrehistoricTreeObject(THREE, archetype)
  -> portableGeometryFromObject(legacy object)
```

The architecture has two source-geometry authorities. The new natural-growth source builder exists, while the active provider remains wired to the older archetype builder.

## Proposed parent authority

`prehistoric-rush-natural-tree-growth-compute-capture-fidelity-convergence-authority-domain`

```txt
TreeGrowthGenerationAdmissionCommand
  -> TreeGrowthGenerationResult
TreeGrowthComputeExecutionCommand
  -> TreeGrowthComputeExecutionResult
NaturalTreeSourceGeometryCommand
  -> NaturalTreeSourceGeometryResult
TreeGrowthFidelityBindingCommand
  -> TreeGrowthFidelityBindingResult
TreeGrowthProjectionCommitCommand
  -> TreeGrowthFrameDigest
  -> FirstGrowthBoundFrameAck
```

## Required invariant

A tree fidelity package must not claim a growth revision unless the source object, portable Shape geometry, capture subject, generated forms and presented tree all resolve to the same accepted growth-plan digest.