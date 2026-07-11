# Current Audit: PrehistoricRush World Readiness and Movement Admission

**Updated:** `2026-07-11T17-39-47-04-00`

## Summary

`PrehistoricRush` advances gameplay before it proves that the route-ahead world required by that movement is generated and committed across all consumers. `engine.tick(dt)` mutates position, distance and height first. `updateStreaming(state)` then follows the already-moved actor, pumps generation and activates at most one ready patch.

When an active patch is missing, `sampleHeight()` silently returns `fallbackHeight()`. The missing patch also means its fixed colliders, pickups, terrain, trees and grass are not authoritative yet. A later activation can therefore change visible terrain, camera look height, collision and pickup availability underneath an already-running actor.

## Plan ledger

**Goal:** define one bounded required-corridor and movement-admission transaction tied to a committed world revision.

- [x] Compare Publish inventory against central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Detect active same-window `IntoTheMeadow` work.
- [x] Select only `PrehistoricRush` as the oldest stable fallback.
- [x] Trace simulation, height, streaming, physics, collision and render order.
- [x] Identify the interaction loop, domains, complete kit inventory and services.
- [x] Define required-corridor, readiness, policy, commit and observation contracts.
- [x] Add required root `.agent` outputs.
- [ ] Implement and validate the authority.

## Repository selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing repositories: 0
root-.agent-missing repositories: 0
IntoTheMeadow: active same-window WebGL recovery documentation
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
  -> sample/clamp wall-clock delta
  -> project browser booleans into game input
  -> engine.tick(dt)
     -> update yaw, speed, jump and surface multiplier
     -> move x/z and increase distance
     -> sample y from active patch or fallbackHeight
     -> evaluate win
  -> updateStreaming(already-moved state)
     -> set focus from new position
     -> update desired/retain/prefetch membership
     -> release delivered patch IDs
     -> optionally generate center synchronously
     -> pump Worker or fallback generation
     -> activate at most one ready patch
  -> set actor transform and step Rapier
  -> inspect Rapier contacts and descriptor fallback overlap
  -> collect projected pickup
  -> update creature pose, camera, lights and animation uniforms
  -> render Three scene
  -> update HUD and action button
  -> request next RAF
```

## Concrete readiness gap

```txt
actor moves into patch P
  -> P is not in activePatches
  -> sampleHeight uses fallbackHeight
  -> P terrain is not visible
  -> P fixed colliders are absent from Rapier
  -> P pickups are absent from view.pickups
  -> P grass/trees are absent from render batches

later Worker result for P
  -> P activates
  -> generated terrain replaces fallback height authority
  -> colliders and pickups become live
  -> visible terrain and camera target can change
```

No typed result marks this as an admitted degraded mode, deferred movement or failed readiness transition.

## Missing identities and results

```txt
requiredCorridorId
requiredCorridorFingerprint
patchReadinessRevision
heightSourceRevision
collisionSourceRevision
pickupConsumerRevision
renderConsumerRevision
WorldReadinessPlan
WorldReadinessResult
MovementAdmissionResult
readiness-frontier distance
movement cap/defer policy
world-readiness journal
world/frame parity acknowledgement
```

## Domains in use

```txt
route/page/profile authority
module graph identity and pinned CDN loading
Nexus Engine kit composition
run simulation and scene transitions
route, surface and terrain height
procedural creature body and animation
seeded patch generation and Worker execution
patch scheduling, cache and membership
terrain, tree, grass, pickup, collider and height projection
Rapier actor, fixed-collider and contact runtime
collision and terminal-outcome admission
camera reset and smooth follow
Three scene/resources/rendering
HUD, buttons and public diagnostics
world-readiness and movement admission: missing
committed-frame and host authority: missing
run/stream/collider/frame epoch authority: missing
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
  ready/release delivery, budgets, eviction and snapshots

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
  contact/overlap to terminal game failure

creature/camera/render host adapters
  creature binding, pose, camera, light, shadows, HUD and host readback
```

## Required authority domain

```txt
prehistoric-rush-world-readiness-movement-authority-domain
  -> required-travel-corridor-kit
  -> patch-readiness-revision-kit
  -> height-source-readiness-kit
  -> collision-source-readiness-kit
  -> render-source-readiness-kit
  -> pickup-source-readiness-kit
  -> world-readiness-plan-kit
  -> world-readiness-result-kit
  -> movement-admission-kit
  -> movement-defer-policy-kit
  -> movement-speed-cap-policy-kit
  -> world-readiness-commit-kit
  -> world-readiness-journal-kit
  -> world-readiness-observation-kit
  -> stream-latency-fixture-kit
  -> world-readiness-frame-parity-fixture-kit
```

## Required transaction

```txt
frame/input identity
  -> predict bounded movement corridor
  -> resolve required patch IDs
  -> request/prepare missing patches through existing controller authority
  -> collect height, terrain, collider, pickup and render receipts
  -> classify readiness
  -> admit full movement, cap speed, defer movement or fail
  -> apply simulation against accepted world revision
  -> step physics against matching collider revision
  -> render matching terrain/object revision
  -> commit frame carrying readiness evidence
```

## Acceptance conditions

```txt
movement never silently consumes fallback height
required corridor terrain and collision are committed before entry
pickup availability matches admitted patch revision
late Worker delivery cannot retroactively redefine a committed frame
stream lag creates deterministic cap/defer behavior
Rapier, fallback collision, terrain, camera, HUD and host cite one world revision
```

## Priority placement

```txt
P0   route artifact and profile handoff
P1   patch activation/release transaction
P1a  exact collider retirement and collision admission
P1b  world readiness and movement admission
P2   committed-frame observation and host read model
P3   run/stream/collider/worker/frame epoch reset authority
P4   startup rollback, resource ownership and disposal
```

No runtime source was changed by this audit.
