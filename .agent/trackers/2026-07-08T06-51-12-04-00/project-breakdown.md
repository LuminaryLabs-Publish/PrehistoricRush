# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T06:51:12-04:00`

## Selection

`PrehistoricRush` was selected as the fallback eligible repo after comparing the accessible `LuminaryLabs-Publish` repo list against the `LuminaryLabs-Dev/LuminaryLabs` ledger.

No new untracked non-excluded publish repo was selected first.

`LuminaryLabs-Publish/TheCavalryOfRome` remained excluded.

## Current source read

The active product is a static browser infinite runner.

Route:

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> repo-local event bus / domain host / tick scheduler
  -> dino form/pose/material domains
  -> camera-domain-kit
  -> hud-domain-kit
  -> await import("./runtime-terrain-v6.mjs")
  -> presentation pass reads PrehistoricRushHost.app
```

The repo is not missing root `.agent` state, but the docs needed a follow-up because `src/game.js` now has camera/HUD domain kits while the live presentation route still mutates camera, HUD, and dino stride directly.

## Interaction loop

```txt
page load
  -> src/runtime.mjs imports src/game.js
  -> src/game.js creates eventBus/domainHost/scheduler
  -> src/game.js installs dino, camera, and HUD domains
  -> composition.ready is emitted
  -> runtime-terrain-v6.mjs initializes Three/Rapier runner
  -> menu waits for start input
  -> keyboard/button input mutates app.input and app.scene
  -> game loop mutates runner state
  -> terrain, scatter, physics actor, contacts, pickups, and win condition update inline
  -> presentation pass reads host app state
  -> camera/HUD/dino stride are directly applied
  -> renderer presents frame
  -> PrehistoricRushHost.getState() exposes live state
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

## Services identified

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
createCameraDomainKit
createHudDomainKit
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit services
```

## Kits identified

Repo-local kits:

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

External live kit:

```txt
rapier-physics-domain-kit
```

Target core kits still named by repo docs:

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

First missing shared ProtoKit:

```txt
run-movement-kit
```

## Main finding

`PrehistoricRush` has progressed from only a dino scaffold to a richer presentation scaffold: camera and HUD domains now exist.

The problem is that those domains are not yet live authority.

`src/game.js` still runs a presentation pass that directly reads `PrehistoricRushHost.app` and mutates HUD DOM, camera position, dino stride, and renderer output.

## Added audit

```txt
.agent/presentation-authority-audit/camera-hud-descriptor-fixture-matrix.md
```

This audit defines the fixture gate needed before visual or renderer replacement:

```txt
runner source state
  -> runner.moved
  -> dino.pose.changed
  -> camera.frame.requested
  -> hud.frame.requested
  -> host presentation snapshot
```

## Next safe ledge

```txt
PrehistoricRush Presentation Descriptor Fixture Gate
```

Do not overhaul the runtime yet.

First prove that camera, HUD, and dino pose descriptors can be generated from the same runner source facts without depending on DOM or renderer frame timing.

## Files changed in this pass

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/presentation-authority-audit/camera-hud-descriptor-fixture-matrix.md
.agent/trackers/2026-07-08T06-51-12-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T06-51-12-04-00.md
```

## Validation

Documentation-only connector pass.

Runtime source was not changed.

No local checkout, build, browser smoke, Playwright smoke, or Pages validation was run.
