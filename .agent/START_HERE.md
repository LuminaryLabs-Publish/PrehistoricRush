# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T14-31-27-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with saved player profiles, a deterministic route, streamed procedural patches, a procedural skinned raptor, Rapier collision, Three.js presentation and GitHub Pages deployment.

The current audit identifies a committed-frame observation gap. The RAF callback mutates simulation, streaming, physics, gameplay, camera and render state sequentially, but no frame identity or immutable frame receipt proves that the visible canvas, HUD and `PrehistoricRushHost` describe the same state. A render or HUD failure can leave mutable runtime state ahead of the last fully presented frame.

## Plan ledger

**Goal:** preserve route/profile, patch and collision authority work while adding one frame-coherent observation boundary across existing runtime owners.

- [x] Compare the full accessible Publish organization against the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` under the oldest-central-ledger fallback.
- [x] Reconcile the newer repo-local fixed-collider audit.
- [x] Trace the complete RAF and public-host path.
- [x] Identify all domains, kits and services.
- [x] Add a timestamped frame-authority audit set.
- [x] Refresh the required root `.agent` documents.
- [ ] Implement the frame record and adapters after prerequisite authority work.
- [ ] Add browser and Node frame-coherence fixtures.

## Selection result

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

`PrehistoricRush` remained the oldest central-ledger entry. Its repo-local collider audit had already advanced beyond that central record, so this pass preserved the collider findings and added the next bounded audit.

## Current interaction loop

```txt
page boot
  -> load pinned Nexus Engine, NexusEngine-Kits, ProtoKits, Three and Rapier
  -> create game domain, Rapier adapter, patch generator and controllers
  -> create Three scene/resources and active-content adapter
  -> start run, prime streaming and reset camera
  -> attach browser callbacks, publish host and request RAF

RAF
  -> sample and clamp wall-clock delta
  -> project held input
  -> engine.tick mutates run state
  -> update streaming and patch consumers
  -> submit actor transform and step Rapier
  -> admit collision failure and pickup collection
  -> mutate creature, camera, lighting, grass and shard presentation
  -> render Three scene
  -> update HUD and button
  -> request next RAF

public readback
  -> independently sample game, streaming, camera, composition and scene
```

## Current frame gap

```txt
runtimeSessionId: absent
runSessionId: only product runId, not a host/session identity
frameId: absent
simulation receipt: absent
stream-consumption receipt: absent
collider-membership receipt: absent
physics-step receipt: absent
gameplay mutation receipts: absent
presentation fingerprint: absent
camera-consumption receipt: absent
render result: absent
HUD commit result: absent
committed-frame record: absent
frame-failure result: absent
host frame correlation: absent
```

The runtime mutates state before `renderer.render()` and HUD projection. If either fails, the public host can expose newer mutable state while the canvas or HUD remains on an older frame.

## Domains in use

```txt
multi-page route hosting and profile persistence
pinned module loading and dependency identity
Nexus Engine core composition and scene routing
product run state, input, movement, score and outcomes
procedural creature descriptor, skeleton, skinning and pose
deterministic route and terrain classification
seeded patch generation, Worker execution, cache and delivery
terrain, tree, grass, pickup, collider and height consumers
patch activation, release and collider membership
Rapier actor, fixed collider, step and contact state
collision, pickup and terminal outcome admission
browser input, wall-clock delta and RAF scheduling
camera target derivation and smooth-follow state
Three scene, resources, shadows and rendering
HUD, button and public diagnostics projection
validation and GitHub Pages deployment
```

## Kits and services

### Nexus Engine core

```txt
core-input-kit          actions, bindings and input state
core-spatial-kit        transforms and spatial query contracts
core-scene-kit          scene registry and transitions
core-physics-kit        physics provider contract
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
  normalized creature recipe, geometry, topology, skeleton, skinning,
  collision recommendation, bounds, poses, content hash and snapshots

instanced-render-batch-kit
  cell replacement/release, flush, overflow, bounds, stats and snapshots

