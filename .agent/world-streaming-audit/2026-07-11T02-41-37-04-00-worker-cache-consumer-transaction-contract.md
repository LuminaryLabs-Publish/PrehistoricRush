# World Streaming Audit: Worker, Cache and Consumer Transaction Contract

**Timestamp:** `2026-07-11T02-41-37-04-00`

## Summary

The new stack solves the previous all-at-once 7 x 7 generation freeze by separating deterministic patch production, caching, prefetching and budgeted activation. The remaining contract must distinguish content readiness from consumer commitment and must coordinate Worker requests, cache reuse, activation, release, reset and disposal.

## Plan ledger

**Goal:** Define the state machine and invariants needed for reliable streamed patches without replacing the official controller.

- [x] Audit controller configuration and state sets.
- [x] Audit generator payloads.
- [x] Audit Worker protocol and transferables.
- [x] Audit activation/release consumers.
- [x] Audit cache and reset behavior.
- [x] Define content and consumer states separately.
- [x] Define required invariants and fixtures.

## Current configuration

```txt
patchSize: 56
activeRadius: 2
retainRadius: 4
prefetchDistance: 2
cacheLimit: 96
activationBudget: 1
generationBudget: 2
generatorVersion: prehistoric-patch-v1
terrainSettingsHash: segments-30
vegetationSettingsHash: trees-7-grass-70
active target: 25 patches
terrain slots: 25
```

## Controller state model

```txt
missing
requested
queued
inflight/generating
ready
active
retained
cached
error
```

The controller also maintains:

```txt
records
queue
queued IDs
inflight IDs
ready queue
active IDs
desired active IDs
desired prefetch IDs
released IDs
diagnostics
```

## Patch content contract observed

```txt
id / key / x / z / seed
terrain
  Float32 heights
  Float32 colors
  Float32 normals
  segments
trees by type
  trunk descriptors
  crown descriptors
grass by layer
  matrix descriptors
pickups
colliders
bounds
```

Terrain buffers are transferable. Tree, grass, pickup and collider rows remain structured-cloned JavaScript objects.

## Worker protocol observed

```txt
init-patch-worker(payload)
  -> patch-worker-ready

generate-patch(requestId, request)
  -> patch-generated(requestId, patch, transferables)
  -> patch-error(requestId, error)
```

The host posts initialization before generation, and Worker message ordering normally preserves that sequence. However, the host does not wait for or retain the ready acknowledgement, and readiness is not exposed in the host snapshot.

## Core contract distinction

```txt
content state
  requested / generated / cached / invalid / error

consumer state
  prepared / committed / released / rolled-back / disposed
```

The current controller tracks content and desired activity, then uses `active` to imply consumer commitment. This is too strong for a multi-consumer host.

## Required invariants

```txt
1. Patch content identity is immutable for one cache key.
2. A generated patch validates before entering ready delivery.
3. Controller-ready does not mean consumer-active.
4. Consumer-active is published only after every required consumer commits.
5. Terrain slot count never drops below simultaneous committed terrain patches.
6. Tree, grass and shard capacities are preflighted before writes.
7. Gameplay and Rapier collider sets reference the same committed patch set.
8. Height sampling declares fallback or committed-patch source.
9. Release removes all consumer state before the patch is reusable as inactive cache.
10. Reset/remount advances a stream session epoch.
11. Late results can be cached only when content identity remains valid.
12. Late results cannot activate into a different stream session.
13. Worker/executor/controller/adapter disposal is terminal and idempotent.
14. Public snapshots are clone-safe and exclude live owners.
```

## Main gaps

### No inflight ceiling

`generationBudget` controls starts per `pump()` call. Because `pump()` is called every RAF, the host can enqueue multiple Worker jobs per frame until the queue is drained. The Worker may serialize execution, but the pending request count and message queue can still grow. A reusable upstream improvement may add `maximumInflight` or make the budget apply to available concurrency.

### No activation acknowledgement

`takeReadyPatches()` changes controller state to active. It does not receive a success/rejection result from the adapter. The product needs either:

```txt
claimReadyPatch -> commit -> acknowledgeActive
```

or a product-owned consumer-active ledger that is explicitly separate from controller-active delivery state.

### No atomic release transaction

The controller reports released IDs, then the adapter removes active patch data, hides terrain, releases tree cells, flushes batches, rebuilds active content and replaces Rapier colliders. There is no release result or rollback.

### No lifecycle owner

The runtime retains neither the executor's `dispose()` nor a host-level teardown. Worker, event listeners, RAF, Three resources, Rapier state, controller cache and global host can outlive a remount in the current design.

## Required typed results

```txt
PatchGenerationAdmissionResult
PatchActivationPlan
PatchActivationResult
PatchReleaseResult
PatchHeightSourceResult
PatchConsumerParitySnapshot
PatchStreamingDisposeResult
```

## Fixture matrix

```txt
deterministic same-key generation
settings-hash cache separation
out-of-order Worker response
focus change before completion
restart with inflight requests
controller reset with late response
invalid terrain array lengths
NaN/Infinity payload rejection
tree/grass/shard capacity overflow
terrain-slot exhaustion rejection
partial consumer failure rollback
release parity
fallback-to-patch height continuity
cache eviction
idempotent dispose
post-dispose request rejection
```

## Next safe ledge

```txt
PrehistoricRush Seeded Patch Activation Authority
+ Worker / Render / Physics Parity Fixture Gate
```
