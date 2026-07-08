# PrehistoricRush Project Breakdown

**Run timestamp:** `2026-07-07T23-21-18-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Default branch:** `main`

**Scope:** Nexus Engine / Realtime ChatGPT project documentation pass.

## Selection result

`LuminaryLabs-Publish/PrehistoricRush` was selected because the central `LuminaryLabs-Dev/LuminaryLabs` repo ledger showed it as the oldest eligible tracked `LuminaryLabs-Publish` repo by latest review timestamp.

`LuminaryLabs-Publish/TheCavalryOfRome` remained excluded by rule.

Latest eligible central ledger timestamps checked:

```txt
PrehistoricRush  2026-07-07T21:59:06-04:00  selected
MyCozyIsland     2026-07-07T22:11:41-04:00
IntoTheMeadow    2026-07-07T22:20:00-04:00
ZombieOrchard    2026-07-07T22:31:24-04:00
HorrorCorridor   2026-07-07T22:41:23-04:00
TheOpenAbove     2026-07-07T22:50:39-04:00
AetherVale       2026-07-07T22:59:19-04:00
PhantomCommand   2026-07-07T23:09:45-04:00
```

## Current repo read

`PrehistoricRush` is a standalone static browser game repo for a NexusEngine-aligned prehistoric runner.

The active boot route is still:

```txt
index.html
  -> src/runtime.mjs
  -> src/runtime-terrain-v6.mjs
```

`src/runtime.mjs` is intentionally thin and imports `src/runtime-terrain-v6.mjs` directly.

`src/runtime-terrain-v6.mjs` currently owns the live browser shell, Three.js import, Rapier import, Rapier ProtoKit import, tuning constants, DOM HUD, terrain generation, raptor rig, instancing, physics bridge, input state, runner motion, collision checks, pickup checks, win checks, camera follow, HUD projection, button label projection, and `globalThis.PrehistoricRushHost`.

The runtime is visually playable, but authority is still inline and not replayable.

## Source-backed findings

### Runtime entry

```txt
src/runtime.mjs -> import "./runtime-terrain-v6.mjs"
```

The runtime has no package build requirement for this slice. Validation should start with static source review and DOM-free fixture design.

### Live dependency path

```txt
three@0.179.1
@dimforge/rapier3d-compat@0.15.0
LuminaryLabs-Agents/NexusRealtime-ProtoKits/protokits/rapier-physics-domain-kit/index.js
```

The runtime imports these directly from CDN inside `src/runtime-terrain-v6.mjs`.

### Live inline tuning

```txt
motion.speed = 15
motion.maxSpeed = 25
motion.boostSpeed = 31
motion.turnRate = 2.55
motion.gravity = 34
motion.jump = 13.5
terrain.chunkSize = 46
terrain.radius = 3
terrain.segments = 24
terrain.seed = 238991
spawn.treesPerChunk = 8
spawn.rocksPerChunk = 3
spawn.shardsPerChunk = 2
spawn.clearRadius = 13
```

### Manifest tuning drift

`runner-tuning.json` carries product tuning intent, but it does not yet own runtime behavior.

```txt
runner-tuning.motion.baseForwardSpeed = 13.5
runner-tuning.motion.maxForwardSpeed = 24
runner-tuning.motion.boostForwardSpeed = 29
runner-tuning.motion.turnRate = 2.45
runner-tuning.terrain.chunkSize = 44
runner-tuning.terrain.chunkSegments = 20
runner-tuning.terrain.seed = prehistoric-rush-infinite-terrain-v1
```

### Scene alias drift

`game-scenes.json` declares the canonical loss scene as `run-over`.

`scenes/game.json` still declares `nextOnLoss` as `fail`.

The next implementation should not silently rename this. It should introduce a visible `SceneAliasCatalog` with `fail -> run-over` compatibility and a smoke fixture proving that alias.

### Kit composition state

`kit-composition.json` already points to NexusEngine main, lists core kit targets, points to ProtoKits, and names `run-movement-kit` as the first missing ProtoKit.

`kit-cutover-inventory.json` already records that the product should keep shell/boot/manifest/adapter/debug host surfaces, while reusable movement, spawning, hazard, scoring, flock, sky, camera, and scene transition rules should be cut toward core kits or ProtoKits.

### Flock config state

`flock-generation.json` describes flock-lite rules, a 36-agent max, 20 Hz updates, pooling, far/mid spawn bands, silhouette styling, procedural sine wingbeat visuals, and depth-layer descriptors.

The active `runtime-terrain-v6.mjs` does not yet consume this source. It should remain a post-source-lock visual extraction, not the next cut.

## Current player interaction loop

```txt
Load page
  -> see static Prehistoric Rush HUD and Start Rush button
  -> press Start Rush / Enter / Space
  -> scene changes from menu to game
  -> runner auto-moves forward
  -> hold A / ArrowLeft to steer left
  -> hold D / ArrowRight to steer right
  -> hold W / ArrowUp to boost
  -> press Space to jump
  -> collect shards by contact radius
  -> hit tree/rock collider to enter run-over
  -> exceed 3600m to enter win
  -> click Retry / Run Again / Start Rush button to restart scene flow
