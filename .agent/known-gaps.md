# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T17-39-47-04-00`

## Summary

The game retains unresolved route/profile, patch, collider, frame, reset and lifecycle gates. This audit adds a concrete P1b gap: movement is committed before the route-ahead patch corridor is proven ready across height, terrain, collision, pickups and rendering.

## Plan ledger

**Goal:** keep every prerequisite and world-readiness risk explicit so implementation extends existing owners in dependency order.

- [x] Preserve route/profile gaps.
- [x] Preserve patch activation/release gaps.
- [x] Preserve collider/collision gaps.
- [x] Add world-readiness and movement-admission gaps.
- [x] Preserve committed-frame, reset-epoch and lifecycle gaps.
- [x] Add fixture requirements.
- [ ] Close gaps through existing domains and kits.

## Route and profile gaps

```txt
game.html and charactercreator.html are absent
game does not consume the saved profile as creature source
profile writes lack transaction/fingerprint/conflict authority
creator, creature, collision and frame do not share profile identity
```

## Patch activation and release gaps

```txt
controller delivery state advances before consumer acknowledgement
terrain, trees, grass, pickups, colliders and height mutate sequentially
no detached plan, rollback or shared membership revision
release does not prove every consumer retired
```

## Collider and collision gaps

```txt
fixed-collider submission is not exact replacement
removed Rapier bodies/colliders can remain live
contacts lack patch/membership/source/epoch identity
Rapier contact and XZ fallback are competing authorities
terminal failure is not a typed single-commit result
```

## World-readiness and movement-admission gaps

```txt
engine.tick moves before updateStreaming evaluates readiness
required route-ahead corridor is not identified
sampleHeight silently uses fallbackHeight when patch is absent
missing patch terrain is not visible
missing patch fixed colliders cannot produce Rapier contacts
missing patch pickups cannot be collected
missing patch trees/grass are absent from render consumers
activation can change height/collision/pickup authority after entry
no ready/degraded/capped/deferred/failed result
no shared patch-readiness revision across movement, physics and render
```

## Concrete simulation-outpaces-stream path

```txt
actor approaches patch P
  -> input admits full forward movement
  -> engine.tick crosses into P
  -> height sampler uses fallback
  -> stream focus follows new position
  -> P generation/activation finishes later
  -> terrain and colliders appear after actor entry
```

## Committed-frame and host gaps

```txt
no frame identity or ordered stage receipts
render and HUD have no product commit results
no committed/failed frame pointer
host independently samples mutable owners
host exposes raw engine, physics, adapter, controller and camera
```

## Run/reset epoch gaps

```txt
numeric runId exists only in product RunState
no runtimeSessionId or runSessionId
no streamEpoch, colliderEpoch, workerGeneration or frameEpoch
controller/cache/queue/Worker survive retry
active patch and consumer maps survive retry
Rapier world/actor/colliders survive retry
RAF and host survive without generation transfer
old responses, contacts and frames are not rejected
```

## Concrete retry projection gap

```txt
previous run collects shard
  -> collected ID filters shard from view.pickups
  -> Retry creates new state with empty collected IDs
  -> active patch IDs remain unchanged
  -> no activation/release occurs
  -> rebuildActiveContent does not run
  -> shard remains absent in the new run
```

## Browser input gap

The engine `InputState` is replaced during `game.start()`, but the host-level `input.left`, `input.right` and `input.boost` booleans are not cleared. A held or stale browser input can be projected into the first tick of the new run.

## Missing proof matrix

```txt
route/page/profile fixture
patch activation/release parity fixture
exact collider replacement fixture
collision admission fixture
required corridor fixture
delayed/reordered patch delivery fixtures
partial consumer readiness fixture
fallback-height policy fixture
movement speed-cap/defer fixture
world-readiness frame-parity fixture
committed-frame coherence fixture
retry pickup reprojection fixture
external input reset fixture
stale Worker/contact/frame fixtures
reset rollback and idempotency fixtures
runtime lifecycle/disposal fixture
browser and Pages stream-latency smoke
```

## Priority

```txt
1. route/page/profile authority
2. patch activation/release transaction
2a. collider retirement and collision admission
2b. world readiness and movement admission
3. committed-frame observation
4. run/stream/collider/Worker/frame epoch reset
5. runtime lifecycle and disposal
```

## Do not do next

```txt
do not work on TheCavalryOfRome
do not create a branch
do not add a second streamer, movement loop, height generator or collision system
do not treat desired/retained/prefetched membership as movement readiness
do not silently accept fallbackHeight as authoritative terrain
do not block on patches outside the bounded required corridor
do not accept partial consumer activation as ready
```
