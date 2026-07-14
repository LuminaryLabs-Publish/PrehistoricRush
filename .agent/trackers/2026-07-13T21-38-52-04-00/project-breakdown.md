# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-13T21-38-52-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Runtime revision reviewed:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `patch-owned-streaming-adoption-authority-audited`

## Summary

PrehistoricRush now extracts its Three.js streaming consumer into `three-patch-stream-adapter.js` and replaces whole-world instance rebuilds with patch-owned terrain, tree, grass, shard, collider and pickup state. The pinned `instanced-render-batch-kit` supplies stable per-cell ranges, incremental changed ranges, overflow diagnostics and bounds invalidation.

The remaining boundary is cross-consumer adoption. The patch controller marks a ready patch active before the product adapter has completed terrain assignment, instance-cell updates, collider publication and pickup projection. Activation and release return no typed result, preserve no rollback candidate and publish no visible-frame acknowledgement.

## Plan ledger

**Goal:** preserve patch-owned incremental streaming while defining one revision-bound activation and release transaction across controller membership, terrain, instances, physics, pickups and visible presentation.

- [x] Enumerate all ten accessible Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Identify PrehistoricRush as one commit ahead of its repo-local documentation head.
- [x] Compare `4c959f4732df99112bb55845fa6b4a974f5f65f2..ab3c63fed62b70e776ee56c4295f359bc3660274`.
- [x] Inspect the extracted adapter, runtime orchestration, pinned official kits, tests and package wiring.
- [x] Identify the complete interaction loop and active domains.
- [x] Update the census to 59 kit, adapter and proof surfaces.
- [x] Add this timestamped tracker and focused audit family.
- [x] Change no runtime, renderer, dependency or deployment source.
- [x] Use `main` only and create no branch or pull request.
- [ ] Implement transactional patch adoption and executable Worker/WebGL/physics fixtures later.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9
root .agent entrypoints: 9
new or ledger-missing repositories: 0
root-agent-missing repositories: 0
locally-ahead repositories observed: PrehistoricRush, TheOpenAbove
selected repository: PrehistoricRush
selection reason: newest substantive architecture commit and one full commit ahead of its documented head

current runtime head:      ab3c63fed62b70e776ee56c4295f359bc3660274
prior documentation head:  4c959f4732df99112bb55845fa6b4a974f5f65f2
new commits:               1
```

Only `LuminaryLabs-Publish/PrehistoricRush` was modified in the Publish organization.

## Runtime change reconciled

```txt
ab3c63fed62b70e776ee56c4295f359bc3660274 refactor: make streamed content patch-owned
```

Changed surfaces:

```txt
package.json
src/game-runtime.js
src/game.js
src/render/three-patch-stream-adapter.js
src/shared/runtime-versions.js
tests/patch-owned-streaming-authority.mjs
tests/pause-menu-authority.mjs
tests/player-pose-authority.mjs
```

## Complete interaction loop

```txt
boot
  -> public game entry imports preserved runtime
  -> load pinned Nexus Engine, official kits, Three.js, Rapier and Rapier ProtoKit
  -> compose Core domains, Core Presentation, product run and pause-menu DSKs
  -> configure Rapier provider and player body
  -> create deterministic patch generator and optional Worker executor
  -> create seeded world patch controller
  -> create stable-range instance batches and Three patch-stream adapter
  -> start run, prime center patch and reset camera

frame
  -> project browser input into product run state
  -> engine.tick(dt)
  -> read committed pickup IDs
  -> refresh only affected shard cells
  -> update patch-controller focus and desired membership
  -> take released patch IDs and release adapter-owned cells
  -> pump bounded generation work
  -> take bounded ready patches and activate adapter-owned consumers
  -> render player, camera, terrain and instances
  -> project diagnostics and schedule successor RAF

patch activation
  -> controller.takeReadyPatches marks patch active
  -> adapter.activePatches records patch
  -> assign and update terrain slot
  -> replace tree trunk and crown cells
  -> replace grass layer cells
  -> replace shard cell from uncollected pickups
  -> publish collider membership and pickup view
  -> flush changed instance ranges and bounds
  -> update ownership counters

patch release
  -> controller.takeReleasedPatchIds clears release queue
  -> remove active patch and terrain slot
  -> release tree, grass and shard cells
  -> remove collider and pickup ownership
  -> flush changed instance ranges
  -> republish aggregate collider membership and pickup view

pickup collection
  -> accepted frame publishes pickup IDs
  -> map pickup IDs back to owning patch
  -> replace only affected shard cells
  -> do not resynchronize colliders
