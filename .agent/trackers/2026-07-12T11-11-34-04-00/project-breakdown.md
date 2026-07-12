# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-12T11-11-34-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Reviewed revision:** `6430c623d4e1fa5afb7ed460d5d1624799fbe65d`  
**Scope:** documentation-only architecture, interaction, render, gameplay, streaming and deployment audit

## Plan ledger

**Goal:** identify the exact streamed-content snapshot used by each gameplay outcome and require the rendered frame to prove it presents that same snapshot.

- [x] Compare the complete Publish repository inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have a central ledger and root `.agent` state.
- [x] Select only `PrehistoricRush`.
- [x] Review current runtime, pinned source graph, product domain, outcome policy, streaming adapter and rendering order.
- [x] Identify all interaction loops, domains, kits and offered services.
- [x] Define the missing streamed-content/outcome parity authority.
- [x] Add a new timestamped audit family.
- [x] Push documentation directly to `main` without a branch or pull request.
- [ ] Implement the authority and executable browser/Pages fixtures.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush   prior central update 2026-07-12T09-01-44-04-00
TheOpenAbove      prior central update 2026-07-12T09-02-10-04-00
IntoTheMeadow     prior central update 2026-07-12T09-21-40-04-00
PhantomCommand    prior central update 2026-07-12T09-28-05-04-00
HorrorCorridor    prior central update 2026-07-12T09-48-15-04-00
ZombieOrchard     prior central update 2026-07-12T10-09-07-04-00
MyCozyIsland      prior central update 2026-07-12T10-20-02-04-00
TheUnmappedHouse  prior central update 2026-07-12T10-30-00-04-00
AetherVale        prior central update 2026-07-12T10-48-19-04-00
```

`PrehistoricRush` was the oldest eligible central entry and had runtime, pin and module-admission commits after that audit. Only this Publish repository was modified.

## Complete interaction loops

### Menu and profile

```txt
menu page
  -> load persisted character profile
  -> project profile summary
  -> route to creator or gameplay
```

### Character creator

```txt
load normalized profile
  -> edit procedural creature parameters
  -> update preview mesh and pose
  -> schedule profile persistence
  -> navigate into gameplay
```

### Game startup

```txt
game page entry
  -> preflight Nexus Engine, five official kits, Three, Rapier and Rapier ProtoKit
  -> report the first failed module
  -> import game host
  -> create 13 core kits, 5 official kits and product domain
  -> install Rapier provider and dino body
  -> create patch controller, camera follow and Three adapter
  -> register pickup and fallback-collision samplers
  -> start run
  -> prime center patch
  -> reset camera
```

### Gameplay frame

```txt
browser input
  -> patch steer, boost and jump state
  -> engine.tick(dt)
     -> clone and advance run state
     -> sample pickup IDs from current adapter view
     -> submit dino kinematic motion request
     -> submit run-state, pickup and goal proposals
     -> step Rapier against current synced collider set
     -> sample fallback collision from current adapter collider set
     -> resolve collision, pickups and goal
     -> commit state, events and optional terminal transition
  -> read committed state and frame
  -> remove accepted pickups from visible content
  -> update patch-controller focus
  -> release patches and rebuild active content
  -> pump Worker/fallback generation
  -> activate at most one ready patch and rebuild active content
  -> synchronize the resulting collider set to core physics
  -> render creature, terrain, vegetation, pickups and camera
  -> update HUD and public host readback
```

### Retry

```txt
button, Enter or Space while terminal
  -> direct game.start()
  -> refresh content
  -> update and prime streaming
  -> reset camera
  -> wait for the next committed gameplay tick
