# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T14-20-32-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with a saved character-profile layer, a deterministic route, streamed procedural world patches, a procedural skinned raptor, Rapier collision, Three.js rendering and GitHub Pages deployment.

This audit identifies a fixed-collider retirement failure below the existing patch-activation boundary. The browser removes released patch colliders from its active visual/read model and submits only the current collider list to `rapier-physics-domain-kit`, but the pinned ProtoKit never removes fixed rigid bodies or collider instances that disappeared from the replacement list. Contact collection continues iterating those retained Rapier colliders, so an invisible tree from a released patch can still end a later run.

## Plan ledger

**Goal:** preserve route/profile work as P0 while making patch collider membership, retirement, contact provenance and run failure one acknowledged transaction shared by streaming, Rapier, gameplay, rendering and diagnostics.

- [x] Compare the full accessible `LuminaryLabs-Publish` repository list with central ledgers.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories remain centrally tracked with root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible documented repository.
- [x] Trace patch generation, activation, release, collider rebuilding, Rapier replacement and contact collection.
- [x] Trace product-side collision admission and run-failure mutation.
- [x] Identify all domains, kits and offered services.
- [x] Add timestamped architecture, render, gameplay, interaction, collision-authority and deploy audits.
- [x] Refresh required root `.agent` documents.
- [ ] Implement collider retirement and executable parity fixtures after route/profile authority.
- [ ] Upstream the minimal removal/reset contract to the pinned Rapier ProtoKit rather than adding a second physics owner.

## Selection result

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9

oldest eligible central entry:
  PrehistoricRush       2026-07-11T12-39-53-04-00

next entries:
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
  -> create game domain, actor, patch generator, Worker/executor and patch controller
  -> generate/receive patch
  -> adapter activates terrain, tree batches, grass, pickups and colliders
  -> rebuildActiveContent creates the current visual/read collider list
  -> physics.setFixedColliders(current list)
  -> RAF advances engine, streaming and Rapier
  -> Rapier collects actor/fixed intersections
  -> product ORs Rapier contacts with a separate XZ overlap fallback
  -> any admitted hit calls game.fail(tree-impact)
  -> run-over scene and HUD render

patch release
  -> remove patch from activePatches
  -> hide terrain and release tree batch cells
  -> rebuild active grass, pickups and collider descriptors
  -> call physics.setFixedColliders(smaller current list)
  -> old Rapier fixed bodies/colliders are not removed
  -> old invisible collider can still produce a fatal contact
```

## Main source findings

```txt
patch generator collider:
  id, x, y, z, radius, shape:"ball", tags:["hazard","tree"]

browser active collider view:
  rebuilt only from activePatches

ProtoKit state collider map:
  replaced with the current submitted set

ProtoKit runtime fixed body/collider maps:
  append/update only
  removed IDs are not deleted
  removed Rapier bodies/colliders are not removed from the world

contact scan:
  iterates runtime.fixedColliders, not only state.colliders

product failure admission:
  any Rapier contact for actor "dino" is fatal
  OR any current-descriptor XZ overlap below jumpHeight 1.05 is fatal

contact provenance:
  no collider patch ID, activation revision, retirement revision,
  contact source, contact sequence, shape revision or failure receipt
```

The two collision paths can therefore disagree:

```txt
Rapier path:
  can report a released/invisible collider retained in runtime maps

fallback path:
  checks only current view.colliders

result:
  a run can fail with no active visual tree or current fallback collider
```

## Domains in use

```txt
multi-page route hosting and player-profile persistence
Nexus Engine composition and product run state
procedural creature generation, skinning, poses and collision recommendation
deterministic route and terrain classification
seeded patch generation, Worker execution, cache and activation
terrain, tree, grass, pickup, collider and height consumers
patch membership and collider projection
Rapier actor, fixed-body, collider, step and contact state
collision admission and terminal run failure
browser input, RAF, camera and presentation
Three scene, instances, materials, shadows and rendering
public host/readback, validation and Pages deployment
```

## Kits and services

### Nexus Engine core

```txt
core-input-kit          actions, bindings and input state
core-spatial-kit        transforms and spatial queries
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
  collision recommendation, content hash, poses and snapshots

