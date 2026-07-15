# Architecture Audit: Host Clock Fixed-Step Frame DSK Map

**Timestamp:** `2026-07-15T10-58-45-04-00`

## Summary

The browser host owns wall-clock sampling and submits one clipped tick per RAF callback. The product domain independently clips the admitted tick again. No domain owns accumulated elapsed time, deterministic catch-up, residual time, overload receipts, visibility rebasing or simulation-to-render revision binding.

## Plan ledger

**Goal:** place clock ownership above simulation, physics, streaming and rendering without moving gameplay truth into the browser adapter.

- [x] Identify the browser host as the current wall-clock sampler.
- [x] Identify Core Simulation and PrehistoricRush as delta consumers.
- [x] Identify patch streaming and rendering as callback-cadence consumers.
- [x] Separate wall-clock interval admission from fixed simulation steps.
- [x] Define typed commands, results, snapshots and acknowledgements.
- [ ] Implement the authority and dependency wiring.

## Current ownership

```txt
game-runtime-lod-host-adapter
  owns performance.now and RAF
  clamps wall interval to 0.05
  samples keyboard state
  calls engine.tick once
  updates streaming once
  renders once

prehistoric-rush-domain-kit
  clamps tick.delta to 0.05
  integrates elapsed, pose, velocity, distance and goal
  publishes motion and simulation proposals

Core Physics / Core Simulation
  consume the single admitted tick

Three.js / patch controller
  update once per RAF callback
```

## Required parent domain

`prehistoric-rush-host-clock-fixed-step-frame-authority-domain`

## Coordinating surfaces

```txt
host-clock-capability-kit
monotonic-frame-interval-kit
document-clock-lifecycle-kit
fixed-step-policy-kit
elapsed-time-accumulator-kit
catch-up-budget-kit
residual-time-kit
overload-classification-kit
discarded-time-receipt-kit
input-step-batch-kit
simulation-step-batch-kit
physics-step-batch-kit
patch-stream-clock-budget-kit
render-interpolation-descriptor-kit
host-clock-snapshot-kit
host-clock-frame-result-kit
visibility-suspension-kit
resume-clock-rebase-kit
first-clock-aligned-frame-ack-kit
host-clock-fixture-kit
```

## Command and result map

```txt
HostClockFrameCommand
  documentGeneration
  runtimeGeneration
  rafGeneration
  monotonicTimestamp
  expectedClockRevision

HostClockFrameResult
  admittedInterval
  fixedStepCount
  fixedStepDelta
  residualTime
  overloadState
  discardedTimeReceipt
  simulationRevision
  interpolationFraction

FirstClockAlignedFrameAck
  clockRevision
  simulationRevision
  rendererGeneration
  presentedFrameId
```

## Dependency rule

The browser adapter may observe timestamps and emit `HostClockFrameCommand`. It must not decide gameplay delta independently. Core Simulation and product systems consume only accepted fixed steps. Rendering consumes the accepted simulation revision plus an interpolation descriptor. Patch streaming receives an explicit budget policy rather than implicit RAF-count throughput.

## Boundary

This map defines architecture only. No DSK, scheduler, accumulator, interpolation path or fixture was implemented.