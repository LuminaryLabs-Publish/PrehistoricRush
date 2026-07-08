# PrehistoricRush Project Breakdown — 2026-07-07T21:59:06-04:00

## Summary

`LuminaryLabs-Publish/PrehistoricRush` remains the correct repo for this pass because it is the oldest eligible tracked non-Cavalry repo in the central `LuminaryLabs-Dev/LuminaryLabs` ledger rotation.

The repo is already a playable static Three.js/Rapier prehistoric runner, but the highest-value next step is still to stop treating `src/runtime-terrain-v6.mjs` as the source of truth. The next implementation slice should add a manifest/action/contact harness around the current runtime without changing the visible runner first.

## Selection reason

Standing rule: do not work on `LuminaryLabs-Publish/TheCavalryOfRome`.

Latest eligible central ledger timestamps checked:

```txt
PrehistoricRush  2026-07-07T20:38:27-04:00  selected
MyCozyIsland     2026-07-07T20:50:10-04:00
IntoTheMeadow    2026-07-07T20:59:30-04:00
ZombieOrchard    2026-07-07T21:09:57-04:00
HorrorCorridor   2026-07-07T21:18:45-04:00
TheOpenAbove     2026-07-07T21:29:47-04:00
AetherVale       2026-07-07T21:39:36-04:00
PhantomCommand   2026-07-07T21:50:56-04:00
```

## Current repo read

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered infinite runner.

Current route:

```txt
index.html
  -> src/runtime.mjs
  -> src/runtime-terrain-v6.mjs
```

`index.html` is a thin static shell with `#app` and a module import for `src/runtime.mjs`.

`src/runtime.mjs` only imports `src/runtime-terrain-v6.mjs`.

`src/runtime-terrain-v6.mjs` currently owns the active game runtime:

```txt
Three.js CDN import
Rapier CDN import
rapier-physics-domain-kit CDN import
inline tuning constants
DOM shell
HUD panel
Start / Retry / Run Again button
keyboard input booleans
Three.js scene/camera/renderer/lights/fog/sky
procedural terrain chunks
height sampling
procedural raptor visual rig
raptor pose animation
rock/shard/tree instancing
collider and pickup descriptor generation
Rapier bridge setup
kinematic dino actor transform publishing
runner state mutation
jump consumption
boost/speed/turn/distance updates
hazard contact checks
shard pickup checks
win threshold check
scene mutation to run-over or win
camera follow
HUD telemetry projection
renderer frame submission
globalThis.PrehistoricRushHost.getState()
```

The visible runner should be preserved. The authority model should change first.

## Current interaction loop

```txt
browser opens index.html
  -> #app renders Loading PrehistoricRush
  -> module imports src/runtime.mjs
  -> runtime.mjs imports src/runtime-terrain-v6.mjs
  -> runtime imports Three.js / Rapier / rapier-physics-domain-kit
  -> shell() clears #app and creates fixed host, panel, status, and button
  -> setup() creates scene, camera, renderer, sky, lights, terrain, player, rocks, shards, trees
  -> state() creates mutable runner state
  -> createPhysics() configures Rapier and registers dino actor
  -> terrain.update(0, 0)
  -> populate(app) creates scatter, colliders, and pickups
  -> button and keyboard listeners mutate app.scene and app.input
  -> requestAnimationFrame(loop)
  -> if app.scene === game:
       - consume raw input booleans
       - mutate yaw, speed, jumpY, vy, x, z, distance, best
       - sample terrain height
       - rebuild terrain/scatter when chunk changes or every eighth frame
       - publish dino transform into Rapier bridge
       - step physics
       - check hazard contacts and mutate scene to run-over
       - check shard pickups and mutate collected/shards
       - check distance > 3600 and mutate scene to win
  -> update raptor pose, camera, HUD, button text, and renderer
  -> expose PrehistoricRushHost.getState()
```

## Target authority loop

