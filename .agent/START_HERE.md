# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-12T02-21-55-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with a persisted procedural raptor, Three.js creator and gameplay renderers, deterministic Worker patch streaming, Rapier/fallback collision, pickups, terminal transitions, HUD projection and Pages deployment.

The current audit isolates **render-surface authority**. Gameplay sizes its camera and renderer from global window dimensions and samples device pixel ratio only during startup. Creator uses a local `ResizeObserver` with a separate sizing policy. Neither path publishes a surface identity, revision, physical-size receipt or first-frame acknowledgement.

The prior runtime-module graph, outcome, host, creator, streaming, collision, cadence, readiness, frame, reset and lifecycle audits remain active dependencies.

## Plan ledger

**Goal:** establish one surface policy and transaction from CSS-size and device-scale observation through renderer/camera commit, physical readback, visible-frame acknowledgement and detached diagnostics.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` as the oldest eligible ledger entry.
- [x] Trace creator and gameplay resize, DPR, camera, renderer, RAF and host paths.
- [x] Identify interaction loops, domains, kits and offered services.
- [x] Add timestamped architecture and system audits.
- [x] Update documentation on `main`; create no branch or pull request.
- [ ] Implement the surface authority and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-12T02-21-55-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T02-21-55-04-00-render-surface-authority-dsk-map.md
.agent/render-audit/2026-07-12T02-21-55-04-00-game-creator-surface-policy-gap.md
.agent/gameplay-audit/2026-07-12T02-21-55-04-00-simulation-surface-frame-ack-gap.md
.agent/interaction-audit/2026-07-12T02-21-55-04-00-resize-observation-commit-map.md
.agent/render-surface-audit/2026-07-12T02-21-55-04-00-css-dpr-physical-frame-contract.md
.agent/deploy-audit/2026-07-12T02-21-55-04-00-render-surface-fixture-gate.md
.agent/turn-ledger/2026-07-12T02-21-55-04-00.md
.agent/kit-registry.json
```

## Main findings

```txt
gameplay dimensions come from innerWidth / innerHeight
gameplay DPR is sampled only during renderer construction
gameplay listens to window resize, not actual host bounds
creator observes its local preview container
creator DPR is also sampled only during construction
no named quality tier or physical-pixel budget exists
no surface ID or monotonic revision exists
no actual drawing-buffer receipt exists
no first frame after resize acknowledgement exists
public host exposes no surface provenance
```

## Domains and kit groups

```txt
routes/profile/creator
runtime module graph and import maps
12 Nexus Engine core kits
5 official NexusEngine-Kits
12 product/page/Worker kits
8 external and host adapter boundaries
run, streaming, physics, camera, Three render, HUD and host readback
outcome, frame, host capability, reset, lifecycle, validation and deployment
render-surface resolution and frame correlation: missing
```

See the tracker and kit registry for every kit and service.

## Required parent domain

```txt
prehistoric-rush-render-surface-authority-domain
```

It coordinates surface policy, CSS-size and DPR observations, resize admission, pixel budget, renderer and camera commits, creator/game adapters, surface revisions, frame acknowledgement, diagnostics, journals and browser fixtures.

## Ordered implementation queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Render Surface Resolution and Frame Correlation
1. Route Artifact and Game Profile Handoff proof
2. Character Creator Draft, Commit and Preview Frame Authority
3. Patch Activation and Release Commit Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration and Terminal Frame Authority
6. Stream Cadence and Time Budget Authority
7. World Readiness and Movement Admission
8. Committed Gameplay Frame and Read Model
8a. Public Host Capability Gateway
9. Coordinated Run/Stream/Worker/Collider/Frame Reset
10. Runtime Lifecycle and Ordered Disposal
```

Do not add another renderer, camera, resize loop or RAF. Route the existing creator and gameplay owners through one surface contract.