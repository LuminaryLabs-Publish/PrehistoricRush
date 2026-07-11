# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T08-48-04-04-00`

## Summary

The runtime now contains a joined creature neck/head topology and a coordinated grass/shadow policy change, but it has no canonical visual-policy identity or frame receipt. Patch activation remains P0 because controller-active state still does not prove all render, physics and gameplay consumers committed.

## Plan ledger

**Goal:** keep streaming, module-graph, creature, grass, shadow, camera and lifecycle risks explicit before more visual work.

- [x] Record the current module pins and product runtime revision.
- [x] Record the joined creature topology and changed connected-part count.
- [x] Record grass geometry, shader and palette changes.
- [x] Record shadow-map, camera and caster changes.
- [x] Preserve patch activation as P0.
- [x] Rank the implementation and fixture order.
- [ ] Close gaps with typed descriptors, canonical hashes, results and frame receipts.

## Patch activation gaps

```txt
- controller marks ready delivery active before consumer commit
- release evidence clears before retirement acknowledgement
- terrain, trees, grass, pickups, colliders and height mutate sequentially
- no detached prepare plan
- no shared consumer revision
- no rollback result
- no activation/release acknowledgement
- controller-active does not prove render/physics/gameplay readiness
```

## Module graph gaps

```txt
- source pins are independent constants rather than one admitted manifest
- no graph schema version
- no canonical graph serialization
- no graph fingerprint
- upstream integrity and product source revision are not combined
- host readback does not expose one graph identity
- no stale or unexpected dependency admission policy
```

## Creature topology and identity gaps

```txt
- kit version remains 0.1.0 after winding and neck-topology changes
- topology connectedParts changed from 7 to 6
- connected-part count is not exact geometry identity
- contentHash excludes positions, normals, colors and indices
- contentHash excludes skin data, skeleton, attachments and collision
- descriptor has no source revision or integrity identity
- coordinate/front-face/winding/normal/skinning spaces are undeclared
- snapshot/load cannot prove exact joined-neck geometry
- no product binding or frame receipt names exact geometry
```

## Grass policy gaps

```txt
- card-width scale is a host literal
- card geometry has no descriptor version
- fragment shader source has no canonical identity
- alpha silhouette constants have no descriptor
- palette values have no descriptor
- wind shader and runtime uniform policy are not versioned
- no typed grass binding result
- no grass resource revision or disposal result
```

## Shadow policy gaps

```txt
- shadow-map type is a host literal
- shadow camera bounds/near/far are host literals
- bias and normalBias are host literals
- tree crown cast/receive flags are host literals
- player, trunk, terrain and pickup policies are not summarized together
- no typed shadow binding result
- no shadow policy hash or revision
- no frame acknowledgement names the active shadow policy
```

## Renderer identity gaps

```txt
- renderer label is manually maintained
- label does not canonically identify module pins
- label does not identify shader source
- label does not identify grass colors or geometry parameters
- label does not identify shadow settings or caster flags
- label can drift from source
- no visualPolicyFingerprint exists
```

## Consumer and frame gaps

```txt
- creature descriptor admission result is absent
- creature geometry/skeleton/collision binding results are absent
- grass geometry/material binding result is absent
- shadow map/light/caster binding result is absent
- pose application silently skips missing bones
- pose has no monotonic revision
- camera transform application is result-free
- renderer.render has no product frame receipt
- host readback omits binding and committed-frame evidence
```

## Camera gaps

```txt
- target arrays are mutable
- target source provenance is absent
- reset/update results are untyped
- camera revision is absent
- frame does not acknowledge camera transform
- public camera owner remains mutable
```

## Run session and lifecycle gaps

```txt
- no runSessionId distinct from runId
- no shared stream/camera/creature/visual-policy/resource epoch
- Worker stale-result quarantine is absent
- retry lacks ordered consumer and resource reconciliation
- RAF ID is not retained
- listeners are anonymous/unowned
- Worker is not terminated
- Three resources are not fully disposed
- Rapier world has no terminal disposal
- public host exposure has no release lease
```

## Missing proof matrix

```txt
patch claim / prepare / commit / rollback / acknowledge
controller-consumer exact-ID parity
module graph canonical fingerprint
joined neck/head six-component topology
exact creature geometry hash
grass geometry/shader/palette hash sensitivity
shadow map/camera/caster hash sensitivity
typed binding result parity
pose/camera/frame revision correlation
browser visible neck continuity
browser grass silhouette
browser shadow acne and caster policy
restart and stale-epoch rejection
ordered disposal and zero residual resources
```

## Deployment blockers

```txt
P0 patch activation is not transactional
visual-policy identity is absent
manual renderer label is treated as the only aggregate marker
joined-neck exact geometry is not proven in the product
grass/shadow policies are not descriptor-backed
committed frames do not name accepted revisions
fixtures are absent from an executable product gate
browser and Pages visual smoke are absent
```

## Priority

```txt
1. acknowledged multi-consumer patch activation/release
2. visual-policy graph identity
3. creature/grass/shadow binding and frame correlation
4. camera target/transform/frame proof
5. run-session and shared epoch reset
6. Worker quarantine and ordered disposal
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not duplicate procedural-creature-body-kit
- do not use DoubleSide to hide topology defects
- do not disable shadows globally to avoid policy ownership
- do not treat renderer label or topology counts as exact visual identity
- do not claim visual correctness without CPU and browser fixtures
```