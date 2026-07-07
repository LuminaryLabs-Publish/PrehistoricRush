# PrehistoricRush Project Breakdown

**Run timestamp:** `2026-07-07T15-29-27-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Default branch:** `main`

**Selected repo:** `PrehistoricRush`

**Excluded repo:** `LuminaryLabs-Publish/TheCavalryOfRome`

## Selection note

The central repo ledger was checked first. `LuminaryLabs-Publish/PrehistoricRush` was the oldest eligible tracked non-Cavalry Publish repo by latest central review timestamp among the accessible Publish repos checked.

Latest eligible ledger timestamps checked:

```txt
PrehistoricRush  2026-07-07T14:11:48-04:00
MyCozyIsland     2026-07-07T14:21:20-04:00
IntoTheMeadow    2026-07-07T14:28:17-04:00
ZombieOrchard    2026-07-07T14:40:17-04:00
HorrorCorridor   2026-07-07T14:51:44-04:00
TheOpenAbove     2026-07-07T15:11:23-04:00
PhantomCommand   2026-07-07T15:19:05-04:00
AetherVale       2026-07-07T16:29:18-04:00
```

The `AetherVale` ledger contains a later timestamp than the current automation clock, but the selection policy still treats the literal central ledger values as source truth and chooses the oldest eligible timestamp.

## Current repo read

`PrehistoricRush` is a standalone static browser publish repo for a NexusEngine-powered prehistoric infinite runner. It is playable through `index.html -> src/runtime.mjs -> src/runtime-terrain-v6.mjs`.

The project intent is already correct: keep the product repo thin and move reusable behavior into NexusEngine core kits or ProtoKits. The repo should own the shell, manifests, theme/config data, renderer bootstrap, adapter bindings, debug host, and repo-local smoke fixtures.

The blocker is still authority concentration in `src/runtime-terrain-v6.mjs`. That file owns CDN imports, fallback loading, DOM shell, HUD, Three.js setup, procedural terrain, raptor mesh/animation, scatter placement, pickup placement, physics bridge, keyboard input state, runner integration, contact checks, scene mutation, win/loss decisions, camera follow, and `PrehistoricRushHost` snapshots.

## Source evidence reviewed

```txt
README.md
index.html
src/runtime.mjs
src/runtime-terrain-v6.mjs
game-scenes.json
scenes/menu.json
scenes/game.json
scenes/run-over.json
scenes/win.json
runner-tuning.json
kit-composition.json
kit-cutover-inventory.json
.agent/README.md
.agent/kit-registry.json
LuminaryLabs-Dev/LuminaryLabs repo-ledger entries
```

## Current interaction loop

```txt
index.html
  -> #app mount
  -> src/runtime.mjs
  -> src/runtime-terrain-v6.mjs
  -> import Three.js from jsDelivr
  -> import Rapier from jsDelivr
  -> import rapier-physics-domain-kit from ProtoKits CDN
  -> create DOM shell, HUD, and Start Rush button
  -> create Three.js renderer / scene / camera / lights / fog
  -> create procedural terrain chunks
  -> create procedural raptor visual rig
  -> create rock, shard, and tree instanced meshes
  -> create Rapier physics bridge and kinematic dino actor
  -> initialize app state with scene=menu
  -> bind button and keyboard listeners
  -> requestAnimationFrame(loop)
  -> if scene=game, mutate runner state from raw input booleans
  -> rebuild terrain/scatter as chunks change
  -> push actor transform into Rapier bridge
  -> detect hazard contacts, shard contacts, and distance goal inline
  -> mutate app.scene directly to run-over or win
  -> update camera, HUD, button label, and renderer
  -> expose globalThis.PrehistoricRushHost.getState()
```

## Intended player loop

```txt
menu
  -> start run
  -> steer left/right through dense prehistoric terrain
  -> optionally boost
  -> jump over or past hazards
  -> collect crystal shards
  -> avoid tree/rock contacts
  -> advance distance toward goal threshold
  -> on hit, enter run-over and retry/menu
  -> on distance goal, enter win and run again/menu
