# Project Breakdown: PrehistoricRush Render Surface Authority

**Timestamp:** `2026-07-12T02-21-55-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Change type:** documentation only

## Summary

`PrehistoricRush` remains a multi-page Nexus Engine browser runner with a persisted procedural raptor, deterministic Worker-backed world patches, Rapier/fallback collision, Three.js rendering, HUD projection and public diagnostics.

This pass isolates render-surface authority. The gameplay page sizes its camera and renderer from global window dimensions, samples device pixel ratio only at startup and directly mutates the camera and renderer from a window resize listener. The creator preview uses a different container-based `ResizeObserver` policy. Neither surface publishes a surface identity, revision, physical-size receipt or first-frame acknowledgement.

## Plan ledger

**Goal:** define one surface transaction that owns CSS-size observation, device scale, physical-pixel policy, renderer and camera commits, cross-surface parity, public readback and the first visible frame after a surface change.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger entries and root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible central entry.
- [x] Trace gameplay and creator surface construction, resize ingress, DPR policy, camera projection, RAF rendering and public readback.
- [x] Identify the complete interaction loop.
- [x] Identify all active domains and missing authority boundaries.
- [x] Preserve the complete implemented kit and service inventory.
- [x] Define a render-surface parent domain, candidate kits, transaction and fixture gate.
- [x] Add timestamped architecture, render, gameplay, interaction, render-surface and deploy audits.
- [x] Refresh required root `.agent` files and the machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement the surface authority and executable browser fixtures.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

central Last updated order before selection:
  PrehistoricRush   2026-07-12T00-30-49-04-00
  TheOpenAbove      2026-07-12T00-39-05-04-00
  IntoTheMeadow     2026-07-12T00-58-12-04-00
  HorrorCorridor    2026-07-12T01-08-06-04-00
  PhantomCommand    2026-07-12T01-20-00-04-00
  ZombieOrchard     2026-07-12T01-30-07-04-00
  TheUnmappedHouse  2026-07-12T01-41-56-04-00
  AetherVale        2026-07-12T01-58-43-04-00
  MyCozyIsland      2026-07-12T02-10-14-04-00

selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` was changed in the Publish organization.

## Complete interaction loop

```txt
menu/profile
  -> load persisted procedural raptor
  -> route to creator or gameplay

creator
  -> load pinned Nexus/Kit/Three modules
  -> create local preview renderer and camera
  -> sample devicePixelRatio once
  -> observe preview container with ResizeObserver
  -> commit renderer CSS size and camera aspect
  -> edit profile -> preview transition -> delayed persistence
  -> RAF renders preview

game startup
  -> load and admit runtime candidates
  -> construct Nexus composition, Worker, physics, camera and Three renderer
  -> sample innerWidth, innerHeight and devicePixelRatio once
  -> start run and prime patch streaming
  -> install global keyboard, blur and window-resize listeners

resize
  -> read global innerWidth/innerHeight
  -> mutate camera aspect and projection matrix
  -> mutate renderer size
  -> no surface result, revision or first-frame acknowledgement

RAF
  -> input -> simulation -> streaming -> collision -> pickups
  -> camera -> renderer -> HUD
  -> public host returns subsystem snapshots without surface provenance
```

## Source-backed findings

### Gameplay surface policy

```txt
surface bounds source: global innerWidth / innerHeight
initial DPR: min(devicePixelRatio, 2)
DPR resampling on resize: no
container observation: no
window resize listener: yes
zero-area policy: no
physical pixel budget: no
surface ID/revision: no
actual drawing-buffer readback: no
post-resize frame acknowledgement: no
public surface observation: no
```

### Creator surface policy

```txt
surface bounds source: #preview clientWidth / clientHeight
container observation: ResizeObserver
minimum CSS dimension: 1 × 1
initial DPR: min(devicePixelRatio, 2)
DPR resampling after startup: no
surface ID/revision: no
physical-size receipt: no
post-resize frame acknowledgement: no
```

### Cross-surface divergence

The creator and gameplay pages can render the same persisted creature through different size-observation and resize-admission rules. The creator tracks its container; gameplay tracks the browser window. Both sample DPR only during construction. No shared policy or parity result proves that the preview and gameplay frame use the same quality tier, device scale or physical-pixel budget.

### Frame and diagnostics gap

The gameplay RAF renders from whatever camera and renderer state is current after direct resize mutation. No committed frame cites a surface revision. `PrehistoricRushHost.getState()` exposes game, streaming, camera, composition, scene, profile and player-body data, but no CSS size, physical size, device scale, quality tier or surface revision.

## Domains in use

```txt
static routes and page hosts
profile schema persistence and cross-context synchronization
creator controls, draft, transition, preview and persistence
runtime module identity, import maps and CDN loading
Nexus Engine composition and core capabilities
procedural creature descriptor, topology, skeleton, skinning, pose and collision
run lifecycle, input, movement, route, surface, score, pickups and outcomes
patch generation, Worker queue, cache, focus, membership and delivery
terrain, trees, grass, pickups, colliders and height consumers
Rapier provider and manual fallback collision
camera follow, projection and gameplay view
Three scene, lighting, shadows, instancing and rendering
HUD, transitions, terminal projection and public observation
runtime graph, outcome, frame, host, reset and lifecycle authorities
validation, static deployment and Pages
render-surface resolution and frame correlation: missing
```

