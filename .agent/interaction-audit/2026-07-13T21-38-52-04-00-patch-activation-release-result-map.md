# Patch Activation and Release Result Map

**Timestamp:** `2026-07-13T21-38-52-04-00`

## Summary

The current runtime passes raw ready patches and released IDs from the controller into the adapter. No command or result correlates source intent, consumer preparation and terminal state.

## Plan ledger

**Goal:** map every interaction boundary needed for deterministic activation and release.

- [x] Identify current producer and consumer calls.
- [x] Identify missing identities, revisions and terminal results.
- [x] Define accepted, degraded and rejected paths.
- [ ] Implement the result map in product orchestration later.

## Current calls

```txt
controller.takeReadyPatches()
  -> [{ id, key, x, z, patch }]
  -> adapter.activatePatch(entry, state)
  -> undefined

controller.takeReleasedPatchIds()
  -> [patchId]
  -> adapter.releasePatches(ids)
  -> undefined
```

## Missing command envelope

```txt
commandId
runtimeSessionId
runId
controllerId
controllerRevision
adapterGeneration
patchId
patchKey
expectedMembership
expectedConsumerRevisions
reason: Prime | FocusEnter | FocusLeave | Restart | Reset | Eviction
```

## Terminal activation statuses

```txt
Accepted
Degraded
Duplicate
Stale
CapacityRejected
PhysicsRejected
RenderRejected
Failed
RolledBack
Cancelled
Retired
```

## Terminal release statuses

```txt
Released
AlreadyReleased
Stale
Partial
Failed
RolledBack
Cancelled
Retired
```

## Interaction map

```txt
ready candidate
  -> validate command
  -> reserve mandatory resources
  -> prepare consumer candidates
  -> validate overflow and capacity
  -> commit controller and consumers
  -> publish activation result
  -> await visible frame ack

release intent
  -> retain durable intent until settlement
  -> prepare consumer retirement
  -> commit controller and consumers
  -> publish release result
  -> fence late callbacks
```

## Completion gate

Every ready or released patch intent must settle once, remain queryable, and produce either a complete accepted state or a restored predecessor. Raw undefined-return adapter calls are not sufficient evidence.
