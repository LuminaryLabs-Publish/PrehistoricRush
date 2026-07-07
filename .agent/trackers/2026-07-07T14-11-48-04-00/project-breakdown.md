# PrehistoricRush Project Breakdown — 2026-07-07T14:11:48-04:00

## Goal

Break down `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible non-Cavalry Publish repo in the current central ledger rotation, identify the current interaction loop, domains, services, and kits, then define the next source cutover that keeps the product thin while making runtime authority replayable.

## Selection reason

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by standing rule.

The central ledger showed `LuminaryLabs-Publish/PrehistoricRush` as the oldest eligible tracked non-Cavalry Publish repo by latest review timestamp among the reviewed accessible Publish repos. The prior PrehistoricRush pass was `2026-07-07T13:01:09-04:00`, while later reviewed repos included MyCozyIsland, IntoTheMeadow, ZombieOrchard, HorrorCorridor, TheOpenAbove, and PhantomCommand.

## Source files reviewed

```txt
index.html
README.md
src/runtime.mjs
src/runtime-terrain-v6.mjs
game-scenes.json
scenes/game.json
runner-tuning.json
kit-composition.json
kit-cutover-inventory.json
.agent/README.md
.agent/kit-registry.json
LuminaryLabs-Dev/LuminaryLabs:repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
```

## Current read

`PrehistoricRush` is a standalone static browser publish repo for a NexusEngine-powered prehistoric infinite runner.

The app shell is thin. `index.html` mounts `#app` and loads `src/runtime.mjs`. `src/runtime.mjs` only imports `src/runtime-terrain-v6.mjs`.

The active runtime is playable but still monolithic. `src/runtime-terrain-v6.mjs` imports Three.js, Rapier, and `rapier-physics-domain-kit` from CDNs, creates DOM shell/HUD/button state, builds terrain, scatter, pickups, raptor rig, camera, physics bridge, and exposes `globalThis.PrehistoricRushHost`.

The main gap is no longer just scene dispatch. The highest-value seam is now **manifest/tuning authority plus runner-event replay**:

```txt
runtime-terrain-v6.mjs owns live constants inline
runner-tuning.json owns intended motion/camera/terrain/streaming/rule constants
scenes/game.json still says nextOnLoss: fail
game-scenes.json uses run-over as the canonical loss scene
input mutates live booleans
runner movement mutates state directly
hazard, pickup, and win checks mutate state directly
PrehistoricRushHost exposes partial state only
```

## Interaction loop

### Current runtime loop

```txt
open index.html
-> mount <main id="app">
-> load src/runtime.mjs
-> import src/runtime-terrain-v6.mjs
-> import Three.js from jsDelivr
-> import Rapier from jsDelivr
-> import rapier-physics-domain-kit from NexusRealtime-ProtoKits CDN
-> create shell, HUD panel, status, and Start Rush button
-> create Three.js scene, camera, renderer, sky, fog, sun, terrain, rocks, shards, tree instances, and raptor rig
-> create optional Rapier physics bridge and register dino kinematic actor
-> initialize app.scene = menu
-> bind button and keyboard handlers
-> button / Enter / Space outside game set app.scene = game directly
-> frame loop advances dt and frame
-> if scene is game, mutate runner state directly:
   -> turn, yaw, speed, jump, gravity, x/z position, distance, best distance, terrain sample
   -> update terrain chunks and populate instanced trees/rocks/shards
   -> update Rapier actor transform and step physics
   -> check hazard contacts and set app.scene = run-over directly
   -> check shard pickups and mutate collected/shards directly
   -> if distance > 3600, set app.scene = win directly
-> update raptor visual pose
-> update camera follow and look-ahead
-> update HUD text and button label
-> expose PrehistoricRushHost.getState()
```

### Intended player loop

```txt
start at menu
-> press Start, Enter, or Space to start rush
-> steer left/right while sprinting forward across procedural terrain
-> boost with W / Up
-> jump with Space during active gameplay
-> avoid terrain scatter hazards
-> collect blue shards
-> survive until target distance
-> on impact, enter run-over scene and retry or return to menu
-> on target distance, enter win scene and run again or return to menu
```

### Target service loop

