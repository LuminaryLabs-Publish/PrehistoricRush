# Project Breakdown: PrehistoricRush Shard Collection Authority

**Timestamp:** `2026-07-12T03-51-15-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` generates deterministic shard descriptors inside streamed patches, projects active uncollected shards into one instanced mesh, tests the player against that mutable projection, then calls `collectShard(id)` and rebuilds active content. The current path has no authoritative descriptor lookup, patch/revision evidence, run-phase admission, 3D collection volume, typed result, projection receipt or visible-frame acknowledgement.

## Plan ledger

**Goal:** establish one exactly-once shard collection transaction from active patch identity and authoritative player evidence through score mutation, event publication, visual removal, HUD projection and first visible-frame proof.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories with central tracking.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` coverage.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible ledger entry.
- [x] Trace patch generation, shard identity, active-pickup projection, proximity testing, `collectShard`, event publication, visual rebuild, HUD and public host paths.
- [x] Identify the complete interaction loop, domains, kits and offered services.
- [x] Record concrete admission, identity, evidence, idempotency, projection and frame-correlation gaps.
- [x] Define the parent domain, candidate kits, transaction and fixture gate.
- [x] Update root `.agent` state and add timestamped architecture and system audits.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime implementation and executable shard fixtures remain future work.

## Selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush    2026-07-12T02-21-55-04-00 selected oldest
TheOpenAbove       2026-07-12T02-29-50-04-00
IntoTheMeadow      2026-07-12T02-38-23-04-00
HorrorCorridor     2026-07-12T02-49-19-04-00
PhantomCommand     2026-07-12T03-00-46-04-00
ZombieOrchard      2026-07-12T03-11-51-04-00
TheUnmappedHouse   2026-07-12T03-21-27-04-00
AetherVale         2026-07-12T03-28-44-04-00
MyCozyIsland       2026-07-12T03-39-52-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
menu/profile
  -> creator or game

game startup
  -> load pinned Nexus Engine, Kits, Rapier and Three modules
  -> load persisted player profile
  -> create run domain, patch controller, Worker/fallback generator,
     physics adapter, renderer and camera
  -> prime the center patch and begin RAF

patch generation
  -> generate deterministic terrain, trees, grass, colliders and shards
  -> shard ID is `${chunkX}:${chunkZ}:${index}`
  -> patch controller queues, caches and delivers patch
  -> active-content adapter inserts uncollected descriptors into `view.pickups`
  -> instanced shard mesh is rebuilt from the same mutable active-patch set

frame
  -> input -> engine tick -> movement and run outcome
  -> update patch focus, release, queue, pump and activate
  -> set physics actor and step contacts
  -> test hazards
  -> iterate mutable `view.pickups`
  -> compare XZ distance only
  -> call `game.collectShard(pickup.id)`
  -> mutate collected IDs and shard count; emit event
  -> rebuild grass, shards and colliders
  -> render world and project HUD
  -> publish raw owners and snapshots through `PrehistoricRushHost`
```

## Domains in use

```txt
static page routing and hosts
profile schema, persistence and cross-context synchronization
creator draft, transition preview and profile commit
runtime module identity, import maps and CDN loading
Nexus Engine composition and core capabilities
procedural creature descriptor, topology, skinning, pose and collision
run lifecycle, input, movement, route, surface, score and outcomes
Worker patch generation, queue, cache, focus, membership and delivery
terrain, trees, grass, shard descriptors, colliders and height sampling
active-patch visual and collision projection
Rapier provider and manual fallback collision
camera follow, Three scene, shadows, instancing and render submission
HUD, transitions and public host observation
runtime graph, surface, frame, host, reset and lifecycle authorities
validation, static deployment and Pages
shard identity, evidence, collection commit and frame proof: missing
```

## Complete kit and service inventory

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
procedural-creature-body-kit: recipe, geometry, topology, skeleton, skinning,
  collision, hashes, poses and snapshots
instanced-render-batch-kit: cell replacement/release, flush, overflow, bounds,
  statistics and snapshots
seeded-world-patch-controller-kit: patch identity, focus, membership, cache,
  queue, executor, delivery, budgets, eviction, reset and snapshots
camera-smooth-follow-kit: damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit: run, input, movement, route, surface, score,
  shard mutation, outcomes, events, transitions, creature and snapshot
player-character-schema-kit: defaults, normalization, clamps, colors and merge
player-character-profile-store-kit: load, save, patch, reset, revisions,
  storage events, BroadcastChannel, subscribe and close
menu-page-kit: profile projection and routes
character-creator-page-kit: controls, draft, delayed save, reset,
  remote synchronization, showcase, resize and RAF
character-preview-transition-kit: descriptor target, morph, crossfade,
  pose damping, revision and disposal
three-procedural-creature-adapter-kit: SkinnedMesh, pose, geometry,
  materials, opacity and disposal
game-page-entry-kit: browser runtime loading
drunk-route-generator: samples, nearest query, progress, classification and snapshot
player-raptor-preset-kit: creature recipe and capsule collision
prehistoric-patch-generator: terrain, trees, grass, shards, colliders,
  bounds and transferables
prehistoric-patch-worker: initialization, generation, protocol and delivery
```

### External and host boundaries

```txt
Three runtime: scene, geometry, materials, instancing, camera, lighting,
  resizing and rendering
