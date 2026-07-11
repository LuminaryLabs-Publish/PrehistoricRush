# Deploy Audit: Patch Activation Fixture Gate

**Timestamp:** `2026-07-11T05-02-00-04-00`

## Summary

The current static Pages route has no executable gate for patch-content admission, multi-consumer activation, release rollback or controller/consumer parity. Deployment can therefore succeed while streamed world state diverges.

## Plan ledger

**Goal:** Add deterministic Node and browser proof that one patch transaction either commits every required consumer or leaves the prior world unchanged.

- [x] Identify current activation and release mutation order.
- [x] Identify missing fixture seams.
- [x] Define source-level and browser-level proof rows.
- [ ] Add an injected consumer adapter.
- [ ] Add deterministic failure points.
- [ ] Add Node fixtures.
- [ ] Add browser and Pages smoke.
- [ ] Gate deployment on the fixture suite.

## Required Node fixtures

```bash
node scripts/prehistoric-rush-patch-content-admission-fixture.mjs
node scripts/prehistoric-rush-patch-activation-commit-fixture.mjs
node scripts/prehistoric-rush-patch-release-commit-fixture.mjs
node scripts/prehistoric-rush-patch-parity-fixture.mjs
node scripts/prehistoric-rush-patch-failure-rollback-fixture.mjs
```

## Required cases

```txt
valid patch commits all consumers
invalid terrain length rejects before mutation
invalid tree descriptor rejects before mutation
tree capacity failure returns deterministic rejected IDs
grass capacity failure returns deterministic rejected IDs
shard capacity failure returns deterministic rejected IDs
injected terrain commit failure rolls back
injected tree commit failure rolls back
injected Rapier commit failure rolls back or terminally faults
release failure preserves retriable release claim
duplicate activation command returns prior result
stale activation claim is quarantined
controller-active and consumer-active IDs match
controller and consumer digests remain equal after repeated movement
```

## Required browser proof

```txt
load Pages route
wait for center and active ring commits
capture bounded activation journal
move across at least three patch boundaries
prove no partial patch is gameplay-ready
prove first render and first physics acknowledgement per commit
prove release acknowledgement and resource retirement
retry while generation is pending
prove no stale claim commits
```

## Required observation surface

```txt
source revisions
controller epoch
stream epoch
run session ID
pending claims
last activation and release results
controller-active IDs
consumer-active IDs
gameplay-ready IDs
render and physics revisions
parity digest
bounded diagnostics
```

## Existing validation state

```txt
root package.json: absent
unified npm validation: absent
patch admission fixture: absent
patch activation fixture: absent
patch release fixture: absent
rollback fixture: absent
browser streaming smoke: absent
Pages parity smoke: absent
```

No workflow or deployment behavior changed during this audit.