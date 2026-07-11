# Deploy Audit: World Readiness Latency Fixture Gate

**Timestamp:** `2026-07-11T17-39-47-04-00`

## Summary

Current validation does not inject Worker delay, reorder, failure or consumer activation failure while the runner approaches a patch frontier. Deployment should not claim stream-safe gameplay until movement, collision and visible terrain remain coherent under those conditions.

## Plan ledger

**Goal:** gate Pages deployment on deterministic world-readiness behavior under realistic asynchronous patch delivery.

- [x] Define missing fixture classes.
- [x] Define browser and Pages smoke requirements.
- [x] Preserve documentation-only scope.
- [ ] Add scripts and workflow wiring later.

## Required Node fixtures

```bash
node scripts/prehistoric-rush-required-corridor-fixture.mjs
node scripts/prehistoric-rush-delayed-patch-movement-fixture.mjs
node scripts/prehistoric-rush-reordered-patch-delivery-fixture.mjs
node scripts/prehistoric-rush-partial-consumer-readiness-fixture.mjs
node scripts/prehistoric-rush-fallback-height-policy-fixture.mjs
node scripts/prehistoric-rush-readiness-speed-cap-fixture.mjs
node scripts/prehistoric-rush-readiness-rollback-fixture.mjs
node scripts/prehistoric-rush-world-frame-parity-fixture.mjs
```

## Browser smoke

```txt
throttle Worker delivery
approach a not-ready patch frontier
verify movement is capped or deferred by policy
verify no invisible obstacle collision
verify no late terrain snap changes committed actor height
verify pickup/collider/render consumers become ready together
verify HUD readiness state matches host read model
resume full speed after committed readiness
```

## Pages gate

```txt
pinned modules load
Worker and synchronous fallback both pass readiness behavior
first run and retry use the same readiness contracts
high-latency simulation cannot outrun required corridor
canvas, HUD and host cite one committed world/frame revision
```

## Current status

```txt
required corridor fixture: absent
delayed/reordered Worker fixtures: absent
partial consumer fixture: absent
fallback height policy fixture: absent
browser latency smoke: not run
Pages latency smoke: not run
runtime source changed by this audit: no
```
