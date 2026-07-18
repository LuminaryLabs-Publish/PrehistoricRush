# Collision Command and Result Map

**Timestamp:** `2026-07-18T13-39-48-04-00`

## Current implicit flow

```txt
patch activation/release
  -> mutate collidersByPatch
  -> rebuild complete ordered collider array
  -> corePhysics.syncColliders(array)

simulation proposal
  -> submit player motion

observation phase
  -> corePhysics.step(tick) -> physics.frame
  -> collisionSampler(nextState) -> fallback-collision

resolution
  -> physics fatal contact wins
  -> fallback wins only when physics has no fatal contact
  -> run-over transition
```

## Missing explicit commands/results

```txt
ColliderMembershipGenerationAdmissionCommand
  -> ColliderMembershipGenerationResult

PatchColliderDeltaCommand
  -> PatchColliderDeltaResult

PhysicsColliderSynchronizationCommand
  -> PhysicsColliderSynchronizationResult

FallbackCollisionIndexCommitCommand
  -> FallbackCollisionIndexResult

CollisionObservationArbitrationCommand
  -> CollisionObservationArbitrationResult

CollisionProjectionCommitCommand
  -> CollisionFrameDigest
  -> FirstCollisionBoundFrameAck
```

## Result classifications

```txt
membership: accepted | unchanged | rejected-stale | invalid
provider sync: applied | retained | partially-applied | failed | retired
observation: agree | physics-only | fallback-only | divergent | no-hit
outcome: continue | fail | retry-provider | reject-stale
```

## Required identifiers

```txt
runId
tickId
worldSeed
patchControllerGeneration
patchId
colliderMembershipGeneration
colliderContentDigest
physicsProviderRevision
physicsSyncRevision
fallbackIndexRevision
frameId
```

## Public snapshot additions

Expose only stable diagnostics:

```txt
collision.membershipGeneration
collision.activeColliderCount
collision.lastProviderSync
collision.lastArbitration
collision.lastFrameDigest
```

Do not expose mutable provider internals or duplicate collider arrays in public snapshots.