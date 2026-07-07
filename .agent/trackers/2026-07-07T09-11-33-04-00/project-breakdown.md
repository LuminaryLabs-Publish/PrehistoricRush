# PrehistoricRush Project Breakdown

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-07T09-11-33-04-00`

**Selected after:** `LuminaryLabs-Publish/PhantomCommand`

## Selection note

`PrehistoricRush` was selected because the central ledger most recently documented `LuminaryLabs-Publish/PhantomCommand` at `2026-07-07T09-00-25-04-00`. `LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by rule.

Only this repo was worked during this breakdown run.

## Current status

`PrehistoricRush` is a standalone publish repo for a NexusEngine-style prehistoric runner. The live browser path is still:

```txt
index.html
-> src/runtime.mjs
-> src/runtime-terrain-v6.mjs
-> Three.js CDN
-> Rapier CDN
-> rapier-physics-domain-kit CDN
-> shell / HUD / Three scene / terrain / scatter / raptor / camera / physics bridge / GameHost
```

`src/runtime.mjs` is already thin and imports `src/runtime-terrain-v6.mjs` directly. The active runtime still owns reusable logic inline: module imports, tuning fallback constants, shell/HUD creation, terrain chunking, terrain sampling, scatter, pickups, hazards, raptor rig, pose animation, camera, scene transitions, physics bridge, and partial debug host state.

The previous slice correctly identified `Manifest Loader + Input Intent Scene Flow`. This run keeps that direction but sharpens the implementation into `Action Frame Replay + Host Diagnostics Contract`, because the next work should not only map input into actions, it should make those action frames replayable and visible through stable diagnostics.

## Current interaction loop

```txt
load index.html
-> import src/runtime.mjs
-> import src/runtime-terrain-v6.mjs
-> import Three.js, Rapier, and rapier-physics-domain-kit from CDN
-> create DOM shell, status panel, Start Rush button, renderer, scene, lights, camera, terrain, scatter, raptor, and physics world
-> enter menu scene
-> user starts rush through button, Enter, or Space outside active gameplay
-> enter game scene
-> raw keyboard state drives steer / boost / jump behavior
-> runner state updates yaw, speed, gravity, jump height, grounded contact, distance, and terrain position
-> terrain chunks rebuild around runner
-> props, hazards, and shards are scattered around runner
-> Rapier actor and fixed colliders are updated
-> contact bridge resolves pickups and hazard impacts
-> distance target requests win
-> hazard impact requests run-over
-> HUD text and button label update
-> PrehistoricRushHost exposes partial state
```

## Intended product loop

```txt
menu
-> start rush
-> read route, terrain, hazards, pickups, and dinosaur state
-> steer left / right
-> boost through safe stretches
-> jump over or through readable terrain/hazard moments
-> collect shards
-> avoid hazard contact
-> survive speed and density ramp
-> win at target distance or lose on run-over
-> retry, return to menu, or run again
```

## Recommended service loop

```txt
load manifest authority
-> validate game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, and kit-cutover-inventory.json
-> normalize scene result aliases so run-over is canonical and fail is compatibility-only
-> bind raw keyboard/button/touch events into ActionFrame records
-> append accepted ActionFrame records to a replay journal
-> reject or ignore scene-invalid action meanings explicitly
-> feed action frames into scene-flow and runner-state services
-> runner-state emits position, velocity, grounded, jump, speed, distance, and animation phase snapshots
-> terrain services sample height and stream chunks
-> scatter services emit hazard and pickup descriptors
-> physics/contact bridge resolves actor transforms, colliders, pickups, impacts, and result requests
-> GameHost exposes scene snapshot, input snapshot, replay journal, config diagnostics, kit status, and smoke commands
-> scripted smoke replays action frames for start, jump, boost, pickup, forced run-over, forced win, and tuning parity
```

## Domains in use

```txt
static-browser-shell
module-runtime-entry
cdn-dependency-loading
three-render-host
rapier-runtime-bridge
rapier-physics-domain-kit-adapter
manifest-authority
runner-tuning-manifest
scene-graph-manifest
scene-transition-map
scene-file-loading
menu-scene
active-runner-scene
run-over-result-scene
win-result-scene
keyboard-input-adapter
button-input-adapter
touch-input-adapter-target
runner-input-intent
action-frame-contract
action-frame-replay-journal
scene-flow-state
result-alias-normalization
runner-state-snapshot
runner-yaw-and-steering
forward-speed-ramp
boost-target-speed
jump-request-buffering
coyote-time-target
gravity-integration
grounded-state
terrain-height-sampling
terrain-color-sampling
terrain-chunk-streaming
procedural-grid-mesh-generation
scatter-population
safe-clear-radius-enforcement
vegetation-scatter
rock-hazard-scatter
shard-pickup-scatter
pickup-collection-state
hazard-contact-state
contact-event-bridge
local-best-distance-persistence
procedural-raptor-rig
raptor-pose-animation
secondary-tail-plate-limb-motion
camera-follow
camera-look-ahead
hud-diagnostics
button-label-state
gamehost-snapshot-contract
gamehost-diagnostics-contract
kit-status-reporting
config-parity-smoke
behavior-smoke
scripted-input-smoke
```

