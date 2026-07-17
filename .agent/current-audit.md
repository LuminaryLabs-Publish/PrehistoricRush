# PrehistoricRush Current Audit

**Timestamp:** `2026-07-17T14-40-21-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Reviewed pre-audit head:** `47788818edec7d49753f942a69ef392a8b092037`  
**Reviewed Nexus Engine revision:** `d41992636de2752f1ad9047b80701e6313f19b87`  
**Status:** `pinned-vegetation-provider-admission-browser-worker-parity-authority-audited`

## Summary

The current runtime pin adopts a Nexus Engine fix required to construct the Foliage subdomain. The prior provider exposed `createPlacementRecipe` through an invalid identifier; the pinned replacement binds the public service to `createFoliagePlacementRecipe`.

PrehistoricRush imports the provider in both `src/game-runtime-lod.js` and `src/workers/prehistoric-patch-worker.js`, and both paths call `createPrehistoricVegetationRuntime()`. The existing Node import test checks only local product exports and does not execute the pinned provider graph.

## Intent

Bind provider revision, service-construction proof, catalog digest, browser realm, Worker realm, patch generation and first visible vegetation frame to one startup generation.

## Checklist

- [x] Inspect organization and ledger selection state.
- [x] Select only PrehistoricRush as the sole runtime-ahead repository.
- [x] Inspect the product pin and Nexus Engine repair.
- [x] Trace main and Worker Vegetation construction.
- [x] Preserve all 97 implemented surfaces and offered services.
- [x] Define 20 provider-admission surfaces.
- [ ] Implement provider identity and Foliage service probes.
- [ ] Implement Worker parity and stale-result settlement.
- [ ] Execute source, browser, artifact and Pages fixtures.

## Interaction loop

```txt
browser and Worker import the same pinned Nexus provider
  -> construct Core Object Vegetation
  -> register product tree and ground-cover catalogs
  -> create deterministic patch generators
  -> generate and activate streamed patches
  -> render trees, foliage cards and ground cover
```

## Domains in use

```txt
browser module delivery, Worker, lifecycle and startup
Nexus Engine Object Vegetation, Ecology, Tree, Foliage and Object Bridge
PrehistoricRush catalog, generator, patch streaming and gameplay
Three.js vegetation presentation and Rapier collision
source fixtures, artifact, Pages, audit governance and central tracking
```

## Current gap

```txt
exact provider identity admission: absent
Foliage createPlacementRecipe construction probe: absent
main provider-ready result: absent
Worker provider revision echo: absent
main/Worker catalog parity result: absent
provider generation on patch results: absent
stale Worker provider rejection: absent
FirstVegetationRuntimeReadyAck: absent
FirstProviderBoundVegetationFrameAck: absent
live provider source/browser fixture: absent
```

## Required authority

`prehistoric-rush-pinned-vegetation-provider-admission-browser-worker-parity-authority-domain`

## Retained gaps

Pause arbitration and parent render-host generation retirement remain proposed and unimplemented.

## Boundary

Documentation only. The implemented pin was not changed. Tests, browser fixtures and deployment validation were not executed.