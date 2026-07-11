# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T14-20-32-04-00`

## Summary

Complete route/profile authority first. Then extend the existing patch activation transaction so release owns exact Rapier collider replacement, contact provenance and one terminal failure result. Do not solve the stale-collider failure with a parallel collision system.

## Plan ledger

**Goal:** reach a route-safe, profile-bound, patch-consistent and collision-provable product using one patch membership revision and one physics owner.

- [ ] Complete P0 route/profile handoff.
- [ ] Add acknowledged patch activation and release.
- [ ] Add exact fixed-collider replacement/removal in the pinned Rapier ProtoKit.
- [ ] Add typed collision observations and admission.
- [ ] Establish run/stream/collider epochs.
- [ ] Add committed terminal-frame correlation.
- [ ] Preserve later runtime lifecycle and disposal work.

## Phase 0: route and profile authority

- [ ] Add valid `game.html` and `charactercreator.html` hosts.
- [ ] Add a versioned page manifest and deployed route checks.
- [ ] Bind one committed profile fingerprint to creature, collision and frame evidence.
- [ ] Add conflict-safe profile writes and full creator draft commits.

## Phase 1: patch activation and release

- [ ] Prepare terrain, trees, grass, pickups, colliders and height off to the side.
- [ ] Validate patch ownership and content hashes.
- [ ] Commit activation under one `patchMembershipRevision`.
- [ ] Produce a release plan before deleting consumer evidence.
- [ ] Wait for render, pickup, height and physics retirement acknowledgements.
- [ ] Return typed activation/release results.

## Phase 1a: exact fixed collider replacement

- [ ] Add a ProtoKit service that treats the submitted set as authoritative.
- [ ] Diff previous and next collider IDs.
- [ ] Remove retired collider instances from Rapier.
- [ ] Remove retired fixed bodies from Rapier.
- [ ] Delete retired IDs from runtime maps.
- [ ] Add/update retained and new colliders.
- [ ] Commit `colliderMembershipRevision`.
- [ ] Return added, retained, updated, removed and failed IDs.
- [ ] Keep serialized state and runtime maps identical.

## Phase 1b: collision admission

- [ ] Produce a typed contact observation with actor, collider, patch and membership identity.
- [ ] Include hazard tags and contact source.
- [ ] Distinguish contact enter, stay and exit.
- [ ] Reject contacts from retired membership revisions.
- [ ] Admit at most one terminal failure transaction per run.
- [ ] Remove the fallback collision authority or prove exact parity.
- [ ] Correlate the failure result with the first terminal frame and host snapshot.

## Phase 2: run and collider epochs

- [ ] Allocate one `runtimeSessionId` per host.
- [ ] Allocate one `runSessionId` for each accepted start/retry.
- [ ] Allocate `streamEpoch` and `colliderEpoch` together.
- [ ] Reset actor transform, contacts and active collider membership atomically.
- [ ] Reject prior-run contacts and patch responses.

## Phase 3: lifecycle ownership

- [ ] Retain RAF and listener leases.
- [ ] Quarantine Worker/executor callbacks.
- [ ] Add Three and Rapier resource owners.
- [ ] Revoke the public host before disposal.
- [ ] Return idempotent startup/stop/dispose results.

## Candidate collision kits

```txt
patch-collider-identity-kit
collider-membership-revision-kit
fixed-collider-replacement-plan-kit
fixed-collider-retirement-kit
rapier-collider-removal-adapter-kit
collider-retirement-result-kit
collision-contact-observation-kit
collision-contact-admission-kit
collision-source-parity-kit
run-failure-transaction-kit
collision-journal-kit
collision-render-correlation-kit
stale-collider-fixture-kit
```

## Acceptance conditions

```txt
released patch IDs disappear from visual and physics membership together
live Rapier fixed collider IDs equal current submitted IDs
removed fixed bodies and colliders no longer intersect the actor
contact observations carry current patch and membership identity
retired or prior-epoch contacts are rejected
one collision creates one run-failure result
fallback and Rapier cannot disagree silently
terminal frame and host state identify the admitted collision
```

## Future fixture commands

```bash
node scripts/prehistoric-rush-fixed-collider-replacement-fixture.mjs
node scripts/prehistoric-rush-released-patch-collision-fixture.mjs
node scripts/prehistoric-rush-contact-admission-fixture.mjs
node scripts/prehistoric-rush-collision-source-parity-fixture.mjs
node scripts/prehistoric-rush-single-failure-transaction-fixture.mjs
node scripts/prehistoric-rush-collision-terminal-frame-fixture.mjs
node scripts/prehistoric-rush-browser-stale-collider-smoke.mjs
```

## Overall order

```txt
1. Route manifest and profile handoff.
2. Atomic patch activation and release.
3. Exact Rapier fixed-collider replacement.
4. Contact admission and single failure transaction.
5. Visual/physics/terminal-frame parity.
6. Run/stream/collider epochs.
7. Browser runtime lifecycle and ordered disposal.
```

## Do not do next

Do not add a second physics world, patch around the bug only in `src/game.js`, or treat a smaller serialized collider map as proof that retired Rapier objects were removed.
