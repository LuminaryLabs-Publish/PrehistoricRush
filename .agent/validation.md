# Validation: PrehistoricRush

**Updated:** `2026-07-10T23-08-11-04-00`

## Scope

Documentation-only audit of the post-refactor Nexus Engine kit graph, host-adapter ownership, dependency source contract and remaining population-capacity defects.

## Verified by source inspection

```txt
active route: index.html -> src/runtime.mjs -> src/game.js
parent game domain: prehistoric-rush-domain-kit 0.2.0
nested specialized kits: 2
Nexus Engine core kits declared: 12
external runtime modules: NexusEngine@main, Three.js 0.179.1, Rapier 0.15.0, Rapier ProtoKit@main
removed superseded repo-local domains: route, surface, forest, grass patch, grass wind
retained procedural dino implementation: yes
browser host adapter remains broad: yes
```

## Composition facts verified

```txt
core-scene direct runtime use: yes
core-input direct runtime use: no visible use
core-spatial direct runtime use: no visible use
core-physics direct runtime use: no visible use
core-motion direct runtime use: no visible use
core-camera direct runtime use: no visible use
core-animation direct runtime use: no visible use
core-graphics direct runtime use: no visible use
core-skybox direct runtime use: no visible use
core-ui direct runtime use: no visible use
core-diagnostics direct runtime use: no visible use
core-composition readback: engine.gameComposer reference only
per-kit consumption ledger: absent
composition fingerprint: absent
```

## Host ownership verified

```txt
browser input listeners: src/game.js
local input authority: src/game.js input object
run input forwarding: game.setInput()
Rapier initialization and world shim: src/game.js rapierAdapter()
terrain mesh and height sampling: src/game.js createAdapter()
tree/grass/shard population: src/game.js createAdapter().populate()
physics contact and pickup forwarding: src/game.js frame loop
camera/light/dino pose/render: src/game.js adapter.render()
HUD projection: src/game.js frame loop
RAF scheduling: src/game.js frame loop
public host installation: src/game.js
```

## Population facts verified after refactor

```txt
window dimensions: 7 x 7
window chunks: 49
trees per chunk: 7
maximum tree candidates: 343
tree archetype pools: 5
allocated entries per trunk/crown pool: 160
grass candidates maximum: 3430
grass allocations: 3600 / 2600 / 1300
shard candidates maximum: 98
shard allocation: 240
immutable capacity fields: absent
next-pass tree ceiling source: previous trunk.count
next-pass grass ceiling source: previous grass mesh.count
next-pass shard ceiling source: previous shards.count
atomic population plan/commit: absent
```

## Documentation output

```txt
required root .agent files updated: yes
new tracker folder: yes
new turn-ledger entry: yes
architecture audit: yes
render audit: yes
gameplay audit: yes
interaction audit: yes
composition-authority audit: yes
deploy audit: yes
central ledger sync required: yes
central change-log entry required: yes
```

## Runtime validation not performed

```txt
runtime source changed by this pass: no
package scripts changed: no
dependencies changed: no
routes changed: no
rendering changed: no
physics changed: no
deployment workflow changed: no
branch created: no
pull request created: no
root package.json found: no
kit-graph fixture: absent / not run
core-consumption fixture: absent / not run
source-admission fixture: absent / not run
adapter-contract fixture: absent / not run
population-capacity fixture: absent / not run
browser smoke: not run
Pages smoke: not run
target branch: main
```

## Required future proof

```txt
- every declared core kit has a stable consumption classification
- required core services fail startup when unavailable
- replaced core services name their authoritative adapter owner
- resolved NexusEngine and ProtoKit revisions are immutable and observable
- game, physics, render and UI adapters return typed results
- public host readback is JSON-safe and excludes live mutable owners
- InstancedMesh allocation capacity never derives from active draw count
- repeated population of identical windows produces identical plans and fingerprints
- stop/dispose/remount leaves no duplicate RAF, listeners, GPU or physics owners
```

## Required fixture commands after implementation

```bash
node scripts/prehistoric-rush-kit-graph-fixture.mjs
node scripts/prehistoric-rush-core-consumption-fixture.mjs
node scripts/prehistoric-rush-source-admission-fixture.mjs
node scripts/prehistoric-rush-adapter-contract-fixture.mjs
node scripts/prehistoric-rush-population-capacity-fixture.mjs
```