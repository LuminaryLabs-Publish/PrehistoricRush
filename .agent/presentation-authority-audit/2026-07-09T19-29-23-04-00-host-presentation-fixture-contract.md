# Presentation Authority Audit: Host Presentation Fixture Contract

**Timestamp:** `2026-07-09T19-29-23-04-00`

## Authority question

The project has two presentation authorities today:

```txt
src/runtime-terrain-v6.mjs
  -> owns baseline raptor pose, camera, HUD, and renderer frame

src/game.js
  -> owns readability raptor stride, close camera, readability HUD, and second renderer frame
```

Neither path exposes a fixture-readable `PresentationFrameRecord`.

## Existing useful pieces

```txt
createEventBus
  -> event history and wildcard listener support

PrehistoricRushComposition.snapshot
  -> domain/event/scheduler readback

dino-pose-domain-kit
  -> accepts runner.moved and emits dino.pose.changed

camera-domain-kit
  -> defines close third-person camera preset

hud-domain-kit
  -> defines target distance and structured HUD projection
```

## Missing contract

```txt
PresentationEvent
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
ContactResultSnapshot
SceneDispatchResult
RenderReadback
PresentationFrameRecord
PresentationJournalSnapshot
HostPresentationSnapshot
```

## Host target

Extend `PrehistoricRushHost.getState()` additively:

```txt
{
  scene,
  runner,
  physics,
  terrain,
  renderer,
  presentation: {
    version,
    latestFrame,
    journalLength,
    recentFrames,
    eventCounts,
    fixtureContract
  }
}
```

Do not remove or rename existing host fields.

## Fixture target

Add `scripts/prehistoric-rush-presentation-frame-fixture.mjs` after source modules exist.

Fixture rows should assert:

```txt
runner.moved payload shape
DinoPoseFrame shape
camera request shape
HUD request shape
scene dispatch status
render readback shape
host presentation snapshot shape
legacy Host fields still present
```

## Safe implementation order

```txt
1. Add pure presentation modules under src/presentation/.
2. Add DOM-free fixture rows for pure modules.
3. Wire runtime-terrain-v6 movement into RunnerMovedEvent without changing feel.
4. Let dino-pose-domain-kit consume event output for readback first.
5. Add additive PrehistoricRushHost.getState().presentation.
6. Add package validation only after fixture exists.
```
