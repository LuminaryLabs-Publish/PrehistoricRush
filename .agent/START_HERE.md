# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-11T19-09-25-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with profile persistence, procedural creature generation, deterministic patch streaming, Rapier collision, Three.js rendering, HUD projection and Pages deployment.

The current audit establishes the missing **stream cadence and time-budget authority**. Movement is advanced from elapsed seconds, but patch request starts and patch activation are budgeted per animation frame. The same player speed therefore receives different world-stream throughput at 30 Hz, 60 Hz and 120 Hz.

## Plan ledger

**Goal:** make simulation, generation, activation, visibility suspension and first-visible-frame evidence consume one explicit clock and bounded wall-time policy.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` state.
- [x] Detect same-window documentation writes in `IntoTheMeadow` and recent work in `AetherVale`.
- [x] Select only `PrehistoricRush` as the oldest stable eligible repository.
- [x] Trace RAF delta, engine tick, stream pump, ready activation, Worker backlog, physics and render order.
- [x] Identify the interaction loop, domains, complete kit inventory and services.
- [x] Define time-budget, suspension, backlog and cadence-parity contracts.
- [x] Add timestamped architecture and system audits.
- [x] Change documentation only and push directly to `main`.
- [ ] Implement the authority and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-11T19-09-25-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-11T19-09-25-04-00-stream-cadence-time-budget-dsk-map.md
.agent/render-audit/2026-07-11T19-09-25-04-00-refresh-rate-patch-visibility-gap.md
.agent/gameplay-audit/2026-07-11T19-09-25-04-00-player-speed-stream-throughput-loop.md
.agent/interaction-audit/2026-07-11T19-09-25-04-00-raf-visibility-cadence-result-map.md
.agent/stream-cadence-audit/2026-07-11T19-09-25-04-00-time-budget-suspension-backlog-contract.md
.agent/deploy-audit/2026-07-11T19-09-25-04-00-stream-cadence-fixture-gate.md
.agent/turn-ledger/2026-07-11T19-09-25-04-00.md
.agent/kit-registry.json
```

## Interaction loop

```txt
requestAnimationFrame
  -> dt = min(0.05, wall-clock delta)
  -> project browser booleans into game input
  -> engine.tick(dt)
  -> updateStreaming(state)
     -> controller.update()
     -> release patches
     -> pump 2 Worker requests or 1 fallback request per frame
     -> activate at most 1 ready patch per frame
  -> Rapier step and collision
  -> pickup checks
  -> camera, Three render and HUD
  -> request next frame
```

## Main finding

```txt
refresh rate   max ready activations/second   max Worker starts/second
30 Hz          30                             60
60 Hz          60                             120
120 Hz         120                            240
```

Fallback generation starts at one request per frame, so its corresponding limits are 30, 60 and 120 starts per second.

The runner moves in meters per second while stream throughput scales with refresh frames. Low-refresh and throttled clients therefore have less generation and activation capacity per meter traveled. No cadence revision, wall-time budget, visibility-suspension result or backlog-age policy explains or bounds the difference.

## Domains in use

```txt
page routing and profile persistence
pinned module and dependency identity
Nexus Engine composition and scene routing
run lifecycle, input, movement, score and outcomes
procedural creature generation, skinning and poses
patch generation, Worker execution, cache, queue and membership
terrain, tree, grass, pickup, collider and height consumers
Rapier actor, fixed colliders, step and contacts
collision, pickup and terminal admission
camera smoothing and run-change reset
Three rendering, HUD projection and public host
runtime clock, RAF cadence and visibility lifecycle
stream time budgeting and backlog policy: missing
world readiness, committed-frame, reset-epoch and lifecycle authority: missing
validation and Pages deployment
```

## Implemented kits

```txt
12 Nexus Engine core kits
5 official NexusEngine-Kits
10 product/page/Worker kits
8 external or host adapter boundaries
```

See `.agent/current-audit.md`, `.agent/kit-registry.json` and the timestamped tracker for every kit and offered service.

## Required parent domain

```txt
prehistoric-rush-stream-cadence-time-budget-authority-domain
```

It must coordinate:

```txt
runtime clock and visibility state
simulation-step policy
elapsed-time generation budget
time-sliced activation budget
backlog age and starvation bounds
suspend/resume admission
cadence revision and results
world-readiness and visible-frame evidence
```

## Next safe ledge

```txt
PrehistoricRush Stream Cadence + Time Budget Authority
+ 30/60/120 Hz, Throttled Frame and Hidden-Tab Fixture Gate
```

This must extend the existing RAF, patch controller and world-readiness plans. It must not create a second animation loop, streamer or simulation owner.