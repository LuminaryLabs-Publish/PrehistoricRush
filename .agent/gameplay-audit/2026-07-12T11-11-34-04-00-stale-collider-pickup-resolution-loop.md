# Gameplay Audit: Stale Collider and Pickup Resolution Loop

**Timestamp:** `2026-07-12T11-11-34-04-00`

## Plan ledger

**Goal:** ensure the player's movement, collision, collection and goal outcome are evaluated against one world snapshot.

- [x] Trace the player-facing run loop.
- [x] Identify stale evidence paths.
- [x] Define the gameplay invariant.
- [ ] Execute traversal and patch-boundary fixtures.

## Player loop

```txt
steer, boost or jump
  -> advance candidate run state
  -> sample pickups
  -> move kinematic dino
  -> observe collisions
  -> resolve continue, pickup, failure or win
  -> update streamed world
  -> render
```

## Defect class

The apparent single gameplay frame spans two content states:

```txt
state A: used for pickup and collision outcome
state B: shown after patch release/activation
```

### Released collider

A collider from state A can terminate the run even though its patch is removed before state B is rendered.

### Activated collider

A collider introduced in state B is visible but cannot affect the already committed outcome. Collision is delayed until a later step.

### Activated pickup

A pickup introduced in state B is visible but was absent from the current pickup proposal. Collection is delayed until the next step even when the player overlaps it.

### Accepted pickup removal

Accepted pickup removal is performed by the browser adapter after commit. The committed frame does not prove which visible pickup set was updated or whether removal completed before presentation.

## Required gameplay invariant

```txt
For every committed run step:
  candidate movement,
  collision observations,
  pickup observations,
  goal evaluation,
  committed run state,
  visible obstacles,
  visible pickups
must cite one ActiveContentSnapshot revision.
```

No terminal transition should become visible until the compatible content frame is committed or an explicit terminal overlay receipt proves the intentional presentation ordering.
