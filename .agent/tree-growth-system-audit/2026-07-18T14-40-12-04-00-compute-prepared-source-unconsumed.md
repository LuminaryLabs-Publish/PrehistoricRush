# Tree Growth System Audit: Compute-Prepared Source Unconsumed

**Timestamp:** `2026-07-18T14-40-12-04-00`

## New implemented surfaces

### `core-compute-domain`

Offers buffer, kernel and graph registration; deterministic dependency ordering; provider dispatch; normalized execution results; provider lifecycle; snapshots and reset.

### `prehistoric-tree-growth-compute-provider-kit`

Uses the Tree-domain natural growth algorithm to create deterministic plans, validates them and packs:

- branch records;
- foliage cluster records;
- foliage shading records.

### `prehistoric-tree-growth-plan-preparation-kit`

For each archetype it registers compute descriptors, executes near and medium requests, validates both plans and publishes immutable plans, metrics, buffers and revisions.

### `prehistoric-natural-tree-geometry-adapter-kit`

Builds a Three.js source object from growth-plan roots, wood segments, foliage clusters and bounds.

## Source-derived preparation scale

```txt
archetypes: 12
buffers per archetype: 4
kernels per archetype: 3
graphs per archetype: 1
executions per archetype: 2

total descriptors/executions:
  buffers: 48
  kernels: 36
  graphs: 12
  near/medium executions: 24
```

Each graph permits up to 320 segments. Foliage capacity is at least 96 clusters and may increase to four times the archetype hero-card count. These are descriptor capacities, not observed output counts or measured cost.

## Confirmed data path

```txt
Tree descriptor + Foliage descriptor
  -> createGrowthComputeDescriptors
  -> Core Compute provider
  -> createGrowthPlan
  -> validateGrowthPlan
  -> packed buffers
  -> runtime.growthPlans
  -> growth revision in asset metadata
```

## Confirmed discontinuity

```txt
runtime.growthPlans
  -/-> active fidelity provider source subject

active provider source subject
  -> createPrehistoricTreeObject(THREE, archetype)
```

The reviewed provider file has no growth-plan selection and no call to `createPrehistoricNaturalTreeObject`. The new geometry module was added in the four-commit delta, but no provider integration file changed in that delta.

## Test gap

`package.json` does not include the new growth-compute file or natural-tree-geometry file in `test:syntax`. The package test command also contains no natural-growth plan, source binding, capture digest or browser fixture.

## Required next implementation

The smallest targeted change is to pass the accepted growth plan into the fidelity provider and make `buildTree()` construct the capture subject through `createPrehistoricNaturalTreeObject()`. The resulting portable package must record the plan digest and reject a source/capture/package mismatch.

## Claim boundary

This audit does not claim the tree is visually wrong, that startup is slow, or that the new module is unreachable from every possible external caller. It confirms only that the reviewed product provider path remains bound to legacy source geometry.