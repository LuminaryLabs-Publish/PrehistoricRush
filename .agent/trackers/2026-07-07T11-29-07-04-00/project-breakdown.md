# PrehistoricRush Project Breakdown

**Run timestamp:** `2026-07-07T11:29:07-04:00`

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Selected after:** `LuminaryLabs-Publish/PhantomCommand`

**Excluded:** `LuminaryLabs-Publish/TheCavalryOfRome`

## Selection reason

The central `LuminaryLabs-Dev/LuminaryLabs` ledger showed `LuminaryLabs-Publish/PhantomCommand` as the latest eligible Publish repo breakdown at `2026-07-07T11:18:32-04:00`.

`PrehistoricRush` is the next repo in the tracked Publish rotation, so this pass only documents `LuminaryLabs-Publish/PrehistoricRush` and does not touch any other Publish project.

## Current status

`PrehistoricRush` is a static browser runner repo. The active app path is still:

```txt
index.html
-> src/runtime.mjs
-> src/runtime-terrain-v6.mjs
-> Three.js CDN
-> Rapier CDN
-> rapier-physics-domain-kit CDN
-> browser shell / HUD / terrain / scatter / pickups / hazards / raptor rig / camera / physics bridge / PrehistoricRushHost
```

The runtime is playable, but `src/runtime-terrain-v6.mjs` is still a compact monolith. It owns inline tuning, DOM shell construction, module imports, terrain sampling, chunk rebuilding, scatter placement, pickup generation, hazard/contact checks, player state, keyboard semantics, scene transitions, raptor rigging, pose animation, camera following, HUD text, Rapier bridge calls, and the `PrehistoricRushHost.getState()` surface.

The design/config layer is already ahead of the runtime. `game-scenes.json`, `scenes/game.json`, `runner-tuning.json`, `kit-composition.json`, and `kit-cutover-inventory.json` describe the intended kit stack and runner behavior, but the live runtime still duplicates or bypasses much of that authority.

## Interaction loop

```txt
current runtime loop:
  load static page
  -> import active runtime module
  -> import Three.js, Rapier, and rapier-physics-domain-kit from CDN
  -> create DOM shell, status HUD, and Start Rush button
  -> create scene, sky, fog, lights, terrain chunks, raptor, rocks, shards, and tree instances
  -> create optional Rapier physics bridge
  -> start in menu scene
  -> click button / Enter / Space outside game starts run
  -> while game scene is active:
       read live input booleans
       update turn, yaw, speed, boost, jump, gravity, distance, and terrain height
       stream terrain chunks around runner
       repopulate trees, rocks, shards, and fixed colliders
       push actor transform into Rapier
       resolve physics contacts and manual collider hits
       collect shards
       transition to run-over on hit
       transition to win past target distance
       update raptor pose, camera, HUD, and renderer
  -> expose PrehistoricRushHost.getState()
```

```txt
intended player loop:
  menu
  -> start rush
  -> read route, hazards, pickups, and terrain
  -> steer / boost / jump
  -> collect shards
  -> avoid tree and rock hazards
  -> preserve speed through readable terrain
  -> hit hazard and enter run-over
  -> or reach target distance and enter win
  -> retry / return menu / run again
```

```txt
recommended service loop:
  manifest loader resolves game-scenes.json and scene files
  -> scene result alias service normalizes fail -> run-over compatibility
  -> input adapter emits candidate ActionFrame records
  -> input acceptance matrix accepts or rejects actions by current scene
  -> accepted actions enter replay journal
  -> rejected actions enter diagnostics journal
  -> scene-flow reducer consumes accepted scene commands
  -> runner-state reducer consumes accepted movement commands
  -> contact bridge emits pickup, impact, run-over, and win requests
  -> snapshot contract serializes scene, runner, input, replay, terrain, physics, config, and kit status
  -> smoke fixtures replay the same accepted action journal without DOM-only state
```

## Domains identified

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
scene-result-aliasing
scene-flow-reducer
scene-transition-request
scene-scoped-input-policy
raw-keyboard-input
button-input
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
contact-bridge
collision-result-policy
run-over-result-policy
win-result-policy
raptor-visual-rig
raptor-pose-animation
camera-follow
hud-diagnostics
host-diagnostics-contract
scene-snapshot-contract
input-snapshot-contract
replay-snapshot-contract
kit-status-reporting
smoke-fixture-runtime
tuning-parity-smoke
scene-result-smoke
replay-parity-smoke
```

## Current explicit kits and dependencies

```txt
rapier-physics-domain-kit
```

The repo consumes `rapier-physics-domain-kit` live from the ProtoKits CDN. The runner does not yet have a shared `run-movement-kit`; movement logic is still local inside `src/runtime-terrain-v6.mjs`.

## Target core kits referenced by manifests

```txt
core-skybox
core-scene
core-input
core-motion
core-camera
core-graphics
core-animation
core-ui
core-diagnostics
core-composition
run-movement-kit
```

## Repo-local kits currently implied by source

```txt
prehistoric-rush-static-shell-kit
prehistoric-rush-runtime-entry-kit
prehistoric-rush-cdn-loader-kit
prehistoric-rush-three-render-host-kit
prehistoric-rush-rapier-bridge-kit
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

