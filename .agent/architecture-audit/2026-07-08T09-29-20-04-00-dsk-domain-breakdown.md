# PrehistoricRush DSK / Domain Breakdown

**Timestamp:** `2026-07-08T09:29:20-04:00`

## Summary

`PrehistoricRush` has a real repo-local DSK scaffold, but the live runner is still mostly owned by `src/runtime-terrain-v6.mjs` and direct presentation mutation in `src/game.js`.

The next implementation should create a presentation frame contract before renderer replacement or shared-kit promotion.

## Interaction loop

```txt
page load
  -> index.html mounts #app
  -> src/runtime.mjs imports src/game.js
  -> src/game.js creates event bus, domain host, and tick scheduler
  -> src/game.js installs dino, camera, and HUD domain kits
  -> PrehistoricRushComposition.snapshot() becomes available
  -> src/game.js imports src/runtime-terrain-v6.mjs
  -> runtime-terrain-v6.mjs creates DOM shell, Three.js scene, Rapier bridge, terrain, raptor, props, pickups, and hazards
  -> player starts from menu
  -> input mutates runner state
  -> live loop advances movement, jump, boost, terrain, contacts, pickups, run-over, and win
  -> presentation pass mutates raptor pose, close camera, HUD DOM, and renderer frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain, and renderer summary
```

## Domains in use

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
presentation-frame-contract
presentation-descriptor-journal
host-diagnostics
repo-local-agent-state
central-ledger-readback
```

## Current services

### Domain runtime services

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
```

### Dino services

```txt
createDinoFormDomainKit
createDinoPoseDomainKit
createDinoMaterialDomainKit
createDinoDomainBundle
dino.form.ready
dino.pose.ready
dino.pose.changed
```

### Camera / HUD services

```txt
createCameraDomainKit
camera.preset.ready
cameraDomain.getDescriptor
cameraDomain.snapshot
createHudDomainKit
hud.ready
hudDomain.render
hudDomain.getDescriptor
hudDomain.snapshot
```

### Live visual runtime services

```txt
shell
load
setup
state
populate
createPhysics
heightAt
createTerrain
makeRaptor
animateRaptor
styleHud
renderHud
applyCloseCamera
applyReadableStride
startPresentationPass
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
```

## Current kits

### Existing repo-local kits

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
```

### External live kit

```txt
rapier-physics-domain-kit
```

### Target core kits named by repo docs

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
```

### Repo-local extraction candidates

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-domain-bridge-kit
prehistoric-rush-dino-pose-frame-kit
prehistoric-rush-camera-frame-descriptor-kit
prehistoric-rush-hud-frame-descriptor-kit
prehistoric-rush-presentation-frame-contract-kit
prehistoric-rush-presentation-descriptor-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-action-result-journal-kit
prehistoric-rush-runner-step-result-kit
prehistoric-rush-runner-event-journal-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-replay-parity-smoke-kit
prehistoric-rush-runtime-source-bundle-kit
prehistoric-rush-manifest-load-status-kit
prehistoric-rush-run-movement-promotion-report-kit
```

## DSK boundary finding

The repo currently has two layers:

```txt
clean layer:
  event bus
  domain host
  tick scheduler
  dino/camera/HUD domain descriptors

live authority layer:
  runtime-terrain-v6.mjs movement
  runtime-terrain-v6.mjs contacts
  runtime-terrain-v6.mjs scene transitions
  src/game.js direct presentation mutation
```

The next implementation should not add a new visual domain first.

It should connect the layers with data contracts:

```txt
RunnerSourceState
  -> RunnerMovedEvent
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
  -> host presentation snapshot
```

## Promotion rule

Keep the presentation-frame contract repo-local until fixture proof shows a stable reusable API shape. Only then consider `run-movement-kit` or shared camera/HUD promotion into ProtoKits.
