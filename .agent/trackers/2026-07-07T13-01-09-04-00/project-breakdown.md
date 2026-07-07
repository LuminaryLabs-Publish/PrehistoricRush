# PrehistoricRush Project Breakdown

**Run timestamp:** `2026-07-07T13:01:09-04:00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Selected after:** `LuminaryLabs-Publish/PhantomCommand`

**Excluded:** `LuminaryLabs-Publish/TheCavalryOfRome`

## Summary

`PrehistoricRush` is a standalone static browser repo for a NexusEngine-powered prehistoric infinite runner. The app is playable, but the live authority still sits inside `src/runtime-terrain-v6.mjs` rather than behind explicit scene, action, contact, snapshot, and fixture contracts.

This run keeps the prior manifest/action direction but narrows the next implementation slice into **Scene Authority Dispatch + Contact Result Snapshot Fixture**. The work should first make scene transitions and contact outcomes explicit, replayable, and inspectable before extracting terrain, raptor visuals, renderer, or Rapier bridge code.

## Selection Ledger

```txt
LuminaryLabs-Publish org scan
-> exclude LuminaryLabs-Publish/TheCavalryOfRome
-> central LuminaryLabs ledger latest eligible repo is LuminaryLabs-Publish/PhantomCommand
-> next eligible tracked repo is LuminaryLabs-Publish/PrehistoricRush
-> work on only LuminaryLabs-Publish/PrehistoricRush for this run
```

## Reviewed Sources

```txt
README.md
index.html
src/runtime.mjs
src/runtime-terrain-v6.mjs
game-scenes.json
scenes/game.json
runner-tuning.json
kit-composition.json
kit-cutover-inventory.json
.agent/README.md
.agent/kit-registry.json
LuminaryLabs-Dev/LuminaryLabs:repo-ledger/LuminaryLabs-Publish/PhantomCommand.md
LuminaryLabs-Dev/LuminaryLabs:repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
```

## Current Interaction Loop

```txt
load index.html
-> import src/runtime.mjs
-> import src/runtime-terrain-v6.mjs
-> load Three.js from jsDelivr
-> load Rapier from jsDelivr
-> load rapier-physics-domain-kit from NexusRealtime-ProtoKits CDN
-> create DOM shell, HUD, button, scene, camera, renderer, lights, terrain, scatter, pickups, raptor rig, and physics bridge
-> create app state with scene = menu
-> button / Enter / Space outside game starts the rush
-> active game reads raw input booleans
-> tick yaw, speed, boost, gravity, jump height, distance, best distance, terrain sample, terrain chunk rebuilds, scatter population, Rapier actor transform, contact checks, pickups, win distance, camera, raptor pose, HUD
-> hazard contact mutates scene to run-over
-> target distance mutates scene to win
-> expose globalThis.PrehistoricRushHost.getState()
```

## Intended Player Loop

```txt
menu
-> start rush
-> read terrain, route, hazards, pickups, speed, and jump windows
-> steer left / right
-> boost when safe
-> jump hazards
-> collect shards
-> avoid trees and rocks
-> survive rising speed and density
-> hit hazard and enter run-over, or reach target distance and enter win
-> retry / return to menu / run again
```

## Recommended Service Loop

```txt
load manifest authority
-> validate game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, and kit-cutover-inventory.json
-> normalize scene ids and result aliases
-> create scene authority reducer
-> convert button, keyboard, future touch, and fixture commands into ActionFrame records
-> accept or reject ActionFrame records by current scene
-> emit SceneDispatchResult for start, retry, menu, run-over, win, and again
-> tick runner state from accepted frames only
-> contact bridge emits ContactEvent records for hazard-hit, shard-pickup, and distance-goal
-> scene authority consumes ContactEvent records and returns explicit SceneDispatchResult
-> snapshot scene, input, contact, replay, runner, terrain, physics, config, and kit status
-> fixture harness replays ActionFrame + ContactEvent journals and asserts parity
```

## Domains In Use

```txt
static-browser-shell
module-runtime-entry
cdn-dependency-loading
three-render-host
rapier-runtime-bridge
rapier-physics-domain-kit-adapter
manifest-authority
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
action-replay-domain
scripted-action-fixture
runner-tuning-authority
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
contact-snapshot-contract
replay-snapshot-contract
kit-status-reporting
smoke-fixture-runtime
tuning-parity-smoke
scene-result-smoke
action-acceptance-smoke
contact-result-smoke
replay-parity-smoke
```

## Kits Identified

### Current Explicit Runtime / CDN Kits

```txt
rapier-physics-domain-kit
```

### Target Core Kits Referenced by Config

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

### Existing ProtoKit Families To Consume First

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

### Missing ProtoKit Candidate

```txt
run-movement-kit
```

### Repo-Local Kits Implied by Source

```txt
prehistoric-rush-static-shell-kit
prehistoric-rush-runtime-entry-kit
prehistoric-rush-cdn-loader-kit
prehistoric-rush-manifest-loader-kit
prehistoric-rush-scene-id-catalog-kit
prehistoric-rush-scene-result-alias-kit
prehistoric-rush-scene-authority-reducer-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-action-frame-replay-kit
prehistoric-rush-input-diagnostics-journal-kit
prehistoric-rush-scripted-action-fixture-kit
prehistoric-rush-three-render-host-kit
prehistoric-rush-terrain-stream-kit
prehistoric-rush-terrain-sampler-kit
prehistoric-rush-ground-collider-kit
prehistoric-rush-prop-scatter-kit
prehistoric-rush-pickup-scatter-kit
prehistoric-rush-hazard-descriptor-kit
prehistoric-rush-contact-event-contract-kit
prehistoric-rush-contact-result-snapshot-kit
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
prehistoric-rush-replay-snapshot-contract-kit
prehistoric-rush-contact-result-smoke-kit
prehistoric-rush-scene-dispatch-smoke-kit
prehistoric-rush-replay-parity-smoke-kit
```

## Services The Kits Should Offer

```txt
manifestLoader.loadSceneGraph
manifestLoader.loadSceneFile
manifestLoader.loadRunnerTuning
manifestLoader.loadKitComposition
manifestLoader.loadCutoverInventory
manifestLoader.validateManifestShape
manifestLoader.publishConfigDiagnostics

