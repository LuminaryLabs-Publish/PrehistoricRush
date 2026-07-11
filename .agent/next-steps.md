# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T07-08-45-04-00`

## Summary

Keep the shared procedural creature generator and the local Three/Rapier consumers. Extend the reusable descriptor identity so exact geometry payload and orientation are versioned, then add typed product binding and rendered-frame proof. Do not let this work displace P0 seeded patch activation authority.

## Plan ledger

**Goal:** make every visible player-creature frame traceable from pinned source and normalized recipe through exact geometry, binding, pose and render acknowledgement.

### Phase 0: preserve ownership

- [ ] Keep `procedural-creature-body-kit` as renderer-agnostic geometry authority.
- [ ] Keep `player-raptor-preset-kit` as product recipe authority.
- [ ] Keep `prehistoric-rush-domain-kit` as run and pose-state authority.
- [ ] Keep Three and Rapier integration outside the shared body kit.
- [ ] Update existing reusable kits before adding a second shared generator.

### Phase 1: version the descriptor contract

- [ ] Add `descriptorSchemaVersion` and `generatorVersion`.
- [ ] Add source revision or source-manifest identity.
- [ ] Declare coordinate system, front face, winding, normal space and skinning space.
- [ ] Add explicit geometry-format migration/rejection policy.
- [ ] Update snapshot schema and load admission.

### Phase 2: hash complete payload identity

- [ ] Add canonical recipe hash.
- [ ] Add positions, normals, colors and indices hashes.
- [ ] Add skin indices/weights hash.
- [ ] Add skeleton, attachment, material, collision and bounds hashes.
- [ ] Add full descriptor hash over all semantic fields.
- [ ] Ensure typed-array/container representation does not change canonical hashes.
- [ ] Ensure changed index order changes geometry and full hashes.

### Phase 3: validate geometry and orientation

- [ ] Validate array lengths and finite values.
- [ ] Validate integer index range and triangle divisibility.
- [ ] Report or reject degenerate triangles.
- [ ] Validate supplied normal lengths.
- [ ] Validate geometric triangle normals against supplied vertex normals.
- [ ] Validate declared FrontSide/winding convention.
- [ ] Validate skin indices and normalized weights.
- [ ] Validate skeleton hierarchy and required bone IDs.

### Phase 4: admit product consumers

- [ ] Add typed creature descriptor admission result.
- [ ] Add typed Three geometry/skeleton/material binding result.
- [ ] Add typed Rapier collision binding result.
- [ ] Prepare both consumers before committing the active player binding.
- [ ] Roll back prepared resources if either consumer fails.
- [ ] Retain descriptor, geometry, skeleton and collision hashes in binding rows.

### Phase 5: prove pose and frame consumption

- [ ] Add monotonic pose revision.
- [ ] Make pose descriptor name descriptor and skeleton hashes.
- [ ] Make `applyCreaturePose()` return accepted/rejected/stale results.
- [ ] Reject missing required bones instead of silently skipping them.
- [ ] Assign committed render-frame IDs.
- [ ] Correlate frame, creature binding, geometry hash, pose revision and camera revision.
- [ ] Publish bounded detached observation only.

### Phase 6: own lifecycle

- [ ] Fence descriptor, binding and pose operations by run/session epoch.
- [ ] Dispose creature geometry, material, skeleton and mesh exactly once.
- [ ] Reject pose/render operations after disposal.
- [ ] Remove mutable adapter and service owners from public readback.
- [ ] Integrate creature disposal with Worker, camera, physics, renderer and RAF shutdown.

### Phase 7: fixture gates

- [ ] Prove deterministic full descriptor hashes.
- [ ] Prove index-order changes alter geometry identity.
- [ ] Prove triangle normals agree with supplied normals.
- [ ] Prove invalid indices, normals and skin data reject.
- [ ] Prove snapshot/load exact geometry identity.
- [ ] Prove Three attribute and index counts match the descriptor.
- [ ] Prove material remains FrontSide during orientation validation.
- [ ] Prove bind pose and animated poses render correctly.
- [ ] Prove one frame references one binding and pose revision.
- [ ] Add browser and Pages smoke.

## Preferred kit changes

Update the existing shared body kit for reusable identity and CPU proof. Keep product consumers local until their contracts stabilize.

```txt
existing shared kit:
  procedural-creature-body-kit
    schema/version metadata
    full payload hashes
    orientation declarations
    deterministic geometry fixtures

product-side kits:
  creature-descriptor-admission-kit
  creature-surface-orientation-kit
  creature-geometry-binding-kit
  creature-skeleton-binding-kit
  creature-collision-binding-kit
  creature-pose-binding-kit
  creature-render-frame-correlation-kit
  creature-observation-kit
  creature-resource-lifecycle-kit
  creature-geometry-fixture-kit
```

## Required future fixture commands

```bash
node scripts/prehistoric-rush-creature-descriptor-fixture.mjs
node scripts/prehistoric-rush-creature-binding-fixture.mjs
node scripts/prehistoric-rush-creature-frame-fixture.mjs
node scripts/prehistoric-rush-creature-lifecycle-fixture.mjs
```

Shared kit fixture:

```bash
node scripts/procedural-creature-geometry-identity-fixture.mjs
```

## Overall order

```txt
1. Patch-content admission and acknowledged patch activation/release.
2. Creature geometry identity and winding/normal/binding/frame proof.
3. Camera target/transform/frame consumption proof.
4. Run-session reset with stream/camera/creature epochs.
5. Worker stale-result quarantine and full runtime disposal.
```

## Do not do next

Do not use `DoubleSide`, regenerate geometry in the Three adapter, silently call `computeVertexNormals()` as a patch, weaken source pinning, or accept current `contentHash` as proof of exact geometry.
