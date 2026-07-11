# Validation: PrehistoricRush

**Updated:** `2026-07-11T19-09-25-04-00`

## Summary

This was a documentation-only audit. Source was read through the GitHub connector. No runtime, dependency, route, rendering, physics, Worker or deployment behavior was changed.

## Plan ledger

**Goal:** record exactly what was proven about cadence-sensitive stream budgets and what remains unexecuted.

- [x] Confirm selected repository and `main` branch.
- [x] Confirm no branch or pull request was created.
- [x] Read `src/game.js`.
- [x] Read `src/domains/prehistoric-rush/prehistoric-rush-domain-kit.js`.
- [x] Read `src/world/prehistoric-patch-generator.js`.
- [x] Read the pinned `seeded-world-patch-controller-kit` source.
- [x] Read the pinned `rapier-physics-domain-kit` source.
- [x] Read current `.agent` audits and registry.
- [x] Trace RAF delta, stream pump, ready activation, physics and render order.
- [x] Confirm generation and activation budgets are applied per RAF call.
- [x] Identify interaction loop, domains, kits and services.
- [ ] Execute runtime tests.
- [ ] Execute browser or Pages smoke.
- [ ] Implement cadence and suspension fixtures.

## Source-backed findings

```txt
RAF clock:
  dt = min(0.05, wall-clock delta)
  engine.tick(dt) runs once per RAF
  updateStreaming runs once per RAF

stream work:
  Worker path starts at most 2 requests per RAF
  fallback path starts at most 1 request per RAF
  ready activation admits at most 1 patch per RAF

30/60/120 Hz maximum rates:
  ready activation: 30 / 60 / 120 patches per second
  Worker starts: 60 / 120 / 240 requests per second
  fallback starts: 30 / 60 / 120 requests per second

missing proof:
  no visibility-state admission
  no elapsed-time stream budget
  no cadence revision
  no backlog-age observation
  no bounded resume plan
  no first-visible-frame cadence receipt
```

## Validation performed

```txt
GitHub organization inventory comparison
central ledger timestamp comparison
same-window activity check
root .agent presence check
product source inspection
pinned controller and physics source inspection
interaction/domain/kit/service inventory
cadence-rate derivation from source constants
contract and fixture derivation
documentation consistency review
```

## Validation not performed

```txt
local clone
npm install
Node fixtures
browser automation
refresh-rate emulation
visibility suspension
Rapier runtime execution
Worker timing execution
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
30/60/120 cadence parity fixture
stream time-budget fixture
generation-start rate fixture
activation-rate fixture
throttled-frame fixture
hidden-tab suspension/resume fixture
backlog starvation fixture
cadence/world-readiness parity fixture
browser refresh-parity smoke
Pages refresh-parity smoke
```

## Claim boundary

This audit proves only the current source order, per-call budgets and resulting maximum rate differences. It does not claim measured runtime throughput, equal gameplay behavior across refresh rates, correct hidden-tab recovery or cadence-safe world readiness.