# Known Gaps: PrehistoricRush

**Updated:** `2026-07-10T21-00-16-04-00`

## Instance-pool capacity

```txt
root allocation is 400 while the configured window can request up to 1,372 roots
tree and root writes have no explicit capacity preflight
grass active draw count is reused as the next generation's admission limit
no typed overflow or truncation result
no shared population generation commit
no render/collider or shard/pickup parity proof
```

## Runtime source contract

```txt
src/game.js is the actual source of tuning and scene authority
runner-tuning.json is deployed but not read
game-scenes.json is deployed but not read
kit-composition.json is deployed but not read
kit-cutover-inventory.json is deployed but not read
flock-generation.json is deployed but not read
scenes/*.json are deployed but not read
no canonical runtime source manifest
no consumed-file ledger
no requested/resolved source fingerprint
no source-contract fixture
```

## Material declaration drift

```txt
runtime speed values differ from runner-tuning.json
runtime terrain chunk and segment values differ from runner-tuning.json
runtime imports six local domain kits while kit-composition.json declares NexusEngine core kits
runtime does not import NexusEngine while game-scenes.json and kit-composition.json declare NexusEngine @main
runtime transitions scenes inline while game-scenes.json declares a transition table and scene descriptors
```

## Restart and outcome authority

```txt
Start / Retry / Run Again reset only x, z, distance, routeIndex, and yaw
speed, jump, grounded state, time, turn, surface smoothing, shards, and collected IDs persist
best distance is read from localStorage but not written back
travel distance is used as win progress rather than an explicit monotonic route-progress result
no RunResult or RestartResult
```

## Population identity

```txt
shard IDs are chunk-based
shard positions are derived from the player's current routeIndex
repopulating the same chunk at a different routeIndex can move the same logical shard ID
shard ownership is not proven to be world-space deterministic
```

## Rendering and lighting

```txt
directional-light shadow camera is fixed near the initial world origin
no player-relative or camera-relative shadow-frustum update
no shadow coverage observation
HUD progress reflects travel distance, not explicit route completion
```

## Dependency and lifecycle

```txt
external physics kit resolves from mutable NexusRealtime-ProtoKits@main
load() suppresses import failures to null
no typed dependency admission rows
listeners and RAF have no dispose owner
renderer, geometry, material, instance pools, and physics resources have no dispose transaction
```

## Inventory and host readback

```txt
inactive legacy kits remain beside the active route
no authoritative active-kit manifest
PrehistoricRushHost.app exposes mutable live objects
getState has no population, source, lifecycle, restart, outcome, persistence, or shadow-coverage rows
```

## Validation

```txt
no root package.json
no npm run check
no population-capacity fixture
no source-contract fixture
no restart/outcome fixture
no browser or Pages smoke in this documentation pass
```

## Priority

```txt
1. population-capacity fixture
2. runtime source-contract fixture
3. restart/outcome/persistence fixture
4. dependency admission and lifecycle disposal
5. lighting/shadow follow proof
```
