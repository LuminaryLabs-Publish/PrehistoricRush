# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-07T16:40:29-04:00`

**Selected repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Excluded repo:** `LuminaryLabs-Publish/TheCavalryOfRome`

## Selection reason

`PrehistoricRush` was selected because the central ledger showed it as the oldest eligible tracked non-Cavalry Publish repo by latest review timestamp among the accessible tracked Publish repos.

Latest eligible central timestamps checked:

```txt
PrehistoricRush  2026-07-07T15:29:27-04:00
MyCozyIsland     2026-07-07T15:40:06-04:00
IntoTheMeadow    2026-07-07T15:49:14-04:00
ZombieOrchard    2026-07-07T15:59:24-04:00
HorrorCorridor   2026-07-07T16:09:54-04:00
TheOpenAbove     2026-07-07T16:21:09-04:00
AetherVale       2026-07-07T16:29:18-04:00
PhantomCommand   2026-07-07T16:30:00-04:00
```

## Current product read

`PrehistoricRush` is a static browser infinite-runner proof. The user opens `index.html`, the page mounts `#app`, and `src/runtime.mjs` imports the active runtime at `src/runtime-terrain-v6.mjs`.

The current playable loop is good enough to preserve: menu, start, running raptor, free steering, boost, jump, procedural terrain, trees, rocks, shard pickups, hazard loss, win distance, camera follow, HUD, and a `globalThis.PrehistoricRushHost` snapshot.

The major blocker remains source authority drift and replay absence. The repo already has manifest files, but the live runtime still owns the source of truth inline. That means current behavior can only be verified by playing the browser scene, not by a deterministic fixture.

## Interaction loop

### Current live loop

```txt
index.html
  -> <main id="app">
  -> src/runtime.mjs
  -> src/runtime-terrain-v6.mjs
  -> CDN imports: Three.js, Rapier, rapier-physics-domain-kit
  -> shell() clears #app and creates HUD/status/start button
  -> setup() creates scene, fog, camera, renderer, terrain, raptor, trees, rocks, shards
  -> createPhysics() installs the Rapier ProtoKit bridge
  -> state() creates runner state from inline tuning
  -> populate() places trees, rocks, shard pickups, and collider descriptors
  -> app starts in scene=menu
  -> button/keyboard listeners mutate raw app.input booleans or scene
  -> requestAnimationFrame(loop)
  -> if scene=game:
       update speed, yaw, jump, gravity, x/z distance, terrain sample
       rebuild terrain/scatter when chunks move
       publish actor transform to Rapier
       run Rapier/fallback collision checks
       mutate app.scene directly to run-over on hit
       collect one shard and repopulate
       mutate app.scene directly to win at distance > 3600
  -> update raptor pose, camera, HUD, button text
  -> render scene
  -> expose globalThis.PrehistoricRushHost.getState()
```

### Target service loop

```txt
load static product manifests
  -> validate scene ids, transition ids, and file references
  -> adapt runner-tuning.json into runtime constants
  -> mark inline constants as fallback-only
  -> emit ManifestDriftReport
  -> convert raw button / key / future touch input into ActionFrame records
  -> apply scene-scoped ActionFrame acceptance
  -> reduce motion through RunnerStepResult
  -> emit RunnerEvent records
  -> reduce hazard / pickup / goal checks through ContactEvent records
  -> request scene changes through SceneDispatchResult
  -> append replay journal facts
  -> expose GameHost diagnostics and snapshots
  -> verify scripted DOM-free replay fixtures before extracting terrain, renderer, raptor, or Rapier logic
```

## Domains in use

```txt
static-browser-shell
module-runtime-entry
cdn-dependency-loading
import-fallback-diagnostics
dom-mount-ownership
hud-panel-ownership
start-button-adapter
keyboard-input-adapter
future-touch-input-adapter
resize-adapter
three-renderer-host
scene-camera-lighting-fog
sky-dome-rendering
procedural-terrain-rendering
terrain-height-sampling
terrain-chunk-streaming
height-band-coloring
procedural-scatter-placement
tree-instance-pools
rock-instance-pool
shard-instance-pool
clear-radius-policy
collider-descriptor-generation
pickup-descriptor-generation
rapier-runtime-bridge
rapier-physics-domain-kit-adapter
kinematic-actor-registration
fixed-collider-publication
physics-step-snapshot
fallback-geometric-contact
raptor-visual-rig
raptor-pose-animation
runner-source-state
runner-motion-policy
forward-speed-policy
boost-policy
turn-yaw-policy
jump-policy
gravity-policy
grounded-state-policy
distance-score-policy
best-distance-persistence
shard-count-policy
scene-graph-authority
scene-file-authority
scene-transition-map
scene-result-aliasing
scene-scoped-action-policy
scene-authority-reducer
scene-dispatch-result-contract
manifest-authority
runner-tuning-authority
runtime-tuning-adapter
manifest-drift-diagnostics
kit-composition-authority
cutover-inventory-authority
flock-generation-descriptor-authority
actionframe-contract
actionframe-acceptance-matrix
actionframe-rejection-reason-catalog
action-journal
runnerstepresult-contract
runnerevent-contract
runner-event-journal
contactevent-contract
contactresult-snapshot
hazard-contact-policy
pickup-contact-policy
distance-goal-policy
run-over-result-policy
win-result-policy
camera-follow-policy
hud-diagnostics
button-state-projection
debug-host-exposure
host-diagnostics-contract
scene-snapshot-contract
input-snapshot-contract
runner-snapshot-contract
contact-snapshot-contract
manifest-drift-snapshot-contract
replay-snapshot-contract
dom-free-fixture-runtime
manifest-drift-smoke
scene-alias-smoke
action-acceptance-smoke
runner-step-smoke
contact-event-smoke
replay-parity-smoke
```

