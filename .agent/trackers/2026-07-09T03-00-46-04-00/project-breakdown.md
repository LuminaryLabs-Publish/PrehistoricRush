# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-09T03-00-46-04-00`

**Branch target:** `main`

## Selection result

The accessible `LuminaryLabs-Publish` repository list was compared against the central tracked/documented repo ledger in `LuminaryLabs-Dev/LuminaryLabs`.

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

`PrehistoricRush` was selected because it had the oldest eligible central alignment among the checked non-excluded repos after newer ledger catch-up passes on the other publish projects.

## Publish repositories observed

```txt
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central alignment 2026-07-09T00-50-00-04-00
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central alignment 2026-07-09T01-09-24-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central alignment 2026-07-09T02-41-17-04-00
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central alignment 2026-07-09T02-05-52-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central alignment 2026-07-09T02-11-07-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central alignment 2026-07-09T02-31-41-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central alignment 2026-07-09T00-40-20-04-00
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central alignment 2026-07-09T01-28-10-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central alignment 2026-07-09T00-09-22-04-00
```

## Current product read

`PrehistoricRush` is a standalone static browser infinite runner.

The static route is `index.html -> src/runtime.mjs -> src/game.js -> src/runtime-terrain-v6.mjs`.

`src/game.js` installs repo-local composition/domain scaffolding first, then imports the live terrain route and starts an extra presentation pass.

`src/runtime-terrain-v6.mjs` owns the current playable loop: Three.js, Rapier, terrain chunks, raptor rig, pickups, hazards, score, camera, HUD, scene states, and `PrehistoricRushHost.getState()`.

## Interaction loop

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
  -> runtime creates DOM shell, Three.js scene, Rapier bridge, terrain, props, raptor, pickups, hazards, and HUD panel
  -> menu waits for Start, Enter, or Space
  -> keyboard input mutates left/right/boost/jump flags
  -> game loop mutates speed, yaw, jump, distance, terrain, colliders, pickups, scene, and score inline
  -> runtime-terrain-v6 applies baseline raptor pose, camera, HUD, and renderer frame
  -> src/game.js presentation pass applies readable stride, close camera, HUD rewrite, and second renderer frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain, and renderer fields
```

## Domains in use

```txt
runtime and composition:
  static-browser-shell
  module-runtime-entry
  composition-bootstrap
  event-bus-history
  domain-host-installation
  domain-idempotency
  tick-scheduler-scaffold
  host-diagnostics

entity descriptors:
  dino-entity-domain
  dino-form-domain
  dino-pose-domain
  dino-material-domain
  dino-domain-bundle

presentation descriptors:
  camera-domain
  hud-domain
  presentation-pass-authority
  camera-follow-policy
  hud-telemetry-projection

live visual runtime:
  legacy-visual-runtime-bridge
  cdn-dependency-loading
  three-render-runtime
  rapier-physics-runtime
  rapier-physics-domain-kit-bridge
  dom-mount-ownership
  keyboard-input-adapter
  button-input-adapter
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

next proof domains:
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
```

## Services the kits offer

```txt
current composition services:
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

current entity/presentation kit services:
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

current browser/runtime services:
  styleHud
  renderHud
  applyCloseCamera
  applyReadableStride
  startPresentationPass
  PrehistoricRushComposition.snapshot
  PrehistoricRushHost.getState
  rapier-physics-domain-kit services

needed next services:
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
  runPresentationEventBridgeFixture
```

## Kits

```txt
implemented repo-local kits:
  domain-runtime/event-bus
  domain-runtime/domain-host
  domain-runtime/tick-scheduler
  dino-form-domain-kit
  dino-pose-domain-kit
  dino-material-domain-kit
  dino-domain-bundle
  camera-domain-kit
  hud-domain-kit

live external kits:
  rapier-physics-domain-kit

runtime-implied kits:
  prehistoric-static-shell-kit
  prehistoric-runtime-entry-kit
  prehistoric-legacy-visual-runtime-kit
  prehistoric-raptor-visual-rig-kit
  prehistoric-terrain-streaming-kit
  prehistoric-contact-check-kit
  prehistoric-scene-dispatch-kit
  prehistoric-hud-dom-render-kit
  prehistoric-close-camera-apply-kit

next-cut kits:
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

The repo already has a playable visual route and a useful DSK scaffold.

The current blocker is not art, terrain, input, or movement feel.

The unresolved source seam is the presentation-event bridge: the live runner mutates state and visual output inline, while the installed `dino-pose-domain-kit` is already waiting for `runner.moved` events that the live route never emits.

## Next safe ledge

```txt
PrehistoricRush Presentation Event Bridge Consumer Contract + Host Projection Fixture Gate
```

Add pure `src/presentation/*` modules first, then splice them additively into `src/game.js` without changing the visible runner route.

The first useful proof is a DOM-free fixture showing that live runner source state can produce `RunnerStepDelta`, conditionally emit `runner.moved`, trigger `dino.pose.changed`, record camera/HUD/contact/scene/render readback, and expose `PrehistoricRushHost.getState().presentation`.

## Validation status

No runtime source changed in this pass.

No local checkout, static server, browser smoke, WebGL run, Rapier run, or DOM-free fixture was executed.

All changes target `main` only.