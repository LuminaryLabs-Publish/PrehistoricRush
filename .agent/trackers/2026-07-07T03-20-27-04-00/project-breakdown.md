# PrehistoricRush Project Breakdown

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-07T03:20:27-04:00`

**Selection reason:** `PrehistoricRush` was the next eligible `LuminaryLabs-Publish` repo in the observed publish order after documented repos and after skipping `TheCavalryOfRome` by rule.

## Executive finding

`PrehistoricRush` is already a playable shell for a prehistoric infinite runner, but it is still too product-heavy. The README, manifests, and cutover inventory clearly say the product repo should stay thin, while the current runtime still owns terrain streaming, motion, collision, camera smoothing, procedural raptor animation, pickups, HUD state, and partial physics integration.

The right next move is a DSK cutover, not more inline gameplay code.

## Interaction loop

### Current runtime loop

```txt
load index.html
-> import src/runtime.mjs
-> import src/runtime-terrain-v6.mjs
-> create DOM shell and HUD panel
-> load Three.js, Rapier, and rapier physics ProtoKit from CDN
-> build procedural terrain chunks, sky, lights, instanced trees, rocks, shards, and raptor
-> start in menu scene
-> click/Enter/Space starts game
-> steer left/right, boost, jump
-> stream terrain and props around player
-> update raptor pose, camera, HUD, physics actor, pickups, and collision
-> collision sends scene to run-over
-> distance threshold sends scene to win
-> expose PrehistoricRushHost.getState()
```

### Intended repo-level scene loop

```txt
menu
-> game
-> run-over
-> retry or menu
-> win
-> run again or menu
```

### Intended gameplay loop

```txt
start rush
-> accelerate through generated prehistoric terrain
-> steer around trees and rocks
-> jump or avoid collisions
-> collect crystal shards
-> maintain distance and speed
-> survive until target distance or fail on impact
-> record best distance and state snapshot
```

## Domains in use

```txt
static browser shell
runtime module entry
scene state machine
Three.js render world
procedural terrain streaming
terrain height sampling
terrain material/color sampling
spawn/population system
vegetation scatter
rock hazard scatter
shard pickup scatter
instanced render batching
procedural raptor actor
raptor rig and pose animation
runner movement
jump physics
speed and boost pacing
collision/contact detection
Rapier physics bridge
camera follow/look-ahead
HUD diagnostics
local best-distance persistence
scene/result state
configuration manifests
kit composition manifest
kit cutover inventory
flock generation descriptor
GitHub Pages static deployment
```

## Services identified

### Product shell services

```txt
shell.createRoot()
shell.createHudPanel()
shell.bindStartButton()
runtime.importThree()
runtime.importRapier()
runtime.importPhysicsKit()
runtime.exposeDebugHost()
```

### Scene and state services

```txt
scene.setMenu()
scene.startGame()
scene.failRun()
scene.winRun()
state.createRunnerState()
state.getSnapshot()
state.persistBestDistance()
```

### Terrain and spawn services

```txt
terrain.hash()
terrain.heightAt()
terrain.colorForHeight()
terrain.createChunkGrid()
terrain.rebuildChunk()
terrain.updateAroundPlayer()
terrain.sampleHeight()
spawn.populateAroundPlayer()
spawn.scatterTrees()
spawn.scatterRocks()
spawn.scatterShards()
spawn.clearNearPlayer()
spawn.emitColliders()
spawn.emitPickups()
```

### Actor, motion, and contact services

```txt
raptor.createRig()
raptor.animatePose()
runner.applyInput()
runner.updateYaw()
runner.updateSpeed()
runner.updateJump()
runner.advancePosition()
runner.collectPickup()
contact.checkHazardCollision()
physics.createRapierWorld()
physics.registerDinoActor()
physics.setActorTransform()
physics.setFixedColliders()
physics.step()
```

### Camera, render, and UI services

```txt
render.setupScene()
render.setupRenderer()
render.createInstancedPools()
render.drawFrame()
camera.followRunner()
camera.lookAhead()
ui.renderStatus()
ui.setButtonLabel()
```

## Kits currently targeted or implied

### Core kits targeted by repo files

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

### First missing ProtoKit

```txt
run-movement-kit
```

### Existing ProtoKit families to use first

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

### Runtime extraction candidates

```txt
prehistoric-rush-static-shell-kit
prehistoric-rush-three-render-host-kit
prehistoric-rush-terrain-stream-kit
prehistoric-rush-terrain-sampler-kit
prehistoric-rush-prop-scatter-kit
prehistoric-rush-pickup-scatter-kit
prehistoric-rush-raptor-rig-kit
prehistoric-rush-raptor-pose-kit
prehistoric-rush-runner-state-kit
prehistoric-rush-contact-bridge-kit
prehistoric-rush-hud-diagnostics-kit
```

## What each kit should offer

| Kit | Service surface |
|---|---|
| `run-movement-kit` | Own fixed-step runner state, speed ramp, boost, jump buffer, coyote timing, yaw/lane intent, ground state, and movement descriptors. |
| `course-direction / route-clearance` | Validate forward route space, look-ahead distance, never-block-all-lanes rules, and generated course safety. |
| `race-pacing` | Own distance targets, speed curve, difficulty ramp, relief pacing, and run pressure. |
| `race-hazard` | Emit hazard descriptors for trees, rocks, fossils, logs, gaps, and future prehistoric blockers. |
| `racer-contact` | Resolve player-to-hazard contacts, pickup contacts, impact events, run-over transition, and camera/UI impact descriptors. |
| `flock-agent` | Own sky agent state, separation/alignment/cohesion/goal seeking, depth layers, low-Hz updates, and render descriptors. |
| `vegetation-placement / scatter-placement` | Own terrain-bound scatter rules, spawn bands, clear radius, object pooling, and stable seeded placement. |
| `vegetation-lod / instanced-batch` | Own per-family instance counts, batching descriptors, culling, and near/mid/far budgets. |
| `configurable-render-layer` | Own readability layers, fog/sky/background layers, foreground hazards, pickup visibility, and UI overlay descriptors. |
| `material / lighting descriptor` | Own prehistoric palette, terrain color bands, sky color, fog, sun, emissive shards, and material presets. |
| `core-ui` | Own menu, run-over, win, HUD status, button labels, and state-driven UI descriptors. |
| `core-diagnostics` | Own failed imports, fallback physics status, current scene, terrain chunk count, and debug host validation. |

## Architecture diagnosis

The repo has a strong direction and useful configuration files, but there is a mismatch between the intended data-driven scene shell and the active runtime. The active runtime has already moved to a richer 3D Three.js terrain slice, yet most reusable behavior lives inside one inline module.

The most important issue is not visual quality. The important issue is ownership. Terrain streaming, scatter, movement, collision, camera feel, and raptor animation are all reusable domains. Leaving them in `src/runtime-terrain-v6.mjs` will make future changes harder and will prevent the publish repo from becoming a clean kit composition target.

## Recommended next work

```txt
PrehistoricRush DSK Cutover Slice:
  keep index.html and src/runtime.mjs as thin shell files
  split src/runtime-terrain-v6.mjs into source modules
  add a local kit registry in .agent or config
  move movement into run-movement-kit contract
  move terrain/chunk sampling behind terrain service descriptors
  move scatter into placement descriptors
  move collision into racer-contact descriptors
  move raptor pose into animation descriptors
  load runner-tuning.json instead of duplicating tuning constants
  load game-scenes.json instead of hardcoding scene transitions
  keep PrehistoricRushHost.getState() stable for smoke checks
