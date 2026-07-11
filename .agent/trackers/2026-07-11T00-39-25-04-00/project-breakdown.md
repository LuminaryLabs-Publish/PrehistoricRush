# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T00-39-25-04-00`  
**Branch:** `main`

## Goal

Document the newly landed migration from the repo-local procedural dinosaur generator to the official pinned `procedural-creature-body-kit`, then define the proof boundary between product preset ownership, deterministic creature descriptors, Three.js rendering, Rapier collision, and public host observation.

## Selection result

The accessible `LuminaryLabs-Publish` inventory contains ten repositories:

```txt
AetherVale
HorrorCorridor
IntoTheMeadow
MyCozyIsland
PhantomCommand
PrehistoricRush
TheCavalryOfRome
TheOpenAbove
TheUnmappedHouse
ZombieOrchard
```

`TheCavalryOfRome` remained excluded. All nine eligible repositories were centrally tracked and had root `.agent` state. `PrehistoricRush` was selected before the oldest-documented fallback because six runtime commits newer than its `2026-07-10T23-08-11-04-00` audit replaced the local creature generator, added a product-owned raptor preset, pinned Nexus Engine/Kits/ProtoKits commits, and added a browser import map.

Only `LuminaryLabs-Publish/PrehistoricRush` was changed.

## Interaction loop

```txt
index.html import map
  -> pins bare nexusengine imports to NexusEngine e8252e5
  -> src/runtime.mjs
  -> src/game.js
  -> dynamically import pinned NexusEngine, seed kit, procedural creature kit, ProtoKit, Three and Rapier
  -> createPrehistoricRushKitGraph(NexusEngine, NexusEngineKits)
  -> install 12 core kits + seed-kit + procedural-creature-body-kit + prehistoric-rush-domain-kit
  -> procedural-creature-body-kit normalizes PLAYER_RAPTOR_PRESET
  -> generate body geometry, skeleton, skin weights, attachments, collision and content hash
  -> PrehistoricRush domain exposes getPlayerBody() and createPlayerPose()
  -> Three adapter converts the descriptor into BufferGeometry, Bone hierarchy, Skeleton and SkinnedMesh
  -> Rapier adapter registers a kinematic actor from the collision descriptor
  -> browser input mutates local input and forwards it to the run domain
  -> engine.tick advances run state
  -> adapter updates terrain, population and physics
  -> domain creates a pose descriptor
  -> Three adapter applies bone transforms and renders
  -> HUD and PrehistoricRushHost project aggregate state
  -> requestAnimationFrame repeats
```

## Domains in use

```txt
runtime module admission and import-map resolution
Nexus Engine core input
Nexus Engine core spatial
Nexus Engine core scene
Nexus Engine core physics
Nexus Engine core motion
Nexus Engine core camera
Nexus Engine core animation
Nexus Engine core graphics
Nexus Engine core skybox
Nexus Engine core UI
Nexus Engine core diagnostics
Nexus Engine core composition
seed and deterministic random-stream capability
procedural creature body recipe and descriptor generation
product-owned player raptor configuration
PrehistoricRush run lifecycle and simulation
route generation, nearest lookup and surface classification
browser DOM, input, resize, blur and RAF lifecycle
Three terrain, population, creature binding, camera, lighting and render submission
Rapier actor, fixed-collider, transform, step and contact projection
host observation and Pages delivery
```

## Active kits and services

### Nexus Engine core

```txt
core-input-kit         actions and bindings
core-spatial-kit       transform/query capability
core-scene-kit         menu/game/run-over/win registry and transitions
core-physics-kit       provider capability
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics/frame capability
core-skybox-kit        clear-day sky descriptor
core-ui-kit            UI projection capability
core-diagnostics-kit   diagnostic/readback capability
core-composition-kit   composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  -> deterministic seed/random-stream service

procedural-creature-body-kit 0.1.0
  -> body recipe normalization
  -> deterministic topology and geometry descriptors
  -> skeleton and skin-weight descriptors
  -> attachment descriptors
  -> collision recommendations
  -> pose descriptors
  -> content hashing
  -> snapshots, load, reset, create/get/list/remove
```

