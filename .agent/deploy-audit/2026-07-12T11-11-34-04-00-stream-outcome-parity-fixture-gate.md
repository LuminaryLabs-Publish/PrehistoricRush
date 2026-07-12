# Deploy Audit: Stream / Outcome Parity Fixture Gate

**Timestamp:** `2026-07-12T11-11-34-04-00`

## Plan ledger

**Goal:** prevent deployment claims until browser and Pages execution prove streamed-content, physics, outcome and visible-frame parity.

- [x] Define local fixture requirements.
- [x] Define browser traversal matrix.
- [x] Define deployed Pages proof.
- [ ] Implement and run the gate.

## Local executable gates

```txt
npm test
fixture:outcome-policy-baseline
fixture:active-content-revision-monotonicity
fixture:released-collider-no-invisible-failure
fixture:activated-collider-not-visible-before-admission
fixture:activated-pickup-not-visible-before-admission
fixture:mixed-content-revision-rejection
fixture:content-physics-commit-rollback
fixture:stale-worker-result-rejection
fixture:first-visible-content-frame-receipt
fixture:public-readback-content-parity
```

## Browser matrix

```txt
Worker generation available
Worker unavailable with deferred synchronous fallback
30 Hz, 60 Hz and 120 Hz presentation cadence
continuous traversal across patch boundaries
release and activation in the same host frame
collision at the release boundary
collision at the activation boundary
pickup overlap at the activation boundary
retry during queued generation
hidden-tab suspension and resume
WebGL context available and startup module failure paths
```

## Required browser evidence

```txt
run epoch
simulation step and revision
stream generation
active content revision
active patch-set digest
collider-set digest
pickup-set digest
physics frame step
visible frame ID
terminal transition ID when present
```

## Pages gate

The deployed Pages build must repeat the Worker/fallback patch-boundary collision and pickup cases using the exact pinned runtime graph recorded by the application. Source-pattern tests and successful static deployment are insufficient.

## Current status

```txt
local parity fixtures: unavailable
browser traversal matrix: not run
Pages traversal smoke: not run
runtime changed by this audit: no
branch created: no
pull request created: no
```

No stream/outcome parity or deployment-readiness claim is made.
