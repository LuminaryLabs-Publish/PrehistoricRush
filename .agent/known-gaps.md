# Known Gaps: PrehistoricRush

**Updated:** `2026-07-12T07-09-49-04-00`

## Summary

The leading streaming-consumer gap is active-content materialization authority. Patch release and activation paths each rebuild complete grass, shard, pickup and collider projections, flush all tree batches and replace the full fixed-collider set without a shared revision, work budget, atomic commit or frame receipt.

## Plan ledger

**Goal:** close coalescing, budgeting, consumer parity, rollback and visible-frame gaps while preserving every previously documented runtime and gameplay authority gap.

- [x] Add active-content materialization, work-amplification and parity gaps.
- [x] Preserve runtime graph, input, surface, profile, creator, streaming, shard, collision, outcome, cadence, readiness, frame, host, reset and lifecycle gaps.
- [ ] Implement in dependency order.

## Materialization ownership gaps

```txt
product host directly owns every consumer mutation
controller delivery has no aggregate product-side command
activePatches is mutable host state with no revision
terrain slots, tree cells, grass, shards and colliders have separate implicit ownership
public host exposes raw owners instead of detached results
```

## Work amplification gaps

```txt
releasePatches triggers full tree flush and full dynamic rebuild
activatePatch triggers full tree flush and full dynamic rebuild
release plus activation can perform both in one frame
all active grass descriptors are revisited
all uncollected shard descriptors are revisited
all fixed colliders are reconstructed and replaced
bounds are recomputed after complete instance rewrites
no patch-local delta application exists for grass, shards or colliders
```

## Identity and command gaps

```txt
no active-content revision
no canonical patch-set digest
no aggregate release/activation delta
no materialization command ID
no command idempotency result
no expected runtime/run/stream/content revision
no deterministic consumer plan identity
```

## Budget and admission gaps

```txt
no elapsed-time materialization budget
no deterministic work-unit budget
no capacity admission before mutation
no coalescing policy
no explicit full-rebuild fallback admission
no deferred activation result
no stale-plan rejection
```

## Commit and rollback gaps

```txt
no detached consumer preparation
no typed terrain/tree/grass/shard/collider results
no atomic aggregate commit
no predecessor preservation guarantee
no partial-failure rollback
no exact resource-retirement receipt
no controller acknowledgement bound to consumer commit
```

## Gameplay, physics and frame gaps

```txt
simulation step does not cite active-content revision
height sampler reads mutable activePatches
Rapier fixed-collider replacement has no revision result
fallback collider array has no digest
pickup set has no revision
collision and shard events do not cite content revision
renderer has no content revision
HUD and public readback have no visible content receipt
```

## Preserved gaps

```txt
runtime module graph admission and source fingerprint
browser input command and edge/hold authority
render-surface policy and physical-buffer frame correlation
route/profile artifact handoff
creator draft/commit/preview convergence
patch activation/release acknowledgement
shard identity, collection and visible removal authority
exact collider retirement and contact provenance
run-step collision/goal/pickup arbitration
stream cadence and hidden-tab policy
world readiness before movement
committed gameplay frame and read model
public host owner quarantine and command gateway
coordinated run/stream/Worker/collider/frame epochs
startup rollback and ordered disposal
```

## Missing proof matrix

```txt
single activation delta
single release delta
release plus activation coalescing
no-op update
bounded work independent of refresh rate
capacity deferral
consumer prepare/commit failure rollback
stale plan rejection
controller/render/physics parity digest
Rapier/fallback collider parity
long traversal retention stability
first visible content-frame receipt
browser and Pages stream materialization smoke
all previously documented runtime/gameplay fixtures
```

## Priority

```txt
0 runtime module graph admission
0a browser input command authority
0b render-surface authority
1 route/profile
2 creator
3 patch activation/release
3a active-content materialization/coalescing
3b shard collection authority
4 collider admission
5 run-step outcome
6 cadence/readiness
7 committed frame/read model
7a public host gateway
8 coordinated reset
9 lifecycle/disposal
```

Do not treat controller `active` counts, rendered grass or a changed collider array as proof of a committed materialization transaction. Require a typed aggregate result and parity digest.