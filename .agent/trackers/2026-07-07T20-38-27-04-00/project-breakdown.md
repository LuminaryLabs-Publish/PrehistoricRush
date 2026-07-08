# PrehistoricRush Project Breakdown

**Run timestamp:** `2026-07-07T20-38-27-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Default branch:** `main`

**Scope:** Documentation-only repo breakdown and next-slice ideation.

## Selection reason

The central repo ledger showed `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible tracked non-Cavalry Publish repo by latest review timestamp at the start of this run.

`LuminaryLabs-Publish/TheCavalryOfRome` remained excluded by standing rule.

Latest eligible timestamps checked:

```txt
PrehistoricRush  2026-07-07T19:18:58-04:00
MyCozyIsland     2026-07-07T19:29:28-04:00
IntoTheMeadow    2026-07-07T19:42:05-04:00
ZombieOrchard    2026-07-07T19:51:43-04:00
HorrorCorridor   2026-07-07T20:00:46-04:00
TheOpenAbove     2026-07-07T20:10:49-04:00
AetherVale       2026-07-07T20:21:40-04:00
PhantomCommand   2026-07-07T20:31:21-04:00
```

Accessible Publish repos seen in the current organization pass:

```txt
AetherVale
HorrorCorridor
IntoTheMeadow
MyCozyIsland
PhantomCommand
PrehistoricRush
TheCavalryOfRome   excluded
TheOpenAbove
ZombieOrchard
```

## Current repo read

`PrehistoricRush` is a standalone static browser repo for a NexusEngine-powered prehistoric infinite runner.

The current route is:

```txt
index.html
  -> src/runtime.mjs
  -> src/runtime-terrain-v6.mjs
```

`src/runtime.mjs` is a thin import shim. The active game lives in `src/runtime-terrain-v6.mjs`, which currently owns Three.js loading, Rapier loading, the Rapier physics ProtoKit adapter, DOM shell creation, terrain generation, raptor rig construction, scatter placement, collider/pickup descriptor generation, runner state, raw input booleans, motion integration, contact checks, scene mutation, camera/HUD projection, rendering, and `globalThis.PrehistoricRushHost`.

The current manifest layer already exists and should become authority before more visible content is added:

```txt
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
```

The main blocker is still source authority. Runtime constants, scene aliases, spawn budgets, contact outcomes, win threshold, action acceptance, and replay state are still implicit inside the live runtime instead of being exposed as source-owned contracts and replayable journals.

## Current interaction loop

```txt
index.html
  -> #app mount
  -> import src/runtime.mjs
  -> import src/runtime-terrain-v6.mjs
  -> import Three.js from jsDelivr
  -> import Rapier from jsDelivr
  -> import rapier-physics-domain-kit from ProtoKits CDN
  -> create DOM shell, HUD, and Start Rush button
  -> create Three.js renderer, scene, camera, lights, fog, and sky
  -> create procedural terrain chunks
  -> create procedural raptor rig
  -> create rocks, shards, and five tree instanced mesh pools
  -> create Rapier physics bridge and kinematic dino actor
  -> initialize app state with scene=menu
  -> bind button and keyboard listeners
  -> requestAnimationFrame(loop)
  -> if scene=game, mutate runner state from raw input booleans
  -> rebuild terrain/scatter when chunk changes or frame cadence requests it
  -> push actor transform into Rapier bridge
  -> detect Rapier contacts and fallback collider overlaps inline
  -> mutate app.scene directly to run-over on hazard hit
  -> mutate shard state directly on pickup
  -> mutate app.scene directly to win after distance threshold
  -> update raptor pose, camera, HUD, button label, and renderer
  -> expose globalThis.PrehistoricRushHost.getState()
```

## Target interaction loop

