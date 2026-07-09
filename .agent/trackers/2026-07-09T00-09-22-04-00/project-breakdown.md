# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-09T00-09-22-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch target:** `main`

**Runtime/source reference:** Nexus Engine / Realtime ChatGPT project context

## Plan ledger

**Goal:** Refresh the repo-local internal breakdown for `PrehistoricRush`, compare the full accessible `LuminaryLabs-Publish` repo list against central tracking, keep `TheCavalryOfRome` excluded, and narrow the next implementation ledge to the source-to-consumer presentation bridge that makes live runner state fixture-readable.

**Checklist**

- [x] Compare accessible `LuminaryLabs-Publish` repositories.
- [x] Compare central `LuminaryLabs-Dev/LuminaryLabs` repo-ledger state.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Select exactly one repo.
- [x] Identify the interaction loop.
- [x] Identify domains in use.
- [x] Identify kit services.
- [x] Identify implemented, external, runtime-implied, and next-cut kits.
- [x] Add timestamped tracker and turn-ledger entries.
- [x] Add architecture, render, gameplay, presentation-authority, and deploy audits.
- [x] Update root `.agent` operating docs.
- [x] Keep runtime source unchanged.
- [x] Push only to `main`.

## Selection result

`LuminaryLabs-Publish/PrehistoricRush` was selected.

No checked non-Cavalry Publish repo was new, central-ledger absent, recently added but undocumented, missing sampled root `.agent` state, or otherwise undocumented.

`PrehistoricRush` was the oldest eligible current central alignment among checked non-excluded repos.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

## Publish organization repositories observed

```txt
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central alignment 2026-07-08T22-51-43-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central alignment 2026-07-08T23-50-40-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central alignment 2026-07-08T22-19-38-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central alignment 2026-07-08T22-58-02-04-00
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central alignment 2026-07-08T21-50-56-04-00
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central alignment 2026-07-08T23-40-55-04-00
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central alignment 2026-07-08T22-38-17-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central alignment 2026-07-08T21-58-34-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central alignment 2026-07-08T23-19-33-04-00
```

## Current product read

`PrehistoricRush` is a static browser infinite runner. It already has a repo-local domain scaffold in `src/game.js`, a live Three.js/Rapier route in `src/runtime-terrain-v6.mjs`, and an additive presentation pass that improves camera, HUD, and dino stride.

The highest-value unresolved seam remains presentation consumer authority.

The live route still mutates runner state, scene state, contacts, camera, HUD, raptor pose, and renderer output inline. The repo-local domain scaffold already contains the first consumer seam, because `dino-pose-domain-kit` listens for `runner.moved`, but the live runner does not yet emit `runner.moved` records from actual app-state deltas.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost({ eventBus })
  -> createTickScheduler({ host, eventBus })
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose globalThis.PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> browser shell, scene, terrain, raptor, props, hazards, pickups, and physics bridge are created
  -> menu waits for Start, Enter, or Space
  -> keyboard input mutates left, right, boost, and jump flags
  -> game loop mutates speed, yaw, jump, distance, terrain, colliders, pickups, contacts, scene, score, and renderer frame inline
  -> src/game.js presentation pass applies close camera, readable stride, readability HUD, and a second render
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
```

## Target proof loop

```txt
PrehistoricRushHost.app.state + previous frame state
  -> RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> eventBus.emit("runner.moved")
  -> existing dino-pose-domain-kit consumes runner.moved
  -> eventBus emits dino.pose.changed
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

## Kit services

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
projectHostPresentationSnapshot
runPresentationConsumerFixture
```

## Kits identified

Implemented repo-local kits:

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

Live external kit:

```txt
rapier-physics-domain-kit
```

Runtime-implied product kits:

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

Next-cut repo-local kits:

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

`PrehistoricRush` should not get a visual expansion, renderer extraction, terrain rewrite, movement rewrite, or ProtoKit promotion first.

The next implementation should be a narrow additive source-to-consumer bridge:

```txt
RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> runner.moved emission
  -> dino.pose.changed readback
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
  -> DOM-free fixture rows
```

## Next safe ledge

```txt
PrehistoricRush Presentation Consumer Catch-up + Host Projection Fixture Gate
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
local npm install: no
local npm test: no
local npm run build: no
browser smoke: no
fixture replay: not run
pushed to main: yes
```
