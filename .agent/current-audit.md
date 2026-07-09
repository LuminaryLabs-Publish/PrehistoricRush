# PrehistoricRush Current Audit

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Updated:** `2026-07-09T03-10-05-04-00`

## Summary

`PrehistoricRush` is a standalone static browser infinite runner with a repo-local DSK scaffold in `src/game.js` and a live terrain/raptor route in `src/runtime-terrain-v6.mjs`.

This pass keeps the next implementation boundary unchanged but syncs the repo-local and central ledgers: add the presentation event bridge that turns live app state into fixture-readable source, movement, dino pose, camera, HUD, contact, scene, render, and host projection records.

## Selection result

```txt
No checked non-excluded Publish repo was fully new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root .agent/START_HERE.md state.

PrehistoricRush was selected because central tracking was behind the repo-local .agent alignment.

TheCavalryOfRome remains excluded by rule.
```

## Current route

```txt
index.html
  -> src/runtime.mjs imports ./game.js
  -> src/game.js creates eventBus/domainHost/scheduler
  -> installs dino form, pose, and material domains
  -> installs camera-domain-kit
  -> installs hud-domain-kit
  -> exposes PrehistoricRushComposition.snapshot()
  -> emits composition.ready
  -> imports ./runtime-terrain-v6.mjs
  -> runtime-terrain-v6.mjs imports Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> runtime-terrain-v6.mjs owns menu/game/run-over/win loop
  -> src/game.js starts a presentation pass that reads PrehistoricRushHost.app
```

## Source-backed facts

```txt
index.html loads ./src/runtime.mjs.
src/runtime.mjs only imports ./game.js.
src/game.js installs createEventBus, createDomainHost, createTickScheduler, dino domain kits, camera-domain-kit, and hud-domain-kit.
src/game.js exposes globalThis.PrehistoricRushComposition.snapshot().
src/game.js imports ./runtime-terrain-v6.mjs after emitting composition.ready.
src/game.js directly applies styleHud, renderHud, applyCloseCamera, applyReadableStride, and renderer.render in startPresentationPass().
dino-pose-domain-kit already listens for runner.moved and emits dino.pose.changed, but the live runtime does not yet emit runner.moved.
camera-domain-kit exposes a close-third-person descriptor.
hud-domain-kit exposes a readability HUD descriptor and pure render projection.
runtime-terrain-v6.mjs imports Three.js, Rapier, and rapier-physics-domain-kit from CDN.
runtime-terrain-v6.mjs contains terrain sampling, terrain chunk rebuilds, raptor visual rig construction, pose animation, DOM shell creation, input, movement, contacts, scene mutation, baseline HUD/camera, and render behavior.
runtime-terrain-v6.mjs exposes PrehistoricRushHost.getState() with scene, runner, physics, terrain, and renderer data.
No package.json exists in the repo root, so validation must not assume npm scripts.
```

## Current interaction loop

```txt
page load
  -> runtime entry imports game composition
  -> composition installs dino, camera, and HUD domain scaffold
  -> legacy visual terrain runner loads
  -> menu scene waits for start input
  -> game scene mutates live runner state
  -> raw keyboard/button input drives turn, jump, and boost behavior
  -> terrain chunks, props, hazards, pickups, and physics state update
  -> inline collision/contact checks decide run-over, pickup, or win
  -> runtime-terrain-v6 baseline frame mutates camera, HUD, raptor pose, and renderer
  -> src/game.js presentation pass applies close camera, readable stride, HUD rewrite, and second render
  -> host exposes runtime snapshots
```

## Target proof loop

```txt
app.state + previous frame snapshot
  -> RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> runner.moved eventBus emission
  -> dino-pose-domain-kit update
  -> dino.pose.changed event readback
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> RenderReadback
  -> PresentationFrameRecord
  -> bounded PresentationJournalSnapshot
  -> PrehistoricRushHost.getState().presentation
  -> scripts/prehistoric-rush-presentation-frame-fixture.mjs
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
createRunnerStepDelta
createRunnerMovedEvent
shouldEmitRunnerMoved
emitRunnerMoved
readLatestDinoPoseChangedEvent
createDinoPoseFrame
createCameraFrameRequest
createHudFrameRequest
createContactResultSnapshot
createSceneDispatchResult
createRenderReadback
createPresentationFrameRecord
appendPresentationJournalEntry
projectPresentationJournalSnapshot
projectHostPresentationSnapshot
runPresentationEventBridgeFixture
```

## Current kits

```txt
repo-local implemented:
  domain-runtime/event-bus
  domain-runtime/domain-host
  domain-runtime/tick-scheduler
  dino-form-domain-kit
  dino-pose-domain-kit
  dino-material-domain-kit
  dino-domain-bundle
  camera-domain-kit
  hud-domain-kit

live external:
  rapier-physics-domain-kit

runtime-implied:
  prehistoric-static-shell-kit
  prehistoric-runtime-entry-kit
  prehistoric-legacy-visual-runtime-kit
  prehistoric-raptor-visual-rig-kit
  prehistoric-terrain-streaming-kit
  prehistoric-contact-check-kit
  prehistoric-scene-dispatch-kit
  prehistoric-hud-dom-render-kit
  prehistoric-close-camera-apply-kit

next-cut:
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

## Main finding

The primary remaining source gap is implementation of the pure `src/presentation/*` files, additive host projection, and DOM-free fixture.

The first useful cut is the consumer bridge from live app state to `runner.moved`, because it activates the existing `dino-pose-domain-kit` instead of creating another parallel animation path.

## Next safe ledge

```txt
PrehistoricRush Central Ledger Sync + Presentation Event Bridge Consumer Freeze
```
