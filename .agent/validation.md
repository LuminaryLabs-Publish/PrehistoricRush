# Validation: PrehistoricRush Run Start/Restart Authority

**Updated:** `2026-07-12T09-01-44-04-00`

## Scope

Documentation-only review through repository revision `8bcd73f92990284819b8b4af07c385c978835d2b`.

## Plan ledger

**Goal:** distinguish the implemented pure outcome-policy baseline from missing executable proof for authoritative initial start and restart.

- [x] Compare the Publish inventory and central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` after avoiding active AetherVale/TheOpenAbove documentation writes.
- [x] Compare the previous documentation head with current `main`.
- [x] Review the changed product domain, resolution policy, game host, runtime pins, package and test.
- [x] Confirm `core-simulation` is required and installed.
- [x] Confirm run/pickup/goal proposals and physics/fallback observations.
- [x] Confirm collision/pickup/goal precedence in source and pure tests.
- [x] Confirm start/retry still mutates outside the authoritative tick.
- [x] Change no runtime source, dependencies or deployment configuration.
- [x] Create no branch or pull request.

## Executable proof currently present

```txt
npm test command exists
pure resolution-policy test exists
continue case
win case
fatal collision case
collision beats goal
collision rejects same-step pickups
pickup then goal
duplicate pickup idempotency
fallback collision
structured-clone output
```

## Proof currently absent

```txt
real Nexus Engine tick integration fixture
Rapier provider execution fixture
initial start transaction fixture
retry transaction fixture
cross-consumer reset rollback fixture
stale Worker/stream generation fixture
first committed tick receipt
first visible frame receipt
public readback epoch-parity fixture
browser/Pages start-retry smoke
```

## Commands not run in this pass

```txt
npm test
browser smoke
Pages smoke
```

The connector supplied current source and write access but no checked-out runtime. No new executable claim is made by this documentation pass.

## Change-state validation

```txt
runtime source changed by audit: no
gameplay changed by audit: no
physics changed by audit: no
streaming changed by audit: no
render behavior changed by audit: no
package/dependencies changed by audit: no
deployment changed by audit: no
branch created: no
pull request created: no
.agent documentation changed: yes
```

## Completion boundary

Do not claim authoritative start/restart until initial boot and retry commit one run epoch across run/input state, simulation, physics, streaming, active content, camera, scene transition, public readback and first visible frame, with rollback and stale-result rejection.
