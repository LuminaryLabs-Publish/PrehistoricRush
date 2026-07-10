# Next Steps: PrehistoricRush

**Updated:** `2026-07-10T16-28-47-04-00`

## Next safe ledge

```txt
PrehistoricRush Single Frame Authority + Restart Transaction Fixture Gate
```

## Goal

Make one runtime frame and one lifecycle transaction authoritative without changing the current visual target, movement feel, terrain generation, or content.

## Plan ledger

- [ ] Add a pure frame authority module with monotonic `sourceFrameId`.
- [ ] Define ordered phases: input, simulation, contact/pickup, scene, pose, camera, HUD, render.
- [ ] Select one driver: either the repo-local scheduler or a single live runtime RAF adapter.
- [ ] Remove the second independent render commit by converting the presentation pass into a phase consumer.
- [ ] Emit `runner.moved` from the authoritative movement phase.
- [ ] Consume `dino-pose-domain-kit`, `camera-domain-kit`, and `hud-domain-kit` descriptors/services instead of duplicating values.
- [ ] Add `RenderCommitResult` with accepted/skipped reason and source frame.
- [ ] Add `SceneTransitionResult` for start, run-over, win, retry, and run-again.
- [ ] Add `RestartTransaction` that recreates session state while preserving best distance.
- [ ] Add a detached JSON-safe host snapshot.
- [ ] Add runtime source/manifest consumption metadata.
- [ ] Add a DOM-free fixture proving frame and restart invariants.
- [ ] Add a root validation command only after the fixture exists.

## Suggested files

```txt
src/runtime/frame-authority.js
src/runtime/frame-transaction.js
src/runtime/frame-phases.js
src/runtime/render-commit.js
src/runtime/scene-transition-result.js
src/runtime/restart-transaction.js
src/runtime/runtime-source-manifest.js
src/runtime/host-snapshot.js
scripts/prehistoric-rush-frame-authority-fixture.mjs
```

## Required frame fixture assertions

```txt
sourceFrameId increments once per simulation step
domainHost.tick is called exactly once per source frame
input snapshot is frozen for the frame
movement emits one runner.moved event
pose, camera, and HUD consume the same sourceFrameId
exactly one render commit is accepted per sourceFrameId
duplicate render request is skipped with a reason
host snapshot is detached and JSON-safe
```

## Required lifecycle fixture assertions

```txt
menu start creates a fresh session
run-over records a typed cause
retry creates a new session id
retry resets distance, position, velocity, jump, collected pickups, and contact state
retry preserves best distance
win records a typed cause
run-again creates a new session id and resets distance below the win threshold
menu transition follows the manifest contract or the manifest is explicitly deprecated
```

## Stop conditions

Do not begin visual expansion, terrain replacement, movement retuning, new content, or kit promotion until the single-frame and restart fixtures pass.
