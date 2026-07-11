# Project Breakdown: PrehistoricRush Committed Frame Observation Authority

**Timestamp:** `2026-07-11T14-31-27-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` advances simulation, patch streaming, physics, gameplay outcomes, camera, Three rendering, HUD projection and public host state inside one RAF callback, but it does not create a frame identity or publish one committed frame record. State can advance before rendering succeeds, and `PrehistoricRushHost.getState()` independently samples game, streaming, camera and composition owners without proving that they describe the same rendered frame.

The next bounded architecture ledge is a committed-frame observation authority. It should not replace the existing route/profile, patch activation, collider retirement or lifecycle owners. It should correlate their accepted results into one immutable frame receipt and expose only the last fully committed frame to diagnostics.

## Plan ledger

**Goal:** make every observable browser frame identify the exact input, simulation, streaming, physics, gameplay, camera, render and HUD results it consumed.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories remain centrally tracked and have root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` under the oldest-central-ledger fallback.
- [x] Reconcile the newer repo-local collider audit that had not yet reached the central ledger.
- [x] Trace the complete RAF interaction loop in `src/game.js`.
- [x] Trace product simulation and snapshot services in `prehistoric-rush-domain-kit.js`.
- [x] Identify every domain, kit and offered service.
- [x] Define the committed-frame DSK/domain boundary.
- [x] Add architecture, render, gameplay, interaction, frame-authority and deploy audits.
- [ ] Implement frame IDs, staged presentation state and immutable frame receipts.
- [ ] Add browser and Node frame-coherence fixtures.

## Selection result

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9

central-ledger order at selection:
  PrehistoricRush       2026-07-11T12-39-53-04-00
  MyCozyIsland          2026-07-11T12-58-06-04-00
  TheOpenAbove          2026-07-11T13-10-35-04-00
  HorrorCorridor        2026-07-11T13-20-45-04-00
  PhantomCommand        2026-07-11T13-28-37-04-00
  ZombieOrchard         2026-07-11T13-41-23-04-00
  TheUnmappedHouse      2026-07-11T13-49-30-04-00
  AetherVale            2026-07-11T14-00-01-04-00
  IntoTheMeadow         2026-07-11T14-08-51-04-00

selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is changed in the Publish organization during this pass.

## Current interaction loop

```txt
page boot
  -> load pinned Nexus Engine, NexusEngine-Kits, ProtoKits, Three and Rapier
  -> create engine, product domain, Rapier adapter and actor
  -> create patch generator, Worker/executor, patch controller and camera follow
  -> create Three scene, resources and active-content adapter
  -> start run, prime streaming and reset camera
  -> attach button and global browser callbacks
  -> publish PrehistoricRushHost
  -> request first RAF

RAF frame
  -> sample wall-clock delta and clamp to 0.05
  -> project held browser input into game input
  -> engine.tick(dt) mutates run state
  -> updateStreaming mutates controller and active patch consumers
  -> submit actor transform and physics.step(dt)
  -> admit collision failure and pickup collection
  -> derive final game state for this callback
  -> mutate creature pose, camera, sun, grass and shard presentation state
  -> renderer.render(scene, camera)
  -> write HUD HTML and button text
  -> request next RAF

public readback
  -> game.snapshot()
  -> controller.getSnapshot()
  -> cameraFollow.getSnapshot()
  -> composition and scene descriptors
  -> static renderer label
