# Validation: PrehistoricRush

**Updated:** `2026-07-12T07-09-49-04-00`

## Summary

This documentation-only audit verifies the current controller release/activation, terrain, tree, grass, shard, pickup and collider materialization paths. It does not prove bounded work, coalescing, atomic commit, rollback, cross-consumer parity or visible-frame acknowledgement.

## Plan ledger

**Goal:** distinguish source-backed materialization findings from unexecuted runtime, browser and Pages proof.

- [x] Confirm repository and `main` branch.
- [x] Compare all Publish repositories with central tracking.
- [x] Inspect `src/game.js`, the product domain and patch generator.
- [x] Confirm release and activation each trigger complete consumer rebuild work.
- [x] Confirm complete fixed-collider replacement occurs on every rebuild.
- [x] Quantify active-set descriptor bounds from source constants.
- [x] Inventory interaction loops, domains, kits and services.
- [x] Create materialization contracts and fixture requirements.
- [ ] Execute runtime, browser or Pages proof.

## Source-backed findings

```txt
release-side full tree flush: present
release-side full active-content rebuild: present
activation-side full tree flush: present
activation-side full active-content rebuild: present
release plus activation double rebuild: possible in one frame
maximum active patches: 25
maximum grass descriptor visits per full rebuild: 1,750
maximum shard descriptor visits per full rebuild: 50
maximum generated fixed colliders per full set: 175
aggregate patch delta: absent
work/time budget: absent
active-content revision: absent
atomic commit/rollback: absent
cross-consumer parity digest: absent
first visible-frame receipt: absent
```

## Validation performed

```txt
current organization inventory and central-ledger comparison
current repository metadata and recent commit inspection
controller release, pump and ready-delivery inspection
terrain slot and tree batch mutation inspection
grass, shard, pickup and collider rebuild inspection
physics fixed-collider replacement inspection
source-constant work-bound calculation
interaction/domain/kit/service inventory
contract and fixture derivation
documentation updates on main
```

## Validation not performed

```txt
local clone or dependency install
Node materialization fixtures
browser launch
Worker execution
fallback generation execution
Rapier execution
release/activation boundary traversal
capacity pressure
fault injection and rollback
performance measurement
render/physics parity readback
GitHub Pages smoke or workflow review
```

## Change classification

```txt
runtime source changed: no
HTML changed: no
dependencies changed: no
gameplay changed: no
input behavior changed: no
streaming changed: no
physics changed: no
rendering changed: no
camera changed: no
Worker behavior changed: no
deployment changed: no
branch created: no
pull request created: no
target branch: main
```

## Missing executable gates

```txt
single activation delta fixture
single release delta fixture
release-plus-activation coalescing fixture
no-op materialization fixture
bounded-work fixture
capacity-deferral fixture
consumer-failure rollback fixture
stale-plan fixture
30/60/120 Hz work-parity fixture
Worker/fallback parity fixture
Rapier/fallback collider parity fixture
controller/render/physics patch-digest fixture
long traversal retention fixture
visible content-frame fixture
local browser and Pages materialization smoke
```

## Claim boundary

The audit proves how the inspected source currently rebuilds active content and the source-level maximum descriptors that may be revisited. It does not prove actual device cost, that every boundary frame performs maximum work, or that deployed traversal visibly stutters.