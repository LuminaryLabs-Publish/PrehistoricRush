# Current Audit: PrehistoricRush

**Updated:** `2026-07-11T02-41-37-04-00`

## Summary

`PrehistoricRush` now consumes the official pinned `seeded-world-patch-controller-kit` and `instanced-render-batch-kit`. Deterministic terrain, vegetation, pickup and collider generation is isolated in a product generator and may run in a module Worker. This removes the previous synchronous whole-window generation path, but activation remains a main-thread, multi-consumer partial-commit boundary.

## Plan ledger

**Goal:** Make streamed patch delivery deterministic, atomic, observable and lifecycle-safe without recreating controller, cache, prefetch or instance-batch services already owned by NexusEngine-Kits.

- [x] Compare the full accessible Publish inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` because runtime changes are newer than its existing audit.
- [x] Identify the interaction loop, domains, services and kits.
- [x] Audit controller, generator, Worker, cache, terrain slots, instance batches, grass, shards, colliders and height sampling.
- [x] Define the next safe implementation boundary.
- [ ] Implement patch admission and atomic activation.
- [ ] Add fixtures and browser validation.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: recent undocumented runtime change before fallback
prior audit: 2026-07-11T00-39-25-04-00
observed runtime head before documentation: e7f00ba3781cd78fff3350c4a3e336911e6db1d9
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Recent runtime sequence:

```txt
f7b7b5b install instanced render batch kit
5c0bda0 use stable instanced batches for forest trees
a5e3a31 add deterministic prehistoric patch generator
2a7e548 add prehistoric patch Worker adapter
b675836 install seeded world patch controller
e7f00ba stream cached seeded world patches
```

## Interaction loop

```txt
index.html import map
  -> src/runtime.mjs
  -> src/game.js
  -> load pinned NexusEngine, four stable kits, Three and Rapier
  -> createPrehistoricRushKitGraph
  -> install 12 core kits
  -> install seed-kit
  -> install procedural-creature-body-kit
  -> install instanced-render-batch-kit
  -> install seeded-world-patch-controller-kit
  -> install prehistoric-rush-domain-kit 0.4.0
  -> build patch generator from run config, tree types and route samples
  -> start optional module Worker and message executor
  -> create patch controller
  -> create Three and Rapier adapters
  -> synchronously prime center patch
  -> browser input forwards run intent
  -> engine.tick advances run state
  -> controller focus, desired sets, queue, generation and release update
  -> host pumps generation and activates at most one ready patch
  -> terrain, tree, grass, shard, collider and height consumers update
  -> Rapier step and collision outcome update
  -> creature pose, camera, light, render and HUD update
  -> host snapshot update
  -> RAF repeats
```

## Domains in use

```txt
runtime module graph and source admission
Nexus Engine core input, spatial, scene, physics, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
seed/random stream
procedural creature recipe, topology, skeleton, skinning, attachments, collision and pose
instanced render batch capacity, cell ownership, flush, bounds, overflow and stats
seeded patch identity, cache, active/retain/prefetch sets, queue, ready delivery, release and eviction
product deterministic patch generation
module Worker execution and transferable terrain arrays
PrehistoricRush run lifecycle, route, surface, movement, jump, score, shards and outcomes
Three terrain slots, tree pools, grass pools, shard pool, creature, camera, lighting and render
Rapier actor, fixed colliders, step and contacts
browser input, resize, blur, RAF, HUD and host observation
static Pages deployment
```

## Kit inventory and services

### Nexus Engine core kits

```txt
core-input-kit         actions/bindings
core-spatial-kit       spatial capability
core-scene-kit         scene registry/transitions
core-physics-kit       physics provider contract
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostic/readback capability
core-composition-kit   composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  recipes, geometry, topology, skeleton, skinning, attachments, collision, poses, hashes and snapshots

instanced-render-batch-kit
  immutable capacities
  per-cell replace/release
  deterministic flush
  admitted/overflow counts
  bounds and snapshots

