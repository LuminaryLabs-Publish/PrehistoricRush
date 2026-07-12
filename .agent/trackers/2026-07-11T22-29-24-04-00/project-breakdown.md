# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-11T22-29-24-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

All ten accessible `LuminaryLabs-Publish` repositories were compared with `LuminaryLabs-Dev/LuminaryLabs`. All nine eligible non-Cavalry repositories were tracked and had root `.agent` state, so the oldest documented-selection fallback selected only `PrehistoricRush`.

The main finding is that `globalThis.PrehistoricRushHost` is presented as diagnostics but exports the live mutable `engine`, `physics`, Three adapter, patch controller and camera-follow service. Any same-page script or automation can bypass gameplay, streaming, collider, frame and lifecycle admission by directly invoking these owners. Its `getState()` method also samples them independently rather than returning one committed read model.

## Plan ledger

**Goal:** replace the raw mutable browser host with one read-only committed observation surface and a separate typed command gateway whose mutations are identity-, epoch- and capability-admitted.

- [x] Compare the full Publish inventory against the central ledger.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger entries and root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible repository.
- [x] Trace menu, creator, game, input, simulation, streaming, physics, rendering, HUD and host readback loops.
- [x] Identify all active domains.
- [x] Preserve the complete kit and service inventory.
- [x] Inspect the public `PrehistoricRushHost` object and the methods exposed through each raw owner.
- [x] Define a host-capability gateway, read model and fixture boundary.
- [x] Add timestamped architecture and system audits.
- [x] Refresh required root `.agent` state.
- [x] Push documentation only to `main` with no branch or pull request.
- [ ] Runtime implementation and executable host-isolation fixtures remain future work.

## Selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush    2026-07-11T21-00-00-04-00 selected
TheOpenAbove       2026-07-11T21-08-57-04-00
HorrorCorridor     2026-07-11T21-21-12-04-00
PhantomCommand     2026-07-11T21-31-19-04-00
ZombieOrchard      2026-07-11T21-40-49-04-00
TheUnmappedHouse   2026-07-11T21-48-44-04-00
AetherVale         2026-07-11T22-02-01-04-00
IntoTheMeadow      2026-07-11T22-08-13-04-00
MyCozyIsland       2026-07-11T22-20-00-04-00
TheCavalryOfRome   excluded
```

## Interaction loops

### Menu and creator

```txt
menu
  -> load durable character profile
  -> route to character creator or game

creator
  -> edit local draft
  -> generate procedural creature descriptor
  -> morph/crossfade shared Three.js SkinnedMesh
  -> debounce profile persistence
  -> render and project Saved/Ready state
```

### Gameplay

```txt
game.html
  -> load pinned Nexus Engine, kits, Three and Rapier
  -> load saved creature profile
  -> create game, patch controller, Worker executor, physics and camera
  -> create Three world adapter
  -> start run

RAF
  -> map held input
  -> engine.tick
  -> update patch focus, generation, release and activation
  -> move Rapier actor and step contacts
  -> resolve collision, pickups and outcome
  -> render Three scene
  -> update HUD
  -> request next frame
```

### Public host loop

```txt
startup completes
  -> assign globalThis.PrehistoricRushHost
  -> expose live engine
  -> expose live physics service
  -> expose live Three adapter
  -> expose live patch controller
  -> expose live camera-follow service
  -> expose getState() that samples each mutable owner independently
```

## Domains in use

```txt
static page routing and host artifacts
player-profile schema normalization persistence and cross-context synchronization
character creator draft persistence transition viewport and frame projection
pinned Nexus Engine NexusEngine-Kits ProtoKits Three and Rapier identity
Nexus Engine composition core capabilities and scene routing
procedural creature recipe descriptor topology skeleton skinning pose and collision
run lifecycle input movement route surface score pickup and terminal outcomes
seeded patch generation Worker protocol queue cache focus membership and delivery
terrain tree grass pickup collider and height consumers
Rapier actor fixed-collider world step contacts and reset
camera follow and gameplay view transforms
Three scene lighting shadows fog terrain instancing creature and render submission
HUD progress stream statistics and outcome controls
public browser host diagnostics commands and capability exposure
committed gameplay-frame and immutable read-model authority
run stream collider Worker frame and host-generation lifecycle
validation static hosting build and Pages deployment
```

## Complete kit inventory and services

### Nexus Engine core kits

```txt
core-input-kit: actions, bindings, input state
core-spatial-kit: transforms, spatial queries
core-scene-kit: scene registry, transitions, host descriptor
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
procedural-creature-body-kit: recipe normalization, descriptor, topology,
  geometry, skeleton, skinning, collision recommendation, hash, poses, snapshots
