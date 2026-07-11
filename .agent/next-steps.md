# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T00-39-25-04-00`

## Goal

Make the official procedural creature migration deterministic, observable and lifecycle-safe without moving product raptor configuration into the shared kit or recreating a local generator.

## Immediate safe ledge

```txt
PrehistoricRush Procedural Creature Consumption Authority
+ Pinned Module Graph / Descriptor-Adapter Fixture Gate
```

## Plan ledger

### Phase 0: one immutable module graph

- [ ] Add a versioned `prehistoric-rush-module-graph-manifest`.
- [ ] Generate browser import-map and runtime CDN URLs from the same source data.
- [ ] Record requested and resolved NexusEngine, NexusEngine-Kits, ProtoKits, Three and Rapier identities.
- [ ] Reject mismatched engine resolution before installing the official kit.
- [ ] Compute and expose a stable module-graph fingerprint.

### Phase 1: preserve and fingerprint product configuration

- [ ] Keep `PLAYER_RAPTOR_PRESET` in PrehistoricRush.
- [ ] Give the preset an explicit schema version.
- [ ] Compute a stable preset/recipe fingerprint.
- [ ] Record normalization defaults and any repair decisions.
- [ ] Ensure one preset produces one deterministic descriptor content hash.

### Phase 2: validate creature descriptors

- [ ] Validate index ranges and all attribute lengths.
- [ ] Validate finite positions, normals, colors, skin indices and skin weights.
- [ ] Validate unique bone IDs, parent references, acyclic hierarchy and root identity.
- [ ] Validate skin indices against bone count.
- [ ] Validate attachment bone references.
- [ ] Validate positive collision dimensions and expected scale application.
- [ ] Return a typed accepted/rejected descriptor-admission result before allocating renderer or physics resources.

### Phase 3: name and isolate the Three adapter

- [ ] Extract `createCreatureMesh()` and `applyCreaturePose()` into `three-procedural-creature-adapter-kit`.
- [ ] Add `prepare`, `commit`, `updatePose`, `getSnapshot` and `dispose` operations.
- [ ] Build resources detached from the scene until descriptor validation passes.
- [ ] Return a render-binding result with creature ID, content hash, topology and resource IDs.
- [ ] Return pose-consumption rows with run/frame sequence and matched/missing bones.
- [ ] Reject content-hash mismatch and post-dispose updates.

### Phase 4: prove physics parity

- [ ] Register the Rapier actor through a typed collision-binding operation.
- [ ] Retain creature ID, descriptor content hash and exact collision dimensions.
- [ ] Correlate actor transform and physics-step results with run/frame sequence.
- [ ] Classify Rapier contacts and manual distance checks as separate explicit outcome sources.
- [ ] Prove renderer and physics consumers reference one admitted descriptor.

### Phase 5: own resources and public evidence

- [ ] Track geometry, attributes, material, bones, skeleton, mesh, scene membership and actor ownership.
- [ ] Add reverse-order rollback for prepare/commit failures.
- [ ] Make creature disposal terminal and idempotent.
- [ ] Remove live creature owners from public host readback.
- [ ] Expose JSON-safe module graph, descriptor, render binding, pose, collision and lifecycle rows.
- [ ] Bound all journals.

### Phase 6: fixture gates

- [ ] Add a DOM-free module-graph fixture.
- [ ] Add deterministic preset/descriptor/hash and snapshot-roundtrip fixtures.
- [ ] Add malformed geometry, skeleton, skinning and collision rejection fixtures.
- [ ] Add a Three adapter fixture using fake or isolated resource accounting.
- [ ] Add pose matching/missing-bone fixtures.
- [ ] Add Rapier collision parity fixture.
- [ ] Add prepare-failure and idempotent-disposal fixtures.
- [ ] Add deployed browser smoke for module revisions, binding, pose and collision.

## Candidate kits

```txt
runtime-module-graph-manifest-kit
module-source-admission-result-kit
module-graph-fingerprint-kit
player-raptor-preset-kit
procedural-creature-descriptor-validation-kit
three-procedural-creature-adapter-kit
creature-render-binding-result-kit
creature-pose-consumption-row-kit
creature-collision-consumption-row-kit
creature-resource-lifecycle-kit
creature-host-observation-kit
procedural-creature-fixture-kit
```

Update the existing parent domain and host adapters first. Add a new kit only for a coherent reusable responsibility that has no current owner.

## Required future fixture commands

```bash
node scripts/prehistoric-rush-module-graph-fixture.mjs
node scripts/prehistoric-rush-creature-descriptor-fixture.mjs
node scripts/prehistoric-rush-creature-render-binding-fixture.mjs
node scripts/prehistoric-rush-creature-pose-fixture.mjs
node scripts/prehistoric-rush-creature-collision-fixture.mjs
node scripts/prehistoric-rush-creature-lifecycle-fixture.mjs
```

## Follow-on order

```txt
1. Reconcile all core kits as consumed, replaced or removed.
2. Add browser/runtime lifecycle and committed-frame authority.
3. Restore immutable tree/grass/shard capacities and atomic population commit.
4. Add typed run commands, transition results and event journal.
5. Only then expand creature archetypes, animation fidelity or visuals.
```

## Do not do next

Do not recreate the local body generator, move the player preset into NexusEngine-Kits, put Three/Rapier ownership inside the renderer-agnostic body kit, add new creatures, or treat a visible animated mesh as proof of successful descriptor consumption.