```

## Minimum implementation checklist

- [ ] Keep `index.html` as semantic shell only.
- [ ] Keep `src/runtime.mjs` as the entry import only.
- [ ] Replace hardcoded tuning object with `runner-tuning.json` loading.
- [ ] Replace hardcoded scene transitions with `game-scenes.json` loading.
- [ ] Extract terrain generation into a terrain service module.
- [ ] Extract prop/pickup scatter into placement service modules.
- [ ] Extract runner movement into a kit-shaped controller surface.
- [ ] Extract collision into racer-contact shaped events.
- [ ] Extract raptor rig and pose into animation descriptor services.
- [ ] Preserve `PrehistoricRushHost.getState()`.
- [ ] Add a smoke path that can verify scene, distance, collision state, chunk count, and physics fallback/active state.

## Risks

- Product-side logic may keep growing if visual updates happen before kit extraction.
- `runner-tuning.json` and runtime constants can drift because the runtime currently duplicates values.
- `game-scenes.json` says `run-over`, while `scenes/game.json` has `nextOnLoss: fail`; this should be normalized.
- Rapier integration is useful but currently acts as a bridge around manual collision, so ownership should be clarified before adding more physics behavior.
- Search/index availability appears limited for this repo, so future agents should prefer direct file fetches for known paths.

## Next milestone definition

The next milestone is complete when the game still plays the current 3D raptor run, but the runtime is no longer a monolithic behavior owner. The repo should expose clear service seams for movement, terrain, scatter, contact, animation, UI, and diagnostics, with config loaded from existing JSON files.
