# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T08-48-04-04-00`

## Summary

Finish acknowledged patch activation first. Then replace the manual renderer label and fragmented source/render settings with one canonical visual-policy graph that identifies the exact creature topology, grass policy and shadow policy consumed by each committed frame.

## Plan ledger

**Goal:** make every visible frame traceable to accepted world content and an exact visual-policy revision.

### Phase 0: patch activation remains P0

- [ ] Add detached patch-content validation.
- [ ] Claim ready patches without marking them active.
- [ ] Prepare terrain, tree, grass, pickup, collider and height consumers.
- [ ] Commit all consumers under one `consumerRevision`.
- [ ] Roll back every prepared consumer on failure.
- [ ] Acknowledge activation to the controller only after commit.
- [ ] Keep release evidence until all consumers retire successfully.
- [ ] Add controller/consumer exact-ID parity fixtures.

### Phase 1: create one module-graph manifest

- [ ] Define schema version and product build identity.
- [ ] Record exact NexusEngine, NexusEngine-Kits, ProtoKits, Three and Rapier coordinates.
- [ ] Record upstream kit integrity where available.
- [ ] Record product runtime source revision.
- [ ] Canonically serialize and fingerprint the graph.
- [ ] Reject missing, malformed or unexpected graph fields before runtime construction.

### Phase 2: version creature geometry identity

- [ ] Keep `procedural-creature-body-kit` as renderer-agnostic generator authority.
- [ ] Add descriptor schema and generator version.
- [ ] Add source and integrity identity.
- [ ] Declare coordinate, front-face, winding, normal and skin spaces.
- [ ] Hash exact positions, normals, colors, indices, skinning, skeleton, attachments, collision, bounds and material.
- [ ] Preserve connected-component count as validation, not as the full geometry identity.
- [ ] Add snapshot/load migration or rejection policy.

### Phase 3: extract local visual policies

- [ ] Define `GrassCardGeometryPolicy`.
- [ ] Define `GrassAlphaShaderPolicy`.
- [ ] Define `GrassPalettePolicy`.
- [ ] Define `ShadowMapPolicy`.
- [ ] Define `ShadowCameraPolicy`.
- [ ] Define `ShadowCasterPolicy`.
- [ ] Move literal values and shader-source identity into immutable descriptors.
- [ ] Canonically hash each descriptor and the aggregate visual policy.
- [ ] Keep renderer construction as a consumer, not the policy owner.

### Phase 4: admit and bind policies

- [ ] Add typed module-graph admission result.
- [ ] Add typed creature descriptor admission result.
- [ ] Add typed grass geometry/material binding result.
- [ ] Add typed shadow-map/light/caster binding result.
- [ ] Prepare all visual consumers before committing the active policy.
- [ ] Roll back created Three resources on binding failure.
- [ ] Assign a monotonic `visualPolicyRevision`.

### Phase 5: correlate committed frames

- [ ] Assign committed render-frame IDs.
- [ ] Add monotonic creature pose and camera revisions.
- [ ] Retain patch consumer revision from P0.
- [ ] Make frame receipt name module graph, visual policy, creature geometry, pose, camera and patch revisions.
- [ ] Publish only detached JSON-safe observations.
- [ ] Reject stale run/session/resource epochs.

### Phase 6: lifecycle

- [ ] Retain RAF ID and listener leases.
- [ ] Terminate the patch Worker.
- [ ] Dispose creature, terrain, tree, grass, pickup and renderer resources exactly once.
- [ ] Dispose or release Rapier state.
- [ ] Retire the public host and reject stale callbacks.
- [ ] Make restart create new run, stream, visual-policy and resource epochs.

### Phase 7: fixture gates

- [ ] Prove joined neck/head topology has six indexed components.
- [ ] Prove exact geometry hash changes when topology or winding changes.
- [ ] Prove grass geometry, shader or palette edits change policy identity.
- [ ] Prove shadow-map, camera or caster edits change policy identity.
- [ ] Prove manual renderer label is not used as the fingerprint.
- [ ] Prove Three bindings match accepted descriptors.
- [ ] Prove one frame names one accepted policy and binding revision.
- [ ] Add browser and deployed Pages pixel/screenshot smoke.

## Preferred kit changes

Update existing reusable kits first:

```txt
procedural-creature-body-kit
  descriptor schema
  full geometry identity
  orientation declarations
  CPU topology/winding/normal fixtures

seeded-world-patch-controller-kit
  claim and acknowledgement protocol
  active/release state after consumer acknowledgement
```

Product-side candidate kits:

```txt
runtime-module-graph-manifest-kit
visual-policy-schema-kit
creature-topology-policy-kit
grass-card-geometry-policy-kit
grass-alpha-shader-policy-kit
grass-palette-policy-kit
shadow-map-policy-kit
shadow-camera-policy-kit
shadow-caster-policy-kit
render-policy-fingerprint-kit
render-policy-admission-kit
render-binding-result-kit
render-frame-policy-correlation-kit
visual-policy-observation-kit
visual-policy-fixture-kit
```

## Acceptance conditions

```txt
patch controller active IDs equal committed consumer IDs
no failed patch activation becomes gameplay-ready
source pin or local render-policy change changes visualPolicyFingerprint
joined neck/head geometry is validated and exactly identified
grass shader/geometry/palette binding matches accepted policy
shadow map/camera/caster binding matches accepted policy
rendered frame receipt names all accepted revisions
stale epoch cannot mutate or publish a frame
observation is bounded, detached and JSON-safe
```

## Future fixture commands

```bash
node scripts/prehistoric-rush-patch-activation-fixture.mjs
node scripts/procedural-creature-geometry-identity-fixture.mjs
node scripts/prehistoric-rush-visual-policy-fixture.mjs
node scripts/prehistoric-rush-render-binding-fixture.mjs
node scripts/prehistoric-rush-frame-receipt-fixture.mjs
node scripts/prehistoric-rush-lifecycle-fixture.mjs
```

## Overall order

```txt
1. Patch-content admission and acknowledged activation/release.
2. Module graph plus creature/grass/shadow visual-policy identity.
3. Typed visual binding and render-frame correlation.
4. Camera target/transform/frame proof.
5. Run-session reset with stream/camera/creature/resource epochs.
6. Worker quarantine and ordered runtime disposal.
```

## Do not do next

Do not add more ad hoc renderer labels, duplicate the creature generator, hide geometry defects with `DoubleSide`, disable all shadows as a substitute for policy ownership, or add more streamed consumers before P0 acknowledgement.