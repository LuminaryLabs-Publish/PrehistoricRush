# Deploy Audit: Creature Geometry Fixture Gate

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T07-08-45-04-00`

## Summary

The production route is commit-pinned, but a pin alone does not prove geometry payload identity or correct visible orientation. Deployment should reject a creature source revision that lacks deterministic geometry, winding, normal and product binding proof.

## Plan ledger

**Goal:** add fixture and browser gates that make procedural creature geometry changes deliberate, versioned and visible before Pages deployment.

- [x] Record current source pin and runtime route.
- [x] Identify missing reusable and product fixtures.
- [x] Define expected deployment ordering.
- [ ] Add reusable geometry identity fixture.
- [ ] Add product binding fixture.
- [ ] Add browser render smoke.
- [ ] Wire all fixtures before static deployment.

## Current deployment facts

```txt
route: index.html -> src/runtime.mjs -> src/game.js
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: ae7ebda62f7c264bbde49c939a62e1a04fd60784
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
root package.json: absent
```

## Required reusable fixture

Suggested location in `NexusEngine-Kits`:

```txt
scripts/procedural-creature-geometry-identity-fixture.mjs
```

Must prove:

```txt
full descriptor hashes are deterministic
index-order changes change geometry/full hashes
normal changes change geometry/full hashes
skin changes change geometry/full hashes
indices are valid and triangles are non-degenerate
geometric normals agree with supplied normals
snapshot/load preserves exact payload identity
unsupported schema/version rejects clearly
```

## Required product fixtures

Suggested local files:

```txt
scripts/prehistoric-rush-creature-descriptor-fixture.mjs
scripts/prehistoric-rush-creature-binding-fixture.mjs
scripts/prehistoric-rush-creature-frame-fixture.mjs
```

Must prove:

```txt
pinned source revision matches expected manifest
player descriptor admits with expected geometry hash
Three attribute/index counts match the descriptor
material remains FrontSide during orientation proof
skeleton and skin bindings are valid
pose application returns an exact result
frame result references geometry and pose revisions
host observation is detached and JSON-safe
```

## Required browser smoke

```txt
load deployed route
wait for one committed player frame
capture neutral and animated creature views
assert no required body section is culled from expected exterior views
assert shadow caster remains present
assert renderer and host report the same geometry hash
assert no module-import, geometry, skinning or WebGL errors
```

## Required deployment order

```txt
1. verify pinned source manifest
2. run shared geometry identity fixture
3. run product descriptor fixture
4. run product Three binding fixture
5. run frame-correlation fixture
6. build/copy static route
7. run browser smoke against artifact
8. deploy Pages artifact
9. run deployed smoke and retain proof summary
```

## Failure policy

Deployment must fail for:

```txt
unexpected source revision
missing descriptor schema/version
geometry hash mismatch
orientation or normal mismatch
invalid skin/bone data
binding count mismatch
missing frame correlation
browser render failure
```

A screenshot alone is review evidence, not a substitute for CPU geometry and binding fixtures.