instanced-render-batch-kit: cell replacement/release, flush, overflow, bounds and stats
seeded-world-patch-controller-kit: patch identity, focus, desired membership,
  cache, queue, executor, generation, ready/release delivery, budgets, reset and snapshots
camera-smooth-follow-kit: position/look/quaternion damping, reset, teleport and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit: run lifecycle, input, route, surface, score,
  outcomes, events, transitions, creature and snapshot
player-character-schema-kit: defaults, normalization, clamps, color validation and merge
player-character-profile-store-kit: load, save, patch, reset, revision,
  localStorage, storage events, BroadcastChannel, subscribe and close
menu-page-kit: profile summary and route links
character-creator-page-kit: responsive controls, local draft, debounce save,
  reset, remote sync, showcase, resize and RAF
character-preview-transition-kit: descriptor targets, compatible morph,
  topology crossfade, pose damping, state and disposal
three-procedural-creature-adapter-kit: SkinnedMesh, pose, topology,
  geometry/material/scale damping, opacity and disposal
game-page-entry-kit: game runtime loading
drunk-route-generator: route samples, nearest query, progress, classification and snapshot
player-raptor-preset-kit: default recipe and capsule collision
prehistoric-patch-generator: terrain, trees, grass, pickups, colliders, bounds and transferables
prehistoric-patch-worker: initialization, generation, request/error protocol and delivery
```

### External and host adapters

```txt
Three runtime module: scene graph, geometry, materials, skinning, camera,
  lights, fog, shadows, resize and render
Rapier runtime and rapier-physics-domain-kit: world, actor, fixed colliders,
  transforms, step, contacts, snapshots and reset
message Worker executor adapter: asynchronous request correlation
active-content consumer adapter: patch render membership, height, pickups and colliders
creator viewport framing adapter: local bounds, target and camera-distance damping
creator persistence scheduler: debounce timer and partial-patch commit
creature/camera/render host adapters: gameplay creature, pose, camera, HUD and readback
PrehistoricRushHost adapter: raw live owners plus independently sampled diagnostics
```

## Source finding

The runtime publishes:

```txt
globalThis.PrehistoricRushHost = {
  engine,
  physics,
  adapter,
  patchController: controller,
  cameraFollow,
  versions,
  getState
}
```

The exported adapter includes mutating services such as `activatePatch`, `releasePatches`, `refreshDynamicContent`, `resetCamera` and `render`. The controller and physics services similarly expose reset, generation, collider and stepping operations. These are live owners, not immutable diagnostics.

`getState()` then separately calls:

```txt
game.snapshot()
controller.getSnapshot()
cameraFollow.getSnapshot()
engine.gameComposer
engine.coreScene host descriptor
```

There is no shared frame ID, run/stream/collider epoch, state fingerprint or commit receipt proving those samples describe one coherent visible frame.

## Required authority domain

```txt
prehistoric-rush-public-host-capability-authority-domain
```

Candidate coordinating kits:

```txt
host-session-identity-kit
host-capability-descriptor-kit
host-read-capability-kit
host-command-capability-kit
host-command-envelope-kit
host-command-admission-kit
host-run-epoch-fence-kit
host-owner-handle-quarantine-kit
host-committed-read-model-kit
host-frame-provenance-kit
host-command-result-kit
host-observation-journal-kit
legacy-host-compatibility-adapter-kit
host-mutation-isolation-fixture-kit
host-read-model-coherence-fixture-kit
host-stale-command-fixture-kit
```

## Required contract

```txt
public read path
  -> return immutable clone of last committed gameplay-frame record
  -> include run, stream, collider, Worker and frame epochs
  -> include profile and world-content fingerprints
  -> expose no mutable owner references

public command path
  -> accept a typed bounded command
  -> validate host session, run and expected epoch
  -> route through the owning domain
  -> return accepted/rejected/stale/duplicate/failure result
  -> journal result without exposing internal handles
```

## Validation boundary

Documentation only. Runtime source, dependencies, gameplay, Worker, physics, rendering and deployment were unchanged. Existing scripts and browser checks were not run.