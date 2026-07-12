# Architecture Audit: Run Start/Restart Authority DSK Map

**Generated:** `2026-07-12T09-01-44-04-00`

## Summary

Run-step outcomes now use the engine simulation transaction, but run creation still spans a product API and browser-host reset calls. The missing parent domain must coordinate all stateful participants under one run epoch.

## Current split ownership

```txt
product game.start
  -> RunState/InputState replacement
  -> simulation resolution reset
  -> RunStarted event
  -> scene transition
browser host start
  -> dynamic content refresh
  -> stream update and center generation
  -> camera reset
next engine tick
  -> physics motion and committed run step
```

## Required parent

```txt
prehistoric-rush-run-start-restart-authority-domain
```

## DSK map

```txt
identity/admission
  run-start-command-kit
  run-start-command-id-kit
  run-epoch-kit
  run-start-predecessor-admission-kit
participant plans
  run-state-reset-plan-kit
  run-input-reset-plan-kit
  simulation-resolution-reset-plan-kit
  physics-body-reset-plan-kit
  stream-reset-adoption-plan-kit
  active-content-reset-plan-kit
  camera-reset-plan-kit
  scene-transition-reset-plan-kit
transaction
  run-start-prepare-kit
  run-start-participant-result-kit
  run-start-commit-kit
  run-start-rollback-kit
  stale-run-start-result-rejection-kit
results/proof
  run-start-result-kit
  run-start-observation-kit
  run-start-journal-kit
  first-run-tick-ack-kit
  first-run-visible-frame-ack-kit
fixtures
  initial-start-retry-parity-fixture-kit
  run-start-participant-failure-fixture-kit
  browser-authoritative-restart-smoke-kit
```

## Boundary rule

The browser host may adapt buttons, keyboard and render surfaces. It may not independently create a run, reset stream/content/camera owners or declare the run visible. Those decisions belong to the parent authority and must produce typed participant and frame evidence.
