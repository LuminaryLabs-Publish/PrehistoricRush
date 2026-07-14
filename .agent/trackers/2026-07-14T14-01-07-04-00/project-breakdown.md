# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-14T14-01-07-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Repository head before audit:** `0a8e5dff693226ea5ca8d163a1b89fa85fc837dc`  
**Runtime source revision retained:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `runtime-provider-revision-convergence-authority-audited`

## Summary

PrehistoricRush currently admits two NexusEngine revisions into the same browser module graph. `src/shared/runtime-versions.js` directly imports NexusEngine revision `682c9fa697a36a6bf6262762a6e647ffc3a5e289`, while `game.html` and `charactercreator.html` map the bare `nexusengine` specifier to older revision `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`.

The official Seed and Procedural Creature kits, plus the ProtoKit core used by the Rapier kit, import `nexusengine` through that bare specifier. The runtime then composes the game with the newer directly imported module while some kit factories and descriptors originate from the older mapped module. Shape compatibility may allow startup, but there is no one accepted provider revision, module-graph receipt, compatibility result, or first frame tied to the admitted graph.

## Plan ledger

**Goal:** make each route load and compose one explicit NexusEngine provider revision across the root runtime, stable kits, ProtoKits, descriptors, public diagnostics, and first visible frame.

- [x] Compare all 11 accessible Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and current repo-local documentation heads.
- [x] Confirm no eligible repository is new, ledger-missing, root-agent-missing, or runtime-ahead.
- [x] Select only PrehistoricRush by the oldest eligible central timestamp.
- [x] Inspect the game and creator HTML import maps.
- [x] Inspect the route preloader, runtime URL registry, game composition, stable kits, ProtoKit core, public host, and existing tests.
- [x] Preserve the complete 59-surface kit and service census.
- [x] Add this timestamped audit family and refresh root `.agent` projections.
- [x] Change no runtime, package, test, workflow, or deployment source.
- [x] Use `main` only and create no branch or pull request.
- [ ] Implement one provider manifest and executable browser module-graph proof later.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
runtime-ahead: 0

last documented timestamps:
  PrehistoricRush   2026-07-14T08-40-38-04-00
  TheLongHaul       2026-07-14T09-03-47-04-00
  MyCozyIsland      2026-07-14T09-39-44-04-00
  IntoTheMeadow     2026-07-14T09-58-25-04-00
  HorrorCorridor    2026-07-14T10-40-05-04-00
  ZombieOrchard     2026-07-14T10-59-56-04-00
  TheUnmappedHouse  2026-07-14T11-59-13-04-00
  TheOpenAbove      2026-07-14T12-38-21-04-00
  AetherVale        2026-07-14T13-00-39-04-00
  PhantomCommand    2026-07-14T13-40-59-04-00

selected: PrehistoricRush
rule: oldest eligible synchronized documentation timestamp
excluded: TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
menu or creator route
  -> load local page module
  -> creator directly imports runtime and kit URLs
  -> kit modules resolve bare nexusengine through the HTML import map
  -> preview composes Core Creature, Character, Motion, Camera Framing, Seed, and Procedural Creature
  -> render the procedural character and persist profile edits

game route
  -> HTML import map binds bare nexusengine to cf2fe3d...
  -> page preloader directly imports NexusEngine 682c9fa... and all pinned dependencies
  -> game-runtime directly imports the same absolute dependency URLs again
  -> stable kit modules resolve their internal bare nexusengine imports to cf2fe3d...
  -> ProtoKit core resolves its bare nexusengine import to cf2fe3d...
  -> createRealtimeGame comes from 682c9fa...
  -> kit factories and descriptors may originate from both revisions
  -> compose Core and product domains
  -> initialize Rapier, patch streaming, Three.js, input, simulation, HUD, and RAF
  -> publish GameHost.versions with only the configured direct revisions
  -> render frames without a provider-graph identity acknowledgement
```

## Provider and module identity map

```txt
HTML bare-specifier provider:
  nexusengine -> cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1

runtime-versions direct provider:
  NexusEngine -> 682c9fa697a36a6bf6262762a6e647ffc3a5e289
  NexusEngine-Kits -> 9fd5b10053135e278c84b8b1591aece5cc641da1
  NexusEngine-ProtoKits -> 534e249346d94351baa4cfce9f2d3cd837362920
  Three.js -> 0.179.1
  Rapier -> 0.15.0

bare nexusengine consumers verified:
  seed-kit/index.js
  procedural-creature-body-kit/index.js
  NexusEngine-ProtoKits/protokit-core/index.js

public diagnostic limitation:
  PrehistoricRushHost.versions reports the configured direct Nexus/Kits/ProtoKits revisions
  it does not report the import-map revision or prove the actual transitive provider graph
