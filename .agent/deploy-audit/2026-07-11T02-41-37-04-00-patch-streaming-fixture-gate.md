# Deploy Audit: Patch Streaming Fixture Gate

**Timestamp:** `2026-07-11T02-41-37-04-00`

## Summary

The streamed-world runtime is delivered as pinned browser modules, but the repo has no root package manifest or executable gate for patch generation, Worker protocol, activation parity, cache behavior or lifecycle teardown. Static deployment can succeed while the controller, Worker and consumers disagree at runtime.

## Plan ledger

**Goal:** Define the minimum deterministic and browser proof required before the seeded patch streaming path is treated as deployment-ready.

- [x] Record pinned runtime identities.
- [x] Record current validation surface.
- [x] Identify pure Node-testable boundaries.
- [x] Identify Worker-testable boundaries.
- [x] Identify browser-only boundaries.
- [x] Define required fixture order.
- [x] Preserve documentation-only scope.

## Pinned runtime graph

```txt
NexusEngine           e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits      9546a6fb25b4c6a7b65432df068701a4627ab20f
NexusEngine-ProtoKits 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js              0.179.1
Rapier                 0.15.0
patch generator       prehistoric-patch-v1
```

## Current validation surface

```txt
root package.json: absent
unified test command: absent
patch generator fixture: absent
controller fixture in product repo: absent
Worker protocol fixture: absent
activation transaction fixture: absent
render/physics parity fixture: absent
lifecycle fixture: absent
browser streaming smoke: absent
Pages streaming smoke: absent
```

The upstream `seeded-world-patch-controller-kit` may have its own repository tests, but this product has no proof that its generator, Worker protocol and Three/Rapier consumers satisfy the controller boundary.

## Required gate order

### Gate 1: source graph

```txt
verify all pinned URLs resolve
verify the import map and runtime constants agree
verify required factories exist
record one module-graph fingerprint
```

### Gate 2: deterministic product generator

```txt
same request -> same patch fingerprint
neighbor patch edge heights agree
terrain arrays have exact lengths
all values are finite
IDs are unique and stable
all matrices contain 16 finite values
colliders and pickups are inside declared patch bounds
transferable list contains exactly terrain buffers
```

### Gate 3: controller integration

```txt
active set is 25 at stable focus
prefetch and retain behavior match config
cache key changes with generator/settings revisions
activation delivery respects configured maximum
release IDs are deterministic
cache eviction is deterministic
errors enter diagnostics
```

### Gate 4: Worker protocol

```txt
ready acknowledgement
request/response correlation
error propagation
out-of-order response handling
late response after focus change
reset/remount epoch rejection
executor disposal rejects pending jobs
post-dispose calls reject
```

### Gate 5: consumer transaction

```txt
validate before mutation
terrain slot reservation
exact tree batch admitted counts
exact grass/shard admitted and rejected counts
collider parity across gameplay and Rapier
atomic activation commit or rollback
atomic release commit
height-source continuity result
controller/consumer active-set parity
```

### Gate 6: browser smoke

```txt
start and run across multiple patch boundaries
observe bounded main-thread activation work
confirm no blank terrain slot
confirm no stale tree/grass/shard matrices
confirm no missing hazard collider in active safety ring
confirm no Worker error or unbounded pending growth
confirm restart during inflight generation is safe
confirm teardown terminates Worker and RAF and disposes resources
```

## Proposed commands

```bash
node scripts/prehistoric-rush-module-graph-fixture.mjs
node scripts/prehistoric-rush-patch-generator-fixture.mjs
node scripts/prehistoric-rush-patch-controller-fixture.mjs
node scripts/prehistoric-rush-patch-worker-fixture.mjs
node scripts/prehistoric-rush-patch-activation-fixture.mjs
node scripts/prehistoric-rush-patch-parity-fixture.mjs
node scripts/prehistoric-rush-stream-lifecycle-fixture.mjs
```

A browser smoke can be added only after the pure contracts exist. Avoid installing a heavyweight browser stack in the shared kit repository merely to validate this product adapter.

## Deployment decision

```txt
runtime deployment changed by this audit: no
workflow changed: no
Pages configuration changed: no
readiness claim: blocked on fixture evidence
```

## Next safe ledge

```txt
PrehistoricRush Seeded Patch Activation Authority
+ Worker / Render / Physics Parity Fixture Gate
```
