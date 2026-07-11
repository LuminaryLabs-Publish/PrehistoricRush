# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T15-59-12-04-00`

## Summary

The game still has unresolved route/profile, patch, collider and committed-frame gates. This audit adds the concrete P3 reset gap: retry replaces only the product run/input resources while process-lifetime streaming, physics, rendering and browser owners remain live.

## Plan ledger

**Goal:** keep every prerequisite and restart risk explicit so implementation extends existing owners in dependency order.

- [x] Preserve route/profile gaps.
- [x] Preserve patch activation/release gaps.
- [x] Preserve collider/collision gaps.
- [x] Preserve committed-frame and host gaps.
- [x] Add run/stream/collider/Worker/frame epoch reset gaps.
- [x] Add concrete pickup and input reset failures.
- [x] Add fixture requirements.
- [ ] Close gaps through existing domains and kits.

## Route and profile gaps

```txt
game.html and charactercreator.html are absent
game does not consume the saved profile as creature source
profile writes lack transaction/fingerprint/conflict authority
creator, creature, collision and frame do not share profile identity
```

## Patch activation and release gaps

```txt
controller delivery state advances before consumer acknowledgement
terrain, trees, grass, pickups, colliders and height mutate sequentially
no detached plan, rollback or shared membership revision
release does not prove every consumer retired
```

## Collider and collision gaps

```txt
fixed-collider submission is not exact replacement
removed Rapier bodies/colliders can remain live
contacts lack patch/membership/source/epoch identity
Rapier contact and XZ fallback are competing authorities
terminal failure is not a typed single-commit result
```

## Committed-frame and host gaps

```txt
no frame identity or ordered stage receipts
render and HUD have no product commit results
no committed/failed frame pointer
host independently samples mutable owners
host exposes raw engine, physics, adapter, controller and camera
```

## Run/reset epoch gaps

```txt
numeric runId exists only in product RunState
no runtimeSessionId or runSessionId
no streamEpoch, colliderEpoch, workerGeneration or frameEpoch
controller/cache/queue/Worker survive retry
active patch and consumer maps survive retry
Rapier world/actor/colliders survive retry
RAF and host survive without generation transfer
old responses, contacts and frames are not rejected
```

## Concrete retry projection gap

```txt
previous run collects shard
  -> collected ID filters shard from view.pickups
  -> Retry creates new state with empty collected IDs
  -> active patch IDs remain unchanged
  -> no activation/release occurs
  -> rebuildActiveContent does not run
  -> shard remains absent in the new run
```

## Browser input gap

The engine `InputState` is replaced during `game.start()`, but the host-level `input.left`, `input.right` and `input.boost` booleans are not cleared. A held or stale browser input can be projected into the first tick of the new run.

## Reset failure-path gaps

```txt
no staged reset plan
no consumer prepare/commit receipts
no rollback stack
no duplicate command policy
no partial-reset failure result
no first committed new-run frame acknowledgement
```

## Missing proof matrix

```txt
route/page/profile fixture
patch activation/release parity fixture
exact collider replacement fixture
collision admission fixture
committed-frame coherence fixture
retry pickup reprojection fixture
external input reset fixture
stale Worker generation fixture
stale contact/collider epoch fixture
stale frame receipt fixture
reset rollback and idempotency fixtures
first-frame run-epoch browser smoke
runtime lifecycle/disposal fixture
Pages retry parity smoke
```

## Priority

```txt
1. route/page/profile authority
2. patch activation/release transaction
2a. collider retirement and collision admission
3. committed-frame observation
4. run/stream/collider/Worker/frame epoch reset
5. runtime lifecycle and disposal
```

## Do not do next

```txt
do not work on TheCavalryOfRome
do not create a branch
do not add a second engine, controller, physics world or RAF
do not use numeric runId as a complete epoch family
do not preserve pickup/collider projections merely because patch IDs match
do not accept prior-run Worker, contact or frame evidence
```
