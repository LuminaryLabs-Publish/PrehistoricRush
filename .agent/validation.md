# PrehistoricRush Validation

**Audit timestamp:** `2026-07-18T14-40-12-04-00`  
**Scope:** organization selection, full kit/service inventory, natural tree growth compute preparation, capture/fidelity source binding and executable-proof boundaries

## Summary

Source inspection confirms that the tree-fidelity runtime installs Core Compute, prepares deterministic near/medium natural-growth plans for every archetype, validates them, packs branch/foliage/shading arrays, publishes them on `runtime.growthPlans` and includes the growth revision in asset versions and metadata.

Source inspection also confirms that the active fidelity provider still calls `createPrehistoricTreeObject(THREE, archetype)`. The reviewed provider does not select `runtime.growthPlans` and does not call the new `createPrehistoricNaturalTreeObject()` builder.

## Confirmed by inspection

```txt
Publish repositories observed: 11
eligible after Cavalry exclusion: 10
selected: PrehistoricRush
selection reason: only runtime-ahead eligible repository
prior documented repo-local head: b734e087e4d70315285fc3ef29b1788c487945b6
reviewed runtime head: 3c8175991939632cc9e4029f4554fbebf360f9f5
ahead by: 4

Core Compute installation: present
natural growth compute provider: present
tree archetypes prepared: 12
near/medium executions: 24
growth validation: present
packed branch/foliage/shading outputs: present
runtime.growthPlans: present
growth revision package metadata: present
natural growth Three.js source builder: present
active provider growth-plan consumption: not observed
active provider natural builder call: not observed
active provider legacy source call: present
```

## Source inspected

```txt
package.json
src/shared/tree-archetype-catalog.js
src/shared/prehistoric-tree-growth-compute.js
src/render/prehistoric-natural-tree-geometry.js
src/shared/prehistoric-tree-fidelity-runtime.js
src/shared/vegetation-tree-fidelity-provider.js
NexusEngine core-compute-domain
NexusEngine core-compute-kit
NexusEngine vegetation Tree domain natural-growth/compute services
current .agent tracker and kit registry
central PrehistoricRush ledger
four-commit compare from b734e087... to 3c817599...
```

## Source-derived preparation scale

```txt
archetypes: 12
buffers per archetype: 4
kernels per archetype: 3
graphs per archetype: 1
executions per archetype: 2

total buffers: 48
total kernels: 36
total graphs: 12
total near/medium executions: 24
maximum segments per graph: 320
minimum foliage capacity per graph: 96 clusters
```

These are configured descriptor counts and capacities, not measured output counts, duration, memory or GPU cost.

## Required executable fixtures

```txt
npm test
syntax/import checks for both new modules
all-archetype deterministic growth plans
growth-plan validation and digest
packed output shape and capacity
natural source object construction
portable geometry bounds/attributes
provider growth-plan consumption
source-plan mismatch rejection
near/medium Shape binding
far/horizon capture binding
fidelity package growth digest
stale generation rejection
resource retirement
browser visual comparison
built-output smoke
Pages-origin smoke
FirstGrowthBoundFrameAck
```

## Change scope

```txt
documentation changed by audit: yes
runtime JavaScript changed by audit: no
tests and package scripts changed by audit: no
Worker behavior changed by audit: no
gameplay, rendering and physics changed by audit: no
workflows and deployment changed by audit: no
branch created: no
pull request created: no

source inspection performed: yes
npm test run by audit: no
natural-growth fixture run: no
browser fixture run: no
artifact smoke run: no
Pages smoke run: no
```

## Execution boundary

Direct checkout could not resolve `github.com`. Validation therefore used the GitHub connector and source inspection. No Node command, browser fixture, capture render, profiler, artifact download or Pages-origin smoke was executed.

The package test script does not list the two new source modules in `test:syntax` and contains no natural-growth source-binding fixture.

## Claim boundary

Natural-growth computation, validation, packing, revision metadata and the new geometry builder are documented as implemented. Their active fidelity-provider consumption, visible correctness, performance, resource lifetime, browser parity, artifact parity, Pages parity and production readiness are not claimed.