```txt
prehistoric-rush-manifest-loader-kit loads all manifests before runtime setup
-> prehistoric-rush-runtime-tuning-adapter-kit maps runner-tuning.json into runtime constants
-> prehistoric-rush-manifest-drift-diagnostics-kit reports fallback or drift
-> prehistoric-rush-scene-id-catalog-kit asserts canonical scenes
-> prehistoric-rush-scene-result-alias-kit maps fail -> run-over as compatibility only
-> prehistoric-rush-action-frame-contract-kit normalizes button/key/touch/fixture intent
-> prehistoric-rush-action-acceptance-matrix-kit accepts/rejects actions by active scene
-> prehistoric-rush-scene-authority-reducer-kit owns scene transitions
-> prehistoric-rush-scene-dispatch-result-kit returns accepted/rejected transition records
-> prehistoric-rush-runner-step-result-kit advances motion and exposes movement deltas
-> prehistoric-rush-runner-event-contract-kit emits movement/contact/scene-request events
-> prehistoric-rush-contact-event-contract-kit captures hazard/pickup/goal outcomes
-> prehistoric-rush-runner-event-journal-kit and action-frame-replay-kit replay accepted events
-> prehistoric-rush-gamehost-kit exposes stable diagnostics/snapshots/runSmoke
```

## Domains in use

```txt
static-browser-shell
module-runtime-entry
cdn-dependency-loading
three-render-host
rapier-runtime-bridge
rapier-physics-domain-kit-adapter
manifest-authority
manifest-drift-diagnostics
runner-tuning-authority
scene-graph-authority
scene-file-authority
scene-id-catalog
scene-result-aliasing
scene-authority-reducer
scene-transition-request
scene-dispatch-result-contract
scene-dispatch-rejection-policy
scene-scoped-input-policy
raw-keyboard-input
button-input
touch-input-adapter-future
input-intent-mapping
action-frame-contract
action-frame-acceptance-policy
action-frame-rejection-policy
action-frame-journal
runner-step-contract
runner-event-contract
runner-state-reducer
runner-motion-policy
speed-ramp-policy
boost-policy
jump-policy
gravity-policy
grounded-state-policy
terrain-streaming
terrain-sampling
heightfield-coloring
procedural-scatter-placement
hazard-descriptor-generation
pickup-descriptor-generation
pickup-collection-policy
contact-event-contract
contact-result-policy
hazard-contact-policy
pickup-contact-policy
run-over-result-policy
win-result-policy
raptor-visual-rig
raptor-pose-animation
camera-follow
hud-diagnostics
host-diagnostics-contract
scene-snapshot-contract
input-snapshot-contract
runner-snapshot-contract
contact-snapshot-contract
replay-snapshot-contract
kit-status-reporting
smoke-fixture-runtime
tuning-parity-smoke
scene-result-smoke
action-acceptance-smoke
runner-event-replay-smoke
contact-result-smoke
replay-parity-smoke
```

## Services that kits offer

### Current source-backed / live services

```txt
index.html
  - app mount
  - document metadata
  - module script entry

src/runtime.mjs
  - active runtime import

src/runtime-terrain-v6.mjs
  - load Three.js, Rapier, and physics ProtoKit modules
  - create DOM shell, HUD, status, and button
  - create terrain heightfield chunks
  - hash/sample/color terrain
  - create procedural raptor mesh rig
  - animate raptor pose
  - create instanced trees, rocks, and shards
  - populate terrain scatter around runner
  - create optional Rapier physics bridge
  - create and mutate runner state
  - bind keyboard and button input
  - advance runner movement
  - update terrain stream
  - resolve hazard contacts
  - resolve shard pickups
  - resolve win threshold
  - update camera follow
  - update HUD diagnostics
  - expose PrehistoricRushHost.getState()

game-scenes.json
  - declare scene graph id/version
  - declare entry scene
  - declare canonical scene order
  - declare transitions
  - map scene ids to scene files
  - list NexusEngine CDN and core kits

runner-tuning.json
  - declare intended motion constants
  - declare camera constants
  - declare terrain constants
  - declare streaming constants
  - declare fairness rules

kit-composition.json
  - declare engine/protokit CDN targets
  - declare core kit install list
  - declare first missing ProtoKit
  - declare existing ProtoKit families to use first

kit-cutover-inventory.json
  - declare product-owned vs kit-owned responsibilities
  - declare capability ownership decisions
  - declare promotion rationale per capability
```

### Target services

