# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T12:09:27-04:00`

**Branch target:** `main`

## Selection result

The accessible `LuminaryLabs-Publish` repository list was compared against the central tracked repo ledger in `LuminaryLabs-Dev/LuminaryLabs`.

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, undocumented, or missing sampled root `.agent/START_HERE.md` state.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

`PrehistoricRush` was selected as the oldest eligible fallback target because its latest tracked state is older than the latest sampled follow-up updates and its live runner still needs a fixture-readable event/presentation source map before more visual or shared-kit work.

## Publish repositories checked

```txt
LuminaryLabs-Publish/AetherVale          tracked / root .agent present / latest sampled follow-up 2026-07-08T12:01:23-04:00
LuminaryLabs-Publish/HorrorCorridor      tracked / root .agent present / latest sampled follow-up 2026-07-08T11:09:38-04:00
LuminaryLabs-Publish/IntoTheMeadow       tracked / root .agent present / latest sampled follow-up 2026-07-08T10:48:47-04:00
LuminaryLabs-Publish/MyCozyIsland        tracked / root .agent present / latest sampled follow-up 2026-07-08T11:40:00-04:00
LuminaryLabs-Publish/PhantomCommand      tracked / root .agent present / latest sampled follow-up 2026-07-08T10:58:46-04:00
LuminaryLabs-Publish/PrehistoricRush     selected fallback / previous alignment 2026-07-08T10:39:22-04:00
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/TheOpenAbove        tracked / root .agent present / latest sampled follow-up 2026-07-08T11:49:04-04:00
LuminaryLabs-Publish/TheUnmappedHouse    tracked / root .agent present / latest sampled follow-up 2026-07-08T11:28:38-04:00
LuminaryLabs-Publish/ZombieOrchard       tracked / root .agent present / latest sampled follow-up 2026-07-08T11:19:53-04:00
```

## Product read

`PrehistoricRush` is a standalone static browser repo for a NexusEngine-powered prehistoric infinite runner.

The repo README describes the scene flow as:

```txt
menu -> game -> run-over -> win -> menu
```

The repo should remain product-thin while reusable behavior moves into NexusEngine core kits or ProtoKits only after stable local proof.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose globalThis.PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> await import("./runtime-terrain-v6.mjs")
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> shell mounts DOM, panel, status, and start button
  -> setup creates scene, camera, renderer, terrain, raptor, rocks, shards, and tree pools
  -> createPhysics configures Rapier fallback/bridge
  -> player starts game scene
  -> keyboard/button input changes turn, jump, boost, and scene start/retry behavior
  -> loop mutates speed, yaw, jump, distance, terrain, physics, contacts, pickups, and scene result inline
  -> baseline runtime mutates raptor pose, camera, HUD DOM, and renderer frame
  -> src/game.js presentation pass applies close camera, readable stride, DSK HUD DOM, and a second renderer frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain, and renderer fields
```

## Target proof loop

```txt
Live app.state and app.scene
  -> RunnerSourceState
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> dino-pose-domain-kit consumes runner.moved
  -> eventBus emits dino.pose.changed
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
  -> bounded PresentationJournal
  -> PrehistoricRushHost.getState().presentation
  -> DOM-free fixture rows
```

## Domains identified

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
camera-follow-policy
hud-telemetry-projection
presentation-pass-authority
runner-source-state-contract
runner-moved-event-contract
dino-pose-event-bridge
dino-pose-frame-contract
camera-frame-request-contract
hud-frame-request-contract
presentation-frame-contract
presentation-journal-contract
host-presentation-snapshot
fixture-replay-contract
repo-local-agent-state
central-ledger-readback
```

## Services identified

Current services:

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
createRunnerMovedEvent
emitRunnerMoved
recordDinoPoseChangedEvent
createDinoPoseFrame
createCameraFrameRequest
createHudFrameRequest
createPresentationFrameRecord
appendPresentationJournalEntry
projectHostPresentationSnapshot
runPresentationFrameFixture
```

## Kits identified

Existing repo-local kits:

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

Current external live kit:

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

Next local proof kits:

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-event-bridge-kit
prehistoric-rush-dino-pose-frame-kit
prehistoric-rush-camera-frame-request-kit
prehistoric-rush-hud-frame-request-kit
prehistoric-rush-presentation-frame-record-kit
prehistoric-rush-presentation-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-dom-free-presentation-fixture-kit
```

## Main finding

`PrehistoricRush` already has a good scaffold for event/domain composition, but the live runner loop remains the source of truth and the presentation pass still reads `PrehistoricRushHost.app` directly.

The next useful implementation should not replace renderer or gameplay. It should add a narrow, additive source-wire layer that records runner source state, movement events, dino pose frames, camera frame requests, HUD frame requests, and a host presentation snapshot without changing the current visible route.

## Next safe ledge

```txt
PrehistoricRush Runner Event Fixture Source Map
```

Stop the next implementation when a DOM-free fixture can replay stable source rows into:

```txt
RunnerSourceState
RunnerMovedEvent
runner.moved
dino.pose.changed
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
PresentationFrameRecord
PrehistoricRushHost.getState().presentation
```

## Validation status

No runtime source files changed in this pass.

No local checkout, browser validation, npm command, static server, Playwright run, Rapier execution, Three.js execution, or DOM-free fixture was run.
