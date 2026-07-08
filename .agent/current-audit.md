# PrehistoricRush Current Audit

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Updated:** `2026-07-08T09:29:20-04:00`

## Summary

`PrehistoricRush` is a standalone static browser infinite-runner shell.

It has a repo-local composition scaffold in `src/game.js` that installs an event bus, domain host, scheduler, dino domains, camera domain, and HUD domain before importing the live Three.js/Rapier route in `src/runtime-terrain-v6.mjs`.

The current architecture issue is no longer documentation presence. It is the missing source wire between the live runner state and fixture-readable presentation records.

## Full repo-list comparison result

```txt
AetherVale            tracked; root .agent observed
HorrorCorridor        tracked; root .agent observed
IntoTheMeadow         tracked; root .agent observed
MyCozyIsland          tracked; root .agent observed
PhantomCommand        tracked; root .agent observed
PrehistoricRush       selected fallback follow-up: presentation source wire map
TheCavalryOfRome      excluded by rule
TheOpenAbove          tracked; root .agent observed
TheUnmappedHouse      tracked; root .agent observed; stale rollup gap already closed
ZombieOrchard         tracked; root .agent observed
```

Selection reason:

```txt
No checked non-Cavalry Publish repo was fully new, absent from the central ledger, or missing sampled root .agent/START_HERE.md state.

TheUnmappedHouse has an older visible alignment time, but its own local docs say the closed central rollup gap should no longer be used as a reason to repeatedly select it.

PrehistoricRush was selected as the oldest/high-value fallback follow-up with unresolved runtime/presentation authority work.
```

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
README.md describes the repo as a standalone additive game repo for a NexusEngine-powered infinite runner.
README.md declares the scene flow as menu -> game -> run-over -> win -> menu.
README.md says the product repo should stay thin and reusable behavior should move into NexusEngine core kits or ProtoKits.
src/game.js installs createEventBus, createDomainHost, createTickScheduler, dino domain kits, camera-domain-kit, and hud-domain-kit.
src/game.js exposes globalThis.PrehistoricRushComposition.snapshot().
src/game.js imports ./runtime-terrain-v6.mjs after emitting composition.ready.
src/game.js runs styleHud, renderHud, applyCloseCamera, applyReadableStride, and a direct renderer frame in a presentation pass.
runtime-terrain-v6.mjs imports Three.js, Rapier, and rapier-physics-domain-kit from CDN.
runtime-terrain-v6.mjs contains terrain sampling, terrain chunk rebuilds, raptor visual rig construction, pose animation, DOM shell creation, input, movement, contact checks, scene mutation, baseline HUD/camera, and live route behavior.
runtime-terrain-v6.mjs exposes PrehistoricRushHost.getState() with scene, runner, physics, terrain, and renderer data.
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
  -> terrain chunks, props, hazards, pickups, and physics state update
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
presentation-frame-contract
presentation-descriptor-journal
host-diagnostics
repo-local-agent-state
central-ledger-readback
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
styleHud
renderHud
applyCloseCamera
applyReadableStride
startPresentationPass
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit services
```

Needed next services:

```txt
snapshotRunnerSourceState
emitRunnerMoved
bridgeRunnerMovedToDinoPose
createDinoPoseFrame
createCameraFrameRequest
createHudFrameRequest
appendPresentationFrameRecord
readHostPresentationSnapshot
runPresentationFrameFixture
createActionFrame
classifyActionAcceptance
appendActionResult
reduceRunnerStep
snapshotContactResult
appendSceneDispatchResult
createRunMovementPromotionReport
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

## Source wire map finding

The repo can look more modular than it is because `src/game.js` has a clean domain scaffold.

The actual runner authority is still mostly inside `runtime-terrain-v6.mjs`, and the presentation pass still directly mutates camera, HUD DOM, dino stride, and renderer output from `PrehistoricRushHost.app`.

The next implementation needs a source wire map that records the current behavior as data:

```txt
RunnerSourceState
  -> RunnerMovedEvent
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
```

## New audit surfaces added

```txt
.agent/architecture-audit/2026-07-08T09-29-20-04-00-dsk-domain-breakdown.md
.agent/render-audit/2026-07-08T09-29-20-04-00-render-presentation-readback.md
.agent/presentation-authority-audit/2026-07-08T09-29-20-04-00-source-wire-map.md
```

## Current next safe ledge

```txt
PrehistoricRush Presentation Source Wire Map + Frame Contract Fixture Gate
```