instanced-render-batch-kit
  cell replacement/release, flush, overflow, bounds, stats and snapshots

seeded-world-patch-controller-kit
  patch identity, desired membership, cache, queue, executor,
  ready/release delivery, budgets, eviction and snapshots

camera-smooth-follow-kit
  damped position/look/quaternion, reset, teleport handling and snapshots
```

### Product, external and host kits

```txt
prehistoric-rush-domain-kit
  run lifecycle, input, route, surface, score, outcomes, events and snapshot

player-character schema/profile/menu/creator/game-page kits
  profile normalization, persistence, editing, projection and page routing

drunk-route-generator
  samples, nearest query, progress, region classification and snapshot

player-raptor-preset-kit
  creature recipe and capsule collision descriptor

prehistoric-patch-generator
  terrain, trees, grass, pickups, ball collider descriptors and bounds

prehistoric-patch-worker
  initialization, generation, errors and transferable delivery

rapier-physics-domain-kit
  Rapier world, kinematic actor, fixed colliders, transforms, step,
  contact collection, snapshot and reset

Three.js runtime and host adapters
  scene graph, instancing, skinning, camera, lights, shadows, render,
  active content projection, HUD and public readback
```

## Required authority boundary

```txt
PrehistoricRush Fixed Collider Membership and Collision Admission Domain
  patch-collider-identity-kit
  collider-membership-revision-kit
  fixed-collider-replacement-plan-kit
  fixed-collider-retirement-kit
  rapier-collider-removal-adapter-kit
  collider-retirement-result-kit
  collision-contact-observation-kit
  collision-contact-admission-kit
  collision-source-parity-kit
  run-failure-transaction-kit
  collision-journal-kit
  collision-render-correlation-kit
  stale-collider-fixture-kit
```

## Required transaction

```txt
prepare active collider membership
  -> diff previous and next collider IDs
  -> validate patch ownership and shape descriptors
  -> remove retired collider instances and fixed bodies from Rapier
  -> create/update retained and added colliders
  -> commit one colliderMembershipRevision
  -> step physics under that revision
  -> produce contact observations with collider and patch identity
  -> admit only current hazard contacts
  -> compare Rapier and fallback results or remove fallback authority
  -> commit one run-failure result
  -> correlate terminal frame and host observation
```

## Priority order

```txt
P0 Multi-Page Route Admission + Player Profile Handoff Authority
P1 Seeded Patch Activation Commit Authority
P1a Fixed Collider Retirement + Collision Admission Authority
P2 Visual Policy Graph Identity + Render-Frame Correlation
P3 Run Session Reset + Shared Epoch Authority
P4 Browser Runtime Session Lifecycle + Ordered Disposal
```

P1 and P1a must share the same patch activation/release revision. Do not solve stale colliders with an unrelated global collision list.

## Read this pass first

```txt
.agent/trackers/2026-07-11T14-20-32-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T14-20-32-04-00.md
.agent/architecture-audit/2026-07-11T14-20-32-04-00-fixed-collider-retirement-dsk-map.md
.agent/render-audit/2026-07-11T14-20-32-04-00-visual-collider-membership-parity-gap.md
.agent/gameplay-audit/2026-07-11T14-20-32-04-00-released-patch-invisible-tree-failure-loop.md
.agent/interaction-audit/2026-07-11T14-20-32-04-00-contact-to-run-failure-admission-map.md
.agent/collision-authority-audit/2026-07-11T14-20-32-04-00-fixed-collider-membership-retirement-contract.md
.agent/deploy-audit/2026-07-11T14-20-32-04-00-stale-collider-parity-fixture-gate.md
```

## Do not start next with

- a second browser collision authority beside Rapier
- clearing only `state.colliders` while leaving Rapier bodies in the world
- accepting every actor contact without current collider membership and hazard provenance
- visual polish before route/profile P0
- claiming patch release parity without an invisible-collider fixture
