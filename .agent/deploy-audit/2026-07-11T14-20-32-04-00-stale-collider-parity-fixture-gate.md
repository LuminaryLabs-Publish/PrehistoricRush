# Deploy Audit: Stale Collider Parity Fixture Gate

**Timestamp:** `2026-07-11T14-20-32-04-00`

## Summary

A Pages route can load, render and respond to input while retaining invisible fatal colliders. Deployment acceptance must include streamed release and collision parity, not only startup and visual smoke.

## Plan ledger

**Goal:** block collision-correctness claims until exact replacement and released-patch fixtures pass.

- [x] Define source fixture matrix.
- [x] Define browser fixture.
- [x] Define release blockers.
- [ ] Implement and wire after runtime changes.

## Source fixtures

```txt
exact replacement fixture
  add A/B/C
  replace with B/C/D
  prove A removed and D added
  prove state/runtime/world IDs equal B/C/D

idempotent replacement fixture
  replace with same set twice
  prove no duplicate bodies/colliders

released patch fixture
  activate patch A
  release patch A
  move actor through old collider coordinates
  prove no contact and no failure

contact admission fixture
  stale, unknown, non-hazard and prior-epoch contacts rejected
  current hazard contact accepted once

source parity fixture
  visible tree IDs, descriptor IDs and Rapier IDs match
```

## Browser fixture

```txt
open game page
start run
activate a patch with a known tree
move until patch releases
confirm tree is absent from renderer and host active membership
move actor through old tree coordinates
confirm run remains active
confirm no stale contact in host observation
```

## Suggested commands

```bash
node scripts/prehistoric-rush-fixed-collider-replacement-fixture.mjs
node scripts/prehistoric-rush-released-patch-collision-fixture.mjs
node scripts/prehistoric-rush-contact-admission-fixture.mjs
node scripts/prehistoric-rush-collision-source-parity-fixture.mjs
node scripts/prehistoric-rush-browser-stale-collider-smoke.mjs
```

## Release blockers

```txt
serialized and live collider ID sets differ
removed fixed body or collider remains in Rapier world
released patch can produce a contact
terminal failure references inactive collider
Rapier and fallback disagree without typed resolution
replacement creates duplicate resources
repeated replacement changes membership
```

## Current state

```txt
root package.json: absent
collision fixtures: absent
browser stale-collider smoke: absent
Pages collision gate: absent
runtime changed by audit: no
```