sceneIdCatalog.listSceneIds
sceneIdCatalog.assertKnownScene
sceneIdCatalog.getEntryScene
sceneIdCatalog.getResultSceneIds

sceneResultAlias.resolveAlias
sceneResultAlias.assertCanonicalRunOver
sceneResultAlias.explainCompatibilityAlias
sceneResultAlias.publishAliasDiagnostics

sceneAuthority.createInitialSceneState
sceneAuthority.getCurrentScene
sceneAuthority.dispatch
sceneAuthority.startGame
sceneAuthority.retryRun
sceneAuthority.returnToMenu
sceneAuthority.requestRunOver
sceneAuthority.requestWin
sceneAuthority.runAgain
sceneAuthority.rejectUnknownSceneEvent
sceneAuthority.emitTransitionEvent
sceneAuthority.snapshot

sceneDispatchResult.accept
sceneDispatchResult.reject
sceneDispatchResult.serialize
sceneDispatchResult.reasonCode
sceneDispatchResult.publishDiagnostics

actionFrame.fromKeyboardEvent
actionFrame.fromButtonEvent
actionFrame.fromTouchEvent
actionFrame.fromFixtureCommand
actionFrame.serialize
actionFrame.accept
actionFrame.reject
actionFrame.snapshot

actionAcceptance.getSceneValidityMatrix
actionAcceptance.validateSceneAction
actionAcceptance.explainRejectedAction
actionAcceptance.acceptStart
actionAcceptance.acceptJump
actionAcceptance.acceptSteer
actionAcceptance.acceptBoost
actionAcceptance.acceptRetry
actionAcceptance.acceptMenu
actionAcceptance.acceptForcePickup
actionAcceptance.acceptForceRunOver
actionAcceptance.acceptForceWin

inputDiagnostics.appendRejectedFrame
inputDiagnostics.snapshotRejectedFrames
inputDiagnostics.clear
inputDiagnostics.publishInputDiagnostics

replayJournal.appendAcceptedFrame
replayJournal.appendContactEvent
replayJournal.snapshotAcceptedFrames
replayJournal.snapshotContactEvents
replayJournal.replayAcceptedFrames
replayJournal.assertReplayParity
replayJournal.publishReplayDiagnostics

runnerState.createState
runnerState.applyActionFrame
runnerState.tick
runnerState.snapshot
runnerState.persistBestDistance

contactEvent.fromHazardContact
contactEvent.fromShardPickup
contactEvent.fromDistanceGoal
contactEvent.serialize
contactEvent.accept
contactEvent.reject
contactEvent.snapshot

contactBridge.resolveHazardContact
contactBridge.resolveShardPickup
contactBridge.resolveDistanceGoal
contactBridge.requestRunOver
contactBridge.requestWin
contactBridge.emitContactEvents

contactSnapshot.serializeContacts
contactSnapshot.serializeLastContactEvent
contactSnapshot.serializePickupEvents
contactSnapshot.serializeImpactEvents
contactSnapshot.serializeGoalEvents

sceneSnapshot.serializeScene
sceneSnapshot.serializeRunner
sceneSnapshot.serializeTerrain
sceneSnapshot.serializePhysics
sceneSnapshot.serializeConfig
sceneSnapshot.serializeKitStatus

inputSnapshot.serializeCurrentInput
inputSnapshot.serializeAcceptedJournal
inputSnapshot.serializeRejectedJournal

replaySnapshot.serializeReplayState
replaySnapshot.serializeReplayFixture
replaySnapshot.serializeReplayResult

hostDiagnostics.getDiagnostics
hostDiagnostics.getSceneSnapshot
hostDiagnostics.getInputSnapshot
hostDiagnostics.getContactSnapshot
hostDiagnostics.getReplayJournal
hostDiagnostics.getKitStatus
hostDiagnostics.dispatch
hostDiagnostics.subscribe
hostDiagnostics.runSmoke
```

## Blockers / Mismatches

```txt
runtime-tuning-duplication:
  runner-tuning.json and scenes/game.json define product intent, but src/runtime-terrain-v6.mjs still owns inline speed, terrain, spawn, and win constants.

