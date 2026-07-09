# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T03-10-05-04-00`

**Branch target:** `main`

## Selection result

The current accessible `LuminaryLabs-Publish` organization repo list was compared against the tracked/documented repo ledger in `LuminaryLabs-Dev/LuminaryLabs`.

No checked non-Cavalry Publish repo was fully new, absent from the ledger, root-agent-missing, or otherwise undocumented.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by rule.

`PrehistoricRush` was selected because its repo-local `.agent/START_HERE.md` had already advanced to `2026-07-09T03-00-46-04-00`, while the central ledger still pointed at `2026-07-09T00-09-22-04-00`. This run closes that central-tracking drift and freezes the same presentation event bridge boundary as the next implementation ledge.

## Publish repositories checked

```txt
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central tracked
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central tracked
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central tracked
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central tracked
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central tracked
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central tracked
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central tracked
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central tracked
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PrehistoricRush      selected / central ledger drift behind repo-local .agent
```

## Current product read

`PrehistoricRush` is a static browser infinite runner. It boots through a small runtime entry, installs a repo-local DSK composition scaffold, loads a live Three.js/Rapier terrain runner, then applies a second presentation pass for close camera, readable raptor stride, and readable HUD.

The game is playable. The source problem is not product direction or visual expansion; the problem is that live runner and presentation facts are still not fixture-readable.

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
  -> DOM shell is created
  -> menu waits for button, Enter, or Space
  -> keyboard input mutates left/right/boost/jump flags
  -> game loop mutates speed, yaw, jump, position, distance, terrain, physics, pickups, contacts, score, and scene inline
  -> baseline runtime mutates raptor pose, camera, HUD DOM, and renderer frame
  -> src/game.js presentation pass reads PrehistoricRushHost.app
  -> applyReadableStride mutates the raptor rig again
  -> applyCloseCamera mutates the Three.js camera again
  -> renderHud rewrites HUD DOM again
  -> renderer renders a second frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain count, and renderer string
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
rapier-physics-domain-kit configure/register/step/getSnapshot bridge services
```

## Needed next services

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

`PrehistoricRush` should not get a visual rewrite, terrain rewrite, movement rewrite, or shared ProtoKit promotion next.

The highest-leverage cut is a repo-local presentation event bridge that projects live app state into stable records and uses the existing `dino-pose-domain-kit` `runner.moved` listener instead of keeping the dino pose domain disconnected from the live game.

## Next safe ledge

```txt
PrehistoricRush Central Ledger Sync + Presentation Event Bridge Consumer Freeze
```

## Required next implementation files

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

## Validation note

No runtime source code changed in this pass. This was a `.agent` and central-ledger documentation update only.
