# Deploy Audit: Coordinated Reset Fixture Gate

**Timestamp:** `2026-07-12T16-11-48-04-00`

## Summary

The current Node test command does not exercise browser restart sources, cross-domain reset, Worker completion ordering, public readback coherence or the first visible frame after restart.

## Plan ledger

**Goal:** block coordinated-reset readiness claims until deterministic headless fixtures and browser/Pages evidence prove one generation across all required participants.

- [x] Inventory current executable tests.
- [x] Identify browser-only reset paths.
- [x] Define headless participant fixtures.
- [x] Define browser and deployed Pages matrices.
- [ ] Implement and run the fixtures.

## Current proof

```txt
npm test
  -> outcome resolution policy
  -> player articulation conversion
```

No existing test invokes `src/game.js`, browser key handlers, the Worker executor, Three renderer or public host.

## Required headless fixtures

```txt
restart-admission-active-run-rejection
restart-terminal-phase-admission
rapid-restart-idempotency
product-simulation-motion-physics-reset-parity
articulated-motion-dynamics-reset-parity
patch-controller-policy-result
stale-worker-generation-rejection
active-content-collider-reset-parity
reset-prepare-failure-zero-commit
reset-commit-failure-rollback
public-readback-single-generation
```

## Required browser matrix

```txt
initial start
retry after collision
run again after win
Enter during active run
rapid Enter repeat
Space/button policy parity
restart while Worker requests are inflight
restart after far-world streaming
first visible frame after restart
page navigation/unload disposal
```

For every admitted restart, capture:

```txt
RunRestartCommand
ResetPrepareResults
RunRestartResult
participant revisions and digests
public readback
first visible frame acknowledgement
console errors and unhandled rejections
```

## Pages gate

The deployed static site must reproduce the local browser results at the exact published commit. Source assertions or successful deployment alone are insufficient.

## Completion boundary

Do not claim restart safety, reset determinism, stale Worker rejection, coherent public diagnostics or visible-frame parity until all required fixtures pass and artifacts are retained.