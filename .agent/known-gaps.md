# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T05-02-00-04-00`

## Plan ledger

**Goal:** Keep patch delivery, consumer commit, gameplay readiness, run reset, asynchronous admission and lifecycle risks explicit before content or visual expansion.

- [x] Promote acknowledged patch activation and release to P0.
- [x] Record controller-first mutation semantics.
- [x] Record consumer preparation, rollback and parity gaps.
- [x] Retain run-session, Worker, render, gameplay and lifecycle gaps.
- [x] Rank the implementation order.

## Controller delivery and acknowledgement

```txt
- takeReadyPatches marks records active before host commit
- ready queue evidence is spent before consumer success
- host cannot reject or defer while preserving ready state
- takeReleasedPatchIds clears release evidence before retirement success
- no activation or release claim identity exists
- no controller acknowledgement API exists
- duplicate delivery and acknowledgement policy is absent
- no exact controller/consumer parity result exists
```

## Patch-content admission

```txt
- patch payload has no explicit product schema version
- content hash is not validated by the host
- terrain arrays and numeric values are trusted
- tree and grass matrices are trusted
- shard and collider IDs are trusted
- bounds and coordinate identity are trusted
- malformed content can reach mutation paths
- no typed admission result exists
```

## Consumer prepare and commit

```txt
- activePatches mutates before terrain commit
- terrain slots and buffers mutate live
- tree cells replace and flush live
- grass and shard matrices rebuild live
- gameplay collider array mutates live
- Rapier fixed colliders replace live
- height sampler observes host activePatches directly
- no detached activation or release plan exists
- no shared consumer revision exists
- no rollback or terminal fault result exists
```

## Capacity and truncation

```txt
- terrain slot acquisition falls back to slot zero
- tree overflow is warned after mutation
- grass layers truncate at fixed capacities
- shards truncate at 240
- rejected descriptor IDs are not returned
- capacity policy is not part of admission
- one activation flushes every tree batch
- one activation rebuilds all active grass, shards and colliders
```

## Gameplay readiness

```txt
- controller-active does not mean render-ready
- controller-active does not mean physics-ready
- controller-active does not mean gameplay-ready
- desired but inactive patches have fallback height and no active hazards or pickups
- no forward safety-ring readiness policy exists
- manual and Rapier collisions are separate unclassified outcome sources
- collision and pickup rows have no patch activation revision
- height, hazard, pickup and render parity is not journaled
```

## Run-session reset

```txt
- game.start resets RunState and InputState only
- no runSessionId distinct from runId exists
- no typed start/reset transaction exists
- no retained/reset/rebuilt policy exists per owner
- retry may preserve stale pickup presentation
- actor/contact state has no explicit retry reset
- camera interpolation and render time continue across runs
- first committed frame of a new run is not identified
```

## Controller and Worker execution

```txt
- generationBudget limits starts per pump call, not total concurrent inflight work
- Worker readiness is not awaited or exposed
- no streamEpoch/controllerEpoch/workerEpoch exists
- pending results cannot prove admission to the current run
- controller reset does not cancel executor pending requests
- executor dispose exists upstream but is not retained or invoked
- no stale-result quarantine journal exists
- post-dispose request rejection is absent
```

## Lifecycle and resources

```txt
- RAF ID is not retained
- key, blur and resize listeners have no owner ledger
- Worker is not terminated
- renderer, geometries and materials are not disposed
- physics world and actors are not terminally disposed
- global host exposure has no release lease
- stop, dispose and restart operations are absent
```

## Observation

```txt
- host exposes mutable engine, physics, adapter and controller references
- host has no pending activation or release claims
- consumer-active and gameplay-ready IDs are absent
- patch activation and release results are absent
- render and physics acknowledgement revisions are absent
- exact parity differences are absent
- bounded activation, release, reset and lifecycle journals are absent
```

## Validation

```txt
- no root package.json or unified validation command
- no patch-content admission fixture
- no activation commit fixture
- no release commit fixture
- no rollback fixture
- no controller/consumer parity fixture
- no retry reset or stream epoch fixture
- no lifecycle/disposal fixture
- no browser or Pages streaming smoke
```

## Prior active gaps

```txt
- creature descriptor, render binding, pose and collision proof remain incomplete
- twelve core kits have no consumed/replaced/unused ledger
- typed run commands and transition-result journal remain incomplete
- module graph fingerprint remains absent
```

## Priority

```txt
1. patch-content admission and acknowledged multi-consumer activation/release
2. controller-active, consumer-active and gameplay-ready parity
3. run-session reset and world-cache retention policy
4. Worker/stream epoch, inflight ceiling and stale-result quarantine
5. dynamic pickup/collider/height/render reconciliation
6. lifecycle ownership and committed-frame observation
7. creature, core-kit and typed-command proof
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not duplicate seeded-world-patch-controller-kit
- do not duplicate instanced-render-batch-kit
- do not increase active radius or population
- do not clear deterministic caches to hide defects
- do not treat controller-active state as consumer commit
```