# Project Breakdown: Authoritative Run Start/Restart Authority

**Timestamp:** `2026-07-12T09-01-44-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Repository revision reviewed:** `8bcd73f92990284819b8b4af07c385c978835d2b`

## Summary

Eleven commits after the previous documentation head added Nexus Engine core simulation, product outcome resolution, physics/fallback observations, committed terminal transitions, pure precedence tests and corrected runtime pins. The previous collision/goal/pickup ordering defect is materially addressed.

Initial start and retry remain browser-host transactions. They replace resources, reset resolution, emit and transition synchronously, then refresh content, streaming and camera separately. There is no run epoch, participant barrier, rollback or first-frame proof.

## Plan ledger

**Goal:** make initial start and retry one admitted transaction that atomically establishes a run epoch across every stateful consumer.

- [x] Compare all ten Publish repositories and central ledgers.
- [x] Exclude `TheCavalryOfRome`.
- [x] Avoid active AetherVale and TheOpenAbove documentation work.
- [x] Select only PrehistoricRush due to newer undocumented runtime work.
- [x] Review the changed domain, policy, host, runtime versions, HTML pins, package and test.
- [x] Identify interaction loops, domains, kits and services.
- [x] Record implemented and missing authorities.
- [x] Add timestamped audits.
- [x] Make documentation-only changes.
- [x] Create no branch or pull request.
- [ ] Implement and execute fixtures.

## Complete interaction loops

```txt
menu
  -> load persisted profile
  -> creator or game route
creator
  -> edit normalized draft
  -> procedural creature preview
  -> save/synchronize profile
  -> transition to game
runtime boot
  -> load pinned Nexus Engine, kits, Three and Rapier
  -> compose 13 core + 5 official + product domain
  -> install Rapier provider and player body
  -> create patch controller, camera and renderer
  -> direct game.start and center prime
browser input
  -> held left/right/boost state and jump edge
  -> patch product input before tick
engine tick
  -> clone and propose next run state
  -> submit kinematic motion
  -> propose pickups and goal
  -> observe Rapier and fallback collision
  -> resolve one continue/fail/win outcome
  -> commit resource patch, events and transition
host frame
  -> remove accepted pickups
  -> update patch streaming/materialization
  -> render player, terrain, vegetation and shards
  -> update HUD and public host state
retry
  -> direct game.start
  -> refresh content
  -> update/prime streaming
  -> reset camera
  -> next engine tick later
```

## Domains in use

```txt
page routing and profile lifecycle
creator schema, draft, persistence, preview and transition
pinned runtime graph, import maps and CDN module loading
core input, spatial, scene, physics, simulation, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
seed, procedural creature, instanced batches, patch controller and camera follow
product run, route, surface, movement, proposal and outcome policy
Rapier body, motion request, step, contact and fallback collision
Worker/fallback patch generation and controller scheduling
terrain slots, tree cells, grass, shards, pickups and collider materialization
camera, creature pose, Three rendering, HUD and host readback
Node policy proof, static hosting and Pages
run-start/restart epoch and cross-consumer reset authority: missing
```

## Kits and offered services

### Nexus Engine core: 13

```txt
core-input-kit: actions, bindings and input state
core-spatial-kit: transforms and spatial queries
core-scene-kit: scene registry, direct transitions and host descriptors
core-physics-kit: provider, bodies, colliders, motion requests, step and frame
core-simulation-kit: TickContext proposals, observations, resolution, resource/event/transition commit and committed frame
core-motion-kit: motion capability
core-camera-kit: camera capability
core-animation-kit: animation capability
core-graphics-kit: graphics/frame capability
core-skybox-kit: sky descriptor
core-ui-kit: UI capability/projection
core-diagnostics-kit: diagnostics/readback
core-composition-kit: composition metadata/capability graph
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic seed and streams
procedural-creature-body-kit: descriptor, geometry, skeleton, skinning, collision, pose and snapshot
instanced-render-batch-kit: cell replacement/release, flush, overflow, bounds and stats
seeded-world-patch-controller-kit: focus, membership, queue, cache, generation, delivery, eviction and snapshot
camera-smooth-follow-kit: damped follow, reset, teleport handling and snapshot
```

### Product/page/Worker: 13

```txt
prehistoric-rush-domain-kit: run resources, input, movement proposals, observation registration, events, transitions and snapshot
prehistoric-rush-resolution-policy: collision/pickup/goal precedence and serializable commit plan
player-character-schema-kit: defaults, normalization, clamps and merge
player-character-profile-store-kit: load/save/patch/reset/revision/storage synchronization
menu-page-kit: menu/profile projection and routes
character-creator-page-kit: controls, draft, persistence, preview and RAF
character-preview-transition-kit: descriptor target, morph, crossfade, pose damping and disposal
three-procedural-creature-adapter-kit: SkinnedMesh, materials, pose and disposal
game-page-entry-kit: browser runtime entry
drunk-route-generator: samples, nearest point, progress, classification and snapshot
player-raptor-preset-kit: creature recipe and collision capsule
prehistoric-patch-generator: terrain, trees, grass, shards, colliders, bounds and transferables
prehistoric-patch-worker: initialization, generation, request/error protocol and transfer
```

### External/host adapters: 9

```txt
Three runtime: scene, geometry, materials, instancing, camera, lighting, resize and render
rapier-physics-domain-kit: Nexus provider bridge
Rapier runtime: rigid bodies, colliders, queries and world step
message Worker executor: request correlation and async generation
active-content consumer: terrain, trees, grass, shards, pickups, colliders and height
creator viewport framing: bounds, target and distance
creator persistence scheduler: timer replacement and profile commit
browser input adapter: keyboard, buttons, keyup, blur and product input patches
creature/camera/render host adapters: pose, collision sample, pickup scan, camera, HUD and readback
```

### Proof: 1

```txt
prehistoric-rush-resolution-policy-test-kit:
  continue, win, collision, collision-over-goal, collision-over-pickup,
  pickup-plus-goal, duplicate pickup, fallback collision and serialization proof
```

## Implemented outcome transaction

```txt
TickContext
  -> deterministic proposals
  -> physics/fallback observations
  -> versioned product policy
  -> one state patch
  -> ordered event bundle
  -> optional terminal transition
  -> committed simulation frame
```

## Missing start transaction

```txt
RunStartCommand
  -> predecessor/run admission
  -> new run epoch
  -> prepare run/input/simulation/physics/stream/content/camera/scene resets
  -> collect participant results
  -> atomic commit or rollback
  -> first committed tick
  -> first visible frame
  -> compatible public readback
```

## Candidate kits

```txt
prehistoric-rush-run-start-restart-authority-domain
run-start-command-kit
run-start-command-id-kit
run-epoch-kit
run-start-predecessor-admission-kit
run-state-reset-plan-kit
run-input-reset-plan-kit
simulation-resolution-reset-plan-kit
physics-body-reset-plan-kit
stream-reset-adoption-plan-kit
active-content-reset-plan-kit
camera-reset-plan-kit
scene-transition-reset-plan-kit
run-start-prepare-kit
run-start-participant-result-kit
run-start-commit-kit
run-start-rollback-kit
stale-run-start-result-rejection-kit
run-start-result-kit
run-start-observation-kit
run-start-journal-kit
first-run-tick-ack-kit
first-run-visible-frame-ack-kit
initial-start-retry-parity-fixture-kit
run-start-participant-failure-fixture-kit
browser-authoritative-restart-smoke-kit
```

## Validation

```txt
runtime source changed: no
package/test source changed: no
physics/streaming/render behavior changed: no
branch or pull request: no
existing npm test inspected: yes
commands executed: no
```
