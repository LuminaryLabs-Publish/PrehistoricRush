# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T07-08-45-04-00`

## Summary

The corrected procedural creature winding is now pinned into production, but the descriptor identity, snapshot and consumer-proof contracts do not distinguish the corrected geometry from the previous payload. Patch activation remains P0; creature geometry identity is now the first visual-integrity gate.

## Plan ledger

**Goal:** keep geometry, streaming, camera, lifecycle and validation risks explicit before further visual or content work.

- [x] Record the corrected Kits pin and upstream winding change.
- [x] Record geometry identity, orientation, binding and frame gaps.
- [x] Retain patch activation, camera and run-session priorities.
- [x] Rank implementation order.
- [ ] Close gaps with complete hashes, typed results and fixtures.

## Creature source and schema identity

```txt
- source pin changed but no single module-graph manifest is admitted
- procedural-creature-body-kit version remains 0.1.0
- descriptor has no schemaVersion or generatorVersion field
- descriptor has no sourceRevision field
- coordinate system is not declared
- front-face convention is not declared
- winding convention is not declared
- normal and skinning spaces are not declared
```

## Creature geometry identity

```txt
- contentHash excludes positions
- contentHash excludes normals
- contentHash excludes colors
- contentHash excludes indices and winding
- contentHash excludes skin indices and weights
- contentHash excludes skeleton hierarchy/transforms
- contentHash excludes attachments
- contentHash excludes scaled collision payload
- contentHash excludes bounds and material descriptor
- topology records counts but not payload identity
- old and corrected winding can share contentHash
```

## Snapshot and load fidelity

```txt
- snapshot stores recipe + incomplete contentHash + topology counts
- loadSnapshot compares only the incomplete contentHash
- source revision is not part of snapshot admission
- geometry-format changes can pass as equivalent
- no migration/rejection policy exists for geometry-format revisions
```

## Orientation and normal proof

```txt
- no CPU triangle-normal agreement fixture
- no degenerate-triangle report
- no zero-area rejection
- no index range result
- no normal finiteness/unit-length result
- no explicit FrontSide policy result
- no proof that all body tubes use the same outward convention
- no proof after skeletal deformation
- no screenshot/pixel gate for exterior visibility and shadows
```

## Three and Rapier binding

```txt
- descriptor admission result is absent
- BufferGeometry binding result is absent
- attribute/index count reconciliation result is absent
- skeleton hierarchy/bind result is absent
- skin index/weight result is absent
- collision binding result is absent
- render and collision bindings do not retain shared descriptor hashes
- material-side policy is implicit
```

## Pose and rendered-frame consumption

```txt
- pose descriptor has no monotonic revision
- pose does not name geometryHash or skeletonHash
- applyCreaturePose silently skips missing bones
- pose application returns no result
- frame does not acknowledge binding or pose revision
- host readback omits binding and frame evidence
```

## Patch activation remains P0

```txt
- controller marks ready patches active before all consumers commit
- release evidence clears before retirement succeeds
- terrain/tree/grass/shard/collider/height consumers mutate sequentially
- no detached prepare plan, shared revision, rollback or acknowledgement
- controller-active does not prove render/physics/gameplay readiness
```

## Camera proof remains open

```txt
- target arrays are mutable and lack source provenance
- reset/update calls lack typed product results
- Three camera transform application is result-free
- rendered frames do not acknowledge camera revisions
- public camera owners remain mutable
- camera controller and session lifecycle disposal are absent
```

## Run session and lifecycle

```txt
- no runSessionId distinct from runId
- no shared stream/camera/creature/resource epoch
- Worker stale-result quarantine is absent
- retry lacks ordered world/camera/creature reset transaction
- RAF ID is not retained
- listeners are anonymous/unowned
- Worker is not terminated
- renderer, creature geometry and materials are not disposed
- physics world has no terminal disposal
- global host exposure has no release lease
```

## Priority

```txt
1. acknowledged multi-consumer patch activation/release
2. creature geometry identity and winding/normal/binding/frame proof
3. camera target/transform/render-frame consumption proof
4. run-session reset with stream/camera/creature epochs
5. Worker stale-result quarantine
6. ordered runtime disposal
7. core-kit and typed-command proof
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not use DoubleSide to hide winding defects
- do not silently recompute normals in the product adapter
- do not duplicate procedural-creature-body-kit
- do not treat source commit, topology counts or current contentHash as full geometry proof
- do not claim visual correctness without CPU and browser fixtures
```