## Current services found

### Browser shell services

```txt
index.html:
  provide #app mount
  provide module entry script
  provide page title / description

src/runtime.mjs:
  import active runtime
```

### Active runtime services

```txt
src/runtime-terrain-v6.mjs:
  load(url)
  shell()
  createGrid()
  createTerrain()
  mat()
  mesh()
  outline()
  capsuleBetween()
  makeRaptor()
  animateRaptor()
  treePools()
  sky()
  setup()
  state()
  populate()
  createPhysics()
  main()
```

### Live runtime-owned behavior

```txt
inline tuning constants
CDN import fallback
DOM shell creation
HUD status projection
start/retry/jump button behavior
keyboard input mutation
Three.js renderer setup
scene/camera/light/fog setup
procedural terrain mesh generation
terrain chunk rebuild
terrain height sampling
tree/rock/shard instancing
clear-radius scatter rules
collider descriptor generation
pickup descriptor generation
Rapier kit bridge setup
fallback collision checks
raptor mesh assembly
raptor animation
runner motion integration
jump consumption
boost interpolation
distance scoring
best-distance localStorage persistence
hazard hit handling
shard pickup handling
win threshold handling
direct scene mutation
camera follow
globalThis.PrehistoricRushHost.getState()
```

### External ProtoKit service already used

```txt
rapier-physics-domain-kit:
  initWorld
  install
  configure
  registerKinematicActor
  setActorTransform
  setFixedColliders
  step
  getSnapshot
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
```

### Missing reusable ProtoKit candidate

```txt
run-movement-kit:
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

### Repo-local kits to cut first

```txt
prehistoric-rush-manifest-loader-kit
prehistoric-rush-manifest-drift-report-kit
prehistoric-rush-runtime-tuning-adapter-kit
prehistoric-rush-scene-id-catalog-kit
prehistoric-rush-scene-result-alias-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-action-journal-kit
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

## Drift facts to fix first

```txt
runtime motion.speed = 15
runner-tuning motion.baseForwardSpeed = 13.5

runtime motion.maxSpeed = 25
runner-tuning motion.maxForwardSpeed = 24

runtime motion.boostSpeed = 31
runner-tuning motion.boostForwardSpeed = 29

runtime motion.turnRate = 2.55
runner-tuning motion.turnRate = 2.45

runtime terrain.chunkSize = 46
runner-tuning terrain.chunkSize = 44

runtime terrain.segments = 24
runner-tuning terrain.chunkSegments = 20

runtime terrain.seed = 238991
runner-tuning terrain.seed = prehistoric-rush-infinite-terrain-v1

game-scenes.json canonical loss scene = run-over
scenes/game.json nextOnLoss = fail

runtime win threshold = distance > 3600 inline
runtime spawn counts and clearRadius = inline
runtime jump input = raw boolean consumed and cleared every frame
runtime hazard / pickup / win outcomes = direct state mutation without durable result records
```

## Highest-value next implementation slice

```txt
PrehistoricRush Manifest Drift Gate + Runner Replay Source Lock
```

Build order:

```txt
preserve index.html
preserve src/runtime.mjs
preserve current visual runtime behavior
add prehistoric-rush-manifest-loader-kit
load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json before setup()
add prehistoric-rush-manifest-drift-report-kit
report all live-vs-manifest drift without changing visuals first
add prehistoric-rush-runtime-tuning-adapter-kit
drive motion and terrain constants from runner-tuning.json
keep inline constants as fallback only
add prehistoric-rush-scene-id-catalog-kit
keep menu, game, run-over, and win canonical
add prehistoric-rush-scene-result-alias-kit
treat fail as compatibility alias for run-over
add ActionFrame records for start, retry, menu, again, left, right, boost, and jump
add ActionFrame acceptance/rejection records by scene
add RunnerSourceState snapshot
add RunnerStepResult for speed, yaw, boost, jump, gravity, position, distance, terrain sample, and rebuild request
add RunnerEvent journal
add ContactEvent records for hazard-hit, shard-pickup, and distance-goal
add SceneDispatchResult records for run-over and win
expand PrehistoricRushHost with getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(actionFrame), and runSmoke(name)
add DOM-free smoke fixtures for:
  manifest load
  tuning drift report
  fail -> run-over alias
  start acceptance
  rejected jump outside game
  accepted jump in game
  hazard run-over
  shard pickup
  distance win
  retry path
  replay parity
defer terrain/render/raptor/Rapier extraction until source-lock smokes pass
```

## Implementation notes

Keep the first code change small and diagnostic. Do not refactor the renderer first.

The correct first code seam is a source-owned loader plus a manifest drift report that the live runtime can expose through `PrehistoricRushHost`. Once the report is stable, route runtime constants through the adapter and then add ActionFrame / RunnerStep / ContactEvent records.

Do not build new content, new hazards, new dinosaurs, or new visual polish until replay fixtures exist.

## Validation

No runtime source code changed in this documentation pass.

No local build or smoke test was executed. This repo does not expose a package-level test harness, and the next implementation pass should create DOM-free smoke fixtures before source extraction.
