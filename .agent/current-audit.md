# Current Audit: PrehistoricRush

**Updated:** `2026-07-11T05-02-00-04-00`

## Summary

The seeded patch controller owns deterministic patch identity, cache, generation and desired-set scheduling, but its current delivery APIs mutate controller active/released state before the product host proves a matching multi-consumer commit. The next safe ledge is acknowledged patch activation and release across terrain, trees, grass, shards, gameplay collision, Rapier collision and height sampling.

## Plan ledger

**Goal:** Document one transactional boundary between controller delivery and gameplay-ready world state without duplicating existing Nexus Engine kits.

- [x] Reconcile the Publish inventory and central timestamps.
- [x] Inspect the pinned controller implementation.
- [x] Inspect active terrain, vegetation, pickup, collider and height consumers.
- [x] Identify the interaction loop, domains, kits and services.
- [x] Record controller-first activation and release semantics.
- [x] Record capacity, failure, rollback and parity gaps.
- [x] Define the required parent domain and candidate kits.
- [ ] Implement the transaction and acknowledgement surface.
- [ ] Execute deterministic Node, browser and Pages fixtures.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: oldest eligible central record
prior central timestamp: 2026-07-11T02-48-17-04-00
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Interaction loop

```txt
index.html import map
  -> src/runtime.mjs
  -> src/game.js
  -> load pinned NexusEngine, NexusEngine-Kits, Three, Rapier and ProtoKits
  -> install core, seed, creature, instance-batch, patch-controller and game kits
  -> create deterministic patch generator and optional module Worker
  -> create seeded patch controller
  -> create Three and Rapier consumers
  -> start run and prime center patch
  -> browser input and engine.tick update run state
  -> controller.setFocus and update desired sets
  -> controller records releases and host consumes them
  -> controller pumps generation
  -> controller marks ready patches active and returns them
  -> host applies terrain, trees, grass, shards, colliders and height state
  -> physics, pickup, pose, camera, render, HUD and host update
  -> RAF repeats
```

## Domains in use

```txt
runtime module graph and source admission
Nexus Engine core input, spatial, scene, physics, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
seed and deterministic random streams
procedural creature body, topology, skeleton, skinning, collision and pose
instanced render-batch capacity, cell replacement, release, bounds and overflow
seeded patch identity, desired active/retain/prefetch sets, cache, queue, generation, ready delivery and release
product patch generation and Worker protocol
patch-content admission and activation authority
terrain slot allocation and terrain-buffer mutation
tree trunk and crown batch consumption
grass and shard instance consumption
gameplay collider and pickup projection
Rapier fixed colliders, actor stepping and contacts
patch height sampling and fallback height
run lifecycle, route, movement, jump, score and outcomes
browser input, resize, blur, RAF, HUD and host observation
run-session reset, stream epoch and lifecycle authority
static Pages deployment and validation
```

## Kit inventory and services

### Nexus Engine core kits

```txt
core-input-kit         actions and bindings
core-spatial-kit       transform/query capability
core-scene-kit         scene registry and transitions
core-physics-kit       physics provider contract
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        clear-day sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostics/readback capability
core-composition-kit   composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  body recipes, geometry, topology, skeleton, skinning, attachments,
  collision, poses, content hashes and snapshots

instanced-render-batch-kit
  immutable capacity, cell replace/release, flush, bounds, overflow,
  stats and snapshots

seeded-world-patch-controller-kit 0.1.0
  patch/cache identity, focus, active/retain/prefetch sets, generation queue,
  executor handoff, ready/release delivery, budgets, eviction, stats,
  snapshot/load and reset
```

### Product and local kits

```txt
prehistoric-rush-domain-kit 0.4.0
  run/input resources, start/fail/win/shard events, simulation, route,
  surface, score, player body/pose queries, transitions and snapshot

drunk-route-generator
  deterministic route samples, nearest query, progress, region classification and snapshot

player-raptor-preset-kit
  product creature configuration

prehistoric-patch-generator
  terrain arrays, tree descriptors, grass matrices, pickups, colliders,
  bounds and transferables

prehistoric-patch-worker
  initialization, generation, error protocol and transferable delivery
```

### External and host-implied kits

```txt
rapier-physics-domain-kit
three-runtime-module 0.179.1
rapier-runtime-module 0.15.0
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

### Required activation-authority candidates

```txt
patch-content-schema-kit
patch-content-admission-kit
patch-consumer-capability-kit
patch-activation-plan-kit
patch-release-plan-kit
terrain-slot-preflight-kit
tree-batch-preflight-kit
dynamic-instance-preflight-kit
patch-collider-preflight-kit
patch-height-preflight-kit
patch-consumer-commit-kit
patch-consumer-rollback-kit
patch-controller-acknowledgement-kit
patch-consumer-revision-kit
patch-activation-result-kit
patch-release-result-kit
patch-parity-observation-kit
patch-activation-journal-kit
patch-activation-fixture-kit
```

## Source revisions

```txt
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: 9546a6fb25b4c6a7b65432df068701a4627ab20f
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
patch generator: prehistoric-patch-v1
```

## Main findings

### 1. Ready delivery marks controller state active before host commit

`takeReadyPatches()` removes a ready entry, adds its ID to the active set and marks the record active before returning the patch to the host. The host cannot reject or defer the patch while leaving controller state ready.

### 2. Release evidence is cleared before host retirement succeeds

`takeReleasedPatchIds()` copies and clears the controller released set before `adapter.releasePatches()` mutates live consumers. A failed retirement has no retained controller-side claim to retry.

### 3. Host activation is mutation-first and result-free

```txt
activePatches.set
terrain slot acquisition and buffer writes
tree cell replacement and full batch flush
grass and shard rebuild
fixed-collider replacement
height sampler visibility
```

No step returns a typed prepare or commit result. No shared revision, rollback or first-frame acknowledgement exists.

### 4. Capacity policy is incomplete

Tree batch overflow is warned after mutation. Grass and shard descriptors are truncated at fixed capacities without returning rejected IDs. Terrain slot fallback can reuse slot zero. None of these decisions participates in patch admission.

### 5. Controller and consumer observations can diverge

The host exposes controller snapshots but no consumer-active IDs, patch activation revisions, pending claims, exact parity differences or bounded activation journal.

### 6. Gameplay readiness is not a distinct state

Movement, collision, pickup and height sampling continue without a typed guarantee that the current and forward patch set is render-ready, physics-ready and gameplay-ready.

## Priority order

```txt
P0 patch-content admission and acknowledged multi-consumer activation/release
P1 controller-active versus consumer-active parity observation
P2 run-session reset and world-cache retention policy
P3 Worker/stream epochs, inflight ceiling and stale-result quarantine
P4 dynamic pickup/collider/height/render reconciliation
P5 idempotent stop/dispose/restart ownership
P6 creature, core-kit, typed-command and committed-frame proof
```

## Validation status

Documentation only. No runtime, dependency, route, rendering, physics or deployment behavior changed. No branch or pull request was created. The repository has no root `package.json`; patch admission, activation, release, rollback, parity and deployed browser fixtures are absent and were not run.