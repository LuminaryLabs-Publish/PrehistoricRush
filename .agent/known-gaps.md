# Known Gaps: PrehistoricRush

**Updated:** `2026-07-12T03-51-15-04-00`

## Summary

The current leading gameplay gap is shard collection authority. The shipped loop can award any first-time ID through an API that does not validate active gameplay, run identity, patch membership, descriptor provenance, state revision or 3D spatial evidence. Gameplay mutation, event publication, shard removal and HUD projection are not correlated.

## Plan ledger

**Goal:** close shard identity, admission, idempotency and visible-presentation gaps while preserving every prior product authority gap.

- [x] Add shard identity, evidence, phase, result and frame gaps.
- [x] Preserve runtime graph, surface, route, creator, streaming, collision, outcome, frame, host, reset and lifecycle gaps.
- [ ] Implement in dependency order.

## Shard identity and membership gaps

```txt
shard ID omits world seed and generator version
shard ID omits generator settings fingerprint
shard ID omits patch cache key and activation revision
shard ID omits runtime generation and run ID
no canonical descriptor fingerprint
no immutable active-shard index
no monotonic active-shard-set revision
no committed patch membership receipt consumed by collection
```

## Collection admission gaps

```txt
collectShard accepts any first-time value
collectShard does not require status === game
no command ID or sequence
no expected run-state revision
no run-generation admission
no active descriptor lookup
no stale patch rejection
no unknown/malformed identity rejection
no capability boundary around raw host access
```

## Spatial and ordering gaps

```txt
proximity test uses XZ only
player jump height and shard Y are ignored
collection volume is not versioned
stream release/activation mutates candidates before detection
no stable candidate-set snapshot
one-pickup-per-frame break is undocumented
no stable tie result or collection budget receipt
pickup, collision and terminal outcome are not arbitrated in one step result
```

## Commit, event and frame gaps

```txt
result is boolean only
no accepted duplicate receipt
collected ledger and count have no state revision
ShardCollected event lacks patch/source/spatial evidence
state/event commit precedes visual rebuild
shard projection has no typed result
HUD projection has no typed result
no first visible-frame acknowledgement
no proof shard absence and HUD count share one collection result
```

## Preserved gaps

```txt
runtime module graph admission and source fingerprint
render-surface policy and physical-buffer frame correlation
route/profile artifact handoff
creator draft/commit/preview convergence
patch activation/release acknowledgement
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
shard identity canonicalization
Worker/fallback identity parity
unknown and malformed ID rejection
wrong phase/run rejection
inactive and stale patch rejection
3D horizontal/vertical evidence
command and identity idempotency
stable tie and per-step budget
state/event/result parity
visual removal/HUD/frame parity
run-reset ledger isolation
late collection after reset/disposal
public-host bypass rejection
browser and Pages shard smoke
all previously documented runtime/gameplay fixtures
```

## Priority

```txt
0 runtime module graph admission
0a render-surface authority
1 route/profile
2 creator
3 patch activation/release
3a shard collection authority
4 collider admission
5 run-step outcome
6 cadence/readiness
7 committed frame/read model
7a public host gateway
8 coordinated reset
9 lifecycle/disposal
```

Do not treat a boolean `true`, a changed count or a hidden instance as proof of an admitted, exactly-once and visibly presented collection.