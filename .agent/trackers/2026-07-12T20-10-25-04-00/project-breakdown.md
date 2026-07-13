# Project Breakdown: PrehistoricRush Browser Runtime Lifecycle and Resource Retirement

**Timestamp:** `2026-07-12T20-10-25-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Repository head reviewed:** `f1ef269ec32df13a78fa91c14455796b8434b731`

## Summary

PrehistoricRush creates a long-lived engine, Rapier provider, patch controller, optional Worker executor, camera follower, Three.js renderer, 40 mesh/geometry allocations, 12 material objects, one skinned skeleton, global browser listeners, a public host and a recursive RAF loop. The game page exposes no stop command, retains no RAF or listener leases, terminates no Worker, disposes no renderer or GPU resources and publishes no typed shutdown result.

The repository already contains `disposeCreatureMesh()`, and the upstream Worker adapter advertises pending rejection, listener removal and Worker termination, but the game runtime does not compose those capabilities into an ordered page-runtime lifecycle.

## Plan ledger

**Goal:** make game boot, frame execution, failure and exit one supervised lifecycle that can reject new work, stop callbacks, retire asynchronous and rendering resources exactly once, clear public capabilities and publish a terminal shutdown result.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Compare the nine eligible repositories with `LuminaryLabs-Dev/LuminaryLabs` ledger timestamps.
- [x] Confirm no eligible repository is new, ledger-missing or root-`.agent`-missing.
- [x] Select only `PrehistoricRush`, the oldest eligible synchronized repository.
- [x] Trace module admission, engine composition, physics, streaming, Worker, rendering, listeners, RAF and public-host publication.
- [x] Identify the complete interaction loop, domains, kits and offered services.
- [x] Quantify the source-level render-resource set created by the game adapter.
- [x] Define the missing browser-runtime lifecycle and resource-retirement authority.
- [x] Add the timestamped architecture, render, gameplay, interaction, lifecycle and deployment audits.
- [x] Refresh all required root `.agent` documents and the machine registry.
- [x] Synchronize the central ledger and internal change log on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime lifecycle implementation and executable shutdown/re-entry fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0
unsynchronized eligible repositories at selection: 0
selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Central timestamps at selection:

```txt
PrehistoricRush:   2026-07-12T18-18-59-04-00
HorrorCorridor:    2026-07-12T18-38-51-04-00
ZombieOrchard:     2026-07-12T18-48-07-04-00
MyCozyIsland:      2026-07-12T19-00-22-04-00
TheUnmappedHouse:  2026-07-12T19-11-01-04-00
AetherVale:        2026-07-12T19-21-29-04-00
TheOpenAbove:      2026-07-12T19-31-06-04-00
IntoTheMeadow:     2026-07-12T19-49-41-04-00
PhantomCommand:    2026-07-12T19-58-07-04-00
```

Only `LuminaryLabs-Publish/PrehistoricRush` was modified in the Publish organization.

## Complete interaction loop

```txt
game.html
  -> pinned-module preflight
  -> import src/game.js

main startup
  -> create page shell
  -> load one player profile
  -> import Nexus Engine, official kits, Three.js, Rapier and ProtoKit
  -> create engine and install Core Motion/Physics/articulation/product kits
  -> install Rapier provider and player body
  -> create generator, optional Worker executor and patch controller
  -> create camera follow and Three adapter
  -> allocate renderer, scene, meshes, geometries, materials and skeleton
  -> register global keydown, keyup, blur and resize listeners
  -> publish global PrehistoricRushHost
  -> start recursive requestAnimationFrame

frame
  -> sample browser input
  -> submit product input
  -> engine.tick(dt)
  -> read committed game frame
  -> update streamed patches and colliders
  -> apply creature pose and camera transform
  -> render Three.js frame and HTML HUD
  -> schedule successor RAF

failure or exit
  -> startup failures reach main().catch
  -> frame failures have no lifecycle supervisor
  -> no StopRuntimeCommand
  -> no RAF cancellation
  -> no listener removal
  -> no pending Worker rejection or termination
  -> no patch/controller/provider retirement
  -> no renderer, geometry, material or skeleton disposal
  -> no public-host revocation
  -> no terminal RuntimeStopResult
