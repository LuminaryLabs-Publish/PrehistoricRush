# PrehistoricRush Next Steps

**Audit:** `2026-07-18T13-39-48-04-00`  
**Authority:** `prehistoric-rush-streamed-collider-membership-physics-fallback-convergence-authority-domain`

## Intent

Keep current collision behavior while making streamed membership, provider synchronization, fallback queries and resolution evidence deterministic, versioned and provable.

## Checklist

### Phase 1: Membership generation

- [ ] Create `ColliderMembershipGenerationResult` with world, patch-controller, generator, run and provider revisions.
- [ ] Build a deterministic collider content digest from active patch records.
- [ ] Publish explicit added, retained and removed collider IDs.
- [ ] Reject stale patch or run generations.

### Phase 2: Provider synchronization

- [ ] Define whether Core Physics receives full or delta synchronization.
- [ ] Skip synchronization when the membership digest is unchanged.
- [ ] Publish `PhysicsColliderSynchronizationResult` with applied, retained, rejected and retired records.
- [ ] Bind provider errors and retries to the same generation.

### Phase 3: Fallback parity

- [ ] Build the fallback collision index from the accepted membership generation.
- [ ] Attach membership generation to physics and fallback observations.
- [ ] Classify agree, physics-only, fallback-only, divergent and stale evidence.
- [ ] Preserve physics-first outcome precedence until parity fixtures justify a change.

### Phase 4: Lifecycle and proof

- [ ] Publish collider retirement receipts on patch release and run reset.
- [ ] Publish `CollisionFrameDigest` with membership, provider and fallback revisions.
- [ ] Publish `FirstCollisionBoundFrameAck` only when visible and physical patch state share one generation.
- [ ] Include stable collision diagnostics in the public host snapshot.

### Phase 5: Executable proof

- [ ] Run `npm test`.
- [ ] Add membership ordering and delta fixtures.
- [ ] Add a deterministic fake-provider integration fixture.
- [ ] Add real Rapier physics/fallback parity fixtures.
- [ ] Add stale patch, restart and jump-threshold fixtures.
- [ ] Add browser, built-artifact and GitHub Pages collision fixtures.

### Retained work

- [ ] Retire superseded legacy vegetation work.
- [ ] Complete startup failure recovery.
- [ ] Complete foliage family/atlas convergence.
- [ ] Complete pinned-provider admission.
- [ ] Resolve pause/menu input and simulation semantics.
- [ ] Implement parent render-host generation retirement.

## Recommended file cut

```txt
src/world/prehistoric-patch-generator.js
src/render/three-patch-stream-adapter.js
src/game-runtime-lod.js
src/domains/prehistoric-rush/prehistoric-rush-domain-runtime.js
src/domains/prehistoric-rush/prehistoric-rush-resolution-policy.js
tests/collider-membership-convergence.mjs
tests/collision-observation-parity.mjs
tests/browser/collision-convergence.html
```

## Compatibility constraints

Preserve current tree placement, collider radii, player collision size, jump threshold, physics-first precedence, fallback availability, deterministic seed behavior, pickup/goal settlement, run-over payloads and current rendering.