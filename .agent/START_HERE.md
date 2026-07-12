# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-11T22-38-54-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with a saved procedural raptor, Three.js creator and gameplay renderers, deterministic patch streaming, Rapier collision, pickups, terminal transitions, HUD projection and Pages deployment.

The latest audit isolates **run-step outcome arbitration**. Movement and goal completion occur inside the Nexus simulation system, while collision and pickups occur afterward in the browser host. A goal can therefore suppress same-step collision checks, and a collision failure can still be followed by a shard pickup before the terminal frame renders.

The immediately preceding public-host capability audit remains valid and is preserved as a dependent read-model and command-gateway ledge.

## Plan ledger

**Goal:** make movement, collision, pickups, goal completion, terminal events, transitions and the visible frame one deterministic run-step commit.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all eligible repositories have central ledgers and root `.agent` state.
- [x] Select only `PrehistoricRush` as the oldest eligible central entry.
- [x] Trace run simulation, physics, fallback collision, pickups, goal, transitions, rendering and HUD.
- [x] Identify all domains, kits and offered services.
- [x] Preserve the preceding host-capability audit and integrate its dependency placement.
- [x] Add timestamped architecture and system audits.
- [x] Change documentation only on `main`.
- [ ] Implement outcome authority and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-11T22-38-54-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-11T22-38-54-04-00-run-step-outcome-arbitration-dsk-map.md
.agent/render-audit/2026-07-11T22-38-54-04-00-terminal-event-frame-correlation-gap.md
.agent/gameplay-audit/2026-07-11T22-38-54-04-00-win-collision-pickup-precedence-loop.md
.agent/interaction-audit/2026-07-11T22-38-54-04-00-movement-collision-pickup-outcome-admission-map.md
.agent/terminal-outcome-audit/2026-07-11T22-38-54-04-00-single-step-outcome-commit-contract.md
.agent/deploy-audit/2026-07-11T22-38-54-04-00-outcome-precedence-fixture-gate.md
.agent/turn-ledger/2026-07-11T22-38-54-04-00.md
.agent/kit-registry.json
```

Preserved preceding audit:

```txt
.agent/trackers/2026-07-11T22-29-24-04-00/project-breakdown.md
.agent/host-capability-audit/2026-07-11T22-29-24-04-00-read-model-command-gateway-contract.md
.agent/deploy-audit/2026-07-11T22-29-24-04-00-public-host-isolation-fixture-gate.md
```

## Current run-step loop

```txt
input
  -> game.setInput
  -> engine.tick(dt)
     -> movement, distance and height mutate
     -> goal check may set win and request transition
  -> update patch streaming
  -> only while status remains game
       set Rapier actor transform
       step Rapier
       combine Rapier and fallback collision
       collision may set run-over
       pickup loop still executes
  -> render final mutable state and HUD
  -> public host exposes raw owners and independently sampled snapshots
```

## Main findings

### Goal can skip collision admission

```txt
movement reaches goal and intersects an obstacle
  -> domain commits win
  -> host sees status != game
  -> collision checks are skipped
  -> win renders without same-step collision evidence
```

### Pickup can mutate a failed run

```txt
collision -> game.fail -> RunFailed
same host block continues
pickup overlap -> game.collectShard -> ShardCollected
run-over frame can show the post-failure shard
```

### Movement commits before outcome validation

Position, route progress, distance and sampled height mutate before collision. Failure has no explicit safe-pose, contact-pose or proposed-pose policy.

### Public host remains a bypass surface

The preceding audit established that `PrehistoricRushHost` exposes live engine, physics, render, streaming and camera owners. The future command gateway must route through the same committed run-step authority instead of providing an alternate terminal mutation path.

## Domains in use

```txt
page routes and player profile lifecycle
creator draft, preview and shared creature rendering
Nexus Engine composition and scene routing
run input, movement, route, surface, score and outcomes
seeded patch generation, Worker execution and controller
terrain, tree, grass, pickup, collider and height consumers
Rapier actor, fixed colliders, step and contacts
fallback collision and pickup projection
terminal event and transition publication
camera follow, Three rendering, HUD and host readback
public host capability and committed read model
validation and Pages deployment
run-step outcome arbitration: missing
```

## Implemented kit groups

```txt
12 Nexus Engine core kits
5 official NexusEngine-Kits
12 product/page/Worker kits
8 external or host adapter boundaries
```

See `.agent/current-audit.md` and `.agent/kit-registry.json` for every kit and service.

## Required parent domain

```txt
prehistoric-rush-run-step-outcome-authority-domain
```

It must coordinate:

```txt
run-step command and predecessor identity
movement proposal without early terminal mutation
world and collider revision admission
Rapier/fallback collision observations
pickup and goal candidates
versioned precedence policy
exactly one continue, fail or win result
atomic movement/reward/status/transition commit
ordered event bundle
terminal frame acknowledgement
public command/read-model correlation
```

## Ordered implementation queue

```txt
1. Route Artifact and Game Profile Handoff final proof
2. Character Creator Draft, Commit and Preview Frame Authority
3. Patch Activation / Release Commit Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration and Terminal Frame Authority
6. Stream Cadence and Time Budget Authority
7. World Readiness and Movement Admission
8. Committed Gameplay Frame and Host Read Model
8a. Public Host Capability Gateway
9. Run / Stream / Collider / Worker / Frame Epoch Reset
10. Runtime Lifecycle and Ordered Disposal
```

## Next safe ledge

```txt
PrehistoricRush Run-Step Outcome Arbitration
+ Goal/Collision/Pickup Precedence and Terminal-Frame Fixture Gate
```

Extend the existing `prehistoric-rush-domain-kit`, Rapier adapter, active-content adapter and render/HUD projection. Do not add a second run-state store, physics world, pickup inventory, command gateway or render loop.
