# Current Audit: PrehistoricRush Committed Frame Observation Authority

**Updated:** `2026-07-11T14-31-27-04-00`

## Summary

The runtime owns a functioning simulation/render loop, but it does not own a committed frame. `src/game.js` mutates game state, patch membership, Rapier state, gameplay outcomes, camera state and Three presentation before separately writing the HUD. `PrehistoricRushHost.getState()` then samples mutable game, controller and camera owners independently.

The current public readback cannot prove which simulation state, stream membership, physics step, camera transform, canvas submission and HUD projection belong together. A render or HUD failure can leave runtime state ahead of the last visible frame without a typed failure result.

## Plan ledger

**Goal:** define one immutable frame receipt shared by simulation, streaming, physics, gameplay, camera, rendering, HUD and diagnostics.

- [x] Trace the full RAF stage order.
- [x] Trace game-domain simulation and snapshots.
- [x] Trace patch and physics consumption.
- [x] Trace render and HUD commit points.
- [x] Trace public host aggregation.
- [x] Identify all domains, kits and services.
- [x] Define the frame authority DSK map.
- [ ] Implement frame IDs and typed stage receipts.
- [ ] Replace live host aggregation with a detached committed-frame read model.
- [ ] Add pure and browser frame-coherence fixtures.

## Current RAF path

```txt
input projection
  -> engine.tick(dt)
  -> game state mutation
  -> updateStreaming(state)
  -> patch release/generation/activation
  -> actor transform submission
  -> physics.step(dt)
  -> collision failure admission
  -> pickup collection admission
  -> final game state read
  -> creature/camera/light/grass/shard presentation mutation
  -> renderer.render(scene, camera)
  -> HUD HTML and button mutation
  -> request next RAF
```

## Frame-coherence gap

```txt
simulation tick identity: absent
stream revision consumed by frame: absent
collider membership revision consumed by physics: absent
physics step receipt: absent
ordered gameplay result receipts: absent
presentation fingerprint: absent
camera transform receipt: absent
render result: absent
HUD commit result: absent
committed frame pointer: absent
failed frame result: absent
```

`renderer.render()` returns no product receipt. If it throws, simulation and other mutable owners have already advanced. The next RAF is not scheduled, but the global host remains available and can expose the newer mutable state.

The HUD writes after rendering. A HUD failure can therefore leave the canvas on a new frame and status/button content on an older frame.

## Public host gap

Current host readback aggregates:

```txt
game.snapshot()
patchController.getSnapshot()
cameraFollow.getSnapshot()
engine.gameComposer
core scene host descriptor
player body identity
static renderer label
```

It does not expose:

```txt
runtimeSessionId
runSessionId
frameId
last committed frame
last failed frame
render result
HUD result
presentation fingerprint
physics receipt
```

Because the owners are sampled independently, readback can describe a state that was never presented as one frame.

## Domains in use

```txt
page routes and player-profile persistence
pinned dependency loading and module identity
Nexus Engine composition and scene routing
run simulation, input, movement, score and outcomes
procedural creature generation, skinning and poses
deterministic route and terrain classification
patch generation, Worker/executor, cache and controller
patch activation/release and active consumer membership
terrain, tree, grass, pickup, collider and height projection
Rapier actor, collider, step and contact state
collision, pickup and terminal outcome admission
browser input, delta sampling and RAF scheduling
camera smooth-follow and transform projection
Three scene/resources, lighting, shadows and rendering
HUD/button projection and public diagnostics
validation and Pages deployment
```

## Complete kit inventory and services

### Core kits

```txt
core-input-kit: actions, bindings, input state
core-spatial-kit: transforms and spatial queries
core-scene-kit: scene registry, transitions and host descriptor
core-physics-kit: physics provider contract
core-motion-kit: motion capability
core-camera-kit: camera capability
core-animation-kit: animation capability
core-graphics-kit: graphics/frame capability
core-skybox-kit: sky descriptor
core-ui-kit: UI capability/projection
core-diagnostics-kit: diagnostics/readback
core-composition-kit: composition metadata/capability graph
```

### Official kits

```txt
seed-kit: deterministic seeds and random streams
procedural-creature-body-kit: geometry, topology, skeleton, skinning,
  collision recommendation, bounds, poses, content hash and snapshots
instanced-render-batch-kit: capacity, replace/release, flush, overflow,
  bounds, statistics and snapshots
seeded-world-patch-controller-kit: identity, focus, desired sets, cache,
  queue, executor, ready/release delivery, budgets, eviction and snapshots
camera-smooth-follow-kit: position/look/quaternion damping, reset,
  teleport handling, delta clamp, transform access and snapshots
```

### Product/page/external/host kits

```txt
prehistoric-rush-domain-kit: run lifecycle, input, route, surface,
  score, outcomes, events, transitions, creature access and snapshot
player-character-schema-kit: defaults, normalization, clamps, color validation and merge
player-character-profile-store-kit: load, save, patch, reset, subscribe,
  storage sync, BroadcastChannel sync and close
menu-page-kit: menu shell, profile projection and route links
character-creator-page-kit: draft edit, controls, preview, debounce save,
  reset and remote projection
game-page-entry-kit: runtime loading
drunk-route-generator: samples, nearest query, progress, classification and snapshot
player-raptor-preset-kit: creature recipe and capsule collision descriptor
prehistoric-patch-generator: terrain, trees, grass, pickups, colliders,
  bounds and transferables
prehistoric-patch-worker: initialization, generation, errors and transferables
rapier-physics-domain-kit: world bridge, kinematic actor, fixed colliders,
  transforms, step, contacts, snapshot and reset
Three.js/product adapters: scene graph, geometry, materials, instancing,
  skinning, camera, lighting, fog, shadows, render, HUD and host projection
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

## Acceptance conditions

```txt
one RAF candidate has one frameId and terminal result
all stage receipts share runtime, run and frame identity
render and HUD success are required before frame publication
failed frame does not advance committed-frame pointer
host reads only a detached immutable committed record
host cannot mix current game, stream, camera or physics snapshots
records are bounded and JSON-safe
retry cannot accept predecessor-run receipts
```

## Priority placement

```txt
P0 route/profile handoff
P1 patch activation/release
P1a collider retirement/collision admission
P2 committed frame observation/host read model
P3 shared run/session/stream/collider epochs
P4 lifecycle/disposal
```

No runtime source was changed by this audit.