```

## Current runtime interaction loop

```txt
index.html mounts #app
  -> src/runtime.mjs imports runtime-terrain-v6
  -> load Three.js from CDN
  -> load Rapier from CDN
  -> load rapier-physics-domain-kit from ProtoKits CDN
  -> shell() clears #app and creates host/panel/status/button
  -> setup() creates scene/camera/renderer/light/fog/sky/terrain/raptor/instances
  -> state() creates mutable runner state
  -> createPhysics() installs Rapier kit into a tiny engine facade
  -> populate() streams scatter/collider/pickup descriptors around current chunk
  -> input listeners mutate app.input booleans
  -> requestAnimationFrame(loop)
  -> if scene=game, loop mutates movement, jump, speed, distance, terrain, physics, contacts, shards, and scene
  -> camera, raptor pose, HUD, button label, and renderer update every frame
  -> PrehistoricRushHost exposes app and getState()
```

## Target source-authority loop

```txt
load RuntimeSourceBundle
  -> load game-scenes.json
  -> load scenes/menu.json, scenes/game.json, scenes/run-over.json, scenes/win.json
  -> load runner-tuning.json
  -> load kit-composition.json
  -> load kit-cutover-inventory.json
  -> load flock-generation.json
  -> emit ManifestLoadStatus
  -> emit ManifestDriftReport
  -> emit SceneAliasCatalog with fail -> run-over
  -> adapt RuntimeRunnerTuning from manifests, with inline values fallback-only
  -> adapt SpawnBudgetSource from current inline behavior
  -> adapt WinThresholdSource from current inline behavior
  -> expose RuntimeSourceSnapshot from host diagnostics
```

## Target action / contact loop

```txt
DOM button / keyboard / future touch input
  -> InputAdapter emits ActionFrame
  -> ActionBatch preserves frame ordering
  -> ActionAcceptanceMatrix checks scene and action legality
  -> ActionResult records accepted / rejected with stable reason
  -> RunnerSourceState snapshot captures pre-step runner state
  -> RunnerStepResult wraps existing movement math first
  -> RunnerEventJournal records speed, heading, distance, jump, boost, terrain rebuild, pickup, impact, goal, and scene request facts
  -> ContactEvent records hazard-hit, shard-pickup, distance-goal
  -> ContactResultSnapshot reduces contact facts
  -> SceneDispatchResult owns menu/game/run-over/win transitions
  -> PrehistoricRushHost exposes diagnostics, snapshots, replay journal, dispatch, and smoke runners
  -> DOM-free fixtures replay accepted/rejected action and contact sequences
