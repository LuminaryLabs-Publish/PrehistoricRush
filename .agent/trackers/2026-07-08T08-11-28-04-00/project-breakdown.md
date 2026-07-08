# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T08:11:28-04:00`

## Selection result

The accessible `LuminaryLabs-Publish` repository list was compared against central tracking in `LuminaryLabs-Dev/LuminaryLabs`.

No checked non-Cavalry repo was fully new, absent from the central ledger, or missing root `.agent/START_HERE.md` state.

`LuminaryLabs-Publish/TheCavalryOfRome` was excluded by standing rule.

`LuminaryLabs-Publish/TheUnmappedHouse` has an older visible alignment time, but its local start file explicitly says the closed central rollup gap should not keep selecting that repo.

`LuminaryLabs-Publish/PrehistoricRush` was selected as the oldest eligible fallback follow-up among the checked repos with unresolved runtime authority work.

## Publish repo comparison

```txt
LuminaryLabs-Publish/AetherVale          ledgered with root .agent, last aligned 2026-07-08T07:18:11-04:00
LuminaryLabs-Publish/HorrorCorridor      ledgered with root .agent, last aligned 2026-07-08T07:01:54-04:00
LuminaryLabs-Publish/IntoTheMeadow       ledgered with root .agent, last aligned 2026-07-08T07:41:52-04:00
LuminaryLabs-Publish/MyCozyIsland        ledgered with root .agent, last aligned 2026-07-08T07:30:30-04:00
LuminaryLabs-Publish/PhantomCommand      ledgered with root .agent, last aligned 2026-07-08T07:50:47-04:00
LuminaryLabs-Publish/PrehistoricRush     selected fallback follow-up, last aligned 2026-07-08T06:51:12-04:00
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/TheOpenAbove        ledgered with root .agent, last aligned 2026-07-08T07:10:12-04:00
LuminaryLabs-Publish/TheUnmappedHouse    ledgered with root .agent, skip stale-rollup repeat reason
LuminaryLabs-Publish/ZombieOrchard       ledgered with root .agent, last aligned 2026-07-08T08:02:32-04:00
```

## Current product read

`PrehistoricRush` is a standalone static browser game repo for a NexusEngine-powered infinite runner.

The current route is:

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> dino form, pose, and material domain kits
  -> camera-domain-kit
  -> hud-domain-kit
  -> PrehistoricRushComposition.snapshot()
  -> await import("./runtime-terrain-v6.mjs")
  -> Three.js + Rapier visual runner
  -> presentation pass reads PrehistoricRushHost.app
  -> HUD DOM, close camera, dino stride, and renderer frame mutate directly
  -> PrehistoricRushHost.getState()
```

## Interaction loop

```txt
static page opens
  -> module runtime imports the composition shell
  -> repo-local domain runtime installs dino/camera/HUD scaffolds
  -> legacy visual runner initializes Three.js, Rapier, terrain, raptor, HUD, camera, and input
  -> player starts from menu
  -> keyboard/button input mutates live runner input
  -> game scene updates yaw, speed, jump, distance, terrain, scatter, colliders, pickups, and scene outcome inline
  -> presentation pass reads app.state and app.view directly
  -> dino rig, camera, HUD, and renderer update directly from host app state
  -> host exposes runtime snapshot through PrehistoricRushHost.getState()
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
menu-scene-state
game-scene-state
run-over-scene-state
win-scene-state
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
repo-local-agent-state
central-ledger-readback
```

## Services in use

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
cameraDomain.getDescriptor
cameraDomain.snapshot
createHudDomainKit
hudDomain.render
hudDomain.getDescriptor
hudDomain.snapshot
styleHud
renderHud
applyCloseCamera
applyReadableStride
startPresentationPass
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
heightAt
createTerrain
populate
createPhysics
runtime-terrain loop
rapier-physics-domain-kit services
```

## Kits identified

Current repo-local kits:

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

Current external kit:

```txt
rapier-physics-domain-kit
```

Target core kits named by repo docs:

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

Next-cut kits:

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-domain-bridge-kit
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

## Main finding

The repo now has a useful dino/camera/HUD scaffold, but `src/game.js` still runs the decisive presentation pass by reading `PrehistoricRushHost.app` and directly mutating HUD DOM, the camera, dino rig stride, and the renderer frame.

`runtime-terrain-v6.mjs` also still owns the live runner state and scene outcomes inline.

The next safe ledge is to formalize the frame contract between runner source state and presentation consumers before adding more visuals or pushing behavior into shared ProtoKits.

## Next safe ledge

```txt
PrehistoricRush Presentation Frame Contract Acceptance Ledger
```

Build order:

```txt
preserve current route and visible behavior
  -> snapshot RunnerSourceState from app.state
  -> emit runner.moved from the live movement step
  -> let dino-pose-domain-kit consume runner.moved
  -> create DinoPoseFrame from runner.moved
  -> create CameraFrameRequest from camera-domain-kit + RunnerSourceState
  -> create HudFrameRequest from hud-domain-kit + RunnerSourceState
  -> append PresentationFrameRecord
  -> expose host.presentation through PrehistoricRushHost.getState()
  -> add DOM-free fixture cases for source -> dino -> camera -> HUD
  -> only then continue action/result, contact, and scene-dispatch extraction
```

## Validation

No runtime source files changed.

No local build, browser smoke, GitHub Pages check, Three.js route check, Rapier execution, or Playwright run was performed in this connector documentation pass.
