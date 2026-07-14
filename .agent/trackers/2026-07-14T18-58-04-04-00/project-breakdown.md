# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-14T18-58-04-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Repository head before audit:** `436aaad739f521f036f14f7f5dd3ab1ff51ecee2`  
**Runtime source revision retained:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `route-progress-goal-eligibility-authority-audited`

## Summary

PrehistoricRush has a deterministic authored route and continuously computes `routeIndex`, normalized `routeProgress`, lateral route distance, and surface region. Victory does not use any of those course-progression values. Every simulation step adds the magnitude of player displacement to `RunState.distance`, and the goal proposal becomes true when that cumulative movement reaches `3600`.

The player can therefore advance the victory counter while reversing, circling, repeatedly traversing the same area, or moving through the forest away from the authored route. The HUD presents the same cumulative movement as `distance / goal`, so presentation reinforces a course-progress claim that the runtime has not admitted.

## Plan ledger

**Goal:** make victory depend on one versioned authored course checkpoint, monotonic accepted route progress, and a matching visible finish result rather than unrestricted movement accumulation.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and ten root `.agent` states.
- [x] Compare every eligible repository head with its documented head.
- [x] Confirm no repository is new, ledger-missing, root-agent-missing, or runtime-ahead.
- [x] Select only PrehistoricRush by the oldest synchronized central timestamp.
- [x] Inspect route generation, movement integration, run-state proposals, goal resolution, HUD projection, tests, and public readback.
- [x] Preserve the complete 59-surface kit and service inventory.
- [x] Add this timestamped tracker and focused audit family.
- [x] Change no runtime, gameplay, renderer, package, test, workflow, or deployment source.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement course-progress admission and executable browser fixtures later.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
runtime-ahead: 0

last documented timestamps:
  PrehistoricRush   2026-07-14T14-01-07-04-00
  TheLongHaul       2026-07-14T14-39-54-04-00
  MyCozyIsland      2026-07-14T15-01-54-04-00
  IntoTheMeadow     2026-07-14T15-38-28-04-00
  HorrorCorridor    2026-07-14T16-00-05-04-00
  ZombieOrchard     2026-07-14T16-41-33-04-00
  TheUnmappedHouse  2026-07-14T17-00-55-04-00
  TheOpenAbove      2026-07-14T17-39-01-04-00
  AetherVale        2026-07-14T17-58-14-04-00
  PhantomCommand    2026-07-14T18-41-11-04-00

selected: LuminaryLabs-Publish/PrehistoricRush
rule: oldest synchronized eligible repository
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
menu or creator
  -> choose or edit the procedural player character
  -> persist a normalized profile
  -> navigate to game

game bootstrap
  -> load pinned Nexus Engine, Kits, ProtoKits, Three.js and Rapier
  -> compose Core and PrehistoricRush domains
  -> install the authored route, player, physics, streaming, camera and renderer
  -> initialize patch Worker or synchronous fallback
  -> start run N and prime the center patch

active simulation step
  -> project keyboard state into steer, boost and jump
  -> integrate yaw, speed, jump and world displacement
  -> query nearest authored route sample
  -> update routeIndex, routeProgress, region and surface multiplier
  -> add hypot(dx, dz) to cumulative RunState.distance
  -> submit movement, pickup and goal proposals
  -> set goal reached when cumulative distance >= 3600
  -> observe Rapier and fallback collisions
  -> resolve collision, pickup and goal precedence
  -> commit RunState and optional terminal transition

presentation
  -> stream terrain, trees, grass, shards and colliders around the player
  -> render the current state and procedural raptor
  -> show cumulative movement as `distance / 3600`
  -> show Retry or Run Again after terminal state

current completion bypass
  -> reverse, circle or leave the route
  -> cumulative movement continues increasing
  -> routeProgress may remain flat or move backward
  -> goal proposal still becomes true at 3600 movement units
  -> resolution accepts win without an authored finish checkpoint
