# Known Gaps: PrehistoricRush

**Updated:** `2026-07-10T19-30-36-04-00`

## Instance-pool capacity gaps

```txt
no immutable capacity field in pool wrappers
active draw count and allocation capacity are conflated
root pool allocates 400 but can receive up to 1,372 requests before route rejection
root matrix writes have no explicit index guard
root draw count can be assigned above allocation capacity
tree trunk/crown writes have no typed capacity preflight
per-archetype tree concentration has no overflow policy
rock and shard writes have no shared admission result
```

## Grass population gaps

```txt
grass mesh.count begins as allocation capacity
grass mesh.count is overwritten with active count after population
next generation uses prior active count as the admission limit
sparse population can ratchet future capacity downward
no requested/admitted/rejected count by layer
no stable grass generation ID
no stale-slot policy
```

## Population correlation gaps

```txt
no PopulationGenerationResult
no windowKey plus generationId contract
no stable source row for every tree/root/grass/rock/shard candidate
visible tree rows and collider rows are not proven to share admission
visible shard rows and pickup rows are not proven to share admission
population replacement has no commit or rollback result
host readback has no pool counts or overflow reasons
```

## Restart gaps

```txt
Start / Retry / Run Again reset x, z, distance, routeIndex, and yaw only
speed is not reset
jumpY and vertical velocity are not reset
grounded state is not explicitly reset
time and turn are not reset
surface smoothing state is not reset
shard count and collected IDs are not reset
population generation identity does not exist
old generation invalidation cannot be proven
```

## Runtime dependency and lifecycle gaps

```txt
external physics kit still resolves from mutable NexusRealtime-ProtoKits@main
load() still suppresses import errors to null
no typed dependency admission rows
listeners and RAF have no shared dispose owner
renderer, geometry, material, and physics resources have no dispose transaction
```

## Domain consumption and inventory gaps

```txt
active route directly imports six new domain kits
earlier event-bus, domain-host, scheduler, dino form/pose/material, camera, and HUD kits remain present but inactive
no authoritative kit manifest distinguishes active from retained legacy kits
README still describes NexusEngine/manifests more strongly than the current direct game.js route supports
```

## Host/readback gaps

```txt
PrehistoricRushHost.app exposes mutable live objects
getState has no dependency admission rows
getState has no population generation rows
getState has no immutable capacity or active count per pool
getState has no requested/admitted/rejected/overflow counts
getState has no renderer/collider or shard/pickup parity rows
getState has no restart result or lifecycle state
```

## Validation gaps

```txt
no root package.json
no npm run check
no DOM-free population-capacity fixture
no dense/sparse/repeated population fixture
no tree/collider parity fixture
no shard/pickup parity fixture
no browser smoke in this pass
no Pages smoke in this pass
```

## Do not solve first

```txt
new tree art
more tree density
more grass layers
new dinosaur mesh
new pickup families
shader rewrite
renderer replacement
movement retune
ProtoKit promotion
```

## Current ledge

```txt
PrehistoricRush Instance Pool Capacity Authority
+ Deterministic Population Fixture Gate
```