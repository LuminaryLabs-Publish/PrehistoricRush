# Current Audit: PrehistoricRush Stream Cadence and Time Budget

**Updated:** `2026-07-11T19-09-25-04-00`

## Summary

`PrehistoricRush` advances movement from elapsed seconds but advances streaming work from frame counts. Each RAF calls `controller.pump()` with a fixed maximum and calls `takeReadyPatches()` with a fixed activation maximum. The same route speed therefore receives different generation and activation throughput at different display refresh rates.

The source also clamps simulation delta to `0.05` seconds. Below 20 rendered frames per second, gameplay time slows relative to wall time while stream pump and activation still run once per rendered frame. Hidden-tab and throttled-frame behavior has no explicit suspension, catch-up or backlog-age contract.

## Plan ledger

**Goal:** define one clock, visibility and time-budget authority for simulation, patch generation, activation, physics, rendering and observation.

- [x] Compare Publish inventory against central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Detect current documentation writes in nominal-oldest `IntoTheMeadow` and recent `AetherVale` work.
- [x] Select only `PrehistoricRush` as the oldest stable fallback.
- [x] Trace RAF delta, engine tick, stream pump, activation, Worker completion, physics and render order.
- [x] Identify the interaction loop, domains, complete kit inventory and services.
- [x] Define time-budget, suspension, backlog, cadence-result and parity-fixture contracts.
- [x] Add required root `.agent` outputs.
- [ ] Implement and validate the authority.

## Repository selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing repositories: 0
root-.agent-missing repositories: 0
IntoTheMeadow: same-window fatal-runtime recovery documentation
AetherVale: recent safe-entry progression documentation
selected stable repository: PrehistoricRush
excluded repository: TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is changed in the Publish organization.

## Complete interaction loop

```txt
module boot
  -> load pinned Nexus Engine, Kits, ProtoKits, Three and Rapier
  -> create engine, run domain, route and creature body
  -> create Rapier runtime and actor
  -> create patch generator, Worker executor and controller
  -> create active-content and Three adapters
  -> generate center patch synchronously
  -> queue surrounding desired patches
  -> install listeners, host and RAF

RAF
  -> sample wall-clock delta
  -> clamp dt to 0.05 seconds
  -> project browser booleans into game input
  -> engine.tick(dt)
  -> updateStreaming(state)
     -> update focus and desired membership
     -> release delivered patch IDs
     -> start up to 2 Worker requests or 1 fallback request
     -> activate at most 1 ready patch
  -> set actor transform and step Rapier with dt
  -> inspect collision and pickups
  -> update camera and animation
  -> render Three scene and HUD
  -> request next RAF
```

## Concrete cadence defect

```txt
refresh rate   activation budget/second   Worker-start budget/second   fallback-start budget/second
30 Hz          30                         60                           30
60 Hz          60                         120                          60
120 Hz         120                        240                          120
```

These are maximum admission rates before Worker latency and queue availability are considered. Player movement remains expressed in meters per second. The stream-work-to-distance ratio is therefore refresh-rate dependent.

At less than 20 Hz, `dt` remains capped at `0.05`. Simulation advances at less than real time, but generation and activation continue once per rendered frame. On a hidden or heavily throttled tab, asynchronous Worker results can accumulate in controller state while activation remains limited to one patch on each later RAF.

## Missing identities and results

```txt
runtimeClockRevision
visibilityRevision
cadenceRevision
frameSampleId
simulationStepResult
streamWorkBudget
streamWorkSpent
activationTimeBudget
backlogOldestAge
suspensionResult
resumePlan
cadenceAdmissionResult
streamCadenceCommitResult
firstVisibleCadenceFrameReceipt
cadence journal
```

## Domains in use

```txt
route/page/profile authority
module graph identity and pinned CDN loading
Nexus Engine kit composition
run simulation and scene transitions
runtime clock, RAF and browser visibility
route, surface and terrain height
procedural creature body and animation
seeded patch generation and Worker execution
patch scheduling, cache, membership and frame-count budgets
terrain, tree, grass, pickup, collider and height projection
Rapier actor, fixed-collider and variable-step contact runtime
collision and terminal-outcome admission
camera reset and smooth follow
Three scene/resources/rendering
HUD, buttons and public diagnostics
stream cadence and time-budget authority: missing
world-readiness, committed-frame and reset-epoch authority: missing
runtime lifecycle and disposal: missing
fixtures and Pages deployment
```

## Complete kit inventory and services

### Nexus Engine core

