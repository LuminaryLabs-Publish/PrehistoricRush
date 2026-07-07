# PrehistoricRush Project Breakdown

**Run timestamp:** `2026-07-07T19:18:58-04:00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Selected because:** the central `LuminaryLabs-Dev/LuminaryLabs` repo ledger showed `PrehistoricRush` as the oldest eligible tracked non-Cavalry repo in the current Publish rotation.

## Plan ledger

**Goal:** Refresh the internal `.agent` breakdown for `PrehistoricRush`, identify the current runtime loop, domains, service ownership, kit surfaces, and next implementation slice before any visible-content or renderer extraction work.

**Checklist:**

- [x] Reviewed the accessible `LuminaryLabs-Publish` repo list.
- [x] Excluded `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Checked central ledger timestamps in `LuminaryLabs-Dev/LuminaryLabs`.
- [x] Selected only `LuminaryLabs-Publish/PrehistoricRush` for this run.
- [x] Reviewed current README, runtime entry, active runtime monolith, scene graph, tuning manifest, scene manifest, kit composition, cutover inventory, and previous `.agent` state.
- [x] Identified the current interaction loop.
- [x] Identified all active and needed domains.
- [x] Identified current and next service surfaces.
- [x] Identified implemented, targeted, missing, repo-local, next-cut, and deferred kits.
- [x] Defined the next implementation slice.
- [x] Updated root `.agent` docs.
- [x] Logged the run in the central LuminaryLabs repo.

## Central ledger timestamp check

```txt
PrehistoricRush  2026-07-07T18:00:19-04:00  <- oldest eligible
MyCozyIsland     2026-07-07T18:10:03-04:00
IntoTheMeadow    2026-07-07T18:19:15-04:00
ZombieOrchard    2026-07-07T18:28:54-04:00
HorrorCorridor   2026-07-07T18:41:07-04:00
TheOpenAbove     2026-07-07T18:49:32-04:00
AetherVale       2026-07-07T19:01:37-04:00
PhantomCommand   2026-07-07T19:08:52-04:00
TheCavalryOfRome excluded by rule
```

## Current repo read

`PrehistoricRush` is a standalone static browser publish repo for a NexusEngine-powered prehistoric infinite runner.

The route is still:

```txt
index.html
  -> src/runtime.mjs
  -> src/runtime-terrain-v6.mjs
```

`src/runtime.mjs` is a one-line import shim into the active runtime. The real authority surface is `src/runtime-terrain-v6.mjs`.

The current runtime is playable and visually more advanced than the original Canvas runner direction: it imports Three.js, imports Rapier, imports `rapier-physics-domain-kit`, builds a procedural terrain scene, creates a procedural raptor rig, scatters rocks/shards/trees, streams terrain chunks around the player, updates a kinematic actor, checks contacts, projects HUD telemetry, and exposes `globalThis.PrehistoricRushHost`.

The blocker is not the visual runtime. The blocker is source authority and replayability:

```txt
src/runtime-terrain-v6.mjs still owns:
- live tuning constants
- manifest fallback behavior
- DOM shell and HUD creation
- keyboard/button input booleans
- runner motion integration
- jump consumption
- boost/speed interpolation
- terrain streaming decisions
- scatter and pickup generation
- collider descriptor generation
- Rapier bridge calls
- hazard contact checks
- shard pickup checks
- distance win checks
- direct scene mutation to run-over/win
- camera follow math
- HUD projection
- host snapshot shape
```

## Current interaction loop

```txt
index.html
  -> #app mount
  -> import src/runtime.mjs
  -> import src/runtime-terrain-v6.mjs
  -> import Three.js from jsDelivr
  -> import Rapier from jsDelivr
  -> import rapier-physics-domain-kit from ProtoKits CDN
  -> create DOM shell, status panel, Start Rush button
  -> create Three.js scene/camera/renderer/lights/fog/sky
  -> create procedural terrain chunks
  -> create procedural raptor visual rig
  -> create rock, shard, and tree instanced meshes
  -> create Rapier physics bridge and kinematic dino actor
  -> initialize app.state and app.scene=menu
  -> bind click, keydown, keyup, and resize listeners
  -> requestAnimationFrame(loop)
  -> if app.scene=game:
       read raw input booleans
       mutate yaw, speed, jump, x/z, distance, best, and terrain sample
       rebuild terrain/scatter when chunk changes or every 8 frames
       push dino transform into Rapier
       step physics
       check physics contacts and manual collider distance
       mutate app.scene=run-over on impact
       check shard pickups and mutate shards/collected
       mutate app.scene=win after distance > 3600
  -> update raptor pose, camera, HUD, button label, and renderer
  -> expose PrehistoricRushHost.getState()
```

