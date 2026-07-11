# Validation: PrehistoricRush

**Updated:** `2026-07-11T02-48-17-04-00`

## Scope

Documentation-only audit of the current start/retry path, run resource reset, seeded patch controller retention, Worker delivery, Three dynamic content, Rapier state, frame ownership and Pages validation boundary.

## Verified by source inspection

```txt
active route: index.html -> src/runtime.mjs -> src/game.js
NexusEngine commit: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits commit: 9546a6fb25b4c6a7b65432df068701a4627ab20f
NexusEngine-ProtoKits commit: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js version: 0.179.1
Rapier version: 0.15.0
parent game domain: prehistoric-rush-domain-kit 0.4.0
core kits declared: 12
official NexusEngine-Kits installed: 4
root package.json: absent
Pages workflow deploys static root on main push
```

## Start/reset facts verified

```txt
game.start increments runId: yes
game.start replaces RunState: yes
game.start replaces InputState: yes
game.start resets collectedShardIds: yes
game.start resets patch controller: no
game.start resets Worker executor/pending work: no
game.start resets adapter activePatches: no
game.start forces dynamic-content rebuild: no
game.start resets Rapier actor/contact state: no explicit service
game.start resets camera/render time: no
typed start/reset result: absent
runSessionId: absent
streamEpoch: absent
```

## Dynamic-content facts verified

```txt
rebuildActiveContent called on patch activation: yes
rebuildActiveContent called on patch release when changed: yes
rebuildActiveContent called on successful shard collection: yes
rebuildActiveContent called unconditionally on start/retry: no
new run may keep same desired active set: yes
old collected shard can remain visually absent without rebuild: possible by current control flow
fixed colliders replaced during rebuild: yes
height sampler closes over activePatches: yes
```

## Worker/controller facts verified

```txt
controller supports reset: yes
controller reset cancels actual Worker promises: no
message executor supports dispose: yes
host retains executor separately: no
host terminates Worker: no
request/result session epoch: absent
explicit total inflight ceiling: absent
controller-active/consumer-active acknowledgement: absent
```

## Documentation output

```txt
required root .agent files updated: yes
new tracker folder: yes
new turn-ledger entry: yes
architecture audit: yes
render audit: yes
gameplay audit: yes
interaction audit: yes
run-session audit: yes
deploy audit: yes
central ledger sync required: yes
central internal change-log required: yes
```

## Runtime validation not performed

```txt
runtime source changed by this pass: no
dependencies changed: no
routes changed: no
rendering changed: no
physics changed: no
deployment workflow changed: no
branch created: no
pull request created: no
retry reset fixture: absent / not run
stream epoch fixture: absent / not run
dynamic-content parity fixture: absent / not run
lifecycle fixture: absent / not run
browser smoke: not run
Pages smoke: not run
target branch: main
```

## Required future proof

```txt
- a new run gets a unique runSessionId
- one start/reset transaction returns per-owner retained/reset/rebuilt decisions
- deterministic patch cache retention is explicit and fingerprinted
- dynamic pickups, colliders and height state reconcile immediately
- stale Worker/controller deliveries are rejected or quarantined
- actor/contact, input, camera and frame state reset before commit
- first post-reset frame carries run session, stream epoch and consumer revisions
- repeated retry creates no duplicate RAF, listeners, Workers or resources
- stop/dispose/restart is terminal, ordered and idempotent
- public host readback is bounded, JSON-safe and contains no live owners
```

## Required fixture commands after implementation

```bash
node scripts/prehistoric-rush-patch-activation-fixture.mjs
node scripts/prehistoric-rush-retry-reset-fixture.mjs
node scripts/prehistoric-rush-stream-epoch-fixture.mjs
node scripts/prehistoric-rush-dynamic-content-reconciliation-fixture.mjs
node scripts/prehistoric-rush-lifecycle-fixture.mjs
```