```

## Domains in use

```txt
browser document, navigation, keyboard, blur, resize and RAF lifecycle
runtime provider import, compatibility and composition
Core Input, Spatial, Scene, Creature, Character, Player and Physics
Core Simulation, Motion, Camera, Animation, Graphics, Skybox and UI
Core Diagnostics, Composition and Presentation
articulated dynamics, articulated motion, presentation output, UI scale and camera framing
product run, movement, route, surface, score, outcome, pose and terrain IK
course manifest, route samples, nearest-point lookup, progress and finish eligibility
profile schema, persistence, creator preview and character composition
seed, procedural creature, instance batching, patch streaming and camera follow
Rapier provider, Worker protocol and synchronous generation fallback
Three.js terrain, vegetation, pickup, player, camera, HUD and terminal presentation
validation, static hosting, build, Pages and central audit tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, references, registry, snapshot and reset
core-character-kit: character registry, bindings, status, snapshot and reset
core-player-kit: player registry, possession, control and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution and committed frames
core-motion-kit: motion intents, requests and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral graphics descriptors
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation composition graph and snapshots
core-presentation-output-kit: surface input, viewport policy, render resolution and safe area
core-ui-scale-kit: reference resolution, viewport scale and scale policy
core-camera-framing-kit: subject framing, projection fit, damping and clipping policy
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic world seeds and named random streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision, descriptors and legacy pose
instanced-render-batch-kit: batch registry, stable ranges, cell membership, flush and diagnostics
seeded-world-patch-controller-kit: focus, desired sets, generation queue, cache, adoption, release and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page and Worker kits: 16

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose and ground IK
prehistoric-rush-pause-menu-domain-kit: pause state, commands, events and snapshot
prehistoric-rush-resolution-policy: movement, collision, pickup, goal and transition resolution
player-character-composition-kit: body, rig, creature, character and possession
player-articulation-adapter-kit: legacy-pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: localStorage, revision, BroadcastChannel and storage events
menu-page-kit: title, selected-profile projection and navigation
character-creator-page-kit: controls, draft state, reset, external updates and preview startup
character-preview-transition-kit: morph, crossfade, pose and resource lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application and disposal
game-page-entry-kit: dependency preflight, runtime entry, HUD cleanup and pause host
player-raptor-preset-kit: authored player creature content
drunk-route-generator: deterministic control points, samples, nearest query, classification and progress
prehistoric-patch-generator: terrain, trees, grass, pickups and colliders
prehistoric-patch-worker: Worker initialization, request and result protocol
```

### External and host adapters: 9

```txt
three-runtime-module: scene, resource and render submission primitives
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling and disposal
three-patch-stream-adapter-kit: patch presentation, colliders, pickups, height, camera and ownership
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: debounced profile writes
browser-input-adapter: keyboard, blur, jump, boost, steer and restart projection
creature-camera-render-host-adapters: pose, camera, HUD and diagnostics projection
```

### Proof kits: 7

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
```

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        7
total implemented surfaces:       59
planned route authority surfaces: 22
```

## Source-backed findings

```txt
authored deterministic route: present
nearest route sample: present
route index: present
normalized route progress: present
lateral route distance and surface region: present
cumulative movement distance: present
goal proposal and collision precedence: present
terminal win transition: present
HUD progress bar: present

versioned CourseManifest: absent
stable course-goal identity: absent
goal position or route-distance checkpoint: absent
monotonic accepted route progress: absent
forward-direction validation: absent
maximum lateral-distance eligibility: absent
checkpoint sequence or anti-loop evidence: absent
goal predicate receipt: absent
CourseCompletionResult: absent
route-progress versus HUD-frame correlation: absent
first eligible finish-frame acknowledgement: absent
reverse, circle and off-route fixtures: absent
```

## Main architecture finding

`runSystem()` always increments `next.distance` by `Math.hypot(dx, dz)`. The same step computes `routeIndex` and `routeProgress`, but the goal proposal ignores them and uses only `next.distance >= goalDistance`.

`drunk-route-generator` exposes a normalized sample progress and the player’s distance from the route. Neither is monotonic-authoritative: nearest progress can move backward, and no accepted checkpoint history exists. The resolution policy trusts the boolean goal proposal and does not validate course identity, progress, direction, lateral distance, or a finish volume.

The HUD then renders cumulative movement as the course progress bar. A visually complete run can therefore be admitted without proof that the authored course was actually traversed.

## Required authority

```txt
prehistoric-rush-route-progress-goal-eligibility-authority-domain
```

```txt
CourseProgressCommand
  -> bind RunId, StepId, CourseManifestRevision and prior CourseProgressRevision
  -> resolve the current authored route sample and stable checkpoint identity
  -> validate direction, lateral eligibility and checkpoint ordering
  -> distinguish total movement from accepted forward course distance
  -> reject backward, repeated, skipped, stale and off-course progress
  -> publish CourseProgressResult and immutable CourseProgressRevision

CourseGoalEligibilityCommand
  -> bind the accepted CourseProgressRevision and course-goal identity
  -> require the authored terminal checkpoint or finish volume
  -> require current route, direction, lateral and collision predicates
  -> reject movement-only, looped, reversed, off-route and stale candidates
  -> publish CourseCompletionResult
  -> project matching HUD and terminal state
  -> publish FirstEligibleFinishFrameAck
```

## Validation boundary

This is a documentation-only audit. Source inspection verified cumulative movement, route-progress calculation, the movement-only goal predicate, resolution-policy trust, HUD projection, and current test boundaries. No runtime, gameplay, renderer, package, test, workflow, or deployment source changed.

`npm test`, reverse-route fixtures, circling fixtures, off-route goal fixtures, browser visible-frame checks, built-output inspection, and GitHub Pages proof were not executed.