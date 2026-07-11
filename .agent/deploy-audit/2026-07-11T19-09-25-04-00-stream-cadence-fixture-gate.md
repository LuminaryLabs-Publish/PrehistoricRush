# Deploy Audit: Stream Cadence Fixture Gate

**Timestamp:** `2026-07-11T19-09-25-04-00`

## Summary

Current source inspection cannot prove refresh-rate parity, bounded long-frame behavior or hidden-tab recovery. Deployment should not claim cadence-stable streaming until pure, browser and Pages fixtures cover those paths.

## Plan ledger

**Goal:** make cadence correctness an executable release gate.

- [x] Identify source-backed cadence differences.
- [x] Define pure fixture matrix.
- [x] Define browser and Pages smoke matrix.
- [x] Define evidence required from each run.
- [ ] Add scripts and CI wiring.
- [ ] Run and retain evidence.

## Pure fixture gate

```bash
node scripts/prehistoric-rush-cadence-30-60-120-fixture.mjs
node scripts/prehistoric-rush-stream-time-budget-fixture.mjs
node scripts/prehistoric-rush-generation-start-rate-fixture.mjs
node scripts/prehistoric-rush-activation-rate-fixture.mjs
node scripts/prehistoric-rush-throttled-frame-fixture.mjs
node scripts/prehistoric-rush-hidden-tab-resume-fixture.mjs
node scripts/prehistoric-rush-backlog-starvation-fixture.mjs
node scripts/prehistoric-rush-cadence-world-readiness-fixture.mjs
```

## Browser gate

```txt
run deterministic input trace at 30 Hz emulation
run same trace at 60 Hz emulation
run same trace at 120 Hz emulation
inject 250 ms and 1000 ms frame stalls
hide document while Worker requests are inflight
restore visibility and observe first coherent frame
```

## Pages gate

```bash
node scripts/prehistoric-rush-pages-refresh-parity-smoke.mjs
```

The deployed route must expose detached evidence for:

```txt
runtime and run session IDs
frame and cadence revisions
wall and simulation deltas
generation and activation budgets available/spent
queued, inflight and ready counts
oldest backlog ages
required-route starvation count
world readiness revision
first-visible-frame receipt
```

## Required assertions

```txt
equal input and wall time produce equivalent distance within tolerance
patch readiness and visible membership converge within declared tolerance
admitted starts and activations obey per-second policy
hard per-frame ceilings prevent catch-up stalls
hidden state does not bank unlimited work credit
pre-suspend stale results do not commit after resume
required patches outrank prefetch under backlog
HUD, host and visible frame cite one cadence/world/frame identity
```

## Failure policy

```txt
any missing identity: fail
unbounded catch-up credit: fail
refresh-rate-dependent policy outside declared tolerance: fail
required patch starvation: fail
mixed pre/post-resume frame: fail
missing first-visible-frame acknowledgement: fail
```

## Current status

```txt
runtime source changed by audit: no
fixture scripts available: no
browser smoke run: no
Pages smoke run: no
deployment workflow changed: no
release correctness claim: not established
```