# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T21-00-00-04-00`

## Summary

The page hosts, shared creature adapter and game profile handoff now exist. The leading profile gap is narrower and more concrete: creator edits, durable profile commits, preview transition state, viewport framing and visible-frame status do not share one authority.

## Plan ledger

**Goal:** keep every unresolved creator, streaming, collision, cadence, readiness, frame, reset and lifecycle dependency explicit.

- [x] Retire outdated claims that `game.html` and `charactercreator.html` are absent.
- [x] Confirm gameplay now consumes the saved creature profile.
- [x] Add creator draft-loss, preview-state and viewport-fit gaps.
- [x] Preserve patch, collider, cadence, readiness, frame, reset and lifecycle gaps.
- [x] Add creator fixture requirements.
- [ ] Close gaps through existing owners in dependency order.

## Resolved or substantially advanced since earlier audits

```txt
game.html exists
charactercreator.html exists
menu routes to both pages
game loads the saved player profile
profile.creature is passed into the product kit graph
creator and game use the same pinned creature generator
creator and game use the same Three procedural-creature adapter
creator preview is a real SkinnedMesh
compatible descriptors damp geometry, color, material and scale
topology changes crossfade through a second SkinnedMesh
creator UI is condensed and centered
```

## Character creator draft gaps

```txt
no draftId or draftRevision
no accumulated dirty-field set
160 ms timer captures only the latest partial patch
cancelling a timer can discard an earlier unsaved group edit
flush reloads storage instead of committing the complete canonical draft
no predecessor-revision compare-and-swap
no typed accepted/conflict/rejected profile result
no flush-on-page-leave policy
no failed-write retry state
no distinction between local draft and durable profile status
```

## Preview transition gaps

```txt
unsaved drafts reuse the stored profile revision
targetRevision can equal appliedRevision while geometry is still damping
Ready is inferred from revision equality rather than descriptor convergence
no descriptor fingerprint or descriptor revision
no mesh revision or transition result
crossfade state has no visible-frame acknowledgement
profile write success is not correlated with applied mesh state
Saved and Ready can describe different effective states
```

## Preview framing gaps

```txt
framing reads local BufferGeometry boundingBox
bounds describe bind-pose geometry, not animated skinned extents
mesh rotation and full world transform are not applied to the center
crossfade framing observes only the current mesh, not union bounds
fit uses one max-span scalar and fixed multiplier
horizontal field of view is ignored
viewport aspect ratio is ignored by the fit calculation
screen-space margins are not measured or acknowledged
near/far plane fit is not validated
no viewportRevision or cameraFitRevision exists
no portrait/square/wide fit fixture exists
```

## Profile and game parity gaps

```txt
profile writes lack canonical fingerprint and conflict authority
creator frame does not expose profile fingerprint
game host does not expose the admitted profile fingerprint
collision recommendation is consumed but not correlated to profile revision
no fixture proves creator descriptor equals gameplay descriptor
cross-tab updates can replace a draft without a merge/conflict result
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
RAF count remains the stream-work clock
generation and activation limits are per frame, not per elapsed time
30/60/120 Hz admit different work per second
simulation dt clamps at 0.05 without a typed lost-time result
browser visibility is absent from stream admission
hidden-tab completions lack bounded catch-up
backlog age and starvation are not observed
no cadence revision links simulation, physics, stream and render
```

## World-readiness and movement-admission gaps

```txt
engine.tick moves before streaming readiness is evaluated
required route-ahead corridor is not identified
sampleHeight silently uses fallbackHeight when patch data is absent
missing terrain, colliders, pickups and render data are not classified
no ready/degraded/capped/deferred/failed result
no shared readiness revision across movement, physics and render
```

## Committed-frame and host gaps

```txt
no gameplay frame identity or ordered stage receipts
render and HUD have no product commit results
no committed/failed gameplay-frame pointer
host independently samples mutable owners
host exposes raw engine, physics, adapter, controller and camera
creator and gameplay hosts do not report profile/frame parity
```

## Run/reset epoch gaps

```txt
no runtimeSessionId or runSessionId
no streamEpoch, colliderEpoch, workerGeneration or frameEpoch
controller/cache/queue/Worker survive retry
active patch and consumer maps survive retry
Rapier world/actor/colliders survive retry
old responses, contacts and frames are not rejected
host-level input booleans are not explicitly cleared on retry
```

## Missing proof matrix

```txt
creator rapid multi-group edit fixture
creator full-draft debounce flush fixture
profile predecessor conflict fixture
preview revision-state fixture
preview topology-crossfade fixture
portrait/square/wide viewport fit fixtures
Saved/Ready visible-frame fixture
creator/game profile fingerprint parity fixture
route and deployed-page fixture
patch activation/release parity fixture
exact collider replacement fixture
collision admission fixture
30/60/120 cadence parity fixture
hidden-tab resume and backlog starvation fixtures
required corridor and world-readiness fixture
committed gameplay-frame coherence fixture
retry pickup reprojection and stale-work fixtures
runtime lifecycle/disposal fixture
browser and Pages creator smoke
```

## Priority

```txt
1. route artifact and profile handoff final proof
1a. creator draft, commit and preview-frame authority
2. patch activation/release transaction
2a. collider retirement and collision admission
2b. stream cadence and time-budget authority
2c. world readiness and movement admission
3. committed gameplay-frame observation
4. run/stream/collider/Worker/frame epoch reset
5. runtime lifecycle and disposal
```

## Do not do next

```txt
do not work on TheCavalryOfRome
do not create a branch
do not add a second profile store, creature generator or preview RAF
do not persist only the final partial patch
do not treat profile revision equality as descriptor or frame completion
do not use another fixed camera-distance multiplier as viewport proof
do not duplicate the shared Three creature adapter
do not treat desired patch membership as world readiness
do not allow unbounded hidden-tab catch-up
```