# Architecture Audit: Instance Pool Capacity Authority

**Timestamp:** `2026-07-10T19-30-36-04-00`

## Current composition

```txt
runtime entry
  -> route-field-domain-kit
  -> surface-traversal-domain-kit
  -> forest-archetype-domain-kit
  -> grass-patch-domain-kit
  -> grass-wind-domain-kit
  -> procedural-dino-body-domain-kit
  -> external rapier-physics-domain-kit
  -> src/game.js terrain/population/presentation host
```

The active DSK layer is now directly instantiated by `src/game.js`. Earlier event-bus, domain-host, scheduler, dino-form, dino-pose, dino-material, camera, and HUD kits remain in the repository but are not imported by the current route.

## Current ownership map

```txt
route-field-domain-kit
  owns deterministic path control points, samples, nearest lookup, and region classification

surface-traversal-domain-kit
  owns region speed multipliers and smoothing

forest-archetype-domain-kit
  owns five tree archetype descriptors

grass-patch-domain-kit
  owns layer descriptors and route-distance scale policy

grass-wind-domain-kit
  owns gust state

procedural-dino-body-domain-kit
  owns skinned mesh topology, skeleton, skin weights, and pose policy

src/game.js
  owns terrain geometry, pool allocation, population admission, matrix writes, collider rows, pickups, simulation, scene state, camera, HUD, render, and host projection
```

## Authority defect

`src/game.js` does not distinguish:

```txt
allocation capacity
requested population
admitted population
active draw count
rejected population
stale previous slots
```

This makes pool mutation an implicit side effect instead of a domain transaction.

## Required next-cut DSKs

```txt
instance-pool-descriptor-kit
  poolId, kind, capacity, matrixStride, ownership, generationId

population-request-kit
  deterministic source rows before renderer mutation

population-admission-kit
  capacity preflight, policy, admitted rows, rejected rows, reasons

instance-pool-commit-kit
  clear, write, activeCount, generation commit, stale-slot policy

population-result-kit
  requestedCount, admittedCount, rejectedCount, overflowCount, reasons

population-observation-kit
  detached JSON-safe pool and generation readback

population-fixture-kit
  dense, sparse, repeated, route-edge, overflow, and determinism assertions
```

## Integration rule

Update the current population owner before adding a parallel abstraction. The first cut should wrap the existing `populate()` logic and current InstancedMesh pools rather than replacing the renderer, route generator, forest archetypes, grass art, or dino body.

## Next safe ledge

```txt
PrehistoricRush Instance Pool Capacity Authority
+ Deterministic Population Fixture Gate
```