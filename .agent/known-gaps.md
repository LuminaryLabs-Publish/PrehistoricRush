# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T12-39-53-04-00`

## Summary

Route/profile authority remains P0. This pass adds the exact browser runtime lifecycle gaps: startup has no rollback ledger, retry has no shared epoch, RAF/listeners are unowned, Worker/executor callbacks are not quarantined, Three/Rapier resources are not disposed, and the global host cannot be revoked.

## Plan ledger

**Goal:** keep route, profile, patch, session, callback, Worker, physics, render and host-lifecycle risks explicit before runtime implementation proceeds.

- [x] Preserve route/profile gaps.
- [x] Preserve patch activation and visual identity gaps.
- [x] Record startup rollback and partial-acquisition risks.
- [x] Record retry, epoch and stale Worker-result risks.
- [x] Record RAF, listener, Worker, Three, Rapier and host disposal gaps.
- [ ] Close gaps through one session authority and executable fixtures.

## Route and profile gaps

```txt
- game.html and charactercreator.html are absent
- the game does not consume the saved profile
- profile writes have no transaction/fingerprint/conflict authority
- creator debounce can persist only the last captured group patch
- profile subscriptions and BroadcastChannel are not page-lifecycle owned
- creator preview, creature, collision and frame do not share identity
```

## Patch activation gaps

```txt
- controller marks ready patches active before consumer acknowledgement
- terrain, trees, grass, shards, colliders and height mutate sequentially
- no detached activation plan, rollback or shared consumer revision
- release evidence clears before retirement acknowledgement
- controller-active and consumer-active parity is not proved
```

## Startup transaction gaps

```txt
- main() acquires modules and resources without a startup command/result
- no runtimeSessionId or lifecycle phase exists
- no cleanup stack records acquired resources
- partial construction failure has no reverse rollback
- fatal UI replacement can occur while Worker/GPU/physics resources remain live
- public host publication is not tied to a successful startup commit
```

## Retry and epoch gaps

```txt
- start() reuses the same controller, Worker, executor and adapters
- no runSessionId is allocated by the host
- no streamEpoch fences queued/inflight patch generation
- Worker requests/responses carry requestId but no session/run/stream identity
- controller ready/release delivery can outlive the run that requested it
- input, physics contacts, adapter time and all dynamic consumer state lack one reset result
```

## RAF and listener gaps

```txt
- RAF request ID is not retained
- loop always schedules the next frame
- no stop flag or generation fence exists
- button.onclick has no lease/result
- keydown, keyup, blur and resize callbacks are not removable through an owner
- no pagehide/beforeunload/explicit-stop lifecycle handler exists
- callbacks do not reject DISPOSING or DISPOSED state
```

## Worker and executor gaps

```txt
- Worker is created and retained but never terminated
- executor disposal is not retained or invoked
- Worker protocol has no cancel, shutdown or shutdown acknowledgement
- late patch-generated/patch-error messages have no epoch rejection
- fallback synchronous generation is not described by the same lifecycle result
- inflight request count at retry/dispose is not observed
```

## Three resource gaps

```txt
- createThreeAdapter returns no dispose service
- renderer.dispose is not called
- renderer canvas is not explicitly removed
- terrain geometries/material are not disposed
- tree geometries/materials and instance buffers are not disposed
- grass geometries/shader materials are not disposed
- shard geometry/material is not disposed
- creature geometry/material/skeleton resources are not disposed
- camera/light/scene ownership has no terminal result
```

## Rapier resource gaps

```txt
- Rapier adapter returns only the public API
- actor/fixed-collider/world disposal is not called
- pending contacts and actor transform state have no terminal reset result
- no proof prevents physics stepping after disposal begins
- physics revision is not correlated with lifecycle phase
```

## Public host gaps

```txt
- PrehistoricRushHost exposes live engine, physics, adapter, controller and camera owners
- no host lease or capability revocation exists
- no detached clone-safe read model exists
- no disposed-state marker invalidates old references
- no bounded lifecycle/resource journal exists
```

## Missing proof matrix

```txt
page-manifest and profile handoff
patch prepare/commit/rollback parity
startup success and partial-failure rollback
single RAF and listener lease ownership
retry run/stream epoch separation
late Worker response rejection
Worker/executor termination
Three resource disposal counts
Rapier terminal disposal/reset
public host revocation
idempotent repeated dispose
post-dispose input/tick/render rejection
browser pagehide lifecycle smoke
```

## Priority

```txt
1. route artifact integrity and profile handoff
2. patch activation transaction
3. run/session/stream epoch authority
4. startup rollback and callback ownership
5. Worker/Three/Rapier ordered disposal
6. host revocation and lifecycle observation
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not add another lifecycle owner per adapter
- do not rely on reload/browser destruction as cleanup proof
- do not terminate only the Worker and leave executor callbacks admitted
- do not claim retry isolation without epoch and stale-result fixtures
```