```

## Domains in use

```txt
browser document, import-map, module-loader, navigation, input, resize, blur, and RAF lifecycle
runtime provider identity, module graph, compatibility, composition admission, and diagnostics
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition, and Presentation
articulated dynamics, articulated motion, camera framing, viewport output, and UI scale
product run, route, surface, score, resolution, player control, pose, terrain IK, pause, profile, and character composition
seed, procedural creature, instance batching, patch streaming, camera follow, Rapier provider, and Worker execution
Three.js world, camera, character, terrain, vegetation, HUD, and creator preview presentation
profile persistence, creator debounce, cross-document updates, validation, static hosting, and Pages deployment
provider manifest, route startup result, module compatibility receipt, and first provider-converged frame evidence
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings, and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, references, registry, snapshot, and reset
core-character-kit: character registry, bindings, status, snapshot, and reset
core-player-kit: player registry, possession, control, and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping, and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution, and committed frames
core-motion-kit: motion intents, requests, and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve, and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral graphics descriptors
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation composition graph and snapshots
core-presentation-output-kit: surface input, viewport policy, render resolution, and safe area
core-ui-scale-kit: reference resolution, viewport scale, and scale policy
core-camera-framing-kit: subject framing, projection fit, damping, and clipping policy
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic world seeds and named random streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision, descriptors, and legacy pose
instanced-render-batch-kit: batch registry, cell membership, stable ranges, changed-range flush, overflow diagnostics, and bounds invalidation
seeded-world-patch-controller-kit: focus, desired active/prefetch sets, generation queue, Worker execution, cache, ready/release queues, stats, and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta, and snapshots
```

### Product, page, and Worker kits: 16

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, character/control, pose, and ground IK
prehistoric-rush-pause-menu-domain-kit: menu state, commands, events, and snapshot
prehistoric-rush-resolution-policy: collisions, pickups, goal, and transition resolution
player-character-composition-kit: body, rig, creature, character, and optional possession
player-articulation-adapter-kit: legacy-pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: localStorage persistence, revision assignment, BroadcastChannel, and storage-event publication
menu-page-kit: title, selected-profile projection, and navigation
character-creator-page-kit: controls, draft state, reset, external-profile intake, and preview startup
character-preview-transition-kit: morph, crossfade, pose, and resource lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application, and disposal
game-page-entry-kit: dependency preflight, runtime entry, HUD cleanup, and pause host
player-raptor-preset-kit: authored player creature content
drunk-route-generator: deterministic route queries
prehistoric-patch-generator: terrain, trees, grass, pickups, and colliders
prehistoric-patch-worker: Worker init, request, and result protocol
```

### External and host adapters: 9

```txt
three-runtime-module: scene, resource, and render submission primitives
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling, and disposal
three-patch-stream-adapter-kit: terrain slots, patch activation/release, instance cells, collider membership, pickup refresh, height sampling, camera/render, and ownership readback
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: 160 ms debounced profile writes
browser-input-adapter: keyboard, blur, jump, boost, steer, and restart projection
creature-camera-render-host-adapters: player pose, camera, HUD, and public diagnostics projection
```

### Proof kits: 7

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
```

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        7
total implemented surfaces:       59
```

## Main architecture finding

The route has two sources of truth for NexusEngine identity. Absolute imports and `PrehistoricRushHost.versions` describe revision `682c9fa...`, while transitive bare imports inside stable kits and ProtoKits are resolved by the HTML import map to `cf2fe3d...`.

The composition therefore cannot prove that every kit descriptor, definition factory, runtime helper, engine constructor, namespace, physics provider, and public readback belongs to one compatible provider generation. The current code verifies factory shape, but shape checks are not provider identity or compatibility settlement.

## Required authority

```txt
prehistoric-rush-runtime-provider-revision-convergence-authority-domain
```

```txt
RouteProviderAdmissionCommand
  -> bind route, attempt, source, build, and dependency-manifest revisions
  -> resolve one canonical NexusEngine URL and immutable commit
  -> generate or validate the import map from that same manifest
  -> load root runtime, stable kits, ProtoKits, Three.js, and Rapier as candidates
  -> collect each module's provider dependency and exported capability receipt
  -> reject split NexusEngine revisions, missing identities, stale attempts, and incompatible factories
  -> compose Core, product, physics, streaming, and presentation participants
  -> publish RouteProviderAdmissionResult and immutable ModuleGraphManifest
  -> expose the accepted graph through public diagnostics
  -> publish FirstProviderConvergedFrameAck

failure
  -> discard candidate engine, renderer, Worker, listeners, and resources
  -> project a DOM-owned failure result with retry or safe navigation
  -> retain the rejected module graph for diagnostics
```

## Validation boundary

This was a documentation-only audit. Source inspection verified the two NexusEngine revisions and verified bare `nexusengine` imports in stable-kit and ProtoKit dependencies. No runtime, HTML, tests, package scripts, workflow, or deployment source changed. `npm test`, browser module-graph capture, built-output inspection, and Pages proof were not executed.