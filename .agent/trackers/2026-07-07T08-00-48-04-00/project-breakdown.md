# PrehistoricRush Project Breakdown

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-07T08-00-48-04-00`

**Selected repo:** `LuminaryLabs-Publish/PrehistoricRush`

## Selection reason

The central `LuminaryLabs-Dev/LuminaryLabs` ledger showed `LuminaryLabs-Publish/PhantomCommand` as the latest tracked Publish repo update at `2026-07-07T07-49-39-04-00`. `PrehistoricRush` is the next eligible repo in the tracked Publish rotation after excluding `LuminaryLabs-Publish/TheCavalryOfRome`.

## Repo role

`PrehistoricRush` is a standalone browser publish repo for a NexusEngine-powered prehistoric infinite runner.

The repo should stay thin. It should own the static browser shell, manifests, product-specific tuning, renderer bootstrap, input adapter binding, diagnostics exposure, and repo-local smoke fixtures. Reusable movement, scene flow, terrain sampling, scatter, contact, physics, camera, UI, and diagnostics behavior should move into NexusEngine core kits, existing ProtoKit families, or small repo-local service kits before promotion.

## Current runtime shape

```txt
index.html
  -> src/runtime.mjs
    -> src/runtime-terrain-v6.mjs
      -> Three.js CDN import
      -> Rapier CDN import
      -> rapier-physics-domain-kit CDN import
      -> inline shell / HUD / button creation
      -> inline Three renderer / camera / scene / fog / sky / lights
      -> inline procedural terrain and scatter
      -> inline raptor rig and animation
      -> inline input handling
      -> inline runner movement / jump / boost / gravity
      -> inline hazard / pickup contact
      -> inline result transitions
      -> globalThis.PrehistoricRushHost.getState()
```

`src/runtime.mjs` is already thin. `src/runtime-terrain-v6.mjs` is still the extraction target because it owns most reusable runtime behavior.

## Interaction loop

### Current interaction loop

```txt
load index.html
  -> import src/runtime.mjs
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> create shell, HUD, button, canvas, Three scene, terrain, lights, scatter, raptor, camera
  -> start in menu scene
  -> click Start Rush, press Enter, or press Space outside game
  -> scene becomes game
  -> A/D or ArrowLeft/ArrowRight steer yaw
  -> W or ArrowUp boosts toward boost speed
  -> Space during game requests jump
  -> runtime applies speed, yaw, gravity, jump height, terrain sample, distance, best distance, terrain streaming, scatter refresh, physics actor transform, pickup checks, and hazard checks
  -> hazard contact moves to run-over
  -> distance greater than 3600m moves to win
  -> HUD updates every frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain chunk count, and renderer id
```

### Intended player loop

```txt
menu
  -> start rush
  -> read terrain shape, hazard silhouettes, pickups, and route direction
  -> steer / boost / jump
  -> collect shards when safe
  -> avoid trees and rocks
  -> survive rising speed and density pressure
  -> hit hazard and retry, or reach target distance and win
```

### Recommended service loop

```txt
load manifest authority
  -> validate runner-tuning.json, game-scenes.json, scene files, kit-composition.json, and kit-cutover-inventory.json
  -> normalize scene result names
  -> bind raw keyboard/touch input into explicit actions
  -> feed actions into scene-flow and runner-state services
  -> runner-state emits position, velocity, jump, speed, distance, and animation phase
  -> terrain services sample height and stream chunks
  -> scatter services emit hazard and pickup descriptors
  -> physics/contact bridge resolves actor, colliders, pickups, win, and run-over requests
  -> raptor pose and camera services consume runner snapshots
  -> HUD and GameHost diagnostics consume stable snapshots
  -> behavior smoke replays scripted action frames