seeded-world-patch-controller-kit
  patch identity, focus, desired membership, cache, queue, executor,
  ready/release delivery, budgets, eviction and snapshots

camera-smooth-follow-kit
  position/look/quaternion damping, reset, teleport handling,
  delta clamping, transform access and snapshots
```

### Product, page, external and host kits

```txt
prehistoric-rush-domain-kit
  run lifecycle, input, route, surface, score, outcomes, events,
  scene transitions, creature access and snapshots

player-character-schema-kit
  defaults, normalization, clamps, color validation and merge

player-character-profile-store-kit
  load, save, patch, reset, subscribe, storage/BroadcastChannel sync and close

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
  initialization, generation, error protocol and transferable delivery

rapier-physics-domain-kit
  Rapier world, kinematic actor, fixed colliders, transforms, step,
  contacts, snapshot and reset

Three.js and product adapters
  scene graph, instancing, skinning, camera, lighting, fog, shadows,
  active-content projection, rendering, HUD and host readback
```

## Current authority boundary

```txt
PrehistoricRush Committed Frame Observation Domain
  runtime-frame-id-kit
  frame-input-snapshot-kit
  simulation-step-receipt-kit
  stream-consumption-receipt-kit
  collider-membership-receipt-kit
  physics-step-receipt-kit
  gameplay-mutation-receipt-kit
  presentation-state-kit
  camera-consumption-receipt-kit
  render-submit-result-kit
  hud-commit-result-kit
  committed-frame-record-kit
  frame-failure-result-kit
  frame-journal-kit
  host-frame-read-model-kit
  committed-frame-coherence-fixture-kit
```

## Required frame sequence

```txt
allocate frame identity
  -> snapshot admitted input
  -> tick simulation and record receipt
  -> update streaming and record membership receipts
  -> step physics and record receipt
  -> resolve collision, pickup and terminal results
  -> derive immutable presentation state
  -> update camera under the same frame identity
  -> render and return typed result
  -> update HUD and return typed result
  -> publish one immutable committed-frame record
  -> expose that record through detached host diagnostics
```

## Priority order

```txt
P0   Multi-Page Route Admission + Player Profile Handoff Authority
P1   Seeded Patch Activation/Release Commit Authority
P1a  Fixed Collider Retirement + Collision Admission Authority
P2   Committed Frame Observation + Host Read Model Authority
P3   Run/Session/Stream/Collider Epoch Authority
P4   Browser Runtime Lifecycle + Ordered Resource Disposal
```

## Latest audit routes

```txt
tracker:
  .agent/trackers/2026-07-11T14-31-27-04-00/project-breakdown.md

turn ledger:
  .agent/turn-ledger/2026-07-11T14-31-27-04-00.md

architecture:
  .agent/architecture-audit/2026-07-11T14-31-27-04-00-committed-frame-observation-dsk-map.md

render:
  .agent/render-audit/2026-07-11T14-31-27-04-00-state-render-hud-host-coherence-gap.md

gameplay:
  .agent/gameplay-audit/2026-07-11T14-31-27-04-00-frame-stage-mutation-loop.md

interaction:
  .agent/interaction-audit/2026-07-11T14-31-27-04-00-raf-host-observation-map.md

frame authority:
  .agent/frame-authority-audit/2026-07-11T14-31-27-04-00-committed-frame-record-contract.md

deploy:
  .agent/deploy-audit/2026-07-11T14-31-27-04-00-committed-frame-fixture-gate.md
```

## Validation boundary

```txt
runtime source changed: no
package scripts changed: no
dependencies changed: no
render output changed: no
deployment changed: no
branch created: no
pull request created: no
frame fixtures: unavailable
browser smoke: not run
Pages smoke: not run
```

Do not treat `PrehistoricRushHost.getState()` as frame-coherent proof until it returns a detached committed-frame record with correlated simulation, stream, physics, render and HUD receipts.