```

## Domains identified

### Runtime and shell domains

```txt
static-browser-shell
module-runtime-entry
cdn-dependency-loading
import-fallback-diagnostics
dom-mount-ownership
hud-panel-ownership
button-adapter-ownership
keyboard-input-adapter
future-touch-input-adapter
resize-adapter-ownership
debug-host-exposure
```

### Manifest and source authority domains

```txt
manifest-authority
manifest-load-status
manifest-drift-diagnostics
scene-graph-authority
scene-file-authority
scene-id-catalog
scene-result-aliasing
runtime-source-bundle
runtime-source-snapshot
runtime-tuning-adapter
spawn-budget-authority
win-threshold-authority
kit-composition-authority
cutover-inventory-authority
flock-generation-authority
host-diagnostics-contract
replay-snapshot-contract
dom-free-fixture-runtime
```

### Runner and action domains

```txt
actionframe-contract
action-batch-contract
action-acceptance-matrix
action-result-contract
action-result-journal
runner-source-state
runner-source-diff
runner-motion-policy
boost-policy
turn-yaw-policy
jump-policy
gravity-policy
distance-score-policy
runnerstepresult-contract
runnerevent-contract
runner-event-journal
scene-dispatch-result-contract
```

### Render, terrain, and object domains

```txt
three-renderer-host
scene-camera-lighting-fog
procedural-terrain-rendering
terrain-height-sampling
terrain-chunk-streaming
procedural-scatter-placement
collider-descriptor-generation
pickup-descriptor-generation
raptor-visual-rig
raptor-pose-animation
camera-follow-policy
hud-telemetry-projection
```

### Physics and contact domains

```txt
rapier-runtime-bridge
rapier-physics-domain-kit-adapter
kinematic-actor-transform
fixed-collider-publishing
physics-step-snapshot
hazard-contact-detection
pickup-contact-detection
distance-goal-detection
contactevent-contract
contact-result-reducer
```

### Fixture and smoke domains

```txt
manifest-load-smoke
manifest-drift-smoke
scene-alias-smoke
action-acceptance-smoke
runner-source-state-smoke
runner-step-smoke
contact-event-smoke
scene-dispatch-smoke
host-diagnostics-smoke
replay-parity-smoke
run-movement-promotion-smoke
```

## Current services identified

### Current product-side services

```txt
load
shell
createGrid
createTerrain
terrain.update
terrain.sample
mat
mesh
outline
capsuleBetween
makeRaptor
animateRaptor
treePools
sky
setup
state
populate
createPhysics
main
loop
PrehistoricRushHost.getState
```

### Current external / kit-backed services

```txt
rapier-physics-domain-kit.initWorld
rapier-physics-domain-kit.install
engine.n.rapierPhysics.configure
engine.n.rapierPhysics.registerKinematicActor
engine.n.rapierPhysics.setActorTransform
engine.n.rapierPhysics.setFixedColliders
engine.n.rapierPhysics.step
engine.n.rapierPhysics.getSnapshot
```

### Needed next services

```txt
loadRuntimeSourceBundle
loadProductManifests
loadSceneManifest
loadRunnerTuning
loadKitComposition
loadCutoverInventory
loadFlockGeneration
validateSceneFiles
validateKitComposition
validateCutoverInventory
validateFlockGeneration
adaptRuntimeRunnerTuning
adaptSpawnBudgets
adaptWinThreshold
compareLiveTuningToManifest
compareSceneAliases
compareSpawnBudgets
emitManifestLoadStatus
emitManifestDriftReport
emitRuntimeSourceSnapshot
normalizeResultScene
createSceneAliasCatalog
createActionFrame
createActionBatch
acceptActionForScene
rejectActionWithReason
appendActionResult
snapshotRunnerSourceState
diffRunnerSourceState
hydrateRunnerSourceState
reduceRunnerStep
emitRunnerStepResult
emitRunnerEvent
emitHazardHit
emitShardPickup
emitDistanceGoal
reduceContactEvent
emitContactResult
dispatchSceneRequest
appendSceneDispatchResult
getDiagnostics
getSnapshot
getReplayJournal
dispatch
runSmoke
runReplayParitySmoke
createRunMovementPromotionReport
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

### Current live ProtoKit

```txt
rapier-physics-domain-kit
```

Services currently used from this kit:

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

### Existing ProtoKit families to use before new product code

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

### Missing ProtoKit

```txt
run-movement-kit
```

Candidate services:

```txt
createRunnerController
applyActionFrame
bufferJump
resolveCoyoteWindow
tickFixedStep
emitRunnerStepResult
emitRunnerEvent
emitMotionDescriptor
emitAnimationPhaseDescriptor
snapshot
```

Promotion blockers:

```txt
manifest/source authority
scene result alias normalization
ActionFrame acceptance metadata
ActionResult journal
RunnerSourceState snapshots
RunnerStepResult metadata
RunnerEvent journal
ContactEvent journal
stable GameHost diagnostics
DOM-free behavior fixtures
```

### Repo-local next-cut kits

```txt
prehistoric-rush-runtime-source-bundle-kit
prehistoric-rush-manifest-loader-kit
prehistoric-rush-manifest-load-status-kit
prehistoric-rush-manifest-drift-report-kit
prehistoric-rush-runtime-tuning-adapter-kit
prehistoric-rush-spawn-budget-source-kit
prehistoric-rush-win-threshold-source-kit
prehistoric-rush-scene-id-catalog-kit
prehistoric-rush-scene-result-alias-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-batch-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-action-result-contract-kit
prehistoric-rush-action-result-journal-kit
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-source-diff-kit
prehistoric-rush-runner-step-result-kit
prehistoric-rush-runner-event-contract-kit
prehistoric-rush-runner-event-journal-kit
prehistoric-rush-contact-event-contract-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-gamehost-diagnostics-kit
prehistoric-rush-scripted-action-fixture-kit
prehistoric-rush-replay-parity-smoke-kit
prehistoric-rush-run-movement-promotion-report-kit
```

