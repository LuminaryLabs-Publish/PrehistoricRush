# Stream Readiness Audit: Required Corridor Commit Contract

**Timestamp:** `2026-07-11T17-39-47-04-00`

## Summary

Desired patch membership is not the same as movement readiness. The runtime needs a smaller, explicit required corridor whose terrain, height, collision, pickup and render consumers must commit before movement can cross its frontier.

## Plan ledger

**Goal:** define a bounded readiness contract that uses the existing patch controller and consumer transactions.

- [x] Distinguish desired, retained, prefetched and movement-required patch sets.
- [x] Define readiness receipts per consumer.
- [x] Define commit and stale-result rules.
- [x] Define latency and failure policies.
- [ ] Implement and validate later.

## Set model

```txt
desiredActive
  visual/gameplay neighborhood requested by controller policy

retained
  cached or still-installed patches kept for continuity

prefetched
  probable future patches generated ahead of use

requiredCorridor
  minimal patch set that must be authoritative for the next admitted movement horizon
```

## Required corridor identity

```txt
RequiredCorridor {
  runSessionId
  streamEpoch
  origin
  predictedEnd
  routeIndexRange
  patchIds[]
  safetyHorizonSeconds
  fingerprint
}
```

## Required patch receipt

```txt
RequiredPatchReceipt {
  patchId
  patchContentHash
  controllerMembershipRevision
  terrainConsumerRevision
  heightConsumerRevision
  colliderDescriptorRevision
  rapierMembershipRevision
  pickupConsumerRevision
  renderConsumerRevision
  status
}
```

## Commit rule

A corridor is `READY` only when every required patch has accepted receipts from every required consumer. Prefetch and retained patches may remain partial, but they cannot satisfy movement admission until promoted through the same commit authority.

## Failure and latency policy

```txt
missing generation
  request/pump and defer or cap movement

consumer preparation failure
  reject corridor commit and preserve predecessor revision

stale Worker response
  reject by stream epoch and request identity

partial consumer activation
  roll back or keep patch non-ready

readiness timeout
  return typed degraded/failed result; never silently switch authority
```

## Required observations

```txt
current required corridor
ready patch count
missing generation count
pending consumer count
readiness frontier distance
movement policy
last accepted readiness revision
last failure reason
```
