# Presentation Authority Audit: Host Presentation Event Fixture Contract

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T15-31-40-04-00`

## Authority problem

Presentation is currently consumer-owned rather than source-recorded.

```txt
runtime-terrain-v6.mjs
  mutates runner state, scene, contacts, pickups, HUD, raptor pose, and render directly

src/game.js
  applies a second presentation pass directly to camera, rig, HUD, and renderer

PrehistoricRushHost.getState()
  exposes legacy app state but not the presentation facts that caused a visible frame
```

## Required authority split

```txt
source facts
  RunnerSourceState
  RunnerStepDelta
  RunnerMovedEvent
  ContactResultSnapshot
  SceneDispatchResult

consumer requests
  DinoPoseFrame
  CameraFrameRequest
  HudFrameRequest
  RenderReadback

host projection
  PresentationFrameRecord
  PresentationJournalSnapshot
  PrehistoricRushHost.getState().presentation
```

## Compatibility rule

The implementation must remain additive.

```txt
PrehistoricRushHost.getState().scene remains
PrehistoricRushHost.getState().runner remains
PrehistoricRushHost.getState().physics remains
PrehistoricRushHost.getState().terrain remains
PrehistoricRushHost.getState().renderer remains
PrehistoricRushHost.getState().presentation is added
```

## Fixture contract

The DOM-free fixture should run without browser globals and validate pure presentation modules.

```txt
input: synthetic previous/current runner source records
output: frame records and host presentation snapshot
must not import Three.js
must not import Rapier
must not require document/window/requestAnimationFrame
must prove host legacy fields remain compatible by shape contract
```

## First bridge target

The first event to bridge is `runner.moved` because an existing repo-local kit already consumes it.

```txt
RunnerMovedEvent
  -> eventBus.emit("runner.moved", payload)
  -> createDinoPoseDomainKit consumes payload
  -> eventBus emits "dino.pose.changed"
  -> DinoPoseFrame records result
```

## Not first

```txt
Do not make presentation authority own actual rendering yet.
Do not replace the live loop.
Do not promote to shared ProtoKit before the fixture exists.
Do not retune camera or stride while adding the proof path.
```
