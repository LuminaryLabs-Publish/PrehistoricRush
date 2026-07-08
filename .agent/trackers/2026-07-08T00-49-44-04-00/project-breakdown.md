# PrehistoricRush Project Breakdown

**Run timestamp:** `2026-07-08T00:49:44-04:00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Default branch:** `main`

**Selected repo:** `PrehistoricRush`

**Excluded repo:** `LuminaryLabs-Publish/TheCavalryOfRome`

## Selection reason

`PrehistoricRush` was selected because the central ledger still showed it as the oldest eligible tracked non-Cavalry Publish repo by latest review timestamp.

Latest central ledger timestamps checked:

```txt
PrehistoricRush   2026-07-07T23:21:18-04:00  selected
ZombieOrchard     2026-07-07T23:48:44-04:00
HorrorCorridor    2026-07-08T00:00:20-04:00
TheUnmappedHouse  2026-07-08T00:08:03-04:00
TheOpenAbove      2026-07-08T00:21:15-04:00
AetherVale        2026-07-08T00:28:42-04:00
PhantomCommand    2026-07-08T00:41:39-04:00
```

## Current read

`PrehistoricRush` is a standalone static browser publish repo for a NexusEngine-powered prehistoric infinite runner.

The active route is now more specific than the prior ledger entry:

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/domain-runtime/event-bus.js
  -> src/domain-runtime/domain-host.js
  -> src/domain-runtime/tick-scheduler.js
  -> src/domains/dino/index.js
  -> src/domains/dino/dino-form-domain-kit.js
  -> src/domains/dino/dino-pose-domain-kit.js
  -> src/domains/dino/dino-material-domain-kit.js
  -> await import("./runtime-terrain-v6.mjs")
```

`src/game.js` now installs a lightweight domain runtime and dino domain scaffold before importing the legacy visual runtime. This is a meaningful architectural step because the repo now has explicit domain kits for dino form, pose, and material, but the live runtime still creates and animates the raptor manually inside `src/runtime-terrain-v6.mjs`.

The live game remains inside `src/runtime-terrain-v6.mjs`. It imports Three.js, Rapier, and the CDN Rapier ProtoKit, creates the DOM shell, creates terrain, scatters trees, rocks, and shards, creates the procedural raptor, reads raw input booleans, mutates runner state in the animation loop, checks hazards and pickups inline, mutates scenes directly, updates HUD/camera/renderer, and exposes only `globalThis.PrehistoricRushHost.getState()`.

## Key correction from this run

Prior docs framed the active route as:

```txt
index.html -> src/runtime.mjs -> src/runtime-terrain-v6.mjs
```

The correct route now includes `src/game.js` and the dino/domain-runtime scaffold:

```txt
index.html -> src/runtime.mjs -> src/game.js -> dino domain scaffold -> src/runtime-terrain-v6.mjs
```

This changes the next best implementation slice. The repo should not only load manifests and create action/contact result fixtures. It should also bridge the domain scaffold into the live runner loop so the dino pose domain receives runner movement facts and the visual raptor can later consume dino form/material descriptors instead of duplicating them.

## Interaction loop

### Current player-facing loop

```txt
open index.html
  -> #app displays Loading PrehistoricRush
  -> module runtime imports src/game.js
  -> game.js installs event bus, domain host, scheduler, and dino domain kits
  -> runtime-terrain-v6 creates the visible Three.js scene
  -> player sees menu scene with Start Rush button
  -> Enter, Space, or button starts game
  -> A / ArrowLeft steer left
  -> D / ArrowRight steer right
  -> W / ArrowUp boost
  -> Space jumps when in game
  -> runtime moves the raptor forward continuously
  -> terrain chunks rebuild around player position
  -> shards increment score when collected
  -> hazard hit changes scene to run-over
  -> distance greater than 3600 changes scene to win
  -> button becomes Jump, Retry, Run Again, or Start Rush from current scene
```

### Current runtime loop

