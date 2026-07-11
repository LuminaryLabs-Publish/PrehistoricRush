# Project Breakdown: PrehistoricRush Seeded Patch Streaming

**Timestamp:** `2026-07-11T02-41-37-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Scope:** documentation only

## Summary

Recent runtime commits replaced the synchronous 7 x 7 world rebuild with the official `seeded-world-patch-controller-kit`, a deterministic product patch generator, an optional module Worker and stable tree instance batches. The architecture now separates patch scheduling from patch content, but the host still lacks one atomic activation result spanning terrain, trees, grass, shards, gameplay colliders, Rapier colliders and height sampling.

## Plan ledger

**Goal:** Record the current streamed-world architecture and define the smallest safe authority boundary needed to prove that each controller-active patch is completely and consistently consumed by every runtime subsystem.

- [x] Compare the full accessible Publish inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories remain centrally tracked with root `.agent` state.
- [x] Select `PrehistoricRush` because five runtime commits landed after its previous audit.
- [x] Identify the active interaction loop.
- [x] Identify every active domain.
- [x] Identify the services supplied by each kit.
- [x] Identify product, official, external and host-implied kits.
- [x] Audit the controller, generator, Worker, cache, terrain slots, tree batches, grass, shards, colliders and height sampler.
- [x] Define the next safe implementation ledge.
- [x] Add architecture, render, gameplay, interaction, world-streaming and deployment audits.
- [x] Refresh root `.agent` routing files and kit registry.
- [ ] Implement runtime changes.
- [ ] Add executable fixtures.
- [ ] Run browser or deployed Pages validation.

## Selection

The accessible organization inventory contains:

```txt
AetherVale
HorrorCorridor
IntoTheMeadow
MyCozyIsland
PhantomCommand
PrehistoricRush
TheCavalryOfRome
TheOpenAbove
TheUnmappedHouse
ZombieOrchard
```

`TheCavalryOfRome` is excluded. The central ledger showed all nine eligible repositories documented. `PrehistoricRush` was the oldest eligible prior review and, more importantly, had new runtime work after that review:

```txt
f7b7b5b  install instanced-render-batch-kit for trees
5c0bda0  use stable instance batches for tree rendering
a5e3a31  add deterministic prehistoric patch generator
2a7e548  add module Worker adapter
b675836  install seeded-world-patch-controller-kit
e7f00ba  stream cached seeded world patches
```

## Product interaction loop

```txt
pinned browser module graph
  -> install 12 core kits
  -> install seed-kit
  -> install procedural-creature-body-kit
  -> install instanced-render-batch-kit
  -> install seeded-world-patch-controller-kit
  -> install prehistoric-rush-domain-kit
  -> build product patch generator from route/config/tree types
  -> initialize optional module Worker executor
  -> create controller with active, retain, prefetch, cache and budget policy
  -> prime the center patch synchronously
  -> browser input updates steer/boost/jump
  -> engine.tick advances deterministic run state
  -> controller receives focus, updates desired sets and pumps generation
  -> generated patches enter the ready queue
  -> host releases old patches
  -> host activates at most one ready patch per frame
  -> adapter mutates terrain slots, tree batches, grass, shards and colliders
  -> Rapier fixed colliders are replaced
  -> creature pose, camera, wind and render update
  -> HUD and host snapshot update
  -> requestAnimationFrame repeats
```

## Domains in use

```txt
runtime module identity and pinned CDN loading
Nexus Engine core input, spatial, scene, physics, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
seed/random stream
procedural creature body descriptors and poses
instanced render batch ownership and per-cell replacement
seeded patch identity, active/retain/prefetch sets, cache, generation queue, ready delivery and eviction
product deterministic patch content generation
module Worker execution and transferable terrain arrays
PrehistoricRush run state, route, surface, speed, jump, score, shards and outcomes
Three terrain-slot, tree, grass, shard, creature, camera, lighting and render consumption
Rapier actor, fixed-collider, step and contact consumption
browser input, resize, blur, RAF and HUD
host observation and static Pages deployment
```

## Kits and services

### Core kits

```txt
core-input-kit         action/binding contracts
core-spatial-kit       spatial capability
core-scene-kit         menu/game/run-over/win transitions
core-physics-kit       physics provider contract
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostics/readback capability
core-composition-kit   composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  recipe, topology, geometry, skeleton, skinning, attachments, collision, poses, hashes and snapshots

