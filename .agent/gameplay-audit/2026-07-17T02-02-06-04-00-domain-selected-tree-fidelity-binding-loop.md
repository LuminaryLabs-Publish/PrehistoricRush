# Domain-Selected Tree / Fidelity Binding Loop

**Timestamp:** `2026-07-17T02-02-06-04-00`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Gameplay loop

```txt
player advances
  -> patch controller requests nearby cells
  -> main thread or Worker samples terrain and route context
  -> vegetation domain scores ecological suitability
  -> vegetation domain selects one species deterministically
  -> vegetation domain creates deterministic scale, lean, sink, tint and lifecycle values
  -> patch emits tree matrices, bounds, collider and metadata
  -> renderer selects a fidelity package through typeIndex
  -> collision and pickups feed the next simulation frame
```

## Implemented improvement

Species choice and variation are no longer hardcoded inside the patch generator. The generator consumes the renderer-neutral Vegetation placement API, and both main-thread and Worker paths install the same domain composition.

## Remaining gameplay risk

The run trusts three separately created catalogs and a type-index bridge. No admitted generation proves that a patch generated in the Worker and a package loaded from IndexedDB correspond to the same species/tree/foliage contract.

Potential consequences after a future catalog revision include:

```txt
stale package used for a revised species
old cached package after tree structure or foliage change
Worker species ordering differing from host ordering
typeIndex pointing to the wrong visual package
collider/ground-sink metadata diverging from package bounds
replay/cache identity omitting a semantic subdescriptor revision
```

## Required gameplay settlement

```txt
PatchVegetationCommand
  -> require VegetationGeneration digest
  -> select species and create instance
  -> emit speciesId plus descriptor hashes
  -> publish PatchVegetationResult

PatchActivationCommand
  -> validate patch generation against host generation
  -> validate species/package binding
  -> activate gameplay, collision and render state together
  -> publish FirstDomainBoundPatchAck
```

## Boundary

No current run divergence was reproduced. This audit documents the missing admission contract and keeps terrain, route, collision, and rendering ownership unchanged.
