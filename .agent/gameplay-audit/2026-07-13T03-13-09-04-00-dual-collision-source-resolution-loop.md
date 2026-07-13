# Gameplay Audit: Dual Collision Source Resolution Loop

**Timestamp:** `2026-07-13T03-13-09-04-00`

## Summary

Each game tick can evaluate the candidate player state through both Rapier/Core Physics and host fallback collision math. The resolution policy chooses physics first, but the gameplay frame records no convergence result.

## Plan ledger

**Goal:** preserve fail/pickup/goal precedence while making collision source selection explicit and deterministic.

- [x] Trace movement proposal and kinematic request creation.
- [x] Trace Core Physics and fallback observations.
- [x] Trace collision precedence before pickup and goal resolution.
- [x] Identify missing parity and stale-collider controls.
- [ ] Replace implicit source precedence with a typed decision later.

## Current loop

```txt
candidate run state
  -> motion request
  -> Core Physics step/contact frame
  -> fallback radius check against view.colliders
  -> resolution policy:
       physics fatal contact
       else fallback hit
       else pickup/goal/continue
  -> committed state
```

## Semantic differences

```txt
Core Physics
  body/collider shapes
  provider contact generation
  kinematic target and collision frame

fallback
  horizontal center distance
  descriptor radius + player radius
  jumpHeight cutoff at 1.05
  no provider contact manifold
```

These are related but not proven equivalent semantics.

## Required gameplay result

```txt
CollisionDecisionResult {
  outcome: no-hit | hit | degraded | disagreement | rejected,
  canonicalSource,
  physicsEvidence,
  fallbackEvidence,
  colliderSetRevision,
  acceptedColliderId,
  rejectionReasons
}
```

## Required precedence

A canonical collision hit must continue to beat pickups and goal completion. A source disagreement must follow an explicit policy rather than being hidden by array order or source precedence.