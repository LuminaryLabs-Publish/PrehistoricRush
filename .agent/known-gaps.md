# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T14-20-32-04-00`

## Summary

Route/profile authority remains P0. This pass adds a source-confirmed P1a gap: patch release removes collider descriptors from the current browser view, but the pinned Rapier ProtoKit does not remove fixed bodies or collider instances omitted from later `setFixedColliders()` calls. Invisible retired trees can remain fatal.

## Plan ledger

**Goal:** keep route, profile, patch, collider, physics, gameplay, render and lifecycle risks explicit before implementation.

- [x] Preserve route/profile, patch activation, visual identity, reset and lifecycle gaps.
- [x] Record fixed-collider membership divergence.
- [x] Record stale Rapier body/collider retention.
- [x] Record contact provenance and dual-authority gaps.
- [x] Record required fixture matrix.
- [ ] Close the collider gap through the existing patch/physics boundaries.

## Route and profile gaps

```txt
- game.html and charactercreator.html are absent
- game does not consume the saved profile
- profile writes lack transaction/fingerprint/conflict authority
- creator, creature, collision and frame do not share one profile identity
```

## Patch activation and release gaps

```txt
- controller ready/release evidence precedes consumer acknowledgement
- terrain, trees, grass, pickups, colliders and height mutate sequentially
- no detached activation/release plan, rollback or shared consumer revision
- no patchReleaseResult proves every consumer retired the patch
- controller-active and consumer-active parity is not executable-proofed
```

## Fixed collider retirement gaps

```txt
- setFixedColliders behaves as add/update, not authoritative replacement
- state.colliders can omit an ID still present in runtime.fixedBodies
- state.colliders can omit an ID still present in runtime.fixedColliders
- removed Rapier bodies/colliders are never removed from the world
- no removeFixedCollider or replaceFixedColliders service exists
- no retirement result reports added, retained, updated and removed IDs
- patch release does not wait for physics retirement acknowledgement
```

## Collision admission gaps

```txt
- collectContacts iterates runtime.fixedColliders rather than current state membership
- a Rapier intersection can be emitted for an ID absent from state.colliders
- product accepts any contact whose actorId is dino
- contact lacks patch ID, tags, membership revision and source revision
- no contact-enter/contact-stay/contact-exit distinction exists
- no duplicate-contact or one-failure-per-run result exists
```

## Shape and source parity gaps

```txt
- visual trunk is tall geometry
- Rapier tree collider is a ground-centered ball
- fallback is XZ radius plus jumpHeight threshold
- fallback ignores collider Y and trunk height
- Rapier can see stale colliders while fallback sees current descriptors only
- no parity result explains which source caused the failure
```

## Run/session and lifecycle gaps

```txt
- retry has no shared runtime/run/stream/collider epoch
- old contacts and fixed colliders have no reset acknowledgement
- RAF/listeners/Worker/executor/Three/Rapier owners remain unbounded
- public host exposes mutable owners and cannot be revoked
- no ordered idempotent stop/dispose result exists
```

## Missing proof matrix

```txt
page manifest and profile handoff
patch prepare/commit/release parity
fixed collider exact-replacement fixture
removed Rapier body/collider count fixture
released-patch invisible-tree fixture
current membership contact-admission fixture
Rapier/fallback shape and result parity fixture
duplicate contact to single failure fixture
retry collider epoch fixture
terminal collision frame correlation fixture
runtime disposal and host revocation fixtures
```

## Priority

```txt
1. route artifact integrity and profile handoff
2. patch activation/release transaction
2a. fixed collider retirement and collision admission
3. visual identity and committed frame
4. run/session/stream/collider epoch
5. runtime lifecycle, disposal and host revocation
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not add a second standalone collision world
- do not clear only serialized collider state
- do not accept all actor contacts as fatal
- do not claim patch release parity without removing Rapier resources
```