## Target interaction loop

```txt
load static manifests before setup()
  -> publish ManifestLoadStatus
  -> publish ManifestDriftReport
  -> normalize scene aliases, including fail -> run-over
  -> adapt runner-tuning.json into runtime tuning
  -> keep inline constants as fallback-only
  -> bind DOM/button/keyboard/touch into ActionFrame records
  -> run scene-scoped ActionAcceptanceMatrix
  -> append accepted/rejected ActionResult records
  -> reduce RunnerSourceState through RunnerStepResult
  -> emit RunnerEvent records for movement facts
  -> emit ContactEvent records for hazard, shard, and distance-goal outcomes
  -> reduce ContactEvent into ContactResult snapshots
  -> route every scene change through SceneDispatchResult
  -> project diagnostics through PrehistoricRushHost
  -> make replay journal available through PrehistoricRushHost
  -> prove DOM-free smoke fixtures before extraction
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

### Manifest and source-authority domains

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
host-diagnostics-contract
replay-snapshot-contract
dom-free-fixture-runtime
```

### Runner and action domains

```txt
actionframe-contract
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

### Render, terrain, object, and camera domains

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

### Validation domains

```txt
manifest-drift-smoke
scene-alias-smoke
action-acceptance-smoke
runner-step-smoke
contact-event-smoke
scene-dispatch-smoke
replay-parity-smoke
```

## Current service surfaces

### Product-side services already present

```txt
shell()
  creates root DOM, body style, host surface, panel, status line, button

load(url)
  imports CDN modules and reports console fallback warnings

createGrid(THREE, size, segments)
  builds terrain grid geometry

createTerrain(THREE, scene)
  builds chunk meshes, samples heights, rebuilds mesh vertex heights/colors, tracks chunk update state

makeRaptor(THREE)
  builds procedural raptor root, hips, chest, neck, head, tail, legs, arms, plates, eyes, claws, and outline shells

animateRaptor(raptor, speed, time, turning, jump)
  drives procedural pose from current runner state

treePools(THREE)
  creates instanced tree mesh pools

sky(THREE)
  creates background sphere

setup(THREE, host)
  creates renderer, scene, camera, fog, lighting, terrain, player, dummy, rocks, shards, trees, and resize behavior

state()
  creates runner mutable source state

populate(app)
  rebuilds instanced scatter, colliders, pickups, and Rapier fixed colliders around current chunk

createPhysics()
  loads Rapier, installs rapier-physics-domain-kit, configures gravity, registers kinematic actor, returns physics API

main()
  creates app, binds inputs, starts loop, exposes host

loop(now)
  integrates runner, physics, contacts, pickups, win/loss, camera, HUD, animation, render

PrehistoricRushHost.getState()
  exposes scene, runner state, physics snapshot, terrain chunks, and renderer id
```

### Service gaps to add next

```txt
loadProductManifests()
validateSceneFiles()
validateKitComposition()
adaptRunnerTuning()
compareLiveTuningToManifest()
compareSceneAliases()
compareSpawnBudgets()
emitManifestLoadStatus()
emitManifestDriftReport()
normalizeResultScene()
createActionFrame()
acceptActionForScene()
rejectActionWithReason()
appendActionResult()
snapshotRunnerSourceState()
reduceRunnerStep()
emitRunnerStepResult()
emitRunnerEvent()
emitHazardHit()
emitShardPickup()
emitDistanceGoal()
reduceContactEvent()
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

### Current live ProtoKit dependency

```txt
rapier-physics-domain-kit
```

Live services consumed:

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
manifest authority
scene alias authority
stable tuning adapter
ActionFrame acceptance metadata
ActionResult journal
RunnerSourceState snapshot contract
RunnerStepResult metadata
RunnerEvent journal
ContactEvent journal
SceneDispatchResult journal
stable GameHost diagnostics
DOM-free fixture coverage
```

### Repo-local extraction / next-cut kits

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

## Specific drift and blocker findings

```txt
Runtime live tuning:
- motion.speed = 15
- motion.maxSpeed = 25
- motion.boostSpeed = 31
- motion.turnRate = 2.55
- terrain.chunkSize = 46
- terrain.segments = 24
- terrain.seed = 238991

