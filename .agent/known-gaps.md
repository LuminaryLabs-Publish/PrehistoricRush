# Known Gaps: PrehistoricRush

**Updated:** `2026-07-10T23-08-11-04-00`

## Composition authority

```txt
- twelve Nexus Engine core kits are declared by the graph
- no declared/installed/available/consumed/replaced/unused ledger exists
- only core-scene is visibly called by the game domain
- core-input is bypassed by browser listeners and game.setInput()
- core-physics is bypassed by an external Rapier bridge
- core-motion is bypassed by custom RunState mutation
- core-camera is bypassed by inline Three camera updates
- core-animation is bypassed by direct dinoBody.applyPose()
- core-graphics is bypassed by direct renderer.render()
- core-skybox has no visible runtime consumer
- core-ui is bypassed by direct DOM mutation
- core-diagnostics is bypassed by a custom global host
- core-spatial has no visible runtime consumer
- core-composition does not expose a service-consumption proof
```

## Domain ownership

```txt
- one parent game domain exists, but createAdapter() remains a broad runtime owner
- terrain, trees, grass, shards, camera, light, animation projection and rendering remain inline
- browser input, resize, blur, HUD, restart, contact handling and RAF remain inline
- the procedural dino nested kit is an alias to a file outside the parent domain folder
- removed route/surface/forest/grass/wind domains were partly replaced by inline host logic
- no explicit adapter interfaces or typed adapter results exist
```

## Dependency and source admission

```txt
- NexusEngine resolves from mutable @main
- rapier-physics-domain-kit resolves from mutable NexusRealtime-ProtoKits@main
- dependency load failures are converted to null plus console warnings
- no requested/resolved revision ledger exists
- no engine/core-kit API compatibility preflight exists
- no source fingerprint appears in host or frame readback
- no deployed artifact fixture proves which engine commit was consumed
```

## Scene and command results

```txt
- game-domain transition requests do not retain or expose transition results
- start() returns mutable RunState instead of a typed StartResult
- fail() returns mutable state and silently no-ops outside game status
- collectShard() returns only a boolean
- win is produced inside the simulation system without a typed outcome result row
- no ordered run command/event/transition journal exists
- the menu scene is configured but boot immediately starts a run
```

## Population capacity and commit

```txt
- tree allocation capacity is not stored separately from InstancedMesh.count
- tree admission uses the previous active draw count as the next ceiling
- grass allocation capacity is not stored separately from InstancedMesh.count
- grass admission uses the previous active draw count as the next ceiling
- shard allocation capacity is not stored separately from InstancedMesh.count
- shard admission uses the previous active draw count as the next ceiling
- candidate generation mutates live matrices, collider rows, pickup rows and physics state inline
- no detached population plan, generationId, atomic commit, rollback or fingerprint exists
- no requested/admitted/rejected/truncated counts exist
```

## Input, physics and frame ownership

```txt
- local browser input state and game-domain InputState are separate authorities
- core-input action/binding configuration is not the active event path
- external physics actor state is not part of the game-domain snapshot
- physics step and contact results are not correlated to engine tick revision
- fail and collect operations occur after engine.tick but before render without a frame transaction
- requestAnimationFrame id is not retained
- listeners, renderer, materials, geometries, instance pools, physics and global host have no dispose transaction
```

## Observation gaps

```txt
- PrehistoricRushHost exposes mutable live engine, physics and adapter objects
- getState() does not guarantee JSON safety for composition and scene values
- no kit-graph revision or source revision is exposed
- no per-core-kit service consumption rows are exposed
- no adapter ownership rows are exposed
- no command, transition, event, physics, population or frame journals are exposed
- no committed frame id ties game state, physics, render and HUD together
```

## Validation gaps

```txt
- no root package.json or unified repository validation command
- no DOM-free kit-graph installation fixture
- no service-consumption fixture
- no source-revision fixture
- no browser adapter smoke
- no immutable-capacity fixture
- no lifecycle/disposal fixture
- no Pages runtime source proof
```

## Priority

```txt
1. core-kit consumption authority and kit-graph fixture
2. immutable source/dependency admission
3. thin browser/physics/render adapter contracts
4. immutable population capacities and atomic commit
5. typed run commands, transitions and event journal
6. lifecycle/disposal and committed-frame readback
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not count an installed core kit as consumed without evidence
- do not add more core kits to hide an unused-service problem
- do not add more inline systems to createAdapter()
- do not use InstancedMesh.count as allocation capacity
- do not add more population before deterministic admission exists
- do not depend on mutable @main sources without revision proof
```