## Immediate next-cut kits

```txt
prehistoric-rush-manifest-loader-kit
prehistoric-rush-scene-result-alias-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-action-frame-replay-kit
prehistoric-rush-input-diagnostics-journal-kit
prehistoric-rush-scripted-action-fixture-kit
prehistoric-rush-scene-snapshot-contract-kit
prehistoric-rush-input-snapshot-contract-kit
prehistoric-rush-replay-snapshot-contract-kit
prehistoric-rush-host-diagnostics-contract-kit
prehistoric-rush-scene-result-smoke-kit
prehistoric-rush-action-acceptance-smoke-kit
prehistoric-rush-replay-parity-smoke-kit
```

## Services the kits should offer

```txt
manifestLoader.loadSceneGraph
manifestLoader.loadSceneFile
manifestLoader.loadRunnerTuning
manifestLoader.loadKitComposition
manifestLoader.loadCutoverInventory
manifestLoader.validateManifestShape
manifestLoader.publishConfigDiagnostics

sceneResultAlias.resolveAlias
sceneResultAlias.assertCanonicalRunOver
sceneResultAlias.explainCompatibilityAlias
sceneResultAlias.publishAliasDiagnostics

sceneFlow.getCurrentScene
sceneFlow.transition
sceneFlow.startGame
sceneFlow.requestRunOver
sceneFlow.requestWin
sceneFlow.retryRun
sceneFlow.returnToMenu
sceneFlow.emitTransitionEvent

actionFrame.fromKeyboardEvent
actionFrame.fromButtonEvent
actionFrame.fromTouchEvent
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

replayJournal.appendAcceptedFrame
replayJournal.snapshotAcceptedFrames
replayJournal.replayAcceptedFrames
replayJournal.assertReplayParity

runnerState.createState
runnerState.applyActionFrame
runnerState.tick
runnerState.snapshot
runnerState.persistBestDistance

contactBridge.resolveHazardContact
contactBridge.resolveShardPickup
contactBridge.requestRunOver
contactBridge.requestWin
contactBridge.emitContactEvents

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

hostDiagnostics.getDiagnostics
hostDiagnostics.getSceneSnapshot
hostDiagnostics.getInputSnapshot
hostDiagnostics.getReplayJournal
hostDiagnostics.getKitStatus
hostDiagnostics.dispatch
hostDiagnostics.subscribe
hostDiagnostics.runSmoke

smoke.assertMenuStart
smoke.assertSpaceStartsMenu
smoke.assertSpaceJumpsGame
smoke.assertFailAliasRunOver
smoke.assertRejectedActionDiagnostics
smoke.assertForcedPickup
smoke.assertForcedRunOver
smoke.assertForcedWin
smoke.assertReplayParity
```

## Key blocker

The current runner can be played, but it cannot be reliably tested or promoted because input is live mutable state, scene/action validity is implicit, rejected inputs are not represented, accepted actions are not replayable, and the debug host exposes only a partial runtime state.

This blocks safe extraction into a future `run-movement-kit` because there is no deterministic action journal or fixture harness proving equivalent behavior.

## Recommended next work

**Build target:** `PrehistoricRush Manifest Authority + Action Acceptance Fixture Cutover`

```txt
keep index.html and src/runtime.mjs thin
  -> create prehistoric-rush-manifest-loader-kit
  -> load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
  -> report config load success, fallback use, and manifest drift through diagnostics
  -> create prehistoric-rush-scene-result-alias-kit
  -> keep run-over as the canonical loss scene
  -> treat fail as a compatibility alias only
  -> create prehistoric-rush-action-frame-contract-kit
  -> create prehistoric-rush-action-acceptance-matrix-kit
  -> explicitly accept/reject actions by scene
  -> guarantee Space starts only outside game and jumps only in game
  -> journal accepted frames separately from rejected diagnostics
  -> add scripted fixtures for start, space-start, space-jump, rejected jump, retry, menu, forced pickup, forced run-over, forced win, and replay parity
  -> expand PrehistoricRushHost into a stable diagnostics/snapshot surface
  -> defer terrain/render/raptor extraction until fixture parity exists
```

## Minimum checklist

- [ ] Existing browser loop remains playable.
- [ ] `run-over` is canonical; `fail` is compatibility-only.
- [ ] Manifest loader reports `game-scenes.json`, `scenes/game.json`, `runner-tuning.json`, `kit-composition.json`, and `kit-cutover-inventory.json` status.
- [ ] Every button, keyboard, and future touch action becomes an `ActionFrame`.
- [ ] `ActionFrame` records include `frame`, `time`, `scene`, `action`, `value`, `source`, `accepted`, `rejected`, and `reason`.
- [ ] Invalid scene/action pairs are rejected with diagnostics.
- [ ] Accepted action frames are replayable.
- [ ] `PrehistoricRushHost` exposes diagnostics, scene snapshot, input snapshot, replay journal, kit status, dispatch, subscribe, and smoke command surfaces.
- [ ] Smoke fixtures cover menu start, Space start, Space jump, rejected input, forced pickup, forced run-over, forced win, and replay parity.

## Validation status

No runtime source code changed in this documentation pass.

No local build or test run was executed in this documentation pass.
