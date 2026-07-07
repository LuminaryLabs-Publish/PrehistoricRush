# PrehistoricRush Runtime Authority / Contact Replay Breakdown

**Repo:** `LuminaryLabs-Publish/PrehistoricRush`

**Run timestamp:** `2026-07-07T15:28:31-04:00`

**Selected because:** the central ledger showed `LuminaryLabs-Publish/PrehistoricRush` as the next oldest eligible tracked non-Cavalry Publish repo after the latest PhantomCommand pass. `LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by rule.

## Summary

`PrehistoricRush` is still a thin static shell wrapped around a monolithic active runtime. `index.html` mounts `#app` and imports `src/runtime.mjs`; `src/runtime.mjs` imports `src/runtime-terrain-v6.mjs`; the active runtime imports Three.js, Rapier, and `rapier-physics-domain-kit`, then owns UI creation, terrain streaming, scatter, raptor rigging, camera, input, scene mutation, collision/contact outcomes, HUD, and `globalThis.PrehistoricRushHost` inline.

The repo has enough manifest intent to become cleaner now. `game-scenes.json`, `scenes/game.json`, `runner-tuning.json`, `kit-composition.json`, and `kit-cutover-inventory.json` define the desired scene graph, runner feel, kit stack, and cutover inventory, but the runtime still treats these as documentation instead of source authority.

## Reviewed source files

```txt
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
LuminaryLabs-Dev/LuminaryLabs:repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
```

## Current interaction loop

```txt
load index.html
  -> mount <main id="app">
  -> import ./src/runtime.mjs
  -> import ./runtime-terrain-v6.mjs
  -> load Three.js from jsDelivr
  -> load Rapier from jsDelivr
  -> load rapier-physics-domain-kit from ProtoKits CDN
  -> create shell DOM, status panel, and Start Rush button
  -> create Three.js scene, renderer, camera, sky, lights, fog
  -> create terrain chunk grid and height sampler
  -> create procedural raptor rig
  -> create instanced rocks, shards, and five tree pools
  -> create optional Rapier physics bridge and kinematic dino actor
  -> create app state with scene="menu"
  -> bind button and keyboard listeners
  -> requestAnimationFrame(loop)
```

```txt
menu loop:
  button click / Enter / Space
  -> direct app.scene = "game"
```

```txt
game loop:
  read live boolean input state
  -> mutate turn, yaw, speed, jump velocity, jump height, x/z, distance, best
  -> sample terrain height
  -> update/rebuild terrain chunks
  -> repopulate trees, rocks, shards, colliders, pickups
  -> push actor transform into Rapier bridge
  -> step physics
  -> test hazard contacts
  -> direct app.scene = "run-over" on hit
  -> test pickup contacts
  -> mutate collected/shards and repopulate
  -> direct app.scene = "win" after distance threshold
  -> animate raptor pose
  -> update follow camera
  -> update HUD HTML
  -> render frame
```

```txt
host loop:
  globalThis.PrehistoricRushHost.getState()
  -> returns scene, raw runner state, physics snapshot, terrain chunk count, renderer marker
```

## Intended player loop

```txt
start from menu
  -> run forward through procedural prehistoric terrain
  -> steer left/right freely
  -> boost forward
  -> jump over contact windows
  -> collect shards
  -> avoid trees/rocks/hazards
  -> hit hazard and enter run-over
  -> retry or return to menu
  -> reach target distance and enter win
  -> run again or return to menu
```

## Target service loop

```txt
manifest-loader loads root and scene manifests
  -> runtime-tuning-authority resolves runner-tuning.json into runtime constants
  -> tuning-drift-diagnostics reports manifest/runtime parity
  -> scene-id-catalog validates menu/game/run-over/win
  -> scene-result-alias resolves fail -> run-over compatibility only
  -> action-frame-contract normalizes button/key/touch/fixture input
  -> action-acceptance-policy accepts/rejects input by scene and frame
  -> runner-step-result computes movement and jump/boost/steer outcomes
  -> runner-event-envelope emits movement, chunk, pickup, hazard, win, and scene-request events
  -> contact-event-contract serializes hazard/pickup/goal outcomes
  -> scene-dispatch-result accepts or rejects transitions
  -> replay-journal records accepted frames, runner events, contact events, scene results
  -> GameHost exposes diagnostics, snapshots, dispatch, subscribe, replay, and runSmoke helpers
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
manifest-shape-validation
manifest-drift-diagnostics
runner-tuning-authority
runtime-tuning-adapter
scene-graph-authority
scene-file-authority
scene-id-catalog
scene-result-aliasing
scene-authority-reducer
scene-transition-request
scene-dispatch-result-contract
scene-dispatch-rejection-policy
scene-scoped-input-policy
button-input
keyboard-input
touch-input-adapter-future
fixture-command-input
action-frame-contract
action-frame-acceptance-policy
action-frame-rejection-policy
action-frame-journal
runner-step-contract
runner-step-result-contract
runner-event-envelope-contract
runner-event-journal
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
goal-contact-policy
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
runner-step-smoke
runner-event-replay-smoke
contact-result-smoke
replay-parity-smoke
```

