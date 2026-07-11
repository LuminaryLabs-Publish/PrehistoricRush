# Current Audit: PrehistoricRush Player Profile Handoff Authority

**Updated:** `2026-07-11T10-58-10-04-00`

## Summary

`PrehistoricRush` now has a menu page runtime, a character-creator runtime, a shared player-character profile schema and a browser profile store. The current root route was changed from the game to the menu. The new architecture is not complete: `game.html` and `charactercreator.html` are absent, and `src/game.js` does not consume the saved profile.

The product currently presents a customizable raptor feature whose navigation and gameplay handoff are not authoritative. The correct next boundary is a versioned page manifest plus an atomic player-profile commit and binding result shared by the creator, menu, procedural creature descriptor, Rapier collision and rendered frame.

## Plan ledger

**Goal:** catalogue the complete current product and define one profile and route authority without losing the previously documented patch-streaming and visual-policy priorities.

- [x] Reconcile the accessible Publish inventory with the central ledger.
- [x] Confirm all eligible repositories have root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Inspect the six new runtime commits that introduced the schema, store and page runtimes.
- [x] Inspect current menu links and current 3D game boot.
- [x] Identify all interaction loops, domains, kits and services.
- [x] Record route, persistence, sync, draft, binding and frame gaps.
- [x] Preserve patch activation and visual identity as downstream gates.
- [ ] Implement route/profile fixtures after this documentation pass.

## Selection audit

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledgers: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
reason: substantive multi-page/profile runtime changes postdate the previous audit
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Source graph

```txt
NexusEngine:           e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits:      d6630367d557782d9ec965947aeb1c197d37ea15
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js:              0.179.1
Rapier:                 0.15.0
profile schema:         prehistoric-rush.character.v1
storage key:            prehistoric-rush:character:v1
broadcast channel:      prehistoric-rush:character
parent game domain:     prehistoric-rush-domain-kit 0.5.0
```

## Current interaction loops

### Entry/menu loop

```txt
index.html or menu.html
  -> src/pages/menu.js
  -> loadPlayerCharacterProfile()
  -> render profile color, scale, tail and revision
  -> subscribePlayerCharacterProfile()
  -> Start Run -> ./game.html
  -> Character Creator -> ./charactercreator.html
```

Both destination HTML files are absent on `main`.

### Character creator loop

```txt
intended HTML host
  -> src/pages/character-creator.js
  -> load profile into draft
  -> render numeric controls, colors, CSS silhouette and JSON
  -> input mutates draft
  -> clear prior timer
  -> schedule 140 ms save
  -> patchPlayerCharacterProfile(final patch)
  -> localStorage setItem
  -> BroadcastChannel message
  -> local listeners
  -> remote storage/broadcast event can replace draft
```

### Game loop

```txt
intended game.html
  -> src/pages/game.js
  -> src/game.js
  -> resolve pinned runtime modules
  -> install core and official kits
  -> create prehistoric-rush-domain-kit
  -> game.getPlayerBody() from static player-raptor-preset-kit
  -> create Rapier actor and Three skinned creature
  -> start run, patch streaming and smooth camera
  -> input, tick, world activation, collision, pose and render
  -> HUD and PrehistoricRushHost projection
  -> RAF
```

The game loop never imports the profile schema or store.

## Domains in use

```txt
browser route and page artifact hosting
menu navigation and profile projection
player-character schema versioning
profile defaults, normalization, clamping and deep merge
localStorage profile persistence
profile revision and updated-time mutation
BroadcastChannel synchronization
storage-event synchronization
creator draft state and debounce scheduling
creator numeric and color controls
creator CSS preview and JSON projection
Nexus Engine module graph and core composition
seed and deterministic random streams
procedural creature recipe, geometry, topology, skeleton and skinning
creature collision, bounds, pose and Three binding
Rapier actor, collider, transform and contacts
seeded patch controller, Worker and multi-consumer world activation
terrain, trees, grass, pickups, colliders and height sampling
run lifecycle, route, movement, jump, score and outcomes
camera target and smooth follow
lighting, shadows, grass wind and Three render submission
HUD, public host, lifecycle, static deployment and validation
```

## Complete kit inventory and services

### New source-backed product kits

```txt
player-character-schema-kit
  PLAYER_CHARACTER_SCHEMA_VERSION
  default profile creation
  profile normalization
  numeric clamping
  color validation
  nested profile merge

player-character-profile-store-kit
  load from localStorage
  save normalized profile
  monotonic-looking local revision increment
  patch and reset
  local listener subscription
  storage-event synchronization
  BroadcastChannel synchronization
  channel/listener close

menu-page-kit
  menu shell
  active-profile projection
  profile subscription
  game and creator navigation links

character-creator-page-kit
  draft profile ownership
  slider and color controls
  CSS silhouette preview
  JSON projection
  140 ms debounce
  patch save
  reset
  remote profile projection

game-page-entry-kit
  one-line import of the existing 3D game runtime
```

### Nexus Engine core kits