### Deferred extraction kits

```txt
prehistoric-rush-terrain-source-kit
prehistoric-rush-scatter-placement-kit
prehistoric-rush-raptor-rig-kit
prehistoric-rush-camera-follow-kit
prehistoric-rush-hud-renderer-kit
prehistoric-rush-three-renderer-adapter-kit
prehistoric-rush-rapier-adapter-kit
prehistoric-rush-flock-render-kit
```

## What is next

### Next implementation slice

```txt
PrehistoricRush Manifest Action Contact Fixture Matrix + Run Movement Promotion Gate
```

Intent:

```txt
Make the current runner source-auditable, replayable, and ready for run-movement-kit promotion without changing visible movement feel, visual density, terrain behavior, Rapier behavior, or route feel first.
```

Build order:

```txt
preserve index.html, src/runtime.mjs, current Three.js/Rapier visuals, current controls, and current PrehistoricRushHost.getState()
add RuntimeSourceBundle loading before setup()
load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json
emit ManifestLoadStatus with loaded, failed, fallback, and source path details
emit ManifestDriftReport with live-vs-manifest deltas
emit SceneAliasCatalog with explicit fail -> run-over compatibility
adapt runner-tuning.json into RuntimeRunnerTuning while keeping current inline values fallback-only
add SpawnBudgetSource and WinThresholdSource descriptors populated from current inline behavior first
normalize button, keyboard, and future touch input into ActionFrame records
add ActionAcceptanceMatrix for start, retry, run-again, menu, left, right, boost, jump, and future touch actions
emit ActionResult records with stable accepted/rejected reasons
snapshot RunnerSourceState before and after movement
wrap current movement math in RunnerStepResult without changing feel
emit RunnerEvent facts for jump-consumed, boost-active, speed-delta, distance-delta, heading-delta, grounded-change, terrain-rebuild-requested, pickup, impact, goal, and scene-request
emit ContactEvent records for hazard-hit, shard-pickup, and distance-goal
reduce ContactResult snapshots from ContactEvent records
route run-over and win transitions through SceneDispatchResult records
expand PrehistoricRushHost with getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(actionFrame), runSmoke(name), and runReplayParitySmoke()
add DOM-free fixtures for manifest load, manifest missing fallback, tuning drift, fail alias, start, retry, run-again, jump accepted, jump rejected while airborne, hazard run-over, shard pickup, distance win, and replay parity
add a RunMovementPromotionReport that names what must move into run-movement-kit after fixture parity passes
defer terrain/render/raptor/camera/Rapier/flock extraction until source-lock fixtures pass
```

## Acceptance checklist for next implementation

```txt
[ ] Existing runner still boots from index.html.
[ ] Existing visual scene and controls remain unchanged.
[ ] RuntimeSourceBundle can load all product manifests or report fallback.
[ ] ManifestLoadStatus is available from PrehistoricRushHost.getDiagnostics().
[ ] ManifestDriftReport lists all live-vs-manifest drift without breaking runtime.
[ ] fail -> run-over alias is explicit and testable.
[ ] ActionFrame records are generated for button and keyboard input.
[ ] ActionResultJournal records accepted and rejected actions.
[ ] RunnerSourceState snapshots are serializable.
[ ] RunnerStepResult wraps current movement and jump consumption.
[ ] RunnerEventJournal records movement, boost, jump, terrain rebuild, pickup, impact, goal, and scene request facts.
[ ] ContactEvent records exist for hazard, pickup, and goal.
[ ] SceneDispatchResult owns run-over and win scene changes.
[ ] PrehistoricRushHost exposes diagnostics, snapshots, replay journal, dispatch, and smokes.
[ ] DOM-free replay fixture can reproduce a scripted accepted/rejected action sequence.
[ ] RunMovementPromotionReport names the exact shared-kit API candidate and remaining blockers.
```

## Validation status

```txt
runtime source changed: no
local build run: no
local smoke run: no
reason: documentation-only pass; no runtime source files changed
```