```

## Target service loop

```txt
load manifests
  -> validate scene ids, scene files, runner tuning, kit composition, and cutover inventory
  -> adapt runner-tuning.json into runtime tuning
  -> publish tuning drift diagnostics
  -> normalize raw button/keyboard input into ActionFrame records
  -> apply scene-scoped action acceptance matrix
  -> reduce runner state through RunnerStepResult
  -> emit RunnerEvent records for movement, jump, boost, rebuild, pickup, impact, goal, and scene request
  -> reduce ContactEvent records into ContactResult snapshots
  -> dispatch scene changes only through SceneDispatchResult
  -> journal accepted/rejected actions and contacts
  -> expose stable host snapshots and replay journals
  -> run DOM-free parity fixtures before extracting terrain/render/raptor/Rapier services
```

## Domains in use

### Shell and boot domains

- Static browser shell
- Module runtime entry
- CDN dependency loading
- Import fallback diagnostics
- DOM mount ownership
- HUD panel ownership
- Button adapter ownership
- Resize adapter ownership
- Debug host exposure

### Manifest and source-of-truth domains

- Manifest authority
- Scene graph authority
- Scene file authority
- Scene id catalog
- Scene transition map
- Scene result aliasing
- Runner tuning authority
- Runtime tuning adapter
- Tuning drift diagnostics
- Kit composition authority
- Cutover inventory authority
- Flock generation descriptor authority

### Input and action domains

- Raw keyboard input
- Button input
- Future touch input adapter
- Scene-scoped action policy
- ActionFrame contract
- ActionFrame acceptance matrix
- ActionFrame rejection reasons
- Accepted action journal
- Rejected action diagnostics
- Replayable action intake

### Scene authority domains

- Menu scene
- Game scene
- Run-over result scene
- Win result scene
- Scene transition request
- Scene authority reducer
- SceneDispatchResult contract
- Invalid transition rejection
- Duplicate transition rejection
- Compatibility alias rejection

### Runner domains

- Runner source state
- Runner fixed-step/update-step state
- Forward velocity
- Boost policy
- Turn/yaw policy
- Jump policy
- Gravity policy
- Grounded state
- Distance scoring
- Best-distance persistence
- Shard count
- Speed ramp policy
- RunnerStepResult contract
- RunnerEvent contract
- Runner event journal

### Terrain and world domains

- Infinite terrain chunk streaming
- Terrain sampling
- Heightfield generation
- Height band coloring
- Chunk rebuild policy
- Scatter placement
- Clear radius policy
- Tree placement
- Rock placement
- Shard placement
- Collider descriptor generation
- Instanced mesh budget

### Contact/result domains

- Rapier bridge contact data
- Fallback geometric contact checks
- Hazard descriptor generation
- Pickup descriptor generation
- Hazard contact policy
- Pickup contact policy
- Distance-goal policy
- ContactEvent contract
- ContactResult snapshot
- Run-over request policy
- Win request policy
- Pending scene request projection

### Render and presentation domains

- Three.js renderer host
- Scene/camera/lights/fog
- Sky dome
- Procedural terrain mesh
- Raptor visual rig
- Raptor pose animation
- Tree object pools
- Rock/shard instanced renderers
- Camera follow
- HUD diagnostics
- Button state projection

### Physics domains

- Rapier runtime bridge
- Rapier physics domain kit adapter
- Kinematic actor registration
- Actor transform publication
- Fixed collider publication
- Physics step snapshot
- Fallback physics state

### Diagnostics and fixture domains

- Host diagnostics contract
- Scene snapshot contract
- Input snapshot contract
- Runner snapshot contract
- Contact snapshot contract
- Replay snapshot contract
- Kit status reporting
- DOM-free fixture runtime
- Tuning parity smoke
- Scene alias smoke
- Action acceptance smoke
- Runner step smoke
- Contact event smoke
- Replay parity smoke

## Kits identified

### Current explicit/live kits

```txt
rapier-physics-domain-kit
```

Live services observed:

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

### Core kits targeted by existing manifests

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

### First missing ProtoKit

```txt
run-movement-kit
```

Candidate services:

```txt
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

