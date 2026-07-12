# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T22-38-54-04-00`

## Summary

The leading gameplay gap is run-step outcome arbitration. Movement, collision, pickups and goal completion mutate through different owners, allowing a same-step goal to skip collision checks and a collision failure to be followed by reward mutation. The public-host capability, creator, streaming, collider, cadence, readiness, frame, reset and lifecycle gaps remain open.

## Plan ledger

**Goal:** keep every unresolved outcome, host, creator and runtime dependency explicit and close them through existing owners in dependency order.

- [x] Preserve creator and runtime gap history.
- [x] Preserve the public-host capability and read-model gaps.
- [x] Add goal/collision/pickup precedence and terminal-frame gaps.
- [x] Add outcome-policy, event-order and idempotency fixtures.
- [ ] Close gaps through existing subsystem owners in dependency order.

## Run-step outcome gaps

```txt
movement and distance commit before collision admission
goal is checked inside engine tick before host physics
same-step goal can suppress Rapier and fallback collision checks
no explicit collision-versus-goal policy
collision failure does not stop the same host block
collectShard has no active-run status guard
ShardCollected can emit after RunFailed
no collision-versus-pickup policy
no goal-versus-pickup policy
no failed-movement retention policy
no frozen terminal reward set
no runStepId or predecessor revision
no immutable candidate set
no typed continue/fail/win arbitration result
no atomic movement/reward/status/transition commit
no ordered terminal event bundle
no outcome policy version or outcomeRevision
```

## Collision-source gaps

```txt
Rapier contacts and XZ fallback reduce immediately to boolean OR
source disagreement is not recorded
fallback descriptors lack committed membership revision
contacts lack patch, run-step and outcome identity
query failure can be indistinguishable from no collision
```

## Terminal-frame gaps

```txt
renderer samples final mutable run state
HUD independently formats the same mutable state
no terminal frame receipt
no runStepId or outcomeRevision in scene/HUD output
win frame does not prove collision arbitration completed
run-over frame does not prove reward set was frozen
transition request is not visible-frame acknowledgement
```

## Public host capability gaps

```txt
live Nexus Engine instance exposed
live physics API exposed
live Three adapter exposed
live patch controller exposed
live camera-follow service exposed
scene, renderer, camera and Object3D references reachable
active patch, collider and run mutations reachable
no capability descriptor
no command envelope or command ID
no expected run/epoch admission
no duplicate or stale-command result
no raw-owner quarantine
future host commands could bypass run-step outcome authority
```

## Public read-model gaps

```txt
getState independently samples mutable owners
no committedFrameId or runStepId
no runtimeSessionId or hostGeneration
no shared run/stream/Worker/collider/frame epoch set
no profile or world-content fingerprint correlation
no outcome/event/transition/render/HUD commit correlation
no immutable deep-detached read model
no bounded command/read journal
```

## Retained creator and runtime gaps

```txt
creator draft dirty-field and durable commit authority
preview descriptor convergence and projection-correct framing
profile/game fingerprint parity
patch activation/release acknowledgement
exact collider retirement and contact provenance
30/60/120 Hz stream cadence and hidden-tab policy
world readiness before movement
committed gameplay-frame receipts
coordinated run/stream/Worker/collider/frame epochs
startup rollback and ordered disposal
```

## Missing proof matrix

```txt
goal-only, collision-only and pickup-only fixtures
goal + collision precedence fixture
collision + pickup terminal reward fixture
goal + pickup fixture
all-three candidate fixture
Rapier/fallback disagreement fixture
terminal event ordering fixture
outcome idempotency fixture
terminal scene/HUD frame parity fixture
public owner isolation fixture
unsupported/stale/duplicate host command fixtures
committed read-model coherence and immutability fixtures
creator, streaming, collider, cadence, readiness, reset and lifecycle fixtures
browser and Pages terminal-outcome smoke
```

## Priority

```txt
1. route/profile handoff proof
2. creator draft/commit/preview authority
3. patch activation/release
4. collider replacement/collision admission
5. run-step outcome arbitration and terminal frame
6. cadence and world readiness
7. committed gameplay frame/read model
7a. public host gateway
8. coordinated reset epochs
9. lifecycle and disposal
```

## Do not do next

```txt
do not work on TheCavalryOfRome
do not create a branch
do not encode outcome precedence through source placement
do not allow direct fail, win or reward mutation outside the step commit
do not add a second run-state store, physics world or pickup inventory
do not let the public host bypass the outcome authority
do not build a read model by independently sampling mutable owners
do not treat transition submission or mutable state as visible-frame proof
```
