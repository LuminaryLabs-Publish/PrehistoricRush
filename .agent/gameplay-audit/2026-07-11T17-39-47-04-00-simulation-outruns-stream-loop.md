# Gameplay Audit: Simulation Outruns Stream Loop

**Timestamp:** `2026-07-11T17-39-47-04-00`

## Summary

The player advances every simulation tick regardless of whether the route-ahead patch set is generated and fully consumed. Streaming focus follows the already-moved actor, so patch latency can become gameplay latency, collision absence or terrain snapping instead of a controlled admission result.

## Plan ledger

**Goal:** make movement conditional on a bounded route-ahead readiness result while preserving continuous runner feel.

- [x] Trace run movement and surface sampling.
- [x] Trace focus, queue, generation and one-patch activation budget.
- [x] Trace physics and fallback collision after streaming.
- [x] Define ready/degraded/deferred gameplay states.
- [ ] Implement slowdown/defer policy and fixtures later.

## Current frame order

```txt
input
  -> engine.tick
  -> move actor and increase distance
  -> sample patch or fallback height
  -> update streaming after movement
  -> activate at most one ready patch
  -> step physics and test collision
  -> render
```

## Failure modes

```txt
actor enters not-ready patch
  -> no generated terrain consumer
  -> no fixed collider membership
  -> no pickup projection
  -> fallback height controls movement

late activation
  -> terrain and collision appear after entry
  -> camera target can jump
  -> obstacle can become collidable after the actor crossed its prior location

sustained generation lag
  -> player can continue outrunning readiness frontier
  -> distance and win progress continue against degraded world state
```

## Required gameplay policy

```txt
READY
  admit full movement

DEGRADED_DECLARED
  admit only if an explicit deterministic fallback world is part of the contract

SPEED_CAPPED
  reduce speed before the readiness frontier

DEFERRED
  hold simulation movement while animation/UI communicate streaming state

FAILED
  preserve last committed run state and surface a typed failure
```

## Acceptance conditions

```txt
no invisible collision authority gap
no collectible disappears solely because its patch is late
no untyped fallback height consumption
no distance progress beyond admitted world corridor
movement policy remains deterministic for the same readiness sequence
```
