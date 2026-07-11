# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T02-41-37-04-00`

## Plan ledger

**Goal:** Keep unresolved streamed-world, creature, composition, command and lifecycle risks explicit so new visual or population work does not bypass the required authority gates.

- [x] Record controller/generator/Worker gaps.
- [x] Record activation and consumer parity gaps.
- [x] Record gameplay readiness gaps.
- [x] Retain prior creature/composition/command/lifecycle gaps.
- [x] Rank the current implementation order.

## Patch content and admission

```txt
- patch payload has no explicit product schema version
- no typed generated-patch admission result exists
- terrain array lengths and finite values are trusted by consumers
- tree, grass, pickup and collider ID uniqueness is not preflighted
- matrix lengths and finite values are not preflighted
- patch bounds are not validated against content
- controller request/cache identity is not revalidated against returned payload
- no patch-content fingerprint is retained in consumer state
```

## Controller and Worker execution

```txt
- generationBudget limits starts per pump call, not explicit concurrent inflight work
- pump is called every RAF and can grow pending Worker requests
- Worker ready acknowledgement is not awaited or exposed
- no streamSessionId/controllerEpoch/workerEpoch exists
- late results after restart/reset/remount have no explicit admission policy
- controller reset does not cancel message-executor pending requests
- executor dispose exists upstream but is not retained or invoked by the host
- Worker pending count and lifecycle state are not exposed
- no post-dispose request rejection path exists at host level
```

## Activation transaction

```txt
- takeReadyPatches marks controller records active before consumer commit
- adapter.activatePatch returns no result
- activePatches mutates before terrain upload
- terrain, trees, grass, shards and colliders commit sequentially
- no detached activation plan exists
- no capacity preflight covers every consumer
- no activation fingerprint or revision exists
- no rollback or repair result exists
- no acknowledgement reconciles controller-active and consumer-active sets
- release is also a sequential live mutation with no result or rollback
```

## Render and population

```txt
- one patch activation rebuilds all active grass and shard matrices
- one patch activation resubmits the entire fixed-collider set
- terrain bounding volumes recompute on the main thread
- every tree type batch flushes on each patch activation/release
- grass layer overflow truncates without rejected IDs or typed result
- terrain-slot exhaustion falls back to reusing slot zero instead of rejecting
- no frame ID records first render of an activation
- no render-consumption fingerprint proves exact active content
- GPU/resource disposal remains absent
```

## Gameplay readiness

```txt
- height sampling switches between fallback math and active patch arrays
- fallback and generated height equivalence is assumed, not proven
- source transitions have no delta/continuity result
- desired but inactive patches have no active hazards or pickups
- no current/forward safety-ring readiness contract exists
- no explicit slow/hold/fallback policy exists when readiness is insufficient
- Rapier contacts and manual distance checks remain separate unclassified failure paths
- collision results do not retain patch/collider/activation identity
- pickup render/gameplay/collection/removal parity is not journaled
```

## Observation

```txt
- host exposes mutable engine, physics, adapter and controller references
- controller snapshot reports controller-active IDs only
- consumer-active patch IDs are absent
- per-consumer admitted/rejected counts are absent
- activation/release results are absent
- Worker ready/pending/lifecycle state is absent
- height-source state is absent
- collider parity and physics revision are absent
- no bounded stream lifecycle journal exists
- host composition and scene fields are not guaranteed clone-safe
```

## Validation

```txt
- no root package.json or unified repository validation command
- no module-graph fixture
- no patch generator determinism/edge fixture
- no controller integration fixture in the product repo
- no Worker protocol/stale-result fixture
- no patch-content rejection fixture
- no activation rollback fixture
- no controller/consumer parity fixture
- no height continuity fixture
- no stream lifecycle/disposal fixture
- no browser or Pages streaming smoke
```

## Prior active gaps

### Creature consumption

```txt
- module graph and preset fingerprints remain absent
- creature descriptor preflight remains absent
- Three render binding, pose and Rapier collision results remain absent
- creature resource lifecycle remains absent
```

### Composition

```txt
- twelve core kits remain installed
- no declared/installed/available/consumed/replaced/unused ledger exists
- several core capabilities remain bypassed or unproven
```

### Commands and frames

```txt
- browser input has no command IDs or typed results
- run start/fail/collect/win and scene transitions lack ordered result journals
- no committed frame ties run, stream, pose, physics, render and HUD state together
- RAF/listener/renderer/physics/global-host teardown remains unowned
```

## Priority

```txt
1. patch-content admission and atomic activation transaction
2. Worker/session identity, inflight ceiling and disposal
3. gameplay stream readiness and height/hazard/pickup fidelity
4. controller/consumer parity journal and JSON-safe observation
5. creature descriptor/render/physics consumption proof
6. core-kit consumption reconciliation
7. typed commands, transitions and committed frames
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not duplicate seeded-world-patch-controller-kit
- do not duplicate instanced-render-batch-kit
- do not increase active radius or population before activation cost and parity are proven
- do not treat Worker generation as elimination of main-thread activation work
- do not treat controller-active IDs as render/physics proof
- do not reintroduce a local procedural creature generator
```
