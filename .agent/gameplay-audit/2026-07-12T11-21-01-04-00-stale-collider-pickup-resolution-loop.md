# Gameplay Audit: Stale Collider and Pickup Resolution Loop

**Timestamp:** `2026-07-12T11-21-01-04-00`

## Summary

Gameplay outcome resolution is authoritative inside `core-simulation`, but its collision and pickup evidence can be stale relative to the world rendered immediately afterward.

## Plan ledger

**Goal:** guarantee that collision, pickup, goal and terminal results are evaluated against the exact content revision shown to the player.

- [x] Trace movement, collision, pickup and goal resolution.
- [x] Trace post-tick patch release and activation.
- [x] Identify player-visible consequence paths.
- [ ] Add revisioned admission, rollback and gameplay fixtures.

## Gameplay loop

```txt
input
  -> movement proposal
  -> pickup proposal from adapter.view.pickups
  -> Rapier contact observation from installed colliders
  -> fallback collision observation from adapter.view.colliders
  -> outcome policy
  -> state/events/transition commit
  -> post-tick content mutation
  -> render
```

## Consequences

```txt
invisible failure
  player collides with predecessor collider
  failure commits
  patch releases before render
  obstacle is absent from the displayed failure frame

unadmitted obstacle
  patch activates after tick
  tree appears before its collider participates in outcome resolution

unadmitted pickup
  patch activates after tick
  shard appears before pickup sampling can collect it

split failure
  state commit succeeds
  content or physics synchronization fails
  no cross-participant rollback restores parity
```

## Required gameplay result

```txt
OutcomeContentProvenance {
  runEpoch,
  tickRevision,
  activeContentRevision,
  patchDigest,
  colliderDigest,
  pickupDigest,
  acceptedPickupIds,
  collisionResult,
  goalResult,
  transition
}
```

The gameplay state, events, transition, visible content and public readback must reject mixed revisions rather than presenting a plausible but unprovable frame.