### Product and route

```txt
prehistoric-rush-domain-kit 0.3.0
  -> run/input resources
  -> run-start/fail/win/shard events
  -> route, surface, score and outcome services
  -> player-creature descriptor and pose query
  -> scene-transition requests and snapshots

drunk-route-generator
  -> seeded route samples, nearest query, tangent/progress, region classification and snapshot

player-raptor preset
  -> product-owned seed, theropod topology, proportions, material, animation and collision configuration
```

### External and host-implied

```txt
rapier-physics-domain-kit
Three.js 0.179.1
Rapier 0.15.0
static-shell-adapter-kit
browser-input-adapter-kit
rapier-host-adapter-kit
terrain-render-adapter-kit
tree-population-render-kit
layered-grass-render-kit
shard-render-pickup-kit
three-procedural-creature-adapter-kit
creature-pose-consumption-adapter-kit
camera-light-render-adapter-kit
runner-hud-adapter-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

## Main finding

The ownership split is substantially better, but the consumption chain is not authoritative or testable.

```txt
product preset
  -> official descriptor kit
  -> game-domain query
  -> Three mesh/skeleton binding
  -> per-frame pose consumption
  -> Rapier collision consumption
  -> host observation
```

The route has no single module-graph manifest proving that the import map and JavaScript CDN constants resolve the same Nexus Engine revision. It has no typed descriptor validation result, render-binding result, pose-consumption row, collision-consumption row, lifecycle owner, or bounded creature journal. `PrehistoricRushHost.getState()` exposes only body id, content hash and topology, so it cannot prove which preset, kit version, source commit, skeleton, pose sequence, renderer binding or collision dimensions were actually consumed.

The previous core-kit-consumption and population-capacity findings remain valid.

## Next safe ledge

```txt
PrehistoricRush Procedural Creature Consumption Authority
+ Pinned Module Graph / Descriptor-Adapter Fixture Gate
```

## Candidate kits

```txt
runtime-module-graph-manifest-kit
module-source-admission-result-kit
module-graph-fingerprint-kit
player-raptor-preset-kit
procedural-creature-descriptor-validation-kit
three-procedural-creature-adapter-kit
creature-render-binding-result-kit
creature-pose-consumption-row-kit
creature-collision-consumption-row-kit
creature-resource-lifecycle-kit
creature-host-observation-kit
procedural-creature-fixture-kit
```

## Plan ledger

- [ ] Create one immutable module graph shared by `index.html`, runtime imports and host readback.
- [ ] Validate requested and resolved NexusEngine, NexusEngine-Kits and ProtoKits revisions.
- [ ] Preserve the product-owned `PLAYER_RAPTOR_PRESET` boundary.
- [ ] Validate descriptor arrays, topology counts, bone hierarchy, skin indices/weights and content hash before renderer preparation.
- [ ] Give the Three adapter a named prepare/update/dispose contract.
- [ ] Produce one render-binding result for descriptor hash, geometry, bones and material.
- [ ] Produce ordered pose-consumption rows tied to run and frame sequence.
- [ ] Produce a collision-consumption row proving Rapier used the same descriptor revision and dimensions.
- [ ] Add exact resource ownership and idempotent disposal for creature geometry, material, skeleton and mesh.
- [ ] Replace live creature references in public readback with JSON-safe evidence.
- [ ] Add a DOM-free pinned-module and descriptor fixture.
- [ ] Add a browser mesh/pose/collision/lifecycle smoke.
- [ ] Reconcile the new creature adapter with the existing core-kit-consumption ledger.
- [ ] Then restore immutable population capacity and atomic population commit.

## Validation posture

Documentation only. Runtime source, dependencies, route behavior, rendering, physics and deployment were not changed by this audit. No branch or pull request was created. The required fixtures do not exist, and the repository has no root `package.json` validation command.