```

## Domains in use

```txt
static browser shell
GitHub Pages deploy surface
module runtime entry
CDN dependency loading
Three.js render host
Rapier runtime bridge
rapier-physics-domain-kit adapter
manifest authority
scene graph manifest
scene transition map
menu scene
active runner scene
run-over result scene
win result scene
keyboard input adapter
button input adapter
runner input intent
scene-flow state
runner state snapshot
runner yaw and steering
forward speed ramp
boost target speed
jump request buffering
gravity integration
grounded state
terrain height sampling
terrain color sampling
terrain chunk streaming
procedural grid mesh generation
scatter population
safe clear radius enforcement
instanced vegetation pools
instanced rock hazards
instanced shard pickups
pickup collection state
hazard contact state
local best-distance persistence
procedural raptor object rig
raptor pose animation
secondary tail / plate / limb motion
camera follow
camera look-ahead
HUD diagnostics
button label state
runner tuning manifest
scene manifest data
kit composition manifest
cutover inventory manifest
flock generation descriptor
GameHost diagnostics
behavior smoke target surface
config parity smoke target surface
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
shell.createRoot / createCanvasHost / createHudPanel / bindStartButton
runtime.importThree / importRapier / importRapierPhysicsKit / createFallbackImportDiagnostics
manifest.loadSceneGraph / loadSceneFile / loadRunnerTuning / loadKitComposition / loadCutoverInventory / validateShape / publishConfigDiagnostics
sceneFlow.getCurrentScene / startGame / requestRunOver / requestWin / retryRun / normalizeResultName / emitTransitionEvent
input.mapKeyboardEvent / mapButtonEvent / emitActionFrame / clearOneShotActions
scene.createThreeScene / createCamera / createRenderer / createLights / createSkyDome / resize
terrain.hash / heightAt / colorForHeight / createGridGeometry / createChunkGrid / rebuildChunk / updateAroundPlayer / sampleHeight
scatter.populateAroundPlayer / scatterTrees / scatterRocks / scatterShards / clearNearPlayer / recycleInstancedPools
physics.createRapierWorld / configureGravity / registerKinematicActor / setActorTransform / setFixedColliders / step
state.createRunnerState / restoreBestDistance / persistBestDistance / snapshot
runner.applyInputIntent / updateYaw / updateBoostedSpeed / applyJump / integrateGravity / advancePosition / updateDistance / updateGroundContact
contact.checkHazardCollision / resolveShardPickup / requestRunOver / requestWin / emitContactEvents
raptor.createRig / createBodyVolumes / createTail / createLegs / createArms / createHead / animatePose
camera.followRunner / lookAhead / emitCameraSnapshot
ui.renderStatus / setButtonLabel / renderKitStatus
gameHost.getState / getDiagnostics / getSceneSnapshot / getKitStatus / dispatch / subscribe
smoke.forceStart / forceRunOver / forceWin / forceShardPickup / assertSceneFlow / assertTuningParity
```

## Kits identified

### Core kits targeted by manifests

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

### Current live ProtoKit dependency

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

### Existing ProtoKit families to consume before inventing new ones

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
prehistoric-rush-scripted-input-smoke-kit
```

## Current blockers

```txt
runtime-tuning-duplication:
  src/runtime-terrain-v6.mjs still defines inline movement, terrain, and spawn tuning while runner-tuning.json defines a separate product tuning source of truth.

scene-result-name-mismatch:
  game-scenes.json routes game:runOver to run-over, while scenes/game.json still says nextOnLoss: fail.

space-key-semantic-overlap:
  Space starts the run outside game and jumps inside game. This can remain as UX, but it needs explicit input intents so Space never implies reset/restart while active.

monolithic-runtime-ownership:
  runtime-terrain-v6.mjs still owns shell, renderer, terrain, scatter, runner, contact, rig, camera, HUD, physics bridge, and host state.

partial-gamehost-surface:
  PrehistoricRushHost.getState() exists, but getDiagnostics, getSceneSnapshot, getKitStatus, dispatch, subscribe, and smoke hooks are missing.

no-package-script-surface:
  There is no package.json build/check surface in the repo, so validation is currently static/documentary unless a future static smoke harness is added.
```

## Key finding

The highest leverage next work is not new scenery, new hazards, or more raptor visuals. The current playable loop already proves the product. The next cutover should make runtime authority explicit by loading config first, normalizing scene transitions, routing input through explicit action frames, and exposing deterministic host/smoke surfaces.

## Recommended next work

```txt
PrehistoricRush Manifest Loader + Input Intent Scene Flow Cutover:
  keep index.html and src/runtime.mjs thin
  add prehistoric-rush-manifest-loader-kit
  load runner-tuning.json, game-scenes.json, scenes/game.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
  publish config diagnostics and fallback reasons
  make inline tuning constants fallback-only
  normalize loss naming so run-over is canonical and fail is a compatibility alias only
  add prehistoric-rush-input-intent-kit
  map button, Enter, Space, A/D, arrows, and W/ArrowUp into explicit action frames
  guarantee Space only emits jump while scene is game
  add prehistoric-rush-scene-flow-kit
  make start, run-over, win, retry, and menu transitions go through scene-flow service
  add prehistoric-rush-runner-state-kit fed by action frames and tuning config
  split contact bridge enough to emit run-over, win, and pickup events
  promote PrehistoricRushHost into prehistoric-rush-gamehost-kit
  add getDiagnostics, getSceneSnapshot, getKitStatus, dispatch, subscribe, and smoke commands
  add scripted input smoke for start, jump, boost, shard pickup, forced run-over, forced win, and tuning parity
```

## Acceptance targets

```txt
static source check passes if a script is added
PrehistoricRushHost.getState().scene starts as menu
PrehistoricRushHost.getDiagnostics() reports config load status
runner-tuning.json controls motion, camera, terrain, and streaming values
scene transitions use run-over consistently
Space emits jump only while scene is game
button/Enter/Space outside game route through explicit start intent
scripted action frames can start, jump, boost, collect, force run-over, and force win
scene snapshot reports scene, runner, distance, shards, terrain chunks, physics status, loaded config status, and kit status
behavior smoke proves menu -> game, game -> run-over, game -> win, shard pickup, and tuning parity
```

## Implementation note

No runtime source code was changed in this pass. This pass updates internal documentation, tracker state, and central ledger records only.
