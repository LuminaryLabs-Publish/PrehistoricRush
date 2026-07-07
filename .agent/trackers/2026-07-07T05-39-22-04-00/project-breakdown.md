# PrehistoricRush Project Breakdown

**Run timestamp:** `2026-07-07T05:39:22-04:00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Selected because:** the central LuminaryLabs ledger shows `PhantomCommand` as the latest completed Publish breakdown at `2026-07-07T05:31:31-04:00`, and `PrehistoricRush` is the oldest eligible Publish repo in the current tracked rotation after excluding `LuminaryLabs-Publish/TheCavalryOfRome`.

## Executive summary

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner. The repo has the right product shape: static browser shell, scene manifests, tuning/config files, and a debug host. The runtime is playable, but `src/runtime-terrain-v6.mjs` still owns most reusable game behavior directly.

The highest-value next step is a **Tuning Source of Truth + Service Extraction Cutover**. Keep the current runner behavior stable, load `runner-tuning.json` as the authoritative source, normalize scene-result names, and split the monolith into local services before promoting shared contracts into core kits or ProtoKits.

## Current interaction loop

```txt
load index.html
  -> import src/runtime.mjs
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> create shell, HUD, button, canvas, scene, terrain, lights, scatter, raptor, camera
  -> start in menu scene
  -> player clicks Start Rush or presses Enter/Space
  -> scene becomes game
  -> player steers with A/D or arrows
  -> player boosts with W/Up
  -> player jumps with Space
  -> runtime advances yaw, speed, gravity, jump height, distance, terrain sample, terrain chunks, scatter, Rapier actor, contacts, pickups, camera, HUD
  -> hazard contact enters run-over
  -> 3600m distance enters win
  -> expose PrehistoricRushHost.getState()
```

## Intended product loop

```txt
menu
  -> start rush
  -> read terrain, tree, rock, fossil, shard, and route silhouettes
  -> steer / boost / jump
  -> collect shards when safe
  -> avoid hazards
  -> survive speed and density ramp
  -> fail on impact or win at target distance
  -> retry, return to menu, or run again
```

## Domains in use

```txt
static browser shell
deployable GitHub Pages root
runtime module entry
CDN module loading
NexusEngine import intent
Three.js render host
Rapier runtime bridge
rapier-physics-domain-kit adapter
scene graph and transition map
menu scene
active game scene
run-over result scene
win result scene
keyboard input adapter
button input adapter
runner control intent
runner state snapshot
runner yaw / steering
boost speed target
jump / gravity / grounded state
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
scene manifest data
runner tuning data
kit composition data
cutover inventory data
flock generation descriptor
GameHost diagnostics
behavior smoke target surface
```

## Current files and runtime surfaces

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
.agent/kit-registry.json
```

## Services currently provided by the runtime

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
result.requestWin
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

### Existing ProtoKit dependency

```txt
rapier-physics-domain-kit
```

### Missing shared ProtoKit

```txt
run-movement-kit
```

Required service surface:

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

### Existing ProtoKit families to use before inventing new shared kits

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
rapier-physics-domain-kit
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
```

## Key findings

1. `src/runtime.mjs` is already thin, which is good. It only imports the current active runtime.
2. `src/runtime-terrain-v6.mjs` is the main extraction target. It owns shell creation, CDN imports, renderer setup, terrain, scatter, runner motion, raptor rigging, collision, result transitions, HUD, physics bridge, and GameHost state.
3. `runner-tuning.json` already defines the intended motion/camera/terrain/streaming/rule source of truth, but the live runtime still has inline tuning constants that do not exactly match it.
4. Scene data has a naming mismatch: `game-scenes.json` maps `game:runOver` to `run-over`, while `scenes/game.json` still says `nextOnLoss: fail`.
5. `PrehistoricRushHost.getState()` exists and is the correct smoke-test anchor, but it needs `getDiagnostics()`, `getSceneSnapshot()`, and stable kit status output before reliable automation can gate future changes.

## Next build slice

```txt
PrehistoricRush Tuning Source of Truth + Service Extraction Cutover
```

### Build order

```txt
1. Keep index.html and src/runtime.mjs thin.
2. Add a manifest/tuning loader service that loads runner-tuning.json, game-scenes.json, scenes/game.json, kit-composition.json, and kit-cutover-inventory.json.
3. Replace inline tuning constants with loaded runner-tuning values, with defaults only as fallback.
4. Normalize scene result naming so loss is consistently run-over.
5. Extract terrain sampling and terrain streaming into local source services.
6. Extract scatter population into prop, pickup, and hazard services.
7. Extract runner motion into a local runner-state service that can feed future run-movement-kit promotion.
8. Extract contact/pickup/result logic into a contact bridge service.
9. Extract raptor rig creation and pose animation into object/animation services.
10. Promote inline GameHost into prehistoric-rush-gamehost-kit with getState, getDiagnostics, getSceneSnapshot, and getKitStatus.
11. Add smoke fixtures for menu -> game, game -> run-over, game -> win, shard collection, and tuning-load parity.
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
behavior smoke can force run-over and win without relying on manual input
```

## Implementation notes

Do not create a global reusable `run-movement-kit` directly from the current monolith. First extract a repo-local runner service, prove it with behavior fixtures, then promote the stable subset into ProtoKits.

Do not add more product-side gameplay systems until the manifest/tuning source of truth and service seams are in place.
