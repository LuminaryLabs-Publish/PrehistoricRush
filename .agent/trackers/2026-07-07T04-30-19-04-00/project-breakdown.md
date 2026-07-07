# PrehistoricRush Project Breakdown

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-07T04:30:19-04:00`

**Selection reason:** `PrehistoricRush` was selected as the next eligible `LuminaryLabs-Publish` repo after the latest tracked `PhantomCommand` pass. `TheCavalryOfRome` remains excluded by standing rule, so this run returns to the runner repo for the next follow-up cutover pass.

## Executive finding

`PrehistoricRush` is a playable prehistoric infinite-runner shell, but the repo is still carrying reusable runtime behavior directly inside product code.

The repo-level intent is already clear: keep the publish repo thin, own the shell/manifests/theme/bootstrap, and move reusable logic into NexusEngine core kits or ProtoKits. The immediate architectural gap is that `src/runtime.mjs` is thin, but it imports a large `src/runtime-terrain-v6.mjs` monolith that owns terrain sampling, chunk streaming, scatter, raptor rigging, movement, contact, camera, HUD, import fallbacks, and debug host exposure.

This pass adds the missing repo-local `.agent/kit-registry.json` and re-anchors the next work around cutting the monolith into bottom-up kit seams without adding more product-side gameplay rules.

## Interaction loop

### Current runtime loop

```txt
load index.html
-> import src/runtime.mjs
-> import src/runtime-terrain-v6.mjs
-> import Three.js, Rapier, and rapier-physics-domain-kit from CDN
-> create fixed DOM shell and HUD panel
-> build procedural terrain chunks
-> build materials, sky, lights, instanced world objects, pickups, and procedural raptor
-> start in menu/start state
-> player starts run through button, Enter, or Space
-> steer, jump, boost, and collect shards
-> terrain chunks and scatter update around the runner
-> raptor pose, camera, UI, physics actor, pickups, and hazard contacts update each frame
-> impact enters run-over state
-> goal distance enters win state
-> expose PrehistoricRushHost.getState() for diagnostics
```

### Intended scene loop

```txt
menu
-> game
-> run-over
-> retry or menu
-> win
-> again or menu
```

### Intended player loop

```txt
start rush
-> read incoming terrain and hazard silhouettes
-> steer left/right or jump
-> collect shards when safe
-> avoid rocks, trees, fossils, logs, and future blockers
-> survive increasing speed and density
-> hit target distance or fail on contact
-> persist best distance and inspect run state
```

## Domains in use

```txt
static browser shell
runtime module entry
CDN dependency loading
NexusEngine core-kit composition sketch
ProtoKit dependency sketch
scene graph / scene state machine
menu state
active run state
run-over result state
win result state
keyboard input adapter
runner intent state
runner movement controller
forward speed and boost pacing
jump buffer and coyote timing
ground/terrain alignment
terrain height sampling
terrain material/color sampling
procedural terrain chunk streaming
world scatter population
vegetation scatter
rock and fossil hazard scatter
crystal shard pickup scatter
safe clear-radius enforcement
instanced render batching
Three.js render world
lighting and sky presentation
procedural raptor actor
raptor skeletal/pose animation
secondary motion / follow-through descriptors
Rapier physics import bridge
physics actor transform sync
fixed collider emission
hazard contact detection
pickup contact detection
camera follow/look-ahead
HUD diagnostics and button state
local best-distance persistence
manifest-driven scene configuration
runner tuning configuration
kit-composition manifest
kit-cutover inventory
flock generation descriptor
GameHost diagnostics
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
runtime.loadManifests()
runtime.installKitComposition()
```

### Scene and state services

```txt
scene.loadSceneGraph()
scene.transition(request)
scene.setMenu()
scene.startGame()
scene.failRun()
scene.winRun()
scene.retryRun()
state.createRunnerState()
state.getSnapshot()
state.persistBestDistance()
state.restoreBestDistance()
```

### Runner movement services

```txt
runner.bindInputIntent()
runner.applyLaneIntent()
runner.applyBoostIntent()
runner.bufferJumpInput()
runner.resolveCoyoteWindow()
runner.updateForwardSpeed()
runner.updateYawOrLaneOffset()
runner.updateGroundedState()
runner.advancePosition()
runner.emitMotionDescriptor()
runner.emitAnimationDescriptor()
```

### Terrain and stream services

```txt
terrain.hash()
terrain.heightAt()
terrain.colorForHeight()
terrain.createChunkGrid()
terrain.rebuildChunk()
terrain.updateAroundPlayer()
terrain.sampleHeight()
terrain.emitGroundColliderDescriptors()
terrain.emitRenderDescriptors()
```

### Scatter, pickup, and hazard services

```txt
spawn.populateAroundPlayer()
spawn.scatterTrees()
spawn.scatterRocks()
spawn.scatterFossils()
spawn.scatterShards()
spawn.clearNearPlayer()
spawn.recycleBehindRunner()
spawn.emitHazardDescriptors()
spawn.emitPickupDescriptors()
pickup.resolveShardCollection()
contact.checkHazardCollision()
contact.emitImpactEvent()
```

### Actor and animation services

```txt
raptor.createRig()
raptor.animatePose()
raptor.applyStridePhase()
raptor.applyTurningLean()
raptor.applyJumpSquashStretch()
raptor.emitPoseDescriptor()
flock.updateAgentsLowHz()
flock.emitSkyAgentDescriptors()
```

### Render, physics, camera, UI, and diagnostics services

```txt
render.setupScene()
render.setupRenderer()
render.createInstancedPools()
render.drawFrame()
physics.createRapierWorld()
physics.registerDinoActor()
physics.setActorTransform()
physics.setFixedColliders()
physics.step()
camera.followRunner()
camera.lookAhead()
camera.applySpeedFov()
camera.applyImpactShake()
ui.renderStatus()
ui.setButtonLabel()
diagnostics.reportImportFallbacks()
diagnostics.reportSceneState()
gameHost.getState()
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

