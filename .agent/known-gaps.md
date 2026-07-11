# Known Gaps: PrehistoricRush

**Updated:** `2026-07-10T22-42-00-04-00`

## Population admission and capacity

```txt
- population generation mutates live render, collider, pickup, and physics state inline
- tree and crown writes have no immutable-capacity preflight
- root allocation is 400 while configured maximum demand is 1,372
- tree archetype pools are 100 each and have no overflow result
- grass compares candidate indices against the previous active draw count
- grass counters increment before capacity and LOD admission
- grass active counts can include unwritten or stale matrices
- rock and shard writes rely on current tuning staying below capacity
- no requested/admitted/truncated/rejected/overflow rows exist
- no atomic generation commit or rollback exists
```

## Cross-system parity

```txt
- tree colliders are appended independently from successful tree instance admission
- physics collider replacement consumes collider rows without render parity proof
- shard pickup rows are appended independently from committed shard instance rows
- render, collider, pickup, and physics rows have no shared source ID contract
- no exact tree-render/collider parity fixture exists
- no exact shard-render/pickup parity fixture exists
```

## Population identity and determinism

```txt
- no generationId, committed windowKey, population revision, or fingerprint
- no detached population plan
- shard IDs are chunk-based while positions depend on current routeIndex
- repopulating the same chunk at another routeIndex can move the same logical shard
- no repeated-generation equality proof
- no failed-generation immutability proof
```

## Runtime source contract

```txt
- src/game.js remains the actual tuning, scene, and composition authority
- deployed runner-tuning, game-scenes, kit-composition, cutover, flock, and scene JSON files are not read
- deployed declarations materially disagree with live runtime constants
- no canonical runtime source manifest or consumed-file ledger
- no requested/resolved source fingerprint
- no source-contract fixture
```

## Restart and outcome authority

```txt
- Start / Retry / Run Again reset only x, z, distance, routeIndex, and yaw
- speed, jump, grounded state, time, turn, surface smoothing, shards, and collected IDs persist
- best distance is read but not written
- no RunResult or RestartResult
```

## Rendering, dependency, and lifecycle

```txt
- directional-light shadow camera remains near the initial origin
- external physics kit resolves from mutable NexusRealtime-ProtoKits@main
- load() converts dependency failures to null without typed admission evidence
- listeners, RAF, renderer, geometries, materials, pools, and physics have no dispose transaction
- PrehistoricRushHost.app exposes mutable live objects
- host readback lacks population, source, lifecycle, restart, outcome, persistence, and shadow rows
```

## Validation gaps

```txt
- no root package.json or unified npm check
- no population plan fixture
- no capacity fixture
- no render/collider/pickup parity fixture
- no atomic generation commit fixture
- no source-contract fixture
- no browser or Pages smoke in this pass
```

## Priority

```txt
1. population admission transaction and parity fixtures
2. runtime source-contract reconciliation
3. restart/outcome/persistence transaction
4. dependency admission and lifecycle disposal
5. lighting/shadow follow proof
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not increase capacities without admission proof
- do not treat mesh.count as immutable capacity
- do not publish candidate counts as committed draw counts
- do not create colliders or pickups from rejected render candidates
- do not add more visual population before deterministic fixtures exist
```