```txt
load static manifests
  -> validate scene graph, scene files, kit composition, tuning, cutover inventory, and flock generation
  -> emit ManifestLoadStatus
  -> emit ManifestDriftReport for live runtime constants vs manifest values
  -> normalize scenes/game.json nextOnLoss=fail through explicit fail -> run-over alias
  -> adapt runner-tuning.json into RuntimeRunnerTuning
  -> keep inline tuning fallback-only
  -> normalize button, keyboard, and future touch input into ActionFrame records
  -> apply scene-scoped ActionAcceptanceMatrix
  -> emit accepted/rejected ActionResult records with stable reasons
  -> snapshot RunnerSourceState before and after each runner reduction
  -> reduce motion through RunnerStepResult without changing visible math first
  -> emit RunnerEvent facts for jump, boost, heading, distance, terrain rebuild, and state deltas
  -> emit ContactEvent records for hazard-hit, shard-pickup, and distance-goal
  -> reduce ContactEvent records into ContactResult snapshots
  -> route scene transitions through SceneDispatchResult
  -> append ActionResult, RunnerStepResult, ContactEvent, ContactResult, and SceneDispatchResult journals
  -> expose diagnostics, snapshot, replay journal, dispatch, and smoke hooks on PrehistoricRushHost
  -> prove DOM-free replay parity before terrain/render/raptor/camera/Rapier extraction
```

## Domains in use

### Runtime and browser shell

```txt
static-browser-shell
module-runtime-entry
cdn-dependency-loading
import-fallback-diagnostics
dom-mount-ownership
hud-panel-ownership
button-adapter-ownership
keyboard-input-adapter
resize-adapter-ownership
future-touch-input-adapter
debug-host-exposure
```

### Manifest and source authority

```txt
manifest-authority
scene-graph-authority
scene-file-authority
scene-id-catalog
scene-result-aliasing
runtime-tuning-adapter
manifest-drift-diagnostics
kit-composition-authority
cutover-inventory-authority
flock-generation-authority
spawn-budget-authority
win-threshold-authority
host-diagnostics-contract
replay-snapshot-contract
dom-free-fixture-runtime
```

### Runner and input authority

```txt
actionframe-contract
action-batch-contract
action-acceptance-matrix
action-result-contract
action-result-journal
runner-source-state
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

### Render, terrain, and object projection

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

### Physics and contact authority

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

### Validation and smoke coverage

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
```

## Services identified

### Current product-side services

```txt
shell
  - create root DOM
  - style body
  - create host surface
  - create HUD panel
  - create status line
  - create Start Rush button

load
  - import CDN modules
  - warn on module fallback

createGrid
  - create terrain grid geometry
  - create vertex color buffers
  - create triangle index buffers

createTerrain
  - create terrain chunk mesh pool
  - sample terrain height
  - rebuild chunk vertices/colors/normals
  - report chunk count

mat / mesh / outline / capsuleBetween
  - create materials
  - create primitive meshes
  - add outline shells
  - create body capsules

makeRaptor
  - build procedural raptor rig
  - add hips, torso, neck, head, tail, legs, arms, plates, eyes, claws

animateRaptor
  - pose raptor from speed, turn, time, and jump state
  - drive stride, squash/stretch, limb phase, tail motion, and body banking

treePools / sky
  - create tree instance pools
  - create sky shell

setup
  - create scene, camera, renderer, fog, lights, terrain, player, dummy, rocks, shards, trees
  - bind resize handler

state
  - create runner state
  - read local best distance

populate
  - stream scatter around current chunk
  - create tree/rock/shard transforms
  - create collider descriptors
  - create pickup descriptors
  - publish fixed colliders to Rapier kit

createPhysics
  - load Rapier
  - load rapier-physics-domain-kit
  - configure gravity
  - register kinematic dino actor
  - return physics API

main
  - create UI
  - load dependencies
  - create app object
  - bind input
  - expose host
  - start animation loop

loop
  - read raw input booleans
  - integrate runner motion
  - consume jump input
  - rebuild terrain/scatter
  - step physics
  - check hazard contacts
  - check shard pickups
  - check distance win
  - mutate scene directly
  - update camera/HUD/raptor/renderer

PrehistoricRushHost.getState
  - project scene
  - project runner state
  - project physics snapshot
  - project terrain chunk count
  - project renderer id
```

### Needed next services

```txt
loadProductManifests
validateSceneFiles
validateKitComposition
validateCutoverInventory
validateFlockGeneration
adaptRunnerTuning
adaptSpawnBudgets
adaptWinThreshold
compareLiveTuningToManifest
compareSceneAliases
compareSpawnBudgets
emitManifestLoadStatus
emitManifestDriftReport
normalizeResultScene
createActionFrame
createActionBatch
acceptActionForScene
rejectActionWithReason
appendActionResult
snapshotRunnerSourceState
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
```

## Kits identified

### Current targeted core kits

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
  - initWorld
  - install
  - configure
  - registerKinematicActor
  - setActorTransform
  - setFixedColliders
  - step
  - getSnapshot
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