```

## Domains in use

```txt
page shell and route entry
pinned module identity and startup admission
player-profile boot binding
Nexus Engine composition and tick scheduling
Core Input, Spatial, Scene and Simulation
Core Motion and articulated motion
Core Physics and articulated dynamics
Rapier provider, bodies, colliders and frames
procedural creature generation and pose application
seeded patch generation, Worker execution, queue, cache and activation
terrain, tree, grass, shard, pickup and collider materialization
camera smooth follow
Three.js scene, renderer, lights, shadows, meshes, geometry, materials and skeleton
browser keyboard, blur and resize listeners
recursive RAF scheduling
HUD and global public readback
runtime session, lifecycle state and callback ownership
ordered shutdown, resource retirement and exact-once disposal
validation, browser fixtures and Pages deployment
```

## Implemented kits and offered services

### Nexus Engine root and subdomain kits: 15

```txt
core-input-kit: actions, bindings, input state
core-spatial-kit: transforms, spatial queries
core-scene-kit: scene registry, transitions, host descriptor
core-physics-kit: provider, bodies, colliders, motion requests, step, frame
articulated-dynamics-domain-kit: articulations, joints, motors, ragdoll state, frames, snapshot, reset
core-simulation-kit: tick context, proposals, observations, resolution, commit, frame
core-motion-kit: movement modes, intents, trajectories, motion frames, validation, snapshot, reset
articulated-motion-domain-kit: rigs, poses, targets, IK, resolution, frames, snapshot, reset
core-camera-kit: camera capability
core-animation-kit: animation capability
core-graphics-kit: graphics and frame capability
core-skybox-kit: sky descriptor
core-ui-kit: UI capability and projection
core-diagnostics-kit: diagnostics and readback
core-composition-kit: composition metadata and capability graph
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic seed and random streams
procedural-creature-body-kit: descriptor, geometry, skeleton, skinning, collision, legacy pose, snapshot
instanced-render-batch-kit: cell replace/release, flush, overflow, bounds, stats
seeded-world-patch-controller-kit: focus, membership, queue, cache, generation, delivery, eviction, snapshot, reset
camera-smooth-follow-kit: damping, reset, teleport handling, snapshot
```

### Product, page and Worker kits: 14

```txt
prehistoric-rush-domain-kit: run resources, input, movement proposals, motion frames, observations, events, transitions, snapshots
prehistoric-rush-resolution-policy: collision, pickup and goal precedence, state patch, events, transitions
player-articulation-adapter-kit: skeleton-to-rig and legacy-pose conversion
player-character-schema-kit: defaults, normalization, clamps and merge
player-character-profile-store-kit: load, save, patch, reset, revision and browser distribution
menu-page-kit: shell, profile projection, routes and profile subscription
character-creator-page-kit: controls, draft, persistence, reset, subscription, preview, RAF and navigation
character-preview-transition-kit: morph, crossfade, pose damping, revision and disposal
three-procedural-creature-adapter-kit: skinned mesh, materials, bone lookup, pose application and disposal
game-page-entry-kit: module preflight, failure projection, import and profile boot binding
drunk-route-generator: samples, nearest point, progress, classification and snapshot
player-raptor-preset-kit: creature recipe and collision capsule
prehistoric-patch-generator: terrain, trees, grass, shards, colliders, bounds and transferables
prehistoric-patch-worker: initialization, generation, error protocol and transfer
```

### External and host adapters: 9

```txt
three-runtime-module: scene, geometry, materials, instancing, camera, lighting and rendering
rapier-physics-domain-kit: Nexus provider bridge
rapier-runtime-module: bodies, colliders, queries and world step
message-worker-executor-adapter-kit: request correlation, pending rejection, listener removal and Worker termination
active-content-consumer-adapter: terrain, trees, grass, shards, pickups, colliders and height
creator-viewport-framing-adapter: bounds, target and distance
creator-persistence-scheduler: timer replacement and delayed profile commit
browser-input-adapter: keyboard, buttons, keyup, blur, input patch and restart activation
creature-camera-render-host-adapters: pose, collision, pickups, camera, HUD, profile and frame readback
```

### Proof kits: 2

```txt
prehistoric-rush-resolution-policy-test-kit: continue, win, collision, precedence, pickup idempotency, fallback and serialization
player-articulation-test-kit: rig adaptation, Euler/quaternion conversion and cloneability
```

## Source-backed lifecycle finding

`src/game.js` allocates a renderer and all presentation resources inside `createThreeAdapter()` but returns no disposer. The game imports `createCreatureMesh()` and `applyCreaturePose()` but not the existing `disposeCreatureMesh()` helper. The optional Worker, controller, engine/provider, anonymous browser listeners, global host and recursive RAF are also created without a common owner or stop path.

Source-level presentation census:

```txt
terrain meshes/geometries: 25
tree instanced meshes/geometries: 10
grass instanced meshes/geometries: 3
shard instanced mesh/geometry: 1
player skinned mesh/geometry: 1
mesh/geometry allocations total: 40
material objects: 12
skeletons: 1
WebGL renderers: 1
```

This is an allocation census, not a measured GPU-memory or leak claim.

## Required parent domain

```txt
prehistoric-rush-browser-runtime-lifecycle-authority-domain
```

Required flow:

```txt
StartRuntimeCommand
  -> allocate runtime session and generation
  -> prepare engine, physics, Worker, stream, render and input participants
  -> commit Running or retire partial startup

