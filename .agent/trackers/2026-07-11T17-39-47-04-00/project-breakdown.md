# Project Breakdown: PrehistoricRush World Readiness and Movement Admission

**Timestamp:** `2026-07-11T17-39-47-04-00`

## Summary

`PrehistoricRush` advances the run before it proves that the terrain, height source, render consumers and collision consumers required for the player's next movement are active. The simulation can therefore sample fallback height and move into a patch whose visible terrain, fixed colliders, pickups and grass/tree consumers have not committed yet.

## Plan ledger

**Goal:** define one authority from stream focus and required travel corridor through patch generation, multi-consumer activation, movement admission, physics, rendering and first-frame proof.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` state.
- [x] Detect active same-window documentation writes in `IntoTheMeadow`.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` as the oldest stable eligible fallback.
- [x] Read current source, retained audits and central tracking.
- [x] Trace the frame order across simulation, height sampling, streaming, physics, collision, rendering and HUD.
- [x] Identify the interaction loop, domains, kits and offered services.
- [x] Define required-corridor, readiness, movement-admission and frame-proof contracts.
- [x] Add timestamped architecture and system audits.
- [x] Change documentation only.
- [ ] Implement the authority and executable latency fixtures.

## Selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing repositories: 0
root-.agent-missing repositories: 0
nominal oldest central entry: IntoTheMeadow @ 2026-07-11T15-49-49-04-00
same-window IntoTheMeadow activity: WebGL recovery documentation commits
selected stable fallback: PrehistoricRush @ 2026-07-11T15-59-12-04-00
other Publish repositories changed: none
```

## Interaction loop

```txt
page boot
  -> load pinned Nexus Engine, NexusEngine-Kits, ProtoKits, Three and Rapier
  -> create game, route, patch generator, Worker, controller, physics and renderer
  -> generate only the center patch synchronously
  -> queue surrounding desired patches
  -> begin RAF

RAF
  -> sample wall-clock delta
  -> project browser input
  -> engine.tick(dt)
     -> update yaw, speed and jump
     -> move x/z
     -> sample y from active patch or fallbackHeight
     -> update distance and terminal state
  -> updateStreaming(already-moved state)
     -> set focus
     -> update desired membership
     -> release delivered patches
     -> pump generation
     -> activate at most one ready patch
  -> set Rapier actor transform
  -> step physics and inspect contacts
  -> inspect fallback descriptor overlap
  -> collect projected pickups
  -> update camera, scene and renderer
  -> update HUD
  -> request next frame
```

## Main finding

The simulation moves before streaming readiness is evaluated. `sampleHeight()` silently substitutes `fallbackHeight()` when the required patch is absent. Patch activation later installs the authoritative terrain heights, fixed colliders, pickups and render consumers.

```txt
movement accepted
  -> fallback height may be consumed
  -> missing patch colliders cannot produce Rapier contacts
  -> missing pickups cannot be collected
  -> missing terrain is not visible
  -> patch arrives later
  -> terrain/collision/pickup authority changes under the running actor
```

No result proves that the current position and route-ahead corridor are backed by one committed patch-consumer revision.

## Domains in use

```txt
route/page/profile authority
pinned module graph and CDN identity
Nexus Engine composition and scene routing
run lifecycle, input, movement, score and outcomes
procedural creature body, skeleton, skinning and poses
deterministic route generation and surface classification
seeded patch generation and Worker execution
patch focus, desired membership, queue, cache and delivery
terrain, tree, grass, pickup, collider and height consumers
Rapier actor, fixed colliders, stepping and contacts
collision, pickup and terminal-outcome admission
camera smoothing and run-change reset
Three scene, resources, shadows and rendering
HUD, button and public diagnostics projection
world-readiness and movement admission: missing
committed frame and lifecycle authority: missing
validation and Pages deployment
```

## Complete kit inventory and services

### Nexus Engine core

```txt
core-input-kit          actions, bindings and input state
core-spatial-kit        transforms and spatial query contracts
core-scene-kit          scene registry, transitions and host descriptor
core-physics-kit        physics provider capability
core-motion-kit         motion capability
core-camera-kit         camera capability
core-animation-kit      animation capability
core-graphics-kit       graphics and frame capability
core-skybox-kit         sky descriptor
core-ui-kit             UI capability and projection
core-diagnostics-kit    diagnostics and readback
core-composition-kit    composition metadata and capability graph
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit
  recipe normalization, geometry, topology, skeleton, skinning,
  collision recommendation, content hash, poses and snapshots

