# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T09-01-44-04-00`

## Plan ledger

**Goal:** finish the move to authoritative Nexus Engine transactions without creating parallel browser-host owners.

### Gate 0: preserve the implemented outcome-policy baseline
- [ ] Keep movement, pickups, goal and collision precedence inside `core-simulation`.
- [ ] Add browser integration proof for the pure policy cases.
- [ ] Correlate committed simulation, physics, state, transition and visible-frame revisions.

### Gate 1: run start/restart authority
- [ ] Add `RunStartCommand`, command ID and expected predecessor revisions.
- [ ] Allocate one monotonic run epoch.
- [ ] Prepare run-state and input reset without publishing them.
- [ ] Prepare `core-simulation` resolution reset.
- [ ] Prepare Rapier body pose/contact reset.
- [ ] Prepare patch-controller/Worker adoption or reset.
- [ ] Prepare active-content/shard/collider refresh under the new epoch.
- [ ] Prepare camera reset and game-scene transition.
- [ ] Commit every required participant atomically.
- [ ] Roll back if a required participant fails.
- [ ] Reject stale Worker, stream, physics and frame results.
- [ ] Return a typed start result.
- [ ] Acknowledge the first committed tick and visible frame.
- [ ] Route initial boot, button, Enter and Space retry through the same command.

### Gate 2: retained world/materialization authorities
- [ ] Coalesce release and activation into one active-content commit.
- [ ] Add stream cadence/work budgets and world-readiness admission.
- [ ] Add exact collider/content revisions and frame parity.
- [ ] Preserve creator/profile, render-surface, input, public-host and lifecycle plans.

## Candidate kit order

```txt
prehistoric-rush-run-start-restart-authority-domain
run-start-command-kit
run-start-command-id-kit
run-epoch-kit
run-start-predecessor-admission-kit
run-state-reset-plan-kit
run-input-reset-plan-kit
simulation-resolution-reset-plan-kit
physics-body-reset-plan-kit
stream-reset-adoption-plan-kit
active-content-reset-plan-kit
camera-reset-plan-kit
scene-transition-reset-plan-kit
run-start-prepare-kit
run-start-participant-result-kit
run-start-commit-kit
run-start-rollback-kit
stale-run-start-result-rejection-kit
run-start-result-kit
run-start-observation-kit
run-start-journal-kit
first-run-tick-ack-kit
first-run-visible-frame-ack-kit
initial-start-retry-parity-fixture-kit
run-start-participant-failure-fixture-kit
browser-authoritative-restart-smoke-kit
```

## Validation order

```txt
npm test
fixture:initial-start-retry-parity
fixture:duplicate-start-idempotency
fixture:start-participant-failure-rollback
fixture:stale-worker-stream-rejection
fixture:physics-body-run-epoch
fixture:active-content-run-epoch
fixture:first-run-tick-ack
fixture:first-run-visible-frame-ack
fixture:public-readback-no-mixed-epoch
browser start/retry matrix
Pages start/retry smoke
```
