# PrehistoricRush Project Breakdown

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-07T06:50:26-04:00`

**Central tracker dependency:** `LuminaryLabs-Dev/LuminaryLabs`

## Selection

`PrehistoricRush` was selected after checking the central Publish repo ledger. The previous eligible repo documented in the rotation was `LuminaryLabs-Publish/PhantomCommand` at `2026-07-07T06:41:55-04:00`, so `PrehistoricRush` is the next eligible tracked Publish repo after excluding `LuminaryLabs-Publish/TheCavalryOfRome`.

## Current state summary

`PrehistoricRush` is a playable browser-based prehistoric infinite runner shell.

The live runtime path is:

```txt
index.html
-> src/runtime.mjs
-> src/runtime-terrain-v6.mjs
-> Three.js CDN
-> Rapier CDN
-> rapier-physics-domain-kit CDN
-> procedural terrain / scatter / pickups / raptor / camera / HUD
-> globalThis.PrehistoricRushHost.getState()
```

`src/runtime.mjs` is already thin and only imports `src/runtime-terrain-v6.mjs`.

`src/runtime-terrain-v6.mjs` is still the main extraction target. It owns shell creation, CDN imports, renderer setup, terrain sampling, terrain chunk streaming, scatter placement, runner state, steering, boost, jump, gravity, Rapier bridge, collider publishing, pickup resolution, win/loss transitions, raptor rig creation, raptor pose animation, camera follow, HUD rendering, and the debug host.

The repo has the right configuration files for a cleaner kit-backed runner, but runtime authority has not been cut over to those manifests yet.

## Interaction loop

### Current implemented loop

```txt
load index.html
-> import src/runtime.mjs
-> import src/runtime-terrain-v6.mjs
-> import Three.js, Rapier, and rapier-physics-domain-kit
-> create fixed shell, HUD panel, start button, canvas, scene, camera, renderer, terrain, scatter, raptor, and lighting
-> start in menu scene
-> click Start Rush, press Enter, or press Space from menu/result
-> scene becomes game
-> keyboard controls steer left/right, boost forward, and jump
-> runtime advances yaw, speed, jump/gravity, terrain sample, distance, best distance, terrain chunks, scatter pools, colliders, physics actor transform, pickups, camera, and HUD
-> hazard contact enters run-over
-> distance over 3600m enters win
-> expose PrehistoricRushHost.getState()
```

### Intended product loop

```txt
menu
-> start rush
-> read route silhouettes, terrain, hazard gaps, pickups, and speed pressure
-> steer / boost / jump
-> collect shards when safe
-> avoid trees and rocks
-> survive speed and density ramp
-> lose on heavy impact
-> win at target distance
-> retry, return to menu, or run again
```

### Recommended next runtime loop

```txt
load manifest/tuning source of truth
-> validate scene result names
-> create scene flow service
-> create runner state service
-> create terrain sampler and stream services
-> create scatter and contact services
-> create raptor rig/pose services
-> create GameHost diagnostics service
-> run menu/game/result loop through service calls
-> expose deterministic state snapshots and smoke hooks
```

## Domains in use

```txt
static browser shell
GitHub Pages deploy surface
module runtime entry
CDN module loading
NexusEngine import intent
Three.js render host
Rapier runtime bridge
rapier-physics-domain-kit adapter
scene graph manifest
scene transition map
menu scene
active runner scene
run-over scene
win scene
keyboard input adapter
button input adapter
runner input intent
runner state snapshot
runner yaw / steering
forward-speed ramp
boost target speed
jump input / gravity / grounded state
terrain height sampling
terrain color sampling
terrain chunk streaming
procedural terrain mesh generation
scatter population
safe clear radius enforcement
instanced tree pools
instanced rock hazards
instanced shard pickups
pickup collection state
hazard contact state
local best-distance persistence
procedural raptor object rig
raptor pose animation
secondary motion / tail / plates / limb motion
camera follow and look-ahead
HUD diagnostics and button labels
runner tuning manifest
scene manifest data
kit composition manifest
cutover inventory manifest
flock generation descriptor
GameHost diagnostics
behavior smoke target surface
```

## Source and config surfaces inspected

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
scene.createThreeScene
scene.createCamera
scene.createRenderer
scene.createLights
scene.createSkyDome
scene.startGame
scene.failRun
scene.winRun
scene.retryRun
scene.normalizeResultName
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
state.createRunnerState
state.restoreBestDistance
state.persistBestDistance
state.snapshot
runner.applyInputIntent
runner.updateYaw
runner.updateBoostedSpeed
runner.applyJump
runner.integrateGravity
runner.advancePosition
runner.updateDistance
runner.updateGroundContact
contact.checkHazardCollision
contact.resolveShardPickup
contact.requestRunOver
contact.requestWin
raptor.createRig
raptor.createBodyVolumes
raptor.createTail
raptor.createLegs
raptor.createArms
raptor.createHead
raptor.animatePose
camera.followRunner
camera.lookAhead
ui.renderStatus
ui.setButtonLabel
gameHost.getState
gameHost.getDiagnostics
gameHost.getSceneSnapshot
gameHost.getKitStatus
smoke.forceStart
smoke.forceRunOver
smoke.forceWin
smoke.assertTuningParity
```

