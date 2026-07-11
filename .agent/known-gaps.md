# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T19-09-25-04-00`

## Summary

The game retains unresolved route/profile, patch, collider, cadence, world-readiness, frame, reset and lifecycle gates. This audit adds a concrete P1b gap: movement is time-based while patch request starts and activation are frame-count based.

## Plan ledger

**Goal:** keep every prerequisite and cadence risk explicit so implementation extends existing owners in dependency order.

- [x] Preserve route/profile gaps.
- [x] Preserve patch activation/release gaps.
- [x] Preserve collider/collision gaps.
- [x] Add stream cadence and time-budget gaps.
- [x] Preserve world-readiness, committed-frame, reset-epoch and lifecycle gaps.
- [x] Add cadence fixture requirements.
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

## Stream cadence and time-budget gaps

```txt
RAF count is the stream-work clock
Worker generation starts are capped per frame, not per elapsed time
fallback generation starts are capped per frame, not per elapsed time
ready patch activation is capped per frame, not per elapsed time
30/60/120 Hz produce different work admitted per second
simulation dt clamps at 0.05 without a declared lost-time result
browser visibility is not part of stream admission
hidden-tab Worker completions have no bounded catch-up policy
ready backlog age and starvation are not observed
no cadence revision links simulation, physics, stream and render
no first-visible-frame cadence acknowledgement exists
```

## Concrete refresh-rate path

```txt
same player speed and route
  -> 30 Hz client activates at most 30 patches/second
  -> 60 Hz client activates at most 60 patches/second
  -> 120 Hz client activates at most 120 patches/second
  -> route-ahead readiness differs by display cadence
```

With Worker execution, generation starts are limited to two per RAF. Fallback execution is limited to one per RAF.

## Throttling and suspension gaps

```txt
wall delta above 0.05 is discarded from simulation
no fixed-step accumulator or typed time-drop result exists
no hidden-state admission barrier exists
no stream-credit cap exists
no resume revision exists
no stale pre-suspend result rejection exists
no bounded catch-up plan exists
```

## World-readiness and movement-admission gaps

```txt
engine.tick moves before updateStreaming evaluates readiness
required route-ahead corridor is not identified
sampleHeight silently uses fallbackHeight when patch is absent
missing patch terrain, colliders, pickups and render data are not ready
activation can change world authority after actor entry
no ready/degraded/capped/deferred/failed result
no shared patch-readiness revision across movement, physics and render
readiness cannot currently distinguish cadence pressure from content latency
```

## Committed-frame and host gaps

```txt
no frame identity or ordered stage receipts
render and HUD have no product commit results
no committed/failed frame pointer
host independently samples mutable owners
host exposes raw engine, physics, adapter, controller and camera
host does not report cadence revision, budget spent or backlog age
```

## Run/reset epoch gaps

```txt
numeric runId exists only in product RunState
no runtimeSessionId or runSessionId
no streamEpoch, colliderEpoch, workerGeneration or frameEpoch
controller/cache/queue/Worker survive retry
active patch and consumer maps survive retry
Rapier world/actor/colliders survive retry
old responses, contacts and frames are not rejected
```

## Browser input gap

The engine `InputState` is replaced during `game.start()`, but host-level `input.left`, `input.right` and `input.boost` booleans are not cleared. A held or stale browser input can be projected into the first tick of the new run.

## Missing proof matrix

```txt
route/page/profile fixture
patch activation/release parity fixture
exact collider replacement fixture
collision admission fixture
30/60/120 cadence parity fixture
stream time-budget fixture
generation and activation rate fixtures
throttled-frame fixture
hidden-tab resume fixture
backlog starvation fixture
required corridor fixture
delayed/reordered patch delivery fixtures
partial consumer readiness fixture
world-readiness frame-parity fixture
committed-frame coherence fixture
retry pickup reprojection fixture
external input reset fixture
stale Worker/contact/frame fixtures
reset rollback and idempotency fixtures
runtime lifecycle/disposal fixture
browser and Pages refresh-parity smoke
```

## Priority

```txt
1. route/page/profile authority
2. patch activation/release transaction
2a. collider retirement and collision admission
2b. stream cadence and time-budget authority
2c. world readiness and movement admission
3. committed-frame observation
4. run/stream/collider/Worker/frame epoch reset
5. runtime lifecycle and disposal
```

## Do not do next

```txt
do not work on TheCavalryOfRome
do not create a branch
do not add a second RAF, streamer, movement clock or Worker queue
do not use average FPS as a substitute for elapsed-time work admission
do not allow unbounded catch-up credits after hidden-tab suspension
do not let prefetch starve required active patches
do not treat desired membership as readiness
do not silently accept fallbackHeight as authoritative terrain
```