# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T19-09-25-04-00`

## Summary

Complete route/profile, patch activation and collider authority first. Then normalize stream work against elapsed time and visibility before world-readiness admission depends on that evidence. Committed-frame, reset-epoch and lifecycle work should consume the same clock and cadence revision.

## Plan ledger

**Goal:** produce a route-safe, patch-consistent, cadence-stable, collision-provable, frame-coherent and atomically restartable game.

- [ ] Complete P0 route/page/profile authority.
- [ ] Complete P1 patch activation and release transactions.
- [ ] Complete P1a exact collider retirement and collision admission.
- [ ] Implement P1b stream cadence and time-budget authority.
- [ ] Implement P1c world readiness and movement admission.
- [ ] Complete P2 committed-frame observation and detached host readback.
- [ ] Implement P3 run/stream/collider/Worker/frame epoch reset authority.
- [ ] Complete P4 startup rollback, resource ownership and disposal.
- [ ] Gate deployment on Node, browser and Pages fixtures.

## Ordered implementation queue

```txt
1. Route Manifest + Profile Handoff Authority
2. Patch Activation / Release Commit Authority
3. Exact Collider Replacement + Collision Admission
4. Stream Cadence + Time Budget Authority
5. World Readiness + Movement Admission Authority
6. Committed Frame Observation + Host Read Model
7. Run / Stream / Collider / Worker / Frame Epoch Reset Authority
8. Runtime Lifecycle + Ordered Disposal
```

## P1b implementation sequence

### 1. Define one runtime clock observation

```txt
RuntimeClockSample {
  runtimeSessionId
  frameId
  wallNow
  wallDelta
  simulationDelta
  visibilityState
  visibilityRevision
  cadenceRevision
}
```

### 2. Replace raw per-frame stream budgets

Current behavior:

```txt
pump maximum: 2 with Worker, 1 with fallback, per RAF
activation maximum: 1 per RAF
```

Target behavior:

```txt
generation work admitted from an elapsed-time budget
activation work admitted from an elapsed-time budget
hard per-frame ceilings retained to prevent long stalls
unused credit bounded so hidden tabs cannot bank unlimited work
```

### 3. Add backlog age and fairness

Each queued, inflight and ready item should expose:

```txt
request identity
patch identity
queued timestamp
started timestamp
ready timestamp
oldest age
priority class
admission reason
cadence revision
```

- [ ] Prevent starvation of required-route patches.
- [ ] Keep prefetch work subordinate to required active work.
- [ ] Bound catch-up after throttling or visibility restore.
- [ ] Reject obsolete work through the planned stream epoch.

### 4. Define simulation-step policy

Choose and document one policy:

```txt
fixed-step accumulator with bounded substeps
or
normalized variable step with cadence parity proof
```

The policy must cover run movement, jump integration, Rapier timestep, camera update and animation time. It must state what happens when wall delta exceeds the maximum admitted simulation interval.

### 5. Define suspension and resume

```txt
visible -> hidden
  freeze new gameplay command admission
  stop or sharply limit nonessential stream work
  retain bounded required state

hidden -> visible
  advance visibility revision
  reject stale results
  prepare bounded catch-up plan
  commit one coherent world/frame revision
  resume input after first visible-frame acknowledgement
```

### 6. Connect cadence to world readiness

- [ ] Required-corridor readiness must include cadence revision.
- [ ] Speed cap/defer policy must distinguish world latency from browser throttling.
- [ ] HUD diagnostics must report backlog age and actual admitted work.
- [ ] Frame commit must cite clock, cadence and world revisions.

## Required fixtures

```bash
node scripts/prehistoric-rush-cadence-30-60-120-fixture.mjs
node scripts/prehistoric-rush-stream-time-budget-fixture.mjs
node scripts/prehistoric-rush-generation-start-rate-fixture.mjs
node scripts/prehistoric-rush-activation-rate-fixture.mjs
node scripts/prehistoric-rush-throttled-frame-fixture.mjs
node scripts/prehistoric-rush-hidden-tab-resume-fixture.mjs
node scripts/prehistoric-rush-backlog-starvation-fixture.mjs
node scripts/prehistoric-rush-cadence-world-readiness-fixture.mjs
node scripts/prehistoric-rush-browser-refresh-parity-smoke.mjs
node scripts/prehistoric-rush-pages-refresh-parity-smoke.mjs
```

## Acceptance conditions

```txt
equal wall time at 30, 60 and 120 Hz yields equivalent simulation and stream readiness
per-second generation and activation remain within declared tolerances
low-refresh behavior is explicit and bounded
hidden-tab suspension cannot bank unlimited credits or stale completions
resume cannot publish a mixed pre-suspend and post-resume frame
world readiness and movement admission consume the same cadence revision
HUD and host report actual time budgets, backlog age and first-visible-frame result
```

## Do not do next

Do not create a second RAF, patch controller, Worker queue or movement clock. Do not convert per-frame limits into unbounded catch-up. Do not let prefetch work consume the required-route budget. Do not claim cadence parity from average FPS alone.