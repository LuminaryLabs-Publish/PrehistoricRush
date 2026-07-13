# PrehistoricRush Validation

**Audit timestamp:** `2026-07-12T22-19-11-04-00`  
**Scope:** documentation-only Run Start/Restart Admission central reconciliation

## Summary

This run inspected the current Publish inventory, central ledger, repo-local audit state, browser start controls, domain start behavior, scene topology, simulation reset, patch/Worker reuse, physics, camera, rendering, HUD, public host, tests, and the 45-surface kit/service inventory. It changed documentation only and does not claim start/restart behavior is repaired.

## Plan ledger

**Goal:** record exactly what was inspected, changed, synchronized, and not executed.

- [x] Verify the repository and `main` branch.
- [x] Compare all ten Publish repositories and exclude TheCavalryOfRome.
- [x] Confirm all nine eligible repositories have central and root `.agent` coverage.
- [x] Detect the newer repo-local PrehistoricRush audit.
- [x] Inspect `src/game.js`.
- [x] Inspect `src/domains/prehistoric-rush/prehistoric-rush-domain-kit.js`.
- [x] Inspect package tests and prior kit/service inventory.
- [x] Refresh all required root `.agent` documents.
- [x] Add timestamped architecture, render, gameplay, interaction, lifecycle, and deploy audits.
- [x] Synchronize the central ledger and internal change log.
- [x] Change no runtime or deployment source.
- [x] Create no branch or pull request.
- [ ] Execute start/restart fixtures after implementation exists.

## Documentation changes

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-12T22-19-11-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T22-19-11-04-00.md
.agent/architecture-audit/2026-07-12T22-19-11-04-00-run-start-central-reconciliation-dsk-map.md
.agent/render-audit/2026-07-12T22-19-11-04-00-first-run-frame-central-reconciliation.md
.agent/gameplay-audit/2026-07-12T22-19-11-04-00-start-repeat-participant-central-reconciliation.md
.agent/interaction-audit/2026-07-12T22-19-11-04-00-start-command-central-admission-map.md
.agent/run-lifecycle-audit/2026-07-12T22-19-11-04-00-start-result-participant-central-contract.md
.agent/deploy-audit/2026-07-12T22-19-11-04-00-start-restart-central-fixture-gate.md
```

## Change boundary

```txt
runtime source changed: no
input behavior changed: no
simulation, physics, streaming, or Worker behavior changed: no
rendering, camera, or HUD behavior changed: no
package scripts or dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
```

## Commands not run

```txt
npm test
browser Enter-repeat smoke
active-run restart smoke
Worker stale-delivery fixture
physics/content participant reset fixture
start failure/rollback fixture
built-output start/restart smoke
GitHub Pages start/restart smoke
```

## Existing coverage limitations

The current Node tests cover resolution policy and player articulation. They do not instantiate browser key events, start/restart controls, patch streaming, Worker delivery, physics reset, scene transitions, participant barriers, rollback, or first-frame generation proof.

## Non-claims

No claim is made for exactly-once start, active-run protection, input retirement, participant consistency, rollback, stale asynchronous rejection, or production-ready restart behavior.