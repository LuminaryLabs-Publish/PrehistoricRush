# Current Audit: PrehistoricRush Run / Stream Epoch Reset Authority

**Updated:** `2026-07-11T15-59-12-04-00`

## Summary

`game.start()` creates a fresh product `RunState`, but the browser host does not create a fresh runtime run. The seeded patch controller, Worker executor, active patch map, terrain slots, tree batches, grass instances, pickup projection, Rapier world, actor, fixed colliders, RAF and public host are created once in `main()` and reused across every Start, Retry and Run Again.

The reset boundary is therefore partial. Numeric `runId` changes in the game domain and the camera resets when it observes that number, but no shared run, stream, collider, Worker or frame epoch fences old work or proves that every consumer adopted the new run.

## Plan ledger

**Goal:** define one atomic reset transaction that transfers authority from a terminal or menu run to a fresh run while explicitly preserving reusable immutable cache data and retiring all run-scoped mutable projections.

- [x] Compare the full Publish inventory against central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Avoid active same-window work in `IntoTheMeadow`.
- [x] Select only `PrehistoricRush` as the oldest stable eligible repository.
- [x] Trace domain `start()`, browser `start()`, input, controller, Worker, consumers, physics, camera, RAF and host ownership.
- [x] Identify the interaction loop, domains, kits and services.
- [x] Identify a concrete retry pickup-projection failure.
- [x] Define epoch, reset, retirement, stale-work and first-frame contracts.
- [x] Add required root `.agent` outputs.
- [ ] Implement and validate the transaction.

## Repository selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or central-ledger-missing repositories: 0
root-.agent-missing repositories: 0
IntoTheMeadow: active same-window documentation commits
selected stable repository: PrehistoricRush
excluded repository: TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is changed in the Publish organization.

## Complete interaction loop

```txt
module boot
  -> load pinned Nexus Engine, Kits, ProtoKits, Three and Rapier
  -> create one engine and product domain graph
  -> create one Rapier world and dino actor
  -> create one patch generator, Worker executor and patch controller
  -> create one Three adapter and active consumer graph
  -> create one camera-follow instance
  -> start initial run and prime streaming
  -> install listeners, host and RAF

Start / Retry / Run Again
  -> game.start()
     -> initialRunState()
     -> runId = previous runId + 1
     -> status = game
     -> replace RunState and InputState
     -> emit RunStarted
     -> transition to game
  -> updateStreaming(state, true)
     -> reuse existing controller/cache/queue/Worker
     -> release or activate only changed membership
  -> resetCamera(state)
  -> existing RAF continues
```

## Concrete reset gap

`rebuildActiveContent(state)` is the only path that reconstructs pickup projection from `state.collectedShardIds`. It runs when a patch activates, releases, or a shard is collected.

On retry:

```txt
new RunState.collectedShardIds = []
active patch membership unchanged
controller emits no new activation or release
rebuildActiveContent() is not called
view.pickups and shard instances remain filtered by the previous run
```

A new run can therefore start without pickups that its own state says are uncollected.

## Additional retained state

```txt
external input booleans
controller desired/active/cache/queue state
in-flight Worker requests and responses
activePatches and terrainByPatch maps
tree batch cell membership
grass/shard instance buffers
view.colliders and view.pickups
Rapier world, actor, fixed bodies and colliders
camera-follow instance history until local reset
RAF callback generation
public host object and raw owner references
```

## Missing identities and results

```txt
runtimeSessionId
runSessionId distinct from mutable numeric runId
runEpoch
streamEpoch
colliderEpoch
workerGeneration
frameEpoch
ResetRunCommand
ResetRunPlan
ResetRunResult
consumer retirement acknowledgements
stale Worker/contact/frame rejection
first committed new-run frame acknowledgement
```

## Domains in use

```txt
route/page/profile authority
module graph identity and pinned CDN loading
Nexus Engine kit composition
run simulation and scene transitions
route, surface and terrain height
procedural creature body and animation
seeded patch generation and Worker execution
patch scheduling, cache and membership
terrain, tree, grass, pickup, collider and height projection
Rapier actor, fixed-collider and contact runtime
collision and terminal-outcome admission
camera reset and smooth follow
Three scene/resources/rendering
HUD, buttons and public diagnostics
run/stream/collider/frame epoch authority: missing
atomic reset and stale-work rejection: missing
fixtures and Pages deployment
```

## Complete kit inventory and services

### Nexus Engine core

