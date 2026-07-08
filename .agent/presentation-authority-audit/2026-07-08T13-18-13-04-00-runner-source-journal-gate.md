# PrehistoricRush Runner Source Journal Gate

**Timestamp:** `2026-07-08T13:18:13-04:00`

## Gate

```txt
PrehistoricRush Runner Source Journal + Contact/Scene Result Fixture Gate
```

## Why this gate exists

The repo already has a clean composition scaffold and readable visual route.

The remaining problem is that the runtime cannot prove, without DOM/WebGL/Rapier execution, what source state produced the current camera, HUD, dino pose, contact, scene transition, and host diagnostics.

## Additive source journal target

```txt
src/presentation/runner-source-state.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Required result chain

```txt
RunnerSourceState
  -> RunnerMovedEvent
  -> runner.moved
  -> dino.pose.changed
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> PresentationFrameRecord
  -> PresentationJournalSnapshot
  -> PrehistoricRushHost.getState().presentation
```

## Acceptance criteria

```txt
- Fixture can project source state without DOM.
- Fixture can prove menu/no-move does not emit runner.moved.
- Fixture can prove game movement emits runner.moved.
- Fixture can prove runner.moved reaches dino-pose-domain-kit.
- Fixture can prove camera request matches close-third-person-v1 policy.
- Fixture can prove HUD request matches readability-hud-v1 policy.
- Fixture can prove hazard contact records run-over before scene mutation.
- Fixture can prove pickup contact records shard transaction before score mutation.
- Fixture can prove win threshold records win scene dispatch before scene mutation.
- Host snapshot exposes latest and recent presentation records.
- Existing visible route remains unchanged.
```

## What not to do inside this gate

```txt
- Do not rewrite the runner.
- Do not replace the renderer.
- Do not promote to ProtoKits yet.
- Do not add new terrain, enemies, or UI polish.
- Do not change tuning.
- Do not require browser runtime for source projection tests.
```

## Exit condition

The gate is complete when a local fixture can replay representative source rows into stable presentation and result records, and the browser route still exposes the same `PrehistoricRushComposition.snapshot()` and `PrehistoricRushHost.getState()` surfaces with an added `presentation` diagnostic branch.