```txt
core-input-kit         actions, bindings and input state
core-spatial-kit       transforms and spatial queries
core-scene-kit         scene registry and transitions
core-physics-kit       physics provider contract
core-motion-kit        motion capability
core-camera-kit        camera capability
core-animation-kit     animation capability
core-graphics-kit      graphics and frame capability
core-skybox-kit        sky descriptor
core-ui-kit            UI capability and projection
core-diagnostics-kit   diagnostics and readback
core-composition-kit   capability graph and composition metadata
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit 0.1.0
  recipe normalization, geometry, topology, skeleton, skinning,
  attachments, collision recommendation, bounds, poses, registry,
  content hash, snapshot, load and reset

instanced-render-batch-kit
  capacity, cell replace/release, flush, overflow, bounds and snapshots

seeded-world-patch-controller-kit 0.1.0
  patch/cache identity, focus, active/retain/prefetch sets, queue,
  executor handoff, ready/release delivery, budgets and eviction

camera-smooth-follow-kit 0.1.0
  position/look damping, quaternion damping, reset, teleport handling,
  delta clamp, transform access and snapshots
```

### Existing product, external and host kits

```txt
prehistoric-rush-domain-kit
  run lifecycle, input, route, surface, score, outcomes, creature access,
  events, scene transitions and snapshot

drunk-route-generator
  deterministic samples, nearest query, progress, region and snapshot

player-raptor-preset-kit
  static product creature recipe and collision configuration

prehistoric-patch-generator / prehistoric-patch-worker
  deterministic terrain, trees, grass, pickups, colliders, transferables,
  Worker initialization, generation and error protocol

rapier-physics-domain-kit / rapier-runtime-module
  world bridge, actor, fixed colliders, transforms, step and contacts

three-runtime-module
  scene graph, geometry, instancing, skinning, camera, lights, fog,
  shadows and rendering

module-worker-executor-adapter-kit
terrain-slot-consumer-kit
tree-instance-batch-consumer-kit
grass-patch-consumer-kit
shard-pickup-consumer-kit
patch-collider-consumer-kit
patch-height-sampler-kit
three-procedural-creature-adapter-kit
creature-descriptor-admission-kit
creature-geometry-binding-kit
creature-skeleton-binding-kit
creature-collision-binding-kit
creature-pose-binding-kit
prehistoric-camera-target-policy-kit
three-camera-transform-consumer-kit
camera-light-render-adapter-kit
shadow-map-policy-kit
shadow-camera-policy-kit
shadow-caster-policy-kit
grass-card-geometry-policy-kit
grass-alpha-shader-policy-kit
grass-palette-policy-kit
patch-streaming-hud-kit
browser-frame-loop-kit
prehistoric-rush-host-readback-kit
```

## Main findings

### 1. The root route no longer reaches the game

`index.html` now loads `src/pages/menu.js`. Its two primary actions target `game.html` and `charactercreator.html`, but neither file exists on `main`. The existing game runtime remains present yet is no longer reachable through the published entry flow.

### 2. Saved profiles are not gameplay inputs

The creator states that the game reads the latest profile when a run starts. `src/game.js` does not import the store and continues to call `game.getPlayerBody()`, which is derived from `player-raptor-preset-kit` during domain construction.

### 3. Profile revision is not a cross-context authority

Each tab loads the previous value and calculates its own next revision. Concurrent writers can publish the same revision with different payloads. There is no compare-and-swap, writer identity, transaction ID, canonical profile fingerprint or conflict result.

### 4. Debounced edits can lose cross-group changes

The creator updates the in-memory draft for every input, but the surviving timer persists only its captured `patch`. Rapid edits in different groups can leave the preview showing both changes while storage receives only the final group patch.

### 5. Persistence effects are untyped

`localStorage.setItem()` can throw, but save has no typed accepted/rejected result, no rollback and no durable-vs-projected status. The UI displays `Saved revision ...` only after a synchronous return, but cannot distinguish authoritative commit, cross-tab conflict or later overwrite.

### 6. Synchronization and lifecycle are incomplete

Menu and creator subscriptions are not released. The module-scoped BroadcastChannel remains open unless `closePlayerCharacterProfileStore()` is explicitly called, which neither page does. Storage and broadcast notifications can also duplicate one logical update.

### 7. Preview, physics and rendered frame do not share identity

The creator preview is a CSS silhouette, not the procedural creature descriptor. The game, Rapier collision and Three frame expose no accepted profile revision or fingerprint, so profile appearance, collision and rendered evidence cannot be correlated.

### 8. Previous runtime gates remain open

Patch delivery still becomes controller-active before all world consumers acknowledge a shared commit. Visual-policy identity, run/session epochs and ordered disposal also remain unresolved.

## Required authority boundary

```txt
PrehistoricRush Player Character Profile Authority Domain
  route-manifest-kit
  page-artifact-admission-kit
  player-profile-schema-kit
  player-profile-fingerprint-kit
  profile-load-result-kit
  profile-write-command-kit
  profile-write-result-kit
  profile-revision-authority-kit
  profile-conflict-resolution-kit
  creator-draft-transaction-kit
  profile-cross-context-sync-kit
  game-profile-admission-kit
  profile-to-creature-descriptor-kit
  profile-to-collision-binding-kit
  profile-render-binding-result-kit
  profile-frame-receipt-kit
  profile-observation-kit
  profile-lifecycle-kit
  route-profile-fixture-kit
```

## Priority order

```txt
P0 Multi-Page Route Admission + Player Profile Handoff Authority
P1 Seeded Patch Activation Commit Authority
P2 Visual Policy Graph Identity + Render-Frame Correlation
P3 Run Session Reset + Shared Epoch Authority
P4 Worker Quarantine + Ordered Runtime Disposal
```

No runtime code was changed by this audit.