```txt
index.html loads src/runtime.mjs
  -> src/runtime.mjs imports src/game.js
  -> createEventBus stores listener buckets and recent event history
  -> createDomainHost installs idempotent domain instances by id
  -> createTickScheduler exists but is not started by the live runner
  -> createDinoFormDomainKit emits dino.form.ready
  -> createDinoPoseDomainKit subscribes to runner.moved and emits dino.pose.changed
  -> createDinoMaterialDomainKit emits dino.material.ready
  -> composition.ready is emitted
  -> runtime-terrain-v6 loads Three.js and optional Rapier bridge
  -> setup builds renderer, scene, camera, terrain, raptor, rocks, shards, and trees
  -> main binds button and keyboard input
  -> requestAnimationFrame(loop) mutates state directly
  -> loop updates motion, jump, gravity, distance, terrain, physics actor, contacts, pickups, win/loss scene, camera, HUD, and render
  -> PrehistoricRushHost.getState returns scene, runner, physics, terrain chunk count, and renderer id
```

### Target authority loop

```txt
load RuntimeSourceBundle before setup
  -> load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json
  -> emit ManifestLoadStatus
  -> emit ManifestDriftReport
  -> normalize fail -> run-over through SceneAliasCatalog
  -> adapt RuntimeRunnerTuning with inline tuning as fallback only
  -> expose RuntimeSourceSnapshot, SpawnBudgetSource, and WinThresholdSource
  -> translate keyboard/button/touch input into ActionFrame records
  -> accept or reject each action through ActionAcceptanceMatrix
  -> append ActionResult records with stable reasons
  -> wrap current movement math in RunnerStepResult without visible behavior changes
  -> emit runner.moved through the existing event bus
  -> let dino-pose-domain-kit produce dino.pose.changed snapshots from runner movement facts
  -> record RunnerEvent entries for movement, jump, boost, terrain rebuild, pickup, hazard, goal, and scene request
  -> reduce ContactEvent records into ContactResult snapshots
  -> transition scenes only through SceneDispatchResult
  -> expand PrehistoricRushHost with diagnostics, source snapshot, replay journal, dispatch, and smoke runners
  -> run DOM-free fixture parity for manifest load, actions, jump accepted/rejected, pickup, hazard, win, and dino pose bridge
  -> emit RunMovementPromotionReport for the future shared run-movement-kit API
```

## Domains in use

```txt
static-browser-shell
module-runtime-entry
composition-bootstrap
event-bus-history
domain-host-installation
domain-idempotency
tick-scheduler-scaffold
dino-entity-domain
dino-form-domain
dino-pose-domain
dino-material-domain
dino-domain-bundle
legacy-visual-runtime-bridge
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
runtime-source-bundle
runtime-source-snapshot
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
raptor-domain-descriptor-consumption
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
dino-domain-bridge-smoke
host-diagnostics-smoke
replay-parity-smoke
run-movement-promotion-smoke
```

## Services the kits offer

### Domain runtime services

```txt
createEventBus
on
emit
snapshot event history
createDomainHost
install domain by id
skip duplicate domain install
get installed domain
host.tick
host.snapshot
createTickScheduler
scheduler.start
scheduler.stop
scheduler.snapshot
```

### Dino form domain services

```txt
createDinoFormDomainKit
emit dino.form.ready
getDescriptor
snapshot
provide entityId
provide proportions
provide silhouette flags
provide featureSets
```

### Dino pose domain services

```txt
createDinoPoseDomainKit
listen for runner.moved
update pose from speed, turn, jump, and time
emit dino.pose.changed
getDescriptor
snapshot
provide phase, speed, turn, jump, hips, chest, head, tail, legs, and arms pose data
```

### Dino material domain services

```txt
createDinoMaterialDomainKit
emit dino.material.ready
getDescriptor
snapshot
provide palette
provide flat-shaded outline style
provide brow, belly, eye glow, and outline style facts
```

### Current product-side runtime services

```txt
load remote modules
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

### Current external / ProtoKit services

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
emitRunnerMovedForDinoPose
readDinoFormDescriptor
readDinoPoseDescriptor
readDinoMaterialDescriptor
bridgeDinoPoseToRaptorAnimation
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

## Kit inventory

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

### Existing repo-local kits

```txt
domain-runtime/event-bus
domain-runtime/domain-host
domain-runtime/tick-scheduler
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle
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

### Repo-local extraction and next-cut kits

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
prehistoric-rush-dino-domain-bridge-kit
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
prehistoric-rush-terrain-streaming-kit
prehistoric-rush-scatter-placement-kit
prehistoric-rush-hazard-contact-kit
prehistoric-rush-pickup-contact-kit
prehistoric-rush-raptor-render-kit
prehistoric-rush-camera-follow-kit
prehistoric-rush-hud-projection-kit
prehistoric-rush-flock-visual-kit
```

## Source-backed facts

```txt
index.html loads ./src/runtime.mjs.
src/runtime.mjs imports ./game.js.
src/game.js creates eventBus, domainHost, scheduler, dino form kit, dino pose kit, and dino material kit.
src/game.js exposes globalThis.PrehistoricRushComposition.snapshot().
src/game.js imports ./runtime-terrain-v6.mjs after the scaffold is ready.
src/runtime-terrain-v6.mjs imports Three.js, Rapier, and rapier-physics-domain-kit from CDNs.
src/runtime-terrain-v6.mjs still owns inline tuning constants.
src/runtime-terrain-v6.mjs still manually creates and animates the raptor.
src/runtime-terrain-v6.mjs still reads raw input booleans and consumes jump at the end of the render loop.
src/runtime-terrain-v6.mjs still mutates app.scene directly for run-over and win outcomes.
src/runtime-terrain-v6.mjs exposes only PrehistoricRushHost.getState().
dino-pose-domain-kit listens for runner.moved, but runtime-terrain-v6 does not currently emit runner.moved.
```

## Main blockers

```txt
the dino domain scaffold is installed but not connected to the live runner loop
scheduler scaffold exists but does not own the live visual runtime frame loop
runtime tuning constants are inline rather than manifest-owned
scene result aliasing is implicit rather than source-owned
input is raw live booleans rather than ActionFrame records
accepted and rejected inputs are not journaled
jump consumption is not a RunnerStepResult fact
hazard, shard, and distance-goal outcomes are not ContactEvent records
scene changes are direct mutation rather than SceneDispatchResult records
PrehistoricRushHost exposes getState only
no DOM-free fixture matrix exists yet
run-movement-kit promotion boundary is not backed by replay data yet
```

## Next implementation slice

```txt
PrehistoricRush Dino Domain Bridge + Runtime Authority Fixture Gate
```

Build order:

```txt
preserve index.html
preserve src/runtime.mjs
preserve current visible Three.js/Rapier behavior
preserve current PrehistoricRushHost.getState()
make active route documentation canonical: runtime.mjs -> game.js -> dino scaffold -> runtime-terrain-v6
load manifests before runtime setup
emit ManifestLoadStatus and ManifestDriftReport
normalize fail -> run-over through explicit SceneAliasCatalog
adapt runner-tuning.json into RuntimeRunnerTuning with inline values as fallback only
add RuntimeSourceSnapshot, SpawnBudgetSource, and WinThresholdSource
add ActionFrame records for start, retry, run-again, menu, left, right, boost, jump, and future touch
add ActionAcceptanceMatrix with stable accepted/rejected reasons
add RunnerSourceState snapshots and RunnerStepResult records
emit runner.moved from the live movement step
connect runner.moved to dino-pose-domain-kit as the first real domain bridge
surface dino form, pose, and material snapshots in PrehistoricRushComposition and PrehistoricRushHost diagnostics
add RunnerEvent journal entries for movement, jump, boost, terrain rebuild, pickup, impact, goal, and scene requests
add ContactEvent records for hazard-hit, shard-pickup, and distance-goal
add SceneDispatchResult records for run-over and win
expand PrehistoricRushHost with getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(actionFrame), runSmoke(name), and runReplayParitySmoke()
add DOM-free smoke fixtures for manifest load, tuning drift, fail alias, start, retry, jump accepted/rejected, hazard run-over, shard pickup, distance win, dino pose bridge, and replay parity
emit RunMovementPromotionReport after fixture parity defines the shared run-movement-kit surface
```

## Acceptance target

```txt
The live game looks and controls the same.
The active route is documented correctly.
Manifests are loaded and drift is reported without breaking fallback behavior.
Every player input can be represented as an ActionFrame.
Accepted and rejected actions are journaled with stable reasons.
The movement step emits RunnerStepResult and RunnerEvent records.
The existing dino-pose-domain-kit receives runner.moved and emits dino.pose.changed.
Contact outcomes are represented as ContactEvent and ContactResult records.
Scene transitions are represented as SceneDispatchResult records.
PrehistoricRushHost exposes diagnostics, source snapshots, replay journals, dispatch, and smoke runners.
DOM-free fixtures cover manifest loading, action acceptance, contact outcomes, dino pose bridge, and replay parity.
RunMovementPromotionReport defines the shared run-movement-kit API candidate.
```

## Validation status

No runtime source files were changed in this documentation pass.

No local smoke test was run because this pass only updated internal docs and central tracking.
