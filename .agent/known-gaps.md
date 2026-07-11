# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T00-39-25-04-00`

## Module graph and source admission

```txt
- NexusEngine, NexusEngine-Kits and ProtoKits are pinned to immutable commits
- Three and Rapier are pinned to package versions
- index.html import-map data and src/game.js CDN constants are separate authorities
- no generated/shared module graph manifest exists
- no requested/resolved source-admission result exists
- no module graph fingerprint is exposed
- dynamic import failures become null plus console warnings before a later aggregate failure
- no deployed Pages fixture proves the resolved module graph
```

## Creature preset and descriptor

```txt
- product preset has no explicit schema version or published fingerprint
- descriptor validation is delegated to downstream constructors
- index bounds are not preflighted
- attribute length parity is not preflighted
- finite geometry and pose values are not preflighted
- bone parent validity and cycle freedom are not preflighted
- skin indices and skin-weight sums are not preflighted
- attachment bone references are not preflighted
- collision scaling/parity is not represented by a result row
- no typed descriptor admission result exists
```

## Three render binding

```txt
- createCreatureMesh and applyCreaturePose are private host functions, not named kit APIs
- descriptor preparation immediately allocates live Three resources
- no detached prepare/atomic commit boundary exists
- no render-binding identity/result exists
- applyCreaturePose silently skips unknown bone IDs
- pose application returns no matched/missing/rejected result
- no pose sequence ties run state to the rendered frame
- geometry, material, skeleton and mesh have no explicit lifecycle owner
- no reverse rollback or idempotent creature dispose exists
```

## Rapier collision binding

```txt
- Rapier runs in a separate mini engine/world shim outside the main game engine
- actor registration returns no retained collision-binding result
- no row proves Rapier used the active creature ID and descriptor content hash
- no row proves exact radius, half-height and center-Y parity
- physics steps and contacts are not correlated to run/frame/pose revisions
- manual collider checks and Rapier contacts are separate unclassified failure paths
```

## Composition authority

```txt
- twelve Nexus Engine core kits remain declared
- no declared/installed/available/consumed/replaced/unused ledger exists
- core-scene is visibly consumed
- core-input, physics, motion, camera, animation, graphics, skybox, UI, diagnostics and spatial remain bypassed or unproven
- seed-kit and procedural-creature-body-kit are now real consumed dependencies but have no consumption rows
- no composition fingerprint reconciles core and external kits
```

## Population capacity and commit

```txt
- tree allocation capacity is not stored separately from active InstancedMesh.count
- grass allocation capacity is not stored separately from active InstancedMesh.count
- shard allocation capacity is not stored separately from active InstancedMesh.count
- the next population pass can inherit the previous lower active count as its ceiling
- candidate generation mutates matrices, collider rows, pickup rows and physics state inline
- no detached population plan, generation ID, validation, rollback or fingerprint exists
```

## Commands, lifecycle and frames

```txt
- browser input has no command ID or typed result
- start/fail/collect/win have incomplete result contracts
- scene transition results are not retained
- no ordered run command/event/transition journal exists
- RAF ID and listener ownership are not retained
- renderer, creature, population, physics and global host have no coordinated dispose/remount transaction
- no committed frame ties run state, pose, collision, render and HUD together
```

## Observation gaps

```txt
- PrehistoricRushHost exposes mutable engine, physics and adapter references
- body readback includes only ID, content hash and topology
- kit/source version, preset/recipe fingerprint and descriptor validation are absent
- skeleton/skin/attachment validation rows are absent
- render binding, pose consumption and collision binding rows are absent
- resource ownership and disposal state are absent
- host composition/scene fields are not guaranteed JSON-safe
- journals are absent
```

## Validation gaps

```txt
- no root package.json or unified repository validation command
- no module-graph fixture
- no descriptor/hash/snapshot fixture
- no malformed geometry/skeleton/skinning fixture
- no Three binding or pose fixture
- no collision parity fixture
- no creature lifecycle fixture
- no core-kit consumption fixture
- no immutable population-capacity fixture
- no browser or Pages source-proof smoke
```

## Priority

```txt
1. pinned module graph and procedural creature descriptor-adapter proof
2. core-kit consumption reconciliation
3. creature/browser adapter lifecycle and JSON-safe observation
4. immutable population capacities and atomic generation commit
5. typed run commands and transition/event journal
6. committed-frame authority
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not reintroduce a local procedural creature generator
- do not move product raptor configuration into the shared kit
- do not move Three or Rapier object ownership into the renderer-agnostic body kit
- do not treat pinned URLs alone as module-graph proof
- do not treat an animated mesh as descriptor, collision or lifecycle proof
- do not add creature variants or more population before deterministic gates exist
```