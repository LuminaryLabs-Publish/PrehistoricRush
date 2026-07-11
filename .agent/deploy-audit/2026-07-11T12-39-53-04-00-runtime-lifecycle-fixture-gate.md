# Deploy Audit: Runtime Lifecycle Fixture Gate

**Timestamp:** `2026-07-11T12-39-53-04-00`

## Summary

A static Pages deployment can load and render successfully while leaking Worker, callback, GPU, physics and global-host resources or allowing stale patch results after retry. Deployment readiness must include behavioral lifecycle fixtures, not only artifact and first-frame checks.

## Plan ledger

**Goal:** block lifecycle readiness claims until startup rollback, retry epochs, stale-result rejection and ordered disposal are executable.

- [x] Record current proof gaps.
- [x] Define Node and browser fixture matrix.
- [x] Define release-blocking outcomes.
- [ ] Implement and wire fixtures after runtime lifecycle implementation.

## Required source fixtures

```txt
startup transaction fixture
  one startup -> one runtimeSessionId
  required owners registered
  one RAF lease
  expected listener leases

startup rollback fixture
  inject failure after each acquisition stage
  verify reverse cleanup
  verify no Worker/canvas/global/listener remains

retry epoch fixture
  advance runSessionId and streamEpoch
  preserve only allowed immutable cache data
  reset physics/input/camera/dynamic consumers

stale Worker result fixture
  resolve prior-run success/error after retry
  verify typed stale rejection
  verify no consumer mutation

resource disposal fixture
  stop RAF first
  retire listeners and host
  terminate Worker/executor
  dispose Rapier and Three resources
  repeated dispose is stable
```

## Required browser fixture

```txt
open game page
start run
queue patch generation
trigger retry
inject/delay old Worker response
verify new run remains unchanged
trigger explicit dispose or pagehide
verify no further frame/tick/render
verify canvas/global/listeners/resources are retired
```

## Suggested commands

```bash
node scripts/prehistoric-rush-lifecycle-startup-fixture.mjs
node scripts/prehistoric-rush-startup-rollback-fixture.mjs
node scripts/prehistoric-rush-retry-epoch-fixture.mjs
node scripts/prehistoric-rush-worker-stale-result-fixture.mjs
node scripts/prehistoric-rush-resource-disposal-fixture.mjs
node scripts/prehistoric-rush-host-revocation-fixture.mjs
node scripts/prehistoric-rush-browser-lifecycle-smoke.mjs
```

## Release blockers

```txt
multiple RAF loops after retry/remount
listener count increases after retry
old Worker response changes active consumers
Worker remains live after dispose
renderer or canvas remains live after dispose
physics steps after dispose
public host mutates disposed owners
repeated dispose throws or releases twice
partial startup failure leaves resources
```

## Current validation state

```txt
root package.json: absent
lifecycle fixtures: absent
browser lifecycle smoke: absent
Pages lifecycle gate: absent
runtime changed by audit: no
```
