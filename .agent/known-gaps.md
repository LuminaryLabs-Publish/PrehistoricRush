# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T05-39-11-04-00`

## Summary

The smooth camera implementation fixes the former position-only smoothing and immediate rotation snap. Its remaining risks are target provenance, transform/frame consumption, mutable control-plane exposure, session lifecycle and missing executable proof. Patch activation integrity remains the repository-wide P0.

## Plan ledger

**Goal:** Keep camera, streaming, gameplay, observation and lifecycle risks explicit before further content or visual tuning.

- [x] Record the new shared camera kit and pinned source revision.
- [x] Record target, reset/update, transform and frame gaps.
- [x] Retain patch activation and run-session P0/P2 gaps.
- [x] Rank implementation order.
- [ ] Close gaps with typed results and fixtures.

## Camera target policy

```txt
- target arrays are mutated in place
- no CameraTargetDescriptor exists
- target has no target ID or sequence
- target has no run/session epoch
- target has no simulation-frame identity
- target has no route snapshot revision
- target has no patch/height-source revision
- target has no policy version or fingerprint
- non-finite target rejection is not product-visible
```

## Controller admission and results

```txt
- reset/update calls are not wrapped in typed product commands
- stale run/session target rejection is absent
- duplicate update/reset result policy is absent
- requested versus clamped delta time is not journaled
- transform output is a reused mutable object
- no product result binds target sequence to controller revision
- loadSnapshot remains publicly reachable through the exposed controller
```

## Three transform and render consumption

```txt
- applyCameraTransform returns no result
- transform finiteness/normalization is not checked by the adapter
- applied controller revision is not recorded
- applied transform fingerprint is absent
- projection resize revision is absent
- renderer frame ID is absent
- rendered frame does not acknowledge target/controller/application revisions
- first camera frame after run restart is not identified
```

## Camera lifecycle and observation

```txt
- PrehistoricRushHost exposes mutable cameraFollow and adapter owners
- external code can reset/update/load camera state without admission
- controller removal is never called
- no camera/session disposed state exists
- no post-dispose rejection exists
- RAF and listeners have no ownership ledger
- camera journal and bounded detached observation are absent
```

## Camera validation

```txt
- no controller convergence fixture
- no frame-time partition fixture
- no frame-stall clamp fixture
- no run reset fixture
- no teleport reset fixture
- no route-index discontinuity fixture
- no terrain-height discontinuity fixture
- no quaternion normalization fixture
- no transform/frame correlation fixture
- no camera lifecycle fixture
- no browser or Pages camera smoke
```

## Patch activation remains P0

```txt
- controller marks ready patches active before consumer commit
- release evidence clears before retirement succeeds
- terrain/tree/grass/shard/collider/height consumers mutate sequentially
- no detached prepare plan, shared revision, rollback or acknowledgement
- controller-active does not prove render/physics/gameplay readiness
```

## Run session and asynchronous execution

```txt
- no runSessionId distinct from runId
- no shared streamEpoch/cameraEpoch
- Worker stale-result quarantine is absent
- retry does not own an ordered world/camera reset transaction
- first committed world and camera frame of a new run is not identified
```

## General lifecycle

```txt
- RAF ID is not retained
- listeners are anonymous/unowned
- Worker is not terminated
- renderer, geometries and materials are not disposed
- physics world is not terminally disposed
- global host exposure has no release lease
```

## Priority

```txt
1. acknowledged multi-consumer patch activation/release
2. camera target/transform/render-frame consumption proof
3. run-session reset with stream and camera epochs
4. Worker stale-result quarantine
5. ordered runtime disposal
6. creature/core-kit/typed-command proof
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not duplicate camera-smooth-follow-kit
- do not reintroduce immediate lookAt rotation
- do not tune around missing source/frame provenance
- do not treat camera snapshot revision as render acknowledgement
```
