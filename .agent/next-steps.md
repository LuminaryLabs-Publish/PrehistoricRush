# Next Steps: PrehistoricRush

**Updated:** `2026-07-10T18-01-03-04-00`

## Next safe ledge

```txt
PrehistoricRush Runtime Dependency Admission + Single-Owner Session Lifecycle Fixture Gate
```

## Goal

Make external runtime selection, frame ownership, session start/restart, and teardown deterministic and observable without changing the current visual target, movement feel, terrain generation, or content.

## Plan ledger

- [ ] Replace the mutable `NexusRealtime-ProtoKits@main` physics-kit URL with an immutable repository/commit source.
- [ ] Add a runtime dependency registry for Three.js, Rapier, and the physics kit.
- [ ] Classify each dependency as required, optional, or fallback-capable.
- [ ] Return typed `RuntimeDependencyResult` rows with requested source, admitted source, version/revision, capabilities, status, and reason.
- [ ] Fail boot immediately and clearly when required Three.js admission fails.
- [ ] Make Rapier/physics fallback an explicit policy result rather than a silent null path.
- [ ] Add one runtime source/provenance fingerprint to host readback.
- [ ] Select one source-frame owner and drive `domainHost.tick()` once per frame.
- [ ] Convert the secondary presentation RAF into a phase consumer and accept one render commit per frame.
- [ ] Emit `runner.moved` from the authoritative movement phase.
- [ ] Consume dino pose, camera, and HUD domain services instead of duplicating them.
- [ ] Add `SessionStartResult`, `SceneTransitionResult`, and `RestartTransaction`.
- [ ] Recreate session state for Retry / Run Again while preserving best distance.
- [ ] Add a runtime lifecycle owner with `mount`, `start`, `stop`, `dispose`, and `snapshot`.
- [ ] Retain and remove resize/keyboard listener handles.
- [ ] Cancel both RAF chains during disposal.
- [ ] Dispose renderer, geometries, materials, instanced meshes, and physics resources.
- [ ] Collect event-bus/domain teardown callbacks.
- [ ] Expose detached JSON-safe dependency, frame, session, and lifecycle observations.
- [ ] Add DOM-free admission, frame, restart, and dispose/remount fixtures.
- [ ] Add a root validation command only after fixtures exist.

## Existing owners to update first

```txt
src/runtime-terrain-v6.mjs
  module loading, runtime setup, input, simulation, presentation, renderer, physics, host

src/game.js
  composition, presentation pass, scheduler/domain integration, composition lifecycle

src/domain-runtime/tick-scheduler.js
  cancellable RAF ownership and lifecycle snapshot

src/domain-runtime/domain-host.js
  optional dispose fan-out

src/domain-runtime/event-bus.js
  listener/history reset and composition disposal
```

## New shared capability only where justified

```txt
src/runtime/runtime-dependency-registry.js
src/runtime/runtime-dependency-result.js
src/runtime/runtime-source-provenance.js
src/runtime/frame-authority.js
src/runtime/render-commit.js
src/runtime/session-transaction.js
src/runtime/runtime-lifecycle.js
src/runtime/host-snapshot.js
```

## Required fixture assertions

```txt
same source request resolves the same immutable module revision
required Three.js failure returns boot_rejected before setup
Rapier failure returns explicit fallback_admitted with reason
host snapshot reports requested/admitted sources and capabilities
one sourceFrameId drives one domain tick and one accepted render commit
Retry / Run Again create new session IDs and reset transient state
best distance survives restart
mount registers bounded listener/RAF/resource ownership
first dispose cancels loops and releases resources once
second dispose is idempotent
remount creates one listener set, one frame owner, and one renderer
host snapshot is detached and JSON-safe
```

## Stop conditions

Do not begin visual expansion, terrain replacement, movement retuning, new content, renderer extraction, or ProtoKit promotion until admission, frame, restart, and lifecycle fixtures pass.