rapier-physics-domain-kit: world bridge, actor, colliders, step, contacts and reset
Rapier runtime: bodies, colliders, queries and world step
message Worker executor: request correlation and asynchronous generation
active-content adapter: patch membership, shard/collider projection and height
creator viewport adapter: bounds, target and distance
creator persistence scheduler: timer replacement and profile patch commit
creature/camera/render host adapters: creature, collision, pickup scan,
  camera, lighting, HUD and host readback
```

## Source-backed findings

### Collection admission is weaker than the run phase

`collectShard(shardId)` checks only whether the ID already exists. It does not require `status === "game"`, an active run ID, expected state revision, active patch membership, a known descriptor or spatial evidence. Any first-time value, including an unknown or malformed value, increments the shard count.

### Public ownership makes the weak API reachable

`PrehistoricRushHost` exposes the raw engine, and the installed game API remains reachable through that owner. The normal loop calls collection only during gameplay, but the service itself is not phase-closed.

### Identity is not source-versioned

Shard IDs contain only patch coordinates and local index. They omit world seed, generator version, patch cache key, terrain/vegetation settings, runtime generation and run ID. The same ID can outlive a descriptor-policy change without proving it still identifies the same authored object.

### Evidence comes from a mutable projection

The frame updates streaming immediately before collision and pickup checks. `view.pickups` can gain or lose descriptors in that same frame. No immutable pickup-set revision is captured for collection admission.

### Proximity is two-dimensional

The collection test compares only X and Z. Player Y, jump height, shard Y, collision volume and a maximum vertical separation are not part of evidence.

### Gameplay commit and presentation are uncorrelated

State and event mutation happen before `refreshDynamicContent()`. The rebuild has no typed result, and the next render/HUD projection has no collection result ID or revision. No receipt proves the shard disappeared and the count changed in the same visible frame.

### The event is insufficient for replay or diagnostics

`ShardCollected` carries run ID, shard ID and total count, but not command ID, patch ID, descriptor fingerprint, player pose, distance, pickup-set revision, before/after state revision or rendered-frame acknowledgement.

## Required parent domain

```txt
prehistoric-rush-shard-collection-authority-domain
```

Candidate coordinating kits:

```txt
shard-descriptor-schema-kit
shard-identity-kit
shard-source-fingerprint-kit
active-shard-index-kit
active-shard-set-revision-kit
shard-collection-command-kit
shard-collection-command-id-kit
shard-collection-evidence-kit
shard-run-phase-admission-kit
shard-patch-membership-admission-kit
shard-spatial-admission-kit
shard-collection-idempotency-kit
shard-collection-state-revision-kit
shard-collection-commit-kit
shard-collection-result-kit
shard-collected-event-envelope-kit
shard-removal-projection-kit
shard-projection-result-kit
shard-frame-acknowledgement-kit
shard-observation-kit
shard-journal-kit
legacy-collect-shard-adapter-kit
unknown-shard-fixture-kit
vertical-separation-fixture-kit
stale-patch-shard-fixture-kit
duplicate-collection-fixture-kit
terminal-collection-fixture-kit
shard-visible-frame-smoke-kit
```

## Required transaction

```txt
ShardCollectionCommand
  -> validate runtime generation, run ID, run phase and expected state revision
  -> resolve canonical shard identity in the active shard index
  -> validate patch ID, activation revision and source fingerprint
  -> capture authoritative player and shard transforms once
  -> validate 3D collection volume and vertical separation
  -> return the previous receipt for an accepted duplicate
  -> atomically commit collected identity, shard count, state revision and event
  -> project the committed result into shard instances and HUD
  -> collect typed consumer acknowledgements
  -> acknowledge the first visible frame containing both shard absence and new count
  -> publish detached result, observation and bounded journal row
```

Rejected, stale, unknown, out-of-range, paused or terminal commands must perform zero mutation and emit no collection event.

## Required proof

```txt
unknown IDs cannot increase score
collection is rejected outside the active run phase
stale patch or pickup-set revisions cannot collect
vertical separation is enforced by an explicit policy
one shard identity awards exactly once per run
accepted duplicate commands return the prior receipt without mutation
collection event and state revision agree
visual removal and HUD count cite the same collection result
reset creates a new run-scoped collection ledger
public host cannot bypass admission
first visible frame acknowledges the committed result
```

## Ordered implementation queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Render Surface Resolution and Frame Correlation
1. Route Artifact and Game Profile Handoff
2. Character Creator Draft, Commit and Preview Frame Authority
3. Patch Activation and Release Commit Authority
3a. Shard Identity, Collection Commit and Visible Removal Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration and Terminal Frame Authority
6. Stream Cadence and Time Budget Authority
7. World Readiness and Movement Admission
8. Committed Gameplay Frame and Read Model
8a. Public Host Capability Gateway
9. Coordinated Run/Stream/Worker/Collider/Frame Reset
10. Runtime Lifecycle and Ordered Disposal
```

Shard authority follows patch activation because collection must consume a committed active descriptor set. It precedes general run-step outcome arbitration because pickup awards are one of the competing same-frame gameplay effects.

## Validation boundary

```txt
runtime source changed: no
gameplay behavior changed: no
shard generation changed: no
score behavior changed: no
render behavior changed: no
physics behavior changed: no
package scripts changed: no
dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
browser or Pages smoke: not run
shard fixtures: not implemented
```