```txt
manifest loading
  - loadSceneGraph
  - loadSceneFiles
  - loadRunnerTuning
  - loadKitComposition
  - loadCutoverInventory
  - validateManifestShape
  - publishConfigDiagnostics

tuning authority
  - mapManifestTuningToRuntimeTuning
  - supplyFallbackTuning
  - compareRuntimeTuningToManifest
  - publishDriftReport

scene authority
  - listSceneIds
  - assertKnownScene
  - getEntryScene
  - resolveAlias
  - dispatch
  - acceptTransition
  - rejectTransition
  - snapshotScene

action authority
  - fromKeyboardEvent
  - fromButtonEvent
  - fromTouchEvent
  - fromFixtureCommand
  - validateSceneAction
  - explainRejectedAction
  - appendAcceptedFrame
  - appendRejectedFrame

runner authority
  - createRunnerState
  - applyActionFrame
  - tickRunner
  - emitRunnerStepResult
  - emitRunnerEvent
  - snapshotRunner
  - replayRunnerEvents

contact authority
  - fromHazardContact
  - fromShardPickup
  - fromDistanceGoal
  - serializeContactEvent
  - publishContactSnapshot

host diagnostics
  - getDiagnostics
  - getSceneSnapshot
  - getInputSnapshot
  - getRunnerSnapshot
  - getContactSnapshot
  - getReplayJournal
  - getKitStatus
  - dispatch
  - subscribe
  - runSmoke
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
  services:
    initWorld
    install
    configure
    registerKinematicActor
    setActorTransform
    setFixedColliders
    step
    getSnapshot
```

### Missing ProtoKit

```txt
run-movement-kit
  candidate services:
    createRunnerController
    applyActionFrame
    applyInputIntent
    bufferJump
    resolveCoyoteWindow
    tickFixedStep
    emitRunnerStepResult
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

### Repo-local / next-cut kits

```txt
prehistoric-rush-static-shell-kit
prehistoric-rush-runtime-entry-kit
prehistoric-rush-cdn-loader-kit
prehistoric-rush-manifest-loader-kit
prehistoric-rush-runtime-tuning-adapter-kit
prehistoric-rush-manifest-drift-diagnostics-kit
prehistoric-rush-scene-id-catalog-kit
prehistoric-rush-scene-result-alias-kit
prehistoric-rush-scene-authority-reducer-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-runner-step-result-kit
prehistoric-rush-runner-event-contract-kit
prehistoric-rush-runner-event-journal-kit
prehistoric-rush-action-frame-replay-kit
prehistoric-rush-input-diagnostics-journal-kit
prehistoric-rush-scripted-action-fixture-kit
prehistoric-rush-contact-event-contract-kit
prehistoric-rush-contact-result-snapshot-kit
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
prehistoric-rush-host-diagnostics-contract-kit
prehistoric-rush-scene-snapshot-contract-kit
prehistoric-rush-input-snapshot-contract-kit
prehistoric-rush-runner-snapshot-contract-kit
prehistoric-rush-replay-snapshot-contract-kit
prehistoric-rush-scene-result-smoke-kit
prehistoric-rush-tuning-parity-smoke-kit
prehistoric-rush-scene-dispatch-smoke-kit
prehistoric-rush-action-acceptance-smoke-kit
prehistoric-rush-runner-event-replay-smoke-kit
prehistoric-rush-contact-result-smoke-kit
prehistoric-rush-replay-parity-smoke-kit
```

## Blockers

```txt
runtime-tuning-duplication
  runner-tuning.json defines intent, but runtime-terrain-v6.mjs owns live constants.

runtime-manifest-drift
  live motion speed/max/boost/turn and terrain chunk/segments/seed differ from runner-tuning.json.

scene-result-name-mismatch
  game-scenes.json routes to run-over, while scenes/game.json still says nextOnLoss: fail.

scene-dispatch-gap
  runtime mutates app.scene directly.

runner-step-result-gap
  movement mutates state directly without a RunnerStepResult.

contact-result-gap
  hazard, pickup, and win outcomes mutate state directly without ContactEvent / ContactResult records.

space-key-semantic-overlap
  Space starts outside game and jumps inside game without a scene-scoped ActionFrame contract.

action-replay-gap
  accepted input, runner steps, and contact events are not journaled.

partial-gamehost-surface
  PrehistoricRushHost.getState() exists but stable diagnostics/snapshots/replay/dispatch/smoke APIs do not.