### Missing ProtoKit

```txt
run-movement-kit
```

The missing shared kit should eventually own runner movement, speed ramping, boost, jump buffering, coyote timing, accepted action consumption, step results, motion descriptors, animation phase descriptors, and reusable runner replay fixtures.

### Repo-local next-cut kits

```txt
prehistoric-rush-manifest-loader-kit
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
```

## Source drift to resolve

```txt
runtime motion.speed = 15 vs runner-tuning baseForwardSpeed = 13.5
runtime motion.maxSpeed = 25 vs runner-tuning maxForwardSpeed = 24
runtime motion.boostSpeed = 31 vs runner-tuning boostForwardSpeed = 29
runtime motion.turnRate = 2.55 vs runner-tuning turnRate = 2.45
runtime terrain.chunkSize = 46 vs runner-tuning chunkSize = 44
runtime terrain.segments = 24 vs runner-tuning chunkSegments = 20
runtime terrain.seed = 238991 vs runner-tuning seed = prehistoric-rush-infinite-terrain-v1
game-scenes.json canonical loss scene = run-over
scenes/game.json nextOnLoss = fail
runtime win threshold = inline distance > 3600
runtime spawn budget = inline trees/rocks/shards/clear radius
runtime jump input = raw boolean consumed at end of render loop
runtime contacts = direct checks that mutate app.scene or shards without ContactEvent history
```

## Next implementation slice

```txt
PrehistoricRush Manifest Drift Gate + Replay Journal Source Lock
```

Build order:

```txt
preserve index.html and src/runtime.mjs
preserve current Three.js/Rapier runner visuals and controls
add a repo-local manifest load helper before setup()
load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json
emit ManifestLoadStatus with loaded, failed, fallback, and source path details
emit ManifestDriftReport for runtime constants vs manifest values
add explicit fail -> run-over compatibility alias diagnostics
adapt runner-tuning.json into RuntimeRunnerTuning and keep inline values as fallback-only
add SpawnBudgetSource and WinThresholdSource descriptors, even if initially populated from current inline values
normalize button/keyboard input into ActionFrame records
add scene-scoped ActionAcceptanceMatrix for start, retry, run-again, left, right, boost, jump, menu, and future touch actions
emit ActionResult records with stable reasons
add RunnerSourceState snapshots before/after movement ticks
wrap current movement math in RunnerStepResult without changing visible math first
emit RunnerEvent records for jump-consumed, boost-active, terrain-rebuild-requested, distance-delta, heading-delta, speed-delta, and grounded-change
wrap hazard, pickup, and distance checks into ContactEvent records
reduce ContactEvent records into ContactResult snapshots
route run-over and win transitions through SceneDispatchResult
expand PrehistoricRushHost with getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(actionFrame), and runSmoke(name)
add DOM-free smoke fixtures for manifest load, drift report, fail alias, start, retry, run-again, jump accepted, jump rejected, hazard run-over, shard pickup, distance win, and replay parity
defer terrain/render/raptor/camera/Rapier extraction until source-lock smokes pass
```

## Acceptance checks for next code pass

```txt
The visible runner still loads and plays.
Start, retry, run-again, steering, boost, and jump still work.
Space starts from non-game scenes and jumps only inside game.
PrehistoricRushHost.getDiagnostics().manifest.loaded is true.
PrehistoricRushHost.getDiagnostics().manifest.drift reports the known runtime-vs-manifest deltas.
PrehistoricRushHost.getDiagnostics().sceneAliases.fail equals run-over.
PrehistoricRushHost.getReplayJournal() includes accepted and rejected ActionResult records.
Jump input accepts only when scene=game and grounded=true.
Hazard contact emits ContactEvent(type=hazard-hit) and SceneDispatchResult(to=run-over).
Shard pickup emits ContactEvent(type=shard-pickup) and a durable shard delta.
Distance goal emits ContactEvent(type=distance-goal) and SceneDispatchResult(to=win).
DOM-free runSmoke("replay-parity") replays a scripted journal to the same public snapshot.
```

## Implementation notes

Do not add new visible content first.

Do not extract renderer, terrain, raptor, camera, or Rapier services first.

Lock manifest authority, scene alias authority, runtime drift diagnostics, action intake, result journals, contact records, host diagnostics, and replay parity before moving reusable behavior into shared kits.
