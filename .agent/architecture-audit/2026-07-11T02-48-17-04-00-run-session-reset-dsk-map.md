# Architecture Audit: Run Session Reset DSK Map

**Timestamp:** `2026-07-11T02-48-17-04-00`

## Goal

Define the DSK/domain boundary that separates reusable deterministic world state from resettable run-session state.

## Existing ownership

```txt
prehistoric-rush-domain-kit
  owns RunState, InputState, runId and run events

seeded-world-patch-controller-kit
  owns patch identity, cache, desired sets, queue, inflight records and active IDs

prehistoric-patch-generator
  owns deterministic immutable patch payload generation

Three adapter
  owns activePatches, terrain slots, tree cells, grass/shard pools, camera and renderer

Rapier adapter
  owns actor, fixed colliders, step and contacts

browser host
  owns listeners, RAF, Worker creation, start button and public host object
```

## Missing parent domain

```txt
prehistoric-rush-run-session-authority
```

Required services:

```txt
prepareStart(reason)
classifyRetention(owner)
resetDynamicConsumers(plan)
advanceStreamEpoch()
commitStart(plan)
rollbackStart(plan, error)
stop(reason)
dispose()
getSnapshot()
takeResults()
```

Required state:

```txt
runSessionId
previousRunSessionId
runId
streamEpoch
lifecycleState
worldIdentity
cacheRetentionFingerprint
consumerResetRevision
firstCommittedFrameId
pendingStart
bounded result journal
```

## Ownership classification

### Retainable world state

```txt
world seed
generator version
terrain/vegetation setting hashes
validated immutable patch payload cache
route samples
creature body descriptor
static renderer allocations when safely reusable
```

### Resettable run state

```txt
RunState and InputState
collected pickup visibility
run-owned collider projection
actor/contact state
jump and keyboard latches
camera smoothing target/history
render time and first-frame evidence
HUD outcome state
run command/result journal
```

### Epoch-fenced asynchronous state

```txt
queued/inflight patch requests
Worker pending promises
ready patch deliveries
activation/release results
render and physics consumer acknowledgements
```

## Contract rule

A cached patch may cross a retry only when its world identity and content fingerprint match. Its delivery, activation and dynamic pickup/collider projection must still be admitted under the current `streamEpoch` and committed under the current `runSessionId`.

## Dependency order

```txt
patch admission
  -> atomic activation/release
  -> run-session prepare/reset
  -> stream epoch fence
  -> consumer reset acknowledgements
  -> run commit
  -> first committed frame
  -> bounded observation
```