```

## Main source findings

```txt
frame ID: absent
simulation tick ID: absent
stream-consumption revision: absent from frame evidence
physics-step receipt: absent
collision/pickup result receipt: absent
camera-consumption revision: absent
render result: renderer.render returns no product receipt
HUD commit result: absent
last fully committed frame record: absent
frame failure result: absent
host readback correlation: absent
```

The RAF mutates game, stream, physics and gameplay state before calling `renderer.render()`. A render exception can therefore leave authoritative state ahead of the last visible canvas. The host remains published and can expose the newer state even though no matching frame was presented.

`PrehistoricRushHost.getState()` also samples multiple mutable owners at call time. A caller can observe a game snapshot, patch snapshot and camera snapshot from different moments in the frame pipeline. It cannot determine which state was consumed by the current canvas or HUD.

## Domains in use

```txt
multi-page route hosting and profile persistence
pinned module loading and dependency identity
Nexus Engine composition and scene routing
run state, input, movement, surface, score and outcomes
procedural creature descriptor, skeleton, skinning and poses
deterministic route and terrain classification
seeded patch generation, Worker execution, cache and delivery
terrain, tree, grass, pickup, collider and height consumers
patch activation, release and collider membership
Rapier actor, fixed collider, step and contact state
collision admission, pickup admission and terminal outcomes
browser input, wall-clock delta and RAF scheduling
camera target derivation and smooth-follow state
Three scene, resources, shadows and rendering
HUD, button and public diagnostics projection
validation and GitHub Pages deployment
```

## Complete kit and service inventory

### Nexus Engine core

```txt
core-input-kit          actions, bindings and input state
core-spatial-kit        transforms and spatial query contracts
core-scene-kit          scene registry, transitions and host descriptor
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
  recipe normalization, geometry, topology, skeleton, skinning,
  collision recommendation, bounds, poses, content hash and snapshots

instanced-render-batch-kit
  capacity, cell replacement/release, flush, overflow, bounds,
  statistics and snapshots

seeded-world-patch-controller-kit
  patch identity, focus, desired membership, cache, queue, executor,
  ready/release delivery, work budgets, eviction and snapshots

camera-smooth-follow-kit
  damped position/look/quaternion, reset, teleport handling,
  delta clamping, transform access and snapshots
```

### Product, page, external and host kits

```txt
prehistoric-rush-domain-kit
  run lifecycle, input, route, surface, score, outcomes, events,
  scene transitions, creature access and snapshot

player-character-schema-kit
  defaults, normalization, clamps, color validation and merge

player-character-profile-store-kit
  load, save, patch, reset, subscribe, storage synchronization,
  BroadcastChannel synchronization and close

menu-page-kit
  menu shell, profile projection and route links

character-creator-page-kit
  draft editing, controls, preview, debounced save, reset and remote projection

game-page-entry-kit
  browser runtime loading

drunk-route-generator
  route samples, nearest query, progress, classification and snapshot

player-raptor-preset-kit
  procedural creature recipe and capsule collision descriptor

prehistoric-patch-generator
  terrain, trees, grass, pickups, colliders, bounds and transferables

prehistoric-patch-worker
  initialization, generation, error protocol and transferable delivery

rapier-physics-domain-kit
  Rapier world, kinematic actor, fixed colliders, transforms,
  stepping, contacts, snapshot and reset

Three.js runtime and product adapters
  scene graph, geometry, materials, instancing, skinning, camera,
  lighting, fog, shadows, active-content projection, render and HUD

PrehistoricRushHost adapter
  game, streaming, camera, composition, scene and content readback
```

## Required authority boundary

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

## Required frame transaction

```txt
beginFrame(runtimeSessionId, runSessionId, nextFrameId)
  -> snapshot admitted input
  -> tick simulation and record simulation receipt
  -> consume patch activation/release and record membership revisions
  -> step physics and record actor/contact receipt
  -> apply collision, pickup and outcome results
  -> derive immutable presentation state
  -> update camera under the same frame ID
  -> render world and obtain render result
  -> commit HUD/button projection
  -> atomically publish committed frame record
  -> expose only committed record through host diagnostics
```

If rendering or HUD projection fails, the current committed frame must remain unchanged and a typed frame-failure result must identify the failed stage. Full rollback of already-mutated simulation is a later transaction concern, but diagnostics must never label an unpresented state as committed.

## Priority placement

```txt
P0   Multi-Page Route Admission + Player Profile Handoff Authority
P1   Seeded Patch Activation/Release Commit Authority
P1a  Fixed Collider Retirement + Collision Admission Authority
P2   Committed Frame Observation + Host Read Model Authority
P3   Run/Session/Stream/Collider Epoch Authority
P4   Browser Runtime Lifecycle + Ordered Resource Disposal
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
browser frame-coherence fixture: unavailable
render-failure fixture: unavailable
host read-model fixture: unavailable
Pages smoke: not run
```

No committed-frame correctness claim is made. This pass documents the source path and the executable proof required before `PrehistoricRushHost` can be treated as frame-coherent diagnostics.