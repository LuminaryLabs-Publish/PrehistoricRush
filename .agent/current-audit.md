# PrehistoricRush Current Audit

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Updated:** `2026-07-08T05:10:47-04:00`

## Summary

`PrehistoricRush` is a standalone static browser infinite-runner shell.

It now has a thin composition entry at `src/game.js` that installs a repo-local event bus, domain host, scheduler, and dino domain scaffold, then imports the live visual runner from `src/runtime-terrain-v6.mjs`.

The immediate architecture problem is unchanged: the DSK scaffold exists, but most playable authority is still inside the legacy visual runtime.

## Current route

```txt
index.html
  -> <main id="app">
  -> script type=module ./src/runtime.mjs
  -> src/runtime.mjs imports ./game.js
  -> src/game.js creates eventBus/domainHost/scheduler
  -> installs dino form, pose, and material domains
  -> exposes globalThis.PrehistoricRushComposition.snapshot()
  -> emits composition.ready
  -> imports ./runtime-terrain-v6.mjs
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit from CDN
```

## Source-backed facts

```txt
- README.md describes the repo as a standalone additive game repo for a NexusEngine-powered infinite runner.
- README.md declares the scene flow as menu -> game -> run-over -> win -> menu.
- README.md says the product repo should stay thin and reusable behavior should move into NexusEngine core kits or ProtoKits.
- src/game.js installs createEventBus, createDomainHost, createTickScheduler, and three dino domain kits.
- src/game.js exposes globalThis.PrehistoricRushComposition.snapshot().
- src/game.js imports ./runtime-terrain-v6.mjs after emitting composition.ready.
- runtime-terrain-v6.mjs imports Three.js, Rapier, and rapier-physics-domain-kit from CDN.
- runtime-terrain-v6.mjs contains terrain sampling, terrain chunk rebuilds, raptor visual rig construction, pose animation, DOM shell creation, and live route behavior.
```

## Current interaction loop

```txt
page load
  -> runtime entry imports game composition
  -> composition installs dino domain scaffold
  -> legacy visual runner loads
  -> menu scene waits for start input
  -> game scene mutates live runner state
  -> raw keyboard/button input drives lane/jump/boost behavior
  -> terrain chunks, props, hazards, pickups, and flock are updated
  -> Rapier physics bridge steps actor and colliders
  -> inline collision/contact checks decide run-over, pickup, or win
  -> DOM/HUD/camera/raptor pose/render frame update
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
win-condition-detection
raptor-visual-rig
raptor-pose-animation
camera-follow-policy
hud-telemetry-projection
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

The current repo can look more modular than it is because `src/game.js` has a clean domain scaffold.

The actual runner authority is still mostly inside `runtime-terrain-v6.mjs`.

Future work should avoid adding more visual complexity before the runner action/result contract, runner-step result, contact-result snapshot, scene-dispatch result, and dino pose bridge are testable without DOM, renderer, or Rapier frame state.

## Current next safe ledge

```txt
PrehistoricRush Runner Action/Result Authority + Dino Pose Bridge Fixture Gate
```
