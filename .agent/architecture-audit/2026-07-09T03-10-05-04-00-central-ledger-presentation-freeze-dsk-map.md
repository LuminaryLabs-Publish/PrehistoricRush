# Architecture Audit: Central Ledger Presentation Freeze DSK Map

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T03-10-05-04-00`

## Current architecture shape

`PrehistoricRush` is currently a hybrid system:

```txt
repo-local DSK scaffold
  + legacy live visual runtime
  + additive presentation readability pass
```

The architecture is good enough to keep the route playable, but it is not yet good enough for fixture proof or shared-kit promotion.

## Live module chain

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
```

`src/game.js` owns composition bootstrap and presentation readability functions.

`src/runtime-terrain-v6.mjs` owns the live game loop and most behavior authority.

## Current DSK map

```txt
composition-bootstrap-domain
  services:
    createEventBus
    createDomainHost
    createTickScheduler
    PrehistoricRushComposition.snapshot
  kits:
    domain-runtime/event-bus
    domain-runtime/domain-host
    domain-runtime/tick-scheduler

dino-domain
  services:
    createDinoFormDomainKit
    createDinoPoseDomainKit
    createDinoMaterialDomainKit
    createDinoDomainBundle
  kits:
    dino-form-domain-kit
    dino-pose-domain-kit
    dino-material-domain-kit
    dino-domain-bundle
  gap:
    dino-pose-domain-kit listens for runner.moved, but live runtime does not emit runner.moved

camera-domain
  services:
    createCameraDomainKit
    camera.preset.ready
    cameraDomain.getDescriptor
    cameraDomain.snapshot
  kits:
    camera-domain-kit
  gap:
    live camera mutation still happens in runtime-terrain-v6.mjs and applyCloseCamera()

hud-domain
  services:
    createHudDomainKit
    hud.ready
    hudDomain.render
    hudDomain.getDescriptor
    hudDomain.snapshot
  kits:
    hud-domain-kit
  gap:
    live HUD still mutates DOM through runtime-terrain-v6.mjs and renderHud()

legacy-runner-runtime-domain
  services:
    terrain sample/update
    populate props/colliders/pickups
    keyboard/button input handlers
    speed/yaw/jump/distance mutations
    collision and pickup checks
    scene mutation
    renderer.render
    PrehistoricRushHost.getState
  kits:
    prehistoric-legacy-visual-runtime-kit
    prehistoric-terrain-streaming-kit
    prehistoric-contact-check-kit
    prehistoric-scene-dispatch-kit
    prehistoric-hud-dom-render-kit
    prehistoric-close-camera-apply-kit

external-physics-domain
  services:
    rapier import
    rapier kit install/configure
    registerKinematicActor
    setActorTransform
    step
    getSnapshot
  kits:
    rapier-physics-domain-kit
```

## Required next DSK split

```txt
presentation-event-bridge-domain
  prehistoric-rush-runner-source-state-kit
  prehistoric-rush-runner-step-delta-kit
  prehistoric-rush-runner-moved-event-kit
  prehistoric-rush-dino-event-bridge-kit

presentation-frame-domain
  prehistoric-rush-dino-pose-frame-kit
  prehistoric-rush-camera-frame-request-kit
  prehistoric-rush-hud-frame-request-kit
  prehistoric-rush-contact-result-snapshot-kit
  prehistoric-rush-scene-dispatch-result-kit
  prehistoric-rush-render-readback-kit

presentation-journal-domain
  prehistoric-rush-presentation-frame-record-kit
  prehistoric-rush-presentation-journal-kit
  prehistoric-rush-host-presentation-snapshot-kit
  prehistoric-rush-dom-free-presentation-fixture-kit
```

## Boundary rule

Do not promote anything to shared ProtoKits until the repo-local fixture proves the bridge.

The first shared candidate remains `run-movement-kit`, but it is not safe to extract before source-state, movement-delta, event emission, pose consumption, camera/HUD request, contact result, scene result, render readback, and host projection rows pass locally.

## Consumer freeze

The next implementation should freeze the consumers before it moves owners:

```txt
runner source state is read from app.state
delta is computed from previous/current source state
runner.moved is emitted through the existing event bus
dino-pose-domain-kit consumes runner.moved
camera-domain-kit descriptor feeds CameraFrameRequest
hud-domain-kit descriptor feeds HudFrameRequest
contact and scene results are recorded beside existing mutations
render readback is recorded after visual consumers run
host projection is additive under PrehistoricRushHost.getState().presentation
```