```

## Domains in use

```txt
browser module admission, fatal projection, DOM, resize, RAF and lifecycle
browser gameplay input and pause-menu command admission
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation and Motion
articulated dynamics and articulated motion
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
Core Presentation parent, output policy, UI scaling and camera framing
product run, route, surface, score, outcomes, player pose and terrain IK
product pause-menu state, commands, events, descriptors and snapshot
profile schema, persistence and player-character composition
seeded patch focus, queue, Worker execution, cache, activation and release
stable-range instanced rendering, cell membership, changed ranges, overflow and bounds
patch-owned terrain, trees, grass, shards, colliders, pickups and height sampling
Rapier body/collider publication and collision fallback
Three.js world, creature, camera, HUD and diagnostics presentation
pause overlay DOM, navigation and browser-host retirement
validation, build and GitHub Pages deployment
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, references, registry, snapshot and reset
core-character-kit: character registry, bindings, status, snapshot and reset
core-player-kit: player registry, possession, control and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution and committed frames
core-motion-kit: motion intents, requests and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral graphics descriptors
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation composition graph and snapshots
core-presentation-output-kit: surface input, viewport policy, render resolution and safe area
core-ui-scale-kit: reference resolution, viewport scale and scale policy
core-camera-framing-kit: subject framing, perspective/orthographic fit and damping
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic random streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision and legacy pose
instanced-render-batch-kit: batch registry, cell membership, stable cell ranges, changed-range flush, overflow diagnostics and bounds invalidation
seeded-world-patch-controller-kit: focus, desired active/prefetch sets, generation queue, Worker execution, cache, ready/release queues, stats and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page and Worker kits: 16

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, character/control, pose and ground IK
prehistoric-rush-pause-menu-domain-kit: menu state, commands, events and snapshot
prehistoric-rush-resolution-policy: collisions, pickups, goal and transition resolution
player-character-composition-kit: body, rig, creature, character and optional possession
player-articulation-adapter-kit: legacy-pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: persistence and revision
menu-page-kit: title and menu entry
character-creator-page-kit: editor interaction and preview
character-preview-transition-kit: morph and crossfade preview lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application and disposal
game-page-entry-kit: HUD removal, runtime import and pause host
player-raptor-preset-kit: player creature content
drunk-route-generator: deterministic route queries
prehistoric-patch-generator: terrain, trees, grass, pickups and colliders
prehistoric-patch-worker: patch Worker init, request and result protocol
```

### External and host adapters: 9

```txt
three-runtime-module: scene, resource and render submission primitives
rapier-physics-domain-kit: Nexus Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling and disposal
three-patch-stream-adapter-kit: terrain slots, patch activation/release, instance-cell publication, collider membership, pickup refresh, height sampling, camera/render and ownership readback
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: profile save scheduling
browser-input-adapter: keyboard, blur and restart input projection
creature-camera-render-host-adapters: player pose, camera, HUD and public diagnostics projection
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
total surfaces:                   59
```

## Source-backed findings

```txt
whole active-world rebuild function: removed
explicit active patch ownership: present
explicit grass patch ownership: present
explicit shard patch ownership: present
explicit collider patch ownership: present
explicit pickup patch ownership: present
stable tree cell ranges: present
stable grass cell ranges: present
stable shard cell ranges: present
incremental changed-range GPU uploads: present
collider synchronization isolated to membership changes: present
pickup refresh isolated to affected shard cells: present
runtime ownership diagnostics: present
patch-owned authority test wired into npm test: present

controller-to-adapter activation transaction ID: absent
patch content key/revision retained by adapter: absent
prepare/commit/rollback across consumers: absent
typed PatchActivationResult: absent
typed PatchReleaseResult: absent
controller rollback after adapter failure: absent
terrain-slot exhaustion result/invariant: absent
overflow admission policy beyond console warning: absent
physics cell-diff publication: absent
first matching visible patch-frame acknowledgement: absent
fault-injection and real-runtime fixture: absent
```

## Main architecture finding

The refactor fixes ownership granularity but not adoption atomicity. `takeReadyPatches()` marks a patch active before `activatePatch()` begins, and `takeReleasedPatchIds()` clears release intent before adapter release completes. The adapter then mutates terrain, five tree batch pairs, three grass batches, shard cells, collider maps, pickup maps and GPU/physics consumers in sequence without a shared command identity or rollback result.

A thrown terrain, batch, GPU or physics operation can therefore leave controller membership, adapter ownership, visible instances and collision membership on different patch generations.

## Required authority

```txt
prehistoric-rush-patch-owned-streaming-adoption-authority-domain
```

```txt
PatchActivationCommand
  -> bind runtime session, controller revision, patch key, patch ID and adapter generation
  -> validate desired membership and predecessor state
  -> prepare terrain slot, tree cells, grass cells, shard cell, collider cell and pickup view
  -> validate capacities, overflow policy and physics readiness
  -> commit controller membership and every mandatory consumer together
  -> publish PatchActivationResult
  -> publish PatchVisibleFrameAck for the matching consumer revisions
  -> otherwise restore predecessor membership and resources

PatchReleaseCommand
  -> bind accepted activation and release generation
  -> prepare terrain, instance, collider and pickup retirement
  -> commit controller and adapter retirement together
  -> publish PatchReleaseResult
  -> reject late Worker or render callbacks from retired generations
```

## Validation boundary

The runtime commit, extracted adapter, pinned official kit implementations, static authority test and package wiring were inspected through GitHub. GitHub reported no combined status checks for the runtime commit. `npm test`, real Worker generation, WebGL changed-range uploads, Rapier membership, fault injection, built output and GitHub Pages parity were not independently executed. No runtime behavior was changed by this documentation audit.
