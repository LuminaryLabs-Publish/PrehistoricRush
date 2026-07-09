# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-09T06-10-35-04-00`

**Branch target:** `main`

## Selection result

The full accessible `LuminaryLabs-Publish` organization repo list was compared against the `LuminaryLabs-Dev/LuminaryLabs` central `repo-ledger/LuminaryLabs-Publish/*` records and sampled repo-local root `.agent` state.

```txt
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central latest 2026-07-09T04-30-54-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central latest 2026-07-09T05-51-49-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central latest 2026-07-09T03-29-29-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central latest 2026-07-09T04-50-00-04-00
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central ledger alignment before this pass
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central latest 2026-07-09T05-11-22-04-00
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central latest 2026-07-09T03-50-12-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central latest 2026-07-09T05-30-27-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central latest 2026-07-09T05-20-42-04-00
```

No checked non-Cavalry Publish repo was fully new, absent from central tracking, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`TheCavalryOfRome` remains excluded by standing rule.

`PrehistoricRush` was selected because its central ledger timestamp was the oldest eligible fallback after the most recent same-day catch-up passes.

## Current product read

`PrehistoricRush` is a static browser infinite runner with a repo-local DSK composition scaffold layered beside a live Three.js/Rapier terrain route.

The visible game already has menu, start, free steering, boost, jump, procedural terrain, hazards, shards, run-over, win, close camera, bigger stride, HUD readability, and a host debug surface.

The highest-value next seam is still presentation event authority: convert live app state into deterministic records without changing the visible runner.

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose globalThis.PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit from CDNs
  -> create DOM shell, Three scene, camera, renderer, terrain, raptor, rocks, trees, shards, and physics bridge
  -> menu waits for Start / Enter / Space
  -> keyboard input mutates left, right, boost, and jump flags
  -> game loop mutates speed, yaw, jump, distance, terrain, colliders, pickups, contacts, scene, score, and renderer frame inline
  -> baseline runtime mutates raptor pose, camera, HUD DOM, and renderer frame
  -> src/game.js presentation pass applies close camera, readable stride, DSK HUD DOM, and second renderer frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain, and renderer fields
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

## Services that kits offer

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

## Kits

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

`PrehistoricRush` should not get visual expansion, terrain rewrite, renderer extraction, movement rewrite, or ProtoKit promotion next.

The blocker is the event/readback bridge between the live app state and the repo-local domains. `runtime-terrain-v6.mjs` mutates live runner state directly, while `dino-pose-domain-kit` already listens for `runner.moved`; the missing cut is a stable movement event and presentation record chain that proves the consumer path.

## Next safe ledge

```txt
PrehistoricRush Presentation Event Readback + Host Projection Fixture Freeze
```

## Required next source files

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Validation status

Documentation and ledger pass only.

No runtime source files changed.

No branch or PR was created.

No local install, browser smoke, GitHub Pages smoke, or DOM-free presentation fixture was run because the fixture source files do not exist yet.
