# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-11T17-39-47-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with profile persistence, procedural creature generation, deterministic route generation, streamed world patches, Rapier collision, Three.js rendering, HUD projection and Pages deployment.

The current audit establishes the missing **world readiness and movement admission authority**. The RAF advances the run through `engine.tick(dt)` before `updateStreaming(state)` evaluates the already-moved actor position. When a required patch is absent, simulation and camera sampling silently use `fallbackHeight()`, while terrain, fixed colliders, pickups and render consumers arrive later.

## Plan ledger

**Goal:** make every admitted movement step consume one committed route-ahead world revision across height, terrain, collision, pickups, rendering and frame observation.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` state.
- [x] Detect same-window `IntoTheMeadow` documentation writes.
- [x] Select only `PrehistoricRush` as the oldest stable fallback.
- [x] Trace simulation, height sampling, streaming, physics, collision, rendering and HUD order.
- [x] Identify the interaction loop, domains, kits and services.
- [x] Define required-corridor, readiness, movement-admission and frame-proof contracts.
- [x] Add timestamped architecture and system audits.
- [x] Change documentation only and push directly to `main`.
- [ ] Implement the authority and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-11T17-39-47-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-11T17-39-47-04-00-world-readiness-movement-admission-dsk-map.md
.agent/render-audit/2026-07-11T17-39-47-04-00-fallback-height-visible-terrain-parity-gap.md
.agent/gameplay-audit/2026-07-11T17-39-47-04-00-simulation-outruns-stream-loop.md
.agent/interaction-audit/2026-07-11T17-39-47-04-00-movement-world-readiness-admission-map.md
.agent/stream-readiness-audit/2026-07-11T17-39-47-04-00-required-corridor-commit-contract.md
.agent/deploy-audit/2026-07-11T17-39-47-04-00-world-readiness-latency-fixture-gate.md
.agent/turn-ledger/2026-07-11T17-39-47-04-00.md
.agent/kit-registry.json
```

## Interaction loop

```txt
browser input
  -> game.setInput
  -> engine.tick(dt)
     -> movement and distance commit
     -> sampleHeight uses active patch or fallbackHeight
  -> updateStreaming(already-moved state)
     -> focus, queue, generation and activation
  -> Rapier step and fallback collision
  -> pickup checks
  -> camera and Three render
  -> HUD and public host
```

## Main finding

```txt
movement admission result: absent
required route-ahead corridor: absent
patch readiness revision: absent
height-source readiness: absent
collision-source readiness: absent
pickup readiness: absent
render-consumer readiness: absent
world/frame parity receipt: absent
```

A patch can become authoritative after the actor has already entered its area. This can change height, visible terrain, collision and pickup availability between frames without an explicit transition result.

## Domains in use

```txt
page routing and profile persistence
pinned module/dependency identity
Nexus Engine composition and scene routing
run lifecycle, input, route, movement, score and outcomes
procedural creature generation, skinning and poses
patch generation, Worker execution, cache, queue and membership
terrain, tree, grass, pickup, collider and height consumers
Rapier actor, fixed colliders, step and contacts
collision, pickup and terminal admission
camera smoothing and run-change reset
Three rendering, HUD projection and public host
world readiness and movement admission: missing
committed-frame, reset-epoch and lifecycle authority: missing
validation and Pages deployment
```

## Implemented kits

```txt
12 Nexus Engine core kits
5 official NexusEngine-Kits
10 product/page/worker kits
8 external or host adapter boundaries
```

See `.agent/current-audit.md`, `.agent/kit-registry.json` and the timestamped tracker for every kit and offered service.

## Required parent domain

```txt
prehistoric-rush-world-readiness-movement-authority-domain
```

It must coordinate:

```txt
required travel corridor
patch content and membership revisions
height, collision, pickup and render readiness
movement admit/cap/defer result
simulation and physics consumption
committed visible frame acknowledgement
stale Worker and consumer-result rejection
```

## Next safe ledge

```txt
PrehistoricRush World Readiness + Movement Admission Authority
+ Delayed/Reordered Patch and Frame-Parity Fixture Gate
```

This extends the existing patch controller, consumer adapters, collision authority and committed-frame plan. It must not create a second streamer, movement loop or collision system.
