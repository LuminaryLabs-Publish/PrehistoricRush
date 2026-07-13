# Pause Menu Command Generation and Host Retirement Contract

**Timestamp:** `2026-07-13T16-41-10-04-00`

## Summary

The semantic pause DSK is deterministic and clone-safe, but the browser host has no identity or terminal lifecycle. Attach polling, the Escape listener, overlay click listeners and the synchronization RAF can only end through document navigation.

## Plan ledger

**Goal:** give the browser pause host one generation-bound install, projection and retirement contract.

- [x] Identify all host-owned callbacks and nodes.
- [x] Separate semantic DSK ownership from browser adapter ownership.
- [ ] Allocate one host identity and generation per runtime session.
- [ ] Make attach polling cancellable and bounded.
- [ ] Install exactly one Escape listener and one sync scheduler.
- [ ] Track overlay nodes and click listeners as host participants.
- [ ] Reject predecessor callbacks after replacement or retirement.
- [ ] Publish complete, partial or failed retirement receipts.

## Host participants

```txt
runtime-readiness attach poll
Escape keydown listener
menu synchronization RAF
current overlay root
Settings click listener
Exit click listener
public PrehistoricRushPauseMenuHost reference
navigation settlement participant
```

## Installation contract

```txt
PauseMenuHostInstallCommand
  hostId
  hostGeneration
  runtimeSessionId
  expectedRuntimeGeneration
  expectedMenuGeneration
  attachDeadline

result:
  Installed | AlreadyInstalled | RuntimeUnavailable | Stale | Failed | Cancelled
```

A successful install must prove one active Escape listener and one synchronization scheduler. Replacement must retire the predecessor before publishing the successor.

## Retirement contract

```txt
PauseMenuHostRetireCommand
  hostId
  hostGeneration
  reason: Exit | RuntimeRetire | Fatal | Replacement | PageLifecycle

participants:
  cancel attach poll
  cancel sync RAF
  remove Escape listener
  remove overlay and button listeners
  revoke public host reference
  reject late callbacks

result:
  Retired | AlreadyRetired | Partial | Failed | Stale
```

## Evidence

```txt
retirementId
hostGeneration
reason
cancelledCallbackIds
removedListenerIds
removedNodeIds
revokedReference
lateCallbackCount
startedAt
completedAt
boundedErrors
```

## Invariants

1. At most one active host generation exists per runtime session.
2. No retired generation can mutate semantic state or DOM.
3. Duplicate retirement is idempotent.
4. Exit navigation cannot claim settled before mandatory participants return or an explicit timeout policy is applied.
5. Visible-frame acknowledgement cites the same menu and host generations as the accepted command.