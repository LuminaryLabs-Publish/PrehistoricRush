# Project Breakdown: PrehistoricRush Runtime Module Graph Admission

**Timestamp:** `2026-07-12T00-30-49-04-00`

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with a procedural creature profile, Three.js rendering, Worker-backed deterministic patch streaming, Rapier/fallback collision, pickups, terminal states, HUD projection and Pages deployment.

This pass found that the runtime source graph changed after the previous audit, but internal source-graph records did not. The browser currently pins Nexus Engine `d86188c66692d9c24815aa2b29612c70df8fde4e`, NexusEngine-Kits `9673594de5669b4691737b91a9d56fa282e74370`, ProtoKits `11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5`, Three `0.179.1` and Rapier `0.15.0`; `.agent/kit-registry.json` still recorded older Nexus Engine and Kits commits.

## Plan ledger

**Goal:** make one admitted runtime module graph the prerequisite for engine composition, physics selection, rendering, diagnostics and the first visible frame.

- [x] Compare the ten accessible Publish repositories with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories are tracked and have root `.agent` state.
- [x] Select only `PrehistoricRush` as the oldest eligible central entry.
- [x] Inspect current runtime pins, import maps, dynamic loaders and factory checks.
- [x] Reconcile source-graph documentation with current source.
- [x] Identify the interaction loop, domains, kits and services.
- [x] Define runtime-graph admission, observation and fixture contracts.
- [ ] Implement and execute runtime graph fixtures.

## Selection

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new or ledger-missing: 0
root-.agent-missing: 0
selected: LuminaryLabs-Publish/PrehistoricRush
basis: oldest eligible central Last updated timestamp
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Interaction loop

```txt
menu/profile
  -> creator or game route

creator
  -> browser import map resolves bare nexusengine
  -> pinned Three/Nexus/Kits modules load
  -> draft and procedural creature preview render
  -> profile persists

game startup
  -> runtime-versions builds seven CDN URLs
  -> Promise.all starts module imports
  -> load() converts individual import failure to null
  -> aggregate presence check admits required modules
  -> domain requireFactories checks Nexus and five Kit factories
  -> Rapier adapter may degrade to null
  -> engine, streaming, camera, renderer and physics/fallback paths start

RAF
  -> input, simulation, streaming, collision, pickups, camera, Three render and HUD
  -> public host reports declared version constants, not an admitted graph receipt
```

## Main findings

### Source documentation drift

```txt
current runtime source:
  Nexus Engine       d86188c66692d9c24815aa2b29612c70df8fde4e
  NexusEngine-Kits   9673594de5669b4691737b91a9d56fa282e74370
  ProtoKits          11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5

previous .agent registry:
  Nexus Engine       e8252e51878a08eeef46f54b1aae9e8349a2442b
  NexusEngine-Kits   d6630367d557782d9ec965947aeb1c197d37ea15
```

### Presence is not graph admission

The loader verifies that required module objects are non-null and the domain verifies selected factory names. There is no single manifest fingerprint, import-map parity receipt, module-export contract result or graph-wide compatibility decision covering Nexus, Kits, ProtoKits, Three and Rapier.

### Optional physics changes behavior without a typed capability result

`createRapierAdapter()` can return `null`; gameplay then continues through the manual fallback overlap path. The runtime does not publish whether Rapier was admitted, rejected or unavailable as a versioned capability decision.

### Visible output lacks source provenance

The HUD and rendered frame do not carry a source-graph fingerprint. `PrehistoricRushHost.versions` repeats declared constants but does not prove the loaded modules, resolved import map and active physics provider match those constants.

## Domains in use

```txt
page routing and static hosts
player profile schema persistence and cross-context synchronization
creator draft transition viewport and preview frame
runtime module identity import maps and CDN loading
Nexus Engine composition and core capabilities
procedural creature descriptor topology skeleton skinning pose and collision
run lifecycle input movement route surface score pickups and outcomes
patch generation Worker execution cache queue and membership
terrain tree grass pickup collider and height consumers
Rapier provider and manual fallback collision
camera follow and gameplay view
Three scene lighting shadows instancing and render
HUD terminal frame and public host observation
outcome arbitration frame authority host capability reset and lifecycle
validation build and Pages deployment
runtime module graph admission: missing
```

## Complete kit and service inventory

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
procedural-creature-body-kit: normalization, descriptors, geometry, topology,
  skeleton, skinning, collision recommendation, hashes, poses and snapshots
instanced-render-batch-kit: cell replace/release, flush, overflow, bounds,
  statistics and snapshots
seeded-world-patch-controller-kit: identity, focus, membership, cache, queue,
  executor, delivery, budgets, eviction, reset and snapshots
camera-smooth-follow-kit: damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit: run, input, movement, route, surface, score,
  pickups, outcomes, events, transitions, player creature and snapshot
player-character-schema-kit: defaults, normalization, clamps, colors, deep merge
player-character-profile-store-kit: load, save, patch, reset, revisions,
  storage and BroadcastChannel synchronization
menu-page-kit: menu shell, profile projection and routes
character-creator-page-kit: controls, draft, debounce save, reset, projection,
  showcase, resize and RAF
character-preview-transition-kit: descriptor targeting, morph, crossfade,
  pose damping, revision observation and disposal
three-procedural-creature-adapter-kit: SkinnedMesh, pose, topology comparison,
  geometry/material updates, opacity and disposal
game-page-entry-kit: browser game runtime loading
drunk-route-generator: samples, nearest query, progress, classification, snapshot
player-raptor-preset-kit: creature recipe and capsule collision descriptor
prehistoric-patch-generator: terrain, trees, grass, pickups, colliders and bounds
prehistoric-patch-worker: initialization, generation, request/error protocol and transfer
```

### External and host adapters

```txt
Three runtime module: scene graph, geometry, materials, camera, lighting and render
rapier-physics-domain-kit: world bridge, actor, fixed colliders, step, contacts and reset
Rapier runtime module: bodies, colliders, queries and world step
message-worker-executor-adapter-kit: request correlation and async generation
active-content-consumer-adapter: patch membership, pickup/collider projection and height
creator-viewport-framing-adapter: bounds, target and distance
creator-persistence-scheduler: timer replacement and profile patch commit
creature-camera-render-host-adapters: creature, fallback collision, pickup scan,
  camera, lighting, HUD and public readback
```

## Required authority

```txt
prehistoric-rush-runtime-module-graph-admission-domain
```

Candidate kits:

```txt
runtime-module-manifest-kit
runtime-module-entry-kit
import-map-parity-kit
module-load-result-kit
module-export-contract-kit
module-compatibility-policy-kit
runtime-source-graph-fingerprint-kit
runtime-source-graph-admission-kit
optional-capability-policy-kit
physics-provider-admission-kit
runtime-source-graph-observation-kit
runtime-source-graph-journal-kit
runtime-source-graph-fixture-kit
browser-import-map-smoke-kit
```

## Required invariant

```txt
declared pins
= HTML import-map resolution
= loaded module URLs
= accepted export contracts
= active engine/kit/physics/render providers
= published sourceGraphFingerprint
= first visible frame provenance
```

No runtime behavior changed in this documentation pass.