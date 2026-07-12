# Reset Lifecycle Audit: Run Generation and Participant Barrier Contract

**Timestamp:** `2026-07-12T16-11-48-04-00`

## Summary

A new product `runId` is not enough to prove a new runtime generation. Stateful engine, streaming, Worker, renderer and host participants need one barrier that prevents predecessor work from crossing the reset boundary.

## Plan ledger

**Goal:** define generation, participant, prepare/commit/rollback and stale-work rules for coordinated run reset while keeping terminal runtime disposal separate.

- [x] Identify reset-capable and non-reset participants.
- [x] Identify asynchronous work that can cross restart.
- [x] Define the barrier and generation tokens.
- [x] Define preservation versus clearing policy.
- [x] Define terminal disposal as a separate lifecycle.
- [ ] Implement and execute the contract.

## Identity model

```txt
runtimeSessionId
runtimeGeneration
runId
runGeneration
resetTransactionId
participantRevision
workerRequestGeneration
activeContentRevision
visibleFrameId
```

`runId` is product-facing. `runGeneration` is the cross-domain authority used to reject stale work.

## Barrier phases

```txt
idle
  -> admitting
  -> preparing
  -> committing
  -> committed
  -> awaiting-visible-frame
  -> complete

failure path:
preparing/committing
  -> rolling-back
  -> rolled-back | rollback-failed
```

## Participant policy classes

```txt
clear
  product input, simulation resolution, motion intent/frame history,
  physics request/frame state, transient articulation targets

reinitialize
  player body transform, camera state, active content and colliders

preserve-with-revision
  deterministic route, player profile, procedural creature descriptor,
  immutable generated patch cache when policy admits it

generation-fence
  Worker requests, asynchronous patch results, browser input events

terminal-only-dispose
  Worker listener/termination, RAF, browser listeners, Three resources,
  engine/provider teardown and public host removal
```

## Worker rule

Every request and response must cite `runtimeSessionId` and `runGeneration`. A response from a predecessor generation may be retained only through an explicit immutable-cache policy; it cannot silently become active content for the new run.

## Patch-controller rule

The controller already offers `reset()`. The product must choose and record one policy:

```txt
clear-all
preserve-immutable-cache-clear-active
preserve-cache-and-inflight-with-generation-fence
```

Current behavior implicitly preserves everything and records no policy.

## Physics rule

The new run cannot commit until the player body, queued requests, collider set and published physics frame are either reset or explicitly rebound to the next generation.

## Public readback rule

A readback snapshot is coherent only when every required participant revision cites the same `runGeneration`. Mixed snapshots must be marked `reset-in-progress` rather than presented as a committed run.

## Disposal boundary

Run restart must not destroy reusable page resources. Runtime stop/navigation must separately cancel RAF, remove listeners, dispose Worker executor, terminate the Worker, clear public globals, dispose renderer/geometry/material resources and release engine/provider ownership.