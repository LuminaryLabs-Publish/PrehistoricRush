# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T02-48-17-04-00`

## Plan ledger

**Goal:** Keep streamed-world activation, run-session reset, asynchronous admission, render/physics parity and lifecycle risks explicit before content or visual expansion.

- [x] Retain the seeded-patch admission and activation gaps.
- [x] Add run/world ownership and retry gaps.
- [x] Add stream epoch and stale-result gaps.
- [x] Add dynamic-content and first-frame parity gaps.
- [x] Retain creature, composition, command and lifecycle gaps.
- [x] Rank the implementation order.

## Patch content and activation

```txt
- patch payload has no explicit product schema version
- terrain arrays, matrices, IDs and bounds are trusted without typed admission
- controller-active is committed before consumer-active
- terrain, trees, grass, shards, gameplay colliders, Rapier colliders and height commit sequentially
- no detached plan, shared revision, rollback or acknowledgement exists
- release is also a live partial mutation
```

## Run-session reset

```txt
- game.start resets RunState and InputState only
- no runSessionId distinct from runId exists
- no typed start/reset transaction exists
- no retained/reset/rebuilt policy exists per owner
- activePatches, terrain slots and tree cells have no run-session reconciliation result
- grass/shard visibility may remain stale when retry causes no activation or release
- gameplay and Rapier collider projections have no reset acknowledgement
- actor/contact state has no explicit retry reset
- camera interpolation, render time and shard rotation continue across runs
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

## World-cache ownership

```txt
- deterministic patch cache and run-owned dynamic state are not classified separately
- no explicit policy decides cache retention across retry
- no cache-retention fingerprint or result exists
- clearing cache would be wasteful, while retaining consumer state is unsafe
- active terrain/tree reuse versus re-commit behavior is undeclared
```

## Render and population

```txt
- one patch activation rebuilds all active grass and shard matrices
- one activation resubmits the entire fixed-collider set
- terrain bounding volumes recompute on the main thread
- every tree batch flushes on activation/release
- grass overflow truncates without rejected IDs
- terrain-slot exhaustion reuses slot zero
- no render frame carries run session, stream epoch or activation revision
- GPU/resource disposal remains absent
```

## Gameplay readiness

```txt
- fallback and patch height sources have no continuity result
- desired but inactive patches have no active hazards or pickups
- no forward safety-ring readiness policy exists
- Rapier and manual collision checks are separate unclassified outcome sources
- collision rows do not retain patch/collider/session identity
- pickup render/gameplay/collection/reset parity is not journaled
```

## Input, commands and frames

```txt
- Enter, Space and button starts call game.start directly
- start/retry has no command ID, rejection reason or transaction result
- key listeners and RAF have no session owner or removal ledger
- no committed frame ties run, stream, pose, physics, render and HUD state
- duplicate or stale start requests have no admission policy
```

## Observation

```txt
- host exposes mutable engine, physics, adapter and controller references
- host reports controller-active IDs but not consumer-active/run-admitted IDs
- runSessionId, streamEpoch and reset decisions are absent
- stale Worker results and dynamic-content rebuild outcomes are absent
- first post-reset render/physics parity is absent
- no bounded run/stream lifecycle journal exists
```

## Validation

```txt
- no root package.json or unified validation command
- no patch admission/activation fixture
- no retry reset fixture
- no stream epoch/stale result fixture
- no pickup/collider/height first-frame parity fixture
- no lifecycle/disposal fixture
- no browser or Pages streaming smoke
```

## Prior active gaps

```txt
- creature descriptor, render binding, pose and collision proof remain absent
- twelve core kits have no consumed/replaced/unused ledger
- typed run commands and transition-result journal remain absent
- module graph fingerprint remains absent
```

## Priority

```txt
1. patch-content admission and atomic activation
2. run-session reset and world-cache retention policy
3. Worker/stream epoch, inflight ceiling and stale-result quarantine
4. dynamic pickup/collider/height/render reconciliation
5. controller/consumer/run-session parity and lifecycle observation
6. creature and core-kit consumption proof
7. typed commands and committed frames
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not duplicate seeded-world-patch-controller-kit
- do not duplicate instanced-render-batch-kit
- do not increase active radius or population
- do not clear deterministic caches merely to hide reset defects
- do not treat a changed runId as a completed reset
```