### Missing ProtoKit to create

```txt
run-movement-kit
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
rapier-physics-domain-kit
```

### Repo-local extraction kit candidates

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
```

## What each kit should offer

| Kit | Service surface |
|---|---|
| `run-movement-kit` | Fixed-step runner controller state, speed ramp, boost, jump buffer, coyote timing, lane/yaw intent, grounded state, motion descriptors, animation phase descriptors. |
| `course-direction / route-clearance` | Forward route constraints, look-ahead validation, lane availability, never-block-all-lanes checks, reaction-time safety. |
| `race-pacing` | Distance goals, speed curves, density budgets, relief pacing, near-miss pressure, run difficulty state. |
| `race-hazard` | Hazard descriptor emission for trees, rocks, fossils, logs, gaps, and future prehistoric blockers. |
| `racer-contact` | Player-to-hazard contact, shard pickup contact, impact events, run-over requests, camera/UI impact descriptors. |
| `flock-agent` | Sky agent state, separation/alignment/cohesion/goal seeking, low-Hz updates, interpolation descriptors. |
| `vegetation-placement / scatter-placement` | Terrain-bound scatter rules, spawn bands, clear radius, object pooling, stable seeded placement. |
| `vegetation-lod / instanced-batch` | Instance budgets, batching descriptors, culling, near/mid/far render tiers. |
| `configurable-render-layer` | Readability layers for terrain, hazards, pickups, background props, fog/sky, and UI overlay descriptors. |
| `material / lighting descriptor` | Prehistoric palette, terrain color bands, sky color, fog, sun, emissive shards, material presets. |
| `rapier-physics-domain-kit` | Physics world setup, actor body registration, fixed collider updates, step execution, fallback diagnostics. |
| `core-ui` | Menu, run-over, win, HUD status, button labels, and state-driven UI descriptors. |
| `core-diagnostics` | Failed imports, fallback status, active scene, chunk count, physics status, debug host validation. |
| `prehistoric-rush-gamehost-kit` | Stable `PrehistoricRushHost.getState()` shape, diagnostics snapshot, scene snapshot, run metrics, kit status list. |

## Architecture diagnosis

The repo has the correct product/kit philosophy in README and config files, but the live runtime remains a monolith. The most important follow-up is not another visual pass. It is an ownership pass:

```txt
src/runtime.mjs should remain a thin import shell
src/runtime-terrain-v6.mjs should be split into local services
local services should map directly to kit registry entries
registry entries should define promotion targets into core or ProtoKits
manifests should become the source of scene/tuning truth
GameHost should remain stable for smoke tests
```

The biggest concrete mismatch remains scene naming. `game-scenes.json` uses `game:runOver -> run-over`, while `scenes/game.json` still says `nextOnLoss: fail`. That should be normalized before extracting scene-flow services.

## Recommended next work

```txt
PrehistoricRush Kit Registry Cutover Slice:
  keep index.html and src/runtime.mjs as thin shell files
  keep src/runtime-terrain-v6.mjs behavior unchanged during extraction
  add src/services/terrain-stream.mjs
  add src/services/runner-motion.mjs
  add src/services/scatter-stream.mjs
  add src/services/raptor-pose.mjs
  add src/services/contact-bridge.mjs
  add src/services/gamehost-snapshot.mjs
  replace inline duplicated tuning with runner-tuning.json reads
  normalize scene result names between game-scenes.json and scenes/game.json
  make .agent/kit-registry.json the tracker for ownership and promotion state
  add a smoke test that proves start -> run-over and start -> win state paths
```

## Implementation guardrails

- Do not add more gameplay features before extraction.
- Preserve the current playable runner behavior while moving code into seams.
- Keep product repo responsibilities limited to shell, manifests, renderer bootstrap, adapter binding, and debug host exposure.
- Create `run-movement-kit` only after the runner-motion service contract is stable.
- Use existing ProtoKit families before adding new local kits.
- Keep `PrehistoricRushHost.getState()` stable so future automation can prove behavior without relying on visuals.
