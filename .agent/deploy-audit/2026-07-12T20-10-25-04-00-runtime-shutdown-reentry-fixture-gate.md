# Deploy Audit: Runtime Shutdown and Re-entry Fixture Gate

**Timestamp:** `2026-07-12T20-10-25-04-00`

## Summary

The existing test command validates outcome policy and articulation only. No browser fixture proves page-runtime shutdown, Worker termination, listener removal, renderer disposal, stale-callback rejection or safe re-entry. Deployment remains documentation-only for this boundary.

## Plan ledger

**Goal:** prevent lifecycle-sensitive changes from being considered deployable until local browser and GitHub Pages runs prove deterministic stop and re-entry.

- [x] Review current package test boundary.
- [x] Identify required headless and browser fixtures.
- [x] Define failure-injection and re-entry matrix.
- [ ] Implement lifecycle fixtures.
- [ ] Run local browser matrix.
- [ ] Run deployed Pages matrix.

## Required deterministic fixtures

```txt
start-stop-success
stop-idempotency
stop-stale-generation-rejection
partial-startup-reverse-retirement
frame-failure-triggers-stop
worker-pending-request-shutdown
late-worker-result-rejected
listener-removal-after-stop
raf-cancel-after-stop
public-host-revocation
renderer-and-resource-retirement
stop-then-reenter-new-generation
```

## Browser matrix

```txt
Chrome/Chromium:
  normal start -> stop -> re-entry
  stop during pending Worker request
  injected frame exception
  repeated stop commands
  resize/input event after stop

Firefox:
  same lifecycle matrix

WebKit/Safari-capable runner:
  same lifecycle matrix
```

## Pages matrix

```txt
open game page
wait for first accepted frame
issue stop through lifecycle test hook
verify no successor frame or Worker mutation
verify public host is revoked or terminal-only
re-enter with a new runtime generation
verify one renderer, one listener set and one Worker owner
```

## Required evidence

```txt
RuntimeStartResult
accepted frame acknowledgement
RuntimeStopResult
retirement journal
late-callback rejection records
renderer-disposed acknowledgement
new-generation re-entry receipt
```

## Current validation state

```txt
npm test: not run in this audit
browser lifecycle smoke: unavailable
Worker shutdown fixture: unavailable
WebGL retirement fixture: unavailable
Pages re-entry smoke: unavailable
```

A successful static deploy or visually closed tab does not prove lifecycle correctness.