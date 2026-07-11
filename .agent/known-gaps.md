# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T14-31-27-04-00`

## Summary

Route/profile authority remains P0. Patch activation/release and fixed-collider retirement remain the next runtime prerequisites. This pass adds the P2 committed-frame gap: the browser mutates simulation, streaming, physics, gameplay, camera and presentation without one frame identity or immutable record shared by the canvas, HUD and public host.

## Plan ledger

**Goal:** keep route, profile, patch, collision, frame, epoch and lifecycle risks explicit before implementation.

- [x] Preserve route/profile gaps.
- [x] Preserve patch activation and collider retirement gaps.
- [x] Record frame-stage and public-host coherence gaps.
- [x] Record missing render/HUD failure results.
- [x] Record the required fixture matrix.
- [ ] Close gaps through existing domain owners rather than parallel systems.

## Route and profile gaps

```txt
- game.html and charactercreator.html are absent
- game does not consume the saved profile as its creature source
- profile writes lack transaction, fingerprint and conflict authority
- creator, creature, collision and frame do not share one profile identity
```

## Patch activation and release gaps

```txt
- controller ready/release evidence precedes consumer acknowledgement
- terrain, trees, grass, pickups, colliders and height mutate sequentially
- no detached activation/release plan, rollback or shared consumer revision
- no release result proves every consumer retired the patch
- controller-active and consumer-active parity is not fixture-proven
```

## Fixed collider and collision gaps

```txt
- setFixedColliders is add/update rather than authoritative replacement
- live Rapier maps retain removed IDs
- removed bodies/colliders are not removed from the world
- contact observations lack patch, membership, source and edge identity
- product admits any dino contact as fatal
- Rapier and XZ fallback are divergent collision authorities
- patch release does not wait for physics retirement
```

## Committed frame gaps

```txt
- no runtime frame ID exists
- no simulation-step receipt exists
- no stream or collider revision is correlated to rendering
- no physics-step receipt is correlated to gameplay or rendering
- collision, pickup and terminal mutations have no ordered frame receipts
- no immutable presentation-state fingerprint exists
- camera update has no consumed-frame receipt
- renderer.render returns no product-level result
- HUD/button writes return no commit result
- no last-committed-frame pointer exists
- no failed-frame result exists
```

## Public host gaps

```txt
- host exposes mutable engine, physics, adapter, controller and camera owners
- getState independently samples game, streaming and camera state
- host can observe a state that was never presented as one frame
- no runtimeSessionId, runSessionId or committedFrameId is exposed
- no host lease or revocation result exists
- readback is not a detached immutable frame record
```

## Failure-path gaps

```txt
render failure:
  simulation and other owners may already be advanced
  previous canvas remains visible
  HUD is not updated
  no next RAF is scheduled
  host remains published

HUD failure:
  canvas may advance while HUD remains stale
  no commit/failure record identifies the split
```

## Run/session and lifecycle gaps

```txt
- retry has no shared runtime/run/stream/collider/frame epoch family
- stale Worker responses, contacts and frame receipts are not fenced
- RAF, listeners, Worker, executor, Three and Rapier owners remain unbounded
- no startup rollback or ordered idempotent disposal result exists
- public host cannot be revoked before resource disposal
```

## Missing proof matrix

```txt
page manifest and profile handoff fixture
patch activation/release parity fixture
fixed collider exact-replacement fixture
released-patch collision fixture
contact admission and collision-source parity fixtures
committed frame record fixture
render failure fixture
HUD failure fixture
host interleaved-read fixture
frame journal JSON/bounds fixture
retry stale-frame receipt fixture
runtime lifecycle/disposal fixture
Pages frame-coherence smoke
```

## Priority

```txt
1. route artifact integrity and profile handoff
2. patch activation/release transaction
2a. fixed collider retirement and collision admission
3. committed frame observation and host read model
4. shared runtime/run/stream/collider/frame epochs
5. runtime lifecycle, disposal and host revocation
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not add a second runtime, physics, render or diagnostics owner
- do not treat mutable host aggregation as frame evidence
- do not publish a frame before render and HUD both succeed
- do not claim frame coherence without failure and interleaving fixtures
```