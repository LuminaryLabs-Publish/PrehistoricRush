# Architecture Audit: Tree Fidelity Asset Adoption DSK Map

**Timestamp:** `2026-07-16T12-02-38-04-00`  
**Status:** `tree-fidelity-asset-adoption-projection-authority-audited`

## Summary

Core Assets and Core Startup now prepare a portable tree bundle, but no domain owns the transition from `AssetReceipt` to accepted patch and renderer state.

## Plan ledger

**Goal:** assign preparation, adoption, projection and retirement to explicit DSK boundaries.

- [x] Map the implemented asset graph.
- [x] Map the current patch/render graph.
- [x] Locate the missing authority between them.
- [x] Define command, result and acknowledgement surfaces.
- [ ] Implement the authority.

## Implemented graph

```txt
Core Assets
  -> IndexedDB cache adapter
  -> prehistoric tree provider
  -> five package assets
  -> manifest with package dependencies
  -> tree-fidelity bundle

Core Startup
  -> launch
  -> required tree-fidelity preparation
  -> progress projection
  -> preparation receipt

Three capture provider
  -> temporary archetype object
  -> around-subject views
  -> color and opacity observations
  -> 256px atlas frames
  -> portable package

Current game
  -> separate numeric treeTypes authority
  -> patch tree typeIndex
  -> cylinder trunk instances
  -> icosahedron crown instances
```

## Missing DSK boundary

```txt
AssetReceipt
  -X-> accepted TreeFidelityGeneration
  -X-> patch archetype asset ID
  -X-> projected-size form choice
  -X-> mesh/impostor materialization
  -X-> visible-frame acknowledgement
```

## Proposed domain

`prehistoric-rush-tree-fidelity-asset-adoption-projection-authority-domain`

### Preparation subdomain

```txt
tree-fidelity-preparation-command-kit
tree-fidelity-package-validation-kit
tree-fidelity-package-digest-kit
tree-fidelity-manifest-resolution-kit
tree-fidelity-preparation-result-kit
```

Services:

```txt
bind provider/cache/bundle/request generations
validate package schema and dependency completeness
verify archetype IDs, form descriptors and frame counts
publish immutable preparation result and digest
```

### Adoption subdomain

```txt
tree-archetype-single-source-kit
tree-package-patch-binding-kit
tree-fidelity-adoption-command-kit
tree-fidelity-adoption-result-kit
tree-fidelity-stale-revision-rejection-kit
```

Services:

```txt
remove duplicate hard-coded archetype authority
bind patch tree records to package asset IDs
admit one package generation into one game generation
reject stale, partial and mismatched revisions
```

### Projection subdomain

```txt
tree-render-form-selection-kit
tree-mesh-recipe-materialization-kit
tree-impostor-atlas-materialization-kit
tree-fidelity-transition-policy-kit
tree-fidelity-render-generation-kit
first-tree-fidelity-bound-frame-ack-kit
```

Services:

```txt
select near, medium, far or horizon by projected size
materialize mesh recipes and impostor resources
apply dither crossfade and hysteresis
bind renderer resources to adopted package digest
acknowledge the first matching presented frame
```

### Lifecycle and proof subdomain

```txt
tree-fidelity-route-retirement-kit
tree-fidelity-diagnostics-kit
tree-fidelity-source-build-pages-parity-fixture-kit
```

Services:

```txt
retire menu/game asset runtimes and capture renderers
cancel outstanding requests
release GPU resources and cache handles
report preparation/adoption/projection revisions
prove source, build and deployed parity
```

## Ownership rule

Asset providers prepare portable data. Patch generation consumes accepted archetype identities. Rendering consumes adopted package forms. No browser route, global variable or renderer callback may silently become semantic adoption authority.