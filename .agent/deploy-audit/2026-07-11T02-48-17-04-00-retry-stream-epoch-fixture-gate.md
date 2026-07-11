# Deploy Audit: Retry / Stream Epoch Fixture Gate

**Timestamp:** `2026-07-11T02-48-17-04-00`

## Goal

Prevent GitHub Pages deployment from publishing retry/session regressions that static file staging cannot detect.

## Current workflow

The Pages workflow runs on pushes to `main`, copies static files into `_site` and deploys them. It does not execute a repository validation command, and the repository has no root `package.json`.

## Required pre-deploy fixtures

```txt
patch generator determinism
patch admission rejection
atomic activation/release rollback
retry after shard collection in unchanged patch set
retry after distant patch streaming
retry with pending Worker work
stale Worker result quarantine
run/stream/render/physics first-frame parity
repeated retry resource stability
stop/dispose/restart idempotency
```

## Required commands

```bash
node scripts/prehistoric-rush-patch-activation-fixture.mjs
node scripts/prehistoric-rush-retry-reset-fixture.mjs
node scripts/prehistoric-rush-stream-epoch-fixture.mjs
node scripts/prehistoric-rush-dynamic-content-reconciliation-fixture.mjs
node scripts/prehistoric-rush-lifecycle-fixture.mjs
```

## Deployment gate

The build job should fail before artifact upload unless all deterministic Node fixtures pass. Browser smoke should then prove the deployed route reports:

```txt
current runSessionId
current streamEpoch
matching controller/consumer patch revisions
matching pickup/collider/height revisions
no stale results admitted
one RAF/listener/Worker ownership set
```

## Current status

Documentation only. No workflow changed, no fixtures exist and no deployment run was triggered.