## Complete implemented kit and service inventory

### Nexus Engine core kits

```txt
core-input-kit: actions, bindings and input state
core-spatial-kit: transforms and spatial queries
core-scene-kit: scene registry, transitions and host descriptor
core-physics-kit: physics-provider contract
core-motion-kit: motion capability
core-camera-kit: camera capability
core-animation-kit: animation capability
core-graphics-kit: graphics and frame capability
core-skybox-kit: sky descriptor
core-ui-kit: UI capability and projection
core-diagnostics-kit: diagnostics and readback
core-composition-kit: composition metadata and capability graph
```

### Official NexusEngine-Kits

```txt
seed-kit: deterministic seed and random streams
procedural-creature-body-kit: normalization, descriptor generation, geometry,
  topology, skeleton, skinning, collision recommendation, content hashes,
  poses and snapshots
instanced-render-batch-kit: cell replacement/release, flush, overflow, bounds,
  statistics and snapshots
seeded-world-patch-controller-kit: identity, focus, membership, cache, queue,
  executor, delivery, budgets, eviction, reset and snapshots
camera-smooth-follow-kit: damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit: run, input, movement, route, surface, score,
  pickups, outcomes, events, transitions, creature and snapshot
player-character-schema-kit: defaults, normalization, clamps, colors and merge
player-character-profile-store-kit: load, save, patch, reset, revisions,
  localStorage, storage events, BroadcastChannel, subscribe and close
menu-page-kit: profile projection and routes
character-creator-page-kit: controls, local draft, delayed save, reset,
  remote synchronization, showcase, resize and RAF
character-preview-transition-kit: descriptor targeting, morph, crossfade,
  pose damping, revision observation and disposal
three-procedural-creature-adapter-kit: SkinnedMesh, pose, topology,
  geometry/material updates, opacity and disposal
game-page-entry-kit: gameplay runtime loading
drunk-route-generator: samples, nearest-point lookup, progress, classification and snapshot
player-raptor-preset-kit: creature recipe and capsule collision
prehistoric-patch-generator: terrain, trees, grass, pickups, colliders,
  bounds and transferables
prehistoric-patch-worker: initialization, generation, protocol and delivery
```

### External and host boundaries

```txt
Three runtime: scene graph, geometry, materials, skinning, camera, lights,
  fog, shadows, resize and render
rapier-physics-domain-kit: world bridge, actor, fixed colliders, step,
  contacts, snapshots and reset
Rapier runtime: rigid bodies, colliders, queries and world step
message Worker executor: request correlation and asynchronous generation
active-content adapter: patch membership, pickups, colliders and height
creator viewport adapter: local bounds, target and distance
creator persistence scheduler: timer replacement and profile patch commit
creature/camera/render host adapters: creature, collision, pickup scan,
  camera, lighting, HUD and public readback
```

## Required parent domain

```txt
prehistoric-rush-render-surface-authority-domain
```

Candidate kits:

```txt
render-surface-policy-kit
render-surface-id-kit
render-surface-revision-kit
css-size-observation-kit
device-scale-observation-kit
resize-source-observation-kit
pixel-budget-kit
surface-resize-command-kit
surface-resize-admission-kit
surface-resize-plan-kit
surface-resize-coalescing-kit
renderer-buffer-commit-kit
camera-projection-commit-kit
creator-preview-surface-adapter-kit
gameplay-surface-adapter-kit
surface-commit-result-kit
surface-frame-acknowledgement-kit
surface-debug-projection-kit
surface-journal-kit
dpr-change-fixture-kit
container-resize-fixture-kit
game-creator-surface-parity-fixture-kit
browser-surface-smoke-kit
```

## Required transaction

```txt
surface observation
  -> validate runtime generation, surface identity and prior revision
  -> sample CSS dimensions and device scale once
  -> apply named quality tier and physical-pixel budget
  -> coalesce duplicate observations and reject stale ones
  -> commit renderer CSS/physical size and camera projection atomically
  -> read back actual drawing-buffer and camera values
  -> publish SurfaceCommitResult with a monotonic revision
  -> require the next rendered frame to acknowledge that revision
  -> expose detached surface and frame observations through diagnostics
```

## Required invariants

```txt
one active surface owner per renderer/camera pair
each resize uses one coherent CSS-size and device-scale sample
creator and gameplay adapters consume the same policy contract
physical dimensions are bounded by an explicit pixel budget
stale or duplicate resize observations cannot mutate current state
a committed frame cites the surface revision it rendered through
public readback reports actual committed values, not requested values
```

## Validation boundary

```txt
runtime source changed: no
render behavior changed: no
camera behavior changed: no
input behavior changed: no
dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
```

Not executed:

```txt
local browser run
window/container resize smoke
DPR change or cross-display smoke
physical drawing-buffer readback
creator/game surface parity fixture
first-frame surface acknowledgement
GitHub Pages smoke
```

No runtime render-surface correctness or parity claim is made.