## Source and config surfaces

```txt
index.html
src/runtime.mjs
src/runtime-terrain-v6.mjs
game-scenes.json
scenes/menu.json
scenes/game.json
scenes/run-over.json
scenes/win.json
runner-tuning.json
flock-generation.json
kit-composition.json
kit-cutover-inventory.json
RUNNER_RESEARCH.md
.agent/README.md
.agent/kit-registry.json
```

## Services identified

```txt
shell.createRoot
shell.createCanvasHost
shell.createHudPanel
shell.bindStartButton
runtime.importThree
runtime.importRapier
runtime.importRapierPhysicsKit
runtime.createFallbackImportDiagnostics
manifest.loadSceneGraph
manifest.loadSceneFile
manifest.loadRunnerTuning
manifest.loadKitComposition
manifest.loadCutoverInventory
manifest.validateShape
manifest.normalizeResultAliases
manifest.publishConfigDiagnostics
input.mapKeyboardEvent
input.mapButtonEvent
input.mapTouchEvent
input.emitActionFrame
input.clearOneShotActions
input.rejectSceneInvalidAction
actionReplay.append
actionReplay.snapshot
actionReplay.replay
sceneFlow.getCurrentScene
sceneFlow.startGame
sceneFlow.requestRunOver
sceneFlow.requestWin
sceneFlow.retryRun
sceneFlow.returnToMenu
sceneFlow.emitTransitionEvent
scene.createThreeScene
scene.createCamera
scene.createRenderer
scene.createLights
scene.createSkyDome
scene.resize
terrain.hash
terrain.heightAt
terrain.colorForHeight
terrain.createGridGeometry
terrain.createChunkGrid
terrain.rebuildChunk
terrain.updateAroundPlayer
terrain.sampleHeight
scatter.populateAroundPlayer
scatter.scatterTrees
scatter.scatterRocks
scatter.scatterShards
scatter.clearNearPlayer
scatter.recycleInstancedPools
physics.createRapierWorld
physics.configureGravity
physics.registerKinematicActor
physics.setActorTransform
physics.setFixedColliders
physics.step
runner.createRunnerState
runner.restoreBestDistance
runner.persistBestDistance
runner.applyInputIntent
runner.updateYaw
runner.updateBoostedSpeed
runner.applyJump
runner.integrateGravity
runner.advancePosition
runner.updateDistance
runner.updateGroundContact
runner.snapshot
contact.checkHazardCollision
contact.resolveShardPickup
contact.requestRunOver
contact.requestWin
contact.emitContactEvents
raptor.createRig
raptor.createBodyVolumes
raptor.createTail
raptor.createLegs
raptor.createArms
raptor.createHead
raptor.animatePose
camera.followRunner
camera.lookAhead
camera.emitCameraSnapshot
ui.renderStatus
ui.setButtonLabel
ui.renderKitStatus
gameHost.getState
gameHost.getDiagnostics
gameHost.getSceneSnapshot
gameHost.getInputSnapshot
gameHost.getReplayJournal
gameHost.getKitStatus
gameHost.dispatch
gameHost.subscribe
smoke.forceStart
smoke.forceRunOver
smoke.forceWin
smoke.forceShardPickup
smoke.replayActionFrames
smoke.assertSceneFlow
smoke.assertTuningParity
```

## Kits identified

### Core kits targeted

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

### Existing live ProtoKit dependency

```txt
rapier-physics-domain-kit
```

Service surface:

```txt
initWorld
install
configure
registerKinematicActor
setActorTransform
setFixedColliders
step
getSnapshot
```

### Missing ProtoKit candidate

```txt
run-movement-kit
```

Required reusable service surface:

```txt
createRunnerController
applyInputIntent
bufferJump
resolveCoyoteWindow
tickFixedStep
emitMotionDescriptor
emitAnimationPhaseDescriptor
snapshot
```

### Existing ProtoKit families to consume first

```txt
course-direction / route-clearance family
race-pacing family
race-hazard family
racer-contact family
flock-agent family
vegetation-placement / scatter-placement / terrain-ground-contact family
vegetation-lod / instanced-batch family
configurable-render-layer family
material / lighting descriptor family
```

