# Project Breakdown: PrehistoricRush Active Content Materialization

**Timestamp:** `2026-07-12T07-09-49-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` currently materializes streamed content by rebuilding the complete active grass, shard, pickup and collider projection whenever patches are released and again whenever a ready patch is activated. A single frame can therefore perform two full active-set rebuilds plus two fixed-collider replacements before rendering.

## Plan ledger

**Goal:** define one bounded, revisioned materialization transaction that coalesces patch releases and activations, prepares consumer deltas, commits terrain, trees, grass, shards and colliders once, and proves the first frame rendered from that exact active-content revision.

- [x] Compare the complete `LuminaryLabs-Publish` inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Avoid overlapping the newer repo-local `TheOpenAbove` HUD accessibility audit awaiting central synchronization.
- [x] Select only `PrehistoricRush` as the next-oldest stable eligible repository.
- [x] Trace controller focus, release, generation, ready delivery, terrain slots, tree batches, grass/shard rebuilds, collider replacement, physics and rendering.
- [x] Identify the complete interaction loop, all active domains, all 38 implemented/adapted kits and every offered service.
- [x] Quantify the current full-rebuild work bound from source constants.
- [x] Define materialization identity, coalescing, work budgets, prepare/commit/rollback, parity and visible-frame contracts.
- [x] Add timestamped architecture and system-specific audits.
- [x] Refresh required root `.agent` files and machine registry.
- [x] Push `LuminaryLabs-Publish/PrehistoricRush` directly to `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable materialization fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

TheOpenAbove       2026-07-12T05-11-46-04-00 skipped: newer 07-00-48 repo-local HUD accessibility audit pending central sync
PrehistoricRush    2026-07-12T05-21-52-04-00 selected: next-oldest stable eligible repository
IntoTheMeadow      2026-07-12T05-39-42-04-00
PhantomCommand     2026-07-12T05-49-04-04-00
HorrorCorridor     2026-07-12T05-59-28-04-00
ZombieOrchard      2026-07-12T06-19-56-04-00
TheUnmappedHouse   2026-07-12T06-30-34-04-00
AetherVale         2026-07-12T06-41-32-04-00
MyCozyIsland       2026-07-12T06-51-27-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` is changed on the Publish side.

## Complete interaction loop

```txt
menu/profile
  -> creator or gameplay page

creator
  -> pinned module admission
  -> profile draft and procedural preview
  -> persistence and page transition

game startup
  -> load pinned Nexus Engine, kits, ProtoKits, Rapier and Three
  -> create engine graph, product domain, Worker/fallback generator,
     patch controller, physics bridge, camera follow and Three adapter
  -> start run
  -> synchronously prime the center patch
  -> reset camera

frame
  -> observe browser input
  -> tick simulation
  -> update controller focus and desired membership
  -> take every released patch ID
  -> remove terrain/tree cells
  -> flush every tree batch
  -> rebuild all active grass, shards, pickups and colliders
  -> replace the complete physics fixed-collider set
  -> pump generation
  -> take at most one ready patch
  -> install terrain and tree cells
  -> flush every tree batch again
  -> rebuild all active grass, shards, pickups and colliders again
  -> replace the complete physics fixed-collider set again
  -> run collision and shard checks
  -> render Three scene and HUD
```

## Source-backed findings

### Release and activation are separate materialization commits

`updateStreaming()` calls `releasePatches()` before pumping and taking ready patches. `releasePatches()` performs a full tree flush and active-content rebuild when any release occurs. Every `activatePatch()` then performs another tree flush and active-content rebuild.

A frame containing both a release and one activation can therefore commit two intermediate consumer states even though only the final state is rendered.

### `rebuildActiveContent()` is a full-set operation

The function:

```txt
creates new collider and pickup arrays
creates a Set of collected shard IDs
sorts the complete active patch set
iterates every active patch
copies every admitted grass matrix
copies every uncollected shard matrix
recomputes grass and shard bounds
replaces the complete fixed-collider set
```