instanced-render-batch-kit
  immutable capacity, cell replacement/release, deterministic flush, overflow accounting, bounds and stats

seeded-world-patch-controller-kit 0.1.0
  patch identity and cache keys
  active, retain and prefetch rings
  priority generation queue
  optional executor/Worker handoff
  ready-patch delivery and activation budget
  release reporting, cache eviction, stats, snapshots and reset
```

### Product kits and responsibilities

```txt
prehistoric-rush-domain-kit 0.4.0
  run lifecycle, input, route, surface, speed, jumping, score, outcomes, creature queries and snapshots

drunk-route-generator
  deterministic route samples, nearest query, region classification and snapshot

player-raptor-preset-kit
  product creature configuration

prehistoric-patch-generator
  deterministic terrain heights/colors/normals
  tree trunk/crown descriptors
  grass matrices
  shard pickups
  gameplay/physics collider descriptors
  patch bounds and transferable terrain arrays

prehistoric-patch-worker
  generator initialization
  request/response/error protocol
  transferable patch delivery
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

## Main finding

The controller correctly owns patch scheduling and cache state, while the product generator owns content and the adapters own runtime objects. However, `takeReadyPatches()` marks a patch active before `activatePatch()` proves successful consumption. Activation then performs several live mutations in sequence:

```txt
controller active set
  -> activePatches map
  -> terrain slot attributes and bounds
  -> tree cell replacement and batch flush
  -> full grass/shard/collider rebuild
  -> Rapier fixed-collider replacement
  -> height sampling switches from fallback to patch data
```

There is no prepare/validate/commit transaction, no rollback, no consumer parity result and no shared activation revision. The controller snapshot can therefore report an active patch without proving matching terrain, vegetation, pickup, collider, physics and height-sampler state.

Additional gaps:

- `pump()` limits starts per call, but it is called every frame and no explicit maximum inflight Worker request count is retained.
- Worker executor/disposal ownership is not exposed or coordinated with controller reset or host teardown.
- generation results have request IDs but no controller/session epoch for stale-result rejection after reset/remount.
- fallback height duplicates generator logic and can change source when a patch activates without a continuity result.
- each activation/release rebuilds all active grass, shards and colliders and resubmits the full Rapier fixed-collider set on the main thread.
- host readback reports controller state but not per-consumer patch parity or lifecycle state.

## Next safe ledge

```txt
PrehistoricRush Seeded Patch Activation Authority
+ Worker / Render / Physics Parity Fixture Gate
```

Required dependency order:

```txt
versioned patch-content contract
  -> Worker session and request epoch
  -> generated-patch validation
  -> detached activation plan
  -> terrain/tree/grass/shard/collider capacity preflight
  -> atomic consumer commit
  -> height-source transition result
  -> controller-active versus consumer-active parity snapshot
  -> bounded lifecycle journal
  -> idempotent Worker/controller/adapter disposal
  -> DOM-free fixtures
  -> browser streaming smoke
```

## Candidate kits

```txt
prehistoric-patch-content-contract-kit
patch-worker-session-kit
patch-generation-admission-result-kit
patch-activation-plan-kit
patch-consumer-transaction-kit
patch-height-source-transition-kit
patch-consumer-parity-kit
patch-streaming-lifecycle-journal-kit
patch-streaming-host-observation-kit
patch-streaming-fixture-kit
```

Update `prehistoric-rush-domain-kit` and the existing host adapters first. Do not duplicate the official patch controller or instanced batch kit.

## Validation status

```txt
runtime changed by this audit: no
branches created: no
pull requests created: no
root package.json: absent
source inspection: completed
runtime fixture: absent / not run
Worker fixture: absent / not run
render/physics parity fixture: absent / not run
browser smoke: not run
Pages smoke: not run
```