### Repo-local extraction kits

```txt
prehistoric-rush-static-shell-kit
prehistoric-rush-manifest-loader-kit
prehistoric-rush-scene-flow-kit
prehistoric-rush-input-intent-kit
prehistoric-rush-action-frame-replay-kit
prehistoric-rush-three-render-host-kit
prehistoric-rush-terrain-stream-kit
prehistoric-rush-terrain-sampler-kit
prehistoric-rush-ground-collider-kit
prehistoric-rush-prop-scatter-kit
prehistoric-rush-pickup-scatter-kit
prehistoric-rush-hazard-descriptor-kit
prehistoric-rush-raptor-rig-kit
prehistoric-rush-raptor-pose-kit
prehistoric-rush-runner-state-kit
prehistoric-rush-contact-bridge-kit
prehistoric-rush-camera-follow-kit
prehistoric-rush-hud-diagnostics-kit
prehistoric-rush-gamehost-kit
prehistoric-rush-host-diagnostics-contract-kit
prehistoric-rush-behavior-smoke-kit
prehistoric-rush-tuning-parity-smoke-kit
prehistoric-rush-scripted-input-smoke-kit
```

## Key blockers

```txt
runtime-tuning-duplication:
  runner-tuning.json defines baseForwardSpeed, maxForwardSpeed, boostForwardSpeed, camera, terrain, streaming, and rules, but runtime-terrain-v6.mjs still carries inline numeric fallback values.

scene-result-name-mismatch:
  game-scenes.json routes game:runOver to run-over, while scenes/game.json still says nextOnLoss: fail.

space-key-semantic-overlap:
  Space can start outside gameplay and jump inside gameplay. Keep this UX if desired, but convert it into explicit scene-scoped action frames and smoke it.

action-replay-gap:
  Input is currently live state, not a replayable action stream. This blocks deterministic behavior smoke and makes future run-movement-kit promotion harder.

partial-gamehost-surface:
  PrehistoricRushHost.getState() exists, but stable getDiagnostics, getSceneSnapshot, getInputSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and smoke commands do not.

monolithic-runtime-ownership:
  src/runtime-terrain-v6.mjs still owns shell, renderer, terrain, scatter, runner, contact, raptor, camera, HUD, physics bridge, and host state.

no-package-script-surface:
  No package.json was found, so validation should begin with browser/static smoke fixtures or a tiny script harness before claiming build/test coverage.
```

## Recommended next work

**Build target:** `PrehistoricRush Action Frame Replay + Host Diagnostics Contract`

```txt
keep index.html and src/runtime.mjs thin
-> add prehistoric-rush-manifest-loader-kit
-> load runner-tuning.json, game-scenes.json, scenes/game.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> make inline tuning fallback-only and report each fallback in diagnostics
-> normalize run-over as canonical loss result and keep fail only as a compatibility alias
-> add prehistoric-rush-input-intent-kit
-> emit ActionFrame records for button, Enter, Space, A/D, arrows, W/ArrowUp, and touch controls
-> guarantee Space emits jump only while scene is game
-> add prehistoric-rush-action-frame-replay-kit
-> journal accepted action frames with frame, time, scene, action, value, and source
-> add replay smoke that can drive start, steer, boost, jump, shard pickup, forced run-over, and forced win
-> add prehistoric-rush-scene-flow-kit for start, run-over, win, retry, menu, and result aliasing
-> add prehistoric-rush-runner-state-kit fed by action frames and runner-tuning.json
-> split contact bridge enough to emit pickup, impact, run-over, and win events
-> promote PrehistoricRushHost into prehistoric-rush-gamehost-kit
-> expose getDiagnostics, getSceneSnapshot, getInputSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and smoke commands
```

## Acceptance targets

```txt
PrehistoricRushHost.getState().scene starts as menu
PrehistoricRushHost.getDiagnostics() reports config load status and fallback reasons
runner-tuning.json controls motion, camera, terrain, streaming, and rule values
scene transitions use run-over consistently
fail is accepted only as a compatibility alias
Space emits jump only while scene is game
button, Enter, and Space outside game route through explicit start intent
accepted ActionFrame records are journaled
scripted replay can start, jump, boost, collect, force run-over, and force win
scene snapshot reports scene, runner, distance, shards, terrain chunks, physics status, loaded config status, kit status, and replay status
behavior smoke proves menu -> game, game -> run-over, game -> win, shard pickup, action replay, and tuning parity
```

## Change scope

No runtime source code was changed and no local build/test run was executed. This pass only updated documentation, tracker, registry, and central ledger files.
