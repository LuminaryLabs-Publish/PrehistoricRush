# Architecture Audit: Fixed Collider Retirement DSK Map

**Timestamp:** `2026-07-11T14-20-32-04-00`

## Summary

Patch release, physics membership and gameplay collision are currently separate mutation paths. The correct boundary is a composed domain under the existing patch activation authority, not another standalone physics system.

## Plan ledger

**Goal:** map ownership so one committed patch membership controls visual objects, fixed colliders, contacts and run failure.

- [x] Map existing authorities.
- [x] Identify split ownership.
- [x] Define parent domain and child kits.
- [x] Define transaction order.
- [ ] Implement after route/profile P0.

## Current authority split

```txt
seeded-world-patch-controller-kit
  owns desired/cache/ready/release bookkeeping

Three adapter
  owns activePatches, visible tree cells and view.colliders

rapier-physics-domain-kit
  owns live Rapier world, bodies, colliders and contacts

prehistoric-rush-domain-kit
  owns run state and fail transition

src/game.js host
  manually connects all four
```

## Failure boundary

```txt
controller release
  -> adapter removes visual membership
  -> adapter submits smaller collider list
  -> ProtoKit state shrinks
  -> ProtoKit runtime maps do not shrink
  -> contact path still sees removed collider
  -> host admits contact
  -> game domain commits failure
```

## Required composed domain

```txt
prehistoric-rush-fixed-collider-authority-domain
  patch-collider-identity-kit
  collider-membership-revision-kit
  fixed-collider-replacement-plan-kit
  fixed-collider-retirement-kit
  rapier-collider-removal-adapter-kit
  collider-retirement-result-kit
  collision-contact-observation-kit
  collision-contact-admission-kit
  collision-source-parity-kit
  run-failure-transaction-kit
  collision-journal-kit
  collision-render-correlation-kit
  stale-collider-fixture-kit
```

## Ownership rules

```txt
patch controller:
  may propose active/released patch IDs
  may not declare physics retirement complete

render adapter:
  consumes committed membership
  may not author gameplay collision truth

Rapier adapter:
  owns exact live body/collider membership and retirement
  must return acknowledged replacement result

collision admission:
  owns current hazard contact acceptance/rejection
  may not infer membership from a stale runtime map

game domain:
  owns one terminal failure mutation
  consumes an admitted collision result only
```

## Transaction

```txt
1. Build next patch collider membership.
2. Diff previous and next collider IDs.
3. Validate identity, patch ownership, shape and tags.
4. Remove retired Rapier collider instances.
5. Remove retired fixed bodies.
6. Create/update added and retained IDs.
7. Commit colliderMembershipRevision.
8. Publish detached replacement result.
9. Step physics and tag contacts with the revision.
10. Admit current hazard contacts only.
11. Commit at most one run failure.
12. Correlate terminal frame and host readback.
```

## Integration rule

P1 patch activation/release and P1a collider retirement must share one revision and acknowledgement chain. The product host should coordinate services, not retain hidden physics membership itself.
