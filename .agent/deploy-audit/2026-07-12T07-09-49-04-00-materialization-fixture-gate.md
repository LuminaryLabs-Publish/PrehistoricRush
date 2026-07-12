# Deploy Audit: Active Content Materialization Fixture Gate

**Timestamp:** `2026-07-12T07-09-49-04-00`

## Summary

Current source inspection proves repeated full active-set rebuilds but no executable test proves bounded work, release/activation coalescing, consumer rollback, physics/render parity or visible-frame acknowledgement. Deployment readiness must require those fixtures.

## Plan ledger

**Goal:** define the local, browser and Pages proof required before claiming active-content materialization correctness or stable traversal performance.

- [x] Identify source-backed mutation and work paths.
- [x] Separate documentation findings from executable proof.
- [x] Define deterministic and browser fixture matrix.
- [ ] Implement and run the fixture gate.

## Required deterministic fixtures

```txt
one activation produces one materialization commit
one release produces one materialization commit
release plus activation produces one coalesced commit
multiple releases are coalesced
no-op membership update performs no materialization work
duplicate command is idempotent
stale runtime/run/stream/content revision is rejected
capacity pressure defers before mutation
required consumer failure preserves predecessor
rollback retires prepared resources exactly once
```

## Required work-budget fixtures

```txt
work-unit counts match applied deltas
elapsed-time budget is independent of refresh rate
30/60/120 Hz traversal admits equivalent work per wall time
full-rebuild fallback is explicit and bounded
long traversal does not grow retained descriptors or resources
```

## Required parity fixtures

```txt
controller acknowledged-active patch digest
terrain slot patch digest
tree cell patch digest
grass source patch digest
shard/pickup patch digest
Rapier fixed-collider patch digest
fallback collider patch digest
height sampler patch digest
visible frame patch digest
```

All required consumers must report the same committed patch set.

## Required browser matrix

```txt
Worker generation
fallback synchronous generation
release-only boundary crossing
release-plus-activation boundary crossing
rapid directional changes
jump across patch boundary
collision near patch boundary
shard collection near patch boundary
hidden-tab resume
low and high refresh rates
WebGL context continuity
```

## Required Pages proof

```txt
load deployed game
run across repeated patch boundaries
capture materialization observations
verify bounded commit count and work
verify no partial consumer state
verify physics/render digest parity
verify first visible frame cites committed content revision
```

## Current validation state

```txt
runtime source changed: no
streaming behavior changed: no
physics behavior changed: no
render behavior changed: no
dependencies changed: no
deployment changed: no
materialization fixtures available: no
browser materialization smoke: not run
Pages materialization smoke: not run
```

No deployment-readiness claim is made.