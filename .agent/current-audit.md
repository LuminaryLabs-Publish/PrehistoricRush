# Current Audit: PrehistoricRush

**Updated:** `2026-07-10T23-08-11-04-00`

## Summary

`PrehistoricRush` was materially refactored after the prior population audit. The browser now creates a Nexus Engine game from `createPrehistoricRushKitGraph()`, which returns twelve core kits plus one `prehistoric-rush-domain-kit`. The game domain contains run state, input state, route sampling, surface classification, score/outcome behavior, scene-transition requests, and a nested procedural dino body service.

The architectural intent is correct, but the composition boundary is incomplete. `src/game.js` still implements nearly every platform-facing and presentation-facing service directly, while the corresponding core kits remain installed without consumption evidence.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: undocumented runtime refactor before oldest fallback
prior central timestamp: 2026-07-10T22-42-00-04-00
new runtime head: 643cff89f6e74db983863a942a4644e6746947b5
runtime refactor local time: 2026-07-10T23-02-57-04-00
```

## Interaction loop

```txt
boot
  -> index.html imports src/runtime.mjs
  -> src/runtime.mjs imports src/game.js
  -> CDN loader imports NexusEngine@main, Three.js, Rapier, and ProtoKit@main
  -> createPrehistoricRushKitGraph(NexusEngine, config)
  -> createRealtimeGame({ kits })

composition
  -> install core-input
  -> install core-spatial
  -> install core-scene
  -> install core-physics
  -> install core-motion
  -> install core-camera
  -> install core-animation
  -> install core-graphics
  -> install core-skybox
  -> install core-ui
  -> install core-diagnostics
  -> install core-composition
  -> install prehistoric-rush-domain-kit

mount
  -> create DOM shell and HUD
  -> create an external Rapier adapter
  -> create Three scene, terrain, population pools, dino, camera, lights, and renderer
  -> inject the terrain height sampler into the game domain
  -> start the run
  -> populate the initial streamed window

frame
  -> browser listeners update a local input object
  -> game.setInput() copies steer/boost/jump into game-domain InputState
  -> engine.tick(dt) runs PrehistoricRushRunSystem
  -> adapter detects chunk changes and repopulates live instance pools
  -> adapter moves the external Rapier actor and steps contacts
  -> adapter reports fail or shard collection back to the game domain
  -> adapter applies procedural dino pose
  -> adapter updates camera, light, HUD, grass uniforms, and Three render
  -> requestAnimationFrame schedules the next frame

readback
  -> globalThis.PrehistoricRushHost exposes engine, physics, and adapter live references
  -> getState returns game snapshot, composition object, scene descriptor, and renderer label
```

## Domains in use

```txt
runtime/source:
  static module boot, CDN resolution, external dependency admission, runtime source revision

Nexus Engine core graph:
  input, spatial, scene, physics, motion, camera, animation, graphics, skybox, UI, diagnostics, composition

game domain:
  run lifecycle, run state, input state, route position, surface class, speed, yaw, jump, score, shards, outcome

route domain:
  deterministic control points, Catmull-Rom samples, nearest query, tangent/progress, path/edge/verge/forest classification

character domain:
  procedural topology, skeleton, skinning, material, pose, character snapshot

browser adapter:
  DOM shell, input listeners, resize/blur handling, RAF, HUD projection

render/population:
  terrain mesh generation, height sampling, tree pools, layered grass pools, shard pool, camera, lights, shadows, render submission

physics adapter:
  Rapier initialization, kinematic actor, collider replacement, transform projection, step, contact projection

observation/deploy:
  host readback, static route, Pages source, repo-local and central audit state