runner-tuning.json source values:
- motion.baseForwardSpeed = 13.5
- motion.maxForwardSpeed = 24
- motion.boostForwardSpeed = 29
- motion.turnRate = 2.45
- terrain.chunkSize = 44
- terrain.chunkSegments = 20
- terrain.seed = prehistoric-rush-infinite-terrain-v1

Scene drift:
- game-scenes.json canonical loss scene is run-over
- scenes/game.json still says nextOnLoss = fail
- runtime directly mutates app.scene = run-over

Authority drift:
- distance win threshold is inline as distance > 3600
- spawn budgets are inline in runtime tuning
- contact outcomes are not durable event records
- jump consumption is not recorded as a RunnerStepResult fact
- GameHost does not expose diagnostics, replay journal, dispatch, or smoke entry points
```

## Next implementation slice

```txt
PrehistoricRush Runner Source Snapshot + Contact Smoke Authority Lock
```

### Build order

```txt
1. Preserve index.html and src/runtime.mjs.
2. Preserve current Three.js/Rapier visible behavior.
3. Add manifest loading before setup().
4. Emit ManifestLoadStatus.
5. Emit ManifestDriftReport with live-vs-manifest tuning deltas.
6. Add scene alias catalog and normalize fail -> run-over as compatibility only.
7. Add RuntimeTuningAdapter and keep inline tuning as fallback-only.
8. Add ActionFrame contract for start, retry, menu, again, left, right, boost, jump, and future touch.
9. Add ActionAcceptanceMatrix by scene.
10. Add ActionResult journal with stable accepted/rejected reasons.
11. Add RunnerSourceState snapshot and hydrate helpers.
12. Wrap current motion math in RunnerStepResult without visible math changes.
13. Record movement facts: jump-consumed, boost-active, distance-delta, heading-delta, terrain-rebuild-requested.
14. Emit ContactEvent records for hazard-hit, shard-pickup, and distance-goal.
15. Reduce contacts into ContactResult snapshots.
16. Route every scene change through SceneDispatchResult.
17. Expand PrehistoricRushHost with getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(actionFrame), and runSmoke(name).
18. Add DOM-free smoke fixtures for manifest load, tuning drift, scene alias, action acceptance, runner step, shard pickup, hazard run-over, distance win, and replay parity.
19. Defer renderer, terrain, raptor, camera, and Rapier extraction until smoke contracts pass.
```

### Acceptance checks

```txt
- The deployed game still opens and plays as the current Three.js runner.
- Start, retry, run-again, keyboard steering, boost, and jump still work.
- Space still starts from non-game scenes and jumps only in game.
- PrehistoricRushHost.getDiagnostics().manifest.loaded === true.
- PrehistoricRushHost.getDiagnostics().manifest.drift reports the current known tuning deltas.
- PrehistoricRushHost.getDiagnostics().sceneAliases.fail === "run-over".
- PrehistoricRushHost.getReplayJournal() contains accepted and rejected ActionResult records.
- Jump only accepts when scene=game and grounded=true.
- Hazard contact emits ContactEvent(type="hazard-hit") and SceneDispatchResult(to="run-over").
- Shard pickup emits ContactEvent(type="shard-pickup") and a durable shard delta.
- Distance goal emits ContactEvent(type="distance-goal") and SceneDispatchResult(to="win").
- runSmoke("replay-parity") can replay a scripted accepted journal to the same public snapshot.
```

## Recommendation

Do not add new visible content first. This repo has enough visible runtime now. The next code pass should lock source authority, action/result legality, contact/event records, scene dispatch records, host diagnostics, and replay smokes. Once that is stable, route readability, hazard readability, pickup clarity, camera polish, terrain density, and raptor animation polish can be safely moved into source-backed services or promoted into reusable kits.

## Run state

```txt
Runtime source changed: false
Documentation changed: true
Local build run: false
Local smoke run: false
Reason no local build was run: documentation-only update through GitHub connector; repo has no package.json validation surface.
```
