# PrehistoricRush Current Audit

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Updated:** `2026-07-08T06:51:12-04:00`

## Summary

`PrehistoricRush` is a standalone static browser infinite-runner shell.

It has a thin composition entry at `src/game.js` that installs a repo-local event bus, domain host, scheduler, dino domains, camera domain, and HUD domain, then imports the live visual runner from `src/runtime-terrain-v6.mjs`.

The immediate architecture problem changed slightly: the repo now has a broader presentation scaffold, but the camera/HUD/dino presentation pass is still not descriptor-authoritative.

## Current route

```txt
index.html
  -> <main id="app">
  -> script type=module ./src/runtime.mjs
  -> src/runtime.mjs imports ./game.js
  -> src/game.js creates eventBus/domainHost/scheduler
  -> installs dino form, pose, and material domains
  -> installs camera-domain-kit
  -> installs hud-domain-kit
  -> exposes globalThis.PrehistoricRushComposition.snapshot()
  -> emits composition.ready
  -> imports ./runtime-terrain-v6.mjs
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> src/game.js starts a presentation pass that reads PrehistoricRushHost.app
```

## Source-backed facts

```txt
- README.md describes the repo as a standalone additive game repo for a NexusEngine-powered infinite runner.
- README.md declares the scene flow as menu -> game -> run-over -> win -> menu.
- README.md says the product repo should stay thin and reusable behavior should move into NexusEngine core kits or ProtoKits.
- src/game.js installs createEventBus, createDomainHost, createTickScheduler, dino domain kits, camera-domain-kit, and hud-domain-kit.
- src/game.js exposes globalThis.PrehistoricRushComposition.snapshot().
- src/game.js imports ./runtime-terrain-v6.mjs after emitting composition.ready.
- src/game.js runs styleHud, renderHud, applyCloseCamera, applyReadableStride, and a direct renderer frame in a presentation pass.
- camera-domain-kit exposes a close-third-person-v1 descriptor and emits camera.preset.ready.
- hud-domain-kit exposes a readability-hud-v1 descriptor, has a render(snapshot) projection service, and emits hud.ready.
- dino-pose-domain-kit listens for runner.moved and emits dino.pose.changed.
- runtime-terrain-v6.mjs imports Three.js, Rapier, and rapier-physics-domain-kit from CDN.
- runtime-terrain-v6.mjs contains terrain sampling, terrain chunk rebuilds, raptor visual rig construction, pose animation, DOM shell creation, input, movement, contact checks, scene mutation, and live route behavior.
```

## Current interaction loop

```txt
page load
  -> runtime entry imports game composition
  -> composition installs dino, camera, and HUD domain scaffold
  -> legacy visual runner loads
  -> menu scene waits for start input
  -> game scene mutates live runner state
  -> raw keyboard/button input drives lane/jump/boost behavior
  -> terrain chunks, props, hazards, pickups, and flock are updated
  -> Rapier physics bridge steps actor and colliders
  -> inline collision/contact checks decide run-over, pickup, or win
  -> presentation pass directly updates camera, HUD, dino stride, and render frame
  -> host exposes runtime snapshots
```

## Current domains in use

```txt
static-browser-shell
module-runtime-entry
composition-bootstrap
event-bus-history
domain-host-installation
domain-idempotency
tick-scheduler-scaffold
dino-entity-domain
dino-form-domain
dino-pose-domain
dino-material-domain
dino-domain-bundle
camera-domain
hud-domain
legacy-visual-runtime-bridge
cdn-dependency-loading
three-render-runtime
rapier-physics-runtime
dom-mount-ownership
keyboard-input-adapter
button-input-adapter
scene-file-authority
scene-transition-authority
runner-motion-policy
lane-shift-policy
jump-policy
boost-policy
speed-ramp-policy
distance-score-policy
procedural-terrain-rendering
terrain-height-sampling
terrain-chunk-streaming
procedural-scatter-placement
collider-descriptor-generation
pickup-descriptor-generation
rapier-runtime-bridge
kinematic-actor-transform
hazard-contact-detection
pickup-contact-detection
distance-goal-detection
raptor-visual-rig
raptor-pose-animation
camera-follow-policy
hud-telemetry-projection
presentation-pass-authority
host-diagnostics
```

## Current services in use

```txt
createEventBus
eventBus.on
eventBus.emit
eventBus.snapshot
createDomainHost
domainHost.install
domainHost.get
domainHost.tick
domainHost.snapshot
createTickScheduler
scheduler.start
scheduler.stop
scheduler.snapshot
createDinoFormDomainKit
createDinoPoseDomainKit
createDinoMaterialDomainKit
createDinoDomainBundle
createCameraDomainKit
camera.preset.ready
cameraDomain.getDescriptor
cameraDomain.snapshot
createHudDomainKit
hud.ready
hudDomain.render
hudDomain.getDescriptor
hudDomain.snapshot
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit services
```

## Current kits identified

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

## Target kits already named by the repo

```txt
createCoreSkyboxKit
createCoreSceneKit
createCoreInputKit
createCoreMotionKit
createCoreCameraKit
createCoreGraphicsKit
createCoreAnimationKit
createCoreUIKit
createCoreDiagnosticsKit
createCoreCompositionKit
run-movement-kit
```

## Main risk

The repo can look more modular than it is because `src/game.js` has a clean domain scaffold.

The actual runner authority is still mostly inside `runtime-terrain-v6.mjs`, and the newer presentation pass still directly mutates camera, HUD DOM, dino stride, and renderer output from the host app object.

Future work should avoid adding more visual complexity before runner source facts, runner.moved, dino.pose.changed, camera frame descriptors, HUD frame descriptors, contact results, and scene-dispatch results are testable without DOM, renderer, or Rapier frame state.

## Current next safe ledge

```txt
PrehistoricRush Presentation Descriptor Fixture Gate
```