seeded-world-patch-controller-kit 0.1.0
  patch/cache identity
  focus projection
  active, retain and prefetch rings
  generation priority and queue
  optional executor handoff
  ready-patch and release delivery
  activation/generation budgets
  cache eviction
  stats, snapshot, load and reset
  message Worker executor helper
```

### Product and local kits

```txt
prehistoric-rush-domain-kit 0.4.0
  run/input resources
  run-start/fail/win/shard events
  movement, route, surface, score and outcome
  player body and pose access
  scene transitions and snapshots

drunk-route-generator
  deterministic route samples, nearest query, region classification and snapshot

player-raptor-preset-kit
  product creature configuration

prehistoric-patch-generator
  deterministic terrain arrays, tree descriptors, grass matrices, pickups, colliders, bounds and transferables

prehistoric-patch-worker
  init/generate/error protocol and transferable delivery
```

### External and host-implied kits

```txt
rapier-physics-domain-kit
Three.js 0.179.1
Rapier 0.15.0
module-worker-executor-adapter-kit
terrain-slot-consumer-kit
tree-instance-batch-consumer-kit
grass-patch-consumer-kit
shard-pickup-consumer-kit
patch-collider-consumer-kit
patch-height-sampler-kit
patch-streaming-hud-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

## Source revisions

```txt
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: 9546a6fb25b4c6a7b65432df068701a4627ab20f
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
```

## Main findings

### 1. Scheduling ownership is correct

The official controller owns patch IDs, cache keys, desired sets, priority, ready delivery, release reporting and eviction. The product generator owns terrain and population content. Worker and renderer adapters remain outside the renderer-agnostic controller.

### 2. Controller-active is ahead of consumer-active

`takeReadyPatches()` adds a patch to the controller active set before `adapter.activatePatch()` runs. The adapter returns no result and sequentially mutates terrain, trees, grass, shards, gameplay colliders, Rapier colliders and height sampling. No atomic commit or acknowledgement reconciles these states.

### 3. Activation still performs broad synchronous work

One delivered patch triggers terrain buffer uploads and bounds, all tree batch flushes, a rebuild of every active grass and shard matrix, bounds recalculation and a full Rapier fixed-collider replacement. `activationBudget: 1` limits frequency, not the cost or atomicity of one activation.

### 4. Worker concurrency and lifecycle are incomplete

`pump()` starts up to the configured maximum per call and is invoked every RAF. No explicit inflight ceiling is retained. The message executor has `dispose()`, but the host does not retain or call it, and no stream/controller epoch rejects late results after reset/remount.

### 5. Height and gameplay readiness are implicit

The game reads generated patch heights when active and a duplicated fallback function otherwise. No continuity result proves the two sources agree. Desired but inactive patches also lack their tree hazards and pickups in gameplay/Rapier state.

### 6. Host evidence is incomplete

`PrehistoricRushHost.getState()` exposes controller snapshots but no consumer-active patch set, activation/release results, per-consumer counts, parity fingerprint, Worker readiness/pending count, height-source state or disposal status. It also exposes live mutable owners.

### 7. Prior gaps remain

Creature descriptor consumption, per-core-kit consumption authority, typed run commands, committed-frame evidence and coordinated host lifecycle remain unresolved. The tree batch capacity issue is improved, but patch activation still needs full population parity and atomic commit.

## Priority order

```txt
P0 patch-content admission and atomic multi-consumer activation
P1 Worker/session epochs, inflight ceiling and lifecycle disposal
P2 stream readiness for height/hazards/pickups
P3 controller/consumer parity and JSON-safe host journal
P4 procedural creature descriptor/render/physics consumption proof
P5 core-kit consumption reconciliation
P6 typed run commands and committed-frame authority
```

## Validation status

Documentation only. No runtime source, dependency, route, render, physics or deployment behavior changed. No branch or pull request was created. The repository has no root `package.json`; patch generator, Worker, activation, parity and lifecycle fixtures are absent and were not run.
