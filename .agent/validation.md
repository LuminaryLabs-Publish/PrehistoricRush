# Validation: PrehistoricRush

**Updated:** `2026-07-11T15-59-12-04-00`

## Summary

This was a documentation-only audit. Source was read through the GitHub connector. No runtime, dependency, route, rendering, physics or deployment behavior was changed.

## Plan ledger

**Goal:** record exactly what was proven and what remains unexecuted.

- [x] Confirm selected repository and `main` branch.
- [x] Confirm no branch or pull request was created.
- [x] Read `src/game.js`.
- [x] Read `src/domains/prehistoric-rush/prehistoric-rush-domain-kit.js`.
- [x] Read `src/workers/prehistoric-patch-worker.js`.
- [x] Read current `.agent` audits and registry.
- [x] Trace Start/Retry through gameplay, streaming, consumers, physics, camera, RAF and host.
- [x] Confirm `rebuildActiveContent()` is conditional and owns pickup reprojection.
- [x] Confirm Worker messages carry request ID but no run/stream generation.
- [ ] Execute runtime tests.
- [ ] Execute browser or Pages smoke.
- [ ] Implement epoch/reset fixtures.

## Source-backed findings

```txt
game.start:
  replaces RunState and InputState
  increments numeric runId
  emits RunStarted
  requests scene transition

host start:
  reuses controller, Worker, physics, adapter and RAF
  primes current controller
  resets camera

active content:
  pickup projection rebuilds on activation, release or collection
  retry alone does not force rebuild

worker protocol:
  requestId only
  no runtime/run/stream generation

public host:
  remains process-lifetime
  exposes raw mutable owners
```

## Validation performed

```txt
GitHub repository inventory comparison
central ledger comparison
same-window activity check
root .agent presence check
source and retained audit inspection
interaction/domain/kit/service inventory
reset/epoch contract derivation
documentation consistency review
```

## Validation not performed

```txt
local clone: unavailable because execution container could not resolve github.com
npm install
Node fixtures
browser automation
Rapier runtime execution
Worker reorder execution
Three render smoke
GitHub Pages smoke
deployment workflow run
```

## Change classification

```txt
runtime source changed: no
dependencies changed: no
route files changed: no
render behavior changed: no
physics behavior changed: no
Worker behavior changed: no
deployment configuration changed: no
branch created: no
pull request created: no
target branch: main
```

## Missing executable gates

```txt
retry pickup reset fixture
input reset fixture
stale Worker epoch fixture
stale contact epoch fixture
stale frame receipt fixture
reset rollback fixture
reset idempotency fixture
first committed new-run frame fixture
browser retry parity smoke
Pages retry parity smoke
```
