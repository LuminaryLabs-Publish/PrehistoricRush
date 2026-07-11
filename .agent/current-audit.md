# Current Audit: PrehistoricRush

**Updated:** `2026-07-11T02-48-17-04-00`

## Summary

The runtime resets gameplay resources on `game.start()`, but it has no composed run-session reset authority. Static patch data may safely persist between retries, while run-owned pickup visibility, physics contacts, input, camera, asynchronous delivery and evidence must enter one new session atomically. That ownership split is currently implicit.

## Plan ledger

**Goal:** Define one run-session boundary that preserves reusable deterministic world data while preventing state from a prior run from leaking into retry, win-restart or remount behavior.

- [x] Reconcile the full Publish inventory and central timestamps.
- [x] Inspect the current run, streaming, Worker, render, physics and host paths.
- [x] Identify all domains, services and kits.
- [x] Distinguish world-cache state from run-session state.
- [x] Record the concrete dynamic-content retry gap.
- [x] Define the next safe implementation and fixture boundary.
- [ ] Implement the reset transaction and evidence surface.
- [ ] Execute deterministic retry, stale-result and browser lifecycle fixtures.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: oldest central record plus newer repo-local audit catch-up
prior central timestamp: 2026-07-11T00-39-25-04-00
prior repo-local audit: 2026-07-11T02-41-37-04-00
observed runtime head: e7f00ba3781cd78fff3350c4a3e336911e6db1d9
observed documentation head: 0d0eb05ce51ed52804039b8ef20dfebae33642f3
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Interaction loop

```txt
index.html import map
  -> src/runtime.mjs
  -> src/game.js
  -> load pinned NexusEngine, four NexusEngine-Kits, Three and Rapier
  -> install core, seed, creature, instance-batch, patch-controller and game kits
  -> create deterministic patch generator and optional module Worker
  -> create patch controller
  -> create Three and Rapier consumers
  -> game.start creates run N and resets only RunState/InputState
  -> updateStreaming reuses controller and consumer owners
  -> input -> engine.tick -> run movement
  -> focus -> controller update/release/pump/ready
  -> patch activation/release -> terrain/trees/grass/shards/colliders/height
  -> Rapier step -> collision or pickup outcome
  -> pose/camera/light/render/HUD/host
  -> RAF repeats
```

## Domains in use

```txt
runtime module graph and source admission
Nexus Engine core input, spatial, scene, physics, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
seed and deterministic random stream
procedural creature recipe, topology, skeleton, skinning, collision and pose
instanced render batch capacity, cells, bounds, overflow and snapshots
seeded world-patch identity, desired sets, queue, cache, generation, ready delivery, release and reset
product patch generation
module Worker protocol and message executor
run lifecycle, route, surface, movement, jump, score, shards and outcomes
Three terrain slots, tree batches, grass pools, shard pool, creature, camera, lighting and renderer
Rapier actor, fixed colliders, step and contacts
browser input, resize, blur, RAF and shell
run-session reset and epoch authority
host observation and static Pages deployment
```

## Kit inventory and services

### Nexus Engine core kits

```txt
core-input-kit         actions and bindings
core-spatial-kit       spatial capability
core-scene-kit         menu/game/run-over/win registry and transitions
core-physics-kit       physics provider contract
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        clear-day sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostic/readback capability
core-composition-kit   composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  recipes, topology, geometry, skeleton, skinning, attachments, collision, poses, hashes and snapshots

instanced-render-batch-kit
  immutable capacity, per-cell replace/release, flush, bounds, overflow, stats and snapshots

seeded-world-patch-controller-kit 0.1.0
  patch/cache identity, focus, active/retain/prefetch sets, generation queue, optional executor,
  ready/release delivery, budgets, cache eviction, stats, snapshot/load and reset
```

### Product and local kits

```txt
prehistoric-rush-domain-kit 0.4.0
  run/input resources, start/fail/win/shard events, simulation, route, surface, score,
  player body/pose queries, transitions and snapshot

drunk-route-generator
  deterministic route samples, nearest query, progress, region classification and snapshot

player-raptor-preset-kit
  product creature configuration

prehistoric-patch-generator
  deterministic terrain arrays, tree descriptors, grass matrices, pickups, colliders,
  bounds and transferables

prehistoric-patch-worker
  init, generate, error and transferable delivery protocol
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
three-procedural-creature-adapter-kit
camera-light-render-adapter-kit
patch-streaming-hud-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

### New authority candidates

```txt
run-session-authority-kit
run-start-reset-transaction-kit
world-cache-retention-policy-kit
stream-epoch-admission-kit
dynamic-content-reconciliation-kit
physics-contact-reset-kit
camera-frame-reset-kit
stale-worker-result-quarantine-kit
run-session-observation-kit
retry-stream-epoch-fixture-kit
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

### 1. Gameplay reset is narrower than runtime reset

`prehistoric-rush-domain-kit.start()` increments `runId` and replaces only `RunState` and `InputState`. It does not coordinate patch, Worker, render, physics, camera or host owners.

### 2. Static and dynamic ownership are mixed

Generated terrain and tree descriptors are deterministic world data and can be cached across retries. Pickup visibility, collected-state projection, collision contacts, input latches, camera interpolation and frame evidence are run-owned and require reset. No policy records which state is retained, rebuilt or rejected.

### 3. Retry can preserve stale pickup presentation

`rebuildActiveContent()` is called by activation, release and successful shard collection. A retry near the same patch set can produce no activation or release, so a shard hidden after collection can remain hidden after the new `RunState` resets its collected IDs.

### 4. Asynchronous work lacks session admission

The controller request IDs and Worker pending map have no `runSessionId` or `streamEpoch`. A generated patch may be valid world data, but its activation and consumer evidence cannot prove which run admitted it.

### 5. Physics and render state are not reset transactions

Rapier fixed colliders are replaced during active-content rebuild, but actor/contact state is not explicitly cleared on retry. Camera interpolation, render time, shard rotation and consumer revisions also continue across run IDs.

### 6. Public evidence is insufficient

`PrehistoricRushHost.getState()` exposes live owners and aggregate snapshots but no start/reset result, cache-retention decision, run/stream epoch, stale-result count, dynamic-content reconciliation result or post-reset frame proof.

### 7. The seeded-patch activation gap remains P0

The controller marks a ready patch active before all consumers commit it. The reset transaction must be built on top of an acknowledged activation/release boundary rather than masking that gap.

## Priority order

```txt
P0 patch-content admission and atomic multi-consumer activation
P1 run-session reset transaction and world-cache retention policy
P2 stream/Worker epochs, inflight ceiling and stale-result quarantine
P3 dynamic pickup/collider/height/render reconciliation
P4 controller/consumer/run-session parity journal
P5 idempotent stop/dispose/restart ownership
P6 creature, core-kit, typed-command and committed-frame proof
```

## Validation status

Documentation only. No runtime, dependency, route, rendering, physics or deployment behavior changed. No branch or pull request was created. The repository has no root `package.json`; retry, epoch, stale-result, reset and lifecycle fixtures are absent and were not run.