## Current services observed

```txt
index.html
  - owns static root mount
  - owns module script inclusion
  - owns initial document metadata

src/runtime.mjs
  - owns active runtime import only

src/runtime-terrain-v6.mjs
  - load(url)
  - shell()
  - createGrid()
  - createTerrain()
  - heightAt()
  - colorFor()
  - hash()
  - mat()
  - mesh()
  - outline()
  - capsuleBetween()
  - makeRaptor()
  - animateRaptor()
  - treePools()
  - sky()
  - setup()
  - state()
  - populate()
  - createPhysics()
  - main()
  - loop(now)
  - globalThis.PrehistoricRushHost.getState()
```

## Existing explicit kits

```txt
rapier-physics-domain-kit
  source: CDN from LuminaryLabs-Agents/NexusRealtime-ProtoKits
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

## Target core kits already requested

```txt
createCoreSkyboxKit
  services: sky preset state, sky descriptors, background readability

createCoreSceneKit
  services: scene graph, scene identity, scene recipes, transition ownership, result aliases

createCoreInputKit
  services: input intent mapping, keyboard/touch/button ingestion, ActionFrame emission

createCoreMotionKit
  services: generic motion descriptors, controller output bridge, motion state publishing

createCoreCameraKit
  services: camera target descriptors, follow lag, look-ahead, FOV response, impact shake

createCoreGraphicsKit
  services: renderer descriptors, material descriptors, lighting descriptors, render-layer contracts

createCoreAnimationKit
  services: pose descriptors, animation phase descriptors, secondary motion descriptors

createCoreUIKit
  services: menu descriptors, HUD descriptors, run-over/win descriptors, button labels

createCoreDiagnosticsKit
  services: import fallback diagnostics, manifest drift diagnostics, scene diagnostics, kit status, smoke output

createCoreCompositionKit
  services: installed kit graph, dependency map, provides map, composition diagnostics
```

## Existing ProtoKit families to use before inventing local systems

```txt
course-direction / route-clearance family
  services: forward route constraints, lane availability, look-ahead safety, never-block-all-lanes validation

race-pacing family
  services: speed curve, difficulty ramp, density budget, relief pacing

race-hazard family
  services: hazard descriptors, hazard spawn bands, hazard readability

racer-contact family
  services: hazard contact, pickup contact, impact events, result transition requests

flock-agent family
  services: separation, alignment, cohesion, goal seek, interpolation

vegetation-placement / scatter-placement / terrain-ground-contact family
  services: terrain-bound scatter, clear radius, seeded placement, ground contact

vegetation-lod / instanced-batch family
  services: instance budgets, culling, batch descriptors, near/mid/far tiers

configurable-render-layer family
  services: readability layers, foreground/background grouping, pickup visibility, hazard prominence

material / lighting descriptor family
  services: palette, terrain bands, fog, sun, emissive pickup material
```

## Missing shared kit

```txt
run-movement-kit
  reason: no current shared kit owns runner motion, speed ramp, boost, jump buffer/coyote timing, accepted action consumption, RunnerStepResult, and motion/animation descriptors as one reusable contract.

  candidate services:
    createRunnerController
    applyActionFrame
    applyInputIntent
    bufferJump
    resolveCoyoteWindow
    tickFixedStep
    emitRunnerStepResult
    emitRunnerEvent
    emitMotionDescriptor
    emitAnimationPhaseDescriptor
    snapshot
```

## Repo-local next-cut kits

```txt
prehistoric-rush-manifest-loader-kit
prehistoric-rush-runtime-tuning-adapter-kit
prehistoric-rush-manifest-drift-diagnostics-kit
prehistoric-rush-scene-id-catalog-kit
prehistoric-rush-scene-result-alias-kit
prehistoric-rush-scene-authority-reducer-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-input-diagnostics-journal-kit
prehistoric-rush-runner-step-result-kit
prehistoric-rush-runner-event-envelope-kit
prehistoric-rush-runner-event-reducer-kit
prehistoric-rush-runner-event-journal-kit
prehistoric-rush-contact-event-contract-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-action-frame-replay-kit
prehistoric-rush-gamehost-kit
prehistoric-rush-host-diagnostics-contract-kit
prehistoric-rush-scene-snapshot-contract-kit
prehistoric-rush-input-snapshot-contract-kit
prehistoric-rush-runner-snapshot-contract-kit
prehistoric-rush-contact-snapshot-contract-kit
prehistoric-rush-replay-snapshot-contract-kit
prehistoric-rush-scripted-action-fixture-kit
prehistoric-rush-scene-result-smoke-kit
prehistoric-rush-tuning-parity-smoke-kit
prehistoric-rush-action-acceptance-smoke-kit
prehistoric-rush-runner-step-smoke-kit
prehistoric-rush-runner-event-replay-smoke-kit
prehistoric-rush-contact-result-smoke-kit
prehistoric-rush-replay-parity-smoke-kit
```

## Deferred extraction kits

```txt
prehistoric-rush-three-render-host-kit
prehistoric-rush-terrain-stream-kit
prehistoric-rush-terrain-sampler-kit
prehistoric-rush-ground-collider-kit
prehistoric-rush-prop-scatter-kit
prehistoric-rush-pickup-scatter-kit
prehistoric-rush-hazard-descriptor-kit
prehistoric-rush-raptor-rig-kit
prehistoric-rush-raptor-pose-kit
prehistoric-rush-camera-follow-kit
prehistoric-rush-hud-diagnostics-kit
```

## Key blockers

```txt
runtime-manifest-disconnect:
  manifests define intent, but src/runtime-terrain-v6.mjs is still runtime source of truth.