There is no patch-local delta application for grass, shards or colliders.

### Source-level upper bound per complete active set

```txt
active radius: 2
maximum active patches: (2 * 2 + 1)^2 = 25
maximum generated trees per patch: 7
maximum generated grass descriptors per patch: 70
maximum generated shards per patch: 2

one full active-set scan upper bound:
  patches scanned: 25
  grass descriptors visited: 1,750
  shard descriptors visited: 50
  tree descriptors: up to 175 trunks + 175 crowns
  fixed colliders: up to 175

release plus activation in one frame upper bound:
  grass descriptor visits: 3,500
  shard descriptor visits: 100
  full fixed-collider replacements: 2
  all tree batch flushes: 2
```

This excludes terrain attribute uploads, bounds recomputation, GPU instance-buffer updates and Rapier replacement cost.

### No bounded transaction exists

```txt
active-content revision: absent
aggregate release/activation delta: absent
materialization command ID: absent
consumer prepare results: absent
work-unit or elapsed-time budget: absent
coalescing policy: absent
partial-failure rollback: absent
stale plan rejection: absent
physics/render parity digest: absent
first visible-frame acknowledgement: absent
```

### Current diagnostics are aggregate-only

The HUD reports controller active, desired, cache and queue counts. Public readback exposes raw controller and renderer owners. Neither reports materialization duration, descriptor writes, consumer revisions, coalesced deltas, skipped work, rollback or the active-content revision rendered.

## Domains in use

```txt
page routing and profile lifecycle
creator draft, preview, persistence and transition
runtime module identity, import maps and CDN admission
Nexus Engine composition and 12 core capabilities
five official NexusEngine-Kits
browser input and lifecycle observation
product run, movement, jump, route, surface, score, shards and outcomes
Worker/fallback patch generation and request correlation
patch controller focus, desired membership, queue, cache and delivery
active patch set and terrain slot ownership
tree-cell batch replacement and release
grass instance materialization and bounds
shard/pickup materialization and collection filtering
fixed-collider set materialization and Rapier replacement
height sampling, collision and terminal outcomes
camera smoothing and Three rendering
HUD, diagnostics and public host readback
validation, static deployment and Pages
active-content coalescing, budgets, revision, commit, rollback and frame proof: missing
```

## Implemented kits and offered services

### Nexus Engine core kits

```txt
core-input-kit: actions, bindings, input state
core-spatial-kit: transforms, spatial queries
core-scene-kit: scene registry, transitions, host descriptor
core-physics-kit: physics provider contract
core-motion-kit: motion capability
core-camera-kit: camera capability
core-animation-kit: animation capability
core-graphics-kit: graphics and frame capability
core-skybox-kit: sky descriptor
core-ui-kit: UI capability and projection
core-diagnostics-kit: diagnostics and readback
core-composition-kit: capability graph and composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit: deterministic seed and random streams
procedural-creature-body-kit: normalization, body descriptors, geometry,
  skeleton, skinning, collision, poses, hashes and snapshots
instanced-render-batch-kit: cell replace/release, flush, overflow,
  bounds, statistics and snapshots
seeded-world-patch-controller-kit: identity, focus, membership, cache,
  queue, executor, delivery, budgets, eviction, reset and snapshots
camera-smooth-follow-kit: damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit: run, input, movement, route, surface,
  score, shard mutation, outcomes, events, transitions and snapshots
player-character-schema-kit: defaults, normalization, clamps and merge
player-character-profile-store-kit: load, save, patch, reset, revisions,
  storage synchronization and BroadcastChannel
menu-page-kit: menu shell, profile projection and routes
character-creator-page-kit: controls, draft, save scheduling, reset,
  projection, showcase, resize and RAF
character-preview-transition-kit: descriptor target, morph, crossfade,
  pose damping, revision and disposal
three-procedural-creature-adapter-kit: SkinnedMesh, geometry, materials,
  opacity, poses and disposal
game-page-entry-kit: browser runtime loading
drunk-route-generator: samples, nearest, progress, classification and snapshot
player-raptor-preset-kit: creature recipe and capsule collision
prehistoric-patch-generator: terrain, trees, grass, shards, colliders,
  bounds and transferables
prehistoric-patch-worker: initialization, generation, request/error protocol
  and transferable delivery
```

