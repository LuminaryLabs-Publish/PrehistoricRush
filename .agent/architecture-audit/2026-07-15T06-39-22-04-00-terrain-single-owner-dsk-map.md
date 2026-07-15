# Architecture Audit: Terrain Single-Owner DSK Map

**Timestamp:** `2026-07-15T06-39-22-04-00`

## Summary

The active composition has one intended terrain authority and one retained compatibility terrain owner. The base adapter bundles terrain presentation with world-content services, forcing the LOD wrapper to create and then hide legacy terrain.

## Plan ledger

**Goal:** define a domain split that preserves existing services while admitting exactly one terrain presentation provider.

- [x] Map current base and LOD adapter ownership.
- [x] Separate terrain presentation from patch-world content conceptually.
- [x] Define commands, results and retirement receipts.
- [ ] Implement the split later.

## Current domain map

```txt
n:prehistoric-rush
  -> run, route, player, score, outcomes, surface and pose

n:seeded-world-patch-controller
  -> desired patches, generation, cache, ready and release

three-patch-stream-adapter
  -> scene and renderer host
  -> fixed-grid terrain owner
  -> active patch and terrain slot maps
  -> trees, grass, shards, colliders and pickups
  -> height sampling, creature and camera

three-patch-stream-lod-adapter
  -> constructs full base adapter
  -> constructs LOD terrain layer
  -> orders dual activation and release
  -> hides legacy terrain

three-terrain-lod-layer
  -> LOD terrain owner
  -> topology, clay material, selection and geomorph
```

## Required domain map

```txt
n:prehistoric-rush:patch-world-content
  -> active patch membership
  -> vegetation, pickup and collider membership
  -> height sampling and camera dependencies
  -> no terrain mesh allocation

n:prehistoric-rush:terrain-presentation
  -> exactly one provider registration
  -> patch terrain prepare/adopt/release
  -> LOD selection and transition
  -> material and geometry lifecycle
  -> frame acknowledgement

provider:three-terrain-lod
  -> one slot pool
  -> one patch map
  -> one upload path
  -> one disposal path
```

## Proposed authority surfaces

```txt
terrain-presentation-provider-registry-kit
terrain-presentation-composition-kit
terrain-presentation-admission-kit
terrain-presentation-slot-kit
terrain-presentation-upload-kit
terrain-presentation-lod-selection-kit
terrain-presentation-transition-kit
terrain-presentation-material-kit
terrain-presentation-frame-result-kit
terrain-presentation-retirement-kit
patch-world-content-adapter-kit
three-terrain-lod-provider-kit
terrain-owner-diagnostics-kit
terrain-owner-fixture-kit
```

## Contract

A renderer generation must adopt exactly one terrain provider. Patch-world content may depend on accepted terrain height data, but it must not allocate, upload, hide or retire terrain presentation resources. Multi-owner composition is rejected before the first patch is admitted.