runtime-tuning-drift:
  runner-tuning.json uses baseForwardSpeed 13.5, maxForwardSpeed 24, boostForwardSpeed 29, turnRate 2.45, chunkSize 44, chunkSegments 20, and string seed.
  runtime-terrain-v6.mjs uses speed 15, maxSpeed 25, boostSpeed 31, turnRate 2.55, chunkSize 46, segments 24, and numeric seed 238991.

scene-result-name-mismatch:
  game-scenes.json uses canonical run-over, but scenes/game.json still declares nextOnLoss as fail.

direct-scene-mutation:
  start, hazard, and win paths mutate app.scene directly.

action-frame-gap:
  input is live boolean state, not accepted/rejected ActionFrame records.

runner-step-gap:
  movement and jump physics mutate raw runner state without RunnerStepResult metadata.

runner-event-gap:
  start, jump, boost, steering, terrain rebuild, pickup, hazard, and win are not emitted as serializable runner events.

contact-event-gap:
  hazard, pickup, and goal checks mutate state directly without ContactEvent or ContactResult records.

host-surface-gap:
  PrehistoricRushHost only exposes app and getState, not stable diagnostics, dispatch, subscribe, snapshots, replay, or smoke helpers.
```

## Recommended next slice

```txt
PrehistoricRush Runtime Authority + Contact Replay Harness Cutover
```

Build order:

```txt
preserve index.html and src/runtime.mjs behavior
-> keep src/runtime-terrain-v6.mjs visually playable
-> add prehistoric-rush-manifest-loader-kit
-> load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> add prehistoric-rush-runtime-tuning-adapter-kit
-> make runner-tuning.json source-authoritative for motion, terrain, camera, streaming, and rule fields
-> keep inline tuning fallback-only
-> add prehistoric-rush-manifest-drift-diagnostics-kit
-> emit loaded/fallback/drift diagnostics through GameHost
-> add prehistoric-rush-scene-id-catalog-kit
-> assert menu, game, run-over, and win as canonical ids
-> add prehistoric-rush-scene-result-alias-kit
-> keep fail as compatibility alias only
-> add prehistoric-rush-scene-authority-reducer-kit
-> replace direct app.scene mutation with SceneDispatchResult records
-> add prehistoric-rush-action-frame-contract-kit
-> normalize button, Enter, Space, left, right, boost, retry, menu, run-again, and fixture actions
-> add prehistoric-rush-action-acceptance-matrix-kit
-> return rejected ActionFrame records for invalid scene/action pairs
-> add prehistoric-rush-runner-step-result-kit
-> return per-tick movement delta, speed/yaw/jump changes, consumed actions, rejected actions, and diagnostics
-> add prehistoric-rush-runner-event-envelope-kit
-> emit start, jump, boost, steer, chunk_rebuild, pickup_contact, hazard_contact, win_threshold, and scene_request events
-> add prehistoric-rush-contact-event-contract-kit
-> convert hazard hit, shard pickup, and distance goal into ContactEvent records
-> add prehistoric-rush-contact-result-snapshot-kit
-> snapshot lastContactEvent, impactEvents, pickupEvents, goalEvents, and pendingSceneRequest
-> expand PrehistoricRushHost into prehistoric-rush-gamehost-kit
-> expose getDiagnostics, getSceneSnapshot, getInputSnapshot, getRunnerSnapshot, getContactSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and runSmoke
-> add DOM-free fixture scripts for tuning parity, scene alias, start, space-start, jump, rejected-jump, hazard-run-over, pickup, win, retry, menu, runner-step, runner-event replay, contact replay, and final replay parity
-> defer terrain/render/raptor/Rapier extraction until runtime authority, contact replay, and smoke parity pass
```

## Acceptance criteria

```txt
- Manifests load before runtime setup.
- Runtime tuning either matches runner-tuning.json or reports explicit fallback/drift.
- fail never becomes canonical; it only aliases to run-over.
- Every scene change returns a SceneDispatchResult.
- Every player input becomes an ActionFrame.
- Every invalid input has a stable rejection reason.
- Every game tick returns or records RunnerStepResult metadata.
- Hazard, pickup, and win conditions emit ContactEvent records.
- GameHost exposes diagnostics and snapshots without requiring DOM inspection.
- Fixture replay can prove a known final scene, distance, shard count, and contact journal count.
```

## Validation

No runtime source code changed in this documentation pass.

No local build or smoke test was executed. The repo still has no package-level test harness, so the next source pass should add DOM-free fixture smoke before wider runtime extraction.
