# PrehistoricRush Project Breakdown

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-07T10-21-39-04-00`

**Selected after:** `LuminaryLabs-Publish/PhantomCommand`

## Selection note

`PrehistoricRush` was selected because the central ledger most recently documented `LuminaryLabs-Publish/PhantomCommand` at `2026-07-07T10-08-37-04:00`. `LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by rule.

Only this repo was worked during this breakdown run.

## Current status

`PrehistoricRush` is a standalone publish repo for a NexusEngine-style prehistoric runner.

The live browser path is still:

```txt
index.html
-> src/runtime.mjs
-> src/runtime-terrain-v6.mjs
-> Three.js CDN
-> Rapier CDN
-> rapier-physics-domain-kit CDN
-> shell / HUD / Three scene / terrain / scatter / raptor / camera / physics bridge / GameHost
```

`src/runtime.mjs` is already thin. The active runtime remains `src/runtime-terrain-v6.mjs`, and it still owns the runtime boot, inline tuning defaults, shell, HUD, terrain grid, terrain sampler, scatter pools, pickups, hazards, raptor rig, raptor pose, camera follow, scene transitions, physics bridge, partial host state, and button/keyboard semantics.

The clearest next cut is narrower than broad extraction: first stabilize scene result naming, action-frame ingress, and replayable smoke fixtures. That gives the repo an authority seam before moving runner motion, contact, terrain, and rendering into separate kits.

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
-> raw keyboard state drives left/right steering, boost, and jump
-> runner state updates yaw, speed, jump velocity, jump height, grounded state, distance, and terrain sample
-> terrain chunks rebuild around the runner
-> scatter pools repopulate hazards and shards
-> physics bridge publishes dino transform and fixed colliders
-> contact checks resolve shard pickup, run-over, or win
-> HUD and button label update from live scene state
-> PrehistoricRushHost exposes partial getState output
```

## Intended player loop

```txt
menu
-> start rush
-> read terrain, hazards, pickups, and dinosaur heading
-> steer left / right
-> boost through safe stretches
-> jump when grounded
-> collect shards
-> avoid hazard contact
-> survive to target distance
-> enter run-over or win result scene
-> retry, return to menu, or run again
```

## Recommended service loop

```txt
load manifest authority
-> validate runner-tuning.json, game-scenes.json, scenes/*.json, kit-composition.json, and kit-cutover-inventory.json
-> normalize result aliases so run-over is canonical and fail is compatibility-only
-> bind raw keyboard/button/touch events into ActionFrame records
-> pass ActionFrame records through a scene-validity matrix
-> append accepted frames to a replay journal
-> expose rejected frames with reason and scene context
-> feed accepted frames into scene-flow, runner-state, and contact services
-> publish SceneSnapshot, InputSnapshot, ReplaySnapshot, ConfigSnapshot, and KitStatusSnapshot
-> run scriptable smoke fixtures for start, Space semantics, fail/run-over aliasing, forced pickup, forced run-over, forced win, and replay parity
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
scene-file-loading
scene-transition-map
scene-result-aliasing
menu-scene
active-runner-scene
run-over-result-scene
win-result-scene
button-input-adapter
keyboard-input-adapter
touch-input-adapter-target
scene-scoped-input-policy
action-frame-contract
action-frame-acceptance-policy
action-frame-rejection-policy
action-frame-replay-journal
scripted-input-fixture
scene-flow-state
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
result-transition-request
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
scene-result-smoke
behavior-smoke
replay-parity-smoke
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
sceneResult.resolveAlias
sceneResult.assertCanonicalRunOver
sceneResult.explainCompatibilityAlias
input.mapKeyboardEvent
input.mapButtonEvent
input.mapTouchEvent
input.emitActionFrame
input.clearOneShotActions
input.rejectSceneInvalidAction
input.getSceneValidityMatrix
actionFrame.accept
actionFrame.reject
actionFrame.snapshot
actionReplay.append
actionReplay.snapshot
actionReplay.replay
actionReplay.assertParity
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
gameHost.runSmoke
smoke.forceStart
smoke.forceRunOver
smoke.forceWin
smoke.forceShardPickup
smoke.assertSceneResultAliases
smoke.assertSpaceSemantics
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
prehistoric-rush-scene-result-alias-kit
prehistoric-rush-scene-flow-kit
prehistoric-rush-input-intent-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-frame-replay-kit
prehistoric-rush-scripted-action-fixture-kit
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
prehistoric-rush-scene-snapshot-contract-kit
prehistoric-rush-input-snapshot-contract-kit
prehistoric-rush-replay-snapshot-contract-kit
prehistoric-rush-behavior-smoke-kit
prehistoric-rush-tuning-parity-smoke-kit
prehistoric-rush-scene-result-smoke-kit
prehistoric-rush-scripted-input-smoke-kit
prehistoric-rush-replay-parity-smoke-kit
```

## Key blockers

```txt
runtime-tuning-duplication:
  runner-tuning.json defines baseForwardSpeed, maxForwardSpeed, boostForwardSpeed, camera, terrain, streaming, and rules, but runtime-terrain-v6.mjs still carries inline numeric fallback values.

scene-result-name-mismatch:
  game-scenes.json routes game:runOver to run-over, while scenes/game.json still says nextOnLoss: fail.

space-key-semantic-overlap:
  Space can start outside gameplay and jump inside gameplay. Keep the UX if desired, but convert it into explicit scene-scoped action frames and smoke it.

action-frame-validity-gap:
  Input is live boolean state with one-shot jump clearing. There is no action acceptance/rejection layer with frame, scene, source, and reason metadata.

action-replay-gap:
  Accepted input is not journaled. This blocks deterministic behavior smoke and future run-movement-kit promotion.

partial-gamehost-surface:
  PrehistoricRushHost.getState() exists, but stable getDiagnostics, getSceneSnapshot, getInputSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, runSmoke, and fixture accessors do not.

monolithic-runtime-ownership:
  src/runtime-terrain-v6.mjs still owns shell, renderer, terrain, scatter, runner, contact, raptor, camera, HUD, physics bridge, and host state.

no-package-script-surface:
  No package.json was found, so validation should begin with browser/static smoke fixtures or a tiny script harness before claiming build/test coverage.
```

## Recommended next work

**Build target:** `PrehistoricRush Scene Result Alias + ActionFrame Smoke Fixture Cutover`

```txt
keep index.html and src/runtime.mjs thin
-> add prehistoric-rush-manifest-loader-kit
-> load runner-tuning.json, game-scenes.json, scenes/game.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> add prehistoric-rush-scene-result-alias-kit
-> make run-over the canonical loss result
-> accept fail only as a compatibility alias and report the alias in diagnostics
-> add prehistoric-rush-action-frame-contract-kit
-> define ActionFrame fields: frame, time, scene, action, value, source, accepted, rejected, reason
-> add scene validity matrix for start, retry, menu, steer-left, steer-right, boost, jump, force-run-over, force-win, and force-pickup
-> guarantee Space emits start outside game and jump only while scene is game
-> add prehistoric-rush-action-frame-replay-kit
-> journal accepted frames and rejected frame diagnostics separately
-> add prehistoric-rush-scripted-action-fixture-kit
-> fixture scripts: start-from-menu, space-starts-menu, space-jumps-game, fail-alias-run-over, forced-pickup, forced-run-over, forced-win, replay-parity
-> promote PrehistoricRushHost into prehistoric-rush-gamehost-kit
-> expose getDiagnostics, getSceneSnapshot, getInputSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and runSmoke
-> defer terrain/render/raptor extraction until action/result smoke passes
```

## Acceptance targets

```txt
PrehistoricRushHost.getState().scene starts as menu
PrehistoricRushHost.getDiagnostics() reports config load status, fallback reasons, and result alias status
runner-tuning.json controls motion, camera, terrain, streaming, and rule values or diagnostics clearly report fallback use
scene transitions use run-over consistently
fail is accepted only as compatibility alias and never becomes the canonical scene id
button, Enter, and Space outside game route through explicit start ActionFrame records
Space emits jump only while scene is game
invalid scene/action pairs produce rejected ActionFrame diagnostics
accepted ActionFrame records are journaled
scripted fixtures can start, jump, boost, collect, force run-over, force win, and replay the same journal
scene snapshot reports scene, runner, distance, shards, terrain chunks, physics status, loaded config status, kit status, and replay status
behavior smoke proves menu -> game, game -> run-over, game -> win, shard pickup, scene result aliasing, action replay, and tuning parity
```

## Change scope

No runtime source code was changed and no local build/test run was executed. This pass only updated documentation, tracker, registry, and central ledger files.