```txt
core-input-kit
  actions, bindings and input state
core-spatial-kit
  transforms and spatial query contract
core-scene-kit
  scene registry, transitions and host descriptor
core-physics-kit
  physics-provider capability
core-motion-kit
  motion capability
core-camera-kit
  camera capability
core-animation-kit
  animation capability
core-graphics-kit
  graphics and frame capability
core-skybox-kit
  sky descriptor
core-ui-kit
  UI capability and projection
core-diagnostics-kit
  diagnostics and readback
core-composition-kit
  composition metadata and capability graph
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams
procedural-creature-body-kit
  recipe normalization, geometry, topology, skeleton, skinning,
  collision recommendation, content hash, poses and snapshots
instanced-render-batch-kit
  cell replace/release, flush, overflow, bounds, statistics and snapshots
seeded-world-patch-controller-kit
  patch identity, focus, desired membership, cache, queue, executor,
  ready/release delivery, per-call budgets, eviction, reset and snapshots
camera-smooth-follow-kit
  position/look/quaternion damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit
  run lifecycle, input, route, surface, score, outcomes, events,
  scene transitions, player creature and snapshot
player-character-schema-kit
  defaults, normalization, clamps, color validation and merge
player-character-profile-store-kit
  load, save, patch, reset, subscription, storage sync,
  BroadcastChannel sync and close
menu-page-kit
  menu shell, profile projection and route links
character-creator-page-kit
  draft editing, controls, preview, debounce save, reset and remote projection
game-page-entry-kit
  3D runtime loading
drunk-route-generator
  samples, nearest query, progress, region classification and snapshot
player-raptor-preset-kit
  creature recipe and capsule collision descriptor
prehistoric-patch-generator
  terrain, trees, grass, pickups, colliders, bounds and transferables
prehistoric-patch-worker
  initialization, generation, error protocol and transferable delivery
```

### External and host adapter boundaries

```txt
rapier-physics-domain-kit
  Rapier world bridge, kinematic actor, fixed colliders, transforms,
  variable timestep, contacts, snapshot and reset
Three runtime module
  scene graph, geometry, materials, instancing, skinning, camera,
  lighting, fog, shadows and rendering
Rapier runtime module
  rigid bodies, colliders, queries and world stepping
message Worker executor adapter
  request correlation and asynchronous generation
active-content consumer adapter
  patch render membership, pickup/collider projection and height sampling
collision fallback adapter
  descriptor XZ overlap and jump-height gate
run failure adapter
  contact/overlap to terminal game failure
creature/camera/render host adapters
  creature binding, pose, camera, light, shadows, HUD and host readback
```

## Required authority domain

```txt
prehistoric-rush-stream-cadence-time-budget-authority-domain
  -> runtime-clock-state-kit
  -> frame-sample-kit
  -> browser-visibility-state-kit
  -> cadence-revision-kit
  -> simulation-step-policy-kit
  -> stream-work-time-budget-kit
  -> generation-start-budget-kit
  -> activation-time-budget-kit
  -> stream-backlog-age-kit
  -> stream-starvation-policy-kit
  -> suspension-admission-kit
  -> resume-catchup-plan-kit
  -> cadence-admission-result-kit
  -> stream-cadence-commit-kit
  -> cadence-observation-kit
  -> cadence-journal-kit
  -> cadence-parity-fixture-kit
  -> throttled-frame-fixture-kit
  -> hidden-tab-resume-fixture-kit
```

## Required transaction

```txt
wall-clock and visibility observation
  -> normalize frame sample
  -> classify active, throttled, hidden or resumed state
  -> derive bounded simulation-step policy
  -> derive elapsed-time stream-work budget
  -> admit generation starts by remaining budget and backlog age
  -> admit ready activation by remaining budget and fairness policy
  -> advance simulation and physics against the admitted clock revision
  -> render world carrying cadence and world revisions
  -> publish first-visible-frame cadence receipt
```

## Acceptance conditions

```txt
30, 60 and 120 Hz fixtures produce equivalent route progress and patch readiness over equal wall time
stream starts and activation are bounded by elapsed time, not raw RAF count
low-refresh clients receive a declared degradation policy instead of silent throughput loss
hidden tabs do not accumulate unbounded stale work
resume uses a bounded catch-up plan and rejects obsolete results
simulation, Rapier, camera and render cite the same clock/cadence revision
HUD and host expose actual backlog age, budget spent and cadence state
```

## Priority placement

```txt
P0   route artifact and profile handoff
P1   patch activation/release transaction
P1a  exact collider retirement and collision admission
P1b  stream cadence and time-budget authority
P1c  world readiness and movement admission
P2   committed-frame observation and host read model
P3   run/stream/collider/worker/frame epoch reset authority
P4   startup rollback, resource ownership and disposal
```

No runtime source was changed by this audit.