```txt
load product manifests before runtime setup
  -> ManifestLoadStatus records loaded / missing / fallback paths
  -> ManifestDriftReport compares live constants to runner-tuning.json and scene manifests
  -> SceneAliasCatalog normalizes scenes/game.json nextOnLoss fail -> run-over
  -> RuntimeRunnerTuning resolves manifest values with current inline values as fallback-only
  -> SpawnBudgetSource and WinThresholdSource describe current inline budgets explicitly
  -> InputAdapter creates ActionFrame records from button, keyboard, and future touch input
  -> ActionAcceptanceMatrix accepts or rejects actions per scene
  -> ActionResultJournal records stable accepted/rejected action results
  -> RunnerSourceState snapshot captures pre-step state
  -> RunnerStepResult wraps current movement math without changing it first
  -> RunnerEventJournal records movement, boost, jump, rebuild, pickup, impact, goal, and scene-request facts
  -> ContactEvent records hazard-hit, shard-pickup, and distance-goal checks
  -> ContactResult reduces contact facts into stable outcome snapshots
  -> SceneDispatchResult performs menu/game/run-over/win transitions
  -> PrehistoricRushHost exposes diagnostics, snapshots, replay journal, dispatch, and smoke runners
  -> DOM-free fixtures replay accepted/rejected actions and compare result journals
```

## Domains in use

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
manifest-authority
manifest-load-status
manifest-drift-diagnostics
scene-graph-authority
scene-file-authority
scene-id-catalog
scene-result-aliasing
runtime-tuning-adapter
spawn-budget-authority
win-threshold-authority
kit-composition-authority
cutover-inventory-authority
flock-generation-authority
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
host-diagnostics-contract
replay-snapshot-contract
dom-free-fixture-runtime
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

## Current services

Current product-side services identified in `src/runtime-terrain-v6.mjs`:

```txt
load(url)
shell()
createGrid(THREE, size, seg)
createTerrain(THREE, scene)
terrain.update(x, z)
terrain.sample(x, z)
mat(THREE, color, opts)
mesh(THREE, geometry, material, position, scale, rotation)
outline(THREE, source, scale)
capsuleBetween(THREE, a, b, r, material)
makeRaptor(THREE)
animateRaptor(raptor, speed, time, turning, jump)
treePools(THREE)
sky(THREE)
setup(THREE, host)
state()
populate(app)
createPhysics()
main()
loop(now)
PrehistoricRushHost.getState()
```

Current external / kit-backed services:

```txt
rapier-physics-domain-kit.initWorld()
rapier-physics-domain-kit.install()
engine.n.rapierPhysics.configure()
engine.n.rapierPhysics.registerKinematicActor()
engine.n.rapierPhysics.setActorTransform()
engine.n.rapierPhysics.setFixedColliders()
engine.n.rapierPhysics.step()
engine.n.rapierPhysics.getSnapshot()
```

Needed next services:

```txt
loadProductManifests()
loadSceneManifest(sceneId)
validateSceneFiles()
validateKitComposition()
validateCutoverInventory()
validateFlockGeneration()
adaptRunnerTuning()
adaptSpawnBudgets()
adaptWinThreshold()
compareLiveTuningToManifest()
compareSceneAliases()
compareSpawnBudgets()
emitManifestLoadStatus()
emitManifestDriftReport()
normalizeResultScene()
createActionFrame()
createActionBatch()
acceptActionForScene()
rejectActionWithReason()
appendActionResult()
snapshotRunnerSourceState()
diffRunnerSourceState()
hydrateRunnerSourceState()
reduceRunnerStep()
emitRunnerStepResult()
emitRunnerEvent()
emitHazardHit()
emitShardPickup()
emitDistanceGoal()
reduceContactEvent()
emitContactResult()
dispatchSceneRequest()
appendSceneDispatchResult()
getDiagnostics()
getSnapshot()
getReplayJournal()
dispatch(actionFrame)
runSmoke(name)
runReplayParitySmoke()
```

## Kits identified

Core kits targeted by repo manifests / README:

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

Live ProtoKit dependency:

```txt
rapier-physics-domain-kit
```

Existing ProtoKit families to prefer before creating new product-only services:

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

Missing shared ProtoKit:

```txt
run-movement-kit
```

