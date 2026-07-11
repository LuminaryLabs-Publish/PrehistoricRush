# Architecture Audit: Stream Cadence and Time Budget DSK Map

**Timestamp:** `2026-07-11T19-09-25-04-00`

## Summary

The product has separate owners for gameplay simulation, patch scheduling, Worker execution, physics, camera and rendering, but no parent authority defines their shared clock or how much stream work may be admitted per elapsed second.

## Plan ledger

**Goal:** extend existing owners with one cadence transaction rather than introducing parallel loops or queues.

- [x] Map existing owners.
- [x] Map per-RAF budget calls.
- [x] Identify missing parent-domain responsibilities.
- [x] Define candidate DSK composition.
- [x] Define command/result and observation boundaries.
- [ ] Implement through existing runtime owners.

## Existing ownership map

```txt
browser RAF host
  owns wall-clock sampling and call order

prehistoric-rush-domain-kit
  owns run simulation, movement, jump, distance and outcome

seeded-world-patch-controller-kit
  owns focus, desired membership, queue, inflight, ready, active and cache state
  exposes per-call generation and activation maxima

message Worker executor adapter
  owns request/response correlation and asynchronous completion

active-content consumer adapter
  owns terrain, tree, grass, pickup, collider and height projection

rapier-physics-domain-kit
  owns Rapier timestep, actor transform, fixed colliders and contacts

camera-smooth-follow-kit
  owns camera damping and maximum delta

Three host adapter
  owns frame rendering and HUD projection
```

## Missing parent domain

```txt
prehistoric-rush-stream-cadence-time-budget-authority-domain
```

## Candidate DSK composition

```txt
runtime-clock-state-kit
  canonical wall, simulation and visibility observation

frame-sample-kit
  normalized frame identity and elapsed inputs

browser-visibility-state-kit
  visible, hidden, throttled and resumed classification

cadence-revision-kit
  revision shared by simulation, stream, physics and frame evidence

simulation-step-policy-kit
  fixed-step or normalized variable-step admission

stream-work-time-budget-kit
  elapsed-time work allowance and hard per-frame ceiling

generation-start-budget-kit
  required, active and prefetch request-start admission

activation-time-budget-kit
  ready-patch commit admission

stream-backlog-age-kit
  queued, inflight and ready age observation

stream-starvation-policy-kit
  fairness and required-route priority

suspension-admission-kit
  hidden/throttled work policy

resume-catchup-plan-kit
  bounded restore transaction and credit cap

cadence-admission-result-kit
  typed accepted, limited, suspended or rejected result

stream-cadence-commit-kit
  atomic publication of cadence and work-spent revisions

cadence-observation-kit
  detached read model for HUD and host

cadence-journal-kit
  bounded command, decision and result history

cadence-parity-fixture-kit
  deterministic 30/60/120 Hz proof

throttled-frame-fixture-kit
  long-frame and low-refresh proof

hidden-tab-resume-fixture-kit
  suspension, stale-work and first-visible-frame proof
```

## Command flow

```txt
FrameClockObservation
  -> CadenceAdmissionCommand
  -> visibility and session admission
  -> simulation-step plan
  -> stream-work budget plan
  -> generation admission
  -> activation admission
  -> physics and render consumption
  -> CadenceCommitResult
  -> VisibleCadenceFrameReceipt
```

## Dependency order

```txt
patch activation transaction
  -> cadence/time-budget authority
  -> world readiness and movement admission
  -> committed-frame observation
  -> reset epoch authority
```

## Non-goals

```txt
no second RAF
no second patch controller
no replacement Worker queue
no independent physics clock
no unlimited catch-up accumulator
no FPS-only quality heuristic presented as correctness
```

## Acceptance proof

```txt
equal wall-time simulations at 30/60/120 Hz
bounded start and activation rates
required-route priority under backlog
hidden-tab suspension with no unlimited credits
stale pre-resume result rejection
first visible frame cites current cadence and world revisions
```