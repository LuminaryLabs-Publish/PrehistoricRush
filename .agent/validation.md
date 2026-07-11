# Validation: PrehistoricRush

**Updated:** `2026-07-11T07-08-45-04-00`

## Scope

Documentation-only audit of the corrected procedural creature winding pin, descriptor geometry identity, snapshot/load behavior, Three.js render binding, Rapier collision binding, pose application, rendered-frame correlation and lifecycle proof. The prior patch activation transaction remains active P0 work.

## Verified by source inspection

```txt
active route: index.html -> src/runtime.mjs -> src/game.js
NexusEngine commit: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits commit: ae7ebda62f7c264bbde49c939a62e1a04fd60784
NexusEngine-ProtoKits commit: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js version: 0.179.1
Rapier version: 0.15.0
parent game domain: prehistoric-rush-domain-kit 0.5.0
official NexusEngine-Kits installed: 5
creature kit: procedural-creature-body-kit 0.1.0
camera kit: camera-smooth-follow-kit 0.1.0
renderer label: three-seeded-patch-streaming-smooth-camera-v6
root package.json: absent
target branch: main
```

## Winding correction verified

```txt
product pin commit:
  53f8e45ce8b55cf9b4d20048534b77393b8b56e6

upstream correction commit:
  b716fd6bf238c5faa86b10eba3de03b7d3e1c77b

previous index order:
  a,c,b + b,c,d

current index order:
  a,b,c + b,d,c

product binds descriptor index directly: yes
product binds supplied normal directly: yes
product material explicitly DoubleSide: no
Three default FrontSide behavior applies: yes
```

## Descriptor identity facts verified

```txt
kit version changed with winding fix: no
contentHash includes normalized recipe: yes
contentHash includes topology summary counts: yes
contentHash includes positions: no
contentHash includes normals: no
contentHash includes colors: no
contentHash includes indices/winding: no
contentHash includes skin indices/weights: no
contentHash includes skeleton payload: no
contentHash includes collision/material/attachments: no
snapshot stores recipe/contentHash/topology: yes
loadSnapshot compares current contentHash: yes
source revision in descriptor/snapshot: no
front-face/winding declaration: no
```

## Product binding facts verified

```txt
BufferGeometry receives descriptor index: yes
position/normal/color attributes bound: yes
skinIndex/skinWeight attributes bound: yes
Bone/Skeleton/SkinnedMesh created: yes
collision recommendation sent to Rapier: yes
typed descriptor admission result: absent
typed render binding result: absent
typed collision binding result: absent
typed pose application result: absent
rendered creature frame acknowledgement: absent
resource disposal result: absent
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
repo-local documentation pushed to main: yes
central ledger synchronized on main: yes
central internal change-log added on main: yes
```

## Runtime validation not performed

```txt
runtime source changed by this pass: no
dependencies changed: no
routes changed: no
rendering changed by this pass: no
physics changed: no
deployment workflow changed: no
branch created: no
pull request created: no
shared geometry identity fixture: absent / not run
product descriptor fixture: absent / not run
Three binding fixture: absent / not run
skinned frame fixture: absent / not run
creature lifecycle fixture: absent / not run
browser smoke: not run
Pages smoke: not run
```

## Required future proof

```txt
- same recipe and generator revision produce identical full descriptor hashes
- changed index order changes geometry and full hashes
- changed normals or skin data change geometry and full hashes
- all indices are valid and triangles are non-degenerate
- geometric triangle normals agree with supplied normals
- descriptor declares coordinate, front-face, winding, normal and skin spaces
- snapshot/load rejects incompatible geometry identity
- Three binding retains exact geometry hash
- Rapier binding retains exact collision hash
- pose application names exact skeleton/binding revision
- rendered frame names exact binding, geometry and pose revisions
- bind and animated poses render correctly with FrontSide material
- disposed creature sessions reject mutation
- public observation is bounded, detached and JSON-safe
```

## Required fixture commands after implementation

```bash
node scripts/procedural-creature-geometry-identity-fixture.mjs
node scripts/prehistoric-rush-creature-descriptor-fixture.mjs
node scripts/prehistoric-rush-creature-binding-fixture.mjs
node scripts/prehistoric-rush-creature-frame-fixture.mjs
node scripts/prehistoric-rush-creature-lifecycle-fixture.mjs
```