### Repo-local extraction candidates

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
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-step-result-kit
prehistoric-rush-runner-event-contract-kit
prehistoric-rush-runner-event-journal-kit
prehistoric-rush-contact-event-contract-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-gamehost-kit
prehistoric-rush-replay-fixture-kit
prehistoric-rush-dom-free-smoke-kit
```

## Services kits should offer

### `prehistoric-rush-manifest-loader-kit`

- Load `game-scenes.json`.
- Load every `scenes/*.json` listed by the scene graph.
- Load `runner-tuning.json`.
- Load `kit-composition.json`.
- Load `kit-cutover-inventory.json`.
- Load `flock-generation.json`.
- Validate required ids, versions, and known fields.
- Publish config load success/failure.
- Publish fallback use and missing-file diagnostics.

### `prehistoric-rush-runtime-tuning-adapter-kit`

- Map `runner-tuning.json.motion` into runtime motion values.
- Map `runner-tuning.json.camera` into camera values.
- Map `runner-tuning.json.terrain` into terrain generation values.
- Map `runner-tuning.json.streaming` into future route/segment services.
- Map `runner-tuning.json.rules` into safety validation services.
- Compare live fallback values against manifest values.
- Emit deterministic tuning drift report.

### `prehistoric-rush-scene-authority-reducer-kit`

- Own canonical scene ids.
- Own valid transitions.
- Treat `fail` as compatibility alias only.
- Reject unknown scenes.
- Reject invalid transitions.
- Reject duplicate transitions unless explicitly idempotent.
- Return `SceneDispatchResult` records.
- Publish latest scene request and result.

### `prehistoric-rush-action-frame-contract-kit`

- Normalize button, keyboard, fixture, and future touch actions.
- Emit action id, frame, time, source, scene, action, value, accepted, rejected, and reason.
- Preserve raw input only as adapter detail.
- Store accepted and rejected action journals separately.
- Make jump/start/retry/menu/run-again semantics scene-scoped.

### `prehistoric-rush-runner-step-result-kit`

- Take prior runner state, dt, tuning, accepted actions, terrain sampler, and contact inputs.
- Return movement delta, speed delta, yaw delta, jump state, grounded state, consumed actions, rejected actions, diagnostics, and emitted events.
- Make `jump` consumption explicit.
- Make boost/turn effects explicit.
- Keep no-DOM parity possible.

### `prehistoric-rush-runner-event-contract-kit`

- Emit deterministic events for start, jump, boost, steering, terrain chunk rebuild, scatter rebuild, pickup contact, hazard contact, goal threshold, and scene request.
- Include event id, frame, time, scene, runner position, and related source ids.
- Provide replay-friendly ordering.
- Feed host diagnostics and smoke fixtures.

### `prehistoric-rush-contact-event-contract-kit`

- Convert Rapier contacts and fallback geometric contacts into one contact event shape.
- Distinguish hazard, pickup, and goal contacts.
- Include collider/pickup ids when available.
- Include accepted/rejected result state.
- Emit pending scene request instead of mutating scene directly.

### `prehistoric-rush-gamehost-kit`

- Preserve `PrehistoricRushHost.getState()` compatibility.
- Add `getDiagnostics()`.
- Add `getSceneSnapshot()`.
- Add `getInputSnapshot()`.
- Add `getRunnerSnapshot()`.
- Add `getContactSnapshot()`.
- Add `getReplayJournal()`.
- Add `getKitStatus()`.
- Add `dispatch(action)`.
- Add `runSmoke(name)`.

## Key findings

- `src/runtime.mjs` is already thin enough and should stay that way.
- `README.md` correctly says the repo should stay thin and reusable behavior should move into core kits or ProtoKits.
- `game-scenes.json` already defines the canonical menu/game/run-over/win scene order and transition map.
- `scenes/game.json` still declares `nextOnLoss: fail`, which conflicts with canonical `run-over`.
- `runner-tuning.json` defines intended motion, camera, terrain, streaming, and rule tuning.
- `src/runtime-terrain-v6.mjs` still uses inline tuning values that drift from `runner-tuning.json`.
- The live runtime still mutates `app.scene` directly for hit and distance goal paths.
- Raw input booleans are not journaled as accepted/rejected actions.
- Jump input is consumed by setting `app.input.jump = false`, but there is no result record.
- Hazard contacts, pickup contacts, and win threshold events are not represented as durable `ContactEvent` or `RunnerEvent` records.
- `PrehistoricRushHost.getState()` exists but does not yet expose diagnostics, snapshots, dispatch, smoke, or replay journal services.
- Terrain/render/raptor extraction should stay deferred until manifest, action, runner step, contact, and replay contracts exist.

## Recommended next work

1. Preserve the current playable browser behavior.
2. Add a manifest loader before runtime setup.
3. Adapt `runner-tuning.json` into the runtime config path.
4. Make inline tuning fallback-only.
5. Add tuning drift diagnostics.
6. Normalize `fail` to canonical `run-over` through an alias result.
7. Replace direct `app.scene` mutation with scene dispatch results.
8. Normalize Start, Enter, Space, left/right, boost, retry, menu, and run-again into `ActionFrame` records.
9. Add scene-scoped accepted/rejected action reasons.
10. Move the runner tick into a pure-ish `RunnerStepResult` boundary.
11. Emit `RunnerEvent` records for movement and transition-relevant facts.
12. Convert hazard, pickup, and goal outcomes into `ContactEvent` records.
13. Add host diagnostics and stable snapshots.
14. Add DOM-free fixture scripts for tuning parity, scene aliases, action acceptance, runner step output, contacts, and replay parity.
15. Only then extract terrain streaming, render adapters, raptor animation, and Rapier bridge ownership.

## Suggested next vertical slice

**Build target:** `PrehistoricRush RunnerStep Authority + ContactEvent Replay Fixture Cutover`

```txt
preserve index.html and src/runtime.mjs
  -> preserve current visual Three.js/Rapier playable loop
  -> add prehistoric-rush-manifest-loader-kit
  -> load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json before runtime setup
  -> add prehistoric-rush-runtime-tuning-adapter-kit
  -> map manifest tuning into live runtime values
  -> mark inline tuning fallback-only
  -> publish manifest/tuning drift diagnostics
  -> add prehistoric-rush-scene-id-catalog-kit
  -> keep menu, game, run-over, and win canonical
  -> add prehistoric-rush-scene-result-alias-kit
  -> normalize fail to run-over as compatibility-only alias
  -> add prehistoric-rush-action-frame-contract-kit
  -> route button and keyboard inputs through ActionFrame acceptance
  -> add prehistoric-rush-runner-step-result-kit
  -> isolate speed, yaw, boost, jump, gravity, terrain sample, and distance updates into one reducer result
  -> add prehistoric-rush-runner-event-contract-kit
  -> emit deterministic runner events from step results
  -> add prehistoric-rush-contact-event-contract-kit
  -> convert hazard hit, shard pickup, and distance goal into ContactEvent records
  -> add prehistoric-rush-contact-result-snapshot-kit
  -> request scene transitions from contacts instead of mutating app.scene directly
  -> expand PrehistoricRushHost with diagnostics, snapshots, dispatch, smoke, and replay journal helpers
  -> add DOM-free fixture smoke for tuning parity, scene aliasing, start, jump, rejected jump, hazard run-over, pickup, win, retry, menu, runner-event replay, contact replay, and replay parity
  -> defer terrain/render/raptor/Rapier extraction until these fixtures pass
```

## Acceptance target

```txt
src/runtime.mjs remains a thin import entry
current browser runner still starts, runs, hits, collects, wins, retries, and renders
manifest loader reports loaded, fallback, and failed states
runtime tuning can be traced back to runner-tuning.json
inline tuning is only fallback data
fail alias is accepted as input but never written as canonical scene state
all scene changes return SceneDispatchResult records
button and keyboard inputs emit ActionFrame records
jump accepted/rejected state is explicit
RunnerStepResult is produced for each fixture tick
RunnerEvent journal is deterministic for fixture runs
hazard hit emits ContactEvent and pending run-over scene request
shard pickup emits ContactEvent and increments shard count once
win threshold emits ContactEvent or RunnerEvent and pending win scene request
PrehistoricRushHost exposes diagnostics and replay journal helpers
DOM-free smoke covers manifest, scene, action, runner, contact, and replay parity paths
terrain/render/raptor/Rapier extraction remains out of scope for this slice
```

## Validation notes

No runtime source code changed in this documentation pass.

No local build or smoke test was executed in this documentation pass.