```

## Next implementation slice

```txt
PrehistoricRush Manifest/Tuning Authority + Runner Event Replay Fixture Cutover
```

Build order:

```txt
keep index.html and src/runtime.mjs thin
-> keep current browser loop visually playable
-> add prehistoric-rush-manifest-loader-kit
-> load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> add prehistoric-rush-runtime-tuning-adapter-kit
-> map runner-tuning.json motion, terrain, camera, streaming, and rule fields into runtime setup
-> make inline tuning fallback-only
-> add prehistoric-rush-manifest-drift-diagnostics-kit
-> publish config load success, fallback use, manifest drift, scene alias drift, and tuning drift through diagnostics
-> add prehistoric-rush-scene-id-catalog-kit
-> assert menu, game, run-over, and win are the only canonical scene ids
-> add prehistoric-rush-scene-result-alias-kit
-> make run-over canonical and fail compatibility-only
-> add prehistoric-rush-scene-authority-reducer-kit
-> replace direct app.scene mutation paths with sceneAuthority.dispatch(event)
-> add prehistoric-rush-scene-dispatch-result-kit
-> return accepted=false for unknown scene, invalid transition, duplicate transition, stale fixture event, and compatibility-only canonical write attempts
-> add prehistoric-rush-action-frame-contract-kit
-> define ActionFrame fields: id, frame, time, scene, action, value, source, accepted, rejected, reason
-> add prehistoric-rush-action-acceptance-matrix-kit
-> route button, Enter, Space, left/right, boost, retry, menu, and run-again through ActionFrame validation
-> add prehistoric-rush-runner-step-result-kit
-> return per-tick movement delta, consumed actions, rejected actions, speed/yaw/jump changes, and diagnostics
-> add prehistoric-rush-runner-event-contract-kit
-> emit runner events for start, jump, boost, steering, chunk rebuild, pickup contact, hazard contact, win threshold, and scene request
-> add prehistoric-rush-runner-event-journal-kit
-> add prehistoric-rush-contact-event-contract-kit
-> convert hazard hit, shard pickup, and distance goal into ContactEvent records
-> add prehistoric-rush-contact-result-snapshot-kit
-> snapshot lastContactEvent, impactEvents, pickupEvents, goalEvents, and pendingSceneRequest
-> expand PrehistoricRushHost into prehistoric-rush-gamehost-kit
-> expose getDiagnostics, getSceneSnapshot, getInputSnapshot, getRunnerSnapshot, getContactSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and runSmoke
-> add DOM-free fixture scripts for tuning parity, scene alias, start, space-start, jump, rejected-jump, hazard-run-over, pickup, win, retry, menu, runner-event replay, and replay parity
-> defer terrain/render/raptor extraction until manifest/tuning, scene dispatch, runner event, and contact result smoke pass
```

## Acceptance targets

```txt
Existing browser loop remains visually playable.
PrehistoricRushHost.getState().scene starts as menu.
Scene ids are normalized to menu, game, run-over, and win.
fail is accepted only as compatibility alias and never becomes canonical scene id.
runner-tuning.json is the source of truth for motion, camera, terrain, streaming, and rules.
inline tuning is fallback-only and any fallback use appears in diagnostics.
button, Enter, and Space outside game route through explicit accepted start ActionFrame records.
Space emits jump only while scene is game.
left/right/boost emit accepted gameplay ActionFrames only while scene is game.
invalid scene/action pairs emit stable rejected ActionFrame diagnostics.
start, retry, menu, run-over, win, and run-again route through SceneDispatchResult records.
hazard hit, shard pickup, and distance goal create ContactEvent records before scene changes.
RunnerStepResult exposes movement delta, consumed action count, rejected action count, and diagnostics.
RunnerEvent journal can be replayed in a DOM-free fixture.
PrehistoricRushHost exposes stable diagnostics, scene, input, runner, contact, replay, and kit-status snapshots.
DOM-free fixture proves tuning parity, scene aliasing, accepted/rejected actions, hazard run-over, pickup, win, retry, and replay parity.
terrain, renderer, raptor rig, and Rapier extraction remain deferred until fixture parity passes.
```

## Validation notes

No runtime source code was changed during this documentation pass.

No local build or smoke test was run. The repo does not expose a package-level Node test harness in the reviewed root files, so validation should be added as DOM-free fixtures in the next source pass.
