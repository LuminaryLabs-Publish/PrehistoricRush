# Architecture Audit: Seeded Patch Streaming DSK Map

**Timestamp:** `2026-07-11T02-41-37-04-00`

## Summary

The streamed-world stack now has a sound top-level ownership split: the official controller owns deterministic scheduling/cache state, the product generator owns patch content, the Worker owns optional off-thread execution, and host adapters own Three/Rapier consumption. The missing architecture is a transaction and evidence layer between controller delivery and multi-consumer activation.

## Plan ledger

**Goal:** Map every active DSK/domain boundary and assign the unresolved activation, parity and lifecycle responsibilities without duplicating existing Nexus Engine kits.

- [x] Map core kits.
- [x] Map official stable kits.
- [x] Map the product parent domain.
- [x] Map local deterministic route and patch generators.
- [x] Map Worker execution.
- [x] Map Three and Rapier consumers.
- [x] Identify existing ownership boundaries.
- [x] Identify unowned responsibilities.
- [x] Define dependency order.

## Composition graph

```txt
Nexus Engine core
  core-input
  core-spatial
  core-scene
  core-physics
  core-motion
  core-camera
  core-animation
  core-graphics
  core-skybox
  core-ui
  core-diagnostics
  core-composition

NexusEngine-Kits
  seed-kit
    -> random:stream
  procedural-creature-body-kit
    -> n:procedural-creatures:body
  instanced-render-batch-kit
    -> deterministic cell-owned instance batches
  seeded-world-patch-controller-kit
    -> world:seeded-patch-controller
    -> world:patch-cache
    -> world:patch-prefetch
    -> world:patch-activation-budget

PrehistoricRush product
  prehistoric-rush-domain-kit 0.4.0
    requires:
      n:procedural-creatures:body
      world:seeded-patch-controller
    nests:
      drunk-route-generator
    exposes:
      run, input, route, surface, score, outcome, player-creature

Host/content adapters
  prehistoric-patch-generator
  prehistoric-patch-worker
  Three patch consumers
  Rapier patch collider consumer
  browser input/RAF/HUD
```

## Existing kit services

### seeded-world-patch-controller-kit 0.1.0

```txt
create/get/remove/list controllers
stable patch IDs and cache keys
focus-to-cell projection
active square selection
forward prefetch selection
retain-ring state
priority queueing
optional executor handoff
per-call generation start budget
ready-patch delivery
per-call activation delivery budget
release IDs
cache eviction
stats/snapshot/load/reset
Worker executor helper with run/dispose
```

Boundary retained from the kit:

```txt
controller owns scheduling and cache records
generator owns patch payload content
Worker adapter owns execution
renderer/physics adapters own runtime objects
controller does not own the game loop
```

### instanced-render-batch-kit

```txt
stable immutable capacity
per-cell replace/release
ordered flush
active count
bounds recalculation
explicit overflow report
stats and snapshots
```

### prehistoric-rush-domain-kit 0.4.0

```txt
run and input resources
run lifecycle and outcomes
route/surface queries
movement/jump/speed simulation
shard collection
player creature descriptor/pose access
scene transitions
snapshot including patch-streaming service state
```

## Current ownership map

| Responsibility | Current owner | Status |
|---|---|---|
| World seed and random streams | `seed-kit` | owned |
| Patch identity/cache key | seeded patch controller | owned |
| Desired active/prefetch sets | seeded patch controller | owned |
| Queue priority and ready delivery | seeded patch controller | owned |
| Patch terrain/vegetation/pickup/collider content | product patch generator | owned |
| Optional off-thread execution | Worker + message executor | owned but lifecycle incomplete |
| Terrain GPU buffers | Three host adapter | implicit |
| Tree cell occupancy | instanced batch kit + Three adapter | split but coherent |
| Grass/shard instance buffers | Three host adapter | implicit |
| Gameplay collider list | Three host adapter view | implicit |
| Rapier fixed colliders | Rapier adapter | implicit |
| Height source | Three host adapter | implicit and dual-source |
| Cross-consumer activation transaction | none | missing |
| Patch admission/validation result | none | missing |
| Controller/consumer parity snapshot | none | missing |
| Worker/controller/adapter session epoch | none | missing |
| Coordinated reset/dispose | none | missing |

## Critical ordering defect

The controller changes its own record to `active` inside `takeReadyPatches()`. Only afterward does the host call `adapter.activatePatch()`. The adapter then mutates several live consumers and returns no result.

```txt
controller active=true
  before
terrain committed
  before
trees flushed
  before
grass/shards rebuilt
  before
Rapier colliders replaced
  before
height-source parity recorded
```

A thrown error can leave controller truth ahead of consumer truth. Even without an exception, snapshots cannot prove that all consumers share the same patch set and revision.

## Unowned DSK responsibilities

```txt
patch-content schema/version and payload validation
request/controller/session epoch and stale result rejection
activation capacity preflight
activation plan fingerprint
atomic multi-consumer commit result
rollback/repair result
height fallback-to-patch continuity result
controller-active versus consumer-active parity projection
bounded generation/activation/lifecycle journal
coordinated reset and idempotent disposal
```

## Recommended placement

### Update existing domains first

```txt
seeded-world-patch-controller-kit
  preserve scheduling ownership
  optionally add explicit inflight ceiling and delivery acknowledgement only if reusable upstream

prehistoric-rush-domain-kit
  own product patch-content schema identity and run/stream correlation

PrehistoricRush host adapter
  own prepare/validate/commit/rollback across Three and Rapier consumers
```

### New product kits only for coherent missing boundaries

```txt
prehistoric-patch-content-contract-kit
patch-worker-session-kit
patch-activation-plan-kit
patch-consumer-transaction-kit
patch-consumer-parity-kit
patch-streaming-lifecycle-journal-kit
```

Do not build another patch cache, active-ring controller, prefetcher or tree instance-batch implementation.

## Required transaction

```txt
ready patch delivery
  -> validate request ID, patch ID, cache key, generator version and epoch
  -> validate terrain array sizes and finite values
  -> validate tree/grass/shard/collider IDs and capacities
  -> prepare terrain slot assignment
  -> prepare tree cell replacements
  -> prepare grass/shard matrices
  -> prepare gameplay and Rapier collider sets
  -> compute activation fingerprint
  -> commit all consumers
  -> publish typed accepted/rejected/rolled-back result
  -> acknowledge consumer-active patch set
  -> publish parity snapshot
```

## Next safe ledge

```txt
PrehistoricRush Seeded Patch Activation Authority
+ Worker / Render / Physics Parity Fixture Gate
```
