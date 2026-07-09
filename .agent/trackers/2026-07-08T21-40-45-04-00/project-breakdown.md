# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-08T21-40-45-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch target:** `main`

**Runtime/source changed:** no

## Goal

Refresh the repo-local `.agent` operating memory for `PrehistoricRush`, compare it against the current `LuminaryLabs-Publish` organization state and central `LuminaryLabs-Dev/LuminaryLabs` ledger, and define the next implementation boundary without touching runtime behavior.

## Selection result

No checked non-Cavalry Publish repo was fully new, absent from central tracking, missing sampled root `.agent/START_HERE.md`, recently added but undocumented, or otherwise undocumented.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

`PrehistoricRush` was selected as the oldest eligible fallback by current central ledger alignment. The prior central alignment was `2026-07-08T19-30-31-04-00`, older than the sampled non-excluded follow-up set after later catch-up passes.

## Publish repositories observed

```txt
LuminaryLabs-Publish/IntoTheMeadow       tracked / root .agent present / central alignment 2026-07-08T20-21-59-04-00
LuminaryLabs-Publish/HorrorCorridor      tracked / root .agent present / central alignment 2026-07-08T20-38-28-04-00
LuminaryLabs-Publish/AetherVale          tracked / root .agent present / central alignment 2026-07-08T21-08-41-04-00
LuminaryLabs-Publish/ZombieOrchard       tracked / root .agent present / central alignment 2026-07-08T21-18-39-04-00
LuminaryLabs-Publish/TheUnmappedHouse    tracked / root .agent present / central alignment 2026-07-08T21-00-12-04-00
LuminaryLabs-Publish/MyCozyIsland        tracked / root .agent present / central alignment 2026-07-08T19-50-20-04-00
LuminaryLabs-Publish/TheOpenAbove        tracked / root .agent present / central alignment 2026-07-08T20-10-32-04-00
LuminaryLabs-Publish/PhantomCommand      tracked / root .agent present / central alignment 2026-07-08T20-52-00-04-00
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/PrehistoricRush     selected / oldest eligible central alignment 2026-07-08T19-30-31-04-00
```

## Current product read

`PrehistoricRush` is a standalone static browser infinite runner. It has a repo-local domain runtime scaffold and a live Three.js/Rapier terrain runner.

The repo currently has no root `package.json`, so validation must use source readback and future script commands only after a fixture script exists.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost({ eventBus })
  -> createTickScheduler({ host, eventBus })
  -> install dino form, pose, material, camera, and HUD domain kits
  -> expose globalThis.PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> create DOM shell, Three.js scene, camera, renderer, terrain, raptor, rocks, trees, shards, and Rapier bridge
  -> wait in menu scene until Start/Enter/Space
  -> keyboard input mutates live runner state
  -> movement, yaw, speed, jump, terrain height, chunks, colliders, pickups, scene, and score mutate inline
  -> runtime-terrain-v6 baseline camera/HUD/raptor/render pass runs
  -> src/game.js presentation pass applies close camera, readable stride, HUD rewrite, and second render
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
```

## Source-backed facts

```txt
README.md says the repo is a standalone additive NexusEngine-powered infinite runner and names run-movement-kit as the first missing ProtoKit.
src/game.js installs event bus, domain host, tick scheduler, dino form/pose/material domains, camera-domain-kit, and hud-domain-kit.
src/game.js exposes PrehistoricRushComposition.snapshot() and then imports runtime-terrain-v6.mjs.
src/game.js owns styleHud, renderHud, applyCloseCamera, applyReadableStride, and startPresentationPass.
dino-pose-domain-kit already listens for runner.moved and emits dino.pose.changed, but the live runtime still does not emit runner.moved.
camera-domain-kit exposes the close-third-person camera descriptor.
hud-domain-kit exposes the readability HUD descriptor and a pure render projection.
runtime-terrain-v6.mjs imports Three.js, Rapier, and rapier-physics-domain-kit from CDN.
runtime-terrain-v6.mjs owns DOM shell, terrain, procedural raptor, input, movement, collision/contact, scene dispatch, baseline HUD/camera, render, and PrehistoricRushHost.getState().
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
rapier-physics-domain-kit-bridge
dom-mount-ownership
keyboard-input-adapter
button-input-adapter
scene-file-authority
scene-transition-authority
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
runner-source-state-contract
runner-step-delta-contract
runner-moved-event-contract
dino-pose-event-bridge
dino-pose-frame-contract
camera-frame-request-contract
hud-frame-request-contract
contact-result-contract
scene-dispatch-result-contract
render-readback-contract
presentation-frame-contract
presentation-journal-contract
host-presentation-snapshot
fixture-replay-contract
host-diagnostics
repo-local-agent-state
central-ledger-readback
```

## Services that kits offer

### Implemented/source-backed services

```txt
createEventBus
  - on(type, handler)
  - emit(type, payload)
  - snapshot()

createDomainHost
  - install(domain)
  - get(id)
  - tick(dt, context)
  - snapshot()

createTickScheduler
  - scheduler scaffold for later authority

createDinoFormDomainKit
  - dino form descriptor
  - dino form snapshot

createDinoPoseDomainKit
  - listens for runner.moved
  - emits dino.pose.changed
  - update({ speed, turn, jump, time })
  - getDescriptor()
  - snapshot()

createDinoMaterialDomainKit
  - dino material descriptor
  - material snapshot

createCameraDomainKit
  - emits camera.preset.ready
  - getDescriptor()
  - snapshot()

createHudDomainKit
  - emits hud.ready
  - progress(distance)
  - render({ scene, distance, speed, shards, best, chunks, heading, rapier })
  - getDescriptor()
  - snapshot()

runtime-terrain-v6.mjs live services
  - shell()
  - createTerrain()
  - populate(app)
  - createPhysics()
  - setup()
  - live movement step
  - live collision/contact step
  - live scene dispatch
  - live baseline camera/HUD/render pass
  - PrehistoricRushHost.getState()

src/game.js presentation services
  - styleHud(ui)
  - renderHud(app)
  - applyCloseCamera(app, THREE, dt)
  - applyReadableStride(app)
  - startPresentationPass()
  - PrehistoricRushComposition.snapshot()
```

### Needed next services

```txt
snapshotRunnerSourceState
createRunnerStepDelta
createRunnerMovedEvent
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
projectHostPresentationSnapshot
runPresentationConsumerFixture
```

## Kits identified

### Implemented repo-local kits

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

### Live external kit

```txt
rapier-physics-domain-kit
```

### Runtime-implied product kits

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

### Next-cut kits

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

## Main finding

The next implementation should not be a renderer rewrite, dinosaur rewrite, terrain rewrite, physics rewrite, or ProtoKit promotion.

The existing `dino-pose-domain-kit` already has the right consumer seam: it listens for `runner.moved` and emits `dino.pose.changed`. The useful next step is a pure source/consumer manifest that projects live runner state into stable records, emits `runner.moved`, captures the resulting pose/camera/HUD/contact/scene/render facts, and exposes them through `PrehistoricRushHost.getState().presentation`.

## Next safe ledge

```txt
PrehistoricRush Presentation Consumer Source Manifest + Host Projection Fixture Gate
```

Build additive `src/presentation/*` modules and `scripts/prehistoric-rush-presentation-frame-fixture.mjs` first. Preserve the visible route and all existing `PrehistoricRushHost.getState()` fields.