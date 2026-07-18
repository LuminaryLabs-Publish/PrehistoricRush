# Collision Browser and Pages Gate

**Timestamp:** `2026-07-18T13-39-48-04-00`

## Required execution matrix

```txt
source fixture
  -> membership ordering and digest
  -> added/retained/removed delta
  -> physics/fallback arbitration

Node integration fixture
  -> real product domain and resolution policy
  -> fake deterministic Core Physics provider
  -> patch activate/release and stale result rejection

browser fixture
  -> real Three.js host and Rapier provider
  -> Worker and synchronous fallback generation
  -> collision parity and restart isolation

built artifact
  -> identical pinned dependency revisions
  -> same collision digest and outcome

GitHub Pages
  -> same-origin module loading
  -> Worker initialization
  -> Rapier initialization
  -> accepted collider generation and collision frame proof
```

## Required scenarios

- Initial 25-position streaming prime.
- One patch activated and one released in the same update.
- Unchanged focus with no membership mutation.
- Provider available and reporting matching contact.
- Provider available with fallback-only hit.
- Provider unavailable with fallback hit.
- Physics/fallback collider-ID divergence.
- Run restart while prior collision evidence exists.
- Worker and deferred synchronous generator parity.

## Gate receipts

```txt
ColliderMembershipGenerationResult
PhysicsColliderSynchronizationResult
CollisionObservationArbitrationResult
CollisionFrameDigest
FirstCollisionBoundFrameAck
```

## Current boundary

The package test script includes syntax and source/contract tests but no real collider membership, Rapier parity, browser, built artifact or Pages collision fixture. No deployment or browser parity claim is made.