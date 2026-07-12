# Validation: PrehistoricRush

**Updated:** `2026-07-11T22-38-54-04-00`

## Summary

This was a documentation-only source audit. It proves the current run-step ordering and its deterministic goal/collision/pickup failure paths. It also preserves the preceding proof that the public browser host exposes raw mutable owners and independently sampled diagnostics. No outcome, host-safety or runtime-correctness claim is made.

## Plan ledger

**Goal:** record exactly what the inspected source proves and separate it from unexecuted runtime, physics, rendering, host-isolation and deployment validation.

- [x] Confirm the selected repository and `main` branch.
- [x] Confirm no branch or pull request was created.
- [x] Compare all Publish repositories with central tracking.
- [x] Read the current product domain, browser host and pinned runtime identities.
- [x] Trace movement, goal, collision, pickup, events, transitions, render and HUD order.
- [x] Confirm `collectShard()` lacks an active-run guard.
- [x] Confirm collision checks run only while state remains `game`.
- [x] Preserve the public-host owner exposure and read-model findings.
- [x] Inventory interaction loops, domains, kits and services.
- [x] Derive outcome, event, frame, host and fixture contracts.
- [ ] Execute Node, Rapier, browser or Pages proof.
- [ ] Implement run-step outcome and host capability authorities.

## Source-backed outcome findings

```txt
engine simulation:
  movement, distance and height mutate
  goal is checked immediately
  win status/event/transition can commit inside engine.tick

host:
  collision and pickups run only when post-tick status remains game
  a win therefore skips same-step collision checks
  collision calls game.fail and emits RunFailed
  the host continues into pickup scanning
  collectShard checks duplicate ID but not active run status
  ShardCollected can therefore follow RunFailed

presentation:
  Three renderer and HUD sample final mutable state
  no runStepId, outcomeRevision or terminal frame receipt exists
```

## Preserved public-host findings

```txt
PrehistoricRushHost exists: yes
raw engine exposed: yes
raw physics service exposed: yes
raw Three adapter exposed: yes
raw patch controller exposed: yes
raw camera-follow service exposed: yes
adapter exposes scene/camera/renderer and mutation services: yes
getState samples multiple mutable owners: yes
committedFrameId in host state: no
shared subsystem epoch set in host state: no
owner quarantine: no
typed public command gateway: no
```

## Static reasoning proof: goal suppresses collision

```txt
1. proposed movement crosses goal and obstacle
2. engine system adds distance
3. distance reaches goalDistance
4. system sets status win and requests win transition
5. host reads state
6. host enters collision block only when status == game
7. collision is not evaluated
8. renderer displays win state
```

## Static reasoning proof: reward after failure

```txt
1. host collision query returns hit
2. game.fail sets run-over
3. RunFailed emits and run-over transition is requested
4. host does not return or re-check status
5. pickup overlap is evaluated
6. collectShard accepts a previously uncollected ID
7. shard count increments and ShardCollected emits
8. renderer displays run-over with the mutated reward total
```

## Validation performed

```txt
GitHub organization inventory comparison
central ledger comparison
repo-local concurrent audit discovery and preservation
recent commit inspection
root .agent presence confirmation
src/game.js inspection
prehistoric-rush-domain-kit.js inspection
pinned runtime version inspection
current kit registry inspection
public object and adapter surface inspection
interaction/domain/kit/service inventory
source-order failure derivation
contract and fixture derivation
documentation consistency review
```

## Validation not performed

```txt
local clone
npm install
Node fixtures
browser automation
Rapier execution
WebGL render smoke
goal/collision/pickup combination execution
event-order readback
terminal screenshot/frame receipt
public-host property traversal or isolation execution
GitHub Pages smoke
deployment workflow run
```

## Change classification

```txt
runtime source changed: no
dependencies changed: no
profile implementation changed: no
route files changed: no
gameplay behavior changed: no
render behavior changed: no
physics behavior changed: no
Worker behavior changed: no
deployment configuration changed: no
branch created: no
pull request created: no
target branch: main
```

## Missing executable gates

```txt
goal-only, collision-only and pickup-only fixtures
goal + collision fixture
collision + pickup fixture
goal + pickup fixture
all-three candidate fixture
Rapier/fallback disagreement fixture
terminal event-order fixture
outcome idempotency fixture
terminal frame parity fixture
raw owner isolation and traversal fixtures
unsupported/stale/duplicate host command fixtures
committed read-model coherence and clone/freeze fixtures
browser terminal-outcome/host smoke
Pages terminal-outcome/host smoke
```

## Claim boundary

The audit proves source ordering, reachable mutation paths, public owner exposure and independently sampled readback. It does not prove which precedence policy the game should select, that a deployed browser reproduces every combination, or that the proposed authorities and fixtures exist.
