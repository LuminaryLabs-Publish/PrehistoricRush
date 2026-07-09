# PrehistoricRush Next Steps

**Updated:** `2026-07-09T09-02-44-04-00`

## Next safe ledge

Build the host-state event bridge and presentation fixture gate without changing the visible route.

```txt
PrehistoricRush Host-State Event Bridge + Presentation Fixture Gate
```

## Preserve first

```txt
preserve index.html
preserve src/runtime.mjs
preserve src/game.js route composition
preserve current Three.js/Rapier look and feel
preserve current PrehistoricRushComposition.snapshot()
preserve current PrehistoricRushHost.getState() legacy fields
preserve current menu/game/run-over/win flow
preserve current keyboard controls
preserve current camera/HUD readability pass behavior
```

## Implementation order

### 1. Add pure source records

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
```

Required output:

```txt
RunnerSourceState from app.state
RunnerStepDelta from previous/current source state
RunnerMovedEvent payload suitable for eventBus.emit("runner.moved")
```

### 2. Add presentation frame records

```txt
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
```

Required output:

```txt
DinoPoseFrame records pose kit output
CameraFrameRequest records close-camera target inputs
HudFrameRequest records HUD projection inputs
ContactResultSnapshot records collision and pickup state
SceneDispatchResult records menu/game/run-over/win transition reason
RenderReadback records renderer/camera/scene consumption evidence
PresentationFrameRecord bundles one frame of presentation proof
```

### 3. Add journal and host projection

```txt
src/presentation/presentation-events.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
```

Required output:

```txt
bounded presentation journal
latest frame readback
legacy host fields unchanged
PrehistoricRushHost.getState().presentation added additively
```

### 4. Add DOM-free fixture

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

Fixture rows:

```txt
menu idle
game first movement frame
turn left
turn right
boost
jump start
jump recover
shard pickup
collision run-over
win threshold
render readback unchanged
host legacy fields unchanged
```

### 5. Add package validation only if package.json exists or is introduced intentionally

There is no root `package.json` in the current source read. Do not invent an npm workflow unless the implementation pass intentionally adds the fixture script and package metadata together.

## Acceptance criteria

```txt
1. runtime-terrain-v6 remains visually stable.
2. src/game.js still imports runtime-terrain-v6.
3. eventBus emits runner.moved from live state deltas.
4. dino-pose-domain-kit consumes live runner.moved events.
5. eventBus history contains runner.moved and dino.pose.changed rows after a movement frame.
6. PrehistoricRushHost.getState().presentation exists.
7. PrehistoricRushHost.getState() existing scene, runner, physics, terrain, and renderer fields remain stable.
8. DOM-free fixture can replay representative source records and assert output shape.
9. The presentation proof layer does not own movement, collision, terrain, renderer, or physics behavior.
```

## Promotion rule

Keep the bridge repo-local until the fixture proves a stable reusable API candidate. Promote to ProtoKits only after host projection and fixture rows are stable.