instanced-render-batch-kit
  cell replacement/release, flush, overflow, bounds, stats and snapshots

seeded-world-patch-controller-kit
  patch identity, focus, desired membership, cache, queue, executor,
  ready/release delivery, budgets, eviction and snapshots

camera-smooth-follow-kit
  position/look/quaternion damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit
  run lifecycle, input, route, surface, score, outcomes, events,
  scene transitions, player creature and snapshots

player-character-schema-kit
  defaults, normalization, clamps, color validation and merge

player-character-profile-store-kit
  load, save, patch, reset, subscription, storage sync,
  BroadcastChannel sync and close

menu-page-kit
  menu shell, profile projection and route links

character-creator-page-kit
  draft editing, controls, preview, debounced save, reset and remote projection

game-page-entry-kit
  browser runtime loading

drunk-route-generator
  route samples, nearest query, progress, classification and snapshot

player-raptor-preset-kit
  creature recipe and capsule collision descriptor

prehistoric-patch-generator
  terrain, trees, grass, pickups, colliders, bounds and transferables

prehistoric-patch-worker
  initialization, generation, success/error protocol and transferable delivery
```

### External and host boundaries

```txt
rapier-physics-domain-kit
  Rapier world bridge, kinematic actor, fixed colliders, transforms,
  step, contacts, snapshot and reset

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
  contact/overlap to terminal failure

creature/camera/render host adapters
  creature binding, pose, camera, light, shadows, HUD and host readback
```

## Required parent domain

```txt
prehistoric-rush-world-readiness-movement-authority-domain
```

Candidate kits:

```txt
required-travel-corridor-kit
patch-readiness-revision-kit
height-source-readiness-kit
collision-source-readiness-kit
render-source-readiness-kit
pickup-source-readiness-kit
world-readiness-plan-kit
world-readiness-result-kit
movement-admission-kit
movement-defer-policy-kit
movement-speed-cap-policy-kit
world-readiness-commit-kit
world-readiness-journal-kit
world-readiness-observation-kit
stream-latency-fixture-kit
world-readiness-frame-parity-fixture-kit
```

## Required flow

```txt
input and current run/frame identity
  -> predict bounded travel corridor
  -> resolve required patch IDs
  -> prove generated patch identity and consumer readiness
  -> prove authoritative height and collision sources
  -> classify ready, degraded, deferred or failed
  -> admit, cap or defer movement
  -> simulate against the admitted world revision
  -> step physics against matching collider revision
  -> render matching terrain and object revision
  -> commit one frame carrying readiness evidence
```

## Acceptance conditions

```txt
movement never consumes fallback height without an explicit degraded result
required route-ahead patches have committed terrain and collision consumers
Rapier and fallback collision cite the same readiness revision
pickup availability matches the admitted patch revision
late Worker results cannot retroactively change an already committed frame
stream lag produces bounded slowdown/defer behavior rather than world snapping
HUD and host expose readiness state without raw-owner sampling
```

## Validation boundary

```txt
runtime source changed: no
dependencies changed: no
rendering changed: no
physics changed: no
deployment changed: no
branch created: no
pull request created: no
Node fixtures: not run
browser smoke: not run
Pages smoke: not run
world-readiness fixtures: absent
```
