# Deploy Audit: Motion / Presentation Fixture Gate

**Timestamp:** `2026-07-12T12-01-04-04-00`

## Summary

The repository test script now runs the outcome-policy and player-articulation adapter tests. Neither test imports the pinned browser runtime, executes the composed Core Motion/Core Physics domains, advances a gameplay tick, solves an articulated pose, applies that pose to a Three mesh or validates the deployed Pages frame.

## Plan ledger

**Goal:** prevent deployment from claiming articulated-motion integration until source identity, runtime composition, result consumption and visible-frame parity are executable.

- [x] Review current package test surface.
- [x] Review current articulation test scope.
- [x] Review browser import pins and runtime composition.
- [x] Define source, Node, browser and Pages proof layers.
- [ ] Implement and run the fixture matrix.

## Existing proof

```txt
npm test
  -> prehistoric-rush-resolution-policy.mjs
  -> player-articulation.mjs
```

The articulation test proves:

```txt
rig adapter creates hind-leg chains
legacy Euler rotation converts to quaternion pose
zero Euler converts to identity quaternion
rig/pose values are structured-cloneable
```

It does not prove:

```txt
pinned Core Motion module imports
createCoreMotionDomain composition
engine.coreMotion root API availability
motion intent/frame commit during game tick
physics request linkage
articulated solve consumption
Three bone application
creator/game parity
first visible frame
Pages behavior
```

## Required fixture layers

### Layer 1: source and pin admission

```txt
runtime-versions pin equals game import map
runtime-versions pin equals creator import map
pinned Nexus Engine exports createCoreMotionDomain and createCorePhysicsDomain
pinned root engine.coreMotion exposes built-in and extension APIs
```

### Layer 2: headless domain composition

```txt
create game with exact pinned module graph
assert core-motion and articulated-motion installed
assert core-physics and articulated-dynamics installed
assert raptor rig registered exactly once
advance deterministic tick
assert intent, motion frame and physics request identities correlate
```

### Layer 3: pose-selection fixtures

```txt
legacy policy returns typed fallback result
articulated zero-target solve returns selected articulated result
stale run/profile pose is rejected
creator and game profile/skeleton fingerprints match
```

### Layer 4: renderer fixture

```txt
construct Three creature mesh
apply selected pose result
verify expected bone transforms and applied count
render first frame
publish renderer receipt with pose result ID
```

### Layer 5: browser and Pages smoke

```txt
load game.html and charactercreator.html
capture pinned source identities
advance input and gameplay frames
read public motion-presentation result
verify visible-frame acknowledgement
repeat on deployed Pages URL
```

## Required failure cases

```txt
root Core Motion alias missing
articulated-motion domain missing
rig registration failure
physics request not linked to motion frame
renderer applies legacy pose while policy requires articulated pose
creator/game profile mismatch
stale pose after reset
Pages CDN pin mismatch
```

## Release gate

Do not mark articulated motion as product-consumed until all of these are true:

```txt
source pin admitted
headless composed tick passed
physics linkage passed
articulated result selected
renderer receipt committed
creator/game parity passed
browser first-visible-frame passed
Pages smoke passed
```

## Validation boundary

No command or workflow was executed during this documentation pass.