```txt
core-input-kit
  actions, bindings, input state

core-spatial-kit
  transforms and spatial query contract

core-scene-kit
  scene registry, transitions and host descriptor

core-physics-kit
  physics-provider capability

core-motion-kit
  motion capability

core-camera-kit
  camera capability

core-animation-kit
  animation capability

core-graphics-kit
  graphics and frame capability

core-skybox-kit
  sky descriptor

core-ui-kit
  UI capability and projection

core-diagnostics-kit
  diagnostics and readback

core-composition-kit
  composition metadata and capability graph
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams

procedural-creature-body-kit
  recipe normalization, geometry, topology, skeleton, skinning,
  collision recommendation, content hash, poses and snapshots

instanced-render-batch-kit
  cell replace/release, flush, overflow, bounds, statistics and snapshots

seeded-world-patch-controller-kit
  patch identity, focus, desired membership, cache, queue, executor,
  ready/release delivery, budgets, eviction and snapshots

camera-smooth-follow-kit
  position/look/quaternion damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit
  run lifecycle, input, route, surface, score, outcomes, events,
  scene transitions, player creature and snapshot

player-character-schema-kit
  defaults, normalization, clamps, color validation and merge

player-character-profile-store-kit
  load, save, patch, reset, subscription, storage sync,
  BroadcastChannel sync and close

menu-page-kit
  menu shell, profile projection and route links

character-creator-page-kit
  draft editing, controls, preview, debounce save, reset and remote projection

game-page-entry-kit
  3D runtime loading

drunk-route-generator
  samples, nearest query, progress, region classification and snapshot

player-raptor-preset-kit
  creature recipe and capsule collision descriptor

prehistoric-patch-generator
  terrain, trees, grass, pickups, colliders, bounds and transferables

prehistoric-patch-worker
  initialization, generation, request/error protocol and transferable delivery
```

### External and host adapter boundaries

```txt
rapier-physics-domain-kit
  Rapier world bridge, kinematic actor, fixed colliders, transforms,
  step, contacts, snapshot and reset

Three runtime module
  scene graph, geometry, materials, instancing, skinning, camera,
  lighting, fog, shadows and rendering

Rapier runtime module
  rigid bodies, colliders, queries and world stepping

message Worker executor adapter
  request correlation and asynchronous generation

active-content consumer adapter
  patch render membership, pickup/collider projection and height sampling

collision fallback adapter
  descriptor XZ overlap and jump-height gate

run failure adapter
  contact/overlap to terminal game failure

creature/camera/render host adapters
  creature binding, pose, camera, light, shadows, HUD and host readback
```

## Required authority domain

```txt
prehistoric-rush-run-stream-epoch-authority-domain
  -> runtime-session-id-kit
  -> run-session-id-kit
  -> run-epoch-kit
  -> stream-epoch-kit
  -> collider-epoch-kit
  -> worker-generation-kit
  -> frame-epoch-kit
  -> run-reset-command-kit
  -> run-reset-admission-kit
  -> run-reset-plan-kit
  -> input-reset-kit
  -> patch-membership-reset-kit
  -> pickup-projection-reset-kit
  -> physics-reset-or-replacement-kit
  -> camera-reset-ack-kit
  -> stale-work-rejection-kit
  -> run-reset-commit-kit
  -> run-reset-result-kit
  -> run-reset-journal-kit
  -> retry-reset-parity-fixture-kit
```

## Required transaction

```txt
Start/Retry command
  -> validate runtime, predecessor run and lifecycle
  -> freeze frame, stream, physics and interaction admission
  -> allocate new run/stream/collider/worker/frame epochs
  -> retire or quarantine predecessor claims and callbacks
  -> preserve immutable patch cache only by declared policy
  -> reproject active patch consumers for the new run
  -> exact-replace fixed colliders
  -> reset actor, gameplay input, external input and pickup projection
  -> reset camera and frame read model
  -> atomically publish new run authority
  -> resume RAF
  -> acknowledge first committed new-run frame
```

## Acceptance conditions

```txt
retry always restores every uncollected pickup
held prior-run input does not leak unless explicitly admitted
old Worker responses reject without mutation
old contacts and frame receipts reject
controller and consumer membership share streamEpoch
Rapier membership shares colliderEpoch
camera, canvas, HUD and host acknowledge the same run/frame epoch
reset failure preserves the prior terminal state
duplicate retry command is idempotent
```

## Priority placement

```txt
P0   route artifact and profile handoff
P1   patch activation/release transaction
P1a  exact collider retirement and collision admission
P2   committed-frame observation and host read model
P3   run/stream/collider/worker/frame epoch reset authority
P4   startup rollback, resource ownership and disposal
```

No runtime source was changed by this audit.
