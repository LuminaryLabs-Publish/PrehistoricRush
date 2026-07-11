# Retry Reset / Epoch Fixture Gate

**Timestamp:** `2026-07-11T15-59-12-04-00`

## Summary

Current checks do not prove that Retry is a fresh run across streaming, physics and presentation. Deployment should be blocked on deterministic reset and stale-evidence fixtures.

## Required fixture commands

```bash
node scripts/prehistoric-rush-retry-pickup-reset-fixture.mjs
node scripts/prehistoric-rush-input-reset-fixture.mjs
node scripts/prehistoric-rush-stale-worker-epoch-fixture.mjs
node scripts/prehistoric-rush-stale-contact-epoch-fixture.mjs
node scripts/prehistoric-rush-stale-frame-epoch-fixture.mjs
node scripts/prehistoric-rush-reset-rollback-fixture.mjs
node scripts/prehistoric-rush-reset-idempotency-fixture.mjs
node scripts/prehistoric-rush-first-frame-run-epoch-fixture.mjs
node scripts/prehistoric-rush-browser-retry-parity-smoke.mjs
node scripts/prehistoric-rush-pages-retry-parity-smoke.mjs
```

## Minimum cases

### Pickup reprojection

Collect a shard, retry without changing active patches, and assert the shard returns in the first new-run frame.

### Input reset

Hold steer/boost through terminal state, retry, and assert neutral first-tick input unless a new-run input command is admitted.

### Worker quarantine

Delay a predecessor generation response until after retry and assert a typed stale-generation rejection with no membership change.

### Collider/contact quarantine

Deliver a predecessor contact after new collider epoch commit and assert no failure mutation.

### Reset rollback

Fail one required consumer preparation and assert the terminal predecessor remains authoritative with no partial new-run state.

### Idempotency

Submit the same retry command twice and assert one committed run and a stable duplicate result.

### Frame parity

Assert gameplay, stream, collider, canvas, HUD and host all cite the same new run and first committed frame.

## Release rule

Do not claim Retry, Run Again or fresh-run correctness from `RunState` replacement alone. Require every reset, stale-evidence and first-frame fixture plus deployed Pages smoke.