## Kits identified

### Current core-kit targets

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

Current live service surface:

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

### Missing ProtoKit

```txt
run-movement-kit
```

Required future service surface:

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

### Existing ProtoKit families to consume before inventing new kits

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
prehistoric-rush-behavior-smoke-kit
prehistoric-rush-tuning-parity-smoke-kit
```

## Main blockers

```txt
runtime-tuning-duplication:
  runner-tuning.json defines product tuning, but runtime-terrain-v6.mjs still owns inline speed, terrain, and spawn constants.

scene-result-name-mismatch:
  game-scenes.json routes game:runOver to run-over, while scenes/game.json still says nextOnLoss: fail.

space-key-semantic-overlap:
  Space starts/retries when not in game and jumps while in game. That is acceptable for the current shell, but the next service split should make action meanings explicit.

monolithic-runtime-ownership:
  runtime-terrain-v6.mjs is compressed into a small number of very long lines and owns multiple reusable domains.

partial-gamehost-surface:
  PrehistoricRushHost.getState() exists, but stable getDiagnostics, getSceneSnapshot, getKitStatus, and behavior-smoke hooks do not.

config-manifest-underuse:
  game-scenes.json, runner-tuning.json, kit-composition.json, and kit-cutover-inventory.json already describe intent, but runtime setup does not treat them as authority.
```

## Highest-value next work

```txt
PrehistoricRush Config Authority + Behavior Smoke Cutover
```

Build order:

```txt
1. Keep index.html and src/runtime.mjs thin.
2. Add prehistoric-rush-manifest-loader-kit.
3. Load runner-tuning.json, game-scenes.json, scenes/game.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup.
4. Make inline tuning constants fallback-only.
5. Normalize loss naming so run-over is canonical and fail is only a compatibility alias.
6. Add prehistoric-rush-scene-flow-kit for menu/game/run-over/win transitions.
7. Add prehistoric-rush-runner-state-kit for speed, yaw, boost, jump, gravity, distance, and best distance.
8. Add prehistoric-rush-terrain-sampler-kit and prehistoric-rush-terrain-stream-kit.
9. Add prehistoric-rush-prop-scatter-kit, pickup-scatter-kit, and hazard-descriptor-kit.
10. Add prehistoric-rush-contact-bridge-kit that consumes collider and pickup descriptors and emits result requests.
11. Add prehistoric-rush-raptor-rig-kit and prehistoric-rush-raptor-pose-kit.
12. Promote inline host into prehistoric-rush-gamehost-kit.
13. Add getDiagnostics, getSceneSnapshot, getKitStatus, and behavior-smoke commands.
14. Add smoke fixtures for menu -> game, game -> run-over, game -> win, shard pickup, and tuning parity.
```

## Acceptance targets

```txt
npm run check, if available
npm run build, if available
PrehistoricRushHost.getState().scene starts as menu
start command or button transitions to game
run-over transition uses run-over everywhere, not fail
runner-tuning.json controls runtime speed, gravity, jump, camera, terrain, and streaming values
scene snapshot reports current scene, runner position, distance, shards, terrain chunks, physics status, and kit status
behavior smoke can force run-over and win without manual input
tuning parity smoke proves config values are consumed by the runtime
```

## Final recommendation

Do not add new visible features first.

Make runtime authority explicit first: config loader, scene flow, runner state, terrain/scatter/contact services, and GameHost diagnostics.

After that, the next playable feature should be a small route-readability pass: clearer hazard silhouettes, better pickup readability, and deterministic relief segments controlled through manifests rather than inline constants.
