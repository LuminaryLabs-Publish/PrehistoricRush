# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T12-39-53-04-00`

## Summary

Complete route/profile authority first. Then make patch activation transactional, establish run/stream epochs, and finally place RAF, listeners, Worker, executor, Rapier, Three resources and the public host behind one browser runtime-session owner.

## Plan ledger

**Goal:** reach a route-safe, profile-bound and lifecycle-bounded product without creating parallel session, Worker or renderer ownership systems.

- [ ] Complete the P0 route/profile handoff work.
- [ ] Add acknowledged patch activation before changing lifecycle behavior.
- [ ] Establish one session/run/stream epoch family.
- [ ] Add startup rollback and reverse cleanup registration.
- [ ] Add explicit stop/dispose with idempotent results.
- [ ] Add executable lifecycle and stale-result fixtures.

## Phase 0: page route and profile authority

- [ ] Add valid `game.html` and `charactercreator.html` hosts.
- [ ] Add a versioned page manifest and source/deployed route checks.
- [ ] Make one committed profile fingerprint the game creature source.
- [ ] Bind that fingerprint to procedural body, Rapier collision and frame evidence.
- [ ] Add conflict-safe profile writes and complete creator draft commits.

## Phase 1: patch activation authority

- [ ] Validate generated patch content before delivery.
- [ ] Prepare terrain, tree, grass, shard, collider and height changes off to the side.
- [ ] Commit all consumers under one patch activation revision.
- [ ] Return typed activation/release results.
- [ ] Keep controller-active and consumer-active sets in parity.

## Phase 2: run and stream epochs

- [ ] Allocate `runtimeSessionId` once per host session.
- [ ] Allocate `runSessionId` for every accepted start/retry.
- [ ] Allocate `streamEpoch` with each run transaction.
- [ ] Mark Worker requests with session/run/stream identity.
- [ ] Reject stale responses before controller/cache/consumer mutation.
- [ ] Reset input, camera, physics actor/contacts and dynamic pickup state atomically.

## Phase 3: startup transaction

- [ ] Replace ad hoc `main()` acquisition with a typed startup command/result.
- [ ] Create a cleanup stack before the first resource allocation.
- [ ] Register reverse cleanup immediately after each successful acquisition.
- [ ] Do not publish `RUNNING` or `PrehistoricRushHost` until required resources are ready.
- [ ] On failure, execute reverse rollback and return a bounded failure result.

## Phase 4: callback and scheduling ownership

- [ ] Retain the RAF request ID and generation fence.
- [ ] Stop scheduling new frames before disposal begins.
- [ ] Replace anonymous global callbacks with listener leases.
- [ ] Reject input and retry commands outside admitted lifecycle states.
- [ ] Handle `pagehide` and explicit stop through the same disposal transaction.

## Phase 5: Worker and patch executor quarantine

- [ ] Retain executor disposal and Worker termination operations.
- [ ] Add cancel/shutdown protocol or hard termination policy.
- [ ] Retire queued/inflight requests by epoch before termination.
- [ ] Ignore late message callbacks after disposal.
- [ ] Prove fallback synchronous generation follows the same lifecycle contract.

## Phase 6: Three and Rapier resource ownership

- [ ] Add adapter-owned disposal for creature, terrain, tree, grass and shard resources.
- [ ] Dispose geometries, materials, shader materials, skeleton resources and renderer.
- [ ] Remove the renderer canvas from the host.
- [ ] Add Rapier actor, collider and world disposal/reset results.
- [ ] Ensure disposal order prevents rendering or physics after owner release.

## Phase 7: host revocation and observation

- [ ] Replace raw mutable owner exposure with a detached read model.
- [ ] Add host lease/session identity.
- [ ] Revoke command capability before resource disposal.
- [ ] Return lifecycle phase, session/run/stream epochs and resource counts.
- [ ] Keep lifecycle journals bounded and JSON-safe.

## Candidate kits

```txt
runtime-session-id-kit
runtime-lifecycle-state-kit
runtime-startup-command-kit
runtime-startup-transaction-kit
runtime-cleanup-stack-kit
animation-frame-lease-kit
listener-lease-kit
worker-resource-owner-kit
patch-executor-quarantine-kit
stream-epoch-fence-kit
three-resource-owner-kit
rapier-resource-owner-kit
public-host-lease-kit
ordered-runtime-dispose-kit
startup-rollback-kit
lifecycle-result-kit
lifecycle-journal-kit
lifecycle-observation-kit
runtime-lifecycle-fixture-kit
```

## Acceptance conditions

```txt
one admitted startup creates one live runtime session
partial startup failure leaves no Worker, RAF, listener, canvas or global host
retry creates a new run/stream epoch without duplicating host resources
old Worker results cannot activate patches in the new epoch
stop prevents additional engine, physics, streaming or render ticks
all listeners and global leases are removed
Worker/executor, Three and Rapier resources are released in order
dispose is idempotent and returns the same terminal result
post-dispose commands are rejected
host observation is detached, bounded and JSON-safe
```

## Future fixture commands

```bash
node scripts/prehistoric-rush-lifecycle-startup-fixture.mjs
node scripts/prehistoric-rush-startup-rollback-fixture.mjs
node scripts/prehistoric-rush-retry-epoch-fixture.mjs
node scripts/prehistoric-rush-worker-stale-result-fixture.mjs
node scripts/prehistoric-rush-resource-disposal-fixture.mjs
node scripts/prehistoric-rush-host-revocation-fixture.mjs
node scripts/prehistoric-rush-browser-lifecycle-smoke.mjs
```

## Overall order

```txt
1. Route manifest and profile handoff.
2. Atomic patch activation.
3. Run/session/stream epoch authority.
4. Startup transaction and rollback.
5. RAF/listener/Worker/resource ownership.
6. Ordered idempotent disposal and host revocation.
7. Node and browser lifecycle fixtures.
```

## Do not do next

Do not add another runtime loop, add page-specific disposal systems, rely on browser destruction as cleanup, or terminate the Worker without fencing executor callbacks and patch delivery.
