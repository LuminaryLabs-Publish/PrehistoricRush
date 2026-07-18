# Streamed Collider Convergence DSK Map

**Timestamp:** `2026-07-18T13-39-48-04-00`

## Current ownership

```txt
prehistoric-patch-generator
  -> emits tree collider records per patch

seeded-world-patch-controller-kit
  -> admits and releases patch membership

three-patch-stream-adapter-kit
  -> owns collidersByPatch
  -> rebuilds ordered flattened collider view
  -> calls corePhysics.syncColliders(complete view)
  -> exposes collider view to fallback sampler

core-physics-kit + rapier-physics-domain-kit
  -> synchronize collider descriptors
  -> step physics
  -> publish physics.frame contacts

prehistoric-rush-domain-kit
  -> registers fallback collision observation source

prehistoric-rush-resolution-policy
  -> chooses physics contact first, fallback hit second
  -> settles run failure
```

## Ownership gap

No single DSK owns the accepted collider-membership generation from patch admission through provider synchronization, fallback indexing, observation arbitration, stale rejection, retirement and proof.

## Proposed parent domain

`prehistoric-rush-streamed-collider-membership-physics-fallback-convergence-authority-domain`

```txt
n:prehistoric-rush:collision-convergence
├─ membership-generation
├─ patch-delta
├─ provider-synchronization
├─ fallback-index
├─ observation-arbitration
├─ retirement
├─ diagnostics
└─ proof
```

## Command/result boundary

```txt
ColliderMembershipGenerationAdmissionCommand
  -> ColliderMembershipGenerationResult

PatchColliderDeltaCommand
  -> PatchColliderDeltaResult

PhysicsColliderSynchronizationCommand
  -> PhysicsColliderSynchronizationResult

CollisionObservationArbitrationCommand
  -> CollisionObservationArbitrationResult

CollisionProjectionCommitCommand
  -> CollisionFrameDigest
  -> FirstCollisionBoundFrameAck
```

## Required invariants

- One membership generation identifies the active collider set.
- Added, retained and removed colliders are explicit.
- Provider synchronization returns an accepted result.
- Fallback queries consume the same accepted generation.
- Physics/fallback agreement, disagreement and missing evidence are classified.
- Stale patch or provider results cannot settle a later run.
- Collider retirement is explicit and observable.
- Collision outcomes include the accepted membership generation.

## Compatibility boundary

Preserve deterministic patch generation, current collision radii, jump clearance, physics-first precedence, fallback availability, route tuning, pickup behavior and existing run outcomes until executable parity is established.