```

## Kit inventory and services

### Nexus Engine core kits declared

- `core-input-kit`: action and binding contracts for jump, boost, start, retry, and steer.
- `core-spatial-kit`: shared spatial capability and transform/query ownership.
- `core-scene-kit`: menu/game/run-over/win scene registry and direct transitions.
- `core-physics-kit`: physics capability/provider contract.
- `core-motion-kit`: motion capability and movement composition contract.
- `core-camera-kit`: camera capability and camera-state ownership contract.
- `core-animation-kit`: animation capability and animation-state contract.
- `core-graphics-kit`: graphics/render capability and frame contract.
- `core-skybox-kit`: skybox capability and sky descriptor ownership.
- `core-ui-kit`: UI capability and UI-state projection contract.
- `core-diagnostics-kit`: diagnostics capability and runtime observation contract.
- `core-composition-kit`: game-composition metadata and capability composition contract.

### Game and nested kits

- `prehistoric-rush-domain-kit`: run/input resources, run-start/fail/win/shard events, simulation system, route/surface/score/outcome API, scene-transition requests, snapshots.
- `drunk-route-generator`: deterministic control points and route samples, nearest route lookup, region classification, route snapshot.
- `procedural-dino-body`: alias of `procedural-dino-body-domain-kit`; skinned body construction, procedural skeleton/weights/material, runtime pose, descriptor and snapshot.

### External kits and modules

- `NexusEngine@main`: runtime, DSK definition, world/resources/events/systems, core-kit factories, game composition.
- `three@0.179.1`: scene graph, geometry, materials, instancing, skinning, camera, lighting, fog, WebGL rendering.
- `@dimforge/rapier3d-compat@0.15.0`: physics runtime.
- `rapier-physics-domain-kit@main`: Rapier world bridge, kinematic actor, fixed colliders, transforms, stepping, contacts.

### Host-implied kits

- `static-shell-adapter-kit`: DOM host, panel, status, button.
- `browser-input-adapter-kit`: key/button/blur handling and input forwarding.
- `rapier-host-adapter-kit`: external engine/world shim and Rapier API setup.
- `terrain-render-adapter-kit`: chunk geometry, height sampling, route coloration.
- `tree-population-render-kit`: tree candidate selection and instanced trunk/crown writes.
- `layered-grass-render-kit`: grass candidate selection, layer assignment, wind shader, instance writes.
- `shard-render-pickup-kit`: shard placement, render rows, pickup rows, collection reset.
- `dino-render-animation-adapter-kit`: skinned-body creation and per-frame pose projection.
- `camera-light-render-adapter-kit`: camera follow, sun follow, render submission.
- `runner-hud-adapter-kit`: progress, status, speed, region and shard DOM projection.
- `browser-frame-loop-kit`: dt sampling, engine tick, adapter updates, RAF scheduling.
- `prehistoric-rush-host-readback-kit`: aggregate snapshot and live reference exposure.

## Main findings

### 1. Declared composition is not consumed composition

The graph installs twelve core kits, but the runtime does not publish a ledger proving that any configured service was consumed. `core-scene` is the only core API visibly invoked by the game domain. The browser host bypasses the configured input, physics, motion, camera, animation, graphics, skybox, UI, diagnostics, and spatial capabilities.

### 2. The browser adapter remains a large runtime owner

`createAdapter()` owns terrain construction, population generation, collider and pickup projection, dino creation, camera, light, animation calls, render submission, and mutable frame state. `main()` owns dependency admission, input, restart, contacts, pickups, HUD, RAF, resize and global host installation.

### 3. Source contracts are mutable

NexusEngine and the Rapier ProtoKit resolve from `@main`. The game domain imports the factories available at page load rather than a pinned engine revision. A compatible local audit does not prove the deployed page will receive the same API or behavior later.

### 4. Population capacity authority remains incorrect after the refactor

Tree pools allocate 160 entries per archetype and grass pools allocate 3,600 / 2,600 / 1,300 entries. After each population pass, `InstancedMesh.count` is overwritten with the active count. The next pass uses that mutable draw count as its admission ceiling. Population capacity can therefore shrink to the previous window's occupancy.

Shard capacity is also read from mutable `shards.count`, then overwritten with the latest active count. Render and pickup rows are now generated together, but immutable allocation capacity is still not represented.

### 5. Host readback cannot prove the architecture

The host exposes mutable engine/physics/adapter references. Its JSON-like snapshot does not include source revisions, declared/installed/consumed core kits, adapter ownership, transition results, event rows, pool capacities, lifecycle state, frame IDs, or failure admission evidence.

## Priority order

```txt
P0 core-kit consumption authority and kit-graph fixture
P1 immutable source revision and dependency admission
P2 browser adapter ownership and lifecycle/disposal
P3 immutable population capacities and atomic population plan
P4 typed start/fail/win/retry/collect results and transition correlation
P5 frame/render/host observation authority
```

## Validation status

Documentation only. Runtime source, dependencies, routes, rendering, physics and deployment were not changed by this pass. No branch or pull request was created.