# Project breakdown: PrehistoricRush

Timestamp: `2026-07-10T16-28-47-04-00`

Repository: `LuminaryLabs-Publish/PrehistoricRush`

Branch: `main`

## Selection result

The complete accessible `LuminaryLabs-Publish` inventory contained ten repositories. `TheCavalryOfRome` was excluded. All nine eligible repositories were already represented in `LuminaryLabs-Dev/LuminaryLabs/repo-ledger/LuminaryLabs-Publish/` and had root `.agent` evidence.

At selection time, `PrehistoricRush` had the oldest eligible central update timestamp:

```txt
PrehistoricRush     selected / prior 2026-07-10T14-59-00-04-00
AetherVale          tracked / 2026-07-10T15-09-26-04-00
IntoTheMeadow       tracked / 2026-07-10T15-18-29-04-00
HorrorCorridor      tracked / 2026-07-10T15-31-03-04-00
PhantomCommand      tracked / 2026-07-10T15-38-40-04-00
ZombieOrchard       tracked / 2026-07-10T15-48-18-04-00
TheUnmappedHouse    tracked / 2026-07-10T15-58-47-04-00
MyCozyIsland        tracked / 2026-07-10T16-08-56-04-00
TheOpenAbove        tracked / 2026-07-10T16-20-09-04-00
TheCavalryOfRome    excluded by rule
```

Only `PrehistoricRush` was changed.

## Product read

A static browser infinite runner with:

```txt
free-yaw raptor movement
jump and boost input
streamed procedural terrain
instanced trees, rocks, and shards
Rapier-backed or fallback contact checks
menu, game, run-over, and win scene labels
procedural raptor rendering
camera and HUD presentation
best-distance persistence
GitHub Pages static deployment
```

## Interaction loop

```txt
index.html
  -> runtime.mjs
  -> game.js composition bootstrap
  -> install repo-local domain kits
  -> import runtime-terrain-v6
  -> build live runner
  -> input mutates flags or scene
  -> primary RAF advances simulation and renders
  -> secondary RAF rewrites presentation and renders again
  -> host exposes aggregate mutable state
```

## Domain inventory

```txt
browser shell
runtime entry
composition entry
event bus
domain host
tick scheduler
dino form
dino pose
dino material
camera preset
HUD model
Three.js adapter
Rapier adapter
external physics kit
scene lifecycle
keyboard/button input
runner movement
turn/yaw
jump/gravity
terrain streaming
height sampling
spawn population
contact resolution
pickup collection
score and target distance
best-distance storage
raptor render adapter
primary presentation
secondary presentation
render submission
host projection
source/manifest contract
deployment
central ledger
```

## Kit inventory

Implemented repo-local:

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

External live:

```txt
rapier-physics-domain-kit
```

Runtime-implied:

```txt
static-shell-kit
runtime-entry-kit
legacy-runner-runtime-kit
runner-input-kit
runner-motion-kit
runner-jump-kit
terrain-stream-kit
spawn-population-kit
contact-resolution-kit
pickup-collection-kit
scene-dispatch-kit
restart-lifecycle-kit
best-distance-storage-kit
raptor-render-adapter-kit
primary-presentation-kit
secondary-presentation-kit
render-submission-kit
host-state-projection-kit
runtime-source-contract-kit
```

## Services offered

```txt
event registration and emission
domain installation, lookup, tick fan-out, and snapshots
RAF scheduling
dino form, pose, and material descriptors
camera preset descriptors
HUD progress/model projection
Rapier actor/collider/contact bridge
terrain sampling and chunk reuse
spawn population and instance updates
movement/jump/turn mutation
contact and pickup resolution
scene mutation
best-distance persistence
raptor/camera/HUD projection
WebGL render submission
aggregate host readback
```

## Main finding

The scheduler and domain host are descriptive rather than authoritative. The scheduler is never started, while two unrelated RAF loops mutate overlapping presentation state and submit two renders.

The route also lacks a real restart transaction. Retry and Run Again only switch the scene string back to `game`; they do not reset the runner session, so collision and win conditions can immediately re-trigger.

## Next safe ledge

```txt
PrehistoricRush Single Frame Authority + Restart Transaction Fixture Gate
```

## Validation

Documentation only. No runtime, dependency, route, or workflow source changed.
