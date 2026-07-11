# Current Audit: PrehistoricRush

**Updated:** `2026-07-10T21-00-16-04-00`

## Summary

`PrehistoricRush` is a static browser 3D infinite runner. The active route is `index.html -> src/runtime.mjs -> src/game.js`. The runtime directly composes six repo-local domain kits, imports Three.js and Rapier, creates a streamed terrain window with instanced forest and grass, and advances gameplay and rendering through one `requestAnimationFrame` loop.

The immediate implementation gate remains instance-pool capacity authority. This audit adds a separate source-contract finding: the Pages artifact includes multiple configuration, scene, and composition manifests that the current runtime does not consume.

## Repository-selection comparison

```txt
PrehistoricRush     selected / prior 2026-07-10T19-30-36-04-00
AetherVale          tracked  / 2026-07-10T19-38-41-04-00
IntoTheMeadow       tracked  / 2026-07-10T19-48-39-04-00
TheOpenAbove        tracked  / 2026-07-10T19-58-34-04-00
HorrorCorridor      tracked  / 2026-07-10T20-08-46-04-00
PhantomCommand      tracked  / 2026-07-10T20-19-35-04-00
ZombieOrchard       tracked  / 2026-07-10T20-30-23-04-00
TheUnmappedHouse    tracked  / 2026-07-10T20-38-24-04-00
MyCozyIsland        tracked  / 2026-07-10T20-48-55-04-00
TheCavalryOfRome    excluded by rule
```

## Interaction loop

```txt
boot
  -> load src/game.js
  -> construct route, surface, forest, grass, wind, and procedural-dino services
  -> load Three.js, Rapier, and rapier-physics-domain-kit

mount
  -> create DOM shell
  -> create Three.js scene, camera, renderer, lights, terrain, instance pools, and raptor
  -> create optional Rapier bridge
  -> register button, keyboard, blur, and resize listeners
  -> populate the initial terrain window

run
  -> derive turn, boost, jump, route region, and surface resistance
  -> update speed, yaw, position, travel distance, terrain, and population
  -> update physics actor and contacts
  -> resolve collisions, pickups, run-over, and win
  -> apply raptor pose, camera, wind, HUD, and render submission

restart
  -> Start / Retry / Run Again reset only x, z, distance, routeIndex, and yaw
  -> the existing RAF and listeners continue

readback
  -> PrehistoricRushHost.app exposes mutable live runtime objects
  -> PrehistoricRushHost.getState returns aggregate runner and domain snapshots
```

## Domains in use

### Runtime and platform

```txt
static-browser-shell
runtime-entry
external-module-resolution
three-runtime
rapier-runtime
rapier-physics-adapter
static-pages-deploy
```

### Route, terrain, and traversal

```txt
route-control-point-generation
route-spline-sampling
nearest-route-query
route-region-classification
terrain-height-field
terrain-chunk-window
surface-traversal-resistance
```

### Population and rendering

```txt
forest-archetype-catalog
forest-population
tree-instance-pools
root-instance-pool
grass-layer-descriptors
grass-route-exclusion
grass-distance-lod
grass-wind
rock-population
shard-population
shard-collection
camera-projection
hud-projection
render-submission
shadow-frustum
```

### Character and gameplay

```txt
procedural-dino-topology
procedural-dino-skeleton
procedural-dino-skinning
procedural-dino-pose
keyboard-input
button-input
scene-state
session-start
restart-lifecycle
runner-motion
runner-yaw
runner-boost
runner-jump-gravity
contact-resolution
travel-distance-score
goal-resolution
best-distance-storage
```

### Authority, observation, and documentation

```txt
instance-pool-capacity
population-admission
population-generation
runtime-source-authority
deployed-manifest-authority
scene-transition-authority
tuning-authority
kit-composition-authority
host-state-projection
fixture-validation
central-ledger-sync
```

## Active repo-local kits and services

```txt
route-field-domain-kit
  deterministic control-point generation
  Catmull-Rom route samples
  nearest-route lookup
  path / edge / verge / forest classification
  control-point extension
  snapshot

surface-traversal-domain-kit
  region multiplier policy
  smoothed resistance transition
  current state
  snapshot

forest-archetype-domain-kit
  five tree archetype descriptors
  indexed archetype lookup
  snapshot

grass-patch-domain-kit
  carpet / main / verge descriptors
  route-distance scale policy
  snapshot

grass-wind-domain-kit
  deterministic gust update
  wind state
  snapshot

procedural-dino-body-domain-kit
  body profile and topology descriptor
  single skinned surface construction
  bone hierarchy
  skin indices and weights
  procedural pose application
  descriptor and snapshot
```

## Live external services

```txt
three@0.179.1
  scene graph, geometry, materials, instancing, skinning, camera, lighting, fog, rendering

@dimforge/rapier3d-compat@0.15.0
  physics runtime initialization

rapier-physics-domain-kit from NexusRealtime-ProtoKits@main
  world bridge, configuration, kinematic actor, fixed colliders, transform update, stepping, contacts
```

## Present but inactive repo-local kits

```txt
event-bus-kit
domain-host-kit
tick-scheduler-kit
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle-kit
camera-domain-kit
hud-domain-kit
```

## Deployed files and actual consumption

| File | Deployed | Read by current route | Current role |
|---|---:|---:|---|
| `runner-tuning.json` | yes | no | stale tuning declaration |
| `game-scenes.json` | yes | no | stale scene/NexusEngine declaration |
| `kit-composition.json` | yes | no | stale composition and cutover declaration |
| `kit-cutover-inventory.json` | yes | no | planning inventory only |
| `flock-generation.json` | yes | no | legacy generation declaration |
| `scenes/*.json` | yes | no | legacy scene descriptors |
| `src/game.js` constants | yes | yes | actual runtime tuning and scene authority |

## Source-contract mismatches

```txt
runtime base/max/boost speed:   16 / 26 / 31
runner-tuning declaration:     13.5 / 24 / 29

runtime chunk size/segments:    56 / 30
runner-tuning declaration:     44 / 20

runtime route composition:      direct local imports
kit-composition declaration:   NexusEngine core kit stack

runtime scene transitions:      inline string assignments
game-scenes declaration:       transition map and scene files

runtime NexusEngine import:     none
deployed manifest claim:       NexusEngine @main and core kits
```

## Main findings

1. Instance-pool capacity remains the first runtime correctness gate.
2. The deployed artifact contains authoritative-looking files that are not runtime inputs.
3. `src/game.js` is the actual tuning, scene, composition, and source authority.
4. The deployed JSON values materially disagree with the active runtime constants.
5. Agents or maintainers can edit `runner-tuning.json`, `game-scenes.json`, or `kit-composition.json` and receive a successful deployment with no gameplay effect.
6. The Pages workflow verifies file presence only through copy success; it does not prove runtime consumption or source parity.
7. `PrehistoricRushHost.getState()` exposes no source manifest, resolved revision, configuration fingerprint, or consumed-file ledger.
8. The fixed directional-light shadow camera remains centered near the initial world origin, so long-distance runner shadow coverage is not owned by a camera/player-relative service.
9. Travel distance, route progress, run outcome, best-distance persistence, and restart state remain separate follow-on correctness gaps.

## Priority order

```txt
P0  instance-pool capacity authority and deterministic population fixture
P1  runtime source contract reconciliation and deployed artifact fixture
P2  restart/result/persistence transaction
P3  immutable external dependency admission
P4  mount/dispose/remount lifecycle
P5  camera-relative lighting and shadow ownership
```
