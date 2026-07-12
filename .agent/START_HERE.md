# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-12T05-21-52-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with a persisted procedural raptor, Three.js creator and gameplay renderers, deterministic Worker patch streaming, Rapier/fallback collision, streamed shards, terminal transitions, HUD projection and Pages deployment.

The current audit isolates **browser input command authority**. The engine installs `core-input-kit`, but the active browser host uses global listeners, a parallel mutable held-state object and direct `game.start()`/`game.setInput()` calls. Enter restarts even during active gameplay, browser repeat is not classified, and repeated Space observations can re-arm jump after the simulation clears the prior pulse.

All prior runtime-module, surface, profile, creator, streaming, shard, collision, cadence, readiness, outcome, frame, host, reset and lifecycle audits remain active dependencies.

## Plan ledger

**Goal:** establish one phase-safe input path that distinguishes physical press edges from held controls, rejects repeated/stale observations, retires state at lifecycle barriers and correlates accepted commands with simulation and visible frames.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` as the oldest eligible ledger entry.
- [x] Trace button, keyboard, keyup, blur, host-held state, product input and RAF consumption.
- [x] Identify all interaction loops, domains, kits and services.
- [x] Add timestamped architecture and system audits.
- [x] Update documentation on `main`; create no branch or pull request.
- [ ] Implement input authority and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-12T05-21-52-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T05-21-52-04-00-input-command-authority-dsk-map.md
.agent/render-audit/2026-07-12T05-21-52-04-00-input-step-visible-response-gap.md
.agent/gameplay-audit/2026-07-12T05-21-52-04-00-enter-repeat-jump-loop.md
.agent/interaction-audit/2026-07-12T05-21-52-04-00-browser-input-command-admission-map.md
.agent/input-authority-audit/2026-07-12T05-21-52-04-00-edge-hold-repeat-retirement-contract.md
.agent/deploy-audit/2026-07-12T05-21-52-04-00-browser-input-fixture-gate.md
.agent/turn-ledger/2026-07-12T05-21-52-04-00.md
.agent/kit-registry.json
```

## Main findings

```txt
core-input-kit is installed but is not the browser ingress owner
button and keyboard use different start/jump policy branches
Enter calls start() in every phase, including active gameplay
keydown repeat is not inspected
held Enter can repeatedly replace the run and increment runId
jump is a mutable pulse cleared by simulation
later Space repeat can re-arm jump without key release
host held flags and product InputState are parallel owners
blur retires input, but visibility/reset/disposal results are absent
no input command, revision, step-consumption or visible-frame receipt exists
```

## Domains and kit groups

```txt
routes/profile/creator
runtime module graph and import maps
12 Nexus Engine core kits
5 official NexusEngine-Kits
12 product/page/Worker kits
9 external and host adapter boundaries, including browser input
run, streaming, physics, camera, Three render, HUD and host readback
outcome, frame, host capability, reset, lifecycle, validation and deployment
input observation, edge/hold policy, admission, retirement, step and frame authority: missing
```

See the tracker and kit registry for every kit and service.

## Required parent domain

```txt
prehistoric-rush-input-command-authority-domain
```

It coordinates normalized input observations, source and repeat evidence, edge/hold state, run and phase admission, command identity/idempotency, core-input ownership, focus/visibility/reset retirement, simulation-step consumption, visible-frame correlation, observations, journals and fixtures.

## Ordered implementation queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Browser Input Command Admission and Edge/Hold Authority
0b. Render Surface Resolution and Frame Correlation
1. Route Artifact and Game Profile Handoff Proof
2. Character Creator Draft, Commit and Preview Frame Authority
3. Patch Activation and Release Commit Authority
3a. Shard Identity, Collection Commit and Visible Removal Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration and Terminal Frame Authority
6. Stream Cadence and Time Budget Authority
7. World Readiness and Movement Admission
8. Committed Gameplay Frame and Read Model
8a. Public Host Capability Gateway
9. Coordinated Run/Stream/Worker/Collider/Frame Reset
10. Runtime Lifecycle and Ordered Disposal
```

Do not add a second input owner. Adapt the existing browser listeners and button into the installed core input capability, then make the product domain consume one immutable per-step input snapshot.