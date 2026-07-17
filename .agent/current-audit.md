# PrehistoricRush Current Audit

**Timestamp:** `2026-07-17T02-02-06-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Reviewed runtime head:** `55118e0c874697b767db69575687dfa1390958f9`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Summary

PrehistoricRush now composes the Nexus Engine Object Vegetation domain in tree asset preparation, the game host, and the patch Worker. Patch generation delegates ecological species selection and deterministic variation to the domain.

The semantic catalog is not yet one authoritative generation. The three runtime contexts register independent catalogs. The asset wrapper derives semantic fidelity profiles after the base asset runtime is created, but the provider still registers and builds from the older local fidelity profile. Package generation omits semantic descriptor hashes, Worker readiness omits its catalog digest, and the renderer proves only the package generation.

## Intent

Bind species, tree, foliage, object, fidelity profile, package, cache, Worker, patch, and frame identities into one admitted `VegetationGeneration`.

## Checklist

- [x] Inspect the full Publish inventory and central ledger state.
- [x] Select only the newest runtime-ahead repository.
- [x] Review ten commits and ten changed files.
- [x] Inspect vegetation catalog registration and services.
- [x] Inspect main-thread and Worker patch generation.
- [x] Inspect asset preparation and portable package generation.
- [x] Inspect patch cache identity and startup frame receipt.
- [x] Preserve the complete 90-surface inventory.
- [ ] Register and use semantic fidelity profiles for package builds.
- [ ] Admit one composite generation in host and Worker.
- [ ] Prove species/package/cache/patch/frame convergence.

## Complete interaction loop

```txt
menu/game preparation
  -> create base Assets/Object/Shape/Capture/Fidelity runtime
  -> install Core Vegetation domain
  -> register semantic species/tree/foliage/object catalog
  -> derive semantic fidelity profiles
  -> build or load packages through the local profile provider

host
  -> create independent vegetation runtime and catalog
  -> compute species-only digest
  -> bind digest and package digest into patch-cache settings

Worker
  -> import Nexus Engine
  -> create independent vegetation runtime and catalog
  -> return domain path only
  -> generate patches with domain selection and variation

frame
  -> activate patch
  -> map species typeIndex to package
  -> render exact package generation
  -> record catalog digest separately
```

## Domains in use

```txt
browser routes, module cache, DOM, input, lifecycle, RAF, storage and IndexedDB
Nexus Engine runtime, scene, spatial, creature, character, player, physics, simulation, motion, camera, animation, graphics, UI and presentation
Core Assets, Startup, Object, Shape, Capture and Fidelity
Core Vegetation, Vegetation Ecology, Vegetation Tree, Vegetation Foliage and Vegetation Object Bridge
NexusEngine-Kits seed, creature, instance batch, patch streaming and camera follow
PrehistoricRush run, route, terrain, patch, tree, grass, pickup, player, pose, pause and outcome
semantic catalog registration, ecological placement, deterministic variation, fidelity packages and generation evidence
Three.js, Rapier, Worker execution, tests, Pages and audit governance
```

## Current gap

```txt
one immutable VegetationGeneration: absent
semantic profile registration into Object Fidelity: absent
semantic descriptor hashes in package generation: absent
Worker catalog digest handshake: absent
patch result generation digest: absent
speciesId-to-package generation table: absent
typeIndex mismatch rejection: absent
stale semantic cache retirement: absent
VegetationGenerationAdmissionResult: absent
FirstDomainBoundAssetAck: absent
FirstDomainBoundPatchAck: absent
FirstDomainBoundTreeFrameAck: absent
```

## Required authority

`prehistoric-rush-semantic-vegetation-fidelity-generation-authority-domain`

## Boundary

Documentation only. Runtime, packages, caches, Worker protocol, gameplay, rendering, tests, workflows, and deployment were not changed or executed by this audit.
