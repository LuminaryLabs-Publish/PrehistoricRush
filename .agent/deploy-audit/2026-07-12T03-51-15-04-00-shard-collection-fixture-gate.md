# Deploy Audit: Shard Collection Fixture Gate

**Timestamp:** `2026-07-12T03-51-15-04-00`

## Summary

Current static deployment can publish the shard loop without executable proof for identity, phase closure, active-patch evidence, vertical distance, idempotency or visible removal. Deployment readiness should require deterministic Node fixtures plus browser and Pages smoke evidence.

## Plan ledger

**Goal:** prevent shard authority changes from shipping without gameplay, presentation and lifecycle proof.

- [x] Define required fixture categories.
- [x] Separate source inspection from executable proof.
- [ ] Add fixtures to repository validation.
- [ ] Gate Pages deployment on passing results.

## Required deterministic fixtures

```txt
canonical shard identity includes source/generator provenance
unknown ID rejection
malformed ID rejection
wrong run rejection
menu/run-over/win phase rejection
inactive patch rejection
stale patch activation revision rejection
stale active-shard-set revision rejection
horizontal range acceptance/rejection
vertical separation acceptance/rejection
duplicate command returns prior receipt
duplicate identity awards once
stable tie ordering and per-step collection budget
run reset creates a clean run-scoped ledger
state/event/result revision parity
```

## Required integration fixtures

```txt
Worker and fallback generators produce identical shard identities
patch release before collection rejects cleanly
patch activation and collection use committed revisions
collision, goal and pickup same-step arbitration is deterministic
raw public host cannot bypass collection admission
late collection after reset/disposal is generation-fenced
```

## Required browser proof

```txt
accepted shard disappears from the world
HUD count increments exactly once
world removal and HUD cite one collection result
jump/vertical policy matches specification
retry starts with a clean visual and state ledger
DPR/resize changes do not duplicate collection
```

## Required Pages gate

```txt
load deployed game page
start a run
reach and collect a known deterministic shard
capture detached collection result
capture first visible-frame receipt
verify instance absence and HUD count
retry and verify run-scoped reset
```

## Current status

```txt
runtime fixtures: absent
browser shard smoke: absent
Pages shard smoke: absent
deployment workflow gate: absent
runtime source changed by this audit: no
deployment configuration changed by this audit: no
```