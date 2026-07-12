# Deploy Audit: Outcome Precedence Fixture Gate

**Timestamp:** `2026-07-11T22-38-54-04-00`

## Summary

The current repository has no executable gate proving same-step collision, pickup and goal precedence. Pages should not be treated as outcome-correct until deterministic source fixtures and browser frame checks cover every candidate combination.

## Plan ledger

**Goal:** define the minimum deploy gate for run-step outcome arbitration and terminal-frame parity.

- [x] Define source fixtures.
- [x] Define browser fixtures.
- [x] Define deployed Pages checks.
- [x] Define failure injection and readback requirements.
- [ ] Add scripts and workflow wiring.
- [ ] Execute the gate.

## Required Node fixtures

```bash
node scripts/prehistoric-rush-run-step-goal-only-fixture.mjs
node scripts/prehistoric-rush-run-step-collision-only-fixture.mjs
node scripts/prehistoric-rush-run-step-pickup-only-fixture.mjs
node scripts/prehistoric-rush-run-step-goal-collision-fixture.mjs
node scripts/prehistoric-rush-run-step-collision-pickup-fixture.mjs
node scripts/prehistoric-rush-run-step-goal-pickup-fixture.mjs
node scripts/prehistoric-rush-run-step-goal-collision-pickup-fixture.mjs
node scripts/prehistoric-rush-run-step-idempotency-fixture.mjs
node scripts/prehistoric-rush-terminal-event-order-fixture.mjs
node scripts/prehistoric-rush-terminal-frame-parity-fixture.mjs
```

## Required browser fixtures

```txt
start deterministic run near goal
place deterministic obstacle and pickup at terminal-step location
submit one bounded step
capture committed RunStepResult
capture scene/HUD frame receipt
verify selected outcome follows policy version
verify admitted reward set matches frame
verify no later terminal mutation occurs
repeat command and verify idempotent result
```

## Required policy matrix

```txt
goal only
collision only
pickup only
goal + collision
collision + pickup
goal + pickup
goal + collision + pickup
Rapier hit + fallback miss
Rapier miss + fallback hit
```

## Required deployed Pages smoke

```txt
load deployed game.html
verify pinned modules resolve
start run
inject or navigate to deterministic terminal-step fixture
verify one terminal transition
verify event order readback
verify terminal HUD and scene use same runStepId/outcomeRevision
verify restart does not replay prior terminal reward or transition
```

## Failure injections

```txt
Rapier step throws
fallback collision query throws
pickup projection unavailable
world-readiness revision stale
collider-membership revision stale
scene transition rejects
renderer fails after outcome commit
same command delivered twice
stale prior-run command delivered after retry
```

## Required gate result

```txt
OutcomePrecedenceDeployGateResult {
  commitSha
  policyId
  policyVersion
  nodeFixtures
  browserFixtures
  pagesSmoke
  eventOrder
  frameParity
  retryIsolation
  accepted
}
```

## Current status

```txt
root package.json: absent
outcome fixtures: absent
browser automation: not run
Pages smoke: not run
policy descriptor: absent
run-step result: absent
terminal frame receipt: absent
deployment configuration changed by this audit: no
```