StopRuntimeCommand
  -> admit expected runtime session/generation
  -> move lifecycle to Stopping
  -> reject new input, stream work and public commands
  -> cancel RAF lease
  -> remove browser listener leases
  -> revoke PrehistoricRushHost publication
  -> reject pending Worker requests and remove Worker listeners
  -> terminate Worker and retire patch-controller ownership
  -> retire physics provider/body/collider ownership
  -> dispose creature, instanced, terrain, material, geometry, skeleton and renderer resources exactly once
  -> publish RuntimeStopResult and bounded retirement journal
  -> make repeated stop idempotent
```

## Candidate coordinating kits

```txt
prehistoric-rush-browser-runtime-lifecycle-authority-domain
runtime-session-id-kit
runtime-generation-kit
runtime-lifecycle-state-kit
runtime-start-command-kit
runtime-start-result-kit
runtime-stop-command-kit
runtime-stop-admission-kit
runtime-stop-result-kit
runtime-shutdown-barrier-kit
raf-lease-kit
browser-listener-lease-kit
global-host-publication-lease-kit
worker-resource-lease-kit
worker-executor-retirement-kit
patch-controller-retirement-kit
engine-runtime-retirement-kit
physics-provider-retirement-kit
renderer-resource-lease-kit
scene-resource-retirement-plan-kit
creature-resource-retirement-kit
instanced-resource-retirement-kit
material-geometry-retirement-kit
exact-once-disposal-kit
stale-callback-rejection-kit
runtime-failure-classification-kit
runtime-retirement-result-kit
runtime-observation-kit
runtime-journal-kit
terminal-visible-frame-ack-kit
runtime-stopped-ack-kit
browser-reentry-fixture-kit
frame-failure-fixture-kit
worker-pending-shutdown-fixture-kit
pages-lifecycle-smoke-kit
```

## Repo-local output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-12T20-10-25-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T20-10-25-04-00.md
.agent/architecture-audit/2026-07-12T20-10-25-04-00-browser-runtime-lifecycle-dsk-map.md
.agent/render-audit/2026-07-12T20-10-25-04-00-game-render-resource-retirement-gap.md
.agent/gameplay-audit/2026-07-12T20-10-25-04-00-running-frame-unsupervised-exit-loop.md
.agent/interaction-audit/2026-07-12T20-10-25-04-00-start-frame-stop-result-map.md
.agent/runtime-lifecycle-audit/2026-07-12T20-10-25-04-00-callback-worker-render-retirement-contract.md
.agent/deploy-audit/2026-07-12T20-10-25-04-00-runtime-shutdown-reentry-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime source, gameplay, physics, streaming, rendering, dependencies, package scripts and deployment were unchanged. `npm test`, browser lifecycle checks, Worker-pending shutdown, frame-failure injection, repeated start/stop, renderer-context retirement and deployed Pages re-entry were not run. No claim is made for leak freedom, deterministic shutdown, exact-once disposal, stale-callback rejection or production lifecycle readiness.