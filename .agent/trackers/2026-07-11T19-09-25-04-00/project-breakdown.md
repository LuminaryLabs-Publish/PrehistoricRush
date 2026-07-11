# Project Breakdown: PrehistoricRush Stream Cadence and Time Budget

**Timestamp:** `2026-07-11T19-09-25-04-00`

## Summary

`PrehistoricRush` was selected as the oldest stable eligible Publish repository after the full organization inventory and central ledger were compared. The audit found that movement is elapsed-time based while patch generation starts and ready-patch activation are admitted per RAF call, producing refresh-rate-dependent world-stream throughput.

## Plan ledger

**Goal:** document one authoritative timing boundary across simulation, streaming, visibility suspension, physics, rendering and diagnostics.

- [x] Compare the full Publish repository inventory against the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm no eligible repository is new, ledger-missing or root-`.agent`-missing.
- [x] Avoid same-window `IntoTheMeadow` and recent `AetherVale` documentation work.
- [x] Select only `PrehistoricRush`.
- [x] Read the product runtime, game domain, patch generator and pinned controller/physics sources.
- [x] Identify the interaction loop.
- [x] Identify all domains in use.
- [x] Identify all implemented kits and offered services.
- [x] Define the missing cadence/time-budget authority and fixture gate.
- [x] Refresh root `.agent` entrypoints.
- [x] Add timestamped architecture and system audits.
- [ ] Implement runtime changes and executable fixtures.

## Selection comparison

```txt
IntoTheMeadow      central 2026-07-11T17-30-56-04-00, same-window repo-local writes
PrehistoricRush    central 2026-07-11T17-39-47-04-00, selected stable fallback
MyCozyIsland       central 2026-07-11T17-50-37-04-00
TheOpenAbove       central 2026-07-11T18-01-38-04-00
HorrorCorridor     central 2026-07-11T18-11-21-04-00
PhantomCommand     central 2026-07-11T18-21-09-04-00
ZombieOrchard      central 2026-07-11T18-28-40-04-00
TheUnmappedHouse   central 2026-07-11T18-38-45-04-00
AetherVale         central 2026-07-11T18-48-21-04-00, recent repo-local writes
TheCavalryOfRome   excluded
```

## Interaction loop

```txt
RAF wall-clock sample
  -> clamp dt to 0.05
  -> set gameplay input
  -> engine.tick(dt)
  -> controller focus/update/release
  -> start fixed request count per frame
  -> activate fixed ready-patch count per frame
  -> Rapier step(dt)
  -> collision and pickup checks
  -> camera and animation update
  -> Three render
  -> HUD and host projection
```

## Source-backed rate model

```txt
STREAM.activationBudget = 1
STREAM.generationBudget = 2
fallback generation maximum = 1

30 Hz:
  activation <= 30/sec
  Worker starts <= 60/sec
  fallback starts <= 30/sec

60 Hz:
  activation <= 60/sec
  Worker starts <= 120/sec
  fallback starts <= 60/sec

120 Hz:
  activation <= 120/sec
  Worker starts <= 240/sec
  fallback starts <= 120/sec
```

Player travel is expressed in meters per second, so the amount of stream work available per meter changes with refresh rate.

## Domains in use

```txt
browser route and module loading
profile schema and cross-page persistence
Nexus Engine composition and scene routing
run lifecycle, movement, route and outcomes
runtime clock, RAF and browser visibility
procedural creature geometry, skeleton, skinning and pose
seeded patch generation and Worker execution
patch cache, queue, focus and membership
terrain, grass, tree, pickup, collider and height projection
Rapier world, actor, fixed colliders and contacts
collision and terminal admission
camera smoothing and reset
Three rendering, HUD and host diagnostics
stream cadence and time budgeting: missing
world readiness and movement admission: missing
committed-frame, epoch reset and lifecycle authority: missing
validation and Pages deployment
```

## Complete kit inventory

### Nexus Engine core kits

```txt
core-input-kit
core-spatial-kit
core-scene-kit
core-physics-kit
core-motion-kit
core-camera-kit
core-animation-kit
core-graphics-kit
core-skybox-kit
core-ui-kit
core-diagnostics-kit
core-composition-kit
```

Services: input actions and state, transforms, scene transitions, physics/motion/camera/animation/graphics capabilities, sky, UI projection, diagnostics and composition metadata.

### Official NexusEngine-Kits

```txt
seed-kit
procedural-creature-body-kit
instanced-render-batch-kit
seeded-world-patch-controller-kit
camera-smooth-follow-kit
```

Services: deterministic random streams; creature recipe, geometry, skeleton, skinning, collision recommendation, pose and snapshot; instance-cell replacement/release and bounds; patch identity, cache, queue, Worker execution, ready/release delivery, per-call budgets, reset and snapshots; smooth camera damping, teleport handling, reset and snapshots.

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit
player-character-schema-kit
player-character-profile-store-kit
menu-page-kit
character-creator-page-kit
game-page-entry-kit
drunk-route-generator
player-raptor-preset-kit
prehistoric-patch-generator
prehistoric-patch-worker
```

Services: run lifecycle, route, movement, score and outcome; profile normalization and persistence; menu/creator/game routing; deterministic route samples and classification; creature preset; terrain, trees, grass, pickups, colliders and transferable Worker output.

### External and host adapter boundaries

```txt
rapier-physics-domain-kit
Three runtime module
Rapier runtime module
message Worker executor adapter
active-content consumer adapter
collision fallback adapter
run failure adapter
creature/camera/render host adapters
```

Services: physics world and contacts; Three scene and GPU projection; Worker request correlation; active patch projection; fallback overlap testing; failure admission; creature pose, camera, light, HUD and host readback.

## Main finding

The controller's `pump(maximum)` and `takeReadyPatches(maximum)` contracts are per invocation. The product invokes both exactly once per RAF with fixed maxima. No elapsed-time budget, visibility state, cadence revision, backlog age or resume policy normalizes the behavior.

## Required parent domain

```txt
prehistoric-rush-stream-cadence-time-budget-authority-domain
```

Required kit families:

```txt
clock and frame observation
visibility admission
simulation-step policy
stream work time budget
generation and activation admission
backlog age and starvation policy
suspend/resume transaction
cadence result, commit, journal and observation
30/60/120, throttled-frame and hidden-tab fixtures
```

## Files added by this run

```txt
.agent/trackers/2026-07-11T19-09-25-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T19-09-25-04-00.md
.agent/architecture-audit/2026-07-11T19-09-25-04-00-stream-cadence-time-budget-dsk-map.md
.agent/render-audit/2026-07-11T19-09-25-04-00-refresh-rate-patch-visibility-gap.md
.agent/gameplay-audit/2026-07-11T19-09-25-04-00-player-speed-stream-throughput-loop.md
.agent/interaction-audit/2026-07-11T19-09-25-04-00-raf-visibility-cadence-result-map.md
.agent/stream-cadence-audit/2026-07-11T19-09-25-04-00-time-budget-suspension-backlog-contract.md
.agent/deploy-audit/2026-07-11T19-09-25-04-00-stream-cadence-fixture-gate.md
```

## Validation boundary

Documentation only. No runtime or deployment behavior changed. Rate limits were derived from source constants and call order, not measured in a browser.