Repo-local next-cut kits:

```txt
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
```

Deferred extraction kits:

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
runtime motion.speed = 15 vs runner-tuning.json motion.baseForwardSpeed = 13.5
runtime motion.maxSpeed = 25 vs runner-tuning.json motion.maxForwardSpeed = 24
runtime motion.boostSpeed = 31 vs runner-tuning.json motion.boostForwardSpeed = 29
runtime motion.turnRate = 2.55 vs runner-tuning.json motion.turnRate = 2.45
runtime terrain.chunkSize = 46 vs runner-tuning.json terrain.chunkSize = 44
runtime terrain.segments = 24 vs runner-tuning.json terrain.chunkSegments = 20
runtime terrain.seed = 238991 vs runner-tuning.json terrain.seed = prehistoric-rush-infinite-terrain-v1
game-scenes.json canonical loss scene = run-over
scenes/game.json nextOnLoss = fail
runtime win threshold = inline distance > 3600
runtime spawn budget = inline trees/rocks/shards/clear radius
runtime jump input = raw boolean consumed at end of render loop
runtime contacts = direct checks that mutate app.scene or shards without ContactEvent history
runtime host = getState only; no diagnostics, dispatch, replay journal, or smoke runner
```

## What is next

```txt
PrehistoricRush ActionFrame Manifest Harness + Contact Dispatch Replay Lock
```

Build order:

```txt
preserve index.html, src/runtime.mjs, current Three.js/Rapier visuals, current controls, and current PrehistoricRushHost.getState()
add a small manifest loader before setup()
load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json
emit ManifestLoadStatus with loaded, failed, fallback, and source path details
emit ManifestDriftReport with live-vs-manifest deltas
add explicit fail -> run-over SceneAliasCatalog entry
adapt runner-tuning.json into RuntimeRunnerTuning while keeping current inline values as fallback-only
add SpawnBudgetSource and WinThresholdSource descriptors populated from current inline behavior first
normalize button and keyboard input into ActionFrame records
add ActionAcceptanceMatrix for start, retry, run-again, menu, left, right, boost, jump, and future touch actions
emit ActionResult records with stable accepted/rejected reasons
snapshot RunnerSourceState before and after movement
wrap current movement math in RunnerStepResult without changing feel
emit RunnerEvent facts for jump-consumed, boost-active, speed-delta, distance-delta, heading-delta, grounded-change, terrain-rebuild-requested, pickup, impact, goal, and scene-request
emit ContactEvent records for hazard-hit, shard-pickup, and distance-goal
reduce ContactResult snapshots from ContactEvent records
route run-over and win transitions through SceneDispatchResult records
expand PrehistoricRushHost with getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(actionFrame), runSmoke(name), and runReplayParitySmoke()
add DOM-free fixtures for manifest load, tuning drift, fail alias, start, retry, run-again, jump accepted, jump rejected, hazard run-over, shard pickup, distance win, and replay parity
defer terrain/render/raptor/camera/Rapier extraction until source-lock fixtures pass
```

## Acceptance checklist for next implementation

```txt
[ ] Existing runner still boots from index.html.
[ ] Existing visual scene and controls remain unchanged.
[ ] ManifestLoadStatus is available from PrehistoricRushHost.getDiagnostics().
[ ] ManifestDriftReport lists all live-vs-manifest drift without breaking runtime.
[ ] fail -> run-over alias is explicit and testable.
[ ] ActionFrame records are generated for button and keyboard input.
[ ] ActionResultJournal records accepted and rejected actions.
[ ] RunnerSourceState snapshots are serializable.
[ ] RunnerStepResult wraps current movement and jump consumption.
[ ] ContactEvent records exist for hazard, pickup, and goal.
[ ] SceneDispatchResult owns run-over and win scene changes.
[ ] PrehistoricRushHost exposes diagnostics, snapshots, replay journal, dispatch, and smokes.
[ ] DOM-free replay fixture can reproduce a scripted accepted/rejected action sequence.
```

## Validation note

No runtime source code changed in this documentation pass. No local build or smoke test was run.