### External and host adapter boundaries

```txt
Three runtime: scene, geometry, materials, instancing, camera, lighting,
  resize and rendering
rapier-physics-domain-kit: world bridge, actor, colliders, step, contacts and reset
Rapier runtime: bodies, colliders, queries and world step
message Worker executor: request correlation and async generation
active-content consumer adapter: terrain slots, tree batches, grass, shards,
  pickups, colliders and height
creator viewport framing adapter: bounds, target and distance
creator persistence scheduler: timer replacement and profile commit
browser input adapter: keyboard, button, keyup, blur and held flags
creature/camera/render host adapters: creature, collision, camera, lighting,
  HUD and public readback
```

## Required parent domain

```txt
prehistoric-rush-active-content-materialization-authority-domain
```

## Candidate kits

```txt
active-content-set-revision-kit
patch-content-delta-kit
patch-release-delta-kit
patch-activation-delta-kit
materialization-command-kit
materialization-command-id-kit
materialization-coalescing-kit
materialization-work-budget-kit
terrain-slot-plan-kit
tree-batch-delta-plan-kit
grass-instance-delta-plan-kit
shard-instance-delta-plan-kit
collider-set-delta-plan-kit
materialization-prepare-kit
materialization-consumer-result-kit
materialization-commit-kit
materialization-rollback-kit
stale-materialization-plan-rejection-kit
active-content-parity-digest-kit
materialization-observation-kit
materialization-journal-kit
visible-content-frame-ack-kit
release-activation-coalescing-fixture-kit
bounded-materialization-work-fixture-kit
consumer-failure-rollback-fixture-kit
physics-render-content-parity-fixture-kit
browser-stream-materialization-smoke-kit
```

## Required transaction

```txt
controller membership observation
  -> collect all release candidates and ready activations for the frame
  -> create one immutable aggregate PatchContentDelta
  -> bind runtime, run, stream epoch and predecessor content revision
  -> derive terrain, tree, grass, shard and collider consumer plans
  -> admit the plan against work and time budgets
  -> prepare every required consumer without exposing partial state
  -> reject stale plans
  -> commit one active-content revision atomically
  -> retire predecessor resources exactly once
  -> run collision against the committed collider revision
  -> render the same terrain/tree/grass/shard revision
  -> publish the first visible-frame acknowledgement and parity digest
```

## Required invariants

```txt
release and activation changes in one frame are coalesced into one commit
one content revision names the terrain, tree, grass, shard and collider sets
no consumer observes an uncommitted intermediate active set
full-set rebuilds are replaced by bounded deltas or explicitly budgeted fallback
work budgets use elapsed time and declared work units, not display-frame count
failed required consumers preserve the predecessor revision
physics and render consumers cite the same patch-set digest
only the latest runtime/run/stream epoch can commit
public diagnostics expose detached results, not mutable owners
one visible frame acknowledges each committed content revision
```

## Ordered safe ledges

```txt
0 runtime module graph admission
0a browser input command authority
0b render-surface resolution/frame correlation
1 route/profile proof
2 creator authority
3 patch activation/release authority
3b active-content materialization/coalescing authority
3a shard identity/collection authority
4 exact collider replacement/admission
5 run-step outcome authority
6 stream cadence/time budget
7 world readiness
8 committed frame/read model
8a public host gateway
9 coordinated reset epochs
10 lifecycle/disposal
```

## Validation boundary

Documentation only. No runtime, streaming, physics, renderer, dependency or deployment behavior changed. No materialization, browser or Pages fixture was executed.