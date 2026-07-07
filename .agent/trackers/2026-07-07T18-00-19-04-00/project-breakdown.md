# PrehistoricRush Project Breakdown — 2026-07-07T18-00-19-04-00

## Run summary

Selected `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible non-Cavalry Publish repo in the central ledger rotation.

This pass keeps the previous Manifest Drift direction but narrows the next source slice into **Action Dispatch Smoke Gate + Contact Replay Fixture Lock**: make manifest loading and alias normalization visible through diagnostics, then route every start/jump/boost/contact/result path through deterministic action/result records before touching terrain, renderer, raptor, or Rapier extraction.

No runtime source code changed in this documentation run.

## Selection ledger

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

Latest eligible timestamps checked from the central Publish ledger rotation:

```txt
PrehistoricRush  2026-07-07T16:40:29-04:00
MyCozyIsland     2026-07-07T16:49:08-04:00
IntoTheMeadow    2026-07-07T16:58:09-04:00
ZombieOrchard    2026-07-07T17:10:21-04:00
HorrorCorridor   2026-07-07T17:20:57-04:00
TheOpenAbove     2026-07-07T17:29:51-04:00
AetherVale       2026-07-07T17:38:46-04:00
PhantomCommand   2026-07-07T17:49:34-04:00
```

## Source facts checked

```txt
index.html
  -> mounts #app
  -> imports ./src/runtime.mjs

src/runtime.mjs
  -> imports ./runtime-terrain-v6.mjs

src/runtime-terrain-v6.mjs
  -> imports Three.js from jsDelivr
  -> imports Rapier from jsDelivr
  -> imports rapier-physics-domain-kit from ProtoKits CDN
  -> owns inline tuning, shell, HUD, terrain, raptor, scatter, pickups, contacts, scene results, camera, render, and PrehistoricRushHost
```

Observed authority drift still to lock:

```txt
runtime motion.speed       = 15
runner-tuning base speed   = 13.5

runtime motion.maxSpeed    = 25
runner-tuning max speed    = 24

runtime motion.boostSpeed  = 31
runner-tuning boost speed  = 29

runtime motion.turnRate    = 2.55
runner-tuning turnRate     = 2.45

runtime terrain.chunkSize  = 46
runner-tuning chunkSize    = 44

runtime terrain.segments   = 24
runner-tuning segments     = 20

runtime terrain.seed       = 238991
runner-tuning seed         = prehistoric-rush-infinite-terrain-v1

game-scenes loss scene     = run-over
scenes/game nextOnLoss     = fail
```

## Current interaction loop

```txt
index.html
  -> #app mount
  -> src/runtime.mjs
  -> src/runtime-terrain-v6.mjs
  -> dynamic import Three.js, Rapier, and rapier-physics-domain-kit
  -> create shell, panel, status node, and Start Rush button
  -> create scene, camera, renderer, lights, fog, terrain, raptor, rocks, shards, trees
  -> create Rapier bridge and register dino actor
  -> initialize state with scene=menu and raw boolean inputs
  -> bind button, keydown, keyup, and resize listeners
  -> requestAnimationFrame(loop)
  -> if scene=game, mutate yaw/speed/jump/gravity/position/distance inline
  -> update terrain and scatter from current chunk
  -> write actor transform into Rapier bridge
  -> check Rapier/inline hazards and set app.scene=run-over on hit
  -> check pickups and mutate collected/shards inline
  -> check distance > 3600 and set app.scene=win
  -> render camera/HUD/button label
  -> expose globalThis.PrehistoricRushHost.getState()
```

## Target interaction loop

```txt
load static manifests
  -> normalize scene ids and scene result aliases
  -> adapt runner-tuning.json into runtime tuning with fallback-only inline defaults
  -> emit ManifestLoadStatus and ManifestDriftReport
  -> map DOM button/keyboard/touch into ActionFrame records
  -> accept/reject actions by current scene with stable reason codes
  -> reduce motion through RunnerStepResult
  -> emit RunnerEvent records for movement, boost, jump, terrain-rebuild, pickup, hazard, goal, and scene-request facts
  -> emit ContactEvent records for hazard-hit, shard-pickup, and distance-goal
  -> dispatch all scene changes through SceneDispatchResult
  -> journal actions, runner steps, contacts, and dispatches
  -> expose PrehistoricRushHost.getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(), and runSmoke()
  -> prove DOM-free replay parity before renderer/terrain/raptor/Rapier extraction
```

## Domains in use

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
resize-adapter-ownership
future-touch-input-adapter
debug-host-exposure
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

### Runner and gameplay authority domains

```txt
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
actionframe-contract
action-acceptance-matrix
action-result-journal
scene-dispatch-result-contract
```

### Manifest and validation domains

```txt
manifest-authority
scene-graph-authority
scene-file-authority
scene-id-catalog
scene-result-aliasing
runtime-tuning-adapter
manifest-drift-diagnostics
host-diagnostics-contract
replay-snapshot-contract
dom-free-fixture-runtime
manifest-drift-smoke
scene-alias-smoke
action-acceptance-smoke
runner-step-smoke
contact-event-smoke
replay-parity-smoke
```

## Services the kits offer

### Current live service surface

```txt
shell()
  - owns DOM reset, body style, host section, status panel, and button construction

createTerrain()
  - creates chunked terrain meshes
  - samples height
  - updates chunk origins
  - rebuilds mesh vertex heights/colors

makeRaptor() / animateRaptor()
  - creates procedural dino rig
  - animates stride, tail, chest, neck, head, arms, legs, plates, jump squash/stretch

