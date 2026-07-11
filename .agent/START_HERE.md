# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T07-08-45-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` is a browser 3D runner built from a pinned Nexus Engine graph, official procedural creature and streaming kits, Three.js and Rapier. The latest production change pins a corrected procedural-creature tube winding order. The raptor's visible geometry changed, but the shared kit still reports version `0.1.0` and its `contentHash` excludes geometry arrays, indices, normals and skin data.

The current documentation gate is exact creature geometry identity and render-consumption proof. Seeded patch activation remains the highest gameplay-integrity implementation priority.

## Plan ledger

**Goal:** keep source, descriptor, renderer and runtime proof aligned so future creature fixes cannot change visible output without changing geometry identity and executable validation.

- [x] Compare the full accessible Publish inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have root `.agent` and central-ledger coverage.
- [x] Select only `PrehistoricRush` because its production Kits pin changed after the prior audit.
- [x] Inspect the upstream winding correction and current product consumer.
- [x] Identify the interaction loop, domains, kits and services.
- [x] Add the timestamped geometry identity audit set.
- [x] Refresh required root `.agent` state.
- [ ] Implement acknowledged patch activation as P0.
- [ ] Extend creature descriptor identity and fixtures as P1.
- [ ] Add camera target/transform/frame proof as P2.

## Latest documentation gate

```txt
PrehistoricRush Creature Geometry Identity Authority
+ Winding / Normal / Skinned Render Fixture Gate
```

## Overall implementation priority

```txt
P0 Seeded Patch Activation Commit Authority
P1 Creature Geometry Identity and Render Binding Proof
P2 Camera Target / Transform / Render-Frame Consumption Proof
P3 Run Session Reset + Stream / Camera Epoch Authority
P4 Worker Stale-Result Quarantine and Ordered Runtime Disposal
```

## Read first

```txt
.agent/trackers/2026-07-11T07-08-45-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T07-08-45-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-11T07-08-45-04-00-creature-geometry-identity-dsk-map.md
.agent/render-audit/2026-07-11T07-08-45-04-00-winding-normal-front-face-proof-gap.md
.agent/gameplay-audit/2026-07-11T07-08-45-04-00-run-pose-skinned-render-loop.md
.agent/interaction-audit/2026-07-11T07-08-45-04-00-creature-descriptor-admission-result-map.md
.agent/creature-system-audit/2026-07-11T07-08-45-04-00-winding-content-hash-render-contract.md
.agent/deploy-audit/2026-07-11T07-08-45-04-00-creature-geometry-fixture-gate.md
```

Prior active camera audit:

```txt
.agent/camera-system-audit/2026-07-11T05-39-11-04-00-target-provenance-transform-consumption-contract.md
```

Prior active world-streaming audit:

```txt
.agent/world-streaming-audit/2026-07-11T05-02-00-04-00-controller-consumer-activation-contract.md
```

## Selection

The accessible Publish inventory contains ten repositories. All nine eligible non-Cavalry repositories are already tracked and have root `.agent` state. `PrehistoricRush` was selected before the oldest documented fallback because commit `53f8e45ce8b55cf9b4d20048534b77393b8b56e6` changed its production `NexusEngine-Kits` pin after the previous audit.

## Product read

The player steers, boosts and jumps a procedural skinned raptor along a deterministic route. Seeded world patches stream terrain, trees, grass, pickups, colliders and height data around the run while Rapier handles actor contacts and a persistent smooth-follow controller drives the camera.

## Active interaction loop

```txt
browser input
  -> prehistoric-rush simulation updates run state
  -> patch controller updates active world content
  -> pose service derives a procedural creature pose
  -> Three adapter applies pose to the bound skeleton
  -> smooth camera controller updates camera transform
  -> Three renders skinned raptor and streamed world
  -> HUD and PrehistoricRushHost expose aggregate snapshots
  -> RAF repeats
```

## Creature ownership split

```txt
player-raptor-preset-kit
  owns product recipe values

procedural-creature-body-kit
  owns renderer-agnostic geometry, normals, indices, skeleton, skinning,
  collision recommendation, pose descriptors and current hashes/snapshots

prehistoric-rush-domain-kit
  owns player selection, run state and pose-state inputs

Three adapter
  owns BufferGeometry, Material, Bone, Skeleton, SkinnedMesh,
  pose projection and visible frame consumption

Rapier adapter
  owns collision actor binding and contact projection
```

## Main finding

The corrected winding is loaded from `NexusEngine-Kits@ae7ebda62f7c264bbde49c939a62e1a04fd60784` and directly bound into a FrontSide Three material. However:

```txt
kit version remains 0.1.0
contentHash = hash(recipe + topology counts)
geometry positions/normals/indices/skin data are excluded
snapshot/load compares the incomplete contentHash
host exposes only id + contentHash + topology counts
```

Old and corrected winding payloads can therefore appear identical to snapshots and product diagnostics even though culling, lighting and shadows change.

## Safe implementation order

```txt
1. Keep procedural-creature-body-kit as renderer-agnostic generator authority.
2. Add schema, source, front-face and full geometry identity fields.
3. Hash complete geometry, skeleton, attachment, collision and material payloads.
4. Add CPU winding/normal/index/skin fixtures in NexusEngine-Kits.
5. Add typed product descriptor admission and Three/Rapier binding results.
6. Correlate binding, pose and rendered-frame revisions.
7. Expose bounded detached proof and own resource disposal.
8. Add browser and deployed Pages render smoke.
```

Do not use `DoubleSide` to conceal orientation defects, recompute normals silently in the product adapter, duplicate the creature generator, or treat a source commit alone as proof of the exact descriptor consumed by a rendered frame.