scene-result-name-mismatch:
  game-scenes.json uses run-over as canonical loss scene, while scenes/game.json still says nextOnLoss: fail.

scene-dispatch-gap:
  runtime mutates app.scene directly instead of returning explicit accepted/rejected SceneDispatchResult records.

contact-result-gap:
  hazard, pickup, and win checks mutate state directly without ContactEvent or ContactResult records.

space-key-semantic-overlap:
  Space starts outside gameplay and jumps inside gameplay; this needs scene-scoped ActionFrame acceptance metadata.

action-replay-gap:
  accepted input and contact events are not journaled, blocking deterministic smoke and future run-movement-kit promotion.

partial-gamehost-surface:
  PrehistoricRushHost.getState() exists, but stable dispatch, diagnostics, snapshots, replay, kit status, subscription, and smoke APIs are not available.

no-package-script-surface:
  No package.json was found in the inspected repo path, so validation should begin with static DOM-free smoke fixtures or source-level script harnesses.
```

## Next Recommended Slice

```txt
PrehistoricRush Scene Authority Dispatch + Contact Result Snapshot Fixture Cutover
```

### Build Order

```txt
keep index.html and src/runtime.mjs thin
-> keep current browser loop visually playable
-> add prehistoric-rush-manifest-loader-kit
-> load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> report config load success, fallback use, manifest drift, and tuning drift through diagnostics
-> add prehistoric-rush-scene-id-catalog-kit
-> assert menu, game, run-over, and win are the only canonical scene ids
-> add prehistoric-rush-scene-result-alias-kit
-> make run-over canonical and fail compatibility-only
-> add prehistoric-rush-scene-authority-reducer-kit
-> replace direct app.scene mutation paths with sceneAuthority.dispatch(event)
-> add prehistoric-rush-scene-dispatch-result-kit
-> return accepted=false for unknown scene, invalid transition, duplicate transition, and stale fixture event
-> add prehistoric-rush-action-frame-contract-kit
-> define ActionFrame fields: id, frame, time, scene, action, value, source, accepted, rejected, reason
-> add prehistoric-rush-action-acceptance-matrix-kit
-> route button, Enter, Space, left/right, boost, retry, menu, and run-again through ActionFrame validation
-> add prehistoric-rush-contact-event-contract-kit
-> convert hazard hit, shard pickup, and distance goal into ContactEvent records
-> add prehistoric-rush-contact-result-snapshot-kit
-> snapshot lastContactEvent, impactEvents, pickupEvents, goalEvents, and pendingSceneRequest
-> add accepted ActionFrame and ContactEvent journals
-> add rejected action and rejected dispatch diagnostics
-> expand PrehistoricRushHost into prehistoric-rush-gamehost-kit
-> expose getDiagnostics, getSceneSnapshot, getInputSnapshot, getContactSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and runSmoke
-> add DOM-free fixture scripts for start, space-start, jump, rejected-jump, hazard-run-over, pickup, win, retry, menu, and replay parity
-> defer terrain/render/raptor extraction until scene dispatch and contact result smoke pass
```

### Acceptance Targets

```txt
current browser runtime remains visually playable
PrehistoricRushHost.getState().scene starts as menu
scene ids are normalized to menu, game, run-over, and win
fail is accepted only as a compatibility alias and never published as canonical scene
button, Enter, and Space outside game create accepted start ActionFrame records
Space while game creates accepted jump ActionFrame records
jump outside game creates rejected ActionFrame diagnostics
hazard contact creates accepted ContactEvent and accepted SceneDispatchResult to run-over
shard pickup creates accepted ContactEvent without changing scene
win distance creates accepted ContactEvent and accepted SceneDispatchResult to win
retry and menu result actions are explicit scene dispatches
SceneDispatchResult records include accepted, reason, from, to, frame, source, and event id
ContactEvent records include accepted, reason, type, subject id, frame, position, and scene request
accepted ActionFrame and ContactEvent journals replay to the same scene/runner/contact snapshot
GameHost exposes diagnostics, scene snapshot, input snapshot, contact snapshot, replay journal, kit status, dispatch, subscribe, and runSmoke
smoke fixtures cover scene dispatch, action acceptance, action rejection, contact result, pickup, run-over, win, retry, menu, and replay parity
terrain, renderer, raptor, and Rapier bridge extraction remain out of scope until snapshot parity is stable
```

## Why This Comes Before Visual Extraction

The live visual stack is already good enough to support a playable proof. The fragile boundary is authority: scene mutations, contact outcomes, input semantics, result aliases, and host snapshots are still implicit. Extracting render or raptor kits first would preserve the ambiguity and make deterministic fixtures harder to add later.

The next cut should therefore make every player or contact outcome pass through an inspectable result contract before any large runtime split.

## Validation Notes

```txt
Documentation-only run.
No runtime source code changed.
No local build or test run was executed.
GitHub Pages deploy status was not inspected in this run.
```
