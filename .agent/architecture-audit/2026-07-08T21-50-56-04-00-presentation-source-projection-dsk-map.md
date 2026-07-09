# PrehistoricRush Architecture Audit: Presentation Source Projection DSK Map

**Timestamp:** `2026-07-08T21-50-56-04-00`

## Audit intent

Map the current product as domains, services, and kits before implementation work.

This audit is documentation-only. It exists to guide the next source-projection fixture cut without changing the live Three.js/Rapier route.

## Current architecture summary

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js composition layer
  -> src/domain-runtime/*
  -> src/domains/dino/*
  -> src/domains/camera/*
  -> src/domains/hud/*
  -> src/runtime-terrain-v6.mjs live runner
  -> Three.js + Rapier + rapier-physics-domain-kit CDN imports
  -> PrehistoricRushHost.getState()
```

The architecture already has a repo-local DSK scaffold, but the live runner still bypasses the scaffold for most behavior.

## Interaction loop

```txt
player opens static page
  -> runtime imports composition
  -> composition installs DSK scaffold
  -> live visual runner loads
  -> menu waits for start
  -> player uses keyboard/button input
  -> app.state mutates speed, yaw, jump, position, shards, distance, and scene
  -> terrain, colliders, pickups, hazards, camera, HUD, and raptor rig mutate inline
  -> presentation pass applies close camera, readable stride, and HUD DOM rewrite
  -> host exposes basic scene/runner/physics/terrain/renderer snapshot
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
rapier-physics-domain-kit-bridge
dom-mount-ownership
keyboard-input-adapter
button-input-adapter
scene-file-authority
scene-transition-authority
runner-motion-policy
runner-source-state-contract
runner-step-delta-contract
runner-moved-event-contract
turn-steering-policy
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
dino-pose-event-bridge
camera-follow-policy
camera-frame-request-contract
hud-telemetry-projection
hud-frame-request-contract
contact-result-contract
scene-dispatch-result-contract
presentation-pass-authority
presentation-frame-contract
presentation-journal-contract
render-readback-contract
host-presentation-snapshot
fixture-replay-contract
host-diagnostics
```

## Services that kits offer today

```txt
createEventBus                 -> event bus service
createDomainHost               -> idempotent domain installation service
createTickScheduler            -> future scheduler/tick authority service
createDinoFormDomainKit        -> dino form descriptor service
createDinoPoseDomainKit        -> runner.moved consumer and dino pose descriptor service
createDinoMaterialDomainKit    -> dino material descriptor service
createDinoDomainBundle         -> bundled dino kit service
createCameraDomainKit          -> close third-person camera descriptor service
createHudDomainKit             -> readability HUD descriptor and render projection service
styleHud                       -> legacy DOM readability styling service
renderHud                      -> legacy DOM HUD rendering service
applyCloseCamera               -> legacy Three.js camera mutation service
applyReadableStride            -> legacy raptor rig mutation service
startPresentationPass          -> legacy consumer bridge service
PrehistoricRushComposition.snapshot -> composition scaffold snapshot service
PrehistoricRushHost.getState   -> live runtime host snapshot service
rapier-physics-domain-kit      -> external physics bridge service
```

## Implemented kits

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

## Runtime-implied kits

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
prehistoric-legacy-visual-runtime-kit
prehistoric-raptor-visual-rig-kit
prehistoric-terrain-streaming-kit
prehistoric-contact-check-kit
prehistoric-scene-dispatch-kit
prehistoric-hud-dom-render-kit
prehistoric-close-camera-apply-kit
```

## Next-cut kits

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-step-delta-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-event-bridge-kit
prehistoric-rush-dino-pose-frame-kit
prehistoric-rush-camera-frame-request-kit
prehistoric-rush-hud-frame-request-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-render-readback-kit
prehistoric-rush-presentation-frame-record-kit
prehistoric-rush-presentation-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-dom-free-presentation-fixture-kit
```

## Target source-projection seam

```txt
legacy app.state
  -> source projectors
  -> movement/contact/scene records
  -> event bus bridge
  -> dino/camera/HUD consumer records
  -> presentation frame record
  -> bounded journal
  -> host presentation snapshot
  -> DOM-free fixture
```

## Cut line

The next pass should add pure source/projection modules in `src/presentation/` and one fixture script.

It should not move terrain, collision, rendering, or movement authority yet.
