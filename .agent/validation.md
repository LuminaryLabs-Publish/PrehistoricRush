# Validation: PrehistoricRush

**Updated:** `2026-07-11T00-39-25-04-00`

## Scope

Documentation-only audit of the newly landed official procedural creature migration, pinned runtime module graph, product raptor preset, renderer binding, pose consumption, Rapier collision binding and remaining architecture gaps.

## Verified by source inspection

```txt
active route: index.html -> src/runtime.mjs -> src/game.js
NexusEngine commit: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits commit: b107be495e272b67316a8f9e17b85ffd7bbeff64
NexusEngine-ProtoKits commit: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js version: 0.179.1
Rapier version: 0.15.0
browser import map for bare nexusengine: present
parent game domain: prehistoric-rush-domain-kit 0.3.0
Nexus Engine core kits declared: 12
official NexusEngine-Kits installed: seed-kit, procedural-creature-body-kit
nested local kit: drunk-route-generator
local duplicate procedural dinosaur generator: removed
product-owned player raptor preset: present
```

## Creature ownership verified

```txt
product preset owns configuration: yes
official kit owns descriptor generation: yes
official kit is renderer agnostic: yes
official kit services: recipe, topology, skeleton, skinning, attachments, collision, pose
deterministic descriptor content hash: present
snapshot/load hash verification: present
game domain requires n:procedural-creatures:body: yes
game domain exposes body and pose queries: yes
Three adapter consumes body descriptor: yes
Rapier adapter consumes collision descriptor: yes
```

## Three adapter facts verified

```txt
geometry indices consumed: yes
position/normal/color attributes consumed: yes
skinIndex/skinWeight attributes consumed: yes
Bone hierarchy constructed: yes
Skeleton and SkinnedMesh constructed: yes
material created from descriptor: yes
pose transforms applied by bone ID: yes
unknown pose bone handling: silently ignored
explicit descriptor preflight: absent
typed render binding result: absent
pose consumption result: absent
creature resource dispose: absent
```

## Collision facts verified

```txt
actor id: dino
shape/radius/halfHeight source: player body collision descriptor
centerY used in actor transform projection: yes
binding result with creature/hash parity: absent
physics step correlated to frame ID: absent
manual and Rapier collision-source classification: absent
```

## Composition and population facts retained

```txt
core-scene directly consumed: yes
per-core-kit consumption ledger: absent
composition fingerprint: absent
population window: 7 x 7 / 49 chunks
tree active count reused as capacity: yes
grass active count reused as capacity: yes
shard active count reused as capacity: yes
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
creature-system audit: yes
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
module-graph fixture: absent / not run
creature descriptor fixture: absent / not run
render binding fixture: absent / not run
pose fixture: absent / not run
collision parity fixture: absent / not run
creature lifecycle fixture: absent / not run
browser smoke: not run
Pages smoke: not run
target branch: main
```

## Required future proof

```txt
- import map and runtime CDN constants derive from one immutable module graph
- requested and resolved sources produce a stable graph fingerprint
- the product preset produces one deterministic recipe and descriptor hash
- geometry, skeleton, skinning, attachments and collision validate before allocation
- Three preparation/commit/update/dispose return typed results
- pose consumption records matched and missing bones with run/frame correlation
- Rapier collision binding retains the same creature ID and content hash
- render and physics collision dimensions reconcile exactly
- prepare failures leak no retained resources
- dispose is idempotent and post-dispose updates reject
- public host readback is JSON-safe and excludes live mutable owners
- prior core-kit consumption and population-capacity fixtures also pass
```

## Required fixture commands after implementation

```bash
node scripts/prehistoric-rush-module-graph-fixture.mjs
node scripts/prehistoric-rush-creature-descriptor-fixture.mjs
node scripts/prehistoric-rush-creature-render-binding-fixture.mjs
node scripts/prehistoric-rush-creature-pose-fixture.mjs
node scripts/prehistoric-rush-creature-collision-fixture.mjs
node scripts/prehistoric-rush-creature-lifecycle-fixture.mjs
```