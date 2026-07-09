# Presentation Authority Audit: Central Catch-up Host-State Fixture Contract

**Timestamp:** `2026-07-09T09-10-50-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Authority statement

Presentation proof should be added before presentation authority is moved.

The current live route should remain visually stable while the bridge records what state was consumed and what presentation descriptors were produced.

## Current state

```txt
runtime-terrain-v6.mjs owns:
  runner state
  input state
  speed/yaw/jump integration
  terrain updates
  collider/pickup state
  scene transition state
  baseline raptor animation
  baseline camera update
  baseline HUD render
  baseline renderer submission

src/game.js owns:
  composition scaffold
  dino/camera/HUD descriptor kits
  secondary readability presentation pass
  legacy composition snapshot
```

## Missing authority contract

```txt
runner-source-state contract missing
runner-step-delta contract missing
runner-moved-event contract missing
presentation-frame contract missing
presentation-journal contract missing
host-presentation-snapshot contract missing
DOM-free fixture contract missing
```

## Additive host shape

Next implementation should add this without removing current host fields:

```txt
PrehistoricRushHost.getState().presentation = {
  version,
  latestFrame,
  journal,
  runnerSource,
  runnerDelta,
  runnerMoved,
  dinoPose,
  cameraRequest,
  hudRequest,
  contact,
  sceneDispatch,
  renderReadback
}
```

## Required fixture assertions

```txt
1. legacy getState().scene remains present
2. legacy getState().runner remains present
3. legacy getState().physics remains present or null/fallback-safe
4. legacy getState().terrain.chunks remains present
5. legacy getState().renderer remains present
6. getState().presentation exists after bridge init
7. first movement frame emits runner.moved
8. dino-pose-domain-kit consumes runner.moved
9. event history contains runner.moved and dino.pose.changed
10. latestFrame records camera/HUD/dino/contact/scene/render evidence
11. fixture runs without DOM or WebGL
```

## File-level ledge

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Non-goals

```txt
Do not extract terrain.
Do not replace Rapier.
Do not rewrite movement.
Do not rewrite renderer.
Do not move the raptor rig to a shared package.
Do not promote to ProtoKits before fixture proof.
```
