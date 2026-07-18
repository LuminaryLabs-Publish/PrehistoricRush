# Streamed Collision Gameplay Loop

**Timestamp:** `2026-07-18T13-39-48-04-00`

## Interaction loop

```txt
player advances
  -> patch focus changes
  -> controller activates/releases patches
  -> collider membership is rebuilt and synchronized

simulation tick
  -> product computes next player state
  -> submits kinematic motion request
  -> Core Physics steps and emits contacts
  -> fallback sampler scans product collider view
  -> resolution policy selects physics contact or fallback collision
  -> collision fails run, otherwise movement/pickups/goal settle
```

## Current collision semantics

```txt
player jumpHeight >= 1.05
  -> fallback query disabled

fallback overlap
  -> planar distance < tree radius + player radius

physics contact
  -> fatal when player actor or hazard/tree tags are present

resolution precedence
  -> physics contact first
  -> fallback collision second
```

## Finding

Both observation sources can decide the same gameplay outcome, but their evidence is not bound to one collider membership generation. The resolution policy preserves precedence but does not classify:

```txt
both sources agree
physics-only hit
fallback-only hit
sources identify different collider IDs
source used stale membership
provider sync was pending or rejected
```

## Required gameplay settlement

`CollisionObservationArbitrationResult` should preserve current physics-first behavior while recording both evidence paths, membership generation, selected collider, rejected evidence and reason.

## Compatibility constraints

- Preserve jump clearance at `1.05` until tuned fixtures exist.
- Preserve current tree collider radii and player radius.
- Preserve deterministic route/tree generation.
- Preserve physics-first outcome precedence.
- Preserve fallback collision availability for provider loss or incomplete contact reporting.
- Preserve run-over transition payload shape or version it explicitly.

## Required fixtures

- Same collider hit reported by both sources.
- Physics-only hit.
- Fallback-only hit.
- Different collider IDs in one tick.
- Patch release immediately before collision query.
- Restart with stale prior-run observation.
- Jump-threshold boundary.
- Deterministic replay with identical seed and inputs.