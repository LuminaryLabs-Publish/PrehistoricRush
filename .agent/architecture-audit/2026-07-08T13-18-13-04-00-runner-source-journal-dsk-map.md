# PrehistoricRush Runner Source Journal DSK Map

**Timestamp:** `2026-07-08T13:18:13-04:00`

## Purpose

Map the current repo-local DSK surface and the next source-journal boundary needed before shared-kit promotion.

## Current route authority

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> domain runtime scaffold
  -> dino/camera/HUD domains
  -> runtime-terrain-v6.mjs
  -> Three.js/Rapier runner loop
  -> presentation pass
  -> PrehistoricRushHost.getState()
```

## Current DSK/domain boundary

```txt
composition-bootstrap-domain
  owns: event bus, domain host, scheduler installation
  files: src/game.js, src/domain-runtime/*

dino-domain
  owns: dino form descriptor, pose descriptor, material descriptor
  files: src/domains/dino/*

camera-domain
  owns: close-third-person-v1 descriptor
  file: src/domains/camera/camera-domain-kit.js

hud-domain
  owns: readability-hud-v1 descriptor and render(snapshot) helper
  file: src/domains/hud/hud-domain-kit.js

legacy-runner-visual-domain
  owns: Three.js scene, Rapier bridge, terrain streaming, input, runner motion, contacts, pickups, scene transitions, baseline HUD/camera, host snapshot
  file: src/runtime-terrain-v6.mjs

presentation-pass-domain
  owns: current direct close-camera, readable-stride, HUD DOM, renderer frame mutation
  file: src/game.js
```

## Interaction loop identified

```txt
menu/start input
  -> live runner scene
  -> keyboard/button input
  -> turn/jump/boost state mutation
  -> runner position/distance/speed mutation
  -> terrain update / populate
  -> physics actor transform / physics step
  -> hazard contact or pickup contact check
  -> run-over / win scene mutation
  -> raptor pose / camera / HUD direct mutation
  -> renderer frame
  -> PrehistoricRushHost.getState()
```

## Current services offered by kits

```txt
createEventBus
  - on
  - emit
  - snapshot

createDomainHost
  - install
  - get
  - tick
  - snapshot

createTickScheduler
  - start
  - stop
  - snapshot

createDinoFormDomainKit
  - install
  - getDescriptor
  - snapshot

createDinoPoseDomainKit
  - install runner.moved listener
  - update
  - getDescriptor
  - snapshot

createDinoMaterialDomainKit
  - install
  - getDescriptor
  - snapshot

createCameraDomainKit
  - install
  - getDescriptor
  - snapshot

createHudDomainKit
  - install
  - render
  - getDescriptor
  - snapshot

rapier-physics-domain-kit
  - configure
  - registerKinematicActor
  - setActorTransform
  - setFixedColliders
  - step
  - getSnapshot
```

## Kits identified

```txt
domain-runtime/event-bus
domain-runtime/domain-host
domain-runtime/tick-scheduler
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle
camera-domain-kit
hud-domain-kit
rapier-physics-domain-kit
```

## Next-cut local kits

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-event-bridge-kit
prehistoric-rush-dino-pose-frame-kit
prehistoric-rush-camera-frame-request-kit
prehistoric-rush-hud-frame-request-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-presentation-frame-record-kit
prehistoric-rush-presentation-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-dom-free-presentation-fixture-kit
```

## Promotion rule

Keep these as repo-local proof kits until a DOM-free fixture proves stable inputs, outputs, acceptance reasons, and host diagnostics.

Only then promote generic parts to NexusEngine core kits or ProtoKits.
