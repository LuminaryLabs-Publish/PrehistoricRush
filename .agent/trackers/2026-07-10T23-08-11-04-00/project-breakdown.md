# Project Breakdown: PrehistoricRush

**Timestamp:** `2026-07-10T23-08-11-04-00`

## Goal

Reconcile the newly refactored one-domain Nexus Engine architecture with the runtime that actually executes in the browser, document every domain/kit/service, and define the smallest proof gate for truthful core-kit composition.

## Plan ledger

- [x] Enumerate all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Compare all nine eligible repositories with the central ledger and root `.agent` state.
- [x] Detect that `PrehistoricRush` runtime commits postdate its latest central audit.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Inspect the active route and post-refactor game-domain graph.
- [x] Identify the complete interaction loop.
- [x] Identify all active domains.
- [x] Identify all declared, nested, external and host-implied kits.
- [x] Identify the services each kit provides or intends to provide.
- [x] Separate declared installation from visible runtime consumption.
- [x] Record population-capacity regressions retained by the refactor.
- [x] Refresh required root `.agent` files.
- [x] Add timestamped architecture and system-specific audits.
- [x] Prepare central ledger and internal change-log synchronization.
- [x] Use `main` only; create no branch or pull request.

## Selection result

```txt
accessible repositories: 10
eligible repositories: 9
central ledgers present: 9
root .agent state present: 9
selected repository: LuminaryLabs-Publish/PrehistoricRush
selection reason: runtime refactor after latest documentation
excluded repository: LuminaryLabs-Publish/TheCavalryOfRome
```

The central ledger described six separate repo-local domains. The current runtime instead imports one parent `prehistoric-rush-domain-kit`, two nested specialized kits and twelve Nexus Engine core kits. Five superseded repo-local domain files were removed after the central audit.

## Interaction loop

```txt
page boot
  -> import src/runtime.mjs
  -> import src/game.js
  -> load NexusEngine@main, Three.js, Rapier and Rapier ProtoKit@main
  -> create 12-core-kit + parent-domain graph
  -> create the game engine
  -> create external browser/Rapier/Three adapter
  -> inject terrain sampling into the game domain
  -> start run and populate streamed window
  -> browser input -> local input object -> game.setInput()
  -> engine.tick(dt) -> PrehistoricRushRunSystem
  -> adapter chunk/population/physics/contact/pickup work
  -> adapter dino/camera/light/HUD/render work
  -> RAF repeat
  -> aggregate host readback
```

## Domains in use

```txt
static runtime boot and CDN dependency admission
Nexus Engine core input
Nexus Engine core spatial
Nexus Engine core scene
Nexus Engine core physics
Nexus Engine core motion
Nexus Engine core camera
Nexus Engine core animation
Nexus Engine core graphics
Nexus Engine core skybox
Nexus Engine core UI
Nexus Engine core diagnostics
Nexus Engine core composition
PrehistoricRush run lifecycle and simulation
route generation and nearest/classification query
surface resistance and speed policy
procedural dino topology/skinning/pose
browser input and lifecycle
terrain and streamed population rendering
external Rapier bridge and contact projection
camera/light/HUD/render submission
host observation and static deployment
```

## Kits and services

### Declared core kits

```txt
core-input-kit       action/binding/input capability
core-spatial-kit     transform/spatial capability
core-scene-kit       scene registry and transitions
core-physics-kit     physics-provider capability
core-motion-kit      motion capability
core-camera-kit      camera capability
core-animation-kit   animation capability
core-graphics-kit    graphics/frame capability
core-skybox-kit      sky descriptor capability
core-ui-kit          UI/view capability
core-diagnostics-kit diagnostic/readback capability
core-composition-kit capability composition metadata
```

### Game and nested kits

```txt
prehistoric-rush-domain-kit
  run state, input state, simulation, route, surface, score, outcomes,
  run events, scene transition requests and snapshot

drunk-route-generator
  deterministic control points, samples, nearest query, classification and snapshot

procedural-dino-body
  procedural skinned body, skeleton, weights, material, pose and snapshot
```

### External kits/modules

```txt
NexusEngine@main
Three.js 0.179.1
Rapier 0.15.0
rapier-physics-domain-kit@main
```

### Host-implied kits

```txt
static shell adapter
browser input adapter
Rapier host adapter
terrain render adapter
tree population render kit
layered grass render kit
shard render/pickup kit
dino render/animation adapter
camera/light/render adapter
runner HUD adapter
browser frame loop
host readback kit
```

## Main finding

The refactor changed installation structure without yet changing most runtime ownership. `core-scene` is visibly consumed, but input, physics, motion, camera, animation, graphics, skybox, UI, diagnostics and spatial services are bypassed or have no visible consumer. A successful graph installation therefore does not prove that the runtime is actually composed from those services.

The broad inline adapter also still owns population. Tree, grass and shard `InstancedMesh.count` values are used as admission ceilings and then overwritten with active draw counts, so the next population can inherit a smaller ceiling than the actual allocation.

## Next safe ledge

```txt
PrehistoricRush Core-Kit Consumption Authority
+ Kit-Graph / Thin-Adapter Fixture Gate
```

Required proof:

```txt
immutable source revisions
versioned composition manifest
per-kit declared/installed/available/consumed/replaced/unused rows
named adapter ownership
startup compatibility result
typed adapter results
JSON-safe composition snapshot
DOM-free kit-graph fixture
browser adapter-consumption smoke
```

## Validation

Documentation only. No runtime source, dependency, route, rendering, physics or deployment files were changed. No branch or pull request was created. Existing runtime tests were not run because the required kit-graph and consumption fixtures do not yet exist.