populate()
  - places tree, rock, and shard instances
  - emits collider descriptors
  - emits pickup descriptors
  - pushes fixed colliders to physics bridge

createPhysics()
  - imports Rapier and rapier-physics-domain-kit
  - initializes physics world
  - configures gravity
  - registers the dino kinematic actor

loop()
  - consumes raw input booleans
  - mutates runner state
  - integrates yaw/speed/jump/gravity/position/distance
  - checks hazards, pickups, and goal
  - mutates app.scene
  - updates camera, HUD, button label, and renderer

PrehistoricRushHost.getState()
  - returns scene, raw runner object, physics snapshot, terrain chunk count, and renderer id
```

### Target service surface

```txt
ManifestLoaderService
  - loadProductManifests()
  - validateSceneFiles()
  - validateKitComposition()
  - publishManifestLoadStatus()

ManifestDriftReportService
  - compareRuntimeTuningToManifest()
  - compareSceneAliases()
  - compareSpawnBudgets()
  - emitManifestDriftReport()

RuntimeTuningAdapterService
  - adaptMotionTuning()
  - adaptTerrainTuning()
  - adaptCameraTuning()
  - fallbackInlineTuning()

ActionFrameService
  - createActionFrame()
  - normalizeKeyboardInput()
  - normalizeButtonInput()
  - normalizeTouchInput()
  - validateActionFrame()

ActionAcceptanceService
  - acceptActionForScene()
  - rejectActionWithReason()
  - journalActionResult()

RunnerStepService
  - reduceRunnerStep()
  - emitRunnerStepResult()
  - reportMotionDelta()
  - requestTerrainRebuild()

RunnerEventService
  - emitRunnerEvent()
  - validateRunnerEvent()
  - journalRunnerEvent()

ContactEventService
  - emitHazardHit()
  - emitShardPickup()
  - emitDistanceGoal()
  - reduceContactEvent()
  - emitContactResult()

SceneDispatchService
  - normalizeResultScene()
  - dispatchSceneRequest()
  - rejectInvalidTransition()
  - journalSceneDispatch()

GameHostDiagnosticsService
  - getDiagnostics()
  - getSnapshot()
  - getReplayJournal()
  - dispatch(actionFrame)
  - runSmoke(name)
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

### Live external ProtoKit

```txt
rapier-physics-domain-kit
```

Current services used or expected from this kit:

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

### First missing ProtoKit

```txt
run-movement-kit
```

Required service contract before promotion:

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

### Repo-local next-cut kits

```txt
prehistoric-rush-manifest-loader-kit
prehistoric-rush-manifest-drift-report-kit
prehistoric-rush-runtime-tuning-adapter-kit
prehistoric-rush-scene-id-catalog-kit
prehistoric-rush-scene-result-alias-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-action-result-journal-kit
prehistoric-rush-runner-source-state-kit
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

## Next implementation slice

```txt
PrehistoricRush Action Dispatch Smoke Gate + Contact Replay Fixture Lock
```

### Build order

```txt
preserve index.html
preserve src/runtime.mjs
preserve visible src/runtime-terrain-v6.mjs behavior
add manifest loader that reads game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json
emit ManifestLoadStatus and ManifestDriftReport
keep inline tuning as fallback-only
add scene-id catalog and scene-result alias table
normalize fail -> run-over with compatibility diagnostic
add ActionFrame record shape
map button, keyboard, and future touch inputs into ActionFrames
add ActionResult accepted/rejected shape with stable reason codes
add action journal separated from raw input booleans
add RunnerSourceState snapshot clone/hydrate helpers
wrap current movement tick in RunnerStepResult without changing visible math first
record jump-consumed, boost-active, terrain-rebuild-requested, and distance-delta facts
wrap hazard, pickup, and goal checks into ContactEvent records
wrap scene changes into SceneDispatchResult records
expand PrehistoricRushHost with diagnostics, snapshot, replay journal, dispatch, and runSmoke
add DOM-free smoke fixtures for manifest load, drift report, fail alias, start/retry, jump accepted/rejected, shard pickup, hazard run-over, distance win, and replay parity
only then extract terrain/render/raptor/Rapier services
```

## Acceptance checks for the next code pass

```txt
[ ] Loading the game still shows the same playable Three.js runner.
[ ] Start, retry, and run-again still work from the current button/keyboard paths.
[ ] Space still starts from non-game scenes and jumps only inside the game scene.
[ ] PrehistoricRushHost.getDiagnostics().manifest.loaded === true.
[ ] PrehistoricRushHost.getDiagnostics().manifest.drift contains current live-vs-manifest drift.
[ ] PrehistoricRushHost.getDiagnostics().sceneAliases.fail === "run-over".
[ ] PrehistoricRushHost.getReplayJournal() contains accepted and rejected ActionResult records.
[ ] Jump input produces an accepted ActionResult only when scene=game and grounded=true.
[ ] Hazard contact produces ContactEvent(type="hazard-hit") and SceneDispatchResult(to="run-over").
[ ] Shard pickup produces ContactEvent(type="shard-pickup") and a durable shard delta.
[ ] Distance goal produces ContactEvent(type="distance-goal") and SceneDispatchResult(to="win").
[ ] DOM-free runSmoke("replay-parity") can replay a scripted journal to the same public snapshot.
```

## Stop conditions

Do not start new visual polish, route content, raptor art, or terrain extraction until the source-lock and smoke gate above pass. The product needs deterministic intent/result authority first; visuals should stay behavior-compatible until replay parity is proven.