```

## Domains in use

```txt
page routes, profile and character creator
runtime source identity, module preflight, pinned imports and failure projection
core input, spatial, scene, physics, simulation, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
seed, procedural creature, instanced rendering, patch control and smooth camera follow
product run, route, surface, score, proposals, observations, outcome policy, events and transitions
Worker and deferred-fallback patch generation
patch membership, queue, cache, release, delivery and activation
terrain-slot, tree-cell, grass-instance, shard, pickup and collider materialization
Rapier provider, kinematic body, motion requests, world step and contacts
fallback collision and pickup proximity sampling
Three scene, creature skinning/pose, camera, lighting and rendering
HUD and public committed-state readback
Node policy validation, static build and Pages deployment
streamed-content revision, admission, atomic commit, rollback and visible-frame parity: missing
```

## Implemented kits and offered services

### Nexus Engine core kits: 13

| Kit | Offered services |
|---|---|
| `core-input-kit` | Actions, bindings and input state |
| `core-spatial-kit` | Transforms and spatial queries |
| `core-scene-kit` | Scene registry, transitions and host descriptor |
| `core-physics-kit` | Provider, bodies, colliders, motion requests, stepping and frame readback |
| `core-simulation-kit` | Tick context, proposals, observations, resolution policy, atomic state/event/transition commit and committed frame |
| `core-motion-kit` | Motion capability |
| `core-camera-kit` | Camera capability |
| `core-animation-kit` | Animation capability |
| `core-graphics-kit` | Graphics and frame capability |
| `core-skybox-kit` | Sky descriptor |
| `core-ui-kit` | UI capability and projection |
| `core-diagnostics-kit` | Diagnostics and readback |
| `core-composition-kit` | Composition metadata and capability graph |

### Official NexusEngine-Kits: 5

| Kit | Offered services |
|---|---|
| `seed-kit` | Deterministic seed and random streams |
| `procedural-creature-body-kit` | Descriptor, geometry, skeleton, skinning, collision, pose and snapshot |
| `instanced-render-batch-kit` | Cell replacement/release, flush, overflow, bounds and statistics |
| `seeded-world-patch-controller-kit` | Focus, membership, queue, cache, generation, delivery, eviction and snapshot |
| `camera-smooth-follow-kit` | Damping, reset, teleport handling and snapshot |

### Product, page and Worker kits: 13

| Kit | Offered services |
|---|---|
| `prehistoric-rush-domain-kit` | Run resources, input, movement proposals, observation registration, events, transitions and snapshot |
| `prehistoric-rush-resolution-policy` | Collision/pickup/goal precedence, state patch, events and transition |
| `player-character-schema-kit` | Defaults, normalization, clamps and merge |
| `player-character-profile-store-kit` | Load, save, patch, reset, revision and storage synchronization |
| `menu-page-kit` | Menu shell, profile projection and routes |
| `character-creator-page-kit` | Controls, draft, persistence, preview and RAF |
| `character-preview-transition-kit` | Morph, crossfade, pose damping, revision and disposal |
| `three-procedural-creature-adapter-kit` | Skinned mesh, materials, pose and disposal |
| `game-page-entry-kit` | Module preflight, failure projection and game import |
| `drunk-route-generator` | Samples, nearest point, progress, classification and snapshot |
| `player-raptor-preset-kit` | Creature recipe and collision capsule |
| `prehistoric-patch-generator` | Terrain, trees, grass, shards, colliders, bounds and transferables |
| `prehistoric-patch-worker` | Initialization, generation, request/error protocol and transfer |

### External and host adapters: 9

| Adapter | Offered services |
|---|---|
| `three-runtime-module` | Scene, geometry, materials, instancing, camera, lighting and render |
| `rapier-physics-domain-kit` | Nexus Engine physics-provider bridge |
| `rapier-runtime-module` | Bodies, colliders, queries and world stepping |
| `message-worker-executor-adapter-kit` | Request correlation and asynchronous generation |
| `active-content-consumer-adapter` | Terrain, trees, grass, shards, pickups, colliders and height sampling |
| `creator-viewport-framing-adapter` | Bounds, target and camera distance |
| `creator-persistence-scheduler` | Timer replacement and profile commit |
| `browser-input-adapter` | Keyboard, button, keyup, blur and product input patch |
| `creature-camera-render-host-adapters` | Pose, collision sampling, pickup scan, camera, HUD and readback |

### Proof kit: 1

| Kit | Offered services |
|---|---|
| `prehistoric-rush-resolution-policy-test-kit` | Continue, win, collision, precedence, pickup idempotency, fallback and serialization proof |

```txt
implemented/adapted/proof total: 41
```

## Main finding

The outcome tick consumes the previous host-frame pickup and collider sets. Streaming then releases and activates patches, rebuilds visible instances, replaces the physics collider set and renders. No identity proves that the committed outcome and rendered frame refer to the same content.

```txt
released collider after tick
  -> can commit failure
  -> can be absent from the frame shown to the player

activated collider or pickup after tick
  -> can appear in the frame
  -> was absent from that tick's collision or pickup admission
```

## Required parent domain

```txt
prehistoric-rush-streamed-content-outcome-parity-authority-domain
```

Candidate composition:

```txt
active-content-revision-kit
active-patch-set-digest-kit
collider-set-digest-kit
pickup-set-digest-kit
stream-generation-kit
active-content-snapshot-kit
stream-delta-command-kit
stream-delta-admission-kit
content-prepare-plan-kit
content-participant-result-kit
content-observation-context-kit
physics-content-observation-kit
fallback-content-observation-kit
pickup-content-observation-kit
mixed-content-revision-rejection-kit
outcome-content-provenance-kit
content-physics-commit-kit
content-physics-rollback-kit
stale-worker-content-rejection-kit
content-parity-observation-kit
content-parity-journal-kit
visible-content-frame-ack-kit
released-collider-false-positive-fixture-kit
activated-content-false-negative-fixture-kit
browser-stream-outcome-parity-smoke-kit
```
