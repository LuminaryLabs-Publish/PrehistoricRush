# PrehistoricRush DSK / Domain Breakdown

**Timestamp:** `2026-07-08T10:39:22-04:00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

## Selection read

The full accessible `LuminaryLabs-Publish` repo list was compared against central tracking.

No checked non-Cavalry repo was fully new, central-ledger absent, missing sampled root `.agent/START_HERE.md`, or otherwise undocumented.

`TheCavalryOfRome` was excluded by standing rule.

`PrehistoricRush` was selected as a fallback follow-up because the next missing proof is a narrow runtime-to-domain event bridge.

## Current route authority

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> eventBus / domainHost / scheduler
  -> dino domains
  -> camera domain
  -> HUD domain
  -> await import("./runtime-terrain-v6.mjs")
  -> runtime-terrain-v6.mjs live runner
  -> src/game.js presentation pass
```

## Interaction loop

```txt
page load
  -> static app shell mounts
  -> src/runtime.mjs imports src/game.js
  -> src/game.js installs domain scaffold
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit
  -> player starts menu into game
  -> input mutates runner state
  -> terrain and scatter update
  -> hazard/pickup/win checks mutate scene state
  -> presentation pass reads host app state
  -> direct camera, HUD, dino stride, and render mutations occur
  -> PrehistoricRushHost.getState() exposes debug state
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
dino-form-domain
dino-pose-domain
dino-material-domain
camera-domain
hud-domain
legacy-visual-runtime-bridge
cdn-dependency-loading
three-render-runtime
rapier-physics-runtime
keyboard-input-adapter
button-input-adapter
runner-motion-policy
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
repo-local-agent-state
central-ledger-readback
```

## New target domains

```txt
runner-source-state-domain
runner-moved-event-domain
dino-event-bridge-domain
dino-pose-frame-domain
camera-frame-request-domain
hud-frame-request-domain
presentation-frame-record-domain
presentation-journal-domain
host-presentation-snapshot-domain
dom-free-presentation-fixture-domain
```

## Existing services

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
createHudDomainKit
styleHud
renderHud
applyCloseCamera
applyReadableStride
startPresentationPass
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit services
```

## Needed services

```txt
snapshotRunnerSourceState(app)
createRunnerMovedEvent(previous, current)
emitRunnerMoved(eventBus, runnerMovedEvent)
recordDinoPoseFrame(dinoPoseDescriptor)
createCameraFrameRequest(runnerSourceState, cameraDescriptor)
createHudFrameRequest(runnerSourceState, hudDescriptor)
appendPresentationFrameRecord(record)
readHostPresentationSnapshot()
runPresentationFrameFixture()
```

## Existing kits

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
prehistoric-rush-presentation-frame-contract-kit
prehistoric-rush-presentation-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-dom-free-presentation-fixture-kit
```

## Architecture finding

`src/game.js` already creates a useful composition scaffold, but that scaffold is not yet the live authority.

`runtime-terrain-v6.mjs` still owns route mutation, movement, contact checks, pickup collection, scene changes, baseline camera, baseline HUD, and host state.

The safest next cut is not a renderer rewrite. It is a thin event bridge that exposes current runtime facts as stable domain records while preserving the current route.
