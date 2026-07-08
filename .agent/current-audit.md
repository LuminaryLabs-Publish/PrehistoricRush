# PrehistoricRush Current Audit

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Updated:** `2026-07-08T03:01:20-04:00`

## Summary

`PrehistoricRush` is a standalone static browser infinite-runner shell. It now has a thin composition entry at `src/game.js` that installs a repo-local domain runtime and dino domain scaffold, then imports the legacy live visual runner from `src/runtime-terrain-v6.mjs`.

The immediate architectural problem is that the DSK scaffold exists, but most playable authority still lives inside the legacy visual runtime.

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
```

## Source-backed facts

- `README.md` describes the game as a standalone additive game repo for a NexusEngine-powered infinite runner.
- `README.md` defines the scene flow as `menu -> game -> run-over -> win -> menu`.
- `README.md` says the product repo should stay thin and reusable behavior should move into NexusEngine core kits or ProtoKits.
- `index.html` loads `./src/runtime.mjs` through a module script.
- `src/runtime.mjs` imports `./game.js`.
- `src/game.js` installs `createEventBus`, `createDomainHost`, `createTickScheduler`, and three dino domain kits.
- `src/game.js` exposes `globalThis.PrehistoricRushComposition` with a `snapshot()` method.
- `game-scenes.json` declares `entryScene: menu`, the `menu/game/run-over/win` scene order, and NexusEngine CDN metadata.
- `kit-cutover-inventory.json` says manual runner movement, segment spawning, collision, score, flock movement, sky drawing, camera smoothing, and scene transition rules should be cut out of product code.
- `kit-cutover-inventory.json` identifies `run-movement-kit` as the first missing ProtoKit.

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
  -> host exposes a runtime snapshot
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
dom-mount-ownership
keyboard-input-adapter
button-input-adapter
scene-graph-authority
scene-file-authority
runner-movement-policy
jump-policy
boost-policy
turn-yaw-policy
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

The current repo can look more modular than it is because `src/game.js` has a clean domain scaffold, but the actual runner authority is still mostly inside `runtime-terrain-v6.mjs`.

Future work should avoid adding more visual complexity before the runner action/result contract and dino pose bridge are testable without DOM, renderer, or Rapier frame state.
