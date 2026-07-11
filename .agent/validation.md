# Validation: PrehistoricRush

**Updated:** `2026-07-11T02-41-37-04-00`

## Summary

This pass inspected and documented the newly landed seeded patch controller, deterministic patch generator, module Worker, stable tree instance batches and budgeted patch activation. No runtime behavior changed and no executable product fixtures currently prove the new streaming boundary.

## Plan ledger

**Goal:** Record exactly what was verified by source inspection, what documentation was produced and what runtime evidence remains required.

- [x] Verify source revisions and composition factories.
- [x] Verify controller configuration and service boundary.
- [x] Verify generator payload and transferables.
- [x] Verify Worker request/response/error flow.
- [x] Verify terrain/tree/grass/shard/collider consumption paths.
- [x] Verify host snapshot additions.
- [x] Record missing fixtures.
- [x] Preserve docs-only scope.

## Verified by source inspection

```txt
active route: index.html -> src/runtime.mjs -> src/game.js
NexusEngine commit: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits commit: 9546a6fb25b4c6a7b65432df068701a4627ab20f
NexusEngine-ProtoKits commit: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js version: 0.179.1
Rapier version: 0.15.0
parent domain: prehistoric-rush-domain-kit 0.4.0
core kits declared: 12
stable kits installed: seed, procedural creature body, instanced render batch, seeded world patch controller
local nested route kit: drunk-route-generator
product patch generator: present
module Worker: present
```

## Controller facts verified

```txt
kit version: 0.1.0
domain path: n:simulation:seeded-world-patch-controller
requires: random:stream
active radius: 2
retain radius: 4
prefetch distance: 2
cache limit: 96
activation budget: 1
generation budget: 2
patch size: 56
active target: 25
controller services: identity, cache, active/retain/prefetch, queue, ready delivery, release, eviction, stats, snapshot, reset
optional executor support: yes
message Worker executor helper: yes
executor dispose support upstream: yes
host retains/calls executor dispose: no
explicit maximum inflight requests: no
```

## Generator facts verified

```txt
terrain heights: Float32Array
terrain colors: Float32Array
terrain normals: Float32Array
vertex side: 31
terrain vertices per patch: 961
tree descriptor groups: 5 types, trunks and crowns
grass descriptor groups: 3 layers
shards per patch target: 2
collider descriptors: tree hazards
patch bounds: present
terrain transferables: height/color/normal buffers
content schema version: absent
content fingerprint: absent
admission validation: absent
```

## Render/physics facts verified

```txt
terrain slots: 25
terrain slot policy: free slot, else slot zero fallback
tree capacity per type/part: 256
active tree maximum across all types: 175
grass capacities: 3600 / 2600 / 1300
shard capacity: 240
activation delivery maximum per frame: 1
controller release processed before ready activation: yes
controller marks active before adapter commit: yes
adapter activation result: absent
atomic commit/rollback: absent
full active grass/shard rebuild per activation/release: yes
full fixed-collider replacement per activation/release: yes
controller/consumer parity snapshot: absent
```

## Gameplay facts verified

```txt
center patch synchronously primed at run start: yes
height source: active patch data or duplicated fallback function
height-source transition result: absent
current/forward readiness result: absent
desired but inactive patch hazards/pickups: unavailable until activation
collision sources: Rapier contacts plus manual distance checks
collision-source classification/result: absent
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
world-streaming audit: yes
deploy audit: yes
central ledger sync required: yes
central internal change-log required: yes
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
module graph fixture: absent / not run
patch generator fixture: absent / not run
controller integration fixture: absent / not run
Worker protocol fixture: absent / not run
activation transaction fixture: absent / not run
render/gameplay/Rapier parity fixture: absent / not run
height continuity fixture: absent / not run
stream lifecycle fixture: absent / not run
browser smoke: not run
Pages smoke: not run
target branch: main
```

## Required future proof

```txt
- one source graph resolves the exact pinned runtime modules
- same request and cache key produce the same patch fingerprint
- neighboring terrain edges agree
- malformed patch content rejects before consumer mutation
- Worker readiness, request ordering, late responses and disposal are deterministic
- activation either commits every consumer or rolls back every consumer
- controller-active and consumer-active sets reconcile exactly
- terrain, tree, grass, shard, gameplay collider and Rapier counts match one activation revision
- fallback-to-patch height transitions meet an explicit continuity threshold
- current and forward safety patches are collider-complete before full-speed gameplay
- reset/remount advances session identity and rejects stale activation
- teardown terminates Worker/RAF/listeners and disposes Three/Rapier state idempotently
- public readback is clone-safe and excludes live mutable owners
```

## Required fixture commands after implementation

```bash
node scripts/prehistoric-rush-module-graph-fixture.mjs
node scripts/prehistoric-rush-patch-generator-fixture.mjs
node scripts/prehistoric-rush-patch-controller-fixture.mjs
node scripts/prehistoric-rush-patch-worker-fixture.mjs
node scripts/prehistoric-rush-patch-activation-fixture.mjs
node scripts/prehistoric-rush-patch-parity-fixture.mjs
node scripts/prehistoric-rush-stream-readiness-fixture.mjs
node scripts/prehistoric-rush-stream-lifecycle-fixture.mjs
```
