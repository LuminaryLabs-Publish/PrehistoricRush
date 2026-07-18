# Collision Membership and Visible-State Convergence

**Timestamp:** `2026-07-18T13-39-48-04-00`

## Render relevance

Tree visuals and tree colliders originate from the same patch generator, but they settle through different hosts:

```txt
tree visual records
  -> base/tree-fidelity/foliage/production render layers

collider records
  -> collidersByPatch
  -> Core Physics synchronization
  -> fallback collision view
```

The current visible-frame receipts include tree/foliage/production information but do not include the accepted collider-membership generation or provider synchronization result.

## Current evidence

- Generated tree records and tree collider records share patch identity.
- Visual patch layers activate before the base adapter completes its collider synchronization call.
- Patch release retires visual layers and collider membership through separate calls.
- `lushVegetationFrameAck` does not identify collider membership.
- Startup `presentFirstFrame()` does not include a collider generation or synchronization receipt.

## Gap

A visible tree can be proven against tree-fidelity and foliage generations, while its collision authority cannot be proven against the same presented frame. This is a proof gap, not evidence that visible and physical trees currently disagree.

## Proposed proof

```txt
CollisionFrameDigest
  generationId
  activePatchIds
  colliderCount
  colliderContentDigest
  providerRevision
  providerSyncRevision
  fallbackIndexRevision
  retiredColliderIds
  divergenceCount

FirstCollisionBoundFrameAck
  frameId
  presentationId
  collisionFrameDigest
  treeFrameDigest
```

## Required fixtures

- Activate a patch and verify visual/collider patch identity.
- Replace or release a patch and verify both surfaces retire the same generation.
- Render a frame and assert tree and collision digests share active patch IDs.
- Repeat in browser, built artifact and Pages origin.

## Claim boundary

No invisible collider, non-colliding tree, duplicate collision or frame mismatch was reproduced. The audit records